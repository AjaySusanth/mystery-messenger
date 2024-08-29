import {z} from 'zod'

export const messagesSchema  = z.object({
    content: z
    .string()
    .min(2,{message:"Must contain atleast 2 characters"})
    .max(300,{message:"Message should not be longer than 300 characters"})
})
