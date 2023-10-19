import mongoose from "mongoose"

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    color: {
        type: String,
        default: "#000000"
    }
})

const Tag = mongoose.models.tag || mongoose.model("Tag", tagSchema)
export default Tag