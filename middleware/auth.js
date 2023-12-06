import { createError } from "../util/createError.js"
import { extractToken } from "../util/tokenManager.js"


export const authenticateUser = (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return next(createError(401, "Unauthorize"))
        }

        // Extract the token without the "Bearer " prefix
        const token = authorization.slice(7)

        const { id, username } = extractToken(token)

        // Keep id and username in request for the next handler function
        req.user = { id, username }
        next()
    } catch (error) {
        next(error)
    }
}