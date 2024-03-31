import { Hono } from "hono"
import { HOST, PORT } from "../../constants"
import { HTTPException } from "hono/http-exception"
import stripe from "../../stripe"

const api = new Hono()

api.post("/checkout", async (c) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1P0PU5FkgBFaAJvjJCKiT6So",
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://${HOST}:${PORT}/api/success`,
            cancel_url: `http://${HOST}:${PORT}/api/cancel`,
        })
        return c.json(session)
    } catch (error: any) {
        console.error(error)
        throw new HTTPException(500, { message: error.message })
    }
})

api.get("/success", (c) => {
    return c.text("Success!")
})

api.get("/cancel", (c) => {
    return c.text("Cancelled!")
})

export default api
