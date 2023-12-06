import mongoose from "mongoose"


const warningSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        deault: ""
    }
})

const Warning = mongoose.models.Warning || mongoose.model("Warning", warningSchema)
export default Warning