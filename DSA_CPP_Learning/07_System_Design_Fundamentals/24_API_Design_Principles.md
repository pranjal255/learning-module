# API Design Principles - Building Bridges Between Systems

## 🌟 Real-World Story: The Restaurant Menu

Imagine you're at a restaurant. The **menu** is like an API - it tells you:
- **What's available** (endpoints/services)
- **How to order** (request format)
- **What you'll get** (response format)
- **How much it costs** (rate limits/pricing)

A good menu is clear, organized, and consistent. You don't need to know how the kitchen works - you just need to know how to order. That's exactly what a good API does for software systems!

## 🎯 Why API Design Matters

### Real Applications:
- **Social Media**: Twitter API, Facebook Graph API
- **Payment Systems**: Stripe API, PayPal API
- **Cloud Services**: AWS API, Google Cloud API
- **Maps & Location**: Google Maps API, Uber API

## 📊 Types of APIs

### 🌐 REST APIs
**Most common** - Uses HTTP methods and follows REST principles

### 🔄 GraphQL APIs
**Flexible** - Client specifies exactly what data it needs

### 🚀 gRPC APIs
**High performance** - Binary protocol for microservices

### 📡 WebSocket APIs
**Real-time** - Bidirectional communication

---

## 🏗️ REST API DESIGN PRINCIPLES

### 1. 📝 Resource-Based URLs
**Real-World Analogy**: Like organizing files in folders on your computer

```cpp
// ❌ Bad - Action-based URLs
GET /getUsers
POST /createUser
PUT /updateUser
DELETE /deleteUser

// ✅ Good - Resource-based URLs
GET    /users           // Get all users
POST   /users           // Create new user
GET    /users/123       // Get specific user
PUT    /users/123       // Update specific user
DELETE /users/123       // Delete specific user

// Nested resources
GET    /users/123/posts      // Get posts by user 123
POST   /users/123/posts      // Create post for user 123
GET    /users/123/posts/456  // Get specific post by user
```

**C++ Implementation Example:**
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <nlohmann/json.hpp>  // JSON library

using json = nlohmann::json;
using namespace std;

class User {
public:
    int id;
    string name;
    string email;
    
    User(int i, string n, string e) : id(i), name(n), email(e) {}
    
    json toJson() const {
        return json{
            {"id", id},
            {"name", name},
            {"email", email}
        };
    }
    
    static User fromJson(const json& j) {
        return User(j["id"], j["name"], j["email"]);
    }
};

class UserAPI {
private:
    map<int, User> users;
    int nextId = 1;
    
public:
    // GET /users
    json getAllUsers() {
        json result = json::array();
        for (const auto& pair : users) {
            result.push_back(pair.second.toJson());
        }
        return result;
    }
    
    // GET /users/{id}
    json getUser(int id) {
        auto it = users.find(id);
        if (it != users.end()) {
            return {
                {"status", "success"},
                {"data", it->second.toJson()}
            };
        }
        return {
            {"status", "error"},
            {"message", "User not found"},
            {"code", 404}
        };
    }
    
    // POST /users
    json createUser(const json& userData) {
        try {
            User newUser(nextId++, userData["name"], userData["email"]);
            users[newUser.id] = newUser;
            
            return {
                {"status", "success"},
                {"message", "User created successfully"},
                {"data", newUser.toJson()},
                {"code", 201}
            };
        } catch (const exception& e) {
            return {
                {"status", "error"},
                {"message", "Invalid user data"},
                {"code", 400}
            };
        }
    }
    
    // PUT /users/{id}
    json updateUser(int id, const json& userData) {
        auto it = users.find(id);
        if (it == users.end()) {
            return {
                {"status", "error"},
                {"message", "User not found"},
                {"code", 404}
            };
        }
        
        try {
            it->second.name = userData["name"];
            it->second.email = userData["email"];
            
            return {
                {"status", "success"},
                {"message", "User updated successfully"},
                {"data", it->second.toJson()}
            };
        } catch (const exception& e) {
            return {
                {"status", "error"},
                {"message", "Invalid user data"},
                {"code", 400}
            };
        }
    }
    
    // DELETE /users/{id}
    json deleteUser(int id) {
        auto it = users.find(id);
        if (it == users.end()) {
            return {
                {"status", "error"},
                {"message", "User not found"},
                {"code", 404}
            };
        }
        
        users.erase(it);
        return {
            {"status", "success"},
            {"message", "User deleted successfully"},
            {"code", 200}
        };
    }
};
```

### 2. 🎯 HTTP Methods (Verbs)
**Real-World Analogy**: Different actions you can perform - like read, write, update, delete

```cpp
class HTTPMethods {
public:
    // GET - Retrieve data (Safe & Idempotent)
    static string GET_example() {
        return R"(
        GET /api/users/123
        
        Response:
        {
            "id": 123,
            "name": "John Doe",
            "email": "john@example.com"
        }
        )";
    }
    
    // POST - Create new resource (Not idempotent)
    static string POST_example() {
        return R"(
        POST /api/users
        Content-Type: application/json
        
        {
            "name": "Jane Smith",
            "email": "jane@example.com"
        }
        
        Response:
        {
            "id": 124,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "created_at": "2024-01-15T10:30:00Z"
        }
        )";
    }
    
    // PUT - Update entire resource (Idempotent)
    static string PUT_example() {
        return R"(
        PUT /api/users/123
        Content-Type: application/json
        
        {
            "name": "John Updated",
            "email": "john.updated@example.com"
        }
        )";
    }
    
    // PATCH - Partial update (Not necessarily idempotent)
    static string PATCH_example() {
        return R"(
        PATCH /api/users/123
        Content-Type: application/json
        
        {
            "email": "newemail@example.com"
        }
        )";
    }
    
    // DELETE - Remove resource (Idempotent)
    static string DELETE_example() {
        return R"(
        DELETE /api/users/123
        
        Response:
        {
            "message": "User deleted successfully"
        }
        )";
    }
};
```

### 3. 📊 HTTP Status Codes
**Real-World Analogy**: Like traffic lights - they tell you what's happening

```cpp
class StatusCodes {
public:
    // 2xx Success
    static const int OK = 200;                    // Request successful
    static const int CREATED = 201;               // Resource created
    static const int ACCEPTED = 202;              // Request accepted for processing
    static const int NO_CONTENT = 204;            // Successful, no content to return
    
    // 3xx Redirection
    static const int MOVED_PERMANENTLY = 301;     // Resource moved permanently
    static const int FOUND = 302;                 // Resource found elsewhere
    static const int NOT_MODIFIED = 304;          // Resource not modified
    
    // 4xx Client Errors
    static const int BAD_REQUEST = 400;           // Invalid request
    static const int UNAUTHORIZED = 401;          // Authentication required
    static const int FORBIDDEN = 403;             // Access denied
    static const int NOT_FOUND = 404;             // Resource not found
    static const int METHOD_NOT_ALLOWED = 405;    // HTTP method not allowed
    static const int CONFLICT = 409;              // Resource conflict
    static const int UNPROCESSABLE_ENTITY = 422;  // Validation errors
    static const int TOO_MANY_REQUESTS = 429;     // Rate limit exceeded
    
    // 5xx Server Errors
    static const int INTERNAL_SERVER_ERROR = 500; // Server error
    static const int NOT_IMPLEMENTED = 501;       // Feature not implemented
    static const int BAD_GATEWAY = 502;           // Invalid response from upstream
    static const int SERVICE_UNAVAILABLE = 503;   // Service temporarily unavailable
    static const int GATEWAY_TIMEOUT = 504;       // Upstream timeout
    
    static string getStatusMessage(int code) {
        switch (code) {
            case 200: return "OK";
            case 201: return "Created";
            case 400: return "Bad Request";
            case 401: return "Unauthorized";
            case 403: return "Forbidden";
            case 404: return "Not Found";
            case 500: return "Internal Server Error";
            default: return "Unknown Status";
        }
    }
};

class APIResponse {
private:
    int statusCode;
    json data;
    string message;
    
public:
    APIResponse(int code, const json& d = {}, const string& msg = "") 
        : statusCode(code), data(d), message(msg.empty() ? StatusCodes::getStatusMessage(code) : msg) {}
    
    json toJson() const {
        json response = {
            {"status_code", statusCode},
            {"message", message}
        };
        
        if (!data.empty()) {
            response["data"] = data;
        }
        
        return response;
    }
    
    bool isSuccess() const {
        return statusCode >= 200 && statusCode < 300;
    }
};
```

### 4. 🔍 Query Parameters and Filtering
**Real-World Analogy**: Like search filters on an e-commerce website

```cpp
class QueryParameters {
public:
    struct FilterParams {
        int page = 1;
        int limit = 10;
        string sortBy = "id";
        string sortOrder = "asc";  // asc or desc
        string search = "";
        map<string, string> filters;
        
        string toString() const {
            string result = "?page=" + to_string(page) + 
                           "&limit=" + to_string(limit) +
                           "&sort=" + sortBy + ":" + sortOrder;
            
            if (!search.empty()) {
                result += "&search=" + search;
            }
            
            for (const auto& filter : filters) {
                result += "&" + filter.first + "=" + filter.second;
            }
            
            return result;
        }
    };
    
    // Example: GET /users?page=2&limit=5&sort=name:asc&search=john&status=active
    static json getUsers(const FilterParams& params) {
        // Simulate filtering logic
        json users = json::array();
        
        // Add pagination info
        json pagination = {
            {"page", params.page},
            {"limit", params.limit},
            {"total_pages", 10},
            {"total_items", 95}
        };
        
        // Add sorting info
        json sorting = {
            {"sort_by", params.sortBy},
            {"sort_order", params.sortOrder}
        };
        
        return {
            {"data", users},
            {"pagination", pagination},
            {"sorting", sorting},
            {"filters_applied", params.filters}
        };
    }
};

// Usage examples
void demonstrateQueryParams() {
    QueryParameters::FilterParams params;
    params.page = 2;
    params.limit = 5;
    params.sortBy = "name";
    params.search = "john";
    params.filters["status"] = "active";
    params.filters["role"] = "admin";
    
    cout << "Query string: " << params.toString() << endl;
    // Output: ?page=2&limit=5&sort=name:asc&search=john&status=active&role=admin
}
```

### 5. 🔐 Authentication and Authorization
**Real-World Analogy**: Like showing your ID to enter a building and having different access levels

```cpp
#include <jwt-cpp/jwt.h>  // JWT library

class AuthenticationAPI {
private:
    string secretKey = "your-secret-key";
    map<string, string> users = {
        {"admin@example.com", "admin123"},
        {"user@example.com", "user123"}
    };
    
public:
    // POST /auth/login
    json login(const json& credentials) {
        string email = credentials["email"];
        string password = credentials["password"];
        
        auto it = users.find(email);
        if (it == users.end() || it->second != password) {
            return {
                {"status", "error"},
                {"message", "Invalid credentials"},
                {"code", 401}
            };
        }
        
        // Create JWT token
        auto token = jwt::create()
            .set_issuer("your-api")
            .set_type("JWT")
            .set_payload_claim("email", jwt::claim(email))
            .set_payload_claim("role", jwt::claim(email.find("admin") != string::npos ? "admin" : "user"))
            .set_expires_at(chrono::system_clock::now() + chrono::hours{24})
            .sign(jwt::algorithm::hs256{secretKey});
        
        return {
            {"status", "success"},
            {"message", "Login successful"},
            {"token", token},
            {"expires_in", 86400}  // 24 hours in seconds
        };
    }
    
    // Middleware to verify JWT token
    json verifyToken(const string& token) {
        try {
            auto decoded = jwt::decode(token);
            auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{secretKey})
                .with_issuer("your-api");
            
            verifier.verify(decoded);
            
            return {
                {"valid", true},
                {"email", decoded.get_payload_claim("email").as_string()},
                {"role", decoded.get_payload_claim("role").as_string()}
            };
        } catch (const exception& e) {
            return {
                {"valid", false},
                {"error", e.what()}
            };
        }
    }
    
    // Authorization middleware
    bool hasPermission(const string& userRole, const string& requiredRole) {
        if (requiredRole == "admin" && userRole != "admin") {
            return false;
        }
        return true;
    }
};

// API Key authentication example
class APIKeyAuth {
private:
    map<string, string> apiKeys = {
        {"key_123abc", "Company A"},
        {"key_456def", "Company B"}
    };
    
public:
    json validateAPIKey(const string& apiKey) {
        auto it = apiKeys.find(apiKey);
        if (it != apiKeys.end()) {
            return {
                {"valid", true},
                {"client", it->second}
            };
        }
        return {
            {"valid", false},
            {"error", "Invalid API key"}
        };
    }
};
```

### 6. 📄 Pagination
**Real-World Analogy**: Like pages in a book - you don't read the entire book at once

```cpp
class PaginationAPI {
public:
    struct PaginationInfo {
        int page;
        int limit;
        int totalItems;
        int totalPages;
        bool hasNext;
        bool hasPrevious;
        
        PaginationInfo(int p, int l, int total) 
            : page(p), limit(l), totalItems(total) {
            totalPages = (totalItems + limit - 1) / limit;  // Ceiling division
            hasNext = page < totalPages;
            hasPrevious = page > 1;
        }
        
        json toJson() const {
            return {
                {"page", page},
                {"limit", limit},
                {"total_items", totalItems},
                {"total_pages", totalPages},
                {"has_next", hasNext},
                {"has_previous", hasPrevious}
            };
        }
    };
    
    // Offset-based pagination (most common)
    json getItemsWithOffsetPagination(int page, int limit) {
        int totalItems = 1000;  // Simulate total count
        int offset = (page - 1) * limit;
        
        // Simulate fetching items
        json items = json::array();
        for (int i = offset; i < offset + limit && i < totalItems; i++) {
            items.push_back({
                {"id", i + 1},
                {"name", "Item " + to_string(i + 1)}
            });
        }
        
        PaginationInfo pagination(page, limit, totalItems);
        
        return {
            {"data", items},
            {"pagination", pagination.toJson()}
        };
    }
    
    // Cursor-based pagination (for real-time data)
    json getItemsWithCursorPagination(const string& cursor, int limit) {
        // Simulate cursor-based fetching
        json items = json::array();
        string nextCursor = "cursor_" + to_string(rand() % 1000);
        
        return {
            {"data", items},
            {"pagination", {
                {"limit", limit},
                {"next_cursor", nextCursor},
                {"has_more", true}
            }}
        };
    }
};
```

---

## 🔄 GRAPHQL API DESIGN

### GraphQL vs REST Comparison
```cpp
class GraphQLExample {
public:
    // REST approach - Multiple requests needed
    static string restApproach() {
        return R"(
        // Get user
        GET /users/123
        
        // Get user's posts
        GET /users/123/posts
        
        // Get comments for each post
        GET /posts/456/comments
        GET /posts/789/comments
        )";
    }
    
    // GraphQL approach - Single request
    static string graphqlApproach() {
        return R"(
        query {
            user(id: 123) {
                name
                email
                posts {
                    title
                    content
                    comments {
                        text
                        author {
                            name
                        }
                    }
                }
            }
        }
        )";
    }
};
```

---

## 🚀 API VERSIONING STRATEGIES

```cpp
class APIVersioning {
public:
    // 1. URL Path Versioning
    static string urlPathVersioning() {
        return R"(
        GET /api/v1/users
        GET /api/v2/users
        )";
    }
    
    // 2. Query Parameter Versioning
    static string queryParameterVersioning() {
        return R"(
        GET /api/users?version=1
        GET /api/users?version=2
        )";
    }
    
    // 3. Header Versioning
    static string headerVersioning() {
        return R"(
        GET /api/users
        Headers:
        API-Version: 1
        
        GET /api/users
        Headers:
        API-Version: 2
        )";
    }
    
    // 4. Content Negotiation
    static string contentNegotiation() {
        return R"(
        GET /api/users
        Headers:
        Accept: application/vnd.api.v1+json
        
        GET /api/users
        Headers:
        Accept: application/vnd.api.v2+json
        )";
    }
};

class VersionedUserAPI {
private:
    string version;
    
public:
    VersionedUserAPI(const string& v) : version(v) {}
    
    json getUser(int id) {
        if (version == "v1") {
            return {
                {"id", id},
                {"name", "John Doe"},
                {"email", "john@example.com"}
            };
        } else if (version == "v2") {
            return {
                {"id", id},
                {"full_name", "John Doe"},
                {"email_address", "john@example.com"},
                {"profile", {
                    {"avatar_url", "https://example.com/avatar.jpg"},
                    {"bio", "Software developer"}
                }}
            };
        }
        
        return {{"error", "Unsupported API version"}};
    }
};
```

---

## 🛡️ API SECURITY BEST PRACTICES

```cpp
class APISecurityPractices {
public:
    // 1. Rate Limiting
    class RateLimiter {
    private:
        map<string, vector<time_t>> requestTimes;
        int maxRequests = 100;
        int timeWindow = 3600;  // 1 hour
        
    public:
        bool isAllowed(const string& clientId) {
            time_t now = time(nullptr);
            auto& times = requestTimes[clientId];
            
            // Remove old requests outside time window
            times.erase(
                remove_if(times.begin(), times.end(),
                    [now, this](time_t t) { return now - t > timeWindow; }),
                times.end()
            );
            
            if (times.size() >= maxRequests) {
                return false;  // Rate limit exceeded
            }
            
            times.push_back(now);
            return true;
        }
        
        json getRateLimitInfo(const string& clientId) {
            auto& times = requestTimes[clientId];
            return {
                {"requests_made", times.size()},
                {"requests_remaining", maxRequests - times.size()},
                {"reset_time", time(nullptr) + timeWindow}
            };
        }
    };
    
    // 2. Input Validation
    class InputValidator {
    public:
        static bool isValidEmail(const string& email) {
            return email.find('@') != string::npos && 
                   email.find('.') != string::npos;
        }
        
        static bool isValidPassword(const string& password) {
            return password.length() >= 8;
        }
        
        static json validateUserInput(const json& input) {
            json errors = json::array();
            
            if (!input.contains("email") || !isValidEmail(input["email"])) {
                errors.push_back("Invalid email format");
            }
            
            if (!input.contains("password") || !isValidPassword(input["password"])) {
                errors.push_back("Password must be at least 8 characters");
            }
            
            return {
                {"valid", errors.empty()},
                {"errors", errors}
            };
        }
    };
    
    // 3. CORS (Cross-Origin Resource Sharing)
    static map<string, string> getCORSHeaders() {
        return {
            {"Access-Control-Allow-Origin", "*"},
            {"Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"},
            {"Access-Control-Allow-Headers", "Content-Type, Authorization"},
            {"Access-Control-Max-Age", "86400"}
        };
    }
};
```

---

## 📚 API DOCUMENTATION

```cpp
class APIDocumentation {
public:
    // OpenAPI/Swagger specification example
    static json getOpenAPISpec() {
        return {
            {"openapi", "3.0.0"},
            {"info", {
                {"title", "User Management API"},
                {"version", "1.0.0"},
                {"description", "API for managing users"}
            }},
            {"servers", json::array({
                {{"url", "https://api.example.com/v1"}}
            })},
            {"paths", {
                {"/users", {
                    {"get", {
                        {"summary", "Get all users"},
                        {"parameters", json::array({
                            {
                                {"name", "page"},
                                {"in", "query"},
                                {"schema", {{"type", "integer"}}},
                                {"description", "Page number"}
                            }
                        })},
                        {"responses", {
                            {"200", {
                                {"description", "Successful response"},
                                {"content", {
                                    {"application/json", {
                                        {"schema", {
                                            {"type", "object"},
                                            {"properties", {
                                                {"data", {
                                                    {"type", "array"},
                                                    {"items", {{"$ref", "#/components/schemas/User"}}}
                                                }}
                                            }}
                                        }}
                                    }}
                                }}
                            }}
                        }}
                    }}
                }}
            }},
            {"components", {
                {"schemas", {
                    {"User", {
                        {"type", "object"},
                        {"properties", {
                            {"id", {{"type", "integer"}}},
                            {"name", {{"type", "string"}}},
                            {"email", {{"type", "string"}}}
                        }}
                    }}
                }}
            }}
        };
    }
};
```

---

## 🎮 Practice Problems

### Problem 1: E-commerce API
Design a RESTful API for an e-commerce platform:
- Products (CRUD operations)
- Categories (hierarchical)
- Shopping cart management
- Order processing
- User authentication

### Problem 2: Social Media API
Create an API for a social media platform:
- User profiles and relationships
- Posts and comments
- Like/unlike functionality
- News feed generation
- Real-time notifications

### Problem 3: Banking API
Design a secure banking API:
- Account management
- Transaction history
- Money transfers
- Bill payments
- Strong authentication and authorization

---

## 🚀 Real Applications

### 1. **Microservices Communication**
```cpp
// APIs enable microservices to communicate
class MicroserviceAPI {
    // User Service API
    // Order Service API
    // Payment Service API
    // Notification Service API
};
```

### 2. **Mobile App Backend**
```cpp
// Mobile apps consume APIs for data
class MobileBackendAPI {
    // Authentication endpoints
    // Data synchronization
    // Push notifications
    // File uploads
};
```

### 3. **Third-party Integrations**
```cpp
// APIs enable integration with external services
class ThirdPartyIntegration {
    // Payment gateways (Stripe, PayPal)
    // Social media (Facebook, Twitter)
    // Maps and location (Google Maps)
    // Email services (SendGrid, Mailgun)
};
```

---

## ⚡ Key Takeaways

1. **Consistency is key** - Follow consistent naming and structure
2. **Think like a user** - Design APIs that are intuitive to use
3. **Security first** - Always implement proper authentication and validation
4. **Document everything** - Good documentation is as important as good code
5. **Version carefully** - Plan for API evolution from the beginning
6. **Monitor and optimize** - Track API usage and performance

## 🎯 Next Steps

- Practice designing APIs for real-world scenarios
- Study popular APIs (Twitter, GitHub, Stripe) for inspiration
- Learn API testing tools (Postman, Insomnia)
- Explore API gateway patterns and tools
- Understand API monitoring and analytics

---
*"A well-designed API is like a good conversation - clear, purposeful, and easy to follow!"* 💬
