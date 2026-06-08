const permanentRedirects = new Map([
  ["/posts", "/blog/"],
  ["/posts/", "/blog/"],
]);

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    const isAssetRequest =
      url.pathname.startsWith("/images/") ||
      url.pathname.startsWith("/_next/") ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/sitemap.xml";

    if (url.hostname === "www.simplethin.gs" && !isAssetRequest) {
      url.hostname = "simplethin.gs";
      return Response.redirect(url.toString(), 301);
    }

    const destination = permanentRedirects.get(url.pathname);

    if (destination) {
      const redirectUrl = new URL(destination, url.origin);
      redirectUrl.search = url.search;
      return Response.redirect(redirectUrl.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
