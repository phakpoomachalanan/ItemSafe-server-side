import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        require: true,
    },
    size: {
        type: String,
        require: true,
    },
    path: {
        type: String,
        require: true,
    },
    cover: {
        type: String,
    },
    warnings: [{
        type: mongoose.Types.ObjectId,
        ref: "Warning"
    }],
    tags: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag"
    }]
})

const Item = mongoose.models.item || mongoose.model("Item", itemSchema)
export default Item