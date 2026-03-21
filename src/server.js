import { createServer } from "node:http";
import { connectDB, disconnectDB } from "./config/db.js";
import env from "./config/env.js";

let server;

const start = async () => {
    await connectDB();
    const { default: app } = await import("./app.js");
    server = createServer(app);
    server.listen(env.port, () => {
        console.log("Server running on port:", env.port, ", env:", env.nodeEnv);
    })
}

const stop = async () => {
    if (server) {
        server.close(err => console.log("Error closing server:", err));
    }
    await disconnectDB();
    process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

start().catch(err => {
    console.log("Server failed to start: ", err);
    process.exit(1);
})