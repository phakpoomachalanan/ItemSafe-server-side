import fs from 'fs'
import path from 'path'


export const moveItemFunc = (source, destination) => {
    try {
        fs.rename(source, destination, (error) => {
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