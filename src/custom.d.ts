declare namespace Express {
    export interface Request {
       token?: string,
       authData?: any
    }
 }