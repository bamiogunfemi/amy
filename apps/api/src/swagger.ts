import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Amy - Recruitment Platform API",
      version: "1.0.0",
      description: `
        A comprehensive recruitment and candidate management platform API.
        
        ## Features
        - Dual tenancy (Solo/Company modes)
        - Multi-import capabilities (Google Drive, Airtable, Sheets, CSV)
        - Full-text search with PostgreSQL
        - Pipeline management with Kanban boards
        - Admin controls and user management
        - Trial & subscription management
        - Resume parsing and document handling
        - Audit logging
        
        ## Authentication
        This API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <your-token>\`
        
        ## Rate Limiting
        API requests are rate-limited to 100 requests per 15 minutes per IP address.
      `,
      contact: {
        name: "Amy Support",
        email: "support@amy.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development server",
      },
      {
        url: "https://api.amy.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "RECRUITER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE", "BLOCKED"] },
            companyId: { type: "string", format: "uuid", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Candidate: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            summary: { type: "string", nullable: true },
            experience: { type: "integer", minimum: 0 },
            source: {
              type: "string",
              enum: ["MANUAL", "GOOGLE_DRIVE", "AIRTABLE", "SHEETS", "CSV"],
            },
            ownerRecruiterId: { type: "string", format: "uuid" },
            companyId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skill: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      category: { type: "string" },
                    },
                  },
                },
              },
            },
            documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  originalName: { type: "string" },
                  mimeType: { type: "string" },
                  size: { type: "integer" },
                },
              },
            },
          },
        },
        PipelineStage: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            order: { type: "integer" },
            recruiterId: { type: "string", format: "uuid" },
            applications: {
              type: "array",
              items: { $ref: "#/components/schemas/Application" },
            },
          },
        },
        Application: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            candidateId: { type: "string", format: "uuid" },
            stageId: { type: "string", format: "uuid" },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            code: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        HealthCheck: {
          type: "object",
          properties: {
            status: { type: "string", example: "OK" },
            timestamp: { type: "string", format: "date-time" },
            environment: { type: "string", example: "development" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            name: { type: "string" },
            companyName: { type: "string" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Company: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            slug: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Skill: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            category: { type: "string" },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED", "CLOSED"] },
            recruiterId: { type: "string", format: "uuid" },
            companyId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            message: { type: "string" },
            read: { type: "boolean" },
            userId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Document: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            originalName: { type: "string" },
            mimeType: { type: "string" },
            size: { type: "integer" },
            url: { type: "string" },
            candidateId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
      responses: {
        Success: {
          description: "Operation successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Success" },
                },
              },
            },
          },
        },
        Created: {
          description: "Resource created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Created successfully" },
                  id: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        UnauthorizedError: {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        ValidationError: {
          description: "Invalid input data",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // AUTO-GENERATION: Scan route files for JSDoc comments
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const specs = swaggerJSDoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin: 20px 0; border-radius: 4px }
  `,
  customSiteTitle: "Amy API Documentation",
  customfavIcon: "/favicon.ico",
};
