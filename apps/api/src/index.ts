import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

import { authRoutes } from "./routes/auth";
import { recruiterRoutes } from "./routes/recruiter";
import { adminRoutes } from "./routes/admin";
import { candidateRoutes } from "./routes/candidates";
import { pipelineRoutes } from "./routes/pipeline";
import { searchRoutes } from "./routes/search";
import { importRoutes } from "./routes/imports";
import { notificationRoutes } from "./routes/notifications";
import { userRoutes } from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://amy-web.vercel.app",
            "https://amy-app.vercel.app",
            "https://amy-admin.vercel.app",
          ]
        : [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
          ],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/recruiter", recruiterRoutes);
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
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
