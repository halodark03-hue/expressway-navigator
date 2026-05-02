import { Outlet, Link, createRootRoute } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Expressway Algorithm Visualizer</title>
        <meta name="description" content="Interactive visualizations of Dijkstra, Kruskal, Bellman-Ford, Fenwick Tree, Bloom Filter and Heap algorithms on the Delhi–Dehradun Expressway network." />
        <meta name="author" content="Expressway Viz" />
        <meta property="og:title" content="Expressway Algorithm Visualizer" />
        <meta property="og:description" content="Interactive graph algorithm playground for highway networks." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@Lovable" />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
