#!/usr/bin/env node

/**
 * Auto-generate Swagger JSDoc comments for existing API routes
 * This script scans route files and adds basic JSDoc comments for endpoints
 */

const fs = require("fs");
const path = require("path");

const routesDir = path.join(__dirname, "../src/routes");
const files = fs.readdirSync(routesDir).filter((file) => file.endsWith(".ts"));

console.log("🚀 Generating Swagger JSDoc comments...\n");

// Template for basic JSDoc comment
const generateJSDoc = (method, endpoint, tag, summary, requiresAuth = true) => {
  const authSecurity = requiresAuth ? "" : "\n *     security: []";

  // Standard responses based on HTTP method
  let responses = "";
  if (method === "get") {
    responses = `
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  } else if (method === "post") {
    responses = `
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  } else if (method === "put") {
    responses = `
 *       200:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  } else if (method === "delete") {
    responses = `
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  } else if (method === "patch") {
    responses = `
 *       200:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  } else {
    // Default responses
    responses = `
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`;
  }

  return `/**
 * @swagger
 * ${endpoint}:
 *   ${method}:
 *     tags:
 *       - ${tag}
 *     summary: ${summary}
 *     description: Auto-generated endpoint documentation
 *     responses:${responses}${authSecurity}
 */`;
};

// Route patterns to detect
const routePatterns = [
  { pattern: /router\.get\s*\(\s*["']([^"']+)["']/, method: "get" },
  { pattern: /router\.post\s*\(\s*["']([^"']+)["']/, method: "post" },
  { pattern: /router\.put\s*\(\s*["']([^"']+)["']/, method: "put" },
  { pattern: /router\.delete\s*\(\s*["']([^"']+)["']/, method: "delete" },
  { pattern: /router\.patch\s*\(\s*["']([^"']+)["']/, method: "patch" },
];

files.forEach((file) => {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  // Skip if already has swagger comments
  if (content.includes("@swagger")) {
    console.log(`✅ ${file} - Already has Swagger comments`);
    return;
  }

  const tag = file
    .replace(".ts", "")
    .replace(/[.-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  let newContent = content;
  let hasChanges = false;

  routePatterns.forEach(({ pattern, method }) => {
    const matches = [...content.matchAll(new RegExp(pattern.source, "g"))];

    matches.forEach((match) => {
      const endpoint = match[1];
      const summary = `${method.toUpperCase()} ${endpoint}`;
      const jsDocComment = generateJSDoc(method, endpoint, tag, summary);

      // Insert JSDoc comment before the router method
      const routerMethodRegex = new RegExp(
        `(router\\.${method}\\s*\\(\\s*["']${endpoint.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}["'])`,
        "g"
      );

      if (!newContent.includes(`@swagger\n * ${endpoint}:`)) {
        newContent = newContent.replace(
          routerMethodRegex,
          `${jsDocComment}\n$1`
        );
        hasChanges = true;
        console.log(`  📝 Added: ${method.toUpperCase()} ${endpoint}`);
      }
    });
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ ${file} - Updated with Swagger comments\n`);
  } else {
    console.log(`⏭️  ${file} - No routes found\n`);
  }
});

console.log("🎉 Swagger JSDoc generation complete!");
console.log("\n📚 Next steps:");
console.log("1. Review the generated comments in your route files");
console.log("2. Customize descriptions, request/response schemas as needed");
console.log("3. Restart your API server to see updated documentation");
console.log("4. Visit http://localhost:3001/api/docs to view the docs");
