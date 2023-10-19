import fs from "fs"
import cron from "node-cron"
import path from "path"


export const intervalTriggerDump = async () => {
    cron.schedule('0 0 0 * * *', async () => {
        try {
            const currentTime = Date.now()
            const files = fs.readdirSync(path.join(process.cwd(), '/dump'))

            for (const file of files) {
                if (currentTime > parseInt(file)+86400) {
                    fs.unlink(file)
                }
            }

        } catch (error) {
            console.error('Error deleting item:', error)
        }
    })
}