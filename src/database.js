import mongoose from "mongoose";

const db = "MongoDB"

mongoose.connect("mongodb+srv://coderhouse69990:coderhouse@cluster0.k8gmho6.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log(`Successful connection - ${db}`))
    .catch((error) => console.log(`Error connecting - ${db}`, error))
    