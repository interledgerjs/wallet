import { hydra } from '../services/hydra'
import { URL } from 'url'
import { Request, Response } from 'express'
import { retrieveAccountByOwner } from '../models'
import { agreements } from '../services/agreement'

export async function get (req: Request, res: Response) {

  // The challenge is used to fetch information about the login request from ORY Hydra.
  const challenge = req.query.consent_challenge

  const consentRequest = await hydra.getConsentRequest(challenge).catch(error => {
    console.error(error, 'error in login request')
    throw error
  })

  if (consentRequest.skip) {
    const acceptConsentRequest = await hydra.acceptConsentRequest(challenge, {
      // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
      // are requested accidentally.
      grant_scope: consentRequest.requested_scope,

      // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
      grant_access_token_audience: consentRequest.requested_access_token_audience,

      // The session allows us to set session data for id and access tokens
      session: {
        // This data will be available when introspecting the token. Try to avoid sensitive information here,
        // unless you limit who can introspect tokens.
        // access_token: { foo: 'bar' },

        // This data will be available in the ID token.
        // id_token: { baz: 'bar' },
      }
    })

    res.json({ redirect_to: acceptConsentRequest.redirect_to })
  }

  const originalUrlParams = new URL(consentRequest.request_url).searchParams

  // Get Agreement
  const agreement = await agreements.getAgreementRequest(originalUrlParams.get('agreementId')).catch(error => {
    console.error('Could not insert agreement into db.')
    throw error
  })
  const accounts = await retrieveAccountByOwner(consentRequest.subject)

  res.json({
    requested_scope: consentRequest.requested_scope,
    user: consentRequest.subject,
    accounts,
    client: consentRequest.client,
    agreement
  })
}

export async function post (req: Request, res: Response) {
  // The challenge is now a hidden input field, so let's take it from the request body instead
  const { accept, challenge, accountId } = req.body

  if (!accountId) {
    console.log('No accountId found in body')
    throw new Error('No accountId in body')
  }

  // Let's see if the user decided to accept or reject the consent request..
  if (!accept) {
    const hydraRejectConsentRequest = await hydra.rejectConsentRequest(challenge, {
      error: 'access_denied',
      error_description: 'The resource owner denied the request'
    }).catch(error => {
      console.log('error rejecting hydra consent')
      throw error
    })

    return res.json({ redirect_to: hydraRejectConsentRequest.redirect_to })
  }

  const getConsentRequest = await hydra.getConsentRequest(challenge).catch(error => {
    console.log('error getting hydra consent')
    throw error
  })

  // Get Agreement
  const originalUrlParams = new URL(getConsentRequest.request_url).searchParams

  const agreement = await agreements.getAgreementRequest(originalUrlParams.get('agreementId')).catch(error => {
    console.error('Could not insert agreement into db.')
    throw error
  })

  let grantScope = getConsentRequest.requested_scope

  if (!Array.isArray(grantScope)) {
    grantScope = [grantScope]
  }

  const acceptConsentRequest = await hydra.acceptConsentRequest(challenge, {
    grant_scope: grantScope,
    grant_access_token_audience: getConsentRequest.requested_access_token_audience,
    remember: false,
    remember_for: 1,
    session: {
      // This data will be available when introspecting the token. Try to avoid sensitive information here,
      // unless you limit who can introspect tokens.
      access_token: {
        interledger: {
          agreementId: agreement.id
        }
      },

      // This data will be available in the ID token.
      id_token: {
        interledger: {
          'agreement': agreement
        }
      }
    }
  }).catch(error => {
    console.log('error accepting hydra consent')
    throw error
  })

  res.json({ redirect_to: acceptConsentRequest.redirect_to })
}
