import { ZodNumber, ZodObject, ZodString, z } from "zod"

const apiSchema: ZodObject<{
    price: ZodString
    quantity: ZodNumber
}> = z.object({
    price: z.string().min(1),
    quantity: z.number().min(1),
})

export default apiSchema
