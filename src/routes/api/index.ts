import { Hono } from "hono"
import stripeService from "../../service/stripe"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import apiSchema from "../../validations/api"
import { validator } from "hono/validator"
import { validate } from "../../middlewares/validate"

const api = new Hono()

api.post(
    "/checkout",
    validator("json", (value) => validate(value, apiSchema)),
    async (c) => {
        const { price, quantity } = c.req.valid("json")
        const { createStripeSession } = stripeService()
        const session = await createStripeSession({ price, quantity })
        return c.json(session)
    }
)

api.get("/success", (c) => {
    return c.json("Success!")
})

api.get("/cancel", (c) => {
    return c.json("Cancelled!")
})

api.post("/webhook", async (c) => {
    const rawBody = await c.req.text()
    const signature = c.req.header("stripe-signature")
    const { constructEvent, handleWebhookEvent } = stripeService()
    const event = constructEvent(rawBody, signature)
    await handleWebhookEvent(event)
    return c.json("success")
})

export default api
