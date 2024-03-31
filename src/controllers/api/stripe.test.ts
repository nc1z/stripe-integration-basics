import app from "../../index"

describe("Stripe", () => {
    test("GET /api/success", async () => {
        const res = await app.request("http://localhost/api/success")
        expect(res.status).toBe(200)
    })
})
