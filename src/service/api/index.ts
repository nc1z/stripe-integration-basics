import Stripe from "stripe"
import stripe from "../../stripe"
import { HTTPException } from "hono/http-exception"
import { HOST, PORT } from "../../constants"

const apiService = () => {
    const createStripeSession = async ({
        price,
        quantity,
    }: {
        price: string
        quantity: number
    }): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
        try {
            return await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{ price, quantity }],
                mode: "payment",
                success_url: `http://${HOST}:${PORT}/api/success`,
                cancel_url: `http://${HOST}:${PORT}/api/cancel`,
            })
        } catch (error: any) {
            console.error(error)
            throw new HTTPException(500, { message: error.message })
        }
    }

    return {
        createStripeSession,
    }
}

export default apiService
