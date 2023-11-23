import mongoose from "mongoose"

const warningSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    }
})

const Warning = mongoose.models.warning || mongoose.model("Warning", warningSchema)
export default Warning