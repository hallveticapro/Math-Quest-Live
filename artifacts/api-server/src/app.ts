import fs from "node:fs";
import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { createRateLimit } from "./lib/rateLimit";

const app: Express = express();

function readTrustProxy(value: string | undefined): boolean | number | string {
  if (!value || value.toLowerCase() === "false" || value === "0") return false;
  if (value.toLowerCase() === "true") return true;
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return value;
}

app.set("trust proxy", readTrustProxy(process.env.TRUST_PROXY));

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
app.use(cors({ origin: corsOrigin === "*" ? true : corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/game",
  createRateLimit({
    maxRequestsEnv: "RATE_LIMIT_MAX_REQUESTS",
    defaultMaxRequests: 60,
  }),
);
app.use(
  "/api/images/status",
  createRateLimit({
    maxRequestsEnv: "IMAGE_RATE_LIMIT_MAX_REQUESTS",
    defaultMaxRequests: 20,
  }),
);
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const staticDir = process.env.STATIC_DIR ?? path.resolve(process.cwd(), "public");
  const indexPath = path.join(staticDir, "index.html");

  if (fs.existsSync(indexPath)) {
    app.use(express.static(staticDir, { index: false }));

    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res, next) => {
      res.sendFile(indexPath, (err) => {
        if (err) next(err);
      });
    });
  } else {
    logger.warn({ staticDir }, "Production static frontend not found");
  }
}

export default app;
