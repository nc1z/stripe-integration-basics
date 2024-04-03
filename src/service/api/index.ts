import Stripe from "stripe"
import stripe from "../../stripe"
import { HTTPException } from "hono/http-exception"
import { HOST, PORT, STRIPE_WEBHOOK_SECRET } from "../../constants"

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

    const constructEvent = (rawBody: string, signature?: string) => {
        try {
            return stripe.webhooks.constructEvent(rawBody, signature!, STRIPE_WEBHOOK_SECRET)
        } catch (error: any) {
            console.error(`Webhook signature verification failed ${error.message}`)
            throw new HTTPException(400)
        }
    }

    const handleWebhookEvent = async (event: Stripe.Event): Promise<void> => {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event)
                break
            case "customer.subscription.updated":
                await handleCustomerSubscriptionUpdated(event)
                break
            case "customer.subscription.deleted":
                await handleCustomerSubscriptionDeleted(event)
                break
        }
    }

    const handleCheckoutSessionCompleted = async (session: Stripe.CheckoutSessionCompletedEvent): Promise<void> => {
        const eventObject = session.data.object
        console.info("Do something with", eventObject)
        // @TODO post purchase actions
        // Update database with order details
        // Add credits to customer account
        // Send confirmation email
        // Print shipping label
        // Trigger order fulfillment workflow
        // Update inventory
        // etc.
    }

    const handleCustomerSubscriptionUpdated = async (
        subscription: Stripe.CustomerSubscriptionUpdatedEvent
    ): Promise<void> => {
        const eventObject = subscription.data.object
        console.info("Do something with", eventObject)
    }

    const handleCustomerSubscriptionDeleted = async (
        subscription: Stripe.CustomerSubscriptionDeletedEvent
    ): Promise<void> => {
        const eventObject = subscription.data.object
        console.info("Do something with", eventObject)
    }

    return {
        createStripeSession,
        constructEvent,
        handleWebhookEvent,
        handleCheckoutSessionCompleted,
        handleCustomerSubscriptionUpdated,
        handleCustomerSubscriptionDeleted,
    }
}

export default apiService
