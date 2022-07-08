import express from "express";
import apiV1Router from "./api-v1/index"
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./api-v1/swagger.json";

const router = express.Router();
router.get("/", (req, res) => {
    res.send("CV Maker API - <a href='/v1/docs'>Documents</a>")
})

router.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
router.use("/v1", apiV1Router)
router.get('*', function (req, res, next) {
    res.status(404).send("what???")
});

export = router
