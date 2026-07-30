
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "n8n Public API",
      "description": "n8n Public API",
      "termsOfService": "https://n8n.io/legal/#terms",
      "contact": {
        "email": "hello@n8n.io"
      },
      "license": {
        "name": "Sustainable Use License",
        "url": "https://github.com/n8n-io/n8n/blob/master/LICENSE.md"
      },
      "version": "1.1.1"
    },
    "servers": [
      {
        "url": "/api/v1",
        "description": "Current n8n instance (self-hosted built-in playground)"
      },
      {
        "url": "{url}/api/v1",
        "description": "Self-hosted n8n instance",
        "variables": {
          "url": {
            "default": "https://example.com"
          }
        }
      }
    ],
    "security": [
      {
        "ApiKeyAuth": []
      },
      {
        "BearerAuth": []
      }
    ],
    "tags": [
      {
        "name": "Audit",
        "description": "Operations about security audit"
      },
      {
        "name": "CommunityPackage",
        "description": "Operations about community packages"
      },
      {
        "name": "Credential",
        "description": "Operations about credentials"
      },
      {
        "name": "DataTable",
        "description": "Operations about data tables and their rows"
      },
      {
        "name": "Discover",
        "description": "API capability discovery"
      },
      {
        "name": "Evaluation",
        "description": "Operations about evaluation test runs"
      },
      {
        "name": "Execution",
        "description": "Operations about executions"
      },
      {
        "name": "Folders",
        "description": "Operations about folders"
      },
      {
        "name": "Insights",
        "description": "Operations about insights"
      },
      {
        "name": "LogStreaming",
        "description": "Operations about log streaming destinations"
      },
      {
        "name": "N8nPackage",
        "description": "Beta — breaking changes may still occur without major version bump."
      },
      {
        "name": "Projects",
        "description": "Operations about projects"
      },
      {
        "name": "SecurityPolicy",
        "description": "Operations about the instance security policy settings"
      },
      {
        "name": "SettingsSsoSaml",
        "description": "Operations about SAML SSO settings"
      },
      {
        "name": "SourceControl",
        "description": "Operations about source control"
      },
      {
        "name": "Tags",
        "description": "Operations about tags"
      },
      {
        "name": "User",
        "description": "Operations about users"
      },
      {
        "name": "Variables",
        "description": "Operations about variables"
      },
      {
        "name": "Workflow",
        "description": "Operations about workflows"
      }
    ],
    "externalDocs": {
      "description": "n8n API documentation",
      "url": "https://docs.n8n.io/api/"
    },
    "paths": {
      "/audit": {
        "post": {
          "x-eov-operation-id": "generateAudit",
          "x-required-scope": "securityAudit:generate",
          "x-eov-operation-handler": "v1/handlers/audit/audit.handler",
          "tags": [
            "Audit"
          ],
          "summary": "Generate an audit",
          "description": "Generate a security audit for your n8n instance.",
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "additionalOptions": {
                      "type": "object",
                      "properties": {
                        "daysAbandonedWorkflow": {
                          "type": "integer",
                          "description": "Days for a workflow to be considered abandoned if not executed"
                        },
                        "categories": {
                          "type": "array",
                          "items": {
                            "type": "string",
                            "enum": [
                              "credentials",
                              "database",
                              "nodes",
                              "filesystem",
                              "instance"
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/audit"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "500": {
              "description": "Internal server error."
            }
          }
        }
      },
      "/settings/security-policy": {
        "get": {
          "x-eov-operation-id": "getSecurityPolicy",
          "x-required-scope": "securitySettings:manage",
          "x-eov-operation-handler": "v1/handlers/security-policy/security-policy.handler",
          "tags": [
            "SecurityPolicy"
          ],
          "summary": "Retrieve the security policy",
          "description": "Retrieve the instance security policy: personal-space publishing and sharing, the execution-data redaction enforcement floor, and the read-only usage counts shown in the UI. Requires the `securitySettings:manage` scope and the Personal Space Policy feature to be licensed.\n",
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/security-policy"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateSecurityPolicy",
          "x-required-scope": "securitySettings:manage",
          "x-eov-operation-handler": "v1/handlers/security-policy/security-policy.handler",
          "tags": [
            "SecurityPolicy"
          ],
          "summary": "Set the security policy",
          "description": "Replace the instance security policy with the provided full object. Every writable field must be sent. Read-only usage counts from GET are ignored if included, so a GET response can be sent back as a PUT body. The update takes effect exactly as it would from the UI, using the same validation. Requires the `securitySettings:manage` scope and the Personal Space Policy feature to be licensed. When the group is managed via environment variables, the write is rejected with 409 and no changes are made; a read still returns the current values.\n",
          "requestBody": {
            "description": "The full security policy to set.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/security-policy.update"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/security-policy"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/settings/sso/saml": {
        "get": {
          "x-eov-operation-id": "getSamlConfiguration",
          "x-required-scope": "saml:manage",
          "x-eov-operation-handler": "v1/handlers/sso-saml/sso-saml.handler",
          "tags": [
            "SettingsSsoSaml"
          ],
          "summary": "Retrieve the SAML SSO configuration",
          "description": "Retrieve the current SAML SSO configuration, including every field exposed in the UI plus the service provider entity ID and ACS return URL. Signing private keys, signing certificates, and identity provider metadata are redacted on read. Requires the `saml:manage` scope and the SAML feature to be licensed.\n",
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/saml-configuration"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateSamlConfiguration",
          "x-required-scope": "saml:manage",
          "x-eov-operation-handler": "v1/handlers/sso-saml/sso-saml.handler",
          "tags": [
            "SettingsSsoSaml"
          ],
          "summary": "Set the SAML SSO configuration",
          "description": "Replace the SAML SSO configuration with the provided full object. Every writable field must be sent; use empty strings or empty arrays when a value is unset. Read-only `entityID` / `returnUrl` from GET are ignored if included, so a GET response can be sent back as a PUT body. Redacted secret placeholders keep the stored values unchanged. The update takes effect exactly as it would from the UI, using the same validation. Requires the `saml:manage` scope and the SAML feature to be licensed. When the configuration is managed via environment variables, the write is rejected with 409 and no changes are made.\n",
          "requestBody": {
            "description": "The full SAML SSO configuration to set.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/saml-configuration.update"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/saml-configuration"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/credentials": {
        "get": {
          "operationId": "getCredentials",
          "x-eov-operation-id": "getCredentials",
          "x-required-scope": "credential:list",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "List credentials",
          "description": "Retrieve all credentials from your instance. Only available for the instance owner and admin. Credential data (secrets) is not included.",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/credentialList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        },
        "post": {
          "operationId": "createCredential",
          "x-eov-operation-id": "createCredential",
          "x-required-scope": "credential:create",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Create a credential",
          "description": "Creates a credential that can be used by nodes of the specified type.",
          "requestBody": {
            "description": "Credential to be created.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/credentialCreate"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/create-credential-response"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "415": {
              "description": "Unsupported media type."
            }
          }
        }
      },
      "/credentials/{id}": {
        "get": {
          "x-eov-operation-id": "getCredential",
          "x-required-scope": "credential:read",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Get credential by ID",
          "description": "Retrieves a credential by ID. Credential data (secrets) is not included.",
          "operationId": "getCredential",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The credential ID",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/create-credential-response"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "patch": {
          "x-eov-operation-id": "updateCredential",
          "x-required-scope": "credential:update",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Update credential by ID",
          "description": "Updates an existing credential. You must be the owner of the credential.",
          "operationId": "updateCredential",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The credential ID that needs to be updated",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Credential data to update. All fields are optional.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/update-credential-request"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/create-credential-response"
                  }
                }
              }
            },
            "400": {
              "description": "Bad request - invalid credential type or data."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteCredential",
          "x-required-scope": "credential:delete",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Delete credential by ID",
          "description": "Deletes a credential from your instance. You must be the owner of the credentials",
          "operationId": "deleteCredential",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The credential ID that needs to be deleted",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/credential"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/credentials/{id}/test": {
        "post": {
          "x-eov-operation-id": "testCredential",
          "x-required-scope": "credential:read",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Test credential by ID",
          "description": "Tests a credential by ID using the stored credential data.",
          "operationId": "testCredential",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The credential ID",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/credentialTestResponse"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/credentials/schema/{credentialTypeName}": {
        "get": {
          "x-eov-operation-id": "getCredentialType",
          "x-required-scope": "none",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Show credential data schema",
          "parameters": [
            {
              "name": "credentialTypeName",
              "in": "path",
              "description": "The credential type name that you want to get the schema for",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  },
                  "examples": {
                    "freshdeskApi": {
                      "value": {
                        "additionalProperties": false,
                        "type": "object",
                        "properties": {
                          "apiKey": {
                            "type": "string"
                          },
                          "domain": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "apiKey",
                          "domain"
                        ]
                      }
                    },
                    "slackOAuth2Api": {
                      "value": {
                        "additionalProperties": false,
                        "type": "object",
                        "properties": {
                          "clientId": {
                            "type": "string"
                          },
                          "clientSecret": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "clientId",
                          "clientSecret"
                        ]
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/credentials/{id}/transfer": {
        "put": {
          "x-eov-operation-id": "transferCredential",
          "x-required-scope": "credential:move",
          "x-eov-operation-handler": "v1/handlers/credentials/credentials.handler",
          "tags": [
            "Credential"
          ],
          "summary": "Transfer a credential to another project.",
          "description": "Transfer a credential to another project.",
          "parameters": [
            {
              "$ref": "#/components/parameters/credentialId"
            }
          ],
          "requestBody": {
            "description": "Destination project for the credential transfer.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "destinationProjectId": {
                      "type": "string",
                      "description": "The ID of the project to transfer the credential to."
                    }
                  },
                  "required": [
                    "destinationProjectId"
                  ]
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/executions": {
        "get": {
          "x-eov-operation-id": "getExecutions",
          "x-required-scope": "execution:list",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Retrieve all executions",
          "description": "Retrieve all executions from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/includeData"
            },
            {
              "name": "ignoreDataSizeLimit",
              "in": "query",
              "description": "Whether to return the full execution data even if it exceeds the configured size limit (EXECUTIONS_DATA_MAX_DISPLAY_SIZE). Oversized executions are otherwise returned without their data.",
              "required": false,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "$ref": "#/components/parameters/redactExecutionData"
            },
            {
              "name": "status",
              "in": "query",
              "description": "Status to filter the executions by.",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "canceled",
                  "crashed",
                  "error",
                  "new",
                  "running",
                  "success",
                  "unknown",
                  "waiting"
                ]
              }
            },
            {
              "name": "workflowId",
              "in": "query",
              "description": "Workflow to filter the executions by.",
              "required": false,
              "schema": {
                "type": "string",
                "example": "1000"
              }
            },
            {
              "name": "projectId",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "VmwOO9HeTEj20kxM"
              }
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/executionList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/executions/{id}": {
        "get": {
          "x-eov-operation-id": "getExecution",
          "x-required-scope": "execution:read",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Retrieve an execution",
          "description": "Retrieve an execution from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            },
            {
              "$ref": "#/components/parameters/includeData"
            },
            {
              "name": "ignoreDataSizeLimit",
              "in": "query",
              "description": "Whether to return the full execution data even if it exceeds the configured size limit (EXECUTIONS_DATA_MAX_DISPLAY_SIZE). Oversized executions are otherwise returned without their data.",
              "required": false,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "$ref": "#/components/parameters/redactExecutionData"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/execution"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteExecution",
          "x-required-scope": "execution:delete",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Delete an execution",
          "description": "Deletes an execution from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/execution"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/executions/{id}/retry": {
        "post": {
          "x-eov-operation-id": "retryExecution",
          "x-required-scope": "execution:retry",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Retry an execution",
          "description": "Retry an execution from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            }
          ],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "loadWorkflow": {
                      "type": "boolean",
                      "description": "Whether to load the currently saved workflow to execute instead of the one saved at the time of the execution. If set to true, it will retry with the latest version of the workflow."
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/execution"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/executions/{id}/stop": {
        "post": {
          "x-eov-operation-id": "stopExecution",
          "x-required-scope": "execution:stop",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Stop an execution",
          "description": "Stop an execution by id.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/execution"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/executions/stop": {
        "post": {
          "x-eov-operation-id": "stopManyExecutions",
          "x-required-scope": "execution:stop",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Stop multiple executions",
          "description": "Stop multiple executions from your instance based on filter criteria.",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "status"
                  ],
                  "properties": {
                    "status": {
                      "type": "array",
                      "description": "Array of execution statuses to stop. Must include at least one status.",
                      "items": {
                        "type": "string",
                        "enum": [
                          "queued",
                          "running",
                          "waiting"
                        ]
                      },
                      "example": [
                        "queued",
                        "running",
                        "waiting"
                      ]
                    },
                    "workflowId": {
                      "type": "string",
                      "description": "Optional workflow ID to filter executions. If not provided, will stop executions across all accessible workflows.",
                      "example": "2tUt1wbLX592XDdX"
                    },
                    "startedAfter": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Only stop executions that started after this time.",
                      "example": "2024-01-01T00:00:00.000Z"
                    },
                    "startedBefore": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Only stop executions that started before this time.",
                      "example": "2024-12-31T23:59:59.999Z"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "stopped": {
                        "type": "number",
                        "description": "The number of executions that were successfully stopped.",
                        "example": 5
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/executions/{id}/tags": {
        "get": {
          "x-eov-operation-id": "getExecutionTags",
          "x-required-scope": "executionTags:list",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Get execution tags",
          "description": "Get annotation tags for an execution.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            }
          ],
          "responses": {
            "200": {
              "description": "List of annotation tags",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/executionTags"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateExecutionTags",
          "x-required-scope": "executionTags:update",
          "x-eov-operation-handler": "v1/handlers/executions/executions.handler",
          "tags": [
            "Execution"
          ],
          "summary": "Update tags of an execution",
          "description": "Update annotation tags of an execution.",
          "parameters": [
            {
              "$ref": "#/components/parameters/executionId"
            }
          ],
          "requestBody": {
            "description": "List of annotation tag IDs",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/tagIds"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "List of tags after updating",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/executionTags"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/tags": {
        "post": {
          "x-eov-operation-id": "createTag",
          "x-required-scope": "tag:create",
          "x-eov-operation-handler": "v1/handlers/tags/tags.handler",
          "tags": [
            "Tags"
          ],
          "summary": "Create a tag",
          "description": "Create a tag in your instance.",
          "requestBody": {
            "description": "Created tag object.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/tag"
                }
              }
            },
            "required": true
          },
          "responses": {
            "201": {
              "description": "A tag object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/tag"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getTags",
          "x-required-scope": "tag:list",
          "x-eov-operation-handler": "v1/handlers/tags/tags.handler",
          "tags": [
            "Tags"
          ],
          "summary": "Retrieve all tags",
          "description": "Retrieve all tags from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/tagList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/tags/{id}": {
        "get": {
          "x-eov-operation-id": "getTag",
          "x-required-scope": "tag:read",
          "x-eov-operation-handler": "v1/handlers/tags/tags.handler",
          "tags": [
            "Tags"
          ],
          "summary": "Retrieves a tag",
          "description": "Retrieves a tag.",
          "parameters": [
            {
              "$ref": "#/components/parameters/tagId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/tag"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteTag",
          "x-required-scope": "tag:delete",
          "x-eov-operation-handler": "v1/handlers/tags/tags.handler",
          "tags": [
            "Tags"
          ],
          "summary": "Delete a tag",
          "description": "Deletes a tag.",
          "parameters": [
            {
              "$ref": "#/components/parameters/tagId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/tag"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateTag",
          "x-required-scope": "tag:update",
          "x-eov-operation-handler": "v1/handlers/tags/tags.handler",
          "tags": [
            "Tags"
          ],
          "summary": "Update a tag",
          "description": "Update a tag.",
          "parameters": [
            {
              "$ref": "#/components/parameters/tagId"
            }
          ],
          "requestBody": {
            "description": "Updated tag object.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/tag"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Tag object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/tag"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/workflows": {
        "post": {
          "x-eov-operation-id": "createWorkflow",
          "x-required-scope": "workflow:create",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Create a workflow",
          "description": "Create a workflow in your instance.",
          "requestBody": {
            "description": "Created workflow object.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/workflowCreate"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "A workflow object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getWorkflows",
          "x-required-scope": "workflow:list",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Retrieve all workflows",
          "description": "Retrieve all workflows from your instance.",
          "parameters": [
            {
              "name": "active",
              "in": "query",
              "schema": {
                "type": "boolean",
                "example": true
              }
            },
            {
              "name": "tags",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "test,production"
              }
            },
            {
              "name": "name",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "My Workflow"
              }
            },
            {
              "name": "projectId",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "VmwOO9HeTEj20kxM"
              }
            },
            {
              "name": "excludePinnedData",
              "in": "query",
              "required": false,
              "description": "Set this to avoid retrieving pinned data",
              "schema": {
                "type": "boolean",
                "example": true
              }
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflowList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/workflows/{id}": {
        "get": {
          "x-eov-operation-id": "getWorkflow",
          "x-required-scope": "workflow:read",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Retrieve a workflow",
          "description": "Retrieve a workflow.",
          "parameters": [
            {
              "name": "excludePinnedData",
              "in": "query",
              "required": false,
              "description": "Set this to avoid retrieving pinned data",
              "schema": {
                "type": "boolean",
                "example": true
              }
            },
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteWorkflow",
          "x-required-scope": "workflow:delete",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Delete a workflow",
          "description": "Delete a workflow.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateWorkflow",
          "x-required-scope": "workflow:update",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Update a workflow",
          "description": "Update a workflow. If the workflow is published, the updated version will be automatically re-published.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "requestBody": {
            "description": "Updated workflow object.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/workflow"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Workflow object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/{versionId}": {
        "get": {
          "x-eov-operation-id": "getWorkflowVersion",
          "x-required-scope": "workflow:read",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Retrieves a specific version of a workflow",
          "description": "Retrieves a specific version of a workflow from workflow history.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            },
            {
              "name": "versionId",
              "in": "path",
              "required": true,
              "description": "The version ID to retrieve",
              "schema": {
                "type": "string"
              },
              "example": "abc123-def456-ghi789"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflowVersion"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/activate": {
        "post": {
          "x-eov-operation-id": "activateWorkflow",
          "x-required-scope": "workflow:activate",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Publish a workflow",
          "description": "Publish a workflow. In n8n v1, this action was termed activating a workflow.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "requestBody": {
            "description": "Optional parameters to publish the workflow.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "versionId": {
                      "type": "string",
                      "description": "The specific version ID to activate or publish. If not provided, the latest version is used."
                    },
                    "name": {
                      "type": "string",
                      "description": "Optional name for the workflow version during activation."
                    },
                    "description": {
                      "type": "string",
                      "description": "Optional description for the workflow version during activation."
                    }
                  }
                }
              }
            },
            "required": false
          },
          "responses": {
            "200": {
              "description": "Workflow object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/deactivate": {
        "post": {
          "x-eov-operation-id": "deactivateWorkflow",
          "x-required-scope": "workflow:deactivate",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Deactivate a workflow",
          "description": "Deactivate a workflow.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "Workflow object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/archive": {
        "post": {
          "x-eov-operation-id": "archiveWorkflow",
          "x-required-scope": "workflow:delete",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Archive a workflow",
          "description": "Soft-deletes a workflow by archiving it. Idempotent: archiving an\nalready archived workflow returns 200 with the current workflow.\n\nRequires API key scope `workflow:delete`.\n",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "Archived workflow",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/unarchive": {
        "post": {
          "x-eov-operation-id": "unarchiveWorkflow",
          "x-required-scope": "workflow:delete",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Unarchive a workflow",
          "description": "Restores an archived workflow.\n\nRequires API key scope `workflow:delete`.\n",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "Unarchived workflow",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflow"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/transfer": {
        "put": {
          "x-eov-operation-id": "transferWorkflow",
          "x-required-scope": "workflow:move",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Transfer a workflow to another project",
          "description": "Transfer a workflow to another project",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "requestBody": {
            "description": "Destination project information for the workflow transfer.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "destinationProjectId": {
                      "type": "string",
                      "description": "The ID of the project to transfer the workflow to."
                    }
                  },
                  "required": [
                    "destinationProjectId"
                  ]
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/tags": {
        "get": {
          "x-eov-operation-id": "getWorkflowTags",
          "x-required-scope": "workflowTags:list",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Get workflow tags",
          "description": "Get workflow tags.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "responses": {
            "200": {
              "description": "List of tags",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflowTags"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateWorkflowTags",
          "x-required-scope": "workflowTags:update",
          "x-eov-operation-handler": "v1/handlers/workflows/workflows.handler",
          "tags": [
            "Workflow"
          ],
          "summary": "Update tags of a workflow",
          "description": "Update tags of a workflow.",
          "parameters": [
            {
              "$ref": "#/components/parameters/workflowId"
            }
          ],
          "requestBody": {
            "description": "List of tags",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/tagIds"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "List of tags after add the tag",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/workflowTags"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/test-runs": {
        "get": {
          "x-eov-operation-id": "getTestRuns",
          "x-required-scope": "testRun:list",
          "x-eov-operation-handler": "v1/handlers/evaluations/evaluations.handler",
          "tags": [
            "Evaluation"
          ],
          "summary": "Retrieve test runs",
          "description": "Retrieve the evaluation test runs of a workflow.",
          "parameters": [
            {
              "$ref": "#/components/parameters/testRunWorkflowId"
            },
            {
              "name": "status",
              "in": "query",
              "description": "Status to filter the test runs by.",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "new",
                  "running",
                  "completed",
                  "error",
                  "cancelled"
                ]
              }
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/testRunList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "post": {
          "x-eov-operation-id": "createTestRun",
          "x-required-scope": "testRun:create",
          "x-eov-operation-handler": "v1/handlers/evaluations/evaluations.handler",
          "tags": [
            "Evaluation"
          ],
          "summary": "Trigger a test run",
          "description": "Start a new evaluation test run for a workflow. The workflow must contain a configured evaluation trigger. Requires the `workflow:execute` project scope in addition to the `testRun:create` API key scope.",
          "parameters": [
            {
              "$ref": "#/components/parameters/testRunWorkflowId"
            }
          ],
          "responses": {
            "201": {
              "description": "Test run triggered.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/testRun"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "402": {
              "$ref": "#/components/responses/paymentRequired"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/workflows/{id}/test-runs/{runId}": {
        "get": {
          "x-eov-operation-id": "getTestRun",
          "x-required-scope": "testRun:read",
          "x-eov-operation-handler": "v1/handlers/evaluations/evaluations.handler",
          "tags": [
            "Evaluation"
          ],
          "summary": "Retrieve a test run",
          "description": "Retrieve a single evaluation test run of a workflow, including its aggregated metrics and final result.",
          "parameters": [
            {
              "$ref": "#/components/parameters/testRunWorkflowId"
            },
            {
              "$ref": "#/components/parameters/testRunId"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/testRunSummary"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/workflows/{id}/test-runs/{runId}/cancel": {
        "post": {
          "x-eov-operation-id": "cancelTestRun",
          "x-required-scope": "testRun:cancel",
          "x-eov-operation-handler": "v1/handlers/evaluations/evaluations.handler",
          "tags": [
            "Evaluation"
          ],
          "summary": "Cancel a test run",
          "description": "Cancel a running evaluation test run of a workflow. Requires the `workflow:execute` project scope in addition to the `testRun:cancel` API key scope.",
          "parameters": [
            {
              "$ref": "#/components/parameters/testRunWorkflowId"
            },
            {
              "$ref": "#/components/parameters/testRunId"
            }
          ],
          "responses": {
            "202": {
              "description": "Cancellation requested.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/testRunCancel"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/workflows/{id}/test-runs/{runId}/test-cases": {
        "get": {
          "x-eov-operation-id": "getTestCases",
          "x-required-scope": "testRun:read",
          "x-eov-operation-handler": "v1/handlers/evaluations/evaluations.handler",
          "tags": [
            "Evaluation"
          ],
          "summary": "Retrieve test run cases",
          "description": "Retrieve the per-case results of an evaluation test run.",
          "parameters": [
            {
              "$ref": "#/components/parameters/testRunWorkflowId"
            },
            {
              "$ref": "#/components/parameters/testRunId"
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/testCaseExecutionList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/users": {
        "get": {
          "x-eov-operation-id": "getUsers",
          "x-required-scope": "user:list",
          "x-eov-operation-handler": "v1/handlers/users/users.handler.ee",
          "tags": [
            "User"
          ],
          "summary": "Retrieve all users",
          "description": "Retrieve all users from your instance. Only available for the instance owner.",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/offset"
            },
            {
              "$ref": "#/components/parameters/cursor"
            },
            {
              "$ref": "#/components/parameters/includeRole"
            },
            {
              "name": "projectId",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "VmwOO9HeTEj20kxM"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/userList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        },
        "post": {
          "x-eov-operation-id": "createUser",
          "x-required-scope": "user:create",
          "x-eov-operation-handler": "v1/handlers/users/users.handler.ee",
          "tags": [
            "User"
          ],
          "summary": "Create multiple users",
          "description": "Create one or more users.",
          "requestBody": {
            "description": "Array of users to be created.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "email": {
                        "type": "string",
                        "format": "email"
                      },
                      "role": {
                        "type": "string",
                        "example": "global:member"
                      }
                    },
                    "required": [
                      "email"
                    ]
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "user": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string"
                          },
                          "email": {
                            "type": "string"
                          },
                          "inviteAcceptUrl": {
                            "type": "string"
                          },
                          "emailSent": {
                            "type": "boolean"
                          }
                        }
                      },
                      "error": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        }
      },
      "/users/{id}": {
        "get": {
          "x-eov-operation-id": "getUser",
          "x-required-scope": "user:read",
          "x-eov-operation-handler": "v1/handlers/users/users.handler.ee",
          "tags": [
            "User"
          ],
          "summary": "Get user by ID/Email",
          "description": "Retrieve a user from your instance. Only available for the instance owner.",
          "parameters": [
            {
              "$ref": "#/components/parameters/userIdentifier"
            },
            {
              "$ref": "#/components/parameters/includeRole"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/user"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteUser",
          "x-required-scope": "user:delete",
          "x-eov-operation-handler": "v1/handlers/users/users.handler.ee",
          "tags": [
            "User"
          ],
          "summary": "Delete a user",
          "description": "Delete a user from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/userIdentifier"
            }
          ],
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/users/{id}/role": {
        "patch": {
          "x-eov-operation-id": "changeRole",
          "x-required-scope": "user:changeRole",
          "x-eov-operation-handler": "v1/handlers/users/users.handler.ee",
          "tags": [
            "User"
          ],
          "summary": "Change a user's global role",
          "description": "Change a user's global role",
          "parameters": [
            {
              "$ref": "#/components/parameters/userIdentifier"
            }
          ],
          "requestBody": {
            "description": "New role for the user",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "newRoleName": {
                      "type": "string",
                      "example": "global:member"
                    }
                  },
                  "required": [
                    "newRoleName"
                  ]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/source-control/pull": {
        "post": {
          "x-eov-operation-id": "pull",
          "x-required-scope": "sourceControl:pull",
          "x-eov-operation-handler": "v1/handlers/source-control/source-control.handler",
          "tags": [
            "SourceControl"
          ],
          "summary": "Pull changes from the remote repository",
          "description": "Requires the Source Control feature to be licensed and connected to a repository.",
          "requestBody": {
            "description": "Pull options",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/pull"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Pull result containing the list of files that were pulled from the remote repository.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/pullResult"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "409": {
              "description": "Conflict due to uncommitted local changes or merge conflicts. The response body lists every file in the pull diff; files causing the conflict have `conflict: true` or `status: modified`. Retry with `force=true` to discard local changes.\n",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/pullResult"
                  }
                }
              }
            }
          }
        }
      },
      "/variables": {
        "post": {
          "x-eov-operation-id": "createVariable",
          "x-required-scope": "variable:create",
          "x-eov-operation-handler": "v1/handlers/variables/variables.handler",
          "tags": [
            "Variables"
          ],
          "summary": "Create a variable",
          "description": "Create a variable in your instance.",
          "requestBody": {
            "description": "Payload for variable to create.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/variable.create"
                }
              }
            },
            "required": true
          },
          "responses": {
            "201": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getVariables",
          "x-required-scope": "variable:list",
          "x-eov-operation-handler": "v1/handlers/variables/variables.handler",
          "tags": [
            "Variables"
          ],
          "summary": "Retrieve variables",
          "description": "Retrieve variables from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            },
            {
              "name": "projectId",
              "in": "query",
              "required": false,
              "explode": false,
              "allowReserved": true,
              "schema": {
                "type": "string",
                "example": "VmwOO9HeTEj20kxM"
              }
            },
            {
              "name": "state",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "empty"
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/variableList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/variables/{id}": {
        "delete": {
          "x-eov-operation-id": "deleteVariable",
          "x-required-scope": "variable:delete",
          "x-eov-operation-handler": "v1/handlers/variables/variables.handler",
          "tags": [
            "Variables"
          ],
          "summary": "Delete a variable",
          "description": "Delete a variable from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/variableId"
            }
          ],
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateVariable",
          "x-required-scope": "variable:update",
          "x-eov-operation-handler": "v1/handlers/variables/variables.handler",
          "tags": [
            "Variables"
          ],
          "summary": "Update a variable",
          "description": "Update a variable from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/variableId"
            }
          ],
          "requestBody": {
            "description": "Payload for variable to update.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/variable.create"
                }
              }
            },
            "required": true
          },
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/data-tables": {
        "get": {
          "x-eov-operation-id": "listDataTables",
          "x-required-scope": "dataTable:list",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "List all data tables",
          "description": "Retrieve a list of all data tables with optional filtering, sorting, and pagination.",
          "operationId": "list-data-tables",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            },
            {
              "name": "filter",
              "in": "query",
              "description": "JSON string of filter conditions",
              "schema": {
                "type": "string",
                "format": "jsonString"
              },
              "example": "{\"name\":\"my-table\"}"
            },
            {
              "name": "sortBy",
              "in": "query",
              "description": "Sort format: field:asc or field:desc",
              "schema": {
                "type": "string"
              },
              "example": "name:asc"
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieved data tables",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTableList"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "post": {
          "x-eov-operation-id": "createDataTable",
          "x-required-scope": "dataTable:create",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Create a new data table",
          "description": "Create a new data table in your personal project or a team project you have access to.",
          "operationId": "create-data-table",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createDataTableRequest"
                },
                "examples": {
                  "personalProject": {
                    "summary": "Default (personal project)",
                    "value": {
                      "name": "customers",
                      "columns": [
                        {
                          "name": "email",
                          "type": "string"
                        },
                        {
                          "name": "status",
                          "type": "string"
                        },
                        {
                          "name": "age",
                          "type": "number"
                        }
                      ]
                    }
                  },
                  "scopedProject": {
                    "summary": "Explicit project",
                    "value": {
                      "name": "customers",
                      "projectId": "a1b2c3d4",
                      "columns": [
                        {
                          "name": "email",
                          "type": "string"
                        },
                        {
                          "name": "status",
                          "type": "string"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Data table created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTable"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}": {
        "get": {
          "x-eov-operation-id": "getDataTable",
          "x-required-scope": "dataTable:read",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Get a data table",
          "description": "Retrieve a specific data table by ID.",
          "operationId": "get-data-table",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieved data table",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTable"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "patch": {
          "x-eov-operation-id": "updateDataTable",
          "x-required-scope": "dataTable:update",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Update a data table",
          "description": "Update a data table's name.",
          "operationId": "update-data-table",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateDataTableRequest"
                },
                "example": {
                  "name": "updated-customers"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Data table updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTable"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "delete": {
          "x-eov-operation-id": "deleteDataTable",
          "x-required-scope": "dataTable:delete",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Delete a data table",
          "description": "Delete a data table. This will also delete all rows in the table.",
          "operationId": "delete-data-table",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "responses": {
            "204": {
              "description": "Data table deleted successfully"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/rows": {
        "get": {
          "x-eov-operation-id": "getDataTableRows",
          "x-required-scope": "dataTableRow:read",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Retrieve rows from a data table",
          "description": "Query and retrieve rows from a data table with optional filtering, sorting, and pagination.",
          "operationId": "get-data-table-rows",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            },
            {
              "name": "filter",
              "in": "query",
              "description": "JSON string of filter conditions",
              "schema": {
                "type": "string",
                "format": "jsonString"
              },
              "example": "{\"type\":\"and\",\"filters\":[{\"columnName\":\"status\",\"condition\":\"eq\",\"value\":\"active\"}]}"
            },
            {
              "name": "sortBy",
              "in": "query",
              "description": "Sort format: columnName:asc or columnName:desc",
              "schema": {
                "type": "string"
              },
              "example": "createdAt:desc"
            },
            {
              "name": "search",
              "in": "query",
              "description": "Search text across all string columns",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieved rows",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTableRowList"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "post": {
          "x-eov-operation-id": "insertDataTableRows",
          "x-required-scope": "dataTableRow:create",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Insert rows into a data table",
          "description": "Insert one or more rows into a data table.",
          "operationId": "insert-data-table-rows",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/insertRowsRequest"
                },
                "example": {
                  "data": [
                    {
                      "name": "John Doe",
                      "email": "john@example.com",
                      "age": 30
                    },
                    {
                      "name": "Jane Smith",
                      "email": "jane@example.com",
                      "age": 25
                    }
                  ],
                  "returnType": "all"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Rows inserted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "oneOf": [
                      {
                        "type": "object",
                        "properties": {
                          "count": {
                            "type": "integer"
                          }
                        },
                        "description": "Number of rows inserted (when returnType is 'count')"
                      },
                      {
                        "type": "array",
                        "items": {
                          "type": "integer"
                        },
                        "description": "Array of inserted row IDs (when returnType is 'id')"
                      },
                      {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/dataTableRow"
                        },
                        "description": "Array of inserted rows (when returnType is 'all')"
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/rows/update": {
        "patch": {
          "x-eov-operation-id": "updateDataTableRows",
          "x-required-scope": "dataTableRow:update",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Update rows in a data table",
          "description": "Update rows matching filter conditions in a data table.",
          "operationId": "update-data-table-rows",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateRowsRequest"
                },
                "example": {
                  "filter": {
                    "type": "and",
                    "filters": [
                      {
                        "columnName": "status",
                        "condition": "eq",
                        "value": "pending"
                      }
                    ]
                  },
                  "data": {
                    "status": "completed",
                    "updatedBy": "admin"
                  },
                  "returnData": false,
                  "dryRun": false
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Rows updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "oneOf": [
                      {
                        "type": "boolean",
                        "description": "True when returnData is false"
                      },
                      {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/dataTableRow"
                        },
                        "description": "Updated rows when returnData is true"
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/rows/upsert": {
        "post": {
          "x-eov-operation-id": "upsertDataTableRow",
          "x-required-scope": "dataTableRow:upsert",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Upsert a row in a data table",
          "description": "Update an existing row or insert a new one if no row matches the filter conditions.",
          "operationId": "upsert-data-table-row",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/upsertRowRequest"
                },
                "example": {
                  "filter": {
                    "type": "and",
                    "filters": [
                      {
                        "columnName": "email",
                        "condition": "eq",
                        "value": "user@example.com"
                      }
                    ]
                  },
                  "data": {
                    "email": "user@example.com",
                    "name": "Updated Name",
                    "status": "active"
                  },
                  "returnData": true,
                  "dryRun": false
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Row upserted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "oneOf": [
                      {
                        "type": "boolean",
                        "description": "True when returnData is false"
                      },
                      {
                        "allOf": [
                          {
                            "$ref": "#/components/schemas/dataTableRow"
                          }
                        ],
                        "description": "Upserted row when returnData is true"
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/rows/clear": {
        "delete": {
          "x-eov-operation-id": "clearDataTableRows",
          "x-required-scope": "dataTableRow:delete",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Clear all rows from a data table",
          "description": "Permanently deletes all rows from a data table. The table structure will be retained. This action cannot be undone.",
          "operationId": "clear-data-table-rows",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "responses": {
            "200": {
              "description": "Rows cleared successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "deletedCount": {
                        "type": "integer",
                        "description": "The number of rows that were deleted"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/rows/delete": {
        "delete": {
          "x-eov-operation-id": "deleteDataTableRows",
          "x-required-scope": "dataTableRow:delete",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.rows.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Delete rows from a data table",
          "description": "Delete rows matching filter conditions from a data table. Filter is required to prevent accidental deletion of all data.",
          "operationId": "delete-data-table-rows",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            },
            {
              "name": "filter",
              "in": "query",
              "required": true,
              "description": "JSON string of filter conditions. Required to prevent accidental deletion of all data.",
              "schema": {
                "type": "string",
                "format": "jsonString"
              },
              "example": "{\"type\":\"and\",\"filters\":[{\"columnName\":\"status\",\"condition\":\"eq\",\"value\":\"archived\"}]}"
            },
            {
              "name": "returnData",
              "in": "query",
              "description": "If true, return the deleted rows; if false, return true on success",
              "schema": {
                "type": "boolean",
                "default": false
              }
            },
            {
              "name": "dryRun",
              "in": "query",
              "description": "If true, preview which rows would be deleted without actually deleting them",
              "schema": {
                "type": "boolean",
                "default": false
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Rows deleted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "oneOf": [
                      {
                        "type": "boolean",
                        "description": "True when returnData is false"
                      },
                      {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/dataTableRow"
                        },
                        "description": "Deleted rows when returnData is true"
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/columns": {
        "get": {
          "x-eov-operation-id": "listDataTableColumns",
          "x-required-scope": "dataTableColumn:read",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.columns.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "List columns of a data table",
          "description": "Retrieve all columns for a specific data table.",
          "operationId": "list-data-table-columns",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "responses": {
            "200": {
              "description": "Successfully retrieved columns",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/dataTableColumn"
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "post": {
          "x-eov-operation-id": "createDataTableColumn",
          "x-required-scope": "dataTableColumn:create",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.columns.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Add a column to a data table",
          "description": "Add a new column to an existing data table.",
          "operationId": "create-data-table-column",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/createColumnRequest"
                },
                "example": {
                  "name": "email",
                  "type": "string"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Column created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTableColumn"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/data-tables/{dataTableId}/columns/{columnId}": {
        "delete": {
          "x-eov-operation-id": "deleteDataTableColumn",
          "x-required-scope": "dataTableColumn:delete",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.columns.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Delete a column",
          "description": "Remove a column from a data table. This will also delete all data in the column.",
          "operationId": "delete-data-table-column",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            },
            {
              "$ref": "#/components/parameters/columnId"
            }
          ],
          "responses": {
            "204": {
              "description": "Column deleted successfully"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "patch": {
          "x-eov-operation-id": "updateDataTableColumn",
          "x-required-scope": "dataTableColumn:update",
          "x-eov-operation-handler": "v1/handlers/data-tables/data-tables.columns.handler",
          "tags": [
            "DataTable"
          ],
          "summary": "Update a column",
          "description": "Rename and/or reorder a column in a data table.",
          "operationId": "update-data-table-column",
          "parameters": [
            {
              "$ref": "#/components/parameters/dataTableId"
            },
            {
              "$ref": "#/components/parameters/columnId"
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/updateColumnRequest"
                },
                "example": {
                  "name": "email",
                  "index": 1
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Column updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/dataTableColumn"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/projects": {
        "post": {
          "x-eov-operation-id": "createProject",
          "x-required-scope": "project:create",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Create a project",
          "description": "Create a project on your instance.",
          "requestBody": {
            "description": "Payload for project to create.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/project"
                }
              }
            },
            "required": true
          },
          "responses": {
            "201": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getProjects",
          "x-required-scope": "project:list",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Retrieve projects",
          "description": "Retrieve projects from your instance.",
          "parameters": [
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/projectList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/projects/{projectId}": {
        "delete": {
          "x-eov-operation-id": "deleteProject",
          "x-required-scope": "project:delete",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Delete a project",
          "description": "Delete a project from your instance.",
          "parameters": [
            {
              "in": "path",
              "name": "projectId",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateProject",
          "x-required-scope": "project:update",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Update a project",
          "description": "Update a project on your instance.",
          "parameters": [
            {
              "in": "path",
              "name": "projectId",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Updated project object.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/project"
                }
              }
            },
            "required": true
          },
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/projects/{projectId}/users": {
        "get": {
          "x-eov-operation-id": "getProjectUsers",
          "x-required-scope": "user:list",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "List project members",
          "description": "Returns a list of all members of a project including their role. Requires user:list scope.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "$ref": "#/components/parameters/limit"
            },
            {
              "$ref": "#/components/parameters/cursor"
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/projectMemberList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "post": {
          "x-eov-operation-id": "addUsersToProject",
          "x-required-scope": "project:update",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Add one or more users to a project",
          "description": "Add one or more users to a project on your instance.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Payload containing an array of one or more users to add to the project.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "relations": {
                      "type": "array",
                      "description": "A list of userIds and roles to add to the project.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "userId": {
                            "type": "string",
                            "description": "The unique identifier of the user.",
                            "example": "91765f0d-3b29-45df-adb9-35b23937eb92"
                          },
                          "role": {
                            "type": "string",
                            "description": "The role assigned to the user in the project.",
                            "example": "project:viewer"
                          }
                        },
                        "required": [
                          "userId",
                          "role"
                        ]
                      }
                    }
                  },
                  "required": [
                    "relations"
                  ]
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/projects/{projectId}/users/{userId}": {
        "delete": {
          "x-eov-operation-id": "deleteUserFromProject",
          "x-required-scope": "project:update",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Delete a user from a project",
          "description": "Delete a user from a project on your instance.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "in": "path",
              "description": "The ID of the user.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "patch": {
          "x-eov-operation-id": "changeUserRoleInProject",
          "x-required-scope": "project:update",
          "x-eov-operation-handler": "v1/handlers/projects/projects.handler",
          "tags": [
            "Projects"
          ],
          "summary": "Change a user's role in a project",
          "description": "Change a user's role in a project.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "in": "path",
              "description": "The ID of the user.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Payload containing the new role to assign to the project user.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "role": {
                      "type": "string",
                      "description": "The role assigned to the user in the project.",
                      "example": "project:viewer"
                    }
                  },
                  "required": [
                    "role"
                  ]
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/community-packages": {
        "post": {
          "x-eov-operation-id": "installPackage",
          "x-required-scope": "communityPackage:install",
          "x-eov-operation-handler": "v1/handlers/community-packages/community-packages.handler",
          "tags": [
            "CommunityPackage"
          ],
          "summary": "Install a community package",
          "description": "Install a community package by npm name and optional version.",
          "requestBody": {
            "description": "Package to install.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/installCommunityPackageRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Package installed successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/communityPackage"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "get": {
          "x-eov-operation-id": "getInstalledPackages",
          "x-required-scope": "communityPackage:list",
          "x-eov-operation-handler": "v1/handlers/community-packages/community-packages.handler",
          "tags": [
            "CommunityPackage"
          ],
          "summary": "List installed community packages",
          "description": "Retrieve all installed community packages with pending update info.",
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/communityPackageList"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/community-packages/{name}": {
        "patch": {
          "x-eov-operation-id": "updatePackage",
          "x-required-scope": "communityPackage:update",
          "x-eov-operation-handler": "v1/handlers/community-packages/community-packages.handler",
          "tags": [
            "CommunityPackage"
          ],
          "summary": "Update a community package",
          "description": "Update an installed community package to a new version.",
          "parameters": [
            {
              "name": "name",
              "in": "path",
              "description": "npm package name",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Update options.",
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "version": {
                      "type": "string",
                      "description": "Specific semver version to update to"
                    },
                    "verify": {
                      "type": "boolean",
                      "description": "Whether to verify the package against the n8n-vetted package list. Setting to false will allow installing or updating to an unverified version. Default is true.\n"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Package updated successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/communityPackage"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        },
        "delete": {
          "x-eov-operation-id": "uninstallPackage",
          "x-required-scope": "communityPackage:uninstall",
          "x-eov-operation-handler": "v1/handlers/community-packages/community-packages.handler",
          "tags": [
            "CommunityPackage"
          ],
          "summary": "Uninstall a community package",
          "description": "Uninstall a community package by name.",
          "parameters": [
            {
              "name": "name",
              "in": "path",
              "description": "npm package name",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Package uninstalled successfully."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/discover": {
        "get": {
          "x-eov-operation-id": "getDiscover",
          "x-required-scope": "none",
          "x-eov-operation-handler": "v1/handlers/discover/discover.handler",
          "tags": [
            "Discover"
          ],
          "summary": "Discover available API capabilities",
          "description": "Returns a filtered capability map based on the caller's API key scopes. Each resource includes the operations and endpoints accessible to the authenticated API key. Use query parameters to narrow the response.\n",
          "parameters": [
            {
              "name": "include",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "schemas"
                ]
              },
              "description": "Include additional data. Use \"schemas\" to inline request body schemas per endpoint, eliminating the need to fetch the full OpenAPI spec.\n"
            },
            {
              "name": "resource",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string"
              },
              "description": "Filter to a specific resource (e.g. \"workflow\", \"tags\", \"credential\").\n"
            },
            {
              "name": "operation",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string"
              },
              "description": "Filter to endpoints with a specific operation (e.g. \"read\", \"create\", \"list\").\n"
            }
          ],
          "responses": {
            "200": {
              "description": "Discovery response with available resources and endpoints.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "data": {
                        "type": "object",
                        "properties": {
                          "scopes": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "description": "The API key's active scopes"
                          },
                          "resources": {
                            "type": "object",
                            "additionalProperties": {
                              "type": "object",
                              "properties": {
                                "operations": {
                                  "type": "array",
                                  "items": {
                                    "type": "string"
                                  }
                                },
                                "endpoints": {
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "method": {
                                        "type": "string"
                                      },
                                      "path": {
                                        "type": "string"
                                      },
                                      "operationId": {
                                        "type": "string"
                                      },
                                      "requestSchema": {
                                        "type": "object",
                                        "description": "Request body schema (only present when include=schemas and the endpoint accepts a request body).\n"
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "filters": {
                            "type": "object",
                            "description": "Available query parameter filters. The values arrays reflect what the caller's scopes permit.\n",
                            "additionalProperties": {
                              "type": "object",
                              "properties": {
                                "description": {
                                  "type": "string"
                                },
                                "values": {
                                  "type": "array",
                                  "items": {
                                    "type": "string"
                                  }
                                }
                              }
                            }
                          },
                          "specUrl": {
                            "type": "string",
                            "description": "URL to the full OpenAPI specification"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            }
          }
        }
      },
      "/insights/summary": {
        "get": {
          "x-eov-operation-id": "getInsightsSummary",
          "x-required-scope": "insights:read",
          "x-eov-operation-handler": "v1/handlers/insights/insights.handler",
          "tags": [
            "Insights"
          ],
          "summary": "Retrieve insights summary",
          "description": "Retrieve the insights summary for the selected date range.",
          "parameters": [
            {
              "name": "startDate",
              "in": "query",
              "required": false,
              "description": "ISO 8601 start date. Defaults to 7 days ago.",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "endDate",
              "in": "query",
              "required": false,
              "description": "ISO 8601 end date. Defaults to now.",
              "schema": {
                "type": "string",
                "format": "date-time"
              }
            },
            {
              "name": "projectId",
              "in": "query",
              "required": false,
              "description": "Project identifier to filter insights by project.",
              "schema": {
                "type": "string",
                "example": "VmwOO9HeTEj20kxM"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/insights"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        }
      },
      "/projects/{projectId}/folders": {
        "post": {
          "x-eov-operation-id": "createFolder",
          "x-required-scope": "folder:create",
          "x-eov-operation-handler": "v1/handlers/folders/folders.handler",
          "tags": [
            "Folders"
          ],
          "summary": "Create a folder",
          "description": "Create a folder within a project.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project, or `personal` to create the folder in the calling user's own personal project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Payload for folder to create.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/folder.create"
                }
              }
            },
            "required": true
          },
          "responses": {
            "201": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/folder"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getFolders",
          "x-required-scope": "folder:list",
          "x-eov-operation-handler": "v1/handlers/folders/folders.handler",
          "tags": [
            "Folders"
          ],
          "summary": "Retrieve folders",
          "description": "Retrieve folders within a project. Supports filtering, sorting, field selection, and pagination.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "filter",
              "in": "query",
              "required": false,
              "description": "JSON-encoded filter object. Supported fields — parentFolderId, name, tags (array of tag names), excludeFolderIdAndDescendants.",
              "schema": {
                "type": "string",
                "example": "{\"parentFolderId\":\"abc123\",\"name\":\"My Folder\"}"
              }
            },
            {
              "name": "select",
              "in": "query",
              "required": false,
              "description": "JSON-encoded array of fields to include. Valid fields — id, name, createdAt, updatedAt, project, tags, parentFolder, workflowCount, subFolderCount, path.",
              "schema": {
                "type": "string",
                "example": "[\"id\",\"name\",\"tags\",\"workflowCount\"]"
              }
            },
            {
              "name": "sortBy",
              "in": "query",
              "required": false,
              "description": "Sort order for results.",
              "schema": {
                "type": "string",
                "enum": [
                  "name:asc",
                  "name:desc",
                  "createdAt:asc",
                  "createdAt:desc",
                  "updatedAt:asc",
                  "updatedAt:desc"
                ]
              }
            },
            {
              "name": "skip",
              "in": "query",
              "required": false,
              "description": "Number of items to skip for pagination. Defaults to 0.",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "take",
              "in": "query",
              "required": false,
              "description": "Number of items to return. Defaults to 10.",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "count": {
                        "type": "integer",
                        "description": "Total number of folders matching the query."
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/folder"
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/projects/{projectId}/folders/{folderId}": {
        "delete": {
          "x-eov-operation-id": "deleteFolder",
          "x-required-scope": "folder:delete",
          "x-eov-operation-handler": "v1/handlers/folders/folders.handler",
          "tags": [
            "Folders"
          ],
          "summary": "Delete a folder",
          "description": "Delete a folder within a project. When `transferToFolderId` is provided, workflows and sub-folders are moved to the target folder before deletion. When omitted, workflows are moved to the project root and archived, and child folders are deleted.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "folderId",
              "in": "path",
              "description": "The ID of the folder.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "transferToFolderId",
              "in": "query",
              "description": "Optional target folder ID to move workflows and sub-folders into before deleting.",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Operation successful."
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "get": {
          "x-eov-operation-id": "getFolder",
          "x-required-scope": "folder:read",
          "x-eov-operation-handler": "v1/handlers/folders/folders.handler",
          "tags": [
            "Folders"
          ],
          "summary": "Get folder details",
          "description": "Get folder details including sub-folder and workflow counts.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "folderId",
              "in": "path",
              "description": "The ID of the folder.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "id": {
                        "type": "string",
                        "readOnly": true
                      },
                      "name": {
                        "type": "string"
                      },
                      "parentFolderId": {
                        "type": "string",
                        "nullable": true
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time",
                        "readOnly": true
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time",
                        "readOnly": true
                      },
                      "totalSubFolders": {
                        "type": "integer",
                        "description": "Total number of sub-folders (recursive)."
                      },
                      "totalWorkflows": {
                        "type": "integer",
                        "description": "Total number of workflows (recursive)."
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "patch": {
          "x-eov-operation-id": "updateFolder",
          "x-required-scope": "folder:update",
          "x-eov-operation-handler": "v1/handlers/folders/folders.handler",
          "tags": [
            "Folders"
          ],
          "summary": "Update a folder",
          "description": "Update folder name or parent folder.",
          "parameters": [
            {
              "name": "projectId",
              "in": "path",
              "description": "The ID of the project.",
              "required": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "folderId",
              "in": "path",
              "description": "The ID of the folder.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "Payload for folder update.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/folder.update"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/folder"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/n8n-packages/export": {
        "post": {
          "x-eov-operation-id": "exportPackage",
          "x-required-scope": "project:export,workflow:export",
          "x-eov-operation-handler": "v1/handlers/n8n-packages/n8n-packages.handler",
          "tags": [
            "N8nPackage"
          ],
          "summary": "Beta: Export workflows, folders, or projects as an n8n package",
          "description": "**Beta** — breaking changes may still occur without major version bump.\n\nExport workflows and/or folders, or projects, as a gzipped tar archive\n(.n8np). Provide `workflowIds`/`folderIds`, or `projectIds`, but not both\ngroups. Each exported folder includes its nested folders. Empty projects\nexport project metadata only. Statically referenced sub-workflows must also\nbe included in the resulting package, otherwise the export is rejected. The\nresponse is streamed as `application/gzip` with a `Content-Disposition`\nattachment header. Requires the n8n Packages feature to be licensed.\n\nAPI key scopes: `workflow:export` is required when exporting workflows or folders, and `project:export` is required when exporting projects. When `includeVariableValues` is true (the default) and the exported workflows reference variables, `variable:list` is also required; exports that reference no variables never need it.\n",
          "requestBody": {
            "description": "Workflows, folders, or projects to include in the exported package.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/exportPackageRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "A gzipped tar archive containing the exported package contents.",
              "content": {
                "application/gzip": {
                  "schema": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/n8n-packages/import": {
        "post": {
          "x-eov-operation-id": "importPackage",
          "x-required-scope": "workflow:import",
          "x-eov-operation-handler": "v1/handlers/n8n-packages/n8n-packages.handler",
          "tags": [
            "N8nPackage"
          ],
          "summary": "Beta: Import an n8n package into a project",
          "description": "**Beta** — breaking changes may still occur without major version bump.\n\nImports a gzip-compressed tar package (`.n8np`) into the target project. Send the\narchive as the multipart field `package`. Optional routing uses form fields\n`projectId` and `folderId` (omit or send empty for defaults). The optional\n`credentialMatchingMode`, `credentialMissingMode`, `bindings`,\n`workflowIdPolicy`, and `workflowPublishingPolicy` fields take their defaults when omitted. The required\n`workflowConflictPolicy` field controls what happens when a package workflow\nmatches an existing workflow by source id in the target project. Maximum upload\nsize is `N8N_ENDPOINTS_PAYLOAD_SIZE_MAX` MB (default 16).\n\nThe package must declare its manifest at `manifest.json` and include every file\nreferenced by the manifest. The caller is authorised through the `workflow:import`\nscope. With the default `workflowIdPolicy=new`, newly created workflows receive a\nfresh local id; imported workflows arrive inactive unless `workflowPublishingPolicy`\npublishes them after import.\n\nCredential references are resolved before any workflow is written. Credentials owned by,\nshared with, or global to the target project (with `credential:read`) match.\n",
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "required": [
                    "package",
                    "workflowConflictPolicy"
                  ],
                  "properties": {
                    "package": {
                      "type": "string",
                      "format": "binary",
                      "description": "Gzip-compressed tar package (`.n8np`)."
                    },
                    "projectId": {
                      "type": "string",
                      "description": "Target project id. Omit or send empty to import into the caller's personal project.\n"
                    },
                    "folderId": {
                      "type": "string",
                      "description": "Optional folder within the target project. Omit or send empty for project root.\n"
                    },
                    "credentialMatchingMode": {
                      "type": "string",
                      "enum": [
                        "id-only",
                        "name-and-type",
                        "type-only"
                      ],
                      "default": "id-only",
                      "description": "How credential references in `requirements.credentials` are matched on the target instance. `id-only` (default) matches by id. `name-and-type` matches credentials with the exact same name and type. `type-only` matches any credential of the same type. For `name-and-type` and `type-only`, candidates are ranked by scope — a credential owned by the target project wins over one merely shared into it, which in turn wins over a global credential; if several candidates remain in the winning scope, the most recently updated one is chosen.\n"
                    },
                    "credentialMissingMode": {
                      "type": "string",
                      "enum": [
                        "must-preexist",
                        "create-stub"
                      ],
                      "default": "create-stub",
                      "description": "What to do when a credential reference cannot be resolved. `create-stub` (default) creates empty credential placeholders in the target project for missing references. `must-preexist` requires every referenced credential to already exist.\n"
                    },
                    "bindings": {
                      "type": "string",
                      "default": "{}",
                      "description": "Optional JSON object of explicit source→target id bindings, keyed by entity type. Only `credentials` is supported today: send `{\"credentials\":{\"<packageCredentialId>\":\"<targetCredentialId>\"}}` to map credential ids from the package to credential ids on the target instance. These explicit bindings are validated on type and applied before `credentialMatchingMode` resolution runs.\n"
                    },
                    "workflowConflictPolicy": {
                      "type": "string",
                      "enum": [
                        "new-version",
                        "fail",
                        "skip"
                      ],
                      "description": "`new-version` updates matching workflows and creates a new version, `fail` rejects the import when any matching workflow exists, and `skip` leaves matching workflows unchanged.\n"
                    },
                    "workflowIdPolicy": {
                      "type": "string",
                      "enum": [
                        "new",
                        "source"
                      ],
                      "default": "new",
                      "description": "Controls the id each newly created workflow receives. `new` (default) mints a fresh id and records the package id as `sourceWorkflowId`, so the same package can be imported repeatedly without id collisions. `source` reuses the package's own workflow id on the target instance. Workflows matched to an existing workflow in the target project (status `updated` or `skipped`) always keep that workflow's current id, regardless of policy.\n"
                    },
                    "workflowPublishingPolicy": {
                      "type": "string",
                      "enum": [
                        "preserve-published-state",
                        "match-source",
                        "publish-all",
                        "unpublish-all"
                      ],
                      "default": "preserve-published-state",
                      "description": "Controls whether imported workflows are published after content is written. `preserve-published-state` keeps new workflows inactive and republishes an updated workflow only when it was already published and the package workflow is published too, so drafts are never published. `match-source` follows the package workflow's published flag. `publish-all` publishes every imported workflow. `unpublish-all` leaves new workflows inactive and unpublishes updated workflows that were published.\n"
                    },
                    "folderConflictPolicy": {
                      "type": "string",
                      "enum": [
                        "merge",
                        "fail"
                      ],
                      "default": "merge",
                      "description": "Controls what happens when a package folder (matched by id in the target project) already exists at the same position. `merge` (default) reuses the existing folder as-is and merges the package's children into it; `fail` rejects the import. A folder whose id exists under a different parent, or belongs to another project, always blocks the import. Requires the `folder:create` scope and a license that supports folders when the package contains folders.\n"
                    },
                    "dataTableMatchingMode": {
                      "type": "string",
                      "enum": [
                        "by-id"
                      ],
                      "default": "by-id",
                      "description": "How data tables referenced by the package's workflows are matched against the target project. `by-id` matches the target-project table with the same id (imported tables keep their source id) and never falls back to name matching, so a match survives a rename on the target. Currently the only mode.\n"
                    },
                    "dataTableMissingMode": {
                      "type": "string",
                      "enum": [
                        "create",
                        "must-preexist",
                        "do-nothing"
                      ],
                      "default": "create",
                      "description": "Controls what happens when a referenced data table has no match in the target project. `create` (default) creates it from the package schema, keeping the source id, with no rows; requires the `dataTable:create` scope. `must-preexist` rejects the import. `do-nothing` skips creation of missing tables — matched tables are still validated for schema compatibility and can still block the import. Matched tables are always used as-is: never renamed, altered, or filled.\n"
                    },
                    "dataTableSchemaConflictPolicy": {
                      "type": "string",
                      "enum": [
                        "keep-existing",
                        "fail"
                      ],
                      "default": "keep-existing",
                      "description": "How strictly a matched data table's schema is compared. `keep-existing` (default) accepts a target table that has every package column with the same name and type, even when the target table also has additional columns of its own. `fail` is the strict drift-detection choice: any difference, including such target-only columns, rejects the import. A missing package column or a type mismatch always rejects. Both policies are non-destructive — the matched target table is never altered, and package columns are never added to it.\n"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Import succeeded; the listed workflows were written to the target project.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "required": [
                      "package",
                      "workflows",
                      "folders",
                      "projects",
                      "bindings",
                      "credentials"
                    ],
                    "properties": {
                      "package": {
                        "type": "object",
                        "required": [
                          "sourceN8nVersion",
                          "sourceId",
                          "exportedAt"
                        ],
                        "properties": {
                          "sourceN8nVersion": {
                            "type": "string"
                          },
                          "sourceId": {
                            "type": "string"
                          },
                          "exportedAt": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      },
                      "workflows": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "required": [
                            "sourceWorkflowId",
                            "localId",
                            "name",
                            "projectId",
                            "parentFolderId",
                            "activeVersionId",
                            "publishing",
                            "status"
                          ],
                          "properties": {
                            "sourceWorkflowId": {
                              "type": "string",
                              "description": "Workflow id as it appeared in the package."
                            },
                            "localId": {
                              "type": "string",
                              "description": "Workflow id on the target instance: newly assigned for `created` (fresh under `workflowIdPolicy=new`, the package id under `source`), the existing workflow's id for `updated`/`skipped`.\n"
                            },
                            "name": {
                              "type": "string"
                            },
                            "projectId": {
                              "type": "string"
                            },
                            "parentFolderId": {
                              "type": "string",
                              "nullable": true
                            },
                            "activeVersionId": {
                              "type": "string",
                              "nullable": true,
                              "description": "Published version on the target instance, if any. `null` when the workflow is not published after import.\n"
                            },
                            "publishing": {
                              "type": "object",
                              "required": [
                                "state"
                              ],
                              "description": "Outcome of applying the selected publishing policy to this workflow.\n",
                              "properties": {
                                "state": {
                                  "type": "string",
                                  "enum": [
                                    "published",
                                    "unpublished",
                                    "unchanged",
                                    "blocked",
                                    "failed"
                                  ],
                                  "description": "`blocked` means the imported version could not be published and no version is active (for example because the workflow uses a stubbed credential). When a prior published version remains active, `state` is `unchanged` with `skippedPublishReason` instead. `failed` means publish or unpublish was attempted but did not succeed.\n"
                                },
                                "error": {
                                  "type": "string",
                                  "description": "Present when `state` is `failed`. Explains why publish or unpublish could not be applied.\n"
                                },
                                "blockedReason": {
                                  "type": "string",
                                  "enum": [
                                    "stub-credential"
                                  ],
                                  "description": "Present when `state` is `blocked`: the imported version could not be published and no version is active.\n"
                                },
                                "skippedPublishReason": {
                                  "type": "string",
                                  "enum": [
                                    "stub-credential"
                                  ],
                                  "description": "Present when `state` is `unchanged` but the policy wanted to publish the imported version: a prior published version is still active (for example after an update with stubbed credentials).\n"
                                }
                              }
                            },
                            "status": {
                              "type": "string",
                              "enum": [
                                "created",
                                "updated",
                                "skipped"
                              ],
                              "description": "Import outcome for this package workflow."
                            }
                          }
                        }
                      },
                      "folders": {
                        "type": "array",
                        "description": "Folder shells created or skipped in the target project.",
                        "items": {
                          "type": "object",
                          "required": [
                            "sourceFolderId",
                            "localId",
                            "name",
                            "parentFolderId",
                            "status"
                          ],
                          "properties": {
                            "sourceFolderId": {
                              "type": "string",
                              "description": "Folder id as it appeared in the package."
                            },
                            "localId": {
                              "type": "string",
                              "description": "Folder id on the target instance (equal to `sourceFolderId`; folder ids are reused)."
                            },
                            "name": {
                              "type": "string"
                            },
                            "parentFolderId": {
                              "type": "string",
                              "nullable": true,
                              "description": "Resolved parent folder on the target, or `null` at the project root."
                            },
                            "status": {
                              "type": "string",
                              "enum": [
                                "created",
                                "skipped"
                              ],
                              "description": "Import outcome for this package folder."
                            }
                          }
                        }
                      },
                      "projects": {
                        "type": "array",
                        "description": "Project shells created or matched-and-updated. Present for project packages; empty when importing loose workflows/folders.\n",
                        "items": {
                          "type": "object",
                          "required": [
                            "sourceProjectId",
                            "localId",
                            "name",
                            "status"
                          ],
                          "properties": {
                            "sourceProjectId": {
                              "type": "string",
                              "description": "Project id as it appeared in the package."
                            },
                            "localId": {
                              "type": "string",
                              "description": "Project id on the target instance (equal to `sourceProjectId`; project ids are reused)."
                            },
                            "name": {
                              "type": "string"
                            },
                            "status": {
                              "type": "string",
                              "enum": [
                                "created",
                                "updated"
                              ],
                              "description": "Import outcome for this package project."
                            }
                          }
                        }
                      },
                      "credentials": {
                        "type": "object",
                        "description": "Source credential ids grouped by whether they matched an existing credential or were created as stubs. Full source→target id mapping is in `bindings.credentials`.\n",
                        "required": [
                          "matched",
                          "stubbed"
                        ],
                        "properties": {
                          "matched": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "description": "Source credential ids from the package that matched existing credentials on the target instance.\n"
                          },
                          "stubbed": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "description": "Source credential ids for which empty placeholder credentials were created in the target project.\n"
                          }
                        }
                      },
                      "bindings": {
                        "type": "object",
                        "description": "Source id → target id mappings produced during import, one map per entity type. Each value maps an id as it appeared in the package to the id on the target instance.\n",
                        "required": [
                          "workflows",
                          "credentials"
                        ],
                        "properties": {
                          "workflows": {
                            "type": "object",
                            "additionalProperties": {
                              "type": "string"
                            }
                          },
                          "credentials": {
                            "type": "object",
                            "description": "Credential id from `requirements.credentials` in the package manifest → matched credential id on the target instance.\n",
                            "additionalProperties": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "description": "Import blocked by at least one conflict among the issues — a workflow source-id conflict or a folder conflict (id under a different parent, id owned by another project, or a `fail`-policy match).\n",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "required": [
                      "message",
                      "issues"
                    ],
                    "properties": {
                      "message": {
                        "type": "string"
                      },
                      "issues": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/importBlockingIssue"
                        }
                      }
                    }
                  }
                }
              }
            },
            "422": {
              "description": "Import blocked by non-conflict issues only (e.g. unresolved credentials).\n",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "required": [
                      "message",
                      "issues"
                    ],
                    "properties": {
                      "message": {
                        "type": "string"
                      },
                      "issues": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/importBlockingIssue"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/settings/log-streaming/event-types": {
        "get": {
          "x-eov-operation-id": "getEventTypes",
          "x-required-scope": "eventBusDestination:list",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "List streamable event types",
          "description": "List the event types that can be streamed to a log streaming destination. Requires the `eventBusDestination:list` scope and the Log Streaming feature to be licensed.\n",
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/event-types"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        }
      },
      "/settings/log-streaming/destinations": {
        "get": {
          "x-eov-operation-id": "getDestinations",
          "x-required-scope": "eventBusDestination:list",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "List log streaming destinations",
          "description": "List the configured log streaming destinations. Requires the `eventBusDestination:list` scope and the Log Streaming feature to be licensed.\n",
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/destination.list"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            }
          }
        },
        "post": {
          "x-eov-operation-id": "createDestination",
          "x-required-scope": "eventBusDestination:create",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "Create a log streaming destination",
          "description": "Create a log streaming destination. The destination takes effect exactly as it would from the UI, using the same validation. Requires the `eventBusDestination:create` scope and the Log Streaming feature to be licensed. When destinations are managed via environment variables, the write is rejected with 409 and nothing is created; reads still return the current values.\n",
          "requestBody": {
            "description": "The destination to create.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/destination"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/destination"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      },
      "/settings/log-streaming/destinations/{id}/test": {
        "post": {
          "x-eov-operation-id": "testDestination",
          "x-required-scope": "eventBusDestination:test",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "Send a test message to a log streaming destination",
          "description": "Send a test message to the destination to verify it is reachable and configured correctly. Requires the `eventBusDestination:test` scope and the Log Streaming feature to be licensed.\n",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The id of the log streaming destination.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/test-result"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        }
      },
      "/settings/log-streaming/destinations/{id}": {
        "get": {
          "x-eov-operation-id": "getDestination",
          "x-required-scope": "eventBusDestination:read",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "Retrieve a log streaming destination",
          "description": "Retrieve a single log streaming destination by id. Requires the `eventBusDestination:read` scope and the Log Streaming feature to be licensed.\n",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The id of the log streaming destination.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/destination"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            }
          }
        },
        "put": {
          "x-eov-operation-id": "updateDestination",
          "x-required-scope": "eventBusDestination:update",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "Update a log streaming destination",
          "description": "Replace an existing log streaming destination. The update takes effect exactly as it would from the UI, using the same validation. Requires the `eventBusDestination:update` scope and the Log Streaming feature to be licensed. When destinations are managed via environment variables, the write is rejected with 409 and nothing is changed; reads still return the current values.\n",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The id of the log streaming destination.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "description": "The destination fields to apply.",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/destination"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/destination"
                  }
                }
              }
            },
            "400": {
              "$ref": "#/components/responses/badRequest"
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        },
        "delete": {
          "x-eov-operation-id": "deleteDestination",
          "x-required-scope": "eventBusDestination:delete",
          "x-eov-operation-handler": "v1/handlers/log-streaming/log-streaming.handler",
          "tags": [
            "LogStreaming"
          ],
          "summary": "Delete a log streaming destination",
          "description": "Remove a log streaming destination. Requires the `eventBusDestination:delete` scope and the Log Streaming feature to be licensed. When destinations are managed via environment variables, the delete is rejected with 409 and nothing is removed; reads still return the current values.\n",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "The id of the log streaming destination.",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Operation successful.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/destination"
                  }
                }
              }
            },
            "401": {
              "$ref": "#/components/responses/unauthorized"
            },
            "403": {
              "$ref": "#/components/responses/forbidden"
            },
            "404": {
              "$ref": "#/components/responses/notFound"
            },
            "409": {
              "$ref": "#/components/responses/conflict"
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "audit": {
          "type": "object",
          "properties": {
            "Credentials Risk Report": {
              "type": "object",
              "example": {
                "risk": "credentials",
                "sections": [
                  {
                    "title": "Credentials not used in any workflow",
                    "description": "These credentials are not used in any workflow. Keeping unused credentials in your instance is an unneeded security risk.",
                    "recommendation": "Consider deleting these credentials if you no longer need them.",
                    "location": [
                      {
                        "kind": "credential",
                        "id": "1",
                        "name": "My Test Account"
                      }
                    ]
                  }
                ]
              }
            },
            "Database Risk Report": {
              "type": "object",
              "example": {
                "risk": "database",
                "sections": [
                  {
                    "title": "Expressions in \"Execute Query\" fields in SQL nodes",
                    "description": "This SQL node has an expression in the \"Query\" field of an \"Execute Query\" operation. Building a SQL query with an expression may lead to a SQL injection attack.",
                    "recommendation": "Consider using the \"Query Parameters\" field to pass parameters to the query",
                    "or validating the input of the expression in the \"Query\" field.": null,
                    "location": [
                      {
                        "kind": "node",
                        "workflowId": "1",
                        "workflowName": "My Workflow",
                        "nodeId": "51eb5852-ce0b-4806-b4ff-e41322a4041a",
                        "nodeName": "MySQL",
                        "nodeType": "n8n-nodes-base.mySql"
                      }
                    ]
                  }
                ]
              }
            },
            "Filesystem Risk Report": {
              "type": "object",
              "example": {
                "risk": "filesystem",
                "sections": [
                  {
                    "title": "Nodes that interact with the filesystem",
                    "description": "This node reads from and writes to any accessible file in the host filesystem. Sensitive file content may be manipulated through a node operation.",
                    "recommendation": "Consider protecting any sensitive files in the host filesystem",
                    "or refactoring the workflow so that it does not require host filesystem interaction.": null,
                    "location": [
                      {
                        "kind": "node",
                        "workflowId": "1",
                        "workflowName": "My Workflow",
                        "nodeId": "51eb5852-ce0b-4806-b4ff-e41322a4041a",
                        "nodeName": "Ready Binary file",
                        "nodeType": "n8n-nodes-base.readBinaryFile"
                      }
                    ]
                  }
                ]
              }
            },
            "Nodes Risk Report": {
              "type": "object",
              "example": {
                "risk": "nodes",
                "sections": [
                  {
                    "title": "Community nodes",
                    "description": "This node is sourced from the community. Community nodes are not vetted by the n8n team and have full access to the host system.",
                    "recommendation": "Consider reviewing the source code in any community nodes installed in this n8n instance",
                    "and uninstalling any community nodes no longer used.": null,
                    "location": [
                      {
                        "kind": "community",
                        "nodeType": "n8n-nodes-test.test",
                        "packageUrl": "https://www.npmjs.com/package/n8n-nodes-test"
                      }
                    ]
                  }
                ]
              }
            },
            "Instance Risk Report": {
              "type": "object",
              "example": {
                "risk": "execution",
                "sections": [
                  {
                    "title": "Unprotected webhooks in instance",
                    "description": "These webhook nodes have the \"Authentication\" field set to \"None\" and are not directly connected to a node to validate the payload. Every unprotected webhook allows your workflow to be called by any third party who knows the webhook URL.",
                    "recommendation": "Consider setting the \"Authentication\" field to an option other than \"None\"",
                    "or validating the payload with one of the following nodes.": null,
                    "location": [
                      {
                        "kind": "community",
                        "nodeType": "n8n-nodes-test.test",
                        "packageUrl": "https://www.npmjs.com/package/n8n-nodes-test"
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        "security-policy": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "personalSpacePublishing",
            "personalSpaceSharing",
            "publishedPersonalWorkflowsCount",
            "sharedPersonalWorkflowsCount",
            "sharedPersonalCredentialsCount",
            "redactionEnforcement"
          ],
          "properties": {
            "personalSpacePublishing": {
              "type": "boolean",
              "description": "Whether members may publish workflows and agents from their personal space.",
              "example": true
            },
            "personalSpaceSharing": {
              "type": "boolean",
              "description": "Whether members may share workflows and credentials from their personal space.",
              "example": true
            },
            "publishedPersonalWorkflowsCount": {
              "type": "integer",
              "readOnly": true,
              "description": "Number of currently published personal workflows, shown for awareness before tightening the policy.",
              "example": 3
            },
            "sharedPersonalWorkflowsCount": {
              "type": "integer",
              "readOnly": true,
              "description": "Number of personal workflows currently shared with other users.",
              "example": 5
            },
            "sharedPersonalCredentialsCount": {
              "type": "integer",
              "readOnly": true,
              "description": "Number of personal credentials currently shared with other users.",
              "example": 2
            },
            "redactionEnforcement": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "floor"
              ],
              "properties": {
                "floor": {
                  "type": "string",
                  "enum": [
                    "off",
                    "production",
                    "all"
                  ],
                  "description": "Minimum execution-data redaction level enforced across the instance.",
                  "example": "production"
                }
              }
            }
          }
        },
        "security-policy.update": {
          "type": "object",
          "additionalProperties": false,
          "description": "Full security policy. All writable fields must be provided; partial updates are not supported.",
          "required": [
            "personalSpacePublishing",
            "personalSpaceSharing",
            "redactionEnforcement"
          ],
          "properties": {
            "personalSpacePublishing": {
              "type": "boolean",
              "description": "Whether members may publish workflows and agents from their personal space.",
              "example": false
            },
            "personalSpaceSharing": {
              "type": "boolean",
              "description": "Whether members may share workflows and credentials from their personal space.",
              "example": false
            },
            "redactionEnforcement": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "floor"
              ],
              "properties": {
                "floor": {
                  "type": "string",
                  "enum": [
                    "off",
                    "production",
                    "all"
                  ],
                  "description": "Minimum execution-data redaction level enforced across the instance.",
                  "example": "production"
                }
              }
            },
            "publishedPersonalWorkflowsCount": {
              "type": "integer",
              "description": "Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body.\n"
            },
            "sharedPersonalWorkflowsCount": {
              "type": "integer",
              "description": "Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body.\n"
            },
            "sharedPersonalCredentialsCount": {
              "type": "integer",
              "description": "Read-only usage count returned by GET. Ignored on write so a GET response can be sent back as a PUT body.\n"
            }
          }
        },
        "saml-configuration": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "entityID",
            "returnUrl",
            "mapping",
            "metadata",
            "metadataUrl",
            "ignoreSSL",
            "loginBinding",
            "loginEnabled",
            "loginLabel",
            "authnRequestsSigned",
            "wantAssertionsSigned",
            "wantMessageSigned",
            "signingPrivateKey",
            "signingCertificate",
            "acsBinding",
            "signatureConfig",
            "relayState"
          ],
          "properties": {
            "entityID": {
              "type": "string",
              "readOnly": true,
              "description": "Service provider entity ID (metadata URL).",
              "example": "https://n8n.example.com/rest/sso/saml/metadata"
            },
            "returnUrl": {
              "type": "string",
              "readOnly": true,
              "description": "Assertion Consumer Service (ACS) return URL.",
              "example": "https://n8n.example.com/rest/sso/saml/acs"
            },
            "mapping": {
              "type": "object",
              "description": "Mapping of SAML attributes to n8n user fields.",
              "additionalProperties": false,
              "required": [
                "email",
                "firstName",
                "lastName",
                "userPrincipalName",
                "n8nInstanceRole",
                "n8nProjectRoles"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's email."
                },
                "firstName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's first name."
                },
                "lastName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's last name."
                },
                "userPrincipalName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's principal name."
                },
                "n8nInstanceRole": {
                  "type": "string",
                  "description": "SAML attribute mapped to the n8n instance role."
                },
                "n8nProjectRoles": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "SAML attributes mapped to n8n project roles, formatted as `<projectId>:<role>`."
                }
              }
            },
            "metadata": {
              "type": "string",
              "description": "Identity provider metadata in XML format. Redacted on read when set because it contains IdP certificates; never echoed back in plaintext. Use an empty string when unset.\n",
              "example": "**hidden**"
            },
            "metadataUrl": {
              "type": "string",
              "description": "URL to fetch identity provider metadata from. Use an empty string when unset."
            },
            "ignoreSSL": {
              "type": "boolean",
              "description": "Whether to ignore SSL certificate errors when fetching metadata from a URL.",
              "example": false
            },
            "loginBinding": {
              "type": "string",
              "enum": [
                "redirect",
                "post"
              ],
              "description": "SAML login request binding.",
              "example": "redirect"
            },
            "loginEnabled": {
              "type": "boolean",
              "description": "Whether SAML login is enabled.",
              "example": false
            },
            "loginLabel": {
              "type": "string",
              "description": "Label shown on the SAML login button.",
              "example": "SAML"
            },
            "authnRequestsSigned": {
              "type": "boolean",
              "description": "Whether authentication requests are signed.",
              "example": false
            },
            "wantAssertionsSigned": {
              "type": "boolean",
              "description": "Whether signed assertions are required.",
              "example": true
            },
            "wantMessageSigned": {
              "type": "boolean",
              "description": "Whether signed SAML messages are required.",
              "example": true
            },
            "signingPrivateKey": {
              "type": "string",
              "description": "PEM-encoded private key for signing SAML AuthnRequests. Redacted on read when set; never echoed back in plaintext. Use an empty string when unset.\n",
              "example": "**hidden**"
            },
            "signingCertificate": {
              "type": "string",
              "description": "PEM-encoded certificate containing the public key matching the signing private key. Redacted on read when set; never echoed back in plaintext. Use an empty string when unset.\n",
              "example": "**hidden**"
            },
            "acsBinding": {
              "type": "string",
              "enum": [
                "redirect",
                "post"
              ],
              "description": "Assertion Consumer Service binding.",
              "example": "post"
            },
            "signatureConfig": {
              "type": "object",
              "description": "Configuration for the signature in SAML requests and responses.",
              "additionalProperties": false,
              "required": [
                "prefix",
                "location"
              ],
              "properties": {
                "prefix": {
                  "type": "string",
                  "example": "ds"
                },
                "location": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "reference",
                    "action"
                  ],
                  "properties": {
                    "reference": {
                      "type": "string",
                      "example": "/samlp:Response/saml:Issuer"
                    },
                    "action": {
                      "type": "string",
                      "enum": [
                        "before",
                        "after",
                        "prepend",
                        "append"
                      ],
                      "example": "after"
                    }
                  }
                }
              }
            },
            "relayState": {
              "type": "string",
              "description": "Default relay state value for SAML requests. Use an empty string when unset.",
              "example": "https://n8n.example.com"
            }
          }
        },
        "saml-configuration.update": {
          "type": "object",
          "additionalProperties": false,
          "description": "Full SAML SSO configuration. Every field must be provided; use empty strings or empty arrays when a value is unset. Partial updates are not supported.\n",
          "required": [
            "mapping",
            "metadata",
            "metadataUrl",
            "ignoreSSL",
            "loginBinding",
            "loginEnabled",
            "loginLabel",
            "authnRequestsSigned",
            "wantAssertionsSigned",
            "wantMessageSigned",
            "signingPrivateKey",
            "signingCertificate",
            "acsBinding",
            "signatureConfig",
            "relayState"
          ],
          "properties": {
            "mapping": {
              "type": "object",
              "description": "Mapping of SAML attributes to n8n user fields. Use empty strings / empty arrays for unused attributes.",
              "additionalProperties": false,
              "required": [
                "email",
                "firstName",
                "lastName",
                "userPrincipalName",
                "n8nInstanceRole",
                "n8nProjectRoles"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's email."
                },
                "firstName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's first name."
                },
                "lastName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's last name."
                },
                "userPrincipalName": {
                  "type": "string",
                  "description": "SAML attribute mapped to the user's principal name."
                },
                "n8nInstanceRole": {
                  "type": "string",
                  "description": "SAML attribute mapped to the n8n instance role. Use an empty string when unused."
                },
                "n8nProjectRoles": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "SAML attributes mapped to n8n project roles, formatted as `<projectId>:<role>`. Use an empty array when unused.\n"
                }
              }
            },
            "metadata": {
              "type": "string",
              "description": "Identity provider metadata in XML format. Use an empty string to clear stored metadata (also clears metadataUrl when no URL is provided). Use the redaction placeholder from a prior GET to leave an existing value unchanged.\n"
            },
            "metadataUrl": {
              "type": "string",
              "description": "URL to fetch identity provider metadata from. Use an empty string to clear a stored URL.\n"
            },
            "ignoreSSL": {
              "type": "boolean",
              "description": "Whether to ignore SSL certificate errors when fetching metadata from a URL.",
              "example": false
            },
            "loginBinding": {
              "type": "string",
              "enum": [
                "redirect",
                "post"
              ],
              "description": "SAML login request binding.",
              "example": "redirect"
            },
            "loginEnabled": {
              "type": "boolean",
              "description": "Whether SAML login is enabled.",
              "example": false
            },
            "loginLabel": {
              "type": "string",
              "description": "Label shown on the SAML login button.",
              "example": "SAML"
            },
            "authnRequestsSigned": {
              "type": "boolean",
              "description": "Whether authentication requests are signed.",
              "example": false
            },
            "wantAssertionsSigned": {
              "type": "boolean",
              "description": "Whether signed assertions are required.",
              "example": true
            },
            "wantMessageSigned": {
              "type": "boolean",
              "description": "Whether signed SAML messages are required.",
              "example": true
            },
            "signingPrivateKey": {
              "type": "string",
              "description": "PEM-encoded private key for signing SAML AuthnRequests. Use an empty string to clear an existing key, or the redaction placeholder from a prior GET to leave it unchanged.\n"
            },
            "signingCertificate": {
              "type": "string",
              "description": "PEM-encoded certificate containing the public key matching the signing private key. Use an empty string when unused or to clear an existing certificate.\n"
            },
            "acsBinding": {
              "type": "string",
              "enum": [
                "redirect",
                "post"
              ],
              "description": "Assertion Consumer Service binding.",
              "example": "post"
            },
            "signatureConfig": {
              "type": "object",
              "description": "Configuration for the signature in SAML requests and responses.",
              "additionalProperties": false,
              "required": [
                "prefix",
                "location"
              ],
              "properties": {
                "prefix": {
                  "type": "string",
                  "example": "ds"
                },
                "location": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "reference",
                    "action"
                  ],
                  "properties": {
                    "reference": {
                      "type": "string",
                      "example": "/samlp:Response/saml:Issuer"
                    },
                    "action": {
                      "type": "string",
                      "enum": [
                        "before",
                        "after",
                        "prepend",
                        "append"
                      ],
                      "example": "after"
                    }
                  }
                }
              }
            },
            "relayState": {
              "type": "string",
              "description": "Default relay state value for SAML requests. Use an empty string when unused.",
              "example": "https://n8n.example.com"
            },
            "entityID": {
              "type": "string",
              "description": "Service provider entity ID. Returned by GET for convenience; ignored on write so a GET response can be sent back as a PUT body.\n",
              "example": "https://n8n.example.com/rest/sso/saml/metadata"
            },
            "returnUrl": {
              "type": "string",
              "description": "Assertion Consumer Service return URL. Returned by GET for convenience; ignored on write so a GET response can be sent back as a PUT body.\n",
              "example": "https://n8n.example.com/rest/sso/saml/acs"
            }
          }
        },
        "create-credential-response": {
          "required": [
            "id",
            "name",
            "type",
            "isManaged",
            "isGlobal",
            "isResolvable",
            "resolvableAllowFallback",
            "createdAt",
            "updatedAt"
          ],
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "vHxaz5UaCghVYl9C"
            },
            "name": {
              "type": "string",
              "example": "John's Github account"
            },
            "type": {
              "type": "string",
              "example": "githubApi"
            },
            "isManaged": {
              "type": "boolean",
              "readOnly": true,
              "description": "Whether the credential is managed by n8n (managed credentials cannot be edited via the API).",
              "example": false
            },
            "isGlobal": {
              "type": "boolean",
              "readOnly": true,
              "description": "Whether the credential is available for use by all users.",
              "example": false
            },
            "isResolvable": {
              "type": "boolean",
              "readOnly": true,
              "description": "Whether the credential can be dynamically resolved by a resolver.",
              "example": false
            },
            "resolvableAllowFallback": {
              "type": "boolean",
              "readOnly": true,
              "description": "Whether the credential resolver may fall back to static credentials if dynamic resolution fails.",
              "example": false
            },
            "resolverId": {
              "type": "string",
              "nullable": true,
              "readOnly": true,
              "description": "ID of the dynamic credential resolver associated with this credential, if any.",
              "example": null
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            }
          }
        },
        "credentialSharedItem": {
          "type": "object",
          "required": [
            "id",
            "name",
            "role",
            "createdAt",
            "updatedAt"
          ],
          "properties": {
            "id": {
              "type": "string",
              "description": "Project ID"
            },
            "name": {
              "type": "string",
              "description": "Project name"
            },
            "role": {
              "type": "string",
              "description": "Role of the credential in this project (e.g. credential:owner)"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "When the credential was shared with this project"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "When the sharing was last updated"
            }
          }
        },
        "credentialListItem": {
          "allOf": [
            {
              "$ref": "#/components/schemas/create-credential-response"
            },
            {
              "type": "object",
              "required": [
                "shared"
              ],
              "properties": {
                "shared": {
                  "type": "array",
                  "description": "Shared entries (project id, name, role, createdAt, updatedAt) from the credential's shared relation",
                  "items": {
                    "$ref": "#/components/schemas/credentialSharedItem"
                  }
                }
              }
            }
          ]
        },
        "credentialList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/credentialListItem"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through credentials by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "credentialCreate": {
          "required": [
            "name",
            "type",
            "data"
          ],
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "R2DjclaysHbqn778"
            },
            "name": {
              "type": "string",
              "example": "Joe's Github Credentials"
            },
            "type": {
              "type": "string",
              "example": "githubApi"
            },
            "data": {
              "type": "object",
              "writeOnly": true,
              "example": {
                "accessToken": "ada612vad6fa5df4adf5a5dsf4389adsf76da7s"
              }
            },
            "isResolvable": {
              "type": "boolean",
              "example": false,
              "description": "Whether this credential has resolvable fields"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            },
            "projectId": {
              "type": "string",
              "description": "Project to create the credential in. Defaults to the user's personal project.",
              "example": "VmwOO9HeTEj20kxM"
            }
          }
        },
        "credential": {
          "required": [
            "name",
            "type",
            "data"
          ],
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "R2DjclaysHbqn778"
            },
            "name": {
              "type": "string",
              "example": "Joe's Github Credentials"
            },
            "type": {
              "type": "string",
              "example": "githubApi"
            },
            "data": {
              "type": "object",
              "writeOnly": true,
              "example": {
                "accessToken": "ada612vad6fa5df4adf5a5dsf4389adsf76da7s"
              }
            },
            "isResolvable": {
              "type": "boolean",
              "example": false,
              "description": "Whether this credential has resolvable fields"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "example": "2022-04-29T11:02:29.842Z"
            }
          }
        },
        "update-credential-request": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "example": "Updated Credential Name",
              "description": "The name of the credential"
            },
            "type": {
              "type": "string",
              "example": "githubApi",
              "description": "The credential type. If changing type, data must also be provided."
            },
            "data": {
              "type": "object",
              "writeOnly": true,
              "example": {
                "accessToken": "new_token_value"
              },
              "description": "The credential data. Required when changing credential type."
            },
            "isGlobal": {
              "type": "boolean",
              "example": false,
              "description": "Whether this credential is available globally"
            },
            "isResolvable": {
              "type": "boolean",
              "example": false,
              "description": "Whether this credential has resolvable fields"
            },
            "isPartialData": {
              "type": "boolean",
              "example": false,
              "default": false,
              "description": "If true, unredacts and merges existing credential data with the provided data. If false, replaces the entire data object."
            }
          }
        },
        "credentialTestResponse": {
          "type": "object",
          "required": [
            "status",
            "message"
          ],
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "OK",
                "Error"
              ]
            },
            "message": {
              "type": "string"
            }
          }
        },
        "execution": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "example": 1000
            },
            "data": {
              "type": "object",
              "additionalProperties": true,
              "description": "Detailed execution data. Only included when `includeData` is `true`.\n",
              "properties": {
                "redactionInfo": {
                  "type": "object",
                  "nullable": true,
                  "description": "Present when execution data has been redacted.",
                  "properties": {
                    "isRedacted": {
                      "type": "boolean",
                      "description": "Whether the execution data was redacted."
                    },
                    "reason": {
                      "type": "string",
                      "description": "The reason for redaction."
                    },
                    "canReveal": {
                      "type": "boolean",
                      "description": "Whether the current user has permission to reveal the redacted data."
                    }
                  }
                }
              }
            },
            "finished": {
              "type": "boolean",
              "example": true
            },
            "mode": {
              "type": "string",
              "enum": [
                "cli",
                "error",
                "integrated",
                "internal",
                "manual",
                "retry",
                "trigger",
                "webhook",
                "evaluation",
                "chat"
              ]
            },
            "retryOf": {
              "type": "number",
              "nullable": true
            },
            "retrySuccessId": {
              "type": "number",
              "nullable": true,
              "example": "2"
            },
            "startedAt": {
              "type": "string",
              "format": "date-time"
            },
            "stoppedAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true,
              "description": "The time at which the execution stopped. Will only be null for executions that still have the status 'running'."
            },
            "workflowId": {
              "type": "number",
              "example": "1000"
            },
            "waitTill": {
              "type": "string",
              "nullable": true,
              "format": "date-time"
            },
            "customData": {
              "type": "object"
            },
            "status": {
              "type": "string",
              "enum": [
                "canceled",
                "crashed",
                "error",
                "new",
                "running",
                "success",
                "unknown",
                "waiting"
              ]
            }
          }
        },
        "executionList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/execution"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through executions by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "tag": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "name"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "2tUt1wbLX592XDdX"
            },
            "name": {
              "type": "string",
              "example": "Production"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "executionTags": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/tag"
          }
        },
        "tagIds": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "id"
            ],
            "properties": {
              "id": {
                "type": "string",
                "example": "2tUt1wbLX592XDdX"
              }
            }
          }
        },
        "tagList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/tag"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through tags by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "node": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "example": "0f5532f9-36ba-4bef-86c7-30d607400b15"
            },
            "name": {
              "type": "string",
              "example": "Jira"
            },
            "webhookId": {
              "type": "string"
            },
            "disabled": {
              "type": "boolean"
            },
            "notesInFlow": {
              "type": "boolean"
            },
            "notes": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "example": "n8n-nodes-base.jira"
            },
            "typeVersion": {
              "type": "number",
              "example": 1
            },
            "executeOnce": {
              "type": "boolean",
              "example": false
            },
            "alwaysOutputData": {
              "type": "boolean",
              "example": false
            },
            "retryOnFail": {
              "type": "boolean",
              "example": false
            },
            "maxTries": {
              "type": "number"
            },
            "waitBetweenTries": {
              "type": "number"
            },
            "continueOnFail": {
              "type": "boolean",
              "example": false,
              "description": "use onError instead",
              "deprecated": true
            },
            "onError": {
              "type": "string",
              "example": "stopWorkflow"
            },
            "position": {
              "type": "array",
              "items": {
                "type": "number"
              },
              "example": [
                -100,
                80
              ]
            },
            "parameters": {
              "type": "object",
              "additionalProperties": true,
              "example": {
                "additionalProperties": {}
              }
            },
            "credentials": {
              "type": "object",
              "example": {
                "jiraSoftwareCloudApi": {
                  "id": "35",
                  "name": "jiraApi"
                }
              }
            },
            "customTelemetryTags": {
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "tag": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "key",
                      "value"
                    ],
                    "properties": {
                      "key": {
                        "type": "string"
                      },
                      "value": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "workflowNodeGroup": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "id",
            "name",
            "nodeIds"
          ],
          "properties": {
            "id": {
              "type": "string",
              "description": "Unique identifier for the node group",
              "example": "9b1c8e2a-4d3f-4a6b-8c7d-1e2f3a4b5c6d"
            },
            "name": {
              "type": "string",
              "description": "Display name of the node group",
              "example": "Data processing"
            },
            "description": {
              "type": "string",
              "maxLength": 155,
              "description": "Optional plain-text description of the node group",
              "example": "Cleans and normalizes incoming records"
            },
            "nodeIds": {
              "type": "array",
              "description": "IDs of the nodes that belong to this group",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "workflowSettings": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "saveExecutionProgress": {
              "type": "boolean"
            },
            "saveManualExecutions": {
              "type": "boolean"
            },
            "saveDataErrorExecution": {
              "type": "string",
              "enum": [
                "all",
                "none"
              ]
            },
            "saveDataSuccessExecution": {
              "type": "string",
              "enum": [
                "all",
                "none"
              ]
            },
            "executionTimeout": {
              "type": "number",
              "example": 3600,
              "maxLength": 3600
            },
            "errorWorkflow": {
              "type": "string",
              "example": "VzqKEW0ShTXA5vPj",
              "description": "The ID of the workflow that contains the error trigger node."
            },
            "timezone": {
              "type": "string",
              "example": "America/New_York"
            },
            "executionOrder": {
              "type": "string",
              "example": "v1"
            },
            "callerPolicy": {
              "type": "string",
              "enum": [
                "any",
                "none",
                "workflowsFromAList",
                "workflowsFromSameOwner"
              ],
              "description": "Controls which workflows are allowed to call this workflow using the Execute Workflow node.\nDefaults to workflowsFromSameOwner.\n\nAvailable options:\n- `any`: Any workflow can call this workflow (no restrictions)\n- `none`: No other workflows can call this workflow (completely blocked)\n- `workflowsFromSameOwner` (default): Only workflows owned by the same project can call this workflow\n  * For personal projects: Only workflows created by the same user\n  * For team projects: Only workflows within the same team project\n- `workflowsFromAList`: Only specific workflows listed in the `callerIds` field can call this workflow\n  * Requires the `callerIds` field to specify which workflow IDs are allowed\n  * See `callerIds` field documentation for usage\n",
              "example": "workflowsFromSameOwner"
            },
            "callerIds": {
              "type": "string",
              "description": "Comma-separated list of workflow IDs allowed to call this workflow (only used with workflowsFromAList policy)",
              "example": "14, 18, 23"
            },
            "timeSavedPerExecution": {
              "type": "number",
              "description": "Estimated time saved per execution in minutes"
            },
            "redactionPolicy": {
              "type": "string",
              "enum": [
                "none",
                "non-manual",
                "manual-only",
                "all"
              ],
              "description": "Controls whether execution data is redacted for this workflow.\n\nAvailable options:\n- `none` (default): No redaction — all execution data is stored.\n- `non-manual`: Redact production (non-manually triggered) executions only.\n- `manual-only`: Redact manually triggered executions only.\n- `all`: Redact all executions (manual and production).\n\nWhen the instance has a redaction floor configured, the policy must be equal to\nor stricter than the floor. A policy weaker than the floor is rejected with 422\non create, and on update when it changes the stored policy; an unchanged\npre-existing below-floor policy is preserved (the floor is not applied\nretroactively). Omitting this field when creating a workflow seeds it to the\ninstance floor instead.\n",
              "example": "non-manual"
            },
            "availableInMCP": {
              "type": "boolean",
              "description": "Controls whether this workflow is accessible via the Model Context Protocol (MCP).\nDefaults to false.\n\nWhen enabled, this workflow can be called by MCP clients (AI assistants and other tools\nthat support MCP). This allows external AI tools to discover and execute this workflow\nas part of their capabilities.\n\nRequirements for enabling MCP access:\n- The workflow must be active (not deactivated)\n- The workflow must contain at least one active Webhook node\n- Only webhook-triggered workflows can be exposed via MCP\n\nSecurity note: When a workflow is available in MCP, it can be discovered and executed\nby any MCP client that has the appropriate API credentials for your n8n instance.\n",
              "example": false
            },
            "customTelemetryTags": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "key",
                  "value"
                ],
                "properties": {
                  "key": {
                    "type": "string"
                  },
                  "value": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "sharedWorkflow": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "role": {
              "type": "string",
              "example": "workflow:owner"
            },
            "workflowId": {
              "type": "string",
              "example": "2tUt1wbLX592XDdX"
            },
            "projectId": {
              "type": "string",
              "example": "2tUt1wbLX592XDdX"
            },
            "project": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "readOnly": true
                },
                "name": {
                  "type": "string"
                },
                "type": {
                  "type": "string",
                  "readOnly": true
                }
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "activeVersion": {
          "type": "object",
          "readOnly": true,
          "nullable": true,
          "additionalProperties": false,
          "properties": {
            "versionId": {
              "type": "string",
              "readOnly": true,
              "description": "Unique identifier for this workflow version",
              "example": "7c6b9e3f-8d4a-4b2c-9f1e-6a5d3b8c7e4f"
            },
            "workflowId": {
              "type": "string",
              "readOnly": true,
              "description": "The workflow this version belongs to",
              "example": "2tUt1wbLX592XDdX"
            },
            "nodes": {
              "type": "array",
              "readOnly": true,
              "items": {
                "$ref": "#/components/schemas/node"
              }
            },
            "connections": {
              "type": "object",
              "readOnly": true,
              "example": {
                "Jira": {
                  "main": [
                    [
                      {
                        "node": "Jira",
                        "type": "main",
                        "index": 0
                      }
                    ]
                  ]
                }
              }
            },
            "nodeGroups": {
              "type": "array",
              "readOnly": true,
              "description": "Visual groupings of nodes shown as frames on the canvas",
              "items": {
                "$ref": "#/components/schemas/workflowNodeGroup"
              }
            },
            "authors": {
              "type": "string",
              "readOnly": true,
              "description": "Comma-separated list of author IDs who contributed to this version",
              "example": "1,2,3"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "workflow": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "name",
            "nodes",
            "connections",
            "settings"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "2tUt1wbLX592XDdX"
            },
            "name": {
              "type": "string",
              "example": "Workflow 1"
            },
            "description": {
              "type": "string",
              "description": "Description of the workflow",
              "example": "My workflow description"
            },
            "parentFolderId": {
              "type": "string",
              "nullable": true,
              "writeOnly": true,
              "description": "ID of the folder to move the workflow into. Pass null to move it to the project root; omit to leave its current folder unchanged.",
              "example": "X8ovzm8lTQjcXRZQ"
            },
            "active": {
              "type": "boolean",
              "readOnly": true
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "isArchived": {
              "type": "boolean",
              "readOnly": true
            },
            "versionId": {
              "type": "string",
              "readOnly": true,
              "description": "Current version identifier used for optimistic locking"
            },
            "triggerCount": {
              "type": "integer",
              "readOnly": true,
              "description": "Number of active trigger nodes in the workflow"
            },
            "nodes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/node"
              }
            },
            "connections": {
              "type": "object",
              "example": {
                "Jira": {
                  "main": [
                    [
                      {
                        "node": "Jira",
                        "type": "main",
                        "index": 0
                      }
                    ]
                  ]
                }
              }
            },
            "nodeGroups": {
              "type": "array",
              "description": "Visual groupings of nodes shown as frames on the canvas",
              "items": {
                "$ref": "#/components/schemas/workflowNodeGroup"
              }
            },
            "settings": {
              "$ref": "#/components/schemas/workflowSettings"
            },
            "staticData": {
              "example": {
                "lastId": 1
              },
              "anyOf": [
                {
                  "type": "string",
                  "format": "jsonString",
                  "nullable": true
                },
                {
                  "type": "object",
                  "nullable": true
                }
              ]
            },
            "pinData": {
              "type": "object",
              "nullable": true,
              "description": "Pinned sample data for nodes, keyed by node name"
            },
            "meta": {
              "type": "object",
              "nullable": true,
              "readOnly": true,
              "description": "Workflow metadata such as template information",
              "properties": {
                "onboardingId": {
                  "type": "string"
                },
                "templateId": {
                  "type": "string"
                },
                "instanceId": {
                  "type": "string"
                },
                "templateCredsSetupCompleted": {
                  "type": "boolean"
                }
              }
            },
            "tags": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/tag"
              },
              "readOnly": true
            },
            "shared": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/sharedWorkflow"
              }
            },
            "activeVersion": {
              "$ref": "#/components/schemas/activeVersion"
            }
          }
        },
        "workflowList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/workflow"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through workflows by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "workflowCreate": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "name",
            "nodes",
            "connections",
            "settings"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "2tUt1wbLX592XDdX"
            },
            "name": {
              "type": "string",
              "example": "Workflow 1"
            },
            "active": {
              "type": "boolean",
              "readOnly": true
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "isArchived": {
              "type": "boolean",
              "readOnly": true
            },
            "versionId": {
              "type": "string",
              "readOnly": true,
              "description": "Current version identifier used for optimistic locking"
            },
            "triggerCount": {
              "type": "integer",
              "readOnly": true,
              "description": "Number of active trigger nodes in the workflow"
            },
            "nodes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/node"
              }
            },
            "connections": {
              "type": "object",
              "example": {
                "Jira": {
                  "main": [
                    [
                      {
                        "node": "Jira",
                        "type": "main",
                        "index": 0
                      }
                    ]
                  ]
                }
              }
            },
            "nodeGroups": {
              "type": "array",
              "description": "Visual groupings of nodes shown as frames on the canvas",
              "items": {
                "$ref": "#/components/schemas/workflowNodeGroup"
              }
            },
            "settings": {
              "$ref": "#/components/schemas/workflowSettings"
            },
            "staticData": {
              "example": {
                "lastId": 1
              },
              "anyOf": [
                {
                  "type": "string",
                  "format": "jsonString",
                  "nullable": true
                },
                {
                  "type": "object",
                  "nullable": true
                }
              ]
            },
            "pinData": {
              "type": "object",
              "nullable": true,
              "description": "Pinned sample data for nodes, keyed by node name"
            },
            "projectId": {
              "type": "string",
              "description": "Target project to create the workflow in. Defaults to the user's personal project.",
              "example": "VmwOO9HeTEj20kxM"
            },
            "parentFolderId": {
              "type": "string",
              "nullable": true,
              "description": "ID of the folder to place the workflow in. Omit or null to place at the project root.",
              "example": "X8ovzm8lTQjcXRZQ"
            },
            "meta": {
              "type": "object",
              "nullable": true,
              "readOnly": true,
              "description": "Workflow metadata such as template information",
              "properties": {
                "onboardingId": {
                  "type": "string"
                },
                "templateId": {
                  "type": "string"
                },
                "instanceId": {
                  "type": "string"
                },
                "templateCredsSetupCompleted": {
                  "type": "boolean"
                }
              }
            },
            "tags": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/tag"
              },
              "readOnly": true
            },
            "shared": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/sharedWorkflow"
              }
            },
            "activeVersion": {
              "$ref": "#/components/schemas/activeVersion"
            }
          }
        },
        "workflowVersion": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "versionId",
            "workflowId",
            "nodes",
            "connections",
            "authors"
          ],
          "properties": {
            "versionId": {
              "type": "string",
              "readOnly": true,
              "description": "The version ID of this workflow snapshot",
              "example": "abc123-def456"
            },
            "workflowId": {
              "type": "string",
              "readOnly": true,
              "description": "The workflow ID this version belongs to",
              "example": "2tUt1wbLX592XDdX"
            },
            "nodes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/node"
              },
              "description": "Nodes as they were in this version",
              "readOnly": true
            },
            "connections": {
              "type": "object",
              "example": {
                "Jira": {
                  "main": [
                    [
                      {
                        "node": "Jira",
                        "type": "main",
                        "index": 0
                      }
                    ]
                  ]
                }
              },
              "description": "Connections as they were in this version",
              "readOnly": true
            },
            "nodeGroups": {
              "type": "array",
              "readOnly": true,
              "description": "Node groups as they were in this version",
              "items": {
                "$ref": "#/components/schemas/workflowNodeGroup"
              }
            },
            "authors": {
              "type": "string",
              "readOnly": true,
              "description": "Authors who created this version",
              "example": "John Doe"
            },
            "name": {
              "type": "string",
              "nullable": true,
              "description": "Workflow name at this version",
              "example": "Workflow 1"
            },
            "description": {
              "type": "string",
              "nullable": true,
              "description": "Workflow description at this version"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "description": "When this version was created"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true,
              "description": "When this version was last updated"
            }
          }
        },
        "workflowTags": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/tag"
          }
        },
        "testRunSummary": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "9f8e7d6c5b4a3210"
            },
            "status": {
              "type": "string",
              "enum": [
                "new",
                "running",
                "completed",
                "error",
                "cancelled"
              ]
            },
            "runAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "completedAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "metrics": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true,
              "description": "Aggregated metrics collected across the run's test cases."
            },
            "errorCode": {
              "type": "string",
              "nullable": true
            },
            "errorDetails": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true
            },
            "finalResult": {
              "type": "string",
              "nullable": true,
              "enum": [
                "success",
                "error",
                "warning"
              ],
              "description": "Overall result of the run, derived from its test cases once completed."
            },
            "testCaseCount": {
              "type": "integer",
              "example": 42
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "testRunList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/testRunSummary"
              }
            },
            "nextCursor": {
              "type": "string",
              "nullable": true,
              "description": "Paginate through test runs by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "testRun": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "9f8e7d6c5b4a3210"
            },
            "status": {
              "type": "string",
              "enum": [
                "new",
                "running",
                "completed",
                "error",
                "cancelled"
              ]
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "testRunCancel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "9f8e7d6c5b4a3210"
            },
            "status": {
              "type": "string",
              "enum": [
                "cancelled"
              ]
            }
          }
        },
        "testCaseExecution": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "1a2b3c4d5e6f7080"
            },
            "status": {
              "type": "string",
              "enum": [
                "new",
                "running",
                "evaluation_running",
                "success",
                "error",
                "warning",
                "cancelled"
              ]
            },
            "runAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "completedAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            },
            "metrics": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true,
              "description": "Metrics produced by this test case."
            },
            "errorCode": {
              "type": "string",
              "nullable": true
            },
            "errorDetails": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true
            },
            "inputs": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true,
              "description": "Input data for this test case."
            },
            "outputs": {
              "type": "object",
              "nullable": true,
              "additionalProperties": true,
              "description": "Output data produced by this test case."
            },
            "executionId": {
              "type": "string",
              "nullable": true,
              "description": "ID of the underlying workflow execution, if still retained."
            }
          }
        },
        "testCaseExecutionList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/testCaseExecution"
              }
            },
            "nextCursor": {
              "type": "string",
              "nullable": true,
              "description": "Paginate through test cases by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "user": {
          "required": [
            "email"
          ],
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "john.doe@company.com"
            },
            "firstName": {
              "maxLength": 32,
              "type": "string",
              "description": "User's first name",
              "readOnly": true,
              "example": "john"
            },
            "lastName": {
              "maxLength": 32,
              "type": "string",
              "description": "User's last name",
              "readOnly": true,
              "example": "Doe"
            },
            "isPending": {
              "type": "boolean",
              "description": "Whether the user finished setting up their account in response to the invitation (true) or not (false).",
              "readOnly": true
            },
            "createdAt": {
              "type": "string",
              "description": "Time the user was created.",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "description": "Last time the user was updated.",
              "format": "date-time",
              "readOnly": true
            },
            "role": {
              "type": "string",
              "example": "global:owner",
              "readOnly": true
            },
            "mfaEnabled": {
              "type": "boolean",
              "description": "Whether the user has multi-factor authentication (MFA/2FA) enabled.",
              "readOnly": true,
              "example": false
            }
          }
        },
        "userList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/user"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through users by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "pull": {
          "type": "object",
          "properties": {
            "force": {
              "type": "boolean",
              "example": true
            },
            "autoPublish": {
              "type": "string",
              "enum": [
                "none",
                "all",
                "published"
              ],
              "default": "none",
              "description": "Controls automatic workflow publishing after import:\n- `none`: Keep workflows in their local published state (default)\n- `all`: Publish all imported workflows\n- `published`: Publish only workflows that were published locally before import\n",
              "example": "published"
            }
          }
        },
        "sourceControlledFile": {
          "type": "object",
          "required": [
            "file",
            "id",
            "name",
            "type",
            "status",
            "location",
            "conflict",
            "updatedAt"
          ],
          "properties": {
            "file": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "credential",
                "workflow",
                "tags",
                "variables",
                "file",
                "folders",
                "project",
                "datatable"
              ]
            },
            "status": {
              "type": "string",
              "enum": [
                "new",
                "modified",
                "deleted",
                "created",
                "renamed",
                "conflicted",
                "ignored",
                "staged",
                "unknown"
              ]
            },
            "location": {
              "type": "string",
              "enum": [
                "local",
                "remote"
              ]
            },
            "conflict": {
              "type": "boolean"
            },
            "updatedAt": {
              "type": "string"
            },
            "pushed": {
              "type": "boolean"
            },
            "isLocalPublished": {
              "type": "boolean"
            },
            "isRemoteArchived": {
              "type": "boolean"
            },
            "parentFolderId": {
              "type": "string",
              "nullable": true
            },
            "folderPath": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "owner": {
              "type": "object",
              "required": [
                "type",
                "projectId",
                "projectName"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "personal",
                    "team"
                  ]
                },
                "projectId": {
                  "type": "string"
                },
                "projectName": {
                  "type": "string"
                }
              }
            },
            "publishingError": {
              "type": "string"
            }
          }
        },
        "pullResult": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/sourceControlledFile"
          }
        },
        "project": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "name"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true
            },
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "readOnly": true
            }
          }
        },
        "variable": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "key",
            "value"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true
            },
            "key": {
              "type": "string"
            },
            "value": {
              "type": "string",
              "example": "test"
            },
            "type": {
              "type": "string",
              "readOnly": true
            },
            "project": {
              "$ref": "#/components/schemas/project"
            }
          }
        },
        "variableList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/variable"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through variables by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "variable.create": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "key",
            "value"
          ],
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true
            },
            "key": {
              "type": "string"
            },
            "value": {
              "type": "string",
              "example": "test"
            },
            "type": {
              "type": "string",
              "readOnly": true
            },
            "projectId": {
              "type": "string",
              "example": "VmwOO9HeTEj20kxM",
              "nullable": true
            }
          }
        },
        "dataTable": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Unique identifier for the data table"
            },
            "name": {
              "type": "string",
              "description": "Name of the data table"
            },
            "columns": {
              "type": "array",
              "description": "Column definitions",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "Column ID"
                  },
                  "name": {
                    "type": "string",
                    "description": "Column name"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "string",
                      "number",
                      "boolean",
                      "date"
                    ],
                    "description": "Column data type"
                  },
                  "index": {
                    "type": "integer",
                    "description": "Column position"
                  }
                }
              }
            },
            "projectId": {
              "type": "string",
              "description": "ID of the project this table belongs to"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "Timestamp when the table was created"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "Timestamp when the table was last updated"
            }
          },
          "required": [
            "id",
            "name",
            "columns",
            "projectId",
            "createdAt",
            "updatedAt"
          ]
        },
        "dataTableList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/dataTable"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through data tables by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "createDataTableRequest": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the data table",
              "minLength": 1,
              "maxLength": 128
            },
            "columns": {
              "type": "array",
              "description": "Column definitions for the table",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Column name",
                    "minLength": 1
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "string",
                      "number",
                      "boolean",
                      "date",
                      "json"
                    ],
                    "description": "Column data type"
                  }
                },
                "required": [
                  "name",
                  "type"
                ]
              }
            },
            "projectId": {
              "type": "string",
              "description": "ID of the project to create the table in. When omitted, the table is created in the user's personal project.\n"
            }
          },
          "required": [
            "name",
            "columns"
          ]
        },
        "updateDataTableRequest": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "New name for the data table",
              "minLength": 1,
              "maxLength": 128
            }
          },
          "required": [
            "name"
          ]
        },
        "dataTableRow": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "description": "The row ID (auto-generated)"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date and time the row was created"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date and time the row was last updated"
            }
          },
          "additionalProperties": true,
          "description": "A data table row with system columns (id, createdAt, updatedAt) and user-defined columns"
        },
        "dataTableRowList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/dataTableRow"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through rows by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "insertRowsRequest": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": true
              },
              "description": "Array of rows to insert. Each row is an object with column names as keys.",
              "minItems": 1
            },
            "returnType": {
              "type": "string",
              "enum": [
                "count",
                "id",
                "all"
              ],
              "default": "count",
              "description": "- count: Return only the number of rows inserted\n- id: Return an array of inserted row IDs\n- all: Return the full row data for all inserted rows\n"
            }
          },
          "required": [
            "data"
          ]
        },
        "updateRowsRequest": {
          "type": "object",
          "properties": {
            "filter": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "and",
                    "or"
                  ],
                  "default": "and"
                },
                "filters": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "properties": {
                      "columnName": {
                        "type": "string"
                      },
                      "condition": {
                        "type": "string",
                        "enum": [
                          "eq",
                          "neq",
                          "like",
                          "ilike",
                          "gt",
                          "gte",
                          "lt",
                          "lte"
                        ]
                      },
                      "value": {}
                    },
                    "required": [
                      "columnName",
                      "condition",
                      "value"
                    ]
                  }
                }
              },
              "required": [
                "filters"
              ],
              "description": "Filter conditions to match rows for update"
            },
            "data": {
              "type": "object",
              "additionalProperties": true,
              "description": "Column values to update"
            },
            "returnData": {
              "type": "boolean",
              "default": false,
              "description": "If true, return the updated rows; if false, return true on success"
            },
            "dryRun": {
              "type": "boolean",
              "default": false,
              "description": "If true, preview changes without persisting them"
            }
          },
          "required": [
            "filter",
            "data"
          ]
        },
        "upsertRowRequest": {
          "type": "object",
          "properties": {
            "filter": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "and",
                    "or"
                  ],
                  "default": "and"
                },
                "filters": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "properties": {
                      "columnName": {
                        "type": "string"
                      },
                      "condition": {
                        "type": "string",
                        "enum": [
                          "eq",
                          "neq",
                          "like",
                          "ilike",
                          "gt",
                          "gte",
                          "lt",
                          "lte"
                        ]
                      },
                      "value": {}
                    },
                    "required": [
                      "columnName",
                      "condition",
                      "value"
                    ]
                  }
                }
              },
              "required": [
                "filters"
              ],
              "description": "Filter conditions to match existing row. If no row matches, a new row is inserted."
            },
            "data": {
              "type": "object",
              "additionalProperties": true,
              "description": "Column values for the row"
            },
            "returnData": {
              "type": "boolean",
              "default": false,
              "description": "If true, return the upserted row; if false, return true on success"
            },
            "dryRun": {
              "type": "boolean",
              "default": false,
              "description": "If true, preview changes without persisting them"
            }
          },
          "required": [
            "filter",
            "data"
          ]
        },
        "dataTableColumn": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Column ID"
            },
            "name": {
              "type": "string",
              "description": "Column name"
            },
            "dataTableId": {
              "type": "string",
              "description": "ID of the data table this column belongs to"
            },
            "type": {
              "type": "string",
              "enum": [
                "string",
                "number",
                "boolean",
                "date"
              ],
              "description": "Column data type"
            },
            "index": {
              "type": "integer",
              "description": "Column position"
            }
          },
          "required": [
            "id",
            "name",
            "dataTableId",
            "type",
            "index"
          ]
        },
        "dataTableColumnName": {
          "type": "string",
          "description": "Column name. Must start with a letter; only letters, digits, and underscores after that; maximum 63 characters.",
          "minLength": 1,
          "maxLength": 63,
          "pattern": "^[a-zA-Z][a-zA-Z0-9_]*$"
        },
        "createColumnRequest": {
          "type": "object",
          "properties": {
            "name": {
              "$ref": "#/components/schemas/dataTableColumnName"
            },
            "type": {
              "type": "string",
              "enum": [
                "string",
                "number",
                "boolean",
                "date"
              ],
              "description": "Column data type"
            },
            "index": {
              "type": "integer",
              "minimum": 0,
              "description": "Column position (optional, appended to end if omitted)"
            }
          },
          "required": [
            "name",
            "type"
          ]
        },
        "updateColumnRequest": {
          "type": "object",
          "properties": {
            "name": {
              "$ref": "#/components/schemas/dataTableColumnName"
            },
            "index": {
              "type": "integer",
              "minimum": 0,
              "description": "New zero-based position for the column"
            }
          },
          "additionalProperties": false,
          "anyOf": [
            {
              "required": [
                "name"
              ]
            },
            {
              "required": [
                "index"
              ]
            }
          ]
        },
        "projectList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/project"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through projects by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first \"page\" of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "projectMember": {
          "type": "object",
          "description": "A project member (user with their role in the project).",
          "properties": {
            "id": {
              "type": "string",
              "description": "The user's unique identifier.",
              "readOnly": true,
              "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            "email": {
              "type": "string",
              "format": "email",
              "description": "The user's email address.",
              "readOnly": true,
              "example": "john.doe@company.com"
            },
            "firstName": {
              "type": "string",
              "maxLength": 32,
              "description": "The user's first name.",
              "readOnly": true,
              "example": "john"
            },
            "lastName": {
              "type": "string",
              "maxLength": 32,
              "description": "The user's last name.",
              "readOnly": true,
              "example": "Doe"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "When the user was created.",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "When the user was last updated.",
              "readOnly": true
            },
            "role": {
              "type": "string",
              "description": "The user's role in the project (e.g. project:admin, project:viewer).",
              "readOnly": true,
              "example": "project:viewer"
            }
          }
        },
        "projectMemberList": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/projectMember"
              }
            },
            "nextCursor": {
              "type": "string",
              "description": "Paginate through project members by setting the cursor parameter to the nextCursor attribute returned by a previous request. Default value fetches the first page of the collection.",
              "nullable": true,
              "example": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
            }
          }
        },
        "communityPackage": {
          "type": "object",
          "properties": {
            "packageName": {
              "type": "string",
              "description": "npm package name"
            },
            "installedVersion": {
              "type": "string",
              "description": "Currently installed version"
            },
            "authorName": {
              "type": "string",
              "description": "Package author name"
            },
            "authorEmail": {
              "type": "string",
              "description": "Package author email"
            },
            "installedNodes": {
              "type": "array",
              "description": "Nodes included in this package",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string"
                  },
                  "latestVersion": {
                    "type": "number"
                  }
                }
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            },
            "updateAvailable": {
              "type": "string",
              "description": "Version available for update, if any"
            },
            "failedLoading": {
              "type": "boolean",
              "description": "Whether the package failed to load"
            }
          }
        },
        "communityPackageList": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/communityPackage"
          }
        },
        "installCommunityPackageRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "npm package name (must start with n8n-nodes-)"
            },
            "version": {
              "type": "string",
              "description": "Specific semver version to install"
            },
            "verify": {
              "type": "boolean",
              "description": "Whether to verify the package against the n8n-vetted package list. Required when the instance has N8N_UNVERIFIED_PACKAGES_ENABLED=false.\n"
            }
          }
        },
        "insights": {
          "type": "object",
          "required": [
            "total",
            "failed",
            "failureRate",
            "timeSaved",
            "averageRunTime"
          ],
          "properties": {
            "total": {
              "type": "object",
              "required": [
                "value",
                "deviation",
                "unit"
              ],
              "properties": {
                "value": {
                  "type": "number"
                },
                "deviation": {
                  "type": "number",
                  "nullable": true
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "count"
                  ]
                }
              }
            },
            "failed": {
              "type": "object",
              "required": [
                "value",
                "deviation",
                "unit"
              ],
              "properties": {
                "value": {
                  "type": "number"
                },
                "deviation": {
                  "type": "number",
                  "nullable": true
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "count"
                  ]
                }
              }
            },
            "failureRate": {
              "type": "object",
              "required": [
                "value",
                "deviation",
                "unit"
              ],
              "properties": {
                "value": {
                  "type": "number"
                },
                "deviation": {
                  "type": "number",
                  "nullable": true
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "ratio"
                  ]
                }
              }
            },
            "timeSaved": {
              "type": "object",
              "required": [
                "value",
                "deviation",
                "unit"
              ],
              "properties": {
                "value": {
                  "type": "number"
                },
                "deviation": {
                  "type": "number",
                  "nullable": true
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "minute"
                  ]
                }
              }
            },
            "averageRunTime": {
              "type": "object",
              "required": [
                "value",
                "deviation",
                "unit"
              ],
              "properties": {
                "value": {
                  "type": "number"
                },
                "deviation": {
                  "type": "number",
                  "nullable": true
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "millisecond"
                  ]
                }
              }
            }
          }
        },
        "folder": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true
            },
            "name": {
              "type": "string",
              "example": "My Folder"
            },
            "parentFolderId": {
              "type": "string",
              "nullable": true
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "folder.create": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "My Folder"
            },
            "parentFolderId": {
              "type": "string",
              "example": "abc123"
            }
          }
        },
        "folder.update": {
          "type": "object",
          "additionalProperties": false,
          "minProperties": 1,
          "properties": {
            "name": {
              "type": "string",
              "example": "Renamed Folder"
            },
            "parentFolderId": {
              "type": "string",
              "example": "abc123"
            }
          }
        },
        "exportPackageRequest": {
          "type": "object",
          "additionalProperties": false,
          "description": "Selects what to export. Provide `workflowIds` and/or `folderIds` to export loose workflows and folders, or `projectIds` to export whole projects, but not both groups in the same request. At least one id must be supplied.",
          "properties": {
            "workflowIds": {
              "type": "array",
              "maxItems": 300,
              "description": "IDs of the workflows to include in the exported package.",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "2tUt1wbLX592XDdX"
              ]
            },
            "folderIds": {
              "type": "array",
              "maxItems": 300,
              "description": "IDs of the folders to include in the exported package. Each folder is exported with its nested folders.",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "9xKp2mNqRzAbCdEf"
              ]
            },
            "projectIds": {
              "type": "array",
              "description": "IDs of the projects to include in the exported package.",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "Ox8O54VQrmBrb4qL"
              ]
            },
            "includeVariableValues": {
              "type": "boolean",
              "default": true,
              "description": "Whether values of variables referenced by the exported workflows are bundled into the package. When `false`, variables still travel as name/type files and are listed in the package requirements, but no values travel with the package."
            },
            "missingWorkflowDependencyPolicy": {
              "type": "string",
              "enum": [
                "fail",
                "reference-only",
                "include-in-package"
              ],
              "description": "Policy for missing static sub-workflow dependencies. Currently only `fail` is supported; `reference-only` and `include-in-package` are reserved for upcoming export modes.",
              "example": "fail",
              "default": "fail"
            }
          }
        },
        "importBlockingIssue": {
          "oneOf": [
            {
              "type": "object",
              "description": "A workflow whose source id already matches one in the target project, under the `fail` conflict policy.\n",
              "required": [
                "type",
                "sourceWorkflowId",
                "existingWorkflowId",
                "name"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "workflow-conflict"
                  ]
                },
                "sourceWorkflowId": {
                  "type": "string"
                },
                "existingWorkflowId": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                }
              }
            },
            {
              "type": "object",
              "description": "A `source`-policy workflow whose id is already taken on the instance. Workflow ids are globally unique, so the id cannot be created in the target project. The existing workflow may live in any project — including the target project itself — and may be archived (archived workflows keep their id but are never matched for updates).\n",
              "required": [
                "type",
                "sourceWorkflowId",
                "existingWorkflowId",
                "existingProjectId",
                "isArchived",
                "name"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "workflow-id-conflict"
                  ]
                },
                "sourceWorkflowId": {
                  "type": "string"
                },
                "existingWorkflowId": {
                  "type": "string"
                },
                "existingProjectId": {
                  "type": "string",
                  "nullable": true,
                  "description": "Project that owns the existing workflow, or null when no owning project could be determined.\n"
                },
                "isArchived": {
                  "type": "boolean",
                  "description": "Whether the existing workflow is archived."
                },
                "name": {
                  "type": "string"
                }
              }
            },
            {
              "type": "object",
              "description": "A workflow whose source id already matches one in the target project but lives outside the requested import folder. Folder-targeted imports cannot update workflows in place at a different location.\n",
              "required": [
                "type",
                "sourceWorkflowId",
                "existingWorkflowId",
                "existingParentFolderId",
                "targetFolderId",
                "name"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "workflow-folder-conflict"
                  ]
                },
                "sourceWorkflowId": {
                  "type": "string"
                },
                "existingWorkflowId": {
                  "type": "string"
                },
                "existingParentFolderId": {
                  "type": "string",
                  "nullable": true,
                  "description": "Folder that currently contains the matched workflow, or null when it lives at the project root.\n"
                },
                "targetFolderId": {
                  "type": "string",
                  "description": "Folder the import was requested to land in."
                },
                "name": {
                  "type": "string"
                }
              }
            },
            {
              "type": "object",
              "description": "A package folder that cannot be imported as-is. `kind` distinguishes the cause: `parent-mismatch` (a folder matched by id sits under a different parent than the package places it), `id-in-other-project` (the folder id already exists in a different project — ids are globally unique), or `fail-policy` (the folder already exists and `folderConflictPolicy` is `fail`).\n",
              "required": [
                "type",
                "kind",
                "sourceFolderId",
                "name"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "folder-conflict"
                  ]
                },
                "kind": {
                  "type": "string",
                  "enum": [
                    "parent-mismatch",
                    "id-in-other-project",
                    "fail-policy"
                  ]
                },
                "sourceFolderId": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "existingParentFolderId": {
                  "type": "string",
                  "nullable": true,
                  "description": "For `parent-mismatch`: the matched folder's current parent in the target."
                },
                "expectedParentFolderId": {
                  "type": "string",
                  "nullable": true,
                  "description": "For `parent-mismatch`: the parent the package would place the folder under."
                },
                "existingProjectId": {
                  "type": "string",
                  "nullable": true,
                  "description": "For `id-in-other-project`: the project that already owns the id."
                }
              }
            },
            {
              "type": "object",
              "description": "A credential reference that could not be resolved in the target project.",
              "required": [
                "type",
                "kind",
                "sourceId",
                "usedByWorkflows"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "credential-unresolved"
                  ]
                },
                "kind": {
                  "type": "string",
                  "enum": [
                    "not_found",
                    "unknown_type",
                    "source_not_found",
                    "type_mismatch"
                  ]
                },
                "sourceId": {
                  "type": "string"
                },
                "targetId": {
                  "type": "string",
                  "description": "Target credential id for an explicit credential binding."
                },
                "expectedType": {
                  "type": "string",
                  "description": "For `type_mismatch`: the credential type the package's workflow node requires.\n"
                },
                "actualType": {
                  "type": "string",
                  "description": "For `type_mismatch`: the actual type of the resolved target credential.\n"
                },
                "usedByWorkflows": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          ]
        },
        "event-types": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "data"
          ],
          "properties": {
            "data": {
              "type": "array",
              "description": "Event names that can be streamed to a destination.",
              "items": {
                "type": "string"
              },
              "example": [
                "n8n.workflow.started",
                "n8n.workflow.success",
                "n8n.workflow.failed"
              ]
            }
          }
        },
        "destination.common": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "readOnly": true,
              "description": "Server-generated unique id of the destination. Returned in responses; not accepted in requests.",
              "example": "88be6560-bfb4-455c-8aa1-06971e9e5522"
            },
            "label": {
              "type": "string",
              "description": "Human-readable name shown in the UI.",
              "example": "My destination"
            },
            "enabled": {
              "type": "boolean",
              "description": "Whether the destination currently receives events.",
              "example": true
            },
            "subscribedEvents": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Event names (or group prefixes, e.g. `n8n.workflow`, which matches all `n8n.workflow.*` events) this destination receives. Retrieve the full list of streamable event names from `GET /settings/log-streaming/event-types`.\n",
              "example": [
                "n8n.workflow",
                "n8n.audit"
              ]
            },
            "anonymizeAuditMessages": {
              "type": "boolean",
              "description": "Whether audit message payloads are anonymized before being sent.",
              "example": false
            },
            "circuitBreaker": {
              "type": "object",
              "additionalProperties": true,
              "description": "Circuit-breaker tuning for delivery. After repeated failures the destination stops sending for a cool-down window instead of hammering an unhealthy target. All fields are optional; sensible defaults apply when omitted.\n",
              "properties": {
                "maxFailures": {
                  "type": "integer",
                  "description": "Maximum failures within the sliding window before the breaker opens."
                },
                "failureWindow": {
                  "type": "integer",
                  "description": "Sliding window, in milliseconds, over which failures are counted."
                }
              }
            }
          }
        },
        "parameter-list": {
          "type": "object",
          "additionalProperties": true,
          "description": "Key-value pairs used when the matching `specify*` field is `keypair`.",
          "properties": {
            "parameters": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "name",
                  "value"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "example": "Authorization"
                  },
                  "value": {
                    "description": "Parameter value. Usually a string; numbers, booleans and null are also accepted.\n",
                    "example": "Bearer <token>"
                  }
                }
              }
            }
          }
        },
        "destination.webhook": {
          "allOf": [
            {
              "$ref": "#/components/schemas/destination.common"
            },
            {
              "type": "object",
              "additionalProperties": true,
              "required": [
                "type",
                "url"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "webhook"
                  ],
                  "description": "Sends each event as an HTTP request to a URL.",
                  "example": "webhook"
                },
                "url": {
                  "type": "string",
                  "format": "uri",
                  "description": "Target URL that receives the event payload.",
                  "example": "https://example.com/n8n-events"
                },
                "method": {
                  "type": "string",
                  "description": "HTTP method used for the request.",
                  "example": "POST"
                },
                "sendHeaders": {
                  "type": "boolean",
                  "description": "Whether to attach custom headers to the request.",
                  "example": false
                },
                "specifyHeaders": {
                  "type": "string",
                  "description": "How custom headers are provided — `keypair` or `json`.",
                  "example": "keypair"
                },
                "headerParameters": {
                  "$ref": "#/components/schemas/parameter-list"
                },
                "jsonHeaders": {
                  "type": "string",
                  "description": "Custom headers as a JSON string when `specifyHeaders` is `json`."
                },
                "sendQuery": {
                  "type": "boolean",
                  "description": "Whether to attach query parameters to the request.",
                  "example": false
                },
                "specifyQuery": {
                  "type": "string",
                  "description": "How query parameters are provided — `keypair` or `json`."
                },
                "queryParameters": {
                  "$ref": "#/components/schemas/parameter-list"
                },
                "jsonQuery": {
                  "type": "string",
                  "description": "Query parameters as a JSON string when `specifyQuery` is `json`."
                },
                "options": {
                  "type": "object",
                  "additionalProperties": true,
                  "description": "Additional HTTP request options.",
                  "properties": {
                    "timeout": {
                      "type": "integer",
                      "description": "Request timeout in milliseconds."
                    },
                    "allowUnauthorizedCerts": {
                      "type": "boolean",
                      "description": "Accept self-signed or otherwise invalid TLS certificates."
                    },
                    "queryParameterArrays": {
                      "type": "string",
                      "enum": [
                        "indices",
                        "brackets",
                        "repeat"
                      ],
                      "description": "How array-valued query parameters are serialized into the query string."
                    },
                    "redirect": {
                      "type": "object",
                      "additionalProperties": true,
                      "description": "Redirect-following behaviour.",
                      "properties": {
                        "redirect": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "followRedirects": {
                              "type": "boolean",
                              "description": "Whether to follow HTTP redirects."
                            },
                            "maxRedirects": {
                              "type": "integer",
                              "description": "Maximum number of redirects to follow."
                            }
                          }
                        }
                      }
                    },
                    "proxy": {
                      "type": "object",
                      "additionalProperties": true,
                      "description": "Outbound proxy configuration.",
                      "properties": {
                        "proxy": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "protocol": {
                              "type": "string",
                              "enum": [
                                "https",
                                "http"
                              ],
                              "description": "Proxy protocol."
                            },
                            "host": {
                              "type": "string",
                              "description": "Proxy host, without protocol or port."
                            },
                            "port": {
                              "type": "integer",
                              "description": "Proxy port."
                            }
                          }
                        }
                      }
                    },
                    "socket": {
                      "type": "object",
                      "additionalProperties": true,
                      "description": "Connection socket options.",
                      "properties": {
                        "keepAlive": {
                          "type": "boolean",
                          "description": "Whether to keep sockets open for reuse."
                        },
                        "maxSockets": {
                          "type": "integer",
                          "description": "Maximum sockets per host kept open at once."
                        },
                        "maxFreeSockets": {
                          "type": "integer",
                          "description": "Maximum idle sockets per host kept open."
                        }
                      }
                    }
                  }
                }
              }
            }
          ]
        },
        "destination.syslog": {
          "allOf": [
            {
              "$ref": "#/components/schemas/destination.common"
            },
            {
              "type": "object",
              "additionalProperties": true,
              "required": [
                "type",
                "host"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "syslog"
                  ],
                  "description": "Sends each event to a syslog server.",
                  "example": "syslog"
                },
                "host": {
                  "type": "string",
                  "description": "Syslog server host.",
                  "example": "syslog.example.com"
                },
                "port": {
                  "type": "integer",
                  "description": "Syslog server port.",
                  "example": 514
                },
                "protocol": {
                  "type": "string",
                  "enum": [
                    "udp",
                    "tcp",
                    "tls"
                  ],
                  "description": "Transport protocol.",
                  "example": "udp"
                },
                "facility": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 23,
                  "description": "Syslog facility code (0–23, per RFC 5424). Common values: 0 Kernel, 1 User, 3 System, 13 Audit, 14 Alert, 16 Local0, 17 Local1, 18 Local2, 19 Local3, 20 Local4, 21 Local5, 22 Local6, 23 Local7.\n",
                  "example": 16
                },
                "app_name": {
                  "type": "string",
                  "description": "Application name reported in the syslog message.",
                  "example": "n8n"
                },
                "tlsCa": {
                  "type": "string",
                  "description": "PEM-encoded CA certificate used when `protocol` is `tls`."
                }
              }
            }
          ]
        },
        "destination.sentry": {
          "allOf": [
            {
              "$ref": "#/components/schemas/destination.common"
            },
            {
              "type": "object",
              "additionalProperties": true,
              "required": [
                "type",
                "dsn"
              ],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "sentry"
                  ],
                  "description": "Sends each event to a Sentry project.",
                  "example": "sentry"
                },
                "dsn": {
                  "type": "string",
                  "format": "uri",
                  "description": "Sentry DSN the events are sent to.",
                  "example": "https://examplePublicKey@o0.ingest.sentry.io/0"
                }
              }
            }
          ]
        },
        "destination": {
          "type": "object",
          "oneOf": [
            {
              "$ref": "#/components/schemas/destination.webhook"
            },
            {
              "$ref": "#/components/schemas/destination.syslog"
            },
            {
              "$ref": "#/components/schemas/destination.sentry"
            }
          ],
          "description": "A log streaming destination. The `type` field selects the variant and its type-specific fields: `webhook`, `syslog`, or `sentry`.\n"
        },
        "destination.list": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "data"
          ],
          "properties": {
            "data": {
              "type": "array",
              "description": "The configured log streaming destinations.",
              "items": {
                "$ref": "#/components/schemas/destination"
              }
            }
          }
        },
        "test-result": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "success"
          ],
          "properties": {
            "success": {
              "type": "boolean",
              "description": "Whether the test message was delivered to the destination successfully.",
              "example": true
            }
          }
        },
        "error": {
          "required": [
            "message"
          ],
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "message": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        },
        "role": {
          "readOnly": true,
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "readOnly": true,
              "example": 1
            },
            "name": {
              "type": "string",
              "example": "owner",
              "readOnly": true
            },
            "scope": {
              "type": "string",
              "readOnly": true,
              "example": "global"
            },
            "createdAt": {
              "type": "string",
              "description": "Time the role was created.",
              "format": "date-time",
              "readOnly": true
            },
            "updatedAt": {
              "type": "string",
              "description": "Last time the role was updated.",
              "format": "date-time",
              "readOnly": true
            }
          }
        },
        "credentialType": {
          "type": "object",
          "properties": {
            "displayName": {
              "type": "string",
              "readOnly": true,
              "example": "Email"
            },
            "name": {
              "type": "string",
              "readOnly": true,
              "example": "email"
            },
            "type": {
              "type": "string",
              "readOnly": true,
              "example": "string"
            },
            "default": {
              "type": "string",
              "readOnly": true,
              "example": "string"
            }
          }
        },
        "Error": {
          "$ref": "#/components/schemas/error"
        },
        "Role": {
          "$ref": "#/components/schemas/role"
        },
        "Execution": {
          "$ref": "#/components/schemas/execution"
        },
        "Node": {
          "$ref": "#/components/schemas/node"
        },
        "WorkflowNodeGroup": {
          "$ref": "#/components/schemas/workflowNodeGroup"
        },
        "Tag": {
          "$ref": "#/components/schemas/tag"
        },
        "Workflow": {
          "$ref": "#/components/schemas/workflow"
        },
        "WorkflowSettings": {
          "$ref": "#/components/schemas/workflowSettings"
        },
        "ExecutionList": {
          "$ref": "#/components/schemas/executionList"
        },
        "WorkflowList": {
          "$ref": "#/components/schemas/workflowList"
        },
        "Credential": {
          "$ref": "#/components/schemas/credential"
        },
        "CredentialType": {
          "$ref": "#/components/schemas/credentialType"
        },
        "Audit": {
          "$ref": "#/components/schemas/audit"
        },
        "Pull": {
          "$ref": "#/components/schemas/pull"
        },
        "PullResult": {
          "$ref": "#/components/schemas/pullResult"
        },
        "SourceControlledFile": {
          "$ref": "#/components/schemas/sourceControlledFile"
        },
        "UserList": {
          "$ref": "#/components/schemas/userList"
        },
        "User": {
          "$ref": "#/components/schemas/user"
        }
      },
      "responses": {
        "unauthorized": {
          "description": "Unauthorized"
        },
        "forbidden": {
          "description": "Forbidden"
        },
        "badRequest": {
          "description": "The request is invalid or provides malformed data."
        },
        "conflict": {
          "description": "Conflict"
        },
        "notFound": {
          "description": "The specified resource was not found."
        },
        "paymentRequired": {
          "description": "Payment required"
        },
        "NotFound": {
          "$ref": "#/components/responses/notFound"
        },
        "Unauthorized": {
          "$ref": "#/components/responses/unauthorized"
        },
        "BadRequest": {
          "$ref": "#/components/responses/badRequest"
        },
        "Conflict": {
          "$ref": "#/components/responses/conflict"
        },
        "Forbidden": {
          "$ref": "#/components/responses/forbidden"
        },
        "PaymentRequired": {
          "$ref": "#/components/responses/paymentRequired"
        }
      },
      "parameters": {
        "limit": {
          "name": "limit",
          "in": "query",
          "description": "The maximum number of items to return.",
          "required": false,
          "schema": {
            "type": "number",
            "example": 100,
            "default": 100,
            "maximum": 250
          }
        },
        "cursor": {
          "name": "cursor",
          "in": "query",
          "description": "Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first \"page\" of the collection. See pagination for more detail.",
          "required": false,
          "style": "form",
          "schema": {
            "type": "string"
          }
        },
        "credentialId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the credential.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "includeData": {
          "name": "includeData",
          "in": "query",
          "description": "Whether or not to include the execution's detailed data.",
          "required": false,
          "schema": {
            "type": "boolean"
          }
        },
        "redactExecutionData": {
          "name": "redactExecutionData",
          "in": "query",
          "description": "Controls execution data redaction. When `true`, execution output data is always redacted. When `false`, requests unredacted (revealed) data — requires the `execution:reveal` scope. When omitted, follows the workflow redaction policy.\n",
          "required": false,
          "schema": {
            "type": "boolean"
          }
        },
        "executionId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the execution.",
          "required": true,
          "schema": {
            "type": "number"
          }
        },
        "tagId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the tag.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "workflowId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the workflow.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "testRunWorkflowId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the workflow.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "testRunId": {
          "name": "runId",
          "in": "path",
          "description": "The ID of the test run.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "offset": {
          "name": "offset",
          "in": "query",
          "description": "The number of items to skip before starting to collect the result set.",
          "required": false,
          "schema": {
            "type": "number",
            "example": 0,
            "default": 0,
            "minimum": 0
          }
        },
        "includeRole": {
          "name": "includeRole",
          "in": "query",
          "description": "Whether to include the user's role or not.",
          "required": false,
          "schema": {
            "type": "boolean",
            "example": true,
            "default": false
          }
        },
        "userIdentifier": {
          "name": "id",
          "in": "path",
          "description": "The ID or email of the user.",
          "required": true,
          "schema": {
            "type": "string",
            "format": "identifier"
          }
        },
        "variableId": {
          "name": "id",
          "in": "path",
          "description": "The ID of the variable.",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        "dataTableId": {
          "name": "dataTableId",
          "in": "path",
          "description": "The ID of the data table",
          "required": true,
          "schema": {
            "type": "string",
            "format": "nanoid"
          }
        },
        "columnId": {
          "name": "columnId",
          "in": "path",
          "description": "The ID of the column",
          "required": true,
          "schema": {
            "type": "string",
            "format": "nanoid"
          }
        },
        "Cursor": {
          "$ref": "#/components/parameters/cursor"
        },
        "Limit": {
          "$ref": "#/components/parameters/limit"
        },
        "ExecutionId": {
          "$ref": "#/components/parameters/executionId"
        },
        "WorkflowId": {
          "$ref": "#/components/parameters/workflowId"
        },
        "TestRunWorkflowId": {
          "$ref": "#/components/parameters/testRunWorkflowId"
        },
        "TestRunId": {
          "$ref": "#/components/parameters/testRunId"
        },
        "TagId": {
          "$ref": "#/components/parameters/tagId"
        },
        "IncludeData": {
          "$ref": "#/components/parameters/includeData"
        },
        "RedactExecutionData": {
          "$ref": "#/components/parameters/redactExecutionData"
        },
        "UserIdentifier": {
          "$ref": "#/components/parameters/userIdentifier"
        },
        "IncludeRole": {
          "$ref": "#/components/parameters/includeRole"
        },
        "VariableId": {
          "$ref": "#/components/parameters/variableId"
        }
      },
      "securitySchemes": {
        "ApiKeyAuth": {
          "type": "apiKey",
          "in": "header",
          "name": "X-N8N-API-KEY"
        },
        "BearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "x-enable-proxy": false,
    "server": [
      {
        "url": "http://localhost:5678/api/v1}"
      }
    ]
  },
  "customOptions": {
    "plugins": [
      function scopeBadgePlugin() {
    const wrapOperationSummary = (originalComponent, system) => (props) => {
        const pathArr = props.specPath?.toJS ? props.specPath.toJS() : null;
        const op = pathArr ? (system.specSelectors?.specJson().getIn(pathArr) ?? null) : null;
        const rawScope = op?.get ? op.get('x-required-scope') : null;
        const scope = typeof rawScope === 'string' ? rawScope : null;
        const method = pathArr ? pathArr[2] : null;
        const pathStr = pathArr ? pathArr[1] : null;
        system.React.useEffect(() => {
            if (!scope || scope === 'none' || !method || !pathStr)
                return;
            const candidates = document.querySelectorAll('.opblock-summary-' + method);
            let target = null;
            for (const c of candidates) {
                const pathEl = c.querySelector('.opblock-summary-path');
                if (pathEl && pathEl.getAttribute('data-path') === pathStr) {
                    target =
                        c.querySelector('.opblock-summary-path-description-wrapper') ??
                            c.querySelector('.opblock-summary-description');
                    break;
                }
            }
            if (!target)
                return;
            const existing = target.querySelector(':scope > .x-scope-badge');
            if (existing)
                existing.remove();
            const badge = document.createElement('span');
            badge.className = 'x-scope-badge';
            badge.textContent = scope;
            target.appendChild(badge);
            return () => {
                badge.remove();
            };
        }, [scope, method, pathStr]);
        return system.React.createElement(originalComponent, props);
    };
    return { wrapComponents: { OperationSummary: wrapOperationSummary } };
}
    ]
  },
  "swaggerUrl": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
