import Item from '../model/item.js'


export const createItem = async (req, res, next) => {
    try {
        const { name, description, type, size, path, warnings, tags, cover, parent } = req.body

        let itemDetail = {
            name: name,
            description: description,
            type: type,
            size: size,
            path: path,
            warnings: warnings,
            tags: tags,
        }
    
        if (cover !== "") {
            itemDetail.cover = cover
        }
        
        if (parent !== "") {
            itemDetail.parent = parent
        }

        const item = await Item.create(itemDetail)
    
        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const updateItem = async (req, res, next) =>{
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

export const getItem = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = await Item.findById({itemId}).populate('warnings').populate('tags')
    
        return res.json(item)
    } catch(error) {
        next(error)
    }
}

export const getChildren = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = Item.findById({itemId}).populate('children')
    
        return res.json(item.children)
    } catch(error) {
        next(error)
    }
}

export const getParent = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = await Item.findById({itemId}).populate('parent')
    
        return res.json(item.parent)
    } catch(error) {
        next(error)
    }
}