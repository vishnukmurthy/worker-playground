export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/shorten") {
      const originalUrl = url.searchParams.get("url");
      if (!originalUrl) return new Response("Missing url parameter", { status: 400 });

      const id = crypto.randomUUID().slice(0, 6);
      await env.URLS.put(id, originalUrl);

      return new Response(`Short URL: https://yourdomain.com/${id}`);

    } else if (url.pathname.startsWith("/")) {
      const id = url.pathname.slice(1);
      const originalUrl = await env.URLS.get(id);
      if (originalUrl) return Response.redirect(originalUrl, 302);
    }

    // Additional test endpoints
    if (url.pathname === "/ok") {
      return new Response("✅ Everything looks good!", { status: 200 });
    }

    if (url.pathname === "/error") {
      throw new Error("Test error for observability!");
    }

    if (url.pathname === "/slow") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return new Response("⏳ Slow response", { status: 200 });
    }

    return new Response("Hello from Cloudflare Worker! Try /ok, /error, or /slow", {
      status: 200,
    });
  },
};
