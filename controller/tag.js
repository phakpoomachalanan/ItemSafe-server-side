import Tag from '../model/tag.js'


export const createTag = async (req, res, next) => {
    try {
        const { name, color } = req.body

        const tag = await Tag.create({
            name: name,
            color: color
        })
    
        return res.json(tag)
    } catch(error) {
        next(error)
    }
}

export const getAllTag = async (req, res, next) => {
    try {
        const tags = await Tag.find({})

        return res.json(tags)
    } catch(error) {
        next(error)
    }
}

export const getTag = async (req, res, next) => {
    try {        
        const { tagId } = req.params
        const tag = await Tag.findById(tagId)
    
        return res.json(tag)
    } catch(error) {
        next(error)
    }
}
