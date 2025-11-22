import mongoose from "mongoose";
import { status } from "../constants/index.js";

const schema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    role: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: status.active,
    },
    subject:{
        type:String,
    },
    Message:{
        type:String,
    },
}, { timestamps: true, });

schema.index({ id: 1 }, { background: true, unique: true });
schema.index({ email: 1 }, { background: true, unique: true });
schema.index({ phoneNumber: 1 }, { background: true, unique: true });
const model = mongoose.model("user", schema);
export default model;
