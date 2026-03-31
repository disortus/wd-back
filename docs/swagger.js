import { version } from "mongoose";
import { Component } from "react";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Apple replica(ARPLC) store API",
            version: "1.0.0",
            description: "API for online order and delivery service"
        },
        servers: [
            {
                url: "http://localhost:5000/api"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["../src/routers/*.js", "./schemas/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);