import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import router from "./routes"
import {dbConnect} from "./db";
import errorHandler from "./middleware/error-handler";

const  app = express()

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET: string;
            NODE_ENV: 'development' | 'production';
            DB_USER?: string;
            DB_PASSWORD: string;
        }
    }
}

//json body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    exposedHeaders: 'Key',
}))

app.use('/static', express.static('public'))

//routes
app.use('/', router);

// global error handler
app.use(errorHandler);


dbConnect()

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Example app listening at http://0.0.0.0:${port}`)
})

export default server

