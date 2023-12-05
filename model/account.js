import mongoose from "mongoose"


const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    heads: [{
        type: String,
    }]
}, {
    timestamps: true
})

const Account = mongoose.models.Account || mongoose.model("Account", accountSchema)
export default Account