const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js app with App Router
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the incoming request URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Custom route handling
      if (pathname === '/a') {
        // Render the App Router's /a route
        await app.render(req, res, '/a/page', query);
      } else if (pathname === '/b') {
        // Render the App Router's /b route
        await app.render(req, res, '/b/page', query);
      } else {
        // Default handler for all other routes
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
