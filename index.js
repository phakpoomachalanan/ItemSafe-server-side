import dotenv from 'dotenv'
import { connectDb } from './util/connectDb.js'
import createApp from './app.js'
import { logger } from './util/logger.js'


function main() {
    dotenv.config()
    const app = createApp()

    const PORT = process.env.APP_PORT || 3000
    const server = app.listen(PORT, () => {
        logger.info(`server start at http://localhost:${PORT}`)
        connectDb()
    })

    process.on('unhandledRejection', (error) => {
        logger.error(error.name, error.message)
        server.close(() => {
            process.exit(1)
        })
    })

    process.on('uncaughtException', (error) => {
        logger.error(error.name, error.message)
        server.close(() => {
            process.exit(1)
        })
    })

}

main()