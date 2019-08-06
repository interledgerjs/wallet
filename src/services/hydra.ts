import axios from 'axios'
const querystring = require('querystring')

const hydraUrl = process.env.HYDRA_ADMIN_URL || 'http://localhost:9001'
let mockTlsTermination = {}
const MOCK_TLS_TERMINATION = process.env.MOCK_TLS_TERMINATION || 'true'
if (MOCK_TLS_TERMINATION === 'true') {
  mockTlsTermination = {
    'X-Forwarded-Proto': 'https'
  }
}

type Flow = 'login' | 'consent' | 'logout'
type Action = 'accept' | 'reject'

// A little helper that takes type (can be "login" or "consent") and a challenge and returns the response from ORY Hydra.
function get (flow: Flow, challenge: string) {
  const url = new URL('/oauth2/auth/requests/' + flow, hydraUrl)
  url.search = querystring.stringify({ [flow + '_challenge']: challenge })
  return axios.get(url.toString(), {
    headers: mockTlsTermination,
    timeout: 5000
  }).then(res => {
    return res.data
  })
}

// A little helper that takes type (can be "login" or "consent"), the action (can be "accept" or "reject") and a challenge and returns the response from ORY Hydra.
function put (flow: Flow, action: Action, challenge: string, body: any) {
  const url = new URL('/oauth2/auth/requests/' + flow + '/' + action, hydraUrl)
  url.search = querystring.stringify({ [flow + '_challenge']: challenge })
  const headers = Object.assign(mockTlsTermination, { 'Content-Type': 'application/json' })
  return axios.put(url.toString(), body, {
    headers,
    timeout: 5000
  }).then(res => res.data)
}

export const hydra = {
  // Fetches information on a login request.
  getLoginRequest: function (challenge: string) {
    return get('login', challenge)
  },
  // Accepts a login request.
  acceptLoginRequest: function (challenge: string, body: any) {
    return put('login', 'accept', challenge, body)
  },
  // Rejects a login request.
  rejectLoginRequest: function (challenge: string, body: any) {
    return put('login', 'reject', challenge, body)
  },
  // Fetches information on a consent request.
  getConsentRequest: function (challenge: string) {
    return get('consent', challenge)
  },
  // Accepts a consent request.
  acceptConsentRequest: function (challenge: string, body: any) {
    return put('consent', 'accept', challenge, body)
  },
  // Rejects a consent request.
  rejectConsentRequest: function (challenge: string, body: any) {
    return put('consent', 'reject', challenge, body)
  },
  // Fetches information on a logout request.
  getLogoutRequest: function (challenge: string) {
    return get('logout', challenge)
  },
  // Accepts a logout request.
  acceptLogoutRequest: function (challenge: string) {
    return put('logout', 'accept', challenge, {})
  },
  // Reject a logout request.
  rejectLogoutRequest: function (challenge: string) {
    return put('logout', 'reject', challenge, {})
  }
}
