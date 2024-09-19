import {z} from 'zod'

export const signInSchema  = z.object({
    identifier:z.string().min(1,"Field is required"),
    password:z.string().min(6,{message:"Password enter minimum of 6 characters"})
})

