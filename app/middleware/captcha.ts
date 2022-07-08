import express, {Request, Response, NextFunction} from 'express';
import cache from "memory-cache"
import {v4 as uuid} from "uuid"
import svgCaptcha from "svg-captcha"

export default {
    check,
    generate
}

function generate(req:Request,res:Response,next:NextFunction){
    let captcha = svgCaptcha.create({noise:2})
    let key = uuid()

    cache.put(key,captcha.text,60*1000)

    res.type('svg');
    res.status(200)
    res.append("Key",key)
    res.send(captcha.data)
}

function check(req:Request,res:Response,next:NextFunction) {
    let v = cache.get(req.body.key)
    if (v !== null){
        if(v.toLowerCase() === req.body.captcha.toLowerCase()){
            cache.del(req.body.key)
            next()
        }else {
            throw new Error("Wrong captcha")
        }
    }else {
        throw new Error("Wrong captcha")
    }
}

