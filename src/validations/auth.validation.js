import {z} from 'zod'

export const authValidator = z.object({
    body: z.object({
        username: z.string().trim().toLowerCase().min('6', 'Username must be of min length 6'),
        password: z.string()
    })
})