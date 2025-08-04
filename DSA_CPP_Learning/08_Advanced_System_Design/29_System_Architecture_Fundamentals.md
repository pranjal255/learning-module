# System Architecture Fundamentals - Building Scalable Systems

## 🌟 Real-World Story: The Growing Restaurant Empire

Imagine you start with a small family restaurant that serves 50 customers a day. As your business grows, you face different challenges:

- **Single Restaurant** (Monolith): Everything happens in one kitchen - simple but limited
- **Multiple Locations** (Microservices): Each location specializes but needs coordination
- **Food Trucks** (Serverless): Deploy quickly anywhere, pay only when serving
- **Central Kitchen** (Service-Oriented): Shared preparation, distributed serving
- **Franchise Model** (Distributed Systems): Independent operations with shared standards

Just like restaurants scale from a single location to global chains, software systems evolve from simple applications to complex distributed architectures!

## 🎯 Why System Architecture Matters

### Real Applications:
- **Netflix**: Serves 200M+ users globally with 99.99% uptime
- **Amazon**: Handles millions of transactions during peak shopping
- **Google**: Processes 8.5 billion searches daily
- **Uber**: Coordinates millions of rides in real-time across cities

## 📊 Architecture Evolution Patterns

### 🏗️ Monolithic Architecture
### 🧩 Microservices Architecture
### ⚡ Serverless Architecture
### 🔄 Service-Oriented Architecture (SOA)
### 🌐 Event-Driven Architecture

---

## 🏗️ MONOLITHIC ARCHITECTURE

### What is a Monolith?
**Real-World Analogy**: Like a traditional department store where everything (clothing, electronics, food court) is under one roof with shared infrastructure.

```cpp
// Example: E-commerce Monolith
class ECommerceApplication {
private:
    UserService userService;
    ProductService productService;
    OrderService orderService;
    PaymentService paymentService;
    InventoryService inventoryService;
    NotificationService notificationService;
    
public:
    // All services are tightly coupled within single application
    bool processOrder(int userId, int productId, int quantity) {
        // User validation
        if (!userService.validateUser(userId)) {
            return false;
        }
        
        // Product availability check
        if (!productService.isAvailable(productId, quantity)) {
            return false;
        }
        
        // Inventory management
        if (!inventoryService.reserveItems(productId, quantity)) {
            return false;
        }
        
        // Order creation
        Order order = orderService.createOrder(userId, productId, quantity);
        
        // Payment processing
        if (!paymentService.processPayment(order.getTotalAmount())) {
            inventoryService.releaseItems(productId, quantity);
            return false;
        }
        
        // Update inventory
        inventoryService.updateStock(productId, quantity);
        
        // Send notifications
        notificationService.sendOrderConfirmation(userId, order);
        
        return true;
    }
    
    // All business logic in one place
    vector<Product> searchProducts(const string& query) {
        return productService.search(query);
    }
    
    User getUserProfile(int userId) {
        return userService.getUser(userId);
    }
};

// Single database for all data
class MonolithDatabase {
private:
    // All tables in one database
    map<int, User> users;
    map<int, Product> products;
    map<int, Order> orders;
    map<int, Payment> payments;
    
public:
    // Shared database operations
    bool saveUser(const User& user) { /* implementation */ }
    bool saveProduct(const Product& product) { /* implementation */ }
    bool saveOrder(const Order& order) { /* implementation */ }
    
    // ACID transactions across all data
    bool executeTransaction(function<bool()> operation) {
        // Begin transaction
        try {
            bool result = operation();
            if (result) {
                // Commit all changes
                return true;
            } else {
                // Rollback all changes
                return false;
            }
        } catch (const exception& e) {
            // Rollback on error
            return false;
        }
    }
};
```

### ✅ Monolith Advantages:
```cpp
class MonolithAdvantages {
public:
    // 1. Simple Development and Testing
    void simpleDevelopment() {
        // Single codebase, single IDE, single build process
        // Easy to debug - all code in one place
        // Simple testing - no network calls between services
    }
    
    // 2. Easy Deployment
    void easyDeployment() {
        // Single deployable unit (WAR, JAR, executable)
        // No service discovery or network configuration
        // Atomic deployments - all or nothing
    }
    
    // 3. Performance Benefits
    void performanceBenefits() {
        // In-process method calls (no network overhead)
        // Shared memory and resources
        // Single database connection pool
    }
    
    // 4. ACID Transactions
    void acidTransactions() {
        // Database transactions across all operations
        // Strong consistency guarantees
        // Simple transaction management
    }
};
```

### ❌ Monolith Disadvantages:
```cpp
class MonolithDisadvantages {
public:
    // 1. Scaling Challenges
    void scalingIssues() {
        // Must scale entire application (even unused parts)
        // Single point of failure
        // Resource contention between components
    }
    
    // 2. Technology Lock-in
    void technologyConstraints() {
        // Entire application uses same tech stack
        // Difficult to adopt new technologies
        // All teams must use same programming language
    }
    
    // 3. Team Coordination
    void teamChallenges() {
        // Multiple teams working on same codebase
        // Merge conflicts and coordination overhead
        // Difficult to have independent release cycles
    }
    
    // 4. Maintenance Complexity
    void maintenanceIssues() {
        // Large codebase becomes hard to understand
        // Changes in one area can affect others
        // Long build and test times
    }
};
```

---

## 🧩 MICROSERVICES ARCHITECTURE

### What are Microservices?
**Real-World Analogy**: Like a food court where each vendor specializes in one type of cuisine, has its own kitchen, but shares common seating and payment systems.

```cpp
// Example: E-commerce Microservices
#include <httplib.h>  // HTTP client library
#include <nlohmann/json.hpp>

using json = nlohmann::json;

// Base Service Interface
class MicroService {
protected:
    string serviceName;
    int port;
    httplib::Server server;
    
public:
    MicroService(const string& name, int p) : serviceName(name), port(p) {}
    
    virtual void setupRoutes() = 0;
    virtual void start() {
        setupRoutes();
        cout << serviceName << " starting on port " << port << endl;
        server.listen("localhost", port);
    }
    
    // Health check endpoint
    void setupHealthCheck() {
        server.Get("/health", [this](const httplib::Request&, httplib::Response& res) {
            json response = {
                {"service", serviceName},
                {"status", "healthy"},
                {"timestamp", time(nullptr)}
            };
            res.set_content(response.dump(), "application/json");
        });
    }
};

// User Service - Handles user management
class UserService : public MicroService {
private:
    map<int, User> users;
    
public:
    UserService() : MicroService("UserService", 8001) {}
    
    void setupRoutes() override {
        setupHealthCheck();
        
        // Get user by ID
        server.Get(R"(/users/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
            int userId = stoi(req.matches[1]);
            auto it = users.find(userId);
            
            if (it != users.end()) {
                json userJson = {
                    {"id", it->second.getId()},
                    {"name", it->second.getName()},
                    {"email", it->second.getEmail()}
                };
                res.set_content(userJson.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content("{\"error\": \"User not found\"}", "application/json");
            }
        });
        
        // Create new user
        server.Post("/users", [this](const httplib::Request& req, httplib::Response& res) {
            try {
                json userData = json::parse(req.body);
                User newUser(userData["name"], userData["email"]);
                users[newUser.getId()] = newUser;
                
                json response = {
                    {"id", newUser.getId()},
                    {"message", "User created successfully"}
                };
                res.status = 201;
                res.set_content(response.dump(), "application/json");
            } catch (const exception& e) {
                res.status = 400;
                res.set_content("{\"error\": \"Invalid user data\"}", "application/json");
            }
        });
    }
};

// Product Service - Handles product catalog
class ProductService : public MicroService {
private:
    map<int, Product> products;
    
public:
    ProductService() : MicroService("ProductService", 8002) {}
    
    void setupRoutes() override {
        setupHealthCheck();
        
        // Search products
        server.Get("/products/search", [this](const httplib::Request& req, httplib::Response& res) {
            string query = req.get_param_value("q");
            vector<Product> results;
            
            for (const auto& [id, product] : products) {
                if (product.getName().find(query) != string::npos) {
                    results.push_back(product);
                }
            }
            
            json response = json::array();
            for (const auto& product : results) {
                response.push_back({
                    {"id", product.getId()},
                    {"name", product.getName()},
                    {"price", product.getPrice()},
                    {"stock", product.getStock()}
                });
            }
            
            res.set_content(response.dump(), "application/json");
        });
        
        // Get product by ID
        server.Get(R"(/products/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
            int productId = stoi(req.matches[1]);
            auto it = products.find(productId);
            
            if (it != products.end()) {
                json productJson = {
                    {"id", it->second.getId()},
                    {"name", it->second.getName()},
                    {"price", it->second.getPrice()},
                    {"stock", it->second.getStock()}
                };
                res.set_content(productJson.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content("{\"error\": \"Product not found\"}", "application/json");
            }
        });
    }
};

// Order Service - Handles order processing
class OrderService : public MicroService {
private:
    map<int, Order> orders;
    httplib::Client userServiceClient{"http://localhost:8001"};
    httplib::Client productServiceClient{"http://localhost:8002"};
    httplib::Client paymentServiceClient{"http://localhost:8003"};
    
public:
    OrderService() : MicroService("OrderService", 8004) {}
    
    void setupRoutes() override {
        setupHealthCheck();
        
        // Create order
        server.Post("/orders", [this](const httplib::Request& req, httplib::Response& res) {
            try {
                json orderData = json::parse(req.body);
                int userId = orderData["userId"];
                int productId = orderData["productId"];
                int quantity = orderData["quantity"];
                
                // Validate user exists
                auto userResponse = userServiceClient.Get("/users/" + to_string(userId));
                if (!userResponse || userResponse->status != 200) {
                    res.status = 400;
                    res.set_content("{\"error\": \"Invalid user\"}", "application/json");
                    return;
                }
                
                // Validate product exists and has stock
                auto productResponse = productServiceClient.Get("/products/" + to_string(productId));
                if (!productResponse || productResponse->status != 200) {
                    res.status = 400;
                    res.set_content("{\"error\": \"Invalid product\"}", "application/json");
                    return;
                }
                
                json productData = json::parse(productResponse->body);
                if (productData["stock"] < quantity) {
                    res.status = 400;
                    res.set_content("{\"error\": \"Insufficient stock\"}", "application/json");
                    return;
                }
                
                // Calculate total amount
                double totalAmount = productData["price"].get<double>() * quantity;
                
                // Process payment
                json paymentRequest = {
                    {"userId", userId},
                    {"amount", totalAmount}
                };
                
                auto paymentResponse = paymentServiceClient.Post("/payments", 
                    paymentRequest.dump(), "application/json");
                
                if (!paymentResponse || paymentResponse->status != 200) {
                    res.status = 400;
                    res.set_content("{\"error\": \"Payment failed\"}", "application/json");
                    return;
                }
                
                // Create order
                Order newOrder(userId, productId, quantity, totalAmount);
                orders[newOrder.getId()] = newOrder;
                
                json response = {
                    {"orderId", newOrder.getId()},
                    {"status", "confirmed"},
                    {"totalAmount", totalAmount}
                };
                
                res.status = 201;
                res.set_content(response.dump(), "application/json");
                
            } catch (const exception& e) {
                res.status = 500;
                res.set_content("{\"error\": \"Internal server error\"}", "application/json");
            }
        });
    }
};

// Service Discovery and Load Balancer
class ServiceRegistry {
private:
    map<string, vector<string>> services;  // service name -> list of instances
    
public:
    void registerService(const string& serviceName, const string& endpoint) {
        services[serviceName].push_back(endpoint);
        cout << "Registered " << serviceName << " at " << endpoint << endl;
    }
    
    string getServiceEndpoint(const string& serviceName) {
        auto it = services.find(serviceName);
        if (it != services.end() && !it->second.empty()) {
            // Simple round-robin load balancing
            static map<string, int> roundRobinIndex;
            int& index = roundRobinIndex[serviceName];
            string endpoint = it->second[index % it->second.size()];
            index++;
            return endpoint;
        }
        return "";
    }
    
    vector<string> getHealthyServices(const string& serviceName) {
        vector<string> healthyServices;
        auto it = services.find(serviceName);
        
        if (it != services.end()) {
            for (const string& endpoint : it->second) {
                // Health check each service
                httplib::Client client(endpoint.c_str());
                auto response = client.Get("/health");
                
                if (response && response->status == 200) {
                    healthyServices.push_back(endpoint);
                }
            }
        }
        
        return healthyServices;
    }
};

// API Gateway - Single entry point for all client requests
class APIGateway {
private:
    httplib::Server server;
    ServiceRegistry& serviceRegistry;
    
public:
    APIGateway(ServiceRegistry& registry) : serviceRegistry(registry) {}
    
    void start() {
        // Route user requests
        server.Get(R"(/api/users/(.*))", [this](const httplib::Request& req, httplib::Response& res) {
            string userServiceEndpoint = serviceRegistry.getServiceEndpoint("UserService");
            if (!userServiceEndpoint.empty()) {
                httplib::Client client(userServiceEndpoint.c_str());
                auto response = client.Get(("/users/" + req.matches[1].str()).c_str());
                
                if (response) {
                    res.status = response->status;
                    res.set_content(response->body, "application/json");
                } else {
                    res.status = 503;
                    res.set_content("{\"error\": \"Service unavailable\"}", "application/json");
                }
            } else {
                res.status = 503;
                res.set_content("{\"error\": \"User service not available\"}", "application/json");
            }
        });
        
        // Route product requests
        server.Get(R"(/api/products/(.*))", [this](const httplib::Request& req, httplib::Response& res) {
            string productServiceEndpoint = serviceRegistry.getServiceEndpoint("ProductService");
            if (!productServiceEndpoint.empty()) {
                httplib::Client client(productServiceEndpoint.c_str());
                string path = "/products/" + req.matches[1].str();
                if (req.has_param("q")) {
                    path = "/products/search?q=" + req.get_param_value("q");
                }
                
                auto response = client.Get(path.c_str());
                
                if (response) {
                    res.status = response->status;
                    res.set_content(response->body, "application/json");
                } else {
                    res.status = 503;
                    res.set_content("{\"error\": \"Service unavailable\"}", "application/json");
                }
            }
        });
        
        cout << "API Gateway starting on port 8000" << endl;
        server.listen("localhost", 8000);
    }
};
```

### ✅ Microservices Advantages:
```cpp
class MicroservicesAdvantages {
public:
    // 1. Independent Scaling
    void independentScaling() {
        // Scale only the services that need it
        // Different services can use different resources
        // Cost-effective scaling based on demand
    }
    
    // 2. Technology Diversity
    void technologyFreedom() {
        // Each service can use different tech stack
        // Choose best tool for each job
        // Easy to adopt new technologies
    }
    
    // 3. Team Independence
    void teamAutonomy() {
        // Teams can work independently
        // Independent deployment cycles
        // Clear service boundaries and ownership
    }
    
    // 4. Fault Isolation
    void faultTolerance() {
        // Failure in one service doesn't bring down others
        // Circuit breakers and bulkheads
        // Graceful degradation
    }
};
```

### ❌ Microservices Disadvantages:
```cpp
class MicroservicesDisadvantages {
public:
    // 1. Distributed System Complexity
    void distributedComplexity() {
        // Network latency and failures
        // Service discovery and load balancing
        // Distributed transactions and eventual consistency
    }
    
    // 2. Operational Overhead
    void operationalChallenges() {
        // Multiple deployments to manage
        // Monitoring and logging across services
        // Service mesh and infrastructure complexity
    }
    
    // 3. Data Consistency
    void dataConsistencyIssues() {
        // No ACID transactions across services
        // Eventual consistency challenges
        // Distributed data management
    }
    
    // 4. Testing Complexity
    void testingChallenges() {
        // Integration testing across services
        // Contract testing and API versioning
        // End-to-end testing complexity
    }
};
```

---

## ⚡ SERVERLESS ARCHITECTURE

### What is Serverless?
**Real-World Analogy**: Like food trucks that appear only when there's demand, use shared infrastructure, and you pay only for what you consume.

```cpp
// Example: Serverless Functions (AWS Lambda style)
#include <aws/lambda-runtime/runtime.h>
#include <aws/core/utils/json/JsonSerializer.h>

using namespace aws::lambda_runtime;
using namespace Aws::Utils::Json;

// Image Processing Function
class ImageProcessorFunction {
public:
    static invocation_response processImage(invocation_request const& request) {
        JsonValue json(request.payload);
        if (!json.WasParseSuccessful()) {
            return invocation_response::failure("Failed to parse JSON", "InvalidJSON");
        }
        
        auto view = json.View();
        string bucketName = view.GetString("bucket");
        string objectKey = view.GetString("key");
        
        try {
            // Download image from S3
            auto imageData = downloadFromS3(bucketName, objectKey);
            
            // Process image (resize, compress, etc.)
            auto processedImage = processImageData(imageData);
            
            // Upload processed image
            string outputKey = "processed/" + objectKey;
            uploadToS3(bucketName, outputKey, processedImage);
            
            // Return success response
            JsonValue response;
            response.WithString("status", "success");
            response.WithString("outputKey", outputKey);
            response.WithInteger("originalSize", imageData.size());
            response.WithInteger("processedSize", processedImage.size());
            
            return invocation_response::success(response.View().WriteCompact(), "application/json");
            
        } catch (const exception& e) {
            return invocation_response::failure(e.what(), "ProcessingError");
        }
    }
    
private:
    static vector<uint8_t> downloadFromS3(const string& bucket, const string& key) {
        // AWS S3 download implementation
        // This would use AWS SDK to download the file
        return vector<uint8_t>(); // Placeholder
    }
    
    static vector<uint8_t> processImageData(const vector<uint8_t>& imageData) {
        // Image processing logic (resize, compress, etc.)
        // This would use image processing libraries
        return imageData; // Placeholder
    }
    
    static void uploadToS3(const string& bucket, const string& key, const vector<uint8_t>& data) {
        // AWS S3 upload implementation
        // This would use AWS SDK to upload the processed file
    }
};

// Order Processing Function
class OrderProcessorFunction {
public:
    static invocation_response processOrder(invocation_request const& request) {
        JsonValue json(request.payload);
        auto view = json.View();
        
        // Extract order data
        int userId = view.GetInteger("userId");
        int productId = view.GetInteger("productId");
        int quantity = view.GetInteger("quantity");
        
        try {
            // Validate order
            if (!validateOrder(userId, productId, quantity)) {
                return invocation_response::failure("Invalid order data", "ValidationError");
            }
            
            // Process payment
            double amount = calculateOrderAmount(productId, quantity);
            string paymentId = processPayment(userId, amount);
            
            // Update inventory
            updateInventory(productId, quantity);
            
            // Send notifications
            sendOrderConfirmation(userId, productId, quantity, paymentId);
            
            // Return success response
            JsonValue response;
            response.WithString("status", "success");
            response.WithString("paymentId", paymentId);
            response.WithDouble("amount", amount);
            
            return invocation_response::success(response.View().WriteCompact(), "application/json");
            
        } catch (const exception& e) {
            return invocation_response::failure(e.what(), "ProcessingError");
        }
    }
    
private:
    static bool validateOrder(int userId, int productId, int quantity) {
        // Validation logic
        return userId > 0 && productId > 0 && quantity > 0;
    }
    
    static double calculateOrderAmount(int productId, int quantity) {
        // Price calculation logic
        return 99.99 * quantity; // Placeholder
    }
    
    static string processPayment(int userId, double amount) {
        // Payment processing logic
        return "payment_" + to_string(time(nullptr));
    }
    
    static void updateInventory(int productId, int quantity) {
        // Inventory update logic
    }
    
    static void sendOrderConfirmation(int userId, int productId, int quantity, const string& paymentId) {
        // Notification logic
    }
};

// Event-driven architecture with serverless
class ServerlessEventProcessor {
public:
    // Process S3 upload events
    static invocation_response handleS3Upload(invocation_request const& request) {
        JsonValue json(request.payload);
        auto records = json.View().GetArray("Records");
        
        for (const auto& record : records) {
            string eventName = record.GetString("eventName");
            
            if (eventName.find("ObjectCreated") != string::npos) {
                auto s3Info = record.GetObject("s3");
                string bucketName = s3Info.GetObject("bucket").GetString("name");
                string objectKey = s3Info.GetObject("object").GetString("key");
                
                // Trigger image processing
                triggerImageProcessing(bucketName, objectKey);
            }
        }
        
        return invocation_response::success("Events processed", "text/plain");
    }
    
    // Process DynamoDB stream events
    static invocation_response handleDynamoDBStream(invocation_request const& request) {
        JsonValue json(request.payload);
        auto records = json.View().GetArray("Records");
        
        for (const auto& record : records) {
            string eventName = record.GetString("eventName");
            
            if (eventName == "INSERT") {
                // Handle new record insertion
                auto dynamodb = record.GetObject("dynamodb");
                auto newImage = dynamodb.GetObject("NewImage");
                
                // Process the new data
                processNewRecord(newImage);
            }
        }
        
        return invocation_response::success("Stream events processed", "text/plain");
    }
    
private:
    static void triggerImageProcessing(const string& bucket, const string& key) {
        // Trigger another Lambda function for image processing
    }
    
    static void processNewRecord(const JsonView& record) {
        // Process new database record
    }
};

// Serverless API with API Gateway integration
class ServerlessAPI {
public:
    static invocation_response handleAPIRequest(invocation_request const& request) {
        JsonValue json(request.payload);
        auto view = json.View();
        
        string httpMethod = view.GetString("httpMethod");
        string path = view.GetString("path");
        auto headers = view.GetObject("headers");
        string body = view.GetString("body");
        
        JsonValue response;
        
        try {
            if (httpMethod == "GET" && path == "/users") {
                response = handleGetUsers();
            } else if (httpMethod == "POST" && path == "/users") {
                response = handleCreateUser(body);
            } else if (httpMethod == "GET" && path.find("/users/") == 0) {
                string userId = path.substr(7); // Extract user ID
                response = handleGetUser(userId);
            } else {
                response.WithInteger("statusCode", 404);
                response.WithString("body", "{\"error\": \"Not found\"}");
            }
        } catch (const exception& e) {
            response.WithInteger("statusCode", 500);
            response.WithString("body", "{\"error\": \"Internal server error\"}");
        }
        
        // Add CORS headers
        JsonValue responseHeaders;
        responseHeaders.WithString("Access-Control-Allow-Origin", "*");
        responseHeaders.WithString("Content-Type", "application/json");
        response.WithObject("headers", responseHeaders);
        
        return invocation_response::success(response.View().WriteCompact(), "application/json");
    }
    
private:
    static JsonValue handleGetUsers() {
        JsonValue response;
        response.WithInteger("statusCode", 200);
        
        JsonValue users = JsonValue().AsArray();
        // Fetch users from database
        
        response.WithString("body", users.View().WriteCompact());
        return response;
    }
    
    static JsonValue handleCreateUser(const string& body) {
        JsonValue response;
        
        try {
            JsonValue userData(body);
            // Validate and create user
            
            response.WithInteger("statusCode", 201);
            response.WithString("body", "{\"message\": \"User created\"}");
        } catch (const exception& e) {
            response.WithInteger("statusCode", 400);
            response.WithString("body", "{\"error\": \"Invalid user data\"}");
        }
        
        return response;
    }
    
    static JsonValue handleGetUser(const string& userId) {
        JsonValue response;
        
        // Fetch user from database
        // If found, return user data; otherwise, return 404
        
        response.WithInteger("statusCode", 200);
        response.WithString("body", "{\"id\": \"" + userId + "\", \"name\": \"John Doe\"}");
        return response;
    }
};
```

### ✅ Serverless Advantages:
```cpp
class ServerlessAdvantages {
public:
    // 1. No Server Management
    void noServerManagement() {
        // No infrastructure to provision or manage
        // Automatic scaling and load balancing
        // Built-in high availability
    }
    
    // 2. Pay-per-Use
    void costEfficiency() {
        // Pay only for actual execution time
        // No idle server costs
        // Automatic resource optimization
    }
    
    // 3. Rapid Development
    void fastDevelopment() {
        // Focus on business logic, not infrastructure
        // Quick deployment and iteration
        // Built-in integrations with cloud services
    }
    
    // 4. Automatic Scaling
    void autoScaling() {
        // Scales from zero to thousands of requests
        // No capacity planning needed
        // Handles traffic spikes automatically
    }
};
```

### ❌ Serverless Disadvantages:
```cpp
class ServerlessDisadvantages {
public:
    // 1. Cold Start Latency
    void coldStartIssues() {
        // Initial request latency when function starts
        // Unpredictable performance for infrequent functions
        // Language and runtime dependencies affect startup time
    }
    
    // 2. Vendor Lock-in
    void vendorLockIn() {
        // Tied to specific cloud provider APIs
        // Difficult to migrate between providers
        // Provider-specific features and limitations
    }
    
    // 3. Limited Execution Time
    void executionLimits() {
        // Maximum execution time limits (15 minutes for AWS Lambda)
        // Memory and CPU constraints
        // Not suitable for long-running processes
    }
    
    // 4. Debugging Complexity
    void debuggingChallenges() {
        // Limited local development environment
        // Distributed logging and monitoring
        // Difficult to replicate production environment
    }
};
```

---

## 🔄 SERVICE-ORIENTED ARCHITECTURE (SOA)

### What is SOA?
**Real-World Analogy**: Like a business district where different companies (services) provide specialized services through well-defined contracts, but share common infrastructure like roads, utilities, and communication systems.

```cpp
// Example: SOA with Enterprise Service Bus (ESB)
#include <queue>
#include <thread>
#include <condition_variable>

// Service Contract Interface
class ServiceContract {
public:
    virtual ~ServiceContract() = default;
    virtual string getServiceName() const = 0;
    virtual string getVersion() const = 0;
    virtual vector<string> getOperations() const = 0;
};

// Message format for service communication
struct ServiceMessage {
    string messageId;
    string sourceService;
    string targetService;
    string operation;
    string payload;
    map<string, string> headers;
    time_t timestamp;
    
    ServiceMessage(const string& src, const string& target, const string& op, const string& data)
        : sourceService(src), targetService(target), operation(op), payload(data) {
        messageId = generateMessageId();
        timestamp = time(nullptr);
    }
    
private:
    string generateMessageId() {
        return "msg_" + to_string(time(nullptr)) + "_" + to_string(rand());
    }
};

// Enterprise Service Bus (ESB)
class EnterpriseServiceBus {
private:
    map<string, shared_ptr<ServiceContract>> registeredServices;
    queue<ServiceMessage> messageQueue;
    mutex queueMutex;
    condition_variable queueCondition;
    bool running;
    thread processingThread;
    
public:
    EnterpriseServiceBus() : running(false) {}
    
    void start() {
        running = true;
        processingThread = thread(&EnterpriseServiceBus::processMessages, this);
        cout << "Enterprise Service Bus started" << endl;
    }
    
    void stop() {
        running = false;
        queueCondition.notify_all();
        if (processingThread.joinable()) {
            processingThread.join();
        }
        cout << "Enterprise Service Bus stopped" << endl;
    }
    
    void registerService(shared_ptr<ServiceContract> service) {
        registeredServices[service->getServiceName()] = service;
        cout << "Registered service: " << service->getServiceName() << endl;
    }
    
    void sendMessage(const ServiceMessage& message) {
        {
            lock_guard<mutex> lock(queueMutex);
            messageQueue.push(message);
        }
        queueCondition.notify_one();
    }
    
private:
    void processMessages() {
        while (running) {
            unique_lock<mutex> lock(queueMutex);
            queueCondition.wait(lock, [this] { return !messageQueue.empty() || !running; });
            
            if (!running) break;
            
            ServiceMessage message = messageQueue.front();
            messageQueue.pop();
            lock.unlock();
            
            // Route message to target service
            routeMessage(message);
        }
    }
    
    void routeMessage(const ServiceMessage& message) {
        auto it = registeredServices.find(message.targetService);
        if (it != registeredServices.end()) {
            // Transform message if needed
            ServiceMessage transformedMessage = transformMessage(message);
            
            // Deliver to target service
            deliverMessage(transformedMessage, it->second);
        } else {
            cout << "Service not found: " << message.targetService << endl;
        }
    }
    
    ServiceMessage transformMessage(const ServiceMessage& message) {
        // Apply transformation rules, data mapping, etc.
        return message; // Simplified - no transformation
    }
    
    void deliverMessage(const ServiceMessage& message, shared_ptr<ServiceContract> service) {
        cout << "Delivering message " << message.messageId 
             << " to service " << service->getServiceName() << endl;
        // Actual service invocation would happen here
    }
};

// Customer Service (SOA style)
class CustomerService : public ServiceContract {
private:
    map<int, Customer> customers;
    
public:
    string getServiceName() const override {
        return "CustomerService";
    }
    
    string getVersion() const override {
        return "1.0";
    }
    
    vector<string> getOperations() const override {
        return {"getCustomer", "createCustomer", "updateCustomer", "deleteCustomer"};
    }
    
    // Service operations
    Customer getCustomer(int customerId) {
        auto it = customers.find(customerId);
        if (it != customers.end()) {
            return it->second;
        }
        throw runtime_error("Customer not found");
    }
    
    int createCustomer(const Customer& customer) {
        int newId = customers.size() + 1;
        customers[newId] = customer;
        return newId;
    }
    
    bool updateCustomer(int customerId, const Customer& customer) {
        auto it = customers.find(customerId);
        if (it != customers.end()) {
            it->second = customer;
            return true;
        }
        return false;
    }
    
    bool deleteCustomer(int customerId) {
        return customers.erase(customerId) > 0;
    }
};

// Order Service (SOA style)
class OrderServiceSOA : public ServiceContract {
private:
    map<int, Order> orders;
    EnterpriseServiceBus& esb;
    
public:
    OrderServiceSOA(EnterpriseServiceBus& bus) : esb(bus) {}
    
    string getServiceName() const override {
        return "OrderService";
    }
    
    string getVersion() const override {
        return "1.0";
    }
    
    vector<string> getOperations() const override {
        return {"createOrder", "getOrder", "updateOrderStatus"};
    }
    
    int createOrder(int customerId, const vector<OrderItem>& items) {
        // Validate customer exists by calling Customer Service
        ServiceMessage customerRequest("OrderService", "CustomerService", 
                                     "getCustomer", to_string(customerId));
        esb.sendMessage(customerRequest);
        
        // Create order
        Order newOrder(customerId, items);
        int orderId = orders.size() + 1;
        orders[orderId] = newOrder;
        
        // Notify other services
        ServiceMessage inventoryUpdate("OrderService", "InventoryService", 
                                     "reserveItems", serializeOrderItems(items));
        esb.sendMessage(inventoryUpdate);
        
        ServiceMessage paymentRequest("OrderService", "PaymentService", 
                                    "processPayment", serializePaymentInfo(newOrder));
        esb.sendMessage(paymentRequest);
        
        return orderId;
    }
    
private:
    string serializeOrderItems(const vector<OrderItem>& items) {
        // Convert order items to string format
        return "serialized_items"; // Placeholder
    }
    
    string serializePaymentInfo(const Order& order) {
        // Convert payment info to string format
        return "payment_info"; // Placeholder
    }
};
```

---

## 🌐 EVENT-DRIVEN ARCHITECTURE

### What is Event-Driven Architecture?
**Real-World Analogy**: Like a news broadcasting system where events (news) are published to channels, and interested parties (subscribers) listen and react to relevant news.

```cpp
// Event-Driven Architecture Implementation
#include <functional>
#include <unordered_set>

// Base Event class
class Event {
protected:
    string eventId;
    string eventType;
    time_t timestamp;
    string source;
    
public:
    Event(const string& type, const string& src) 
        : eventType(type), source(src), timestamp(time(nullptr)) {
        eventId = generateEventId();
    }
    
    virtual ~Event() = default;
    
    string getEventId() const { return eventId; }
    string getEventType() const { return eventType; }
    time_t getTimestamp() const { return timestamp; }
    string getSource() const { return source; }
    
    virtual string serialize() const = 0;
    
private:
    string generateEventId() {
        return "evt_" + to_string(time(nullptr)) + "_" + to_string(rand());
    }
};

// Specific Event Types
class OrderCreatedEvent : public Event {
private:
    int orderId;
    int customerId;
    double totalAmount;
    
public:
    OrderCreatedEvent(int orderID, int customerID, double amount)
        : Event("OrderCreated", "OrderService"), orderId(orderID), 
          customerId(customerID), totalAmount(amount) {}
    
    string serialize() const override {
        return "{\"eventType\":\"" + eventType + "\",\"orderId\":" + to_string(orderId) +
               ",\"customerId\":" + to_string(customerId) + 
               ",\"totalAmount\":" + to_string(totalAmount) + "}";
    }
    
    int getOrderId() const { return orderId; }
    int getCustomerId() const { return customerId; }
    double getTotalAmount() const { return totalAmount; }
};

class PaymentProcessedEvent : public Event {
private:
    string paymentId;
    int orderId;
    double amount;
    bool successful;
    
public:
    PaymentProcessedEvent(const string& payID, int orderID, double amt, bool success)
        : Event("PaymentProcessed", "PaymentService"), paymentId(payID),
          orderId(orderID), amount(amt), successful(success) {}
    
    string serialize() const override {
        return "{\"eventType\":\"" + eventType + "\",\"paymentId\":\"" + paymentId +
               "\",\"orderId\":" + to_string(orderId) + 
               ",\"amount\":" + to_string(amount) + 
               ",\"successful\":" + (successful ? "true" : "false") + "}";
    }
    
    string getPaymentId() const { return paymentId; }
    int getOrderId() const { return orderId; }
    double getAmount() const { return amount; }
    bool isSuccessful() const { return successful; }
};

// Event Handler Interface
class EventHandler {
public:
    virtual ~EventHandler() = default;
    virtual void handleEvent(shared_ptr<Event> event) = 0;
    virtual vector<string> getSubscribedEventTypes() const = 0;
};

// Event Bus for publishing and subscribing to events
class EventBus {
private:
    map<string, vector<shared_ptr<EventHandler>>> subscribers;
    queue<shared_ptr<Event>> eventQueue;
    mutex queueMutex;
    condition_variable queueCondition;
    bool running;
    thread processingThread;
    
public:
    EventBus() : running(false) {}
    
    void start() {
        running = true;
        processingThread = thread(&EventBus::processEvents, this);
        cout << "Event Bus started" << endl;
    }
    
    void stop() {
        running = false;
        queueCondition.notify_all();
        if (processingThread.joinable()) {
            processingThread.join();
        }
        cout << "Event Bus stopped" << endl;
    }
    
    void subscribe(shared_ptr<EventHandler> handler) {
        auto eventTypes = handler->getSubscribedEventTypes();
        for (const string& eventType : eventTypes) {
            subscribers[eventType].push_back(handler);
            cout << "Subscribed handler to event type: " << eventType << endl;
        }
    }
    
    void publish(shared_ptr<Event> event) {
        {
            lock_guard<mutex> lock(queueMutex);
            eventQueue.push(event);
        }
        queueCondition.notify_one();
        cout << "Published event: " << event->getEventType() << endl;
    }
    
private:
    void processEvents() {
        while (running) {
            unique_lock<mutex> lock(queueMutex);
            queueCondition.wait(lock, [this] { return !eventQueue.empty() || !running; });
            
            if (!running) break;
            
            auto event = eventQueue.front();
            eventQueue.pop();
            lock.unlock();
            
            // Deliver event to all subscribers
            deliverEvent(event);
        }
    }
    
    void deliverEvent(shared_ptr<Event> event) {
        auto it = subscribers.find(event->getEventType());
        if (it != subscribers.end()) {
            for (auto& handler : it->second) {
                try {
                    handler->handleEvent(event);
                } catch (const exception& e) {
                    cout << "Error handling event: " << e.what() << endl;
                }
            }
        }
    }
};

// Event Handlers for different services
class InventoryEventHandler : public EventHandler {
private:
    map<int, int> inventory; // productId -> quantity
    
public:
    vector<string> getSubscribedEventTypes() const override {
        return {"OrderCreated"};
    }
    
    void handleEvent(shared_ptr<Event> event) override {
        if (event->getEventType() == "OrderCreated") {
            auto orderEvent = dynamic_pointer_cast<OrderCreatedEvent>(event);
            if (orderEvent) {
                cout << "Inventory: Processing order " << orderEvent->getOrderId() << endl;
                // Update inventory based on order
                updateInventoryForOrder(orderEvent->getOrderId());
            }
        }
    }
    
private:
    void updateInventoryForOrder(int orderId) {
        // Logic to update inventory
        cout << "Inventory updated for order " << orderId << endl;
    }
};

class NotificationEventHandler : public EventHandler {
public:
    vector<string> getSubscribedEventTypes() const override {
        return {"OrderCreated", "PaymentProcessed"};
    }
    
    void handleEvent(shared_ptr<Event> event) override {
        if (event->getEventType() == "OrderCreated") {
            auto orderEvent = dynamic_pointer_cast<OrderCreatedEvent>(event);
            if (orderEvent) {
                sendOrderConfirmation(orderEvent->getCustomerId(), orderEvent->getOrderId());
            }
        } else if (event->getEventType() == "PaymentProcessed") {
            auto paymentEvent = dynamic_pointer_cast<PaymentProcessedEvent>(event);
            if (paymentEvent) {
                sendPaymentNotification(paymentEvent->getOrderId(), paymentEvent->isSuccessful());
            }
        }
    }
    
private:
    void sendOrderConfirmation(int customerId, int orderId) {
        cout << "Notification: Order confirmation sent to customer " 
             << customerId << " for order " << orderId << endl;
    }
    
    void sendPaymentNotification(int orderId, bool successful) {
        cout << "Notification: Payment " << (successful ? "successful" : "failed") 
             << " for order " << orderId << endl;
    }
};

// Event-driven Order Service
class EventDrivenOrderService {
private:
    EventBus& eventBus;
    map<int, Order> orders;
    
public:
    EventDrivenOrderService(EventBus& bus) : eventBus(bus) {}
    
    int createOrder(int customerId, double totalAmount) {
        // Create order
        int orderId = orders.size() + 1;
        Order newOrder(customerId, totalAmount);
        orders[orderId] = newOrder;
        
        // Publish event
        auto event = make_shared<OrderCreatedEvent>(orderId, customerId, totalAmount);
        eventBus.publish(event);
        
        return orderId;
    }
};

// Event-driven Payment Service
class EventDrivenPaymentService : public EventHandler {
private:
    EventBus& eventBus;
    
public:
    EventDrivenPaymentService(EventBus& bus) : eventBus(bus) {}
    
    vector<string> getSubscribedEventTypes() const override {
        return {"OrderCreated"};
    }
    
    void handleEvent(shared_ptr<Event> event) override {
        if (event->getEventType() == "OrderCreated") {
            auto orderEvent = dynamic_pointer_cast<OrderCreatedEvent>(event);
            if (orderEvent) {
                processPayment(orderEvent->getOrderId(), orderEvent->getTotalAmount());
            }
        }
    }
    
private:
    void processPayment(int orderId, double amount) {
        // Simulate payment processing
        bool successful = (rand() % 10) > 2; // 80% success rate
        string paymentId = "pay_" + to_string(time(nullptr));
        
        cout << "Payment: Processing $" << amount << " for order " << orderId << endl;
        
        // Publish payment result event
        auto event = make_shared<PaymentProcessedEvent>(paymentId, orderId, amount, successful);
        eventBus.publish(event);
    }
};
```

---

## 🎯 Architecture Comparison

### When to Use Each Architecture:

```cpp
class ArchitectureDecisionMatrix {
public:
    // Monolithic Architecture
    void useMonolithWhen() {
        cout << "Use Monolith when:" << endl;
        cout << "- Small to medium applications" << endl;
        cout << "- Simple business logic" << endl;
        cout << "- Small development team" << endl;
        cout << "- Rapid prototyping" << endl;
        cout << "- Strong consistency requirements" << endl;
    }
    
    // Microservices Architecture
    void useMicroservicesWhen() {
        cout << "Use Microservices when:" << endl;
        cout << "- Large, complex applications" << endl;
        cout << "- Multiple development teams" << endl;
        cout << "- Different scaling requirements" << endl;
        cout << "- Technology diversity needed" << endl;
        cout << "- Independent deployment cycles" << endl;
    }
    
    // Serverless Architecture
    void useServerlessWhen() {
        cout << "Use Serverless when:" << endl;
        cout << "- Event-driven workloads" << endl;
        cout << "- Unpredictable traffic patterns" << endl;
        cout << "- Short-running tasks" << endl;
        cout << "- Minimal operational overhead desired" << endl;
        cout << "- Cost optimization important" << endl;
    }
    
    // Service-Oriented Architecture
    void useSOAWhen() {
        cout << "Use SOA when:" << endl;
        cout << "- Enterprise integration needed" << endl;
        cout << "- Legacy system integration" << endl;
        cout << "- Standardized service contracts" << endl;
        cout << "- Centralized governance required" << endl;
        cout << "- Reusable business services" << endl;
    }
    
    // Event-Driven Architecture
    void useEventDrivenWhen() {
        cout << "Use Event-Driven when:" << endl;
        cout << "- Loose coupling required" << endl;
        cout << "- Real-time processing needed" << endl;
        cout << "- Complex business workflows" << endl;
        cout << "- Scalable notification systems" << endl;
        cout << "- Audit trails important" << endl;
    }
};
```

---

## ⚡ Key Takeaways

1. **No silver bullet** - Each architecture has trade-offs
2. **Start simple** - Begin with monolith, evolve as needed
3. **Consider team size** - Architecture should match team structure
4. **Think about data** - Data consistency requirements drive architecture
5. **Plan for change** - Systems evolve, architecture should support it
6. **Measure everything** - Use metrics to validate architectural decisions

## 🎯 Next Steps

- Study distributed systems concepts (CAP theorem, consistency models)
- Learn about scalability patterns and performance optimization
- Explore cloud-native architectures and containerization
- Practice designing systems for different requirements
- Understand operational concerns (monitoring, logging, deployment)

---
*"Architecture is about the important stuff. Whatever that is."* - Ralph Johnson 🏗️
