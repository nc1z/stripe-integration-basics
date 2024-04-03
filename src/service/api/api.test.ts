import Stripe from "stripe"
import apiService from "."
import stripe from "../../stripe"

vi.mock("../../stripe", () => ({
    default: {
        webhooks: {
            constructEvent: vi.fn(),
        },
    },
}))

vi.mock("../../constants", async () => ({
    STRIPE_WEBHOOK_SECRET: "mockSecret",
}))

describe("apiService", () => {
    describe("constructEvent", () => {
        test("Should construct event with rawbody, signature and env", () => {
            const { constructEvent } = apiService()
            constructEvent("123", "456")
            expect(stripe.webhooks.constructEvent).toBeCalledWith("123", "456", "mockSecret")
        })
    })

    // Work-in-progress
    describe.skip("handleWebhookEvent", () => {
        test("Should call respective functions based on event type", async () => {
            const { handleWebhookEvent } = apiService()
            const handleCheckoutSessionCompletedSpy = vi
                .spyOn(apiService(), "handleCheckoutSessionCompleted")
                .mockImplementation(async () => console.log())
            await handleWebhookEvent({
                data: { object: "" },
                type: "checkout.session.completed",
            } as unknown as Stripe.Event)
            expect(handleCheckoutSessionCompletedSpy).toHaveBeenCalledOnce()
        })
    })
})
