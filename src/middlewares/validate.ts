import { HTTPException } from "hono/http-exception"
import { ZodObject } from "zod"

export const validate = (value: any, schema: ZodObject<any>) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
        const errorMessage = `${parsed.error.errors[0].path[0]}: ${parsed.error.errors[0].message}`
        throw new HTTPException(400, { message: errorMessage })
    }
    return parsed.data
}
