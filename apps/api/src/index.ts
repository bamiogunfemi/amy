import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import { authRoutes } from "./routes/auth";
import { recruiterRoutes } from "./routes/recruiter";
import { recruiterJobsRoutes } from "./routes/recruiter.jobs";
import { recruiterPipelineRoutes } from "./routes/recruiter.pipeline";
import { adminRoutes } from "./routes/admin";
import { candidateRoutes } from "./routes/candidates";
import { pipelineRoutes } from "./routes/pipeline";
import { searchRoutes } from "./routes/search";
import { importRoutes } from "./routes/imports";
import { notificationRoutes } from "./routes/notifications";
import { userRoutes } from "./routes/users";
import { specs, swaggerUiOptions } from "./swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());

// Handle preflight requests
app.options("*", cors());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        // Production origins
        "https://amy-web.vercel.app",
        "https://amy-app.vercel.app",
        "https://amy-admin.vercel.app",
        // Development origins
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        // Render preview URLs (if any)
        /^https:\/\/amy-.*\.onrender\.com$/,
      ];

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === "string") {
          return origin === allowedOrigin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check
 *     description: Check if the API is running and healthy
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *     security: []
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Swagger API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// API Documentation JSON
app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use("/api/auth", authRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/recruiter", recruiterJobsRoutes);
app.use("/api/recruiter", recruiterPipelineRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/imports", importRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📄 OpenAPI Spec: http://localhost:${PORT}/api/docs.json`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
