// Package Import
import express from 'express'
import ExpressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression';
import xXssProtection from 'x-xss-protection';
import cookieParser from "cookie-parser";
import cors from 'cors'
// Routes Import

function createApp() {
    const app = express();

    const limiter = rateLimit({
        max: 100,
        wondowMs: 60 * 60 * 1000,
        message: "Too many requests from this IP, please try again in an hour",
    });

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
    app.use("/api", limiter);
    app.use(express.json({ limit: "10kb" }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(ExpressMongoSanitize());
    app.use(xXssProtection());
    app.use(compression());
    app.use(cors());

    // routes

    return app
}

export default createApp