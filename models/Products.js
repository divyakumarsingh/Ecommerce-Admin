import mongoose, { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }]
});

export const Product = mongoose.models.Product || model('Product', ProductSchema);