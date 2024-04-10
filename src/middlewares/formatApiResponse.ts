import { Context, Next } from "hono"
import { createJsonResponse } from "../utils/helpers"

/**
 * Custom middleware function to format API responses
 */
export const formatApiResponse = async (c: Context, next: Next) => {
    const originalResJson = c.json
    c.json = (body: any) => {
        const isError = !!c.error || !!body.error
        const responseBody = isError ? body : createJsonResponse({ success: true, data: body })
        return originalResJson.call(c, responseBody)
    }
    await next()
}
