import CartModel from "../models/cart.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carrito");
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            console.log('se encontro carrito por ID')
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }

            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito, fijate bien lo que haces", error);
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
        
            // Buscamos el elemento del carrito cuyo producto tenga el mismo ID que el producto que queremos agregar
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId.toString());
        
            if (existeProducto) {
                existeProducto.quantity += quantity;
                console.log('exito suma en el mismo producto');
            } else {
                console.log('primera vez en el carrito');
                carrito.products.push({ product: productId, quantity });
            }

            //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
            carrito.markModified("products");

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("error al agregar un producto", error);
        }
    }
}
 
export default CartManager;