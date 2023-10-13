import dotenv from 'dotenv'
import { connectDb } from './util/connectDb.js'
import createApp from './app.js'


function main() {
    dotenv.config();
    const app = createApp()

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        connectDb()
    });


    process.on('unhandledRejection', (err) => {
        console.error(err.name, err.message);
        console.error('Shutting down...');
        server.close(() => {
            process.exit(1);
        });
    });

    process.on('uncaughtException', (err) => {
        console.error(err.name, err.message);
        console.error('Shutting down...');
        server.close(() => {
            process.exit(1);
        });
    });

}

main()