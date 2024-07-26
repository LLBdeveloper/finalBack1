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
            console.log('Carrito encontrado por ID');
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
    
/////////////////////
    async deleteItem(idItem, idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito);
    
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }
    
            // Encuentra el índice del elemento a eliminar
            const index = carrito.products.findIndex(item => item._id.toString() === idItem.toString());
    
            if (index !== -1) {
                carrito.products.splice(index, 1);
                await carrito.save();
                console.log('Elemento eliminado del carrito');
            } else {
                console.log('Elemento no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al eliminar el elemento:', error);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const carrito = await CartModel.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            ).populate('products.product');

            if (!carrito) {
                console.log('Producto no encontrado en el carrito');
                throw new Error('Producto no encontrado en el carrito');
            }

            console.log('Cantidad de producto actualizada');
            return carrito;
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            await CartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true },
            console.log('Empty cart OK')
            )
        } catch (error) {
            console.log("Error en manager al vaciar el carrito", error);
            throw error;
        }
    }

}

export default CartManager;