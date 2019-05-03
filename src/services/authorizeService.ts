import { Request, Response } from 'express'
/* Request is imported from express in a non controller file to access the authData object*/

export function isAuthorized (authData: any, allowedId: number) {
  if (authData.role === 'admin' || authData.id === allowedId) {
    return(true)
  } else {
    return(false)
  }
}
