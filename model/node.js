export const defaultNodeSchema = `
    CREATE (item:Item {
        name: $name,
        description: $description,
        type: $type,
        size: $size,
        path: $path,
        cover: $cover,
        warnings: $warnings,
        tags: $tags
    })
    RETURN item
`