import Item from '../model/item.js'
import path from 'path'
import { createError } from '../util/createError.js'
import { craeteItemFromDirFunc, createItemFunc, moveItemFunc, moveMultipleItemFunc } from '../util/item.js'
import AdmZip from 'adm-zip'
import { bytesToSize } from '../util/size.js'
import fs from 'fs'

export const createItem = async (req, res, next) => {
    try {
        const { name, description, type, size, filePath, warnings, tags, cover, parent, parentPath } = req.body
        const item = await createItemFunc(name, description, type, size, filePath, warnings, tags, cover, parent, parentPath, true)

        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const uploadItem = async (req, res, next) => {
    try {
        const item  = req.file
        const jsonBody = JSON.parse(JSON.parse(JSON.stringify(req.body)).jsonBody)

        const { name, description, filePath, warnings, tags, cover, parent, parentPath } = jsonBody
        let itemRecord

        if (!item) {
            next(createError(400, 'No file uploaded'))
        }

        const temp = item.originalname.split('.')
        const type = temp[temp.length-1]

        if (type === "zip") {
            const noExt = temp[0]
            const pathNoExt = path.join(parentPath, noExt)
            const file = path.join(process.cwd(), '/dump', name)

            var zipFile = new AdmZip(file)
            zipFile.extractAllTo(pathNoExt)
            fs.unlink(file, (error) => {
                if (error) {
                    console.error(`Error deleting the file: ${err}`);
                }
            })

            itemRecord = await createItemFunc(noExt, description, "", bytesToSize(item.size), pathNoExt, warnings, tags, cover, parent, parentPath,true)
            await craeteItemFromDirFunc(pathNoExt, itemRecord._id)
        } else {
            itemRecord = await createItemFunc(name, description, type, bytesToSize(item.size), filePath, warnings, tags, cover, parent, parentPath, true)
            
            if (!moveItemFunc(path.join(process.cwd(), '/dump', name), filePath)) {
                return next(createError(500, "Cannot move item"))
            }
        }

        return res.json(itemRecord)
    } catch(error) {
        next(error)
    }
}

export const moveItem = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const { destination } = req.body

        
        const item = await Item.findById(itemId)
        if (!item) {
            return next(createError(400, "Item not found"))
        }
        
        const newPath = path.join(destination, item.name) 

        if (!moveItemFunc(item.filePath, newPath)) {
            return next(createError(500, "Cannot move item"))
        }

        await Item.findByIdAndUpdate(
            itemId.parent, {
                $pull: {
                    children: itemId
                }
            }
        )

        
        const newParent = await Item.findOneAndUpdate(
            {
                filePath: destination
            },
            {
                $push: {
                    children: itemId
                }
            }
        )
            
        item.filePath = newPath
        item.parent = newParent._id
        item.parentPath = destination
        await item.save()
        
        await moveMultipleItemFunc(newPath, itemId)

        return res.json(item)

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