import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()

const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY

export const generateToken = (id, username) => {
    try {
        const token = jwt.sign({ id, username }, privateKey, { algorithm: "RS256", expiresIn: "7d" })
        return token
    } catch (error) {
        throw error
    }
}

export const extractToken = (token) => {
    try {
        const payload = jwt.verify(token, publicKey)
        return payload
    } catch (error) {
        throw error
    }
}