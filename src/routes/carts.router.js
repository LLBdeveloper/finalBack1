import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import CartModel from "../dao/models/cart.model.js";

const router = express.Router();
const cartManager = new CartManager();

// Create a new cart
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.crearCarrito();
        res.json(newCart);
    } catch (error) {
        console.error("Error creating a new cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// List products belonging to a specific cart
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId).populate('products.product');
            
        if (!cart) {
            console.log("Cart with the specified id does not exist");
            return res.status(404).json({ error: "Cart not found" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.error("Error getting the cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add products to different carts
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(updatedCart.products);
        console.log("Product added to cart");
    } catch (error) {
        console.error("Error adding product to cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Empty cart
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.emptyCart(cartId);
    } catch (error) {
        console.log(`Error trying to empty cart with ID: ${cartId}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete specific product
router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.deleteItem(productId, cartId);
        console.log("Product successfully removed from cart");
    } catch (error) {
        console.error("Error deleting product from cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update cart quantity
router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
    }

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error updating product quantity in cart", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update cart with an array of products
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    try {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = newProducts;

        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating the cart" });
    }
});

export default router;
