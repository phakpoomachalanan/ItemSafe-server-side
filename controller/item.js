import Item from '../model/item.js'


export const createItem = async (req, res, next) => {
    const { name, description, type, size, path, cover, parent, warnings, tags } = req.body

    let itemDetail = {
        name: name,
        description: description,
        type: type,
        size: size,
        path: path,
        warnings: warnings,
        tags: tags,
    }

    if (parent !== "") {
        itemDetail.parent = parent
    }

    if (cover !== "") {
        itemDetail.cover = cover
    }

    const item = await Item.create(itemDetail)

    return res.json(item)
}

export const updateItem = async (req, res, next) =>{
}


export const deleteItem = async (req, res, next) => {

}

export const getChildren = async (req, res, next) => {
    
}

export const getItem = async (req, res, next) => {

}