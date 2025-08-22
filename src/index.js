export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // URL Shortener
      if (url.pathname === "/shorten") {
        const originalUrl = url.searchParams.get("url");
        if (!originalUrl) return new Response("Missing url parameter", { status: 400 });

        const id = crypto.randomUUID().slice(0, 6);
        await env.URLS.put(id, originalUrl);

        return new Response(`Short URL: https://yourdomain.com/${id}`);
      }

      // Redirect short URL
      if (url.pathname.length > 1) {
        const id = url.pathname.slice(1);
        const originalUrl = await env.URLS.get(id);
        if (originalUrl) return Response.redirect(originalUrl, 302);
      }

      // Observability endpoints
      if (url.pathname === "/ok") return new Response("✅ Everything looks good!", { status: 200 });
      if (url.pathname === "/error") throw new Error("Test error for observability!");
      if (url.pathname === "/slow") {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return new Response("⏳ Slow response", { status: 200 });
      }

      // Default response
      return new Response(
        "Hello from Cloudflare Worker! Try /ok, /error, /slow, or /shorten?url=...",
        { status: 200 }
      );

    } catch (err) {
      return new Response(`Worker error: ${err.message}`, { status: 500 });
    }
  }
};