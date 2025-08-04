# Scalability and Performance - Building Systems That Scale

## 🌟 Real-World Story: The Growing Concert Venue

Imagine you start with a small coffee shop that hosts acoustic performances for 20 people. As your venue becomes popular, you face scaling challenges:

- **Vertical Scaling** (Bigger Venue): Move to a larger space with better sound system
- **Horizontal Scaling** (Multiple Venues): Open several smaller venues across the city
- **Load Balancing** (Multiple Entrances): Add more doors and ticket counters to handle crowds
- **Caching** (VIP Section): Keep popular items readily available for quick service
- **CDN** (Food Trucks): Distribute snacks closer to where people are waiting

Just like venues scale from intimate coffee shops to massive stadiums, software systems must evolve to handle growing user demands while maintaining performance!

## 🎯 Why Scalability and Performance Matter

### Real Applications:
- **YouTube**: Serves 2 billion hours of video daily
- **WhatsApp**: Handles 100 billion messages per day
- **Amazon**: Processes 600+ orders per second during peak times
- **Google Search**: Responds to queries in under 200ms globally

## 📊 Scalability Dimensions

### 📈 Vertical Scaling (Scale Up)
### 📊 Horizontal Scaling (Scale Out)
### ⚖️ Load Balancing
### 🚀 Caching Strategies
### 🌐 Content Delivery Networks (CDN)

---

## 📈 VERTICAL SCALING (SCALE UP)

### What is Vertical Scaling?
**Real-World Analogy**: Like upgrading from a bicycle to a motorcycle to a sports car - same vehicle, more power.

```cpp
// Example: Database Connection Pool Scaling
#include <queue>
#include <mutex>
#include <condition_variable>
#include <chrono>

class DatabaseConnection {
private:
    string connectionId;
    bool inUse;
    time_t lastUsed;
    
public:
    DatabaseConnection(const string& id) : connectionId(id), inUse(false) {
        lastUsed = time(nullptr);
    }
    
    void execute(const string& query) {
        // Simulate database operation
        this_thread::sleep_for(chrono::milliseconds(10));
        lastUsed = time(nullptr);
        cout << "Executed query on connection " << connectionId << ": " << query << endl;
    }
    
    bool isInUse() const { return inUse; }
    void setInUse(bool use) { inUse = use; }
    string getId() const { return connectionId; }
    time_t getLastUsed() const { return lastUsed; }
};

// Vertically scalable connection pool
class ScalableConnectionPool {
private:
    queue<unique_ptr<DatabaseConnection>> availableConnections;
    vector<unique_ptr<DatabaseConnection>> allConnections;
    mutex poolMutex;
    condition_variable poolCondition;
    
    // Scaling parameters
    int minConnections;
    int maxConnections;
    int currentConnections;
    double utilizationThreshold;
    
    // Performance metrics
    atomic<int> activeConnections{0};
    atomic<int> totalRequests{0};
    atomic<int> waitingRequests{0};
    
public:
    ScalableConnectionPool(int minConn = 5, int maxConn = 50, double threshold = 0.8)
        : minConnections(minConn), maxConnections(maxConn), 
          currentConnections(0), utilizationThreshold(threshold) {
        
        // Initialize with minimum connections
        for (int i = 0; i < minConnections; i++) {
            addConnection();
        }
        
        cout << "Connection pool initialized with " << minConnections << " connections" << endl;
    }
    
    shared_ptr<DatabaseConnection> getConnection() {
        unique_lock<mutex> lock(poolMutex);
        totalRequests++;
        
        // Check if we need to scale up
        if (shouldScaleUp()) {
            scaleUp();
        }
        
        // Wait for available connection
        waitingRequests++;
        poolCondition.wait(lock, [this] { return !availableConnections.empty(); });
        waitingRequests--;
        
        auto connection = move(availableConnections.front());
        availableConnections.pop();
        connection->setInUse(true);
        activeConnections++;
        
        return shared_ptr<DatabaseConnection>(connection.release(), 
            [this](DatabaseConnection* conn) {
                returnConnection(unique_ptr<DatabaseConnection>(conn));
            });
    }
    
    void returnConnection(unique_ptr<DatabaseConnection> connection) {
        lock_guard<mutex> lock(poolMutex);
        connection->setInUse(false);
        availableConnections.push(move(connection));
        activeConnections--;
        poolCondition.notify_one();
        
        // Check if we should scale down
        if (shouldScaleDown()) {
            scaleDown();
        }
    }
    
    void displayMetrics() {
        cout << "\n=== Connection Pool Metrics ===" << endl;
        cout << "Total Connections: " << currentConnections << endl;
        cout << "Active Connections: " << activeConnections.load() << endl;
        cout << "Available Connections: " << availableConnections.size() << endl;
        cout << "Total Requests: " << totalRequests.load() << endl;
        cout << "Waiting Requests: " << waitingRequests.load() << endl;
        cout << "Utilization: " << (double)activeConnections.load() / currentConnections * 100 << "%" << endl;
    }
    
private:
    void addConnection() {
        string connId = "conn_" + to_string(currentConnections + 1);
        auto connection = make_unique<DatabaseConnection>(connId);
        availableConnections.push(move(connection));
        currentConnections++;
    }
    
    bool shouldScaleUp() {
        double utilization = (double)activeConnections.load() / currentConnections;
        return utilization > utilizationThreshold && 
               currentConnections < maxConnections &&
               waitingRequests.load() > 0;
    }
    
    bool shouldScaleDown() {
        double utilization = (double)activeConnections.load() / currentConnections;
        return utilization < (utilizationThreshold - 0.2) && 
               currentConnections > minConnections &&
               availableConnections.size() > minConnections;
    }
    
    void scaleUp() {
        if (currentConnections < maxConnections) {
            addConnection();
            cout << "Scaled up: Added connection (total: " << currentConnections << ")" << endl;
        }
    }
    
    void scaleDown() {
        if (currentConnections > minConnections && !availableConnections.empty()) {
            availableConnections.pop();
            currentConnections--;
            cout << "Scaled down: Removed connection (total: " << currentConnections << ")" << endl;
        }
    }
};

// CPU-intensive task with vertical scaling
class ComputeEngine {
private:
    int coreCount;
    vector<thread> workerThreads;
    queue<function<void()>> taskQueue;
    mutex queueMutex;
    condition_variable queueCondition;
    bool running;
    
    // Performance metrics
    atomic<int> completedTasks{0};
    atomic<int> queuedTasks{0};
    chrono::high_resolution_clock::time_point startTime;
    
public:
    ComputeEngine(int cores = thread::hardware_concurrency()) 
        : coreCount(cores), running(false) {
        startTime = chrono::high_resolution_clock::now();
    }
    
    void start() {
        running = true;
        
        // Create worker threads equal to CPU cores
        for (int i = 0; i < coreCount; i++) {
            workerThreads.emplace_back(&ComputeEngine::workerLoop, this, i);
        }
        
        cout << "Compute engine started with " << coreCount << " cores" << endl;
    }
    
    void stop() {
        running = false;
        queueCondition.notify_all();
        
        for (auto& thread : workerThreads) {
            if (thread.joinable()) {
                thread.join();
            }
        }
        
        cout << "Compute engine stopped" << endl;
    }
    
    void submitTask(function<void()> task) {
        {
            lock_guard<mutex> lock(queueMutex);
            taskQueue.push(task);
            queuedTasks++;
        }
        queueCondition.notify_one();
    }
    
    // Scale up by adding more worker threads (if more cores available)
    void scaleUp() {
        if (workerThreads.size() < thread::hardware_concurrency() * 2) {
            workerThreads.emplace_back(&ComputeEngine::workerLoop, this, workerThreads.size());
            cout << "Scaled up: Added worker thread (total: " << workerThreads.size() << ")" << endl;
        }
    }
    
    void displayMetrics() {
        auto now = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::seconds>(now - startTime);
        
        cout << "\n=== Compute Engine Metrics ===" << endl;
        cout << "Worker Threads: " << workerThreads.size() << endl;
        cout << "Completed Tasks: " << completedTasks.load() << endl;
        cout << "Queued Tasks: " << queuedTasks.load() << endl;
        cout << "Tasks per Second: " << (double)completedTasks.load() / duration.count() << endl;
        cout << "CPU Cores Available: " << thread::hardware_concurrency() << endl;
    }
    
private:
    void workerLoop(int workerId) {
        while (running) {
            unique_lock<mutex> lock(queueMutex);
            queueCondition.wait(lock, [this] { return !taskQueue.empty() || !running; });
            
            if (!running) break;
            
            auto task = taskQueue.front();
            taskQueue.pop();
            queuedTasks--;
            lock.unlock();
            
            // Execute task
            try {
                task();
                completedTasks++;
            } catch (const exception& e) {
                cout << "Worker " << workerId << " error: " << e.what() << endl;
            }
        }
    }
};
```

### ✅ Vertical Scaling Advantages:
```cpp
class VerticalScalingAdvantages {
public:
    void simplicity() {
        // No distributed system complexity
        // Single machine to manage
        // No network latency between components
    }
    
    void consistency() {
        // ACID transactions work normally
        // No distributed data consistency issues
        // Shared memory between processes
    }
    
    void performance() {
        // Lower latency (no network calls)
        // Better resource utilization
        // Simpler caching strategies
    }
};
```

### ❌ Vertical Scaling Disadvantages:
```cpp
class VerticalScalingDisadvantages {
public:
    void limits() {
        // Hardware limits (CPU, RAM, storage)
        // Expensive high-end hardware
        // Single point of failure
    }
    
    void downtime() {
        // Requires downtime for upgrades
        // Risk during hardware changes
        // Limited by vendor hardware options
    }
    
    void cost() {
        // Exponential cost increase
        // Underutilized resources during low load
        // Vendor lock-in for specialized hardware
    }
};
```

---

## 📊 HORIZONTAL SCALING (SCALE OUT)

### What is Horizontal Scaling?
**Real-World Analogy**: Like opening multiple restaurant locations instead of making one restaurant bigger.

```cpp
// Example: Distributed Web Server Cluster
#include <random>
#include <algorithm>

// Individual server node
class ServerNode {
private:
    string nodeId;
    string ipAddress;
    int port;
    bool healthy;
    atomic<int> activeConnections{0};
    atomic<int> totalRequests{0};
    atomic<double> cpuUsage{0.0};
    atomic<double> memoryUsage{0.0};
    
    // Simulate server load
    random_device rd;
    mt19937 gen;
    
public:
    ServerNode(const string& id, const string& ip, int p) 
        : nodeId(id), ipAddress(ip), port(p), healthy(true), gen(rd()) {}
    
    bool processRequest(const string& request) {
        if (!healthy) {
            return false;
        }
        
        activeConnections++;
        totalRequests++;
        
        // Simulate processing time based on load
        int processingTime = 50 + (activeConnections.load() * 10);
        this_thread::sleep_for(chrono::milliseconds(processingTime));
        
        // Update resource usage
        updateResourceUsage();
        
        activeConnections--;
        
        cout << "Node " << nodeId << " processed request: " << request << endl;
        return true;
    }
    
    void updateResourceUsage() {
        // Simulate CPU and memory usage based on load
        uniform_real_distribution<> dis(0.1, 0.9);
        double baseLoad = (double)activeConnections.load() / 100.0;
        
        cpuUsage.store(min(0.95, baseLoad + dis(gen) * 0.3));
        memoryUsage.store(min(0.90, baseLoad + dis(gen) * 0.2));
        
        // Mark unhealthy if overloaded
        if (cpuUsage.load() > 0.90 || memoryUsage.load() > 0.85) {
            healthy = false;
            cout << "Node " << nodeId << " marked unhealthy due to high load" << endl;
        }
    }
    
    void performHealthCheck() {
        // Simulate health recovery
        if (!healthy && cpuUsage.load() < 0.5 && memoryUsage.load() < 0.5) {
            healthy = true;
            cout << "Node " << nodeId << " recovered and marked healthy" << endl;
        }
    }
    
    // Getters
    string getNodeId() const { return nodeId; }
    string getAddress() const { return ipAddress + ":" + to_string(port); }
    bool isHealthy() const { return healthy; }
    int getActiveConnections() const { return activeConnections.load(); }
    int getTotalRequests() const { return totalRequests.load(); }
    double getCpuUsage() const { return cpuUsage.load(); }
    double getMemoryUsage() const { return memoryUsage.load(); }
    
    void setHealthy(bool h) { healthy = h; }
};

// Load balancer for horizontal scaling
class LoadBalancer {
public:
    enum class Algorithm {
        ROUND_ROBIN,
        LEAST_CONNECTIONS,
        WEIGHTED_ROUND_ROBIN,
        LEAST_RESPONSE_TIME
    };
    
private:
    vector<unique_ptr<ServerNode>> servers;
    Algorithm algorithm;
    atomic<int> roundRobinIndex{0};
    mutex serversMutex;
    
    // Health checking
    thread healthCheckThread;
    bool healthCheckRunning;
    
public:
    LoadBalancer(Algorithm algo = Algorithm::ROUND_ROBIN) 
        : algorithm(algo), healthCheckRunning(false) {}
    
    ~LoadBalancer() {
        stopHealthCheck();
    }
    
    void addServer(const string& nodeId, const string& ip, int port) {
        lock_guard<mutex> lock(serversMutex);
        servers.push_back(make_unique<ServerNode>(nodeId, ip, port));
        cout << "Added server: " << nodeId << " at " << ip << ":" << port << endl;
    }
    
    void removeServer(const string& nodeId) {
        lock_guard<mutex> lock(serversMutex);
        servers.erase(
            remove_if(servers.begin(), servers.end(),
                [&nodeId](const unique_ptr<ServerNode>& server) {
                    return server->getNodeId() == nodeId;
                }),
            servers.end()
        );
        cout << "Removed server: " << nodeId << endl;
    }
    
    bool routeRequest(const string& request) {
        ServerNode* selectedServer = selectServer();
        
        if (selectedServer) {
            return selectedServer->processRequest(request);
        } else {
            cout << "No healthy servers available for request: " << request << endl;
            return false;
        }
    }
    
    void startHealthCheck() {
        healthCheckRunning = true;
        healthCheckThread = thread(&LoadBalancer::healthCheckLoop, this);
        cout << "Health check started" << endl;
    }
    
    void stopHealthCheck() {
        healthCheckRunning = false;
        if (healthCheckThread.joinable()) {
            healthCheckThread.join();
        }
    }
    
    void displayClusterStatus() {
        lock_guard<mutex> lock(serversMutex);
        
        cout << "\n=== Cluster Status ===" << endl;
        cout << "Total Servers: " << servers.size() << endl;
        cout << "Load Balancing Algorithm: " << getAlgorithmName() << endl;
        
        int healthyCount = 0;
        int totalRequests = 0;
        
        for (const auto& server : servers) {
            cout << "Server " << server->getNodeId() 
                 << " [" << server->getAddress() << "] - "
                 << (server->isHealthy() ? "HEALTHY" : "UNHEALTHY")
                 << " | Connections: " << server->getActiveConnections()
                 << " | Requests: " << server->getTotalRequests()
                 << " | CPU: " << (int)(server->getCpuUsage() * 100) << "%"
                 << " | Memory: " << (int)(server->getMemoryUsage() * 100) << "%" << endl;
            
            if (server->isHealthy()) healthyCount++;
            totalRequests += server->getTotalRequests();
        }
        
        cout << "Healthy Servers: " << healthyCount << "/" << servers.size() << endl;
        cout << "Total Requests Processed: " << totalRequests << endl;
    }
    
private:
    ServerNode* selectServer() {
        lock_guard<mutex> lock(serversMutex);
        
        // Filter healthy servers
        vector<ServerNode*> healthyServers;
        for (const auto& server : servers) {
            if (server->isHealthy()) {
                healthyServers.push_back(server.get());
            }
        }
        
        if (healthyServers.empty()) {
            return nullptr;
        }
        
        switch (algorithm) {
            case Algorithm::ROUND_ROBIN:
                return selectRoundRobin(healthyServers);
            case Algorithm::LEAST_CONNECTIONS:
                return selectLeastConnections(healthyServers);
            case Algorithm::WEIGHTED_ROUND_ROBIN:
                return selectWeightedRoundRobin(healthyServers);
            case Algorithm::LEAST_RESPONSE_TIME:
                return selectLeastResponseTime(healthyServers);
            default:
                return healthyServers[0];
        }
    }
    
    ServerNode* selectRoundRobin(const vector<ServerNode*>& servers) {
        int index = roundRobinIndex.fetch_add(1) % servers.size();
        return servers[index];
    }
    
    ServerNode* selectLeastConnections(const vector<ServerNode*>& servers) {
        return *min_element(servers.begin(), servers.end(),
            [](ServerNode* a, ServerNode* b) {
                return a->getActiveConnections() < b->getActiveConnections();
            });
    }
    
    ServerNode* selectWeightedRoundRobin(const vector<ServerNode*>& servers) {
        // Weight based on inverse of CPU usage
        vector<pair<ServerNode*, double>> weightedServers;
        
        for (ServerNode* server : servers) {
            double weight = 1.0 - server->getCpuUsage();
            weightedServers.push_back({server, weight});
        }
        
        // Select based on weights (simplified)
        double totalWeight = 0;
        for (const auto& ws : weightedServers) {
            totalWeight += ws.second;
        }
        
        random_device rd;
        mt19937 gen(rd());
        uniform_real_distribution<> dis(0, totalWeight);
        double random = dis(gen);
        
        double cumulative = 0;
        for (const auto& ws : weightedServers) {
            cumulative += ws.second;
            if (random <= cumulative) {
                return ws.first;
            }
        }
        
        return servers[0]; // Fallback
    }
    
    ServerNode* selectLeastResponseTime(const vector<ServerNode*>& servers) {
        // Estimate response time based on load
        return *min_element(servers.begin(), servers.end(),
            [](ServerNode* a, ServerNode* b) {
                double responseTimeA = a->getActiveConnections() * (1 + a->getCpuUsage());
                double responseTimeB = b->getActiveConnections() * (1 + b->getCpuUsage());
                return responseTimeA < responseTimeB;
            });
    }
    
    void healthCheckLoop() {
        while (healthCheckRunning) {
            {
                lock_guard<mutex> lock(serversMutex);
                for (auto& server : servers) {
                    server->performHealthCheck();
                }
            }
            
            this_thread::sleep_for(chrono::seconds(5));
        }
    }
    
    string getAlgorithmName() const {
        switch (algorithm) {
            case Algorithm::ROUND_ROBIN: return "Round Robin";
            case Algorithm::LEAST_CONNECTIONS: return "Least Connections";
            case Algorithm::WEIGHTED_ROUND_ROBIN: return "Weighted Round Robin";
            case Algorithm::LEAST_RESPONSE_TIME: return "Least Response Time";
            default: return "Unknown";
        }
    }
};

// Auto-scaling manager
class AutoScaler {
private:
    LoadBalancer& loadBalancer;
    int minServers;
    int maxServers;
    int currentServers;
    double scaleUpThreshold;
    double scaleDownThreshold;
    
public:
    AutoScaler(LoadBalancer& lb, int minSvr = 2, int maxSvr = 10) 
        : loadBalancer(lb), minServers(minSvr), maxServers(maxSvr), 
          currentServers(0), scaleUpThreshold(0.7), scaleDownThreshold(0.3) {}
    
    void checkAndScale() {
        // This would typically check metrics from monitoring system
        // For demo, we'll simulate based on current load
        
        // In real implementation, you'd:
        // 1. Check CPU/memory usage across cluster
        // 2. Check request queue lengths
        // 3. Check response times
        // 4. Make scaling decisions based on thresholds
        
        cout << "Auto-scaler checking cluster health..." << endl;
        
        // Simulate scaling decision
        if (shouldScaleUp()) {
            scaleUp();
        } else if (shouldScaleDown()) {
            scaleDown();
        }
    }
    
private:
    bool shouldScaleUp() {
        // Simplified logic - in reality, check actual metrics
        return currentServers < maxServers;
    }
    
    bool shouldScaleDown() {
        // Simplified logic - in reality, check actual metrics
        return currentServers > minServers;
    }
    
    void scaleUp() {
        if (currentServers < maxServers) {
            currentServers++;
            string nodeId = "auto-server-" + to_string(currentServers);
            string ip = "192.168.1." + to_string(100 + currentServers);
            int port = 8000 + currentServers;
            
            loadBalancer.addServer(nodeId, ip, port);
            cout << "Auto-scaled UP: Added " << nodeId << endl;
        }
    }
    
    void scaleDown() {
        if (currentServers > minServers) {
            string nodeId = "auto-server-" + to_string(currentServers);
            loadBalancer.removeServer(nodeId);
            currentServers--;
            cout << "Auto-scaled DOWN: Removed " << nodeId << endl;
        }
    }
};
```

---

## ⚖️ LOAD BALANCING STRATEGIES

### Advanced Load Balancing Techniques
**Real-World Analogy**: Like traffic management systems that route cars through different paths to avoid congestion.

```cpp
// Advanced load balancing with circuit breaker pattern
class CircuitBreaker {
public:
    enum class State {
        CLOSED,    // Normal operation
        OPEN,      // Failing, reject requests
        HALF_OPEN  // Testing if service recovered
    };
    
private:
    State state;
    int failureCount;
    int failureThreshold;
    int successCount;
    int successThreshold;
    chrono::steady_clock::time_point lastFailureTime;
    chrono::seconds timeout;
    mutable mutex stateMutex;
    
public:
    CircuitBreaker(int failThreshold = 5, int successThreshold = 3, chrono::seconds timeoutDuration = chrono::seconds(60))
        : state(State::CLOSED), failureCount(0), failureThreshold(failThreshold),
          successCount(0), successThreshold(successThreshold), timeout(timeoutDuration) {}
    
    bool allowRequest() {
        lock_guard<mutex> lock(stateMutex);
        
        switch (state) {
            case State::CLOSED:
                return true;
                
            case State::OPEN:
                if (chrono::steady_clock::now() - lastFailureTime > timeout) {
                    state = State::HALF_OPEN;
                    successCount = 0;
                    cout << "Circuit breaker moved to HALF_OPEN state" << endl;
                    return true;
                }
                return false;
                
            case State::HALF_OPEN:
                return true;
        }
        return false;
    }
    
    void recordSuccess() {
        lock_guard<mutex> lock(stateMutex);
        
        if (state == State::HALF_OPEN) {
            successCount++;
            if (successCount >= successThreshold) {
                state = State::CLOSED;
                failureCount = 0;
                cout << "Circuit breaker moved to CLOSED state" << endl;
            }
        } else if (state == State::CLOSED) {
            failureCount = 0;
        }
    }
    
    void recordFailure() {
        lock_guard<mutex> lock(stateMutex);
        
        failureCount++;
        lastFailureTime = chrono::steady_clock::now();
        
        if (state == State::CLOSED && failureCount >= failureThreshold) {
            state = State::OPEN;
            cout << "Circuit breaker moved to OPEN state" << endl;
        } else if (state == State::HALF_OPEN) {
            state = State::OPEN;
            cout << "Circuit breaker moved back to OPEN state" << endl;
        }
    }
    
    State getState() const {
        lock_guard<mutex> lock(stateMutex);
        return state;
    }
};

// Enhanced server node with circuit breaker
class EnhancedServerNode : public ServerNode {
private:
    unique_ptr<CircuitBreaker> circuitBreaker;
    atomic<double> responseTime{0.0};
    atomic<int> errorCount{0};
    
public:
    EnhancedServerNode(const string& id, const string& ip, int p) 
        : ServerNode(id, ip, p), circuitBreaker(make_unique<CircuitBreaker>()) {}
    
    bool processRequestWithCircuitBreaker(const string& request) {
        if (!circuitBreaker->allowRequest()) {
            cout << "Circuit breaker OPEN for " << getNodeId() << " - request rejected" << endl;
            return false;
        }
        
        auto start = chrono::high_resolution_clock::now();
        bool success = processRequest(request);
        auto end = chrono::high_resolution_clock::now();
        
        auto duration = chrono::duration_cast<chrono::milliseconds>(end - start);
        responseTime.store(duration.count());
        
        if (success) {
            circuitBreaker->recordSuccess();
        } else {
            circuitBreaker->recordFailure();
            errorCount++;
        }
        
        return success;
    }
    
    double getResponseTime() const { return responseTime.load(); }
    int getErrorCount() const { return errorCount.load(); }
    CircuitBreaker::State getCircuitBreakerState() const { return circuitBreaker->getState(); }
};

// Sticky session load balancer
class StickySessionLoadBalancer {
private:
    vector<unique_ptr<EnhancedServerNode>> servers;
    map<string, string> sessionToServer; // sessionId -> serverId
    LoadBalancer::Algorithm algorithm;
    mutex sessionMutex;
    
public:
    StickySessionLoadBalancer(LoadBalancer::Algorithm algo = LoadBalancer::Algorithm::ROUND_ROBIN)
        : algorithm(algo) {}
    
    void addServer(const string& nodeId, const string& ip, int port) {
        servers.push_back(make_unique<EnhancedServerNode>(nodeId, ip, port));
        cout << "Added server with sticky sessions: " << nodeId << endl;
    }
    
    bool routeRequest(const string& request, const string& sessionId = "") {
        EnhancedServerNode* selectedServer = nullptr;
        
        if (!sessionId.empty()) {
            selectedServer = getServerForSession(sessionId);
        }
        
        if (!selectedServer) {
            selectedServer = selectNewServer();
            if (selectedServer && !sessionId.empty()) {
                bindSessionToServer(sessionId, selectedServer->getNodeId());
            }
        }
        
        if (selectedServer) {
            return selectedServer->processRequestWithCircuitBreaker(request);
        }
        
        return false;
    }
    
    void displaySessionInfo() {
        lock_guard<mutex> lock(sessionMutex);
        cout << "\n=== Session Affinity Info ===" << endl;
        cout << "Active Sessions: " << sessionToServer.size() << endl;
        
        map<string, int> serverSessionCount;
        for (const auto& session : sessionToServer) {
            serverSessionCount[session.second]++;
        }
        
        for (const auto& count : serverSessionCount) {
            cout << "Server " << count.first << ": " << count.second << " sessions" << endl;
        }
    }
    
private:
    EnhancedServerNode* getServerForSession(const string& sessionId) {
        lock_guard<mutex> lock(sessionMutex);
        auto it = sessionToServer.find(sessionId);
        
        if (it != sessionToServer.end()) {
            for (auto& server : servers) {
                if (server->getNodeId() == it->second && server->isHealthy()) {
                    return server.get();
                }
            }
            // Session server is unhealthy, remove session binding
            sessionToServer.erase(it);
        }
        return nullptr;
    }
    
    EnhancedServerNode* selectNewServer() {
        // Simple round-robin for new sessions
        static atomic<int> index{0};
        vector<EnhancedServerNode*> healthyServers;
        
        for (auto& server : servers) {
            if (server->isHealthy()) {
                healthyServers.push_back(server.get());
            }
        }
        
        if (healthyServers.empty()) {
            return nullptr;
        }
        
        int serverIndex = index.fetch_add(1) % healthyServers.size();
        return healthyServers[serverIndex];
    }
    
    void bindSessionToServer(const string& sessionId, const string& serverId) {
        lock_guard<mutex> lock(sessionMutex);
        sessionToServer[sessionId] = serverId;
        cout << "Bound session " << sessionId << " to server " << serverId << endl;
    }
};
```

---

## 🚀 CACHING STRATEGIES

### What is Caching?
**Real-World Analogy**: Like keeping frequently used items in your desk drawer instead of walking to the storage room every time.

```cpp
// Multi-level caching system
#include <unordered_map>
#include <list>

// LRU Cache implementation
template<typename Key, typename Value>
class LRUCache {
private:
    struct Node {
        Key key;
        Value value;
        typename list<Node>::iterator listIt;
    };
    
    size_t capacity;
    unordered_map<Key, Node> cache;
    list<Node> accessOrder; // Most recent at front
    
public:
    LRUCache(size_t cap) : capacity(cap) {}
    
    optional<Value> get(const Key& key) {
        auto it = cache.find(key);
        if (it == cache.end()) {
            return nullopt; // Cache miss
        }
        
        // Move to front (most recently used)
        accessOrder.erase(it->second.listIt);
        accessOrder.push_front(it->second);
        it->second.listIt = accessOrder.begin();
        
        return it->second.value;
    }
    
    void put(const Key& key, const Value& value) {
        auto it = cache.find(key);
        
        if (it != cache.end()) {
            // Update existing key
            accessOrder.erase(it->second.listIt);
            it->second.value = value;
        } else {
            // Add new key
            if (cache.size() >= capacity) {
                // Evict least recently used
                auto& lru = accessOrder.back();
                cache.erase(lru.key);
                accessOrder.pop_back();
            }
        }
        
        // Add to front
        accessOrder.push_front({key, value});
        cache[key] = {key, value, accessOrder.begin()};
    }
    
    size_t size() const { return cache.size(); }
    double hitRate() const {
        static atomic<int> hits{0};
        static atomic<int> total{0};
        return total.load() > 0 ? (double)hits.load() / total.load() : 0.0;
    }
};

// Distributed cache with consistent hashing
class DistributedCache {
private:
    struct CacheNode {
        string nodeId;
        string address;
        unique_ptr<LRUCache<string, string>> cache;
        bool healthy;
        
        CacheNode(const string& id, const string& addr, size_t capacity)
            : nodeId(id), address(addr), cache(make_unique<LRUCache<string, string>>(capacity)), healthy(true) {}
    };
    
    vector<unique_ptr<CacheNode>> nodes;
    map<uint32_t, CacheNode*> hashRing; // Consistent hashing ring
    mutex cacheMutex;
    
    // Cache statistics
    atomic<int> totalRequests{0};
    atomic<int> cacheHits{0};
    atomic<int> cacheMisses{0};
    
public:
    void addNode(const string& nodeId, const string& address, size_t capacity = 1000) {
        lock_guard<mutex> lock(cacheMutex);
        
        auto node = make_unique<CacheNode>(nodeId, address, capacity);
        CacheNode* nodePtr = node.get();
        nodes.push_back(move(node));
        
        // Add to consistent hash ring (multiple virtual nodes for better distribution)
        for (int i = 0; i < 100; i++) {
            string virtualNodeId = nodeId + "_" + to_string(i);
            uint32_t hash = hashFunction(virtualNodeId);
            hashRing[hash] = nodePtr;
        }
        
        cout << "Added cache node: " << nodeId << " at " << address << endl;
    }
    
    void removeNode(const string& nodeId) {
        lock_guard<mutex> lock(cacheMutex);
        
        // Remove from hash ring
        for (auto it = hashRing.begin(); it != hashRing.end();) {
            if (it->second->nodeId == nodeId) {
                it = hashRing.erase(it);
            } else {
                ++it;
            }
        }
        
        // Remove from nodes vector
        nodes.erase(
            remove_if(nodes.begin(), nodes.end(),
                [&nodeId](const unique_ptr<CacheNode>& node) {
                    return node->nodeId == nodeId;
                }),
            nodes.end()
        );
        
        cout << "Removed cache node: " << nodeId << endl;
    }
    
    optional<string> get(const string& key) {
        totalRequests++;
        
        CacheNode* node = getNodeForKey(key);
        if (!node || !node->healthy) {
            cacheMisses++;
            return nullopt;
        }
        
        auto value = node->cache->get(key);
        if (value.has_value()) {
            cacheHits++;
            cout << "Cache HIT for key '" << key << "' on node " << node->nodeId << endl;
        } else {
            cacheMisses++;
            cout << "Cache MISS for key '" << key << "' on node " << node->nodeId << endl;
        }
        
        return value;
    }
    
    void put(const string& key, const string& value) {
        CacheNode* node = getNodeForKey(key);
        if (node && node->healthy) {
            node->cache->put(key, value);
            cout << "Cached key '" << key << "' on node " << node->nodeId << endl;
        }
    }
    
    void displayStats() {
        cout << "\n=== Distributed Cache Statistics ===" << endl;
        cout << "Total Requests: " << totalRequests.load() << endl;
        cout << "Cache Hits: " << cacheHits.load() << endl;
        cout << "Cache Misses: " << cacheMisses.load() << endl;
        cout << "Hit Rate: " << (double)cacheHits.load() / totalRequests.load() * 100 << "%" << endl;
        cout << "Active Nodes: " << nodes.size() << endl;
        
        for (const auto& node : nodes) {
            cout << "Node " << node->nodeId << ": " << node->cache->size() << " items" << endl;
        }
    }
    
private:
    CacheNode* getNodeForKey(const string& key) {
        if (hashRing.empty()) {
            return nullptr;
        }
        
        uint32_t keyHash = hashFunction(key);
        auto it = hashRing.lower_bound(keyHash);
        
        if (it == hashRing.end()) {
            it = hashRing.begin(); // Wrap around
        }
        
        return it->second;
    }
    
    uint32_t hashFunction(const string& input) {
        // Simple hash function (in production, use better hash like SHA-1)
        uint32_t hash = 0;
        for (char c : input) {
            hash = hash * 31 + c;
        }
        return hash;
    }
};

// Cache-aside pattern implementation
class CacheAsideService {
private:
    DistributedCache& cache;
    // Simulated database
    map<string, string> database;
    
    // Performance metrics
    atomic<int> dbQueries{0};
    atomic<int> cacheQueries{0};
    
public:
    CacheAsideService(DistributedCache& c) : cache(c) {
        // Initialize some data in "database"
        database["user:1"] = "{\"id\":1,\"name\":\"John\",\"email\":\"john@example.com\"}";
        database["user:2"] = "{\"id\":2,\"name\":\"Jane\",\"email\":\"jane@example.com\"}";
        database["product:1"] = "{\"id\":1,\"name\":\"Laptop\",\"price\":999.99}";
        database["product:2"] = "{\"id\":2,\"name\":\"Mouse\",\"price\":29.99}";
    }
    
    string getData(const string& key) {
        cacheQueries++;
        
        // Try cache first
        auto cachedValue = cache.get(key);
        if (cachedValue.has_value()) {
            return cachedValue.value();
        }
        
        // Cache miss - query database
        dbQueries++;
        auto it = database.find(key);
        if (it != database.end()) {
            // Store in cache for future requests
            cache.put(key, it->second);
            cout << "Loaded from database and cached: " << key << endl;
            return it->second;
        }
        
        return ""; // Not found
    }
    
    void updateData(const string& key, const string& value) {
        // Update database
        database[key] = value;
        dbQueries++;
        
        // Invalidate cache (or update it)
        cache.put(key, value);
        cout << "Updated database and cache: " << key << endl;
    }
    
    void displayMetrics() {
        cout << "\n=== Cache-Aside Service Metrics ===" << endl;
        cout << "Database Queries: " << dbQueries.load() << endl;
        cout << "Cache Queries: " << cacheQueries.load() << endl;
        cout << "Cache Efficiency: " << (double)(cacheQueries.load() - dbQueries.load()) / cacheQueries.load() * 100 << "%" << endl;
    }
};

// Write-through cache implementation
class WriteThroughCache {
private:
    LRUCache<string, string> cache;
    map<string, string> database;
    mutex cacheMutex;
    
public:
    WriteThroughCache(size_t capacity) : cache(capacity) {}
    
    string read(const string& key) {
        lock_guard<mutex> lock(cacheMutex);
        
        // Try cache first
        auto cachedValue = cache.get(key);
        if (cachedValue.has_value()) {
            cout << "Read from cache: " << key << endl;
            return cachedValue.value();
        }
        
        // Cache miss - read from database
        auto it = database.find(key);
        if (it != database.end()) {
            cache.put(key, it->second);
            cout << "Read from database and cached: " << key << endl;
            return it->second;
        }
        
        return "";
    }
    
    void write(const string& key, const string& value) {
        lock_guard<mutex> lock(cacheMutex);
        
        // Write to both cache and database
        cache.put(key, value);
        database[key] = value;
        
        cout << "Write-through: " << key << " written to both cache and database" << endl;
    }
};

// Write-behind (write-back) cache implementation
class WriteBehindCache {
private:
    LRUCache<string, string> cache;
    map<string, string> database;
    set<string> dirtyKeys;
    mutex cacheMutex;
    
    // Background writer
    thread writerThread;
    bool writerRunning;
    condition_variable writerCondition;
    
public:
    WriteBehindCache(size_t capacity) : cache(capacity), writerRunning(false) {}
    
    ~WriteBehindCache() {
        stopWriter();
    }
    
    void startWriter() {
        writerRunning = true;
        writerThread = thread(&WriteBehindCache::writerLoop, this);
        cout << "Write-behind cache writer started" << endl;
    }
    
    void stopWriter() {
        writerRunning = false;
        writerCondition.notify_all();
        if (writerThread.joinable()) {
            writerThread.join();
        }
    }
    
    string read(const string& key) {
        lock_guard<mutex> lock(cacheMutex);
        
        auto cachedValue = cache.get(key);
        if (cachedValue.has_value()) {
            return cachedValue.value();
        }
        
        // Read from database
        auto it = database.find(key);
        if (it != database.end()) {
            cache.put(key, it->second);
            return it->second;
        }
        
        return "";
    }
    
    void write(const string& key, const string& value) {
        lock_guard<mutex> lock(cacheMutex);
        
        // Write to cache immediately
        cache.put(key, value);
        dirtyKeys.insert(key);
        
        cout << "Write-behind: " << key << " written to cache, marked dirty" << endl;
        writerCondition.notify_one();
    }
    
private:
    void writerLoop() {
        while (writerRunning) {
            unique_lock<mutex> lock(cacheMutex);
            writerCondition.wait_for(lock, chrono::seconds(5), [this] { return !dirtyKeys.empty() || !writerRunning; });
            
            if (!writerRunning) break;
            
            // Write dirty keys to database
            for (auto it = dirtyKeys.begin(); it != dirtyKeys.end();) {
                auto cachedValue = cache.get(*it);
                if (cachedValue.has_value()) {
                    database[*it] = cachedValue.value();
                    cout << "Background write: " << *it << " written to database" << endl;
                }
                it = dirtyKeys.erase(it);
            }
        }
    }
};
```

---

## 🌐 CONTENT DELIVERY NETWORKS (CDN)

### What is a CDN?
**Real-World Analogy**: Like having local warehouses in different cities so customers get products faster from the nearest location.

```cpp
// CDN Edge Server implementation
class EdgeServer {
private:
    string serverId;
    string location;
    LRUCache<string, string> contentCache;
    string originServerUrl;
    
    // Performance metrics
    atomic<int> cacheHits{0};
    atomic<int> cacheMisses{0};
    atomic<int> originRequests{0};
    
public:
    EdgeServer(const string& id, const string& loc, const string& origin, size_t cacheSize = 1000)
        : serverId(id), location(loc), contentCache(cacheSize), originServerUrl(origin) {}
    
    string getContent(const string& path) {
        // Try local cache first
        auto cachedContent = contentCache.get(path);
        if (cachedContent.has_value()) {
            cacheHits++;
            cout << "CDN HIT: " << serverId << " served " << path << " from cache" << endl;
            return cachedContent.value();
        }
        
        // Cache miss - fetch from origin
        cacheMisses++;
        originRequests++;
        string content = fetchFromOrigin(path);
        
        if (!content.empty()) {
            contentCache.put(path, content);
            cout << "CDN MISS: " << serverId << " fetched " << path << " from origin and cached" << endl;
        }
        
        return content;
    }
    
    void preloadContent(const string& path, const string& content) {
        contentCache.put(path, content);
        cout << "Preloaded content: " << path << " on edge server " << serverId << endl;
    }
    
    void invalidateContent(const string& path) {
        // In a real implementation, this would remove from cache
        cout << "Invalidated content: " << path << " on edge server " << serverId << endl;
    }
    
    double getCacheHitRate() const {
        int total = cacheHits.load() + cacheMisses.load();
        return total > 0 ? (double)cacheHits.load() / total : 0.0;
    }
    
    string getServerId() const { return serverId; }
    string getLocation() const { return location; }
    int getOriginRequests() const { return originRequests.load(); }
    
private:
    string fetchFromOrigin(const string& path) {
        // Simulate network delay to origin server
        this_thread::sleep_for(chrono::milliseconds(100));
        
        // Simulate content (in real implementation, make HTTP request)
        if (path == "/index.html") {
            return "<html><body>Welcome to our website!</body></html>";
        } else if (path == "/api/users") {
            return "[{\"id\":1,\"name\":\"John\"},{\"id\":2,\"name\":\"Jane\"}]";
        } else if (path == "/images/logo.png") {
            return "BINARY_IMAGE_DATA_PLACEHOLDER";
        }
        
        return ""; // Not found
    }
};

// CDN Network with geographic distribution
class CDNNetwork {
private:
    vector<unique_ptr<EdgeServer>> edgeServers;
    map<string, EdgeServer*> locationToServer;
    string originServer;
    
public:
    CDNNetwork(const string& origin) : originServer(origin) {}
    
    void addEdgeServer(const string& serverId, const string& location) {
        auto server = make_unique<EdgeServer>(serverId, location, originServer);
        EdgeServer* serverPtr = server.get();
        
        edgeServers.push_back(move(server));
        locationToServer[location] = serverPtr;
        
        cout << "Added CDN edge server: " << serverId << " in " << location << endl;
    }
    
    string getContent(const string& path, const string& userLocation) {
        EdgeServer* nearestServer = findNearestServer(userLocation);
        
        if (nearestServer) {
            return nearestServer->getContent(path);
        } else {
            cout << "No edge servers available, fetching from origin" << endl;
            return fetchFromOrigin(path);
        }
    }
    
    void preloadContentGlobally(const string& path, const string& content) {
        for (auto& server : edgeServers) {
            server->preloadContent(path, content);
        }
        cout << "Preloaded content globally: " << path << endl;
    }
    
    void invalidateContentGlobally(const string& path) {
        for (auto& server : edgeServers) {
            server->invalidateContent(path);
        }
        cout << "Invalidated content globally: " << path << endl;
    }
    
    void displayCDNStats() {
        cout << "\n=== CDN Network Statistics ===" << endl;
        cout << "Total Edge Servers: " << edgeServers.size() << endl;
        
        double totalHitRate = 0;
        int totalOriginRequests = 0;
        
        for (const auto& server : edgeServers) {
            double hitRate = server->getCacheHitRate();
            totalHitRate += hitRate;
            totalOriginRequests += server->getOriginRequests();
            
            cout << "Server " << server->getServerId() 
                 << " [" << server->getLocation() << "] - "
                 << "Hit Rate: " << (int)(hitRate * 100) << "%, "
                 << "Origin Requests: " << server->getOriginRequests() << endl;
        }
        
        cout << "Average Hit Rate: " << (int)(totalHitRate / edgeServers.size() * 100) << "%" << endl;
        cout << "Total Origin Requests: " << totalOriginRequests << endl;
    }
    
private:
    EdgeServer* findNearestServer(const string& userLocation) {
        // Simplified geographic routing
        // In reality, this would use geolocation and latency measurements
        
        map<string, vector<string>> regionMapping = {
            {"US-East", {"New York", "Virginia", "Boston"}},
            {"US-West", {"California", "Oregon", "Nevada"}},
            {"Europe", {"London", "Frankfurt", "Paris"}},
            {"Asia", {"Tokyo", "Singapore", "Mumbai"}}
        };
        
        // Find region for user location
        for (const auto& region : regionMapping) {
            for (const string& location : region.second) {
                if (userLocation.find(location) != string::npos) {
                    // Find server in same region
                    for (const string& serverLocation : region.second) {
                        auto it = locationToServer.find(serverLocation);
                        if (it != locationToServer.end()) {
                            return it->second;
                        }
                    }
                }
            }
        }
        
        // Fallback to first available server
        return edgeServers.empty() ? nullptr : edgeServers[0].get();
    }
    
    string fetchFromOrigin(const string& path) {
        // Direct fetch from origin server
        this_thread::sleep_for(chrono::milliseconds(200)); // Higher latency
        return "Content from origin server";
    }
};
```

---

## 📊 Performance Monitoring and Metrics

```cpp
// Performance monitoring system
class PerformanceMonitor {
private:
    struct Metric {
        string name;
        double value;
        time_t timestamp;
        string unit;
    };
    
    vector<Metric> metrics;
    mutex metricsMutex;
    
    // Real-time metrics
    atomic<double> avgResponseTime{0.0};
    atomic<int> requestsPerSecond{0};
    atomic<double> cpuUsage{0.0};
    atomic<double> memoryUsage{0.0};
    atomic<double> errorRate{0.0};
    
public:
    void recordMetric(const string& name, double value, const string& unit = "") {
        lock_guard<mutex> lock(metricsMutex);
        metrics.push_back({name, value, time(nullptr), unit});
        
        // Update real-time metrics
        if (name == "response_time") {
            updateAvgResponseTime(value);
        } else if (name == "requests_per_second") {
            requestsPerSecond.store(value);
        } else if (name == "cpu_usage") {
            cpuUsage.store(value);
        } else if (name == "memory_usage") {
            memoryUsage.store(value);
        } else if (name == "error_rate") {
            errorRate.store(value);
        }
    }
    
    void displayDashboard() {
        cout << "\n=== Performance Dashboard ===" << endl;
        cout << "Average Response Time: " << avgResponseTime.load() << "ms" << endl;
        cout << "Requests per Second: " << requestsPerSecond.load() << endl;
        cout << "CPU Usage: " << (int)(cpuUsage.load() * 100) << "%" << endl;
        cout << "Memory Usage: " << (int)(memoryUsage.load() * 100) << "%" << endl;
        cout << "Error Rate: " << (int)(errorRate.load() * 100) << "%" << endl;
        
        // Performance health check
        cout << "\nHealth Status: ";
        if (isSystemHealthy()) {
            cout << "HEALTHY ✅" << endl;
        } else {
            cout << "UNHEALTHY ❌" << endl;
            displayAlerts();
        }
    }
    
    bool isSystemHealthy() {
        return avgResponseTime.load() < 500 &&    // < 500ms response time
               cpuUsage.load() < 0.8 &&           // < 80% CPU usage
               memoryUsage.load() < 0.9 &&        // < 90% memory usage
               errorRate.load() < 0.05;           // < 5% error rate
    }
    
    void displayAlerts() {
        cout << "Active Alerts:" << endl;
        
        if (avgResponseTime.load() >= 500) {
            cout << "⚠️  High response time: " << avgResponseTime.load() << "ms" << endl;
        }
        if (cpuUsage.load() >= 0.8) {
            cout << "⚠️  High CPU usage: " << (int)(cpuUsage.load() * 100) << "%" << endl;
        }
        if (memoryUsage.load() >= 0.9) {
            cout << "⚠️  High memory usage: " << (int)(memoryUsage.load() * 100) << "%" << endl;
        }
        if (errorRate.load() >= 0.05) {
            cout << "⚠️  High error rate: " << (int)(errorRate.load() * 100) << "%" << endl;
        }
    }
    
private:
    void updateAvgResponseTime(double newTime) {
        static atomic<int> count{0};
        static atomic<double> total{0.0};
        
        count++;
        total.store(total.load() + newTime);
        avgResponseTime.store(total.load() / count.load());
    }
};
```

---

## ⚡ Key Takeaways

1. **Vertical scaling** is simpler but has limits and single points of failure
2. **Horizontal scaling** is more complex but offers better fault tolerance and unlimited growth
3. **Load balancing** is crucial for distributing traffic effectively across multiple servers
4. **Caching** dramatically improves performance by reducing database load and response times
5. **CDNs** bring content closer to users, reducing latency and improving user experience
6. **Monitoring** is essential for understanding system performance and making scaling decisions

## 🎯 Next Steps

- Study distributed systems concepts (CAP theorem, consistency models)
- Learn about database sharding and replication strategies
- Explore cloud auto-scaling services (AWS Auto Scaling, Kubernetes HPA)
- Practice designing systems for different load patterns
- Understand cost optimization strategies for scaled systems

---
*"Scalability is not just about handling more load, it's about handling it efficiently and cost-effectively!"* 🚀
