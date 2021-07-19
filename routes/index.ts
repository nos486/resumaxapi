import express from "express";
import captcha from "../middleware/captcha";

import loginRouter from "./login"
import registerRouter from "./register"
import userRouter from "./user"


const router = express.Router();
router.get("/",(req, res) => {
    res.send("CV Maker API V1")
})

router.use("/captcha",captcha.generate)
router.use("/login",loginRouter)
router.use("/register",registerRouter)
router.use("/user",userRouter)

export = router