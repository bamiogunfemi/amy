#!/usr/bin/env node

/**
 * Update Swagger JSDoc descriptions with meaningful, professional descriptions
 * This script replaces generic auto-generated descriptions with specific ones
 */

const fs = require("fs");
const path = require("path");

const routesDir = path.join(__dirname, "../src/routes");
const files = fs.readdirSync(routesDir).filter((file) => file.endsWith(".ts"));

console.log("🔄 Updating Swagger descriptions...\n");

// Mapping of endpoints to better descriptions
const endpointDescriptions = {
  // Authentication endpoints
  "/auth/login": {
    POST: {
      summary: "User login",
      description:
        "Authenticate user with email and password, returns JWT tokens for API access",
    },
  },
  "/auth/signup": {
    POST: {
      summary: "User registration",
      description:
        "Create a new user account with email verification and company setup",
    },
  },
  "/auth/logout": {
    POST: {
      summary: "User logout",
      description: "Invalidate current JWT token and end user session",
    },
  },
  "/auth/refresh": {
    POST: {
      summary: "Refresh JWT token",
      description:
        "Exchange refresh token for new access token to maintain authentication",
    },
  },
  "/auth/me": {
    GET: {
      summary: "Get current user",
      description:
        "Retrieve profile information for the currently authenticated user",
    },
  },

  // Candidate endpoints
  "/": {
    GET: {
      summary: "List candidates",
      description:
        "Retrieve all candidates owned by the authenticated recruiter with pagination support",
    },
    POST: {
      summary: "Create candidate",
      description:
        "Add a new candidate to the database with profile information and skills",
    },
  },
  "/:id": {
    GET: {
      summary: "Get candidate details",
      description:
        "Retrieve detailed information about a specific candidate including skills and documents",
    },
    PUT: {
      summary: "Update candidate",
      description:
        "Modify candidate profile information, skills, and other attributes",
    },
    DELETE: {
      summary: "Delete candidate",
      description:
        "Permanently remove candidate and all associated data from the system",
    },
  },
  "/:id/skills": {
    POST: {
      summary: "Add candidate skills",
      description:
        "Associate new skills with a candidate profile for better matching",
    },
  },

  // Admin endpoints
  "/overview": {
    GET: {
      summary: "Admin dashboard overview",
      description:
        "Get system-wide statistics and metrics for administrative monitoring",
    },
  },
  "/users": {
    GET: {
      summary: "List all users",
      description:
        "Retrieve all users in the system with filtering and pagination options",
    },
  },
  "/users/block": {
    POST: {
      summary: "Block user account",
      description:
        "Suspend user access to the platform while preserving their data",
    },
  },
  "/users/unblock": {
    POST: {
      summary: "Unblock user account",
      description: "Restore user access to the platform after suspension",
    },
  },
  "/users/delete": {
    POST: {
      summary: "Delete user account",
      description: "Permanently remove user account and all associated data",
    },
  },
  "/companies": {
    GET: {
      summary: "List companies",
      description: "Retrieve all companies registered on the platform",
    },
  },
  "/companies/:id": {
    PUT: {
      summary: "Update company",
      description: "Modify company profile information and settings",
    },
  },
  "/skills": {
    GET: {
      summary: "List skills",
      description:
        "Retrieve all skills in the system with categories and usage statistics",
    },
  },
  "/skills/:id": {
    PUT: {
      summary: "Update skill",
      description:
        "Modify skill information including name, category, and description",
    },
  },
  "/imports": {
    GET: {
      summary: "List import jobs",
      description:
        "Retrieve all data import operations with status and progress information",
    },
  },
  "/imports/:id/retry": {
    POST: {
      summary: "Retry failed import",
      description: "Restart a failed import job with the same configuration",
    },
  },
  "/audit-logs": {
    GET: {
      summary: "View audit logs",
      description:
        "Access system audit trail for security and compliance monitoring",
    },
  },
  "/subscriptions/extend-trial": {
    POST: {
      summary: "Extend trial period",
      description: "Grant additional trial days to a user account",
    },
  },

  // Search endpoints
  "/candidates": {
    GET: {
      summary: "Search candidates",
      description:
        "Full-text search across candidate profiles using PostgreSQL with ranking",
    },
  },
  "/skills": {
    GET: {
      summary: "Search skills",
      description:
        "Find skills by name or category with fuzzy matching support",
    },
  },

  // Pipeline endpoints
  "/stages": {
    GET: {
      summary: "Get pipeline stages",
      description:
        "Retrieve recruiter's custom pipeline stages with candidate counts",
    },
  },
  "/applications": {
    GET: {
      summary: "List applications",
      description: "Get all job applications in the recruiter's pipeline",
    },
  },
  "/pipeline/move": {
    PATCH: {
      summary: "Move candidate in pipeline",
      description: "Update candidate's position in the recruitment pipeline",
    },
  },

  // Recruiter endpoints
  "/candidates": {
    GET: {
      summary: "Recruiter candidates",
      description:
        "Get candidates assigned to or owned by the current recruiter",
    },
  },
  "/candidates/:id": {
    GET: {
      summary: "Recruiter candidate details",
      description:
        "View detailed candidate information with recruiter-specific data",
    },
  },
  "/pipeline": {
    GET: {
      summary: "Recruiter pipeline view",
      description:
        "Get recruiter's complete pipeline with stages and candidates",
    },
  },
  "/search": {
    GET: {
      summary: "Recruiter search",
      description:
        "Search within recruiter's candidate pool and accessible data",
    },
  },
  "/notifications": {
    GET: {
      summary: "Recruiter notifications",
      description: "Get notifications relevant to the current recruiter",
    },
  },
  "/notifications/:id/read": {
    POST: {
      summary: "Mark notification read",
      description: "Mark a specific notification as read by the recruiter",
    },
  },
  "/settings": {
    GET: {
      summary: "Recruiter settings",
      description: "Get recruiter's preferences and configuration options",
    },
  },

  // Job endpoints
  "/jobs": {
    GET: {
      summary: "List jobs",
      description:
        "Retrieve all job postings with filtering and status information",
    },
  },
  "/jobs/:id": {
    GET: {
      summary: "Get job details",
      description: "View detailed information about a specific job posting",
    },
  },
  "/jobs/:id/applications": {
    POST: {
      summary: "Apply to job",
      description: "Submit a candidate application for a specific job posting",
    },
  },
  "/jobs/:id/applications/:applicationId": {
    DELETE: {
      summary: "Remove application",
      description: "Withdraw or remove a candidate's application from a job",
    },
  },

  // Import sources
  "/sources": {
    GET: {
      summary: "List import sources",
      description: "Get available data import sources and their configurations",
    },
  },

  // Notification endpoints
  "/": {
    GET: {
      summary: "List notifications",
      description:
        "Retrieve user notifications with read status and timestamps",
    },
  },
  "/:id/read": {
    PUT: {
      summary: "Mark notification as read",
      description: "Update notification read status for the current user",
    },
  },

  // User profile
  "/profile": {
    GET: {
      summary: "Get user profile",
      description:
        "Retrieve complete user profile including company and recruiter information",
    },
  },
};

// Function to get better description for an endpoint
const getBetterDescription = (endpoint, method, filename) => {
  // Try exact match first
  if (
    endpointDescriptions[endpoint] &&
    endpointDescriptions[endpoint][method]
  ) {
    return endpointDescriptions[endpoint][method];
  }

  // Fallback descriptions based on patterns
  const methodLower = method.toLowerCase();
  const endpointLower = endpoint.toLowerCase();

  if (methodLower === "get" && endpoint === "/") {
    return {
      summary: `List ${filename.replace(".ts", "").replace(/s$/, "")}s`,
      description: `Retrieve all ${filename
        .replace(".ts", "")
        .replace(/s$/, "")}s with filtering and pagination support`,
    };
  }

  if (methodLower === "get" && endpoint.includes("/:id")) {
    const resource = filename.replace(".ts", "").replace(/s$/, "");
    return {
      summary: `Get ${resource} details`,
      description: `Retrieve detailed information about a specific ${resource}`,
    };
  }

  if (methodLower === "post" && endpoint === "/") {
    const resource = filename.replace(".ts", "").replace(/s$/, "");
    return {
      summary: `Create ${resource}`,
      description: `Add a new ${resource} to the system`,
    };
  }

  if (methodLower === "put" && endpoint.includes("/:id")) {
    const resource = filename.replace(".ts", "").replace(/s$/, "");
    return {
      summary: `Update ${resource}`,
      description: `Modify ${resource} information and attributes`,
    };
  }

  if (methodLower === "delete" && endpoint.includes("/:id")) {
    const resource = filename.replace(".ts", "").replace(/s$/, "");
    return {
      summary: `Delete ${resource}`,
      description: `Remove ${resource} from the system`,
    };
  }

  // Generic fallback
  return {
    summary: `${method.toUpperCase()} ${endpoint}`,
    description: `${
      method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
    } operation for ${endpoint}`,
  };
};

// Process each file
files.forEach((file) => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;

  console.log(`📝 Processing ${file}...`);

  // Find and replace generic descriptions
  const swaggerCommentRegex =
    /\/\*\*\s*\n\s*\*\s*@swagger\s*\n\s*\*\s*(.*?):\s*\n\s*\*\s*(\w+):\s*\n([\s\S]*?)\*\s*description:\s*Auto-generated endpoint documentation\s*\n([\s\S]*?)\*\//g;

  let match;
  while ((match = swaggerCommentRegex.exec(content)) !== null) {
    const endpoint = match[1].trim();
    const method = match[2].toUpperCase();
    const beforeDescription = match[3];
    const afterDescription = match[4];

    const betterDesc = getBetterDescription(endpoint, method, file);

    const updatedComment = `/**
 * @swagger
 * ${endpoint}:
 *   ${method.toLowerCase()}:
${beforeDescription} *     summary: ${betterDesc.summary}
 *     description: ${betterDesc.description}
${afterDescription} */`;

    content = content.replace(match[0], updatedComment);
    hasChanges = true;

    console.log(`  ✅ Updated ${method} ${endpoint}`);
  }

  // Also update generic summaries
  const genericSummaryRegex = /(\*\s*summary:\s*)([A-Z]+\s+\/[^\n]*)/g;
  content = content.replace(genericSummaryRegex, (match, prefix, summary) => {
    const parts = summary.split(" ");
    const method = parts[0];
    const endpoint = parts.slice(1).join(" ");
    const betterDesc = getBetterDescription(endpoint, method, file);
    hasChanges = true;
    return `${prefix}${betterDesc.summary}`;
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - Updated descriptions\n`);
  } else {
    console.log(`⏭️  ${file} - No changes needed\n`);
  }
});

console.log("🎉 Swagger description update complete!");
console.log("\n📚 Next steps:");
console.log("1. Review the updated descriptions in your route files");
console.log("2. Restart your API server to see updated documentation");
console.log(
  "3. Visit http://localhost:3001/api/docs to view the improved docs"
);
console.log("4. Customize any descriptions that need further refinement");
