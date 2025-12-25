import mongoose from "mongoose";
import { status } from "../constants/index.js";

const schema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    location: { type: String, required: true },
    property_type: { type: String, required: true },
    status: { type: String, required: true },
    bedrooms: Number,
    bathrooms: Number,
    area_sqft: Number,
    unit: { type: String, default: "sqft" },
    images: [{ type: String, required: true }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    metaTags: { type: String },
    price_unit: { type: String },
    subType: { type: String },
}, { timestamps: true, });


schema.index({ id: 1 }, { background: true, unique: true });
const model = mongoose.model("Properties", schema);
export default model;
