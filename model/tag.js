import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
})

const Tag = mongoose.models.tag || mongoose.model("Tag", tagSchema)
export default Tag