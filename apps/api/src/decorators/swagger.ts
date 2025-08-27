import { Request, Response } from "express";

// Types for Swagger documentation
export interface SwaggerEndpoint {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  summary: string;
  description?: string;
  tags?: string[];
  requestBody?: any;
  responses?: any;
  parameters?: any[];
  security?: any[];
}

// Store for collecting endpoint metadata
export const swaggerEndpoints: SwaggerEndpoint[] = [];

// Decorator for API endpoints
export function ApiEndpoint(config: Partial<SwaggerEndpoint>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // Extract route information from the method
    const endpoint: SwaggerEndpoint = {
      method: config.method || "get",
      path: config.path || "/",
      summary: config.summary || `${propertyKey} endpoint`,
      description: config.description,
      tags: config.tags || ["API"],
      requestBody: config.requestBody,
      responses: config.responses || {
        200: { description: "Success" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
      },
      parameters: config.parameters,
      security: config.security,
    };

    // Store the endpoint metadata
    swaggerEndpoints.push(endpoint);

    // Return the original method
    descriptor.value = async function (req: Request, res: Response, next: any) {
      try {
        return await originalMethod.call(this, req, res, next);
      } catch (error) {
        next(error);
      }
    };

    return descriptor;
  };
}

// Decorator for request body validation
export function RequestBody(schema: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // This would integrate with your existing validation logic
    return descriptor;
  };
}

// Decorator for response schema
export function Response(
  statusCode: number,
  schema: any,
  description?: string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // This would add response schema to the endpoint metadata
    return descriptor;
  };
}

// Function to generate OpenAPI spec from collected endpoints
export function generateOpenApiSpec() {
  const paths: any = {};

  swaggerEndpoints.forEach((endpoint) => {
    if (!paths[endpoint.path]) {
      paths[endpoint.path] = {};
    }

    paths[endpoint.path][endpoint.method] = {
      tags: endpoint.tags,
      summary: endpoint.summary,
      description: endpoint.description,
      requestBody: endpoint.requestBody,
      responses: endpoint.responses,
      parameters: endpoint.parameters,
      security: endpoint.security,
    };
  });

  return {
    openapi: "3.0.0",
    info: {
      title: "Amy API",
      version: "1.0.0",
    },
    paths,
  };
}

// Example usage:
/*
class AuthController {
  @ApiEndpoint({
    method: 'post',
    path: '/auth/login',
    summary: 'User login',
    description: 'Authenticate user and receive JWT tokens',
    tags: ['Authentication'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 8 }
            }
          }
        }
      }
    },
    security: []
  })
  async login(req: Request, res: Response) {
    // Login logic here
  }
}
*/
