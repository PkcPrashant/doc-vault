import {z} from 'zod'

export const documentValidator = z.object({
    body: z.object({
        title: z.string().trim().min('3', 'Title must be of min length 3'),
    })
})

export const getDocumentsSchema = z.object({
    body: z.object({
        page: z.coerce.number().int().min(1).default(1),
        size: z.coerce.number().int().min(1).max(50).default(10),
    })
})