import { Mock } from "vitest"
import app from "../../src/index"
import stripe from "../../src/stripe"

vi.mock("../../src/stripe", () => ({
    default: {
        checkout: {
            sessions: {
                create: vi.fn(),
            },
        },
    },
}))

describe("Stripe", () => {
    describe("GET /api/checkout", () => {
        beforeEach(() => {
            vi.clearAllMocks()
        })
        ;(stripe.checkout.sessions.create as Mock).mockReturnValue({})

        test("Should return success response", async () => {
            const res = await app.request("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    price: "1234",
                    quantity: 1,
                }),
                headers: { "Content-Type": "application/json" },
            })
            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({
                data: {},
                error: null,
                success: true,
            })
        })

        test("Should throw error if no request body", async () => {
            const res = await app.request("/api/checkout", {
                method: "POST",
            })
            expect(res.status).toBe(400)
            expect(await res.json()).toEqual({
                data: null,
                error: "Invalid HTTP header: Content-Type=undefined",
                success: false,
            })
        })

        test("Should throw error if missing fields", async () => {
            const res = await app.request("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    price: "1234",
                }),
                headers: { "Content-Type": "application/json" },
            })
            expect(res.status).toBe(400)
            expect(await res.json()).toEqual({
                error: {
                    issues: [
                        expect.objectContaining({
                            expected: "number",
                            message: "Required",
                            received: "undefined",
                        }),
                    ],
                    name: "ZodError",
                },
                success: false,
            })
        })

        test("Should throw error if invalid type", async () => {
            const res = await app.request("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    price: 1234,
                    quantity: "1",
                }),
                headers: { "Content-Type": "application/json" },
            })
            expect(res.status).toBe(400)
            expect(await res.json()).toEqual({
                error: {
                    issues: [
                        expect.objectContaining({
                            expected: "string",
                            message: "Expected string, received number",
                            received: "number",
                        }),
                        expect.objectContaining({
                            expected: "number",
                            message: "Expected number, received string",
                            received: "string",
                        }),
                    ],
                    name: "ZodError",
                },
                success: false,
            })
        })
    })
    test("GET /api/success", async () => {
        const res = await app.request("/api/success")
        expect(res.status).toBe(200)
        expect(await res.text()).toBe("Success!")
    })

    test("GET /api/cancel", async () => {
        const res = await app.request("/api/cancel")
        expect(res.status).toBe(200)
        expect(await res.text()).toBe("Cancelled!")
    })
})
