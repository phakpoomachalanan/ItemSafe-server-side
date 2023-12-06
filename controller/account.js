import Account from '../model/account.js'
import bcrypt from "bcrypt"
import { createError } from '../util/createError.js'


export const createAccount = async (req, res, next) => {
    try {
        const { username, password, heads } = req.body
        if (!(username && password)) {
            return next(createError(400, "All field is required"))
        }

        const account = await Account.findOne({ username })
        if (account) {
            return next(createError(400, "This username already registered"))
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())

        const newAccount = await Account.create({
            username: username,
            password: hashedPassword,
            heads: heads
        })
        return res.json(newAccount)
    } catch (error) {
        next(error)
    }
}

export const getAllAccount = async (req, res, next) => {
    try {
        const accounts = await Account.find({})

        return res.json(accounts)
    } catch(error) {
        next(error)
    }
}

export const getAccount = async (req, res, next) => {
    try {        
        const { accountId } = req.params
        const account = await Account.findById(accountId)
    
        return res.json(account)
    } catch(error) {
        next(error)
    }
}
