import Item from "../model/item.js"
import mongoose from 'mongoose'
import path, { extname } from 'path'
import fs from 'fs'
import { bytesToSize } from "./size.js"


export const createItemFunc = async (name, description, type, size, filePath, warnings, tags, cover, parent, parentPath, updateChildren ) => {
    if (!(await Item.find({filePath: filePath}))) {
        return {message: "Already created"}
    }

    let itemDetail = {
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

    if (parent !== "" && updateChildren) {
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

export const moveItem = (name, destination) => {
    try {
        const __dirname = process.cwd()
        
        fs.rename(path.join(__dirname, '/dump', name), destination, (error) => {
            if (error) {
                console.log(error)
            }
        })
        return true
    } catch(error) {
        console.log(error)
        return false
    }
}

export const craeteItemFromDirFunc = async (dir, parent) => {
    const fileList = fs.readdirSync(dir);

    for (const file of fileList) {
        let type
        let children = []
        if (file.startsWith('.')) {
            type = ''    
        } else {
            const temp =  file.split('.')
            type = temp[temp.length-1]
        }
        const filePath = `${dir}/${file}`
        const size = bytesToSize(fs.statSync(filePath).size)

        const newRecord = (await createItemFunc(file, "", type, size, filePath, [], [], "", parent, dir, false))

        children.push(newRecord._id)
        console.log(children)
        
        if (fs.statSync(filePath).isDirectory()) {
            craeteItemFromDirFunc(filePath, newRecord._id)
        }

        const item = await Item.findById(parent)
        item.children.push(children)
        await item.save()
        
    }
}