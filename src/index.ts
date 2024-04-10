import { serve } from "@hono/node-server"
import { Hono } from "hono"
import "dotenv/config"
import { PORT } from "./constants"
import api from "./routes/api"
import { HTTPException } from "hono/http-exception"
import { createJsonResponse } from "./utils/helpers"
import { formatApiResponse } from "./middlewares/formatApiResponse"

const app = new Hono()

app.use(formatApiResponse)

app.get("/", (c) => {
    return c.json("Hello world!")
})

app.route("/api", api)

app.onError((error, c) => {
    const code = error instanceof HTTPException ? error.status : 500
    c.status(code)
    return c.json(createJsonResponse({ success: false, error: error.message }), code)
})

if (process.env.NODE_ENV !== "test") {
    serve({
        fetch: app.fetch,
        port: PORT,
    })
    console.log(`Server is running on port ${PORT}`)
}

export default app
