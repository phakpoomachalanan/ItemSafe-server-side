import Item from '../model/item.js'
import path, { extname } from 'path'
import { createError } from '../util/createError.js'
import { createItemFunc, moveItem } from '../util/item.js'

export const createItem = async (req, res, next) => {
    try {
        const { name, description, type, size, path, warnings, tags, cover, parent, parentPath } = req.body
        const item = await createItemFunc(name, description, type, size, path, warnings, tags, cover, parent, parentPath)

        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const uploadItem = async (req, res, next) => {
    try {
        const item  = req.file
        const jsonBody = JSON.parse(JSON.parse(JSON.stringify(req.body)).jsonBody)

        const { name, description, type, size, path, warnings, tags, cover, parent, parentPath } = jsonBody
        let itemRecord

        if (!item) {
            next(createError(400, 'No file uploaded.'))
        }

        if (type === "zip") {

        } else {
            itemRecord = await createItemFunc(name, description, type, size, path, warnings, tags, cover, parent, parentPath)
            
            if (!moveItem(name, path)) {
                return next(createError(500, "Cannot move item"))
            }
        }
        
        return res.json(itemRecord)
    } catch(error) {
        next(error)
    }
}

export const updateItem = async (req, res, next) => {

}

export const getAllItem = async (req, res, next) => {
    try {
        const items = await Item.find({})

        return res.json(items)
    } catch(error) {
        next(error)
    }
}

export const getItem = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = await Item.findById(itemId).populate('warnings').populate('tags')
    
        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const getChildren = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = Item.findById(itemId).populate('children')
    
        return res.json(item.children)
    } catch(error) {
        next(error)
    }
}

export const getParent = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = await Item.findById(itemId).populate('parent')
    
        return res.json(item.parent)
    } catch(error) {
        next(error)
    }
}

export const deleteItem = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const item = await Item.findById(itemId)

        if (!item) {
            return next(createError(400, "Item was not found"));
        }

        await item.deleteOne()

        return res.json({ message: `item: ${item.name} delete successfully` });
    } catch (error) {
        next(error)
    }
}