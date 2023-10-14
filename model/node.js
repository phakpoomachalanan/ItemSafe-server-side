export const nodeSchema = `
    CREATE (item:Item {
        name: $name,
        description: $descrition,
        type: $types,
        size: $size,
        path: $path,
        warnings: $warnings,
        tags: $tag,
        cover: $cover
    })
    RETURN item
`