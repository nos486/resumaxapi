import express from "express";
import userRoute from "./user"
// const {captcha} =require("./../middleware")

const router = express.Router();
router.get("/",(req, res) => {
    res.send("CV Maker API V1")
})

router.use("/user",userRoute)
// router.use("/chat",require( "./chat"))
// router.use("/message",require("./messege"))
// router.use("/captcha",captcha.generate)

export = router