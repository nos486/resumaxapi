import express from "express";
import captcha from "../middleware/captcha";

import loginRouter from "./login"
import registerRouter from "./register"


const router = express.Router();
router.get("/",(req, res) => {
    res.send("CV Maker API V1")
})

router.use("/login",loginRouter)
router.use("/register",registerRouter)
router.use("/captcha",captcha.generate)

export = router