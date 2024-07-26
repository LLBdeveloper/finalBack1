import express from "express";
import routemap from "express-routemap";
import exphbs from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
const PORT = 8080;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Handlebars view engine setup
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Mount API routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Mount view routes
app.use("/", viewsRouter);

// Start server and log a message
app.listen(PORT, () => {
  routemap(app);
  console.log(`Server listening on port ${PORT}`);
});

// Default route for unmatched requests
app.get("*", (req, res) => {
  res.status(400).send("Route not found");
});
