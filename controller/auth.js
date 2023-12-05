import bcrypt from "bcrypt"
import Account from '../model/account.js'
import Item from "../model/item.js"


export const login = async (req, res, next) => {
    try {
        const { username, password, otp } = req.body
        if (!(username && password && otp)) throw new Error("All field is required")

        const account = await Account.findOne({ username })
        const correectPassword = await bcrypt.compare(password, account.password)
        
        if (!account && !correectPassword) throw new Error("Wrong")

        const items = await Item.find({
            _id: {
                $in: account.heads
            }
        })

        return res.json(items)
    } catch (error) {
        next(error)
    }
}