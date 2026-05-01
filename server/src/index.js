import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
})

const startServer = async () => {
    try {
        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch(error) {
        console.log("Server error: ", error);
    } 
}

startServer();