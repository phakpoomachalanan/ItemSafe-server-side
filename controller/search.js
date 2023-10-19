import mongoose from "mongoose"
import Item from "../model/item.js"


export const searchItem = async (req, res, next) => {
    try {
        const body = req.body

        const query = {}
        if (body?.name) {
            query.name = {
                "$regex": body.name,
                "$options": "i"
            }
        }

        if (body?.description) {
            query.description = {
                "$regex": body.description,
                "$options": "i"
            }
        }

        if (body?.type) {
            query.type = body.type
        }

        if (body?.parentPath) {
            query.parentPath = body.parentPath
        }

        if (body?.warnings) {
            query.warnings = {
                "$all": body.warnings
            }
        }
        if (body?.tags) {
            query.tags = {
                "$all": body.tags
            }
        }

        const item = await Item.find(query)

        return res.json(item)


    } catch(error) {
        next(error)
    }
}