import { Request, Response } from "express";
//import * as Joi from "joi";
import * as jwt from "jsonwebtoken";

export let genToken = (req: Request, res : Response)=> {
    jwt.sign({foo: 'bar'}, "secret", { expiresIn: '1h' }, (err, token) => {
        if (err) {
            res.send(err);
        }
        else {
            res.json({token});
        }
    })
}