/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {

  async fetch(request, env, ctx) {
    const { pathname, searchParams } = new URL(request.url);

    const url = new URL(request.url);
    
    if (url.pathname === "/shorten") {
      
      const originalUrl = url.searchParams.get("url");
      if (!originalUrl) return new Response("Missing url parameter", { status: 400 });
      const id = randomUUID().slice(0, 6);
      await env.URLS.put(id, originalUrl);
      return new Response(`Short URL: https://yourdomain.com/${id}`);

    } else {
      
      const id = url.pathname.slice(1);
      const originalUrl = await env.URLS.get(id);
      if (originalUrl) return Response.redirect(originalUrl, 302);
      return new Response("URL not found", { status: 404 });
    
    }

    // Simulate some different behaviors to test observability
    if (pathname === "/ok") {
      return new Response("✅ Everything looks good!", { status: 200 });
    }

    if (pathname === "/error") {
      // Intentionally throw an error
      throw new Error("Test error for observability!");
    }

    if (pathname === "/slow") {
      // Simulate latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      return new Response("⏳ Slow response", { status: 200 });
    }

    return new Response("Hello from Cloudflare Worker! Try /ok, /error, or /slow", {
      status: 200,
    });
  },


	// async fetch(request, env, ctx) {
	// 	return new Response('Hello Vishnu, Are you a walrus?! No! How rude of you to ask');
	// },
};
