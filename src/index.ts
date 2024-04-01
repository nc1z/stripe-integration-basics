import { serve } from "@hono/node-server"
import { Hono } from "hono"
import "dotenv/config"
import { PORT } from "./constants"
import api from "./routes/api"
import { HTTPException } from "hono/http-exception"
import { createJsonResponse } from "./utils/helpers"

const app = new Hono()

app.get("/", (c) => {
    return c.text("Hello world!")
})

app.route("/api", api)

app.onError((error, c) => {
    const code = error instanceof HTTPException ? error.status : 500
    return c.json(createJsonResponse({ success: false, error: error.message }), code)
})

console.log(`Server is running on port ${PORT}`)

serve({
    fetch: app.fetch,
    port: PORT,
})

export default app
