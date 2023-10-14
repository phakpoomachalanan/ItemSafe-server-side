import { driver } from '../util/connectDb.js'
import { defaultNodeSchema } from '../model/node.js';


export const createNode = (req, res, next) => {
    const params = req.body
    const session = driver.session()

    session
    .run(defaultNodeSchema, params)
    .then(result => {
        const createdNode = result.records[0].get('item')
        console.log('Created node:', createdNode.properties)
        return res.json(createdNode.properties)
    })
    .catch(error => {
        next(error)
    })
    .finally(() => {
        session.close()
    })

}

export const updateNode = (req, res, next) =>{

}

export const deleteNode = (req, res, next) => {

}

export const findNode = (req, res, next) => {

}

export const getChildren = (req, res, next) => {
    
}

export const getAttribute = (req, res, next) => {

}