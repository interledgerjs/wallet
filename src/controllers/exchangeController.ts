import { Request, Response } from 'express'
import axios from 'axios'

// get /initialise builds database and tables
export let getRates = (req: Request, res: Response) => {
  axios.get('http://data.fixer.io/api/latest?access_key=076319f31a8427aa91d08a789026f192').then((response) => {
    console.log(response.data)
    res.send(response.data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(500)
  })
}
