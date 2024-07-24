import mongoose from "mongoose";

const db = "MongoDB"

mongoose.connect("mongodb+srv://berteralautaro:admiadmi@finalbackendi.rkwmt1e.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=finalBackendI")
    .then(() => console.log(`Successful connection - ${db}`))
    .catch((error) => console.log(`Error connecting - ${db}`, error))
    