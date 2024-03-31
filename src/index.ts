import { serve } from "@hono/node-server"
import { Hono } from "hono"
import "dotenv/config"
import { PORT } from "./constants"
import api from "./controllers/api/stripe"

const app = new Hono()

app.get("/", (c) => {
    return c.text("Hello world!")
})

app.route("/api", api)

console.log(`Server is running on port ${PORT}`)

serve({
    fetch: app.fetch,
    port: PORT,
})

export default app
