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

export const getAllWarning = async (req, res, next) => {
    try {
        const warnings = await Warning.find({})

        return res.json(warnings)
    } catch(error) {
        next(error)
    }
}

export const getWarning = async (req, res, next) => {
    try {        
        const { warningId } = req.params
        const warning = await Warning.findById(warningId)
    
        return res.json(warning)
    } catch(error) {
        next(error)
    }
}
