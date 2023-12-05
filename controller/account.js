import Account from '../model/account.js'
import bcrypt from "bcrypt"


export const createAccount = async (username, password, heads) => {
    try {
        if (!(username && password)) throw new Error("All field is required")

        const account = await Account.findOne({ username })
        if (account) throw new Error("This username already registered")

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())

        const newAccount = await Account.create({
            username: username,
            password: hashedPassword,
            heads: heads
        })
        return newAccount
    } catch (error) {
        throw error
    }
}

