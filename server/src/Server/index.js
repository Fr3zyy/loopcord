import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import config from "../../config.js";
import cors from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function startServer(client) {
  const app = express();

  app.use(
    cors({
      origin: config.server.allowedOrigins || "*",
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: "GUCLUBIRSECRETKARDESIM",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: config.database.uri,
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60,
        autoRemove: "native",
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      },
    })
  );

  import("./passport.js").then(({ default: configurePassport }) => {
    configurePassport(passport, client);
    app.use(passport.initialize());
    app.use(passport.session());
  });

  loadRoutes(app).then(() => {
    app.listen(config.server.port, () => {
      client.logger.info(
        `Express server running on port ${config.server.port}`
      );
    });
  });
}

async function loadRoutes(app) {
  const routesPath = join(__dirname, "routes");
  try {
    const files = await fs.readdir(routesPath);
    for (const file of files) {
      if (file.endsWith(".js")) {
        const routeName = file.split(".")[0];
        const routeModule = await import(`file://${join(routesPath, file)}`);
        app.use(`/${routeName}`, routeModule.default);
      }
    }
  } catch (error) {
    console.error("Error loading routes:", error);
  }
}
