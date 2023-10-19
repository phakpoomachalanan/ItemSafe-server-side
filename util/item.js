import Item from "../model/item.js"
import mongoose from 'mongoose'
import path, { extname } from 'path'
import fs from 'fs'
import { bytesToSize } from "./size.js"


export const createItemFunc = async (name, description, type, size, filePath, warnings, tags, cover, parent, parentPath, updateChildren ) => {
    if ((await Item.find({filePath: filePath})).length >= 1) {
        return {message: "Already created"}
    }

    const itemDetail = {
        name: name,
        description: description,
        type: type,
        size: size,
        filePath: filePath,
        warnings: warnings,
        tags: tags,
        parentPath: parentPath,
    }

    if (cover !== "") {
        itemDetail.cover = cover
    } else {
        itemDetail.cover = "PATH_TO_DEFAULT_PICS"
    }
    
    if (parent !== "") {
        itemDetail.parent = new mongoose.Types.ObjectId(parent)
    }

    if (type === "") {
        itemDetail.children = []        
    }

    const item = await Item.create(itemDetail)

    if (updateChildren && parent !== "") {
        await Item.findByIdAndUpdate(
            item.parent,
            {
                $push: {
                    children: item._id 
                }
            }
        )
    }

    return item
}

export const moveMultipleItemFunc = async (destination, itemId) => {
    try {
        const item = await Item.findById(itemId).populate('children')
        if (!item) {
            return next(createError(400, "Item not found"))
        }

        if (item.type !== "") {
            return true
        }

        
        for (const child of item.children) {
            const newPath = path.join(destination, child.name)
            child.filePath = newPath
            child.parentPath = destination
            await child.save()

            if (child.type === "") {
                await moveMultipleItemFunc(newPath, child._id)
            }
        }

        return true
    } catch(error) {
        return false
    }
}

export const craeteItemFromDirFunc = async (dir, parent) => {
    const fileList = fs.readdirSync(dir)

    for (const file of fileList) {
        const type = extname(file).slice(1)
        const children = []

        const filePath = path.join(dir, file)
        const size = bytesToSize(fs.statSync(filePath).size)

        const newRecord = (await createItemFunc(file, "", type, size, filePath, [], [], "", parent, dir, false))

        children.push(newRecord._id)
        
        if (fs.statSync(filePath).isDirectory()) {
            craeteItemFromDirFunc(filePath, newRecord._id)
        }

        const item = await Item.findById(parent)
        item.children.push(children)
        await item.save()
        
    }
}