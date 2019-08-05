import axios from 'axios'

const agreementServiceURL = process.env.AGREEMENTS_SERVICE_URL || 'http://localhost:9001'

type Flow = 'agreements'

function get (flow: Flow, id: string) {
  const url = new URL('/' + flow + '/' + id , agreementServiceURL)
  return axios.get(url.toString(), {
    timeout: 5000
  }).then(res => {
    return res.data
  })
}

export const agreements = {
  getAgreementRequest: function (id: string) {
    return get('agreements', id)
  }
}
