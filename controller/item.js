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

export const getItem = async (req, res, next) => {
    try {        
        const { itemId } = req.params
        const item = Item.findById({itemId}).populate('warnings').populate('tags')
    
        return res.json(item)
    } catch(error) {
        next(error)
    }
}