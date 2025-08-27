#!/usr/bin/env node

/**
 * Fix Swagger JSDoc descriptions - remove duplicates and improve content
 * This script cleans up auto-generated descriptions and makes them professional
 */

const fs = require("fs");
const path = require("path");

const routesDir = path.join(__dirname, "../src/routes");
const files = fs.readdirSync(routesDir).filter((file) => file.endsWith(".ts"));

console.log("🔧 Fixing Swagger descriptions...\n");

// Enhanced endpoint descriptions with proper formatting
const endpointDescriptions = {
  // Auth endpoints
  "/auth/login": {
    summary: "User login",
    description:
      "Authenticate user with email and password, returns JWT tokens for API access",
  },
  "/auth/signup": {
    summary: "User registration",
    description:
      "Create a new user account with email verification and company setup",
  },
  "/auth/logout": {
    summary: "User logout",
    description: "Invalidate current JWT token and end user session",
  },
  "/auth/refresh": {
    summary: "Refresh JWT token",
    description:
      "Exchange refresh token for new access token to maintain authentication",
  },
  "/auth/me": {
    summary: "Get current user",
    description:
      "Retrieve profile information for the currently authenticated user",
  },

  // Generic patterns for candidates
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

  // Admin endpoints
  "/overview": {
    summary: "Admin dashboard overview",
    description:
      "Get system-wide statistics and metrics for administrative monitoring",
  },
  "/users": {
    summary: "List all users",
    description:
      "Retrieve all users in the system with filtering and pagination options",
  },
  "/users/block": {
    summary: "Block user account",
    description:
      "Suspend user access to the platform while preserving their data",
  },
  "/users/unblock": {
    summary: "Unblock user account",
    description: "Restore user access to the platform after suspension",
  },
  "/users/delete": {
    summary: "Delete user account",
    description: "Permanently remove user account and all associated data",
  },
  "/companies": {
    summary: "List companies",
    description: "Retrieve all companies registered on the platform",
  },
  "/companies/:id": {
    summary: "Update company",
    description: "Modify company profile information and settings",
  },
  "/skills": {
    summary: "List skills",
    description:
      "Retrieve all skills in the system with categories and usage statistics",
  },
  "/skills/:id": {
    summary: "Update skill",
    description:
      "Modify skill information including name, category, and description",
  },
  "/imports": {
    summary: "List import jobs",
    description:
      "Retrieve all data import operations with status and progress information",
  },
  "/imports/:id/retry": {
    summary: "Retry failed import",
    description: "Restart a failed import job with the same configuration",
  },
  "/audit-logs": {
    summary: "View audit logs",
    description:
      "Access system audit trail for security and compliance monitoring",
  },
  "/subscriptions/extend-trial": {
    summary: "Extend trial period",
    description: "Grant additional trial days to a user account",
  },

  // Other common endpoints
  "/profile": {
    summary: "Get user profile",
    description:
      "Retrieve complete user profile including company and recruiter information",
  },
  "/stages": {
    summary: "Get pipeline stages",
    description:
      "Retrieve recruiter's custom pipeline stages with candidate counts",
  },
  "/applications": {
    summary: "List applications",
    description: "Get all job applications in the recruiter's pipeline",
  },
  "/sources": {
    summary: "List import sources",
    description: "Get available data import sources and their configurations",
  },
  "/jobs": {
    summary: "List jobs",
    description:
      "Retrieve all job postings with filtering and status information",
  },
  "/jobs/:id": {
    summary: "Get job details",
    description: "View detailed information about a specific job posting",
  },
  "/pipeline/move": {
    summary: "Move candidate in pipeline",
    description: "Update candidate's position in the recruitment pipeline",
  },
  "/notifications": {
    summary: "List notifications",
    description: "Retrieve user notifications with read status and timestamps",
  },
  "/:id/read": {
    summary: "Mark notification as read",
    description: "Update notification read status for the current user",
  },
  "/settings": {
    summary: "Get user settings",
    description: "Retrieve user preferences and configuration options",
  },
  "/search": {
    summary: "Search candidates",
    description:
      "Full-text search across candidate profiles using PostgreSQL with ranking",
  },
};

function getDescription(endpoint, method, filename) {
  // Check for exact endpoint match
  if (endpointDescriptions[endpoint]) {
    if (
      typeof endpointDescriptions[endpoint] === "object" &&
      endpointDescriptions[endpoint][method]
    ) {
      return endpointDescriptions[endpoint][method];
    } else if (endpointDescriptions[endpoint].summary) {
      return endpointDescriptions[endpoint];
    }
  }

  // Fallback based on filename and method
  const resource = filename.replace(".ts", "").replace(/s$/, "");
  const methodLower = method.toLowerCase();

  if (methodLower === "get" && endpoint === "/") {
    return {
      summary: `List ${resource}s`,
      description: `Retrieve all ${resource}s with filtering and pagination support`,
    };
  }
  if (methodLower === "get" && endpoint.includes("/:id")) {
    return {
      summary: `Get ${resource} details`,
      description: `Retrieve detailed information about a specific ${resource}`,
    };
  }
  if (methodLower === "post" && endpoint === "/") {
    return {
      summary: `Create ${resource}`,
      description: `Add a new ${resource} to the system`,
    };
  }
  if (methodLower === "put" && endpoint.includes("/:id")) {
    return {
      summary: `Update ${resource}`,
      description: `Modify ${resource} information and attributes`,
    };
  }
  if (methodLower === "delete" && endpoint.includes("/:id")) {
    return {
      summary: `Delete ${resource}`,
      description: `Remove ${resource} from the system`,
    };
  }

  return {
    summary: `${method.toUpperCase()} ${endpoint}`,
    description: `${
      method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
    } operation for ${endpoint}`,
  };
}

// Process each file
files.forEach((file) => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;

  console.log(`📝 Processing ${file}...`);

  // Fix duplicate summary lines
  content = content.replace(
    /(\*\s*summary:\s*[^\n]*\n\s*\*\s*summary:\s*[^\n]*\n)/g,
    (match) => {
      const lines = match.split("\n");
      return lines[0] + "\n"; // Keep only the first summary line
    }
  );

  // Fix generic descriptions and summaries
  const swaggerBlocks = content.match(/\/\*\*[\s\S]*?\*\//g) || [];

  swaggerBlocks.forEach((block) => {
    if (block.includes("@swagger")) {
      const endpointMatch = block.match(/\*\s*(\/[^:]*?):\s*\n\s*\*\s*(\w+):/);
      if (endpointMatch) {
        const endpoint = endpointMatch[1].trim();
        const method = endpointMatch[2].toUpperCase();
        const desc = getDescription(endpoint, method, file);

        let newBlock = block;

        // Update summary
        if (newBlock.includes("summary:")) {
          newBlock = newBlock.replace(
            /(\*\s*summary:\s*)[^\n]*/g,
            `$1${desc.summary}`
          );
        }

        // Update description
        if (newBlock.includes("description:")) {
          newBlock = newBlock.replace(
            /(\*\s*description:\s*)[^\n]*/g,
            `$1${desc.description}`
          );
        }

        if (newBlock !== block) {
          content = content.replace(block, newBlock);
          hasChanges = true;
          console.log(`  ✅ Updated ${method} ${endpoint}: ${desc.summary}`);
        }
      }
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - Fixed descriptions\n`);
  } else {
    console.log(`⏭️  ${file} - No changes needed\n`);
  }
});

console.log("🎉 Swagger description fix complete!");
console.log("\n📚 Next steps:");
console.log("1. Restart your API server: make dev-api");
console.log("2. View updated documentation: make swagger-open");
console.log("3. All descriptions are now professional and meaningful!");
