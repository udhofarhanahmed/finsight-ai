import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { Server as HttpServer } from "http";
import { registerOAuthRoutes } from "./oauth";
import { registerChatRoutes } from "./chat";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

export async function createApp(
  options: { includeFrontend?: boolean; viteServer?: HttpServer } = {},
) {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);
  registerChatRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  if (options.includeFrontend ?? true) {
    if (process.env.NODE_ENV === "development") {
      if (!options.viteServer) {
        throw new Error(
          "viteServer is required when includeFrontend is true in development mode",
        );
      }
      await setupVite(app, options.viteServer);
    } else {
      serveStatic(app);
    }
  }

  return app;
}
