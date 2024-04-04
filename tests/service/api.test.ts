import Stripe from "stripe"
import stripeService from "../../src/service/stripe"
import stripe from "../../src/stripe"

vi.mock("../../src/stripe", () => ({
    default: {
        webhooks: {
            constructEvent: vi.fn(),
        },
    },
}))

vi.mock("../../src/constants", async () => ({
    STRIPE_WEBHOOK_SECRET: "mockSecret",
}))

describe("stripeService", () => {
    describe("constructEvent", () => {
        test("Should construct event with rawbody, signature and env", () => {
            const { constructEvent } = stripeService()
            constructEvent("123", "456")
            expect(stripe.webhooks.constructEvent).toBeCalledWith("123", "456", "mockSecret")
        })
    })

    // Work-in-progress
    describe.skip("handleWebhookEvent", () => {
        test("Should call respective functions based on event type", async () => {
            const { handleWebhookEvent } = stripeService()
            // const handleCheckoutSessionCompletedSpy = vi
            //     .spyOn(stripeService(), "handleCheckoutSessionCompleted")
            //     .mockImplementation(async () => console.log())
            await handleWebhookEvent({
                data: { object: "" },
                type: "checkout.session.completed",
            } as unknown as Stripe.Event)
            // expect(handleCheckoutSessionCompletedSpy).toHaveBeenCalledOnce()
        })
    })
})
