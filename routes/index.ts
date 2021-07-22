import express from "express";
import captcha from "../middleware/captcha";

import authenticateRouter from "./authenticate"
import registerRouter from "./register"
import userRouter from "./user"


const router = express.Router();
router.get("/",(req, res) => {
    res.send("CV Maker API V1")
})

router.use("/captcha",captcha.generate)
router.use("/authenticate",authenticateRouter)
router.use("/register",registerRouter)
router.use("/user",userRouter)

export = router