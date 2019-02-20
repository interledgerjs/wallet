declare namespace Express {
    export interface Request {
       token?: string,
       authData?: string | object
    }
 }