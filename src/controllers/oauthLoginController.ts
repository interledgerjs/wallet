import { hydra } from '../services/hydra'
import { Request, Response } from 'express'
import { retrieveUserByUserName } from '../models'
import { compareHash } from '../services'

export async function get (req: Request, res: Response) {

  // The challenge is used to fetch information about the login request from ORY Hydra.
  const challenge = req.query.login_challenge

  const loginRequest = await hydra.getLoginRequest(challenge).catch(error => {
    console.error(error, 'error in login request')
    throw error
  })

  if (loginRequest.skip) {
    const acceptLogin = await hydra.acceptLoginRequest(challenge, { subject: loginRequest.subject }).catch(error => {
      console.error(error, 'error in accept login request')
      throw error
    })
    res.json({ redirect_to: acceptLogin.redirect_to })
    return
  }

  res.json({ redirect_to: '' })
}

export async function post (req: Request, res: Response) {
  const { userName, password, login_challenge } = req.body
  try {
    const user = await retrieveUserByUserName(userName)
    if (!user) {
      return res.status(400)
    }
    const result = await compareHash(user, password)
    if (!result) {
      return res.status(400)
    }
    const acceptLogin = await hydra.acceptLoginRequest(login_challenge, {
      subject: user.id.toString(),
      remember: false
    })

    return res.json({ redirect_to: acceptLogin.redirect_to })
  } catch (error) {
    console.log('error', error)
    console.error('Failed to log in to the wallet', { error: error.message })
    return res.status(400)
  }
}
