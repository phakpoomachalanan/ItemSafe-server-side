import Warning from '../model/warning.js'


export const createWarning = async (req, res, next) => {
    try {
        const { title, description } = req.body

        const warning = await Warning.create({
            title: title,
            description: description
        })
    
        return res.json(warning)
    } catch(error) {
        next(error)
    }
}