import mongoose from "mongoose";

const cartColletion = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})

const CartModel = mongoose.model(cartColletion, cartSchema);

export default CartModel;