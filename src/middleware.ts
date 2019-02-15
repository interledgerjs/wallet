import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";

//verifyToken
export let verifyToken = (req: Request, res: Response, next: any) => {
    const bearerHeader : string = req.headers['authorization'];
    if (bearerHeader) {
        // pulls token out of header
        const bearer : string[] = bearerHeader.split(' ');
        const bearerToken : string = bearer[1];
        req['token'] = bearerToken;
        
        //TODO Option that forces check for HS256 encryption
        // verifies token and returns authData
        jwt.verify(req.token, 'secretkey', (err: Error, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //console.log('Token Verified'); 
                next();
            }
        });

    }
    else {
        res.sendStatus(403);
    }
}