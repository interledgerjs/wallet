import { Request, Response, Next } from "express";

//verifyToken
export let verifyToken = (req: Request, res: Response, next: Next) => {
    const bearerHeader : string = req.headers['authorization'];
    if (bearerHeader) {
        const bearer : string[] = bearerHeader.split(' ');
        const bearerToken : string = bearer[1];
        //console.log(req.token);
        req['token'] = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
}