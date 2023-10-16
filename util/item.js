import Item from "../model/item.js"
import mongoose from 'mongoose'
import path, { extname } from 'path'
import fs from 'fs'
import { bytesToSize } from "./size.js"


export const createItemFunc = async (name, description, type, size, filePath, warnings, tags, cover, parent, parentPath ) => {
    let itemDetail = {
        name: name,
        description: description,
        type: type,
        size: size,
        filePath: filePath,
        warnings: warnings,
        tags: tags,
        parentPath: parentPath
    }

    if (cover !== "") {
        itemDetail.cover = cover
    } else {
        itemDetail.cover = "PATH_TO_DEFAULT_PICS"
    }
    
    if (parent !== "") {
        itemDetail.parent = new mongoose.Types.ObjectId(parent)
    }

    const item = await Item.create(itemDetail)

    if (parent !== "") {
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
        if (file.startsWith('.')) {
            type = ''    
        } else {
            type = file.split('.')[1];
        }
        const size = bytesToSize(fs.statSync(filePath).size);
        const filePath = `${dir}/${file}`

        const parentId = (await createItemFunc(file, "", type, size, filePath, [], [], "", parent, dir))._id

        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, parentId)
        }
    }
}