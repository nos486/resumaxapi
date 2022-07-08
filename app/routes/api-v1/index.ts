import express from "express";
import captcha from "../../middleware/captcha";

import authenticateRouter from "./authenticate"
import registerRouter from "./register"
import avatarRouter from "./avatar"
import userRouter from "./user"
import usersRouter from "./users"


const router = express.Router();

router.use("/captcha", captcha.generate)
router.use("/authenticate", authenticateRouter)
router.use("/register", registerRouter)
router.use("/user", userRouter)
router.use("/avatar", avatarRouter)
router.use("/users", usersRouter)

export = router