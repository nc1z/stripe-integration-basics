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

api.post("/webhook", async (c) => {
    const rawBody = await c.req.text()
    const signature = c.req.header("stripe-signature")
    const { constructEvent, handleWebhookEvent } = apiService()
    const event = constructEvent(rawBody, signature)
    await handleWebhookEvent(event)
    return c.text("success")
})

export default api
