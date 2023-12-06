import bcrypt from "bcrypt"
import Account from '../model/account.js'
import Item from "../model/item.js"
import { createError } from "../util/createError.js"
import { generateToken } from "../util/tokenManager.js"


export const login = async (req, res, next) => {
    try {
        const { username, password, otp } = req.body
        if (!(username && password && otp)) {
            return next(createError(400, "All field is required"))
        }

        const account = await Account.findOne({ username })
        if (!account) {
            return next(createError(400, "Wrong"))
        }

        const correectPassword = await bcrypt.compare(password, account.password)
        if (!correectPassword) {
            return next(createError(400, "Wrong"))
        }

        const items = await Item.find({
            _id: {
                $in: account.heads
            }
        })

        return res.json({
            token: generateToken(account._id, account.username),
            items: items
        })
    } catch (error) {
        next(error)
    }
}