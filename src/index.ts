import { serve } from "@hono/node-server"
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
    return c.text("Hello world!")
})

app.post("/", (c) => {
    return c.text("POST request received!")
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
})
