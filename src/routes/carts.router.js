import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import CartModel from "../dao/models/cart.model.js";


//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)
            
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//3) Agregar productos a distintos carritos.

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
        console.log("agrego producto al carrito")
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//Empty cart
router.delete("/:cid", async (req,res) => {
    const cartId =  req.params.cid

    try {
        await cartManager.emptyCart(cartId)
    } catch (error) {
        console.log(`Error al intentar vaciar carrito con ID: ${cartId}`)
        res.status(500).json({error:"Error interno del servidor"})
    }
})


//Delete specific products
router.delete("/:cid/product/:pid", async (req, res) =>{
    const cartId = req.params.cid
    const productId = req.params.pid

    try {
        await cartManager.deleteItem(productId, cartId)
        console.log('Producto eliminado con exito del carrito')
    } catch (error) {
        console.error("Error al borrar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    
})



//Update cart quantity
router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Cantidad inválida" });
    }

    try {
        const carritoActualizado = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json(carritoActualizado.products);
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



export default router;