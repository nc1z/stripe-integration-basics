import { Hono } from "hono"
import apiService from "../../service/api"
import { zValidator } from "@hono/zod-validator"
import apiSchema from "../../validations/api"
import { createJsonResponse } from "../../utils/helpers"

const api = new Hono()

api.post("/checkout", zValidator("json", apiSchema), async (c) => {
    const { price, quantity } = c.req.valid("json")
    const { createStripeSession } = apiService()
    const session = await createStripeSession({ price, quantity })
    return c.json(createJsonResponse({ data: session }))
})

api.get("/success", (c) => {
    return c.text("Success!")
})

api.get("/cancel", (c) => {
    return c.text("Cancelled!")
})

export default api
