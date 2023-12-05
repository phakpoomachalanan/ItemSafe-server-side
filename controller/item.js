import Item from '../model/item.js'
import path, { basename } from 'path'
import { createError } from '../util/createError.js'
import { craeteItemFromDirFunc, createItemFunc, moveMultipleItemFunc } from '../util/item.js'
import AdmZip from 'adm-zip'
import { bytesToSize } from '../util/size.js'
import fs, { promises as fsPromises } from 'fs'
import { moveItemFunc } from '../util/file.js'


export const createFolder = async (req, res, next) => {
    /*
        Description: 
            Create folder both within the database and locally.
        Todo: 
            If created folder does not have parent add it to account.heads
    */
    try {
        const { name, description, type, size, filePath, warnings, tags, cover, parent, parentPath } = req.body
        await fsPromises.mkdir(filePath) // create a directory in the local file system

        // create item in database
        const item = await createItemFunc(name, description, type, size, filePath, warnings, tags, cover, parent, parentPath, true)

        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const uploadItem = async (req, res, next) => {
    /*
        Description: 
            Retrieves the uploaded item from the user. If the item consists of multiple files,
            this function extracts them to the specified destination path.
    */
    try {
        const item  = req.file // file can be a single file or zip file
        const { name, description, filePath, warnings, cover, parent, parentPath, tags } = req.body
        let itemRecord // item from database

        if (!item) {
            next(createError(400, 'No file uploaded'))
        }

        const temp = item.originalname.split('.')
        const type = temp[temp.length-1]

        if (type === "zip") {
            const noExt = temp[0] // item name without extension
            const pathNoExt = path.join(parentPath, noExt) // directory path
            const file = path.join(process.cwd(), '/dump', name) // .zip file path

            var zipFile = new AdmZip(file)
            zipFile.extractAllTo(pathNoExt) // extract files to local path
            fs.unlink(file, (error) => {
                if (error) {
                    console.error(`Error deleting the file: ${err}`)
                }
            })

            itemRecord = await createItemFunc(noExt, description, "", bytesToSize(item.size), pathNoExt, warnings, tags, cover, parent, parentPath, true)
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
    /*
        Description: 
            Move specific item to destinnation both within the database and locally.
    */
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
        
        // edit item record
        const filePath = item.filePath
        item.filePath = newPath
        item.parent = newParent._id
        item.parentPath = destination
        await item.save()
        
        if (item.type === "") {
            // item is a directory
            await moveMultipleItemFunc(newPath, itemId)
        } else {
            // item is a single file
            moveItemFunc(filePath, newPath)
        }

        return res.json(item)

    } catch(error) {
        next(error)
    }
}

export const updateItem = async (req, res, next) => {

}

export const verifyItems = async (req, res, next) => {
    /*
        Description: 
            Verify item with file description.
        Todo: 
            - Alert item with wrong path, and children
            - Update items size
    */
}

export const getAllItem = async (req, res, next) => {
    /*
        Description: 
            Retrieves all item in database.
    */
    try {
        const items = await Item.find({})

        return res.json(items)
    } catch(error) {
        next(error)
    }
}

export const getItem = async (req, res, next) => {
    /*
        Description: 
            Retrieves specific item from database based on id.
    */
    try {        
        const { itemId } = req.params
        const item = await Item.findById(itemId).populate('warnings').populate('tags')
    
        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const getChildren = async (req, res, next) => {
    /*
        Description: 
            Retrieves all items children in database.
        Note:
            Huh?
    */
    try {        
        const { itemId } = req.params
        const item = Item.findById(itemId).populate('children')
    
        return res.json(item.children)
    } catch(error) {
        next(error)
    }
}

export const getParent = async (req, res, next) => {
    /*
        Description: 
            Retrieves the parent of items from ithe database.
        Note:
            Huh?
    */
    try {        
        const { itemId } = req.params
        const item = await Item.findById(itemId).populate('parent')
    
        return res.json(item.parent)
    } catch(error) {
        next(error)
    }
}

export const getAllItemName = async (req, res, next) => {
    /*
        Description:
            Retrieve every item stored in the database.
    */
    try {
        const pipeline = [
            {
                '$match': {}
            }, {
                '$project': {
                    '_id': 1, 
                    'name': 1,
                    'filePath': 1
                }
            }
        ]

        const items = await Item.aggregate(pipeline)

        return res.json(items)
    } catch(error) {
        next(error)
    }
}

export const downloadItem = async (req, res, next) => {
    /*
        Description:
            Download a specific item from server. If the item consists of multiple files,
            this function archives them before send the item file as a downloadable response to the client.
    */
    try {
        const itemsId = req.body?.itemsId ? req.body.itemsId : await Item.find({parent: null})

        const zip = AdmZip()

        const items = await Item.find(
            {
                _id: {
                    "$in": itemsId
                }
            },
            "filePath"
        )

        if (items.length <= 0) {
            next(createError(404, "File not found"))
        }

        for (const item of items) {
            if (fs.existsSync(item.filePath)) {
                if (fs.lstatSync(item.filePath).isDirectory()) {
                    zip.addLocalFolder(item.filePath, "")
                } else {
                    zip.addLocalFile(item.filePath, "")
                }
            }
        }

        const archivedFile = path.join('./dump', Date.now().toString()+".zip")
        zip.writeZip(archivedFile)

        return res.download(archivedFile)
    } catch(error) {
        next(error)
    }
}

export const deleteItem = async (req, res, next) => {
    /*
        Description: 
            Delete specific item in database.
        Todo:
            - Also delete file in local file system
    */
    try {
        const { itemId } = req.params
        const item = await Item.findById(itemId)

        if (!item) {
            return next(createError(400, "Item was not found"))
        }

        await item.deleteOne()

        return res.json({message: `item: ${item.name} delete successfully`})
    } catch (error) {
        next(error)
    }
}

export const addField = async (req, res, next) => {
    /*
        Description: 
            Add field to specific/all items in databsae.
        Todo:
            - Create new collection <- keep field which added to all item
            - Add field to item
    */
}