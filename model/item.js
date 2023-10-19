import mongoose from "mongoose"

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
    filePath: {
        type: String,
        require: true,
    },
    warnings: [{
        type: mongoose.Types.ObjectId,
        ref: "Warning",
    }],
    tags: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag",
    }],
    cover: {
        type: String,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        default: null
    },
    parentPath: {
        type: String,
        default: ""
    },
    children: [{
        type: mongoose.Types.ObjectId,
        ref: "Item",
    }],
})

const Item = mongoose.models.item || mongoose.model("Item", itemSchema)
export default Item