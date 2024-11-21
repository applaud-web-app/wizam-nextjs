const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000; // Default to 3000 if no port is specified
const dev = process.env.NODE_ENV !== "production"; // Check environment
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Pass requests to Next.js
    handle(req, res);
  });

  // Start the server
  server.listen(port, (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.log(`> Server is running on http://localhost:${port}`);
  });
});
