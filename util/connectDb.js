import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'
import { logger } from './logger.js'

dotenv.config()

export async function connectDb() {
    const driver = neo4j.driver(process.env.NEO_URI, neo4j.auth.basic(process.env.NEO_USER, process.env.NEO_PASS))
    const session = driver.session()
    const personName = 'Popupie'

    try {
        const result = await session.run(
            'CREATE (a:Person {name: $name}) RETURN a',
            { name: personName }
        )

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)

        logger.info(`connect database as ${node.properties.name}`)

    } finally {
        await session.close()
    }

    // on application exit:
    await driver.close()
}