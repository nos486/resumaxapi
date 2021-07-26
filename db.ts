import mongoose from "mongoose";
import userController from "./controllers/user"


const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

function dbConnect() {
    mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z8okb.mongodb.net/cvmaker?retryWrites=true&w=majority`, connectionOptions).then(async () => {

        // create admin user
        if (!await userController.hasUsername("admin")) {
            let admin = await userController.createUser("admin", "nos486@gmail.com", "admin",)
            admin.isEmailValid = true
            await admin.save()
        }

        console.error('database connected');

    }).catch(error => {
        console.error('Error connecting to database: ', error);
    });
}

mongoose.connection.on('disconnected', dbConnect);


export {dbConnect}
