import { z } from "zod"

const apiSchema = z.object({
    price: z.string().min(1),
    quantity: z.number().min(1),
})

export default apiSchema
