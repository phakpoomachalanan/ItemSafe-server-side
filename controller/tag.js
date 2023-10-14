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