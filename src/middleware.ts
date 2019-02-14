import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";

//verifyToken
export let verifyToken = (req: Request, res: Response, next: any) => {
    const bearerHeader : string = req.headers['authorization'];
    if (bearerHeader) {
        const bearer : string[] = bearerHeader.split(' ');
        const bearerToken : string = bearer[1];
        //console.log(req.token);
        req['token'] = bearerToken;

        jwt.verify(req.token, 'secretkey', (err, authData) => {
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