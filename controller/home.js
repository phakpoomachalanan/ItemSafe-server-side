export const homePage = async (req, res, next) => {
    try {
        return res.json({
            message: "Hi :)"
        })
    } catch(error) {
        next(error)
    }
}