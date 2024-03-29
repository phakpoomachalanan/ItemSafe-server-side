// Package Import
import express from 'express'
import morgan from 'morgan'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression'
import xXssProtection from 'x-xss-protection'
import cookieParser from "cookie-parser"
import cors from 'cors'
// Routes Import
import homePage from './routes/home.js'
import authRoutes from './routes/auth.js'
import accountRoutes from './routes/account.js'
import itemRoutes from './routes/item.js'
import treeRoutes from './routes/tree.js'
import warningRoutes from './routes/warning.js'
import tagRoutes from './routes/tag.js'
import searchRoutes from './routes/search.js'
import { intervalTriggerDump } from './util/triggerDump.js'
import { errorMiddleware } from './middleware/errorHandler.js'
import { authenticateUser } from './middleware/auth.js'


function createApp() {
    const app = express()

    app.use(express.static('public'))

    const limiter = rateLimit({
        max: 100,
        wondowMs: 60 * 60 * 1000,
        message: "Too many requests from this IP, please try again in an hour",
    })

    const hppH = hpp({
        whitelist: [
            // 'duration',
            // 'ratingsQuantity',
            // 'ratingsAverage',
            // 'maxGroupSize',
            // 'difficulty',
            // 'price',
        ],
    })

    app.use(hppH)
    app.use("/api", limiter)
    app.use(morgan("dev"))
    app.use(express.json({ limit: "10kb" }))
    app.use(helmet())
    app.use(cookieParser())
    app.use(ExpressMongoSanitize())
    app.use(xXssProtection())
    app.use(compression())
    app.use(cors())

    app.use("/api/v1/auth", authRoutes)
    app.use(authenticateUser)
    
    app.use("/api/v1/home", homePage)
    app.use("/api/v1/account", accountRoutes)
    app.use("/api/v1/items", itemRoutes)
    app.use("/api/v1/search", searchRoutes)
    app.use("/api/v1/trees", treeRoutes)
    app.use("/api/v1/warnings", warningRoutes)
    app.use("/api/v1/tags", tagRoutes)

    app.use(errorMiddleware)
    intervalTriggerDump()

    return app
}

export default createApp