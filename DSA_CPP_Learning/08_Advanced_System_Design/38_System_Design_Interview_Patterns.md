# System Design Interview Patterns - Mastering Large-Scale System Design

## 🌟 Real-World Story: The Digital City Architect

Imagine being the chief architect for a smart city that needs to handle millions of residents, thousands of services, and real-time coordination. You need the same systematic approach as system design interviews:

- **Requirements Gathering** (Understanding the Problem): Like surveying the city's needs, population, and growth projections
- **Capacity Planning** (Scale Estimation): Calculating infrastructure needs for current and future populations
- **Service Architecture** (High-Level Design): Designing districts, transportation networks, and utility systems
- **Component Design** (Detailed Design): Specifying individual buildings, roads, and service connections
- **Reliability Planning** (Failure Scenarios): Emergency protocols, backup systems, and disaster recovery
- **Performance Optimization** (Bottleneck Analysis): Traffic flow optimization and resource allocation
- **Future Expansion** (Scalability): Planning for population growth and new service requirements

Just like architecting a smart city, system design interviews require structured thinking, trade-off analysis, and scalable solutions!

## 🎯 Why System Design Interviews Matter

### Real Applications:
- **Google**: Designs systems handling 8.5 billion searches daily with sub-second response times
- **Facebook**: Manages 2.9 billion users with real-time feeds and messaging
- **Netflix**: Streams to 230+ million subscribers with 99.99% uptime
- **Uber**: Coordinates millions of rides daily with real-time matching and routing

## 📊 System Design Interview Components

### 🎯 Problem Analysis and Requirements
### 📏 Capacity Estimation and Scaling
### 🏗️ High-Level Architecture Design
### 🔧 Detailed Component Design
### 🚨 Reliability and Failure Handling

---

## 🎯 PROBLEM ANALYSIS AND REQUIREMENTS

### What is Requirements Analysis?
**Real-World Analogy**: Like a doctor's diagnosis - you need to ask the right questions, understand symptoms (requirements), and identify the root problem before prescribing a solution.

```cpp
// System Design Interview Framework Implementation
#include <chrono>
#include <vector>
#include <map>
#include <set>
#include <memory>
#include <functional>
#include <algorithm>
#include <numeric>

// Requirement Types
enum class RequirementType {
    FUNCTIONAL,     // What the system should do
    NON_FUNCTIONAL, // How the system should perform
    CONSTRAINT      // Limitations and boundaries
};

// System Requirement
class SystemRequirement {
private:
    string id;
    string description;
    RequirementType type;
    int priority; // 1-5 scale
    bool isCritical;
    vector<string> dependencies;
    map<string, string> attributes;
    
public:
    SystemRequirement(const string& reqId, const string& desc, RequirementType reqType, int prio = 3)
        : id(reqId), description(desc), type(reqType), priority(prio), isCritical(prio >= 4) {}
    
    void addDependency(const string& dependencyId) {
        dependencies.push_back(dependencyId);
    }
    
    void setAttribute(const string& key, const string& value) {
        attributes[key] = value;
    }
    
    // Getters
    string getId() const { return id; }
    string getDescription() const { return description; }
    RequirementType getType() const { return type; }
    int getPriority() const { return priority; }
    bool getIsCritical() const { return isCritical; }
    vector<string> getDependencies() const { return dependencies; }
    
    string getTypeString() const {
        switch (type) {
            case RequirementType::FUNCTIONAL: return "Functional";
            case RequirementType::NON_FUNCTIONAL: return "Non-Functional";
            case RequirementType::CONSTRAINT: return "Constraint";
            default: return "Unknown";
        }
    }
    
    void display() const {
        cout << "Requirement: " << id << endl;
        cout << "  Description: " << description << endl;
        cout << "  Type: " << getTypeString() << endl;
        cout << "  Priority: " << priority << "/5" << (isCritical ? " (Critical)" : "") << endl;
        
        if (!dependencies.empty()) {
            cout << "  Dependencies: ";
            for (size_t i = 0; i < dependencies.size(); i++) {
                cout << dependencies[i];
                if (i < dependencies.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        
        if (!attributes.empty()) {
            cout << "  Attributes:" << endl;
            for (const auto& attr : attributes) {
                cout << "    " << attr.first << ": " << attr.second << endl;
            }
        }
    }
};

// Requirements Analyzer
class RequirementsAnalyzer {
private:
    vector<unique_ptr<SystemRequirement>> requirements;
    map<string, vector<string>> conflictMatrix;
    
public:
    void addRequirement(unique_ptr<SystemRequirement> requirement) {
        requirements.push_back(move(requirement));
    }
    
    void addConflict(const string& req1, const string& req2, const string& reason) {
        conflictMatrix[req1].push_back(req2 + " (" + reason + ")");
        conflictMatrix[req2].push_back(req1 + " (" + reason + ")");
    }
    
    void analyzeRequirements() {
        cout << "\n=== Requirements Analysis ===" << endl;
        
        // Categorize requirements
        map<RequirementType, vector<SystemRequirement*>> categorized;
        for (const auto& req : requirements) {
            categorized[req->getType()].push_back(req.get());
        }
        
        // Display by category
        for (const auto& category : categorized) {
            cout << "\n" << getTypeString(category.first) << " Requirements:" << endl;
            for (const auto& req : category.second) {
                cout << "  - " << req->getDescription();
                if (req->getIsCritical()) cout << " [CRITICAL]";
                cout << endl;
            }
        }
        
        // Identify conflicts
        if (!conflictMatrix.empty()) {
            cout << "\nRequirement Conflicts:" << endl;
            for (const auto& conflict : conflictMatrix) {
                cout << "  " << conflict.first << " conflicts with:" << endl;
                for (const auto& conflictWith : conflict.second) {
                    cout << "    - " << conflictWith << endl;
                }
            }
        }
        
        // Priority analysis
        analyzePriorities();
    }
    
    vector<SystemRequirement*> getCriticalRequirements() const {
        vector<SystemRequirement*> critical;
        for (const auto& req : requirements) {
            if (req->getIsCritical()) {
                critical.push_back(req.get());
            }
        }
        return critical;
    }
    
private:
    string getTypeString(RequirementType type) const {
        switch (type) {
            case RequirementType::FUNCTIONAL: return "Functional";
            case RequirementType::NON_FUNCTIONAL: return "Non-Functional";
            case RequirementType::CONSTRAINT: return "Constraint";
            default: return "Unknown";
        }
    }
    
    void analyzePriorities() {
        cout << "\nPriority Analysis:" << endl;
        
        map<int, int> priorityCount;
        for (const auto& req : requirements) {
            priorityCount[req->getPriority()]++;
        }
        
        for (auto it = priorityCount.rbegin(); it != priorityCount.rend(); ++it) {
            cout << "  Priority " << it->first << ": " << it->second << " requirements" << endl;
        }
        
        int criticalCount = 0;
        for (const auto& req : requirements) {
            if (req->getIsCritical()) criticalCount++;
        }
        
        cout << "  Critical Requirements: " << criticalCount << "/" << requirements.size() << endl;
    }
};

// Interview Question Framework
class InterviewQuestion {
private:
    string questionTitle;
    string description;
    vector<string> clarifyingQuestions;
    map<string, string> assumptions;
    RequirementsAnalyzer requirementsAnalyzer;
    
public:
    InterviewQuestion(const string& title, const string& desc)
        : questionTitle(title), description(desc) {}
    
    void addClarifyingQuestion(const string& question) {
        clarifyingQuestions.push_back(question);
    }
    
    void addAssumption(const string& key, const string& value) {
        assumptions[key] = value;
    }
    
    void addRequirement(unique_ptr<SystemRequirement> requirement) {
        requirementsAnalyzer.addRequirement(move(requirement));
    }
    
    void displayProblemStatement() const {
        cout << "\n" << string(60, '=') << endl;
        cout << "SYSTEM DESIGN INTERVIEW: " << questionTitle << endl;
        cout << string(60, '=') << endl;
        
        cout << "\nProblem Description:" << endl;
        cout << description << endl;
        
        if (!clarifyingQuestions.empty()) {
            cout << "\nClarifying Questions to Ask:" << endl;
            for (size_t i = 0; i < clarifyingQuestions.size(); i++) {
                cout << (i + 1) << ". " << clarifyingQuestions[i] << endl;
            }
        }
        
        if (!assumptions.empty()) {
            cout << "\nKey Assumptions:" << endl;
            for (const auto& assumption : assumptions) {
                cout << "  - " << assumption.first << ": " << assumption.second << endl;
            }
        }
    }
    
    void analyzeRequirements() {
        requirementsAnalyzer.analyzeRequirements();
    }
    
    RequirementsAnalyzer& getRequirementsAnalyzer() {
        return requirementsAnalyzer;
    }
};

// Common System Design Questions
class SystemDesignQuestions {
public:
    static unique_ptr<InterviewQuestion> createURLShortenerQuestion() {
        auto question = make_unique<InterviewQuestion>(
            "Design a URL Shortener (like bit.ly)",
            "Design a web service that can shorten long URLs and redirect users to the original URL when they access the shortened version."
        );
        
        // Clarifying questions
        question->addClarifyingQuestion("What is the expected scale? How many URLs per day?");
        question->addClarifyingQuestion("What is the ratio of read to write operations?");
        question->addClarifyingQuestion("How long should the shortened URLs be valid?");
        question->addClarifyingQuestion("Can users customize their shortened URLs?");
        question->addClarifyingQuestion("Do we need analytics on URL usage?");
        
        // Assumptions
        question->addAssumption("Scale", "100M URLs shortened per day");
        question->addAssumption("Read:Write Ratio", "100:1");
        question->addAssumption("URL Expiration", "5 years default");
        question->addAssumption("Custom URLs", "Premium feature only");
        
        // Requirements
        question->addRequirement(make_unique<SystemRequirement>(
            "FR1", "Shorten long URLs to 6-8 character short URLs", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR2", "Redirect users from short URL to original URL", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR3", "Custom short URLs for premium users", RequirementType::FUNCTIONAL, 3
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR1", "System should handle 100M URL shortenings per day", RequirementType::NON_FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR2", "Redirection should have < 100ms latency", RequirementType::NON_FUNCTIONAL, 4
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR3", "System should be 99.9% available", RequirementType::NON_FUNCTIONAL, 4
        ));
        
        return question;
    }
    
    static unique_ptr<InterviewQuestion> createChatSystemQuestion() {
        auto question = make_unique<InterviewQuestion>(
            "Design a Chat System (like WhatsApp)",
            "Design a real-time messaging system that supports one-on-one and group conversations with message delivery guarantees."
        );
        
        // Clarifying questions
        question->addClarifyingQuestion("What is the expected number of users?");
        question->addClarifyingQuestion("Do we need to support group chats? What's the max group size?");
        question->addClarifyingQuestion("Do we need message history and search?");
        question->addClarifyingQuestion("Do we need to support media messages (images, videos)?");
        question->addClarifyingQuestion("Do we need read receipts and online status?");
        question->addClarifyingQuestion("Do we need end-to-end encryption?");
        
        // Assumptions
        question->addAssumption("Users", "1 billion users");
        question->addAssumption("Daily Active Users", "500 million");
        question->addAssumption("Messages per day", "100 billion");
        question->addAssumption("Group size limit", "500 members");
        
        // Requirements
        question->addRequirement(make_unique<SystemRequirement>(
            "FR1", "Send and receive messages in real-time", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR2", "Support one-on-one and group conversations", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR3", "Message delivery confirmation", RequirementType::FUNCTIONAL, 4
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR4", "Online/offline status indicators", RequirementType::FUNCTIONAL, 3
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR1", "Support 500M daily active users", RequirementType::NON_FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR2", "Message delivery latency < 100ms", RequirementType::NON_FUNCTIONAL, 4
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR3", "99.99% uptime", RequirementType::NON_FUNCTIONAL, 4
        ));
        
        return question;
    }
    
    static unique_ptr<InterviewQuestion> createSocialMediaFeedQuestion() {
        auto question = make_unique<InterviewQuestion>(
            "Design a Social Media Feed (like Twitter)",
            "Design a social media platform where users can post updates and see a personalized feed of posts from people they follow."
        );
        
        // Clarifying questions
        question->addClarifyingQuestion("What is the expected number of users?");
        question->addClarifyingQuestion("How many posts per day?");
        question->addClarifyingQuestion("What types of content? Text, images, videos?");
        question->addClarifyingQuestion("How should the feed be ordered? Chronological or algorithmic?");
        question->addClarifyingQuestion("Do we need real-time updates?");
        question->addClarifyingQuestion("Do we need to support likes, comments, and shares?");
        
        // Assumptions
        question->addAssumption("Users", "1 billion users");
        question->addAssumption("Daily Active Users", "200 million");
        question->addAssumption("Posts per day", "400 million");
        question->addAssumption("Average following", "200 users");
        
        // Requirements
        question->addRequirement(make_unique<SystemRequirement>(
            "FR1", "Users can post text updates with media", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR2", "Users can follow/unfollow other users", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR3", "Generate personalized feed for each user", RequirementType::FUNCTIONAL, 5
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "FR4", "Support likes, comments, and shares", RequirementType::FUNCTIONAL, 4
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR1", "Feed generation should be < 200ms", RequirementType::NON_FUNCTIONAL, 4
        ));
        
        question->addRequirement(make_unique<SystemRequirement>(
            "NFR2", "Handle 400M posts per day", RequirementType::NON_FUNCTIONAL, 5
        ));
        
        return question;
    }
};
```

---

## 📏 CAPACITY ESTIMATION AND SCALING

### What is Capacity Planning?
**Real-World Analogy**: Like planning a concert venue - you need to estimate attendance, calculate space requirements, plan parking, concessions, and emergency exits based on expected crowd size.

```cpp
// Capacity Estimation Framework
#include <cmath>

// Traffic Patterns
enum class TrafficPattern {
    UNIFORM,        // Consistent throughout day
    PEAK_HOURS,     // Higher during business hours
    WEEKEND_HEAVY,  // Higher on weekends
    EVENT_DRIVEN    // Spikes during events
};

// Capacity Calculator
class CapacityCalculator {
private:
    struct TrafficEstimate {
        long long dailyActiveUsers;
        long long monthlyActiveUsers;
        double avgRequestsPerUser;
        double peakMultiplier;
        TrafficPattern pattern;
        
        TrafficEstimate() : dailyActiveUsers(0), monthlyActiveUsers(0), 
                           avgRequestsPerUser(0), peakMultiplier(2.0), 
                           pattern(TrafficPattern::UNIFORM) {}
    };
    
    struct StorageEstimate {
        long long avgDataPerUser;      // bytes
        long long avgDataPerRequest;   // bytes
        double dataGrowthRate;         // yearly
        int retentionYears;
        
        StorageEstimate() : avgDataPerUser(1024), avgDataPerRequest(512),
                           dataGrowthRate(1.5), retentionYears(5) {}
    };
    
    struct BandwidthEstimate {
        long long avgResponseSize;     // bytes
        double readWriteRatio;
        double compressionRatio;
        
        BandwidthEstimate() : avgResponseSize(2048), readWriteRatio(10.0), 
                             compressionRatio(0.3) {}
    };
    
    TrafficEstimate traffic;
    StorageEstimate storage;
    BandwidthEstimate bandwidth;
    
public:
    void setTrafficEstimate(long long dau, long long mau, double requestsPerUser, 
                           double peakMult = 2.0, TrafficPattern pattern = TrafficPattern::UNIFORM) {
        traffic.dailyActiveUsers = dau;
        traffic.monthlyActiveUsers = mau;
        traffic.avgRequestsPerUser = requestsPerUser;
        traffic.peakMultiplier = peakMult;
        traffic.pattern = pattern;
    }
    
    void setStorageEstimate(long long dataPerUser, long long dataPerRequest, 
                           double growthRate = 1.5, int retention = 5) {
        storage.avgDataPerUser = dataPerUser;
        storage.avgDataPerRequest = dataPerRequest;
        storage.dataGrowthRate = growthRate;
        storage.retentionYears = retention;
    }
    
    void setBandwidthEstimate(long long responseSize, double rwRatio = 10.0, 
                             double compression = 0.3) {
        bandwidth.avgResponseSize = responseSize;
        bandwidth.readWriteRatio = rwRatio;
        bandwidth.compressionRatio = compression;
    }
    
    void calculateCapacity() {
        cout << "\n=== Capacity Estimation ===" << endl;
        
        // Traffic calculations
        calculateTrafficCapacity();
        
        // Storage calculations
        calculateStorageCapacity();
        
        // Bandwidth calculations
        calculateBandwidthCapacity();
        
        // Server calculations
        calculateServerCapacity();
        
        // Database calculations
        calculateDatabaseCapacity();
    }
    
private:
    void calculateTrafficCapacity() {
        cout << "\nTraffic Capacity:" << endl;
        
        long long dailyRequests = traffic.dailyActiveUsers * traffic.avgRequestsPerUser;
        long long requestsPerSecond = dailyRequests / (24 * 60 * 60);
        long long peakRequestsPerSecond = requestsPerSecond * traffic.peakMultiplier;
        
        cout << "  Daily Active Users: " << formatNumber(traffic.dailyActiveUsers) << endl;
        cout << "  Daily Requests: " << formatNumber(dailyRequests) << endl;
        cout << "  Average RPS: " << formatNumber(requestsPerSecond) << endl;
        cout << "  Peak RPS: " << formatNumber(peakRequestsPerSecond) << endl;
        
        // Read/Write split
        long long readRPS = peakRequestsPerSecond * bandwidth.readWriteRatio / (bandwidth.readWriteRatio + 1);
        long long writeRPS = peakRequestsPerSecond - readRPS;
        
        cout << "  Peak Read RPS: " << formatNumber(readRPS) << endl;
        cout << "  Peak Write RPS: " << formatNumber(writeRPS) << endl;
    }
    
    void calculateStorageCapacity() {
        cout << "\nStorage Capacity:" << endl;
        
        // User data storage
        long long userDataStorage = traffic.monthlyActiveUsers * storage.avgDataPerUser;
        
        // Request data storage (per year)
        long long dailyRequests = traffic.dailyActiveUsers * traffic.avgRequestsPerUser;
        long long yearlyRequestData = dailyRequests * 365 * storage.avgDataPerRequest;
        
        // Total storage with retention
        long long totalStorage = userDataStorage + (yearlyRequestData * storage.retentionYears);
        
        // With growth
        double totalWithGrowth = totalStorage * pow(storage.dataGrowthRate, storage.retentionYears);
        
        cout << "  User Data Storage: " << formatBytes(userDataStorage) << endl;
        cout << "  Yearly Request Data: " << formatBytes(yearlyRequestData) << endl;
        cout << "  Total Storage (5 years): " << formatBytes(totalStorage) << endl;
        cout << "  With Growth: " << formatBytes((long long)totalWithGrowth) << endl;
        
        // Database storage estimation
        long long dbStorage = totalStorage * 1.3; // 30% overhead for indexes, etc.
        cout << "  Database Storage (with overhead): " << formatBytes(dbStorage) << endl;
    }
    
    void calculateBandwidthCapacity() {
        cout << "\nBandwidth Capacity:" << endl;
        
        long long dailyRequests = traffic.dailyActiveUsers * traffic.avgRequestsPerUser;
        long long peakRequestsPerSecond = (dailyRequests / (24 * 60 * 60)) * traffic.peakMultiplier;
        
        // Outbound bandwidth (responses)
        long long outboundBps = peakRequestsPerSecond * bandwidth.avgResponseSize;
        long long compressedOutbound = outboundBps * bandwidth.compressionRatio;
        
        // Inbound bandwidth (requests) - typically much smaller
        long long inboundBps = peakRequestsPerSecond * 1024; // Assume 1KB average request
        
        cout << "  Peak Outbound: " << formatBandwidth(outboundBps) << endl;
        cout << "  Compressed Outbound: " << formatBandwidth(compressedOutbound) << endl;
        cout << "  Peak Inbound: " << formatBandwidth(inboundBps) << endl;
        cout << "  Total Bandwidth: " << formatBandwidth(compressedOutbound + inboundBps) << endl;
    }
    
    void calculateServerCapacity() {
        cout << "\nServer Capacity:" << endl;
        
        long long dailyRequests = traffic.dailyActiveUsers * traffic.avgRequestsPerUser;
        long long peakRequestsPerSecond = (dailyRequests / (24 * 60 * 60)) * traffic.peakMultiplier;
        
        // Assume each server can handle 1000 RPS
        int serversNeeded = ceil((double)peakRequestsPerSecond / 1000);
        
        // Add redundancy (3x for high availability)
        int totalServers = serversNeeded * 3;
        
        cout << "  Peak RPS: " << formatNumber(peakRequestsPerSecond) << endl;
        cout << "  Servers needed (1000 RPS each): " << serversNeeded << endl;
        cout << "  With redundancy (3x): " << totalServers << endl;
        
        // Load balancer calculation
        int loadBalancers = max(2, totalServers / 50); // 1 LB per 50 servers, min 2
        cout << "  Load Balancers needed: " << loadBalancers << endl;
    }
    
    void calculateDatabaseCapacity() {
        cout << "\nDatabase Capacity:" << endl;
        
        long long dailyRequests = traffic.dailyActiveUsers * traffic.avgRequestsPerUser;
        long long peakRequestsPerSecond = (dailyRequests / (24 * 60 * 60)) * traffic.peakMultiplier;
        
        // Read/Write split
        long long readRPS = peakRequestsPerSecond * bandwidth.readWriteRatio / (bandwidth.readWriteRatio + 1);
        long long writeRPS = peakRequestsPerSecond - readRPS;
        
        // Database server calculations (assume 5000 read RPS, 1000 write RPS per server)
        int readReplicas = ceil((double)readRPS / 5000);
        int writeServers = ceil((double)writeRPS / 1000);
        
        cout << "  Read RPS: " << formatNumber(readRPS) << endl;
        cout << "  Write RPS: " << formatNumber(writeRPS) << endl;
        cout << "  Read Replicas needed: " << readReplicas << endl;
        cout << "  Write Servers needed: " << writeServers << endl;
        cout << "  Total DB Servers: " << (readReplicas + writeServers) << endl;
        
        // Cache calculation
        long long cacheSize = traffic.dailyActiveUsers * 1024; // 1KB per active user
        cout << "  Cache Size needed: " << formatBytes(cacheSize) << endl;
    }
    
    string formatNumber(long long num) {
        if (num >= 1000000000) {
            return to_string(num / 1000000000) + "B";
        } else if (num >= 1000000) {
            return to_string(num / 1000000) + "M";
        } else if (num >= 1000) {
            return to_string(num / 1000) + "K";
        }
        return to_string(num);
    }
    
    string formatBytes(long long bytes) {
        const char* units[] = {"B", "KB", "MB", "GB", "TB", "PB"};
        int unit = 0;
        double size = bytes;
        
        while (size >= 1024 && unit < 5) {
            size /= 1024;
            unit++;
        }
        
        return to_string((int)size) + " " + units[unit];
    }
    
    string formatBandwidth(long long bps) {
        const char* units[] = {"bps", "Kbps", "Mbps", "Gbps", "Tbps"};
        int unit = 0;
        double bandwidth = bps * 8; // Convert bytes to bits
        
        while (bandwidth >= 1000 && unit < 4) {
            bandwidth /= 1000;
            unit++;
        }
        
        return to_string((int)bandwidth) + " " + units[unit];
    }
};

// Scaling Strategy
class ScalingStrategy {
private:
    struct ScalingMetrics {
        double cpuThreshold;
        double memoryThreshold;
        double responseTimeThreshold; // ms
        double errorRateThreshold;    // percentage
        
        ScalingMetrics() : cpuThreshold(70.0), memoryThreshold(80.0),
                          responseTimeThreshold(200.0), errorRateThreshold(1.0) {}
    };
    
    ScalingMetrics metrics;
    
public:
    void setScalingThresholds(double cpu, double memory, double responseTime, double errorRate) {
        metrics.cpuThreshold = cpu;
        metrics.memoryThreshold = memory;
        metrics.responseTimeThreshold = responseTime;
        metrics.errorRateThreshold = errorRate;
    }
    
    void designScalingStrategy() {
        cout << "\n=== Scaling Strategy ===" << endl;
        
        cout << "\nHorizontal Scaling (Scale Out):" << endl;
        cout << "  - Add more servers when CPU > " << metrics.cpuThreshold << "%" << endl;
        cout << "  - Use auto-scaling groups with min/max limits" << endl;
        cout << "  - Implement health checks for automatic replacement" << endl;
        cout << "  - Use container orchestration (Kubernetes)" << endl;
        
        cout << "\nVertical Scaling (Scale Up):" << endl;
        cout << "  - Increase server resources for databases" << endl;
        cout << "  - Use for stateful services that can't be easily sharded" << endl;
        cout << "  - Consider memory-intensive applications" << endl;
        
        cout << "\nDatabase Scaling:" << endl;
        cout << "  - Read Replicas: Scale read operations" << endl;
        cout << "  - Sharding: Distribute data across multiple databases" << endl;
        cout << "  - Caching: Reduce database load with Redis/Memcached" << endl;
        cout << "  - Connection Pooling: Optimize database connections" << endl;
        
        cout << "\nContent Delivery:" << endl;
        cout << "  - CDN for static content and media files" << endl;
        cout << "  - Edge caching for frequently accessed data" << endl;
        cout << "  - Geographic distribution of servers" << endl;
        
        cout << "\nScaling Triggers:" << endl;
        cout << "  - CPU Usage > " << metrics.cpuThreshold << "%" << endl;
        cout << "  - Memory Usage > " << metrics.memoryThreshold << "%" << endl;
        cout << "  - Response Time > " << metrics.responseTimeThreshold << "ms" << endl;
        cout << "  - Error Rate > " << metrics.errorRateThreshold << "%" << endl;
    }
};
```

---

## 🏗️ HIGH-LEVEL ARCHITECTURE DESIGN

### What is High-Level Architecture?
**Real-World Analogy**: Like designing a city's master plan - you define major districts (services), transportation networks (APIs), utilities (databases), and how they all connect before worrying about individual building details.

```cpp
// High-Level Architecture Design Framework

// Component Types
enum class ComponentType {
    WEB_SERVER,
    APPLICATION_SERVER,
    DATABASE,
    CACHE,
    LOAD_BALANCER,
    MESSAGE_QUEUE,
    CDN,
    API_GATEWAY,
    MICROSERVICE
};

// Architecture Component
class ArchitectureComponent {
private:
    string id;
    string name;
    ComponentType type;
    vector<string> responsibilities;
    map<string, string> technologies;
    vector<string> connections;
    map<string, string> configurations;
    
public:
    ArchitectureComponent(const string& componentId, const string& componentName, ComponentType componentType)
        : id(componentId), name(componentName), type(componentType) {}
    
    void addResponsibility(const string& responsibility) {
        responsibilities.push_back(responsibility);
    }
    
    void setTechnology(const string& aspect, const string& technology) {
        technologies[aspect] = technology;
    }
    
    void addConnection(const string& targetComponentId) {
        connections.push_back(targetComponentId);
    }
    
    void setConfiguration(const string& key, const string& value) {
        configurations[key] = value;
    }
    
    // Getters
    string getId() const { return id; }
    string getName() const { return name; }
    ComponentType getType() const { return type; }
    vector<string> getConnections() const { return connections; }
    
    string getTypeString() const {
        switch (type) {
            case ComponentType::WEB_SERVER: return "Web Server";
            case ComponentType::APPLICATION_SERVER: return "Application Server";
            case ComponentType::DATABASE: return "Database";
            case ComponentType::CACHE: return "Cache";
            case ComponentType::LOAD_BALANCER: return "Load Balancer";
            case ComponentType::MESSAGE_QUEUE: return "Message Queue";
            case ComponentType::CDN: return "CDN";
            case ComponentType::API_GATEWAY: return "API Gateway";
            case ComponentType::MICROSERVICE: return "Microservice";
            default: return "Unknown";
        }
    }
    
    void display() const {
        cout << "\nComponent: " << name << " (" << id << ")" << endl;
        cout << "  Type: " << getTypeString() << endl;
        
        if (!responsibilities.empty()) {
            cout << "  Responsibilities:" << endl;
            for (const auto& resp : responsibilities) {
                cout << "    - " << resp << endl;
            }
        }
        
        if (!technologies.empty()) {
            cout << "  Technologies:" << endl;
            for (const auto& tech : technologies) {
                cout << "    " << tech.first << ": " << tech.second << endl;
            }
        }
        
        if (!connections.empty()) {
            cout << "  Connects to: ";
            for (size_t i = 0; i < connections.size(); i++) {
                cout << connections[i];
                if (i < connections.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        
        if (!configurations.empty()) {
            cout << "  Configuration:" << endl;
            for (const auto& config : configurations) {
                cout << "    " << config.first << ": " << config.second << endl;
            }
        }
    }
};

// System Architecture
class SystemArchitecture {
private:
    string systemName;
    vector<unique_ptr<ArchitectureComponent>> components;
    map<string, vector<string>> dataFlow;
    vector<string> designDecisions;
    map<string, string> tradeOffs;
    
public:
    SystemArchitecture(const string& name) : systemName(name) {}
    
    void addComponent(unique_ptr<ArchitectureComponent> component) {
        components.push_back(move(component));
    }
    
    void addDataFlow(const string& from, const string& to) {
        dataFlow[from].push_back(to);
    }
    
    void addDesignDecision(const string& decision) {
        designDecisions.push_back(decision);
    }
    
    void addTradeOff(const string& decision, const string& tradeOff) {
        tradeOffs[decision] = tradeOff;
    }
    
    void displayArchitecture() const {
        cout << "\n" << string(60, '=') << endl;
        cout << "SYSTEM ARCHITECTURE: " << systemName << endl;
        cout << string(60, '=') << endl;
        
        // Display components
        cout << "\nSystem Components:" << endl;
        for (const auto& component : components) {
            component->display();
        }
        
        // Display data flow
        if (!dataFlow.empty()) {
            cout << "\nData Flow:" << endl;
            for (const auto& flow : dataFlow) {
                cout << "  " << flow.first << " -> ";
                for (size_t i = 0; i < flow.second.size(); i++) {
                    cout << flow.second[i];
                    if (i < flow.second.size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
        
        // Display design decisions
        if (!designDecisions.empty()) {
            cout << "\nKey Design Decisions:" << endl;
            for (size_t i = 0; i < designDecisions.size(); i++) {
                cout << (i + 1) << ". " << designDecisions[i] << endl;
            }
        }
        
        // Display trade-offs
        if (!tradeOffs.empty()) {
            cout << "\nTrade-offs:" << endl;
            for (const auto& tradeOff : tradeOffs) {
                cout << "  " << tradeOff.first << " -> " << tradeOff.second << endl;
            }
        }
    }
    
    ArchitectureComponent* getComponent(const string& id) {
        for (const auto& component : components) {
            if (component->getId() == id) {
                return component.get();
            }
        }
        return nullptr;
    }
    
    void generateArchitectureDiagram() const {
        cout << "\n=== Architecture Diagram (ASCII) ===" << endl;
        cout << "┌─────────────┐    ┌─────────────┐    ┌─────────────┐" << endl;
        cout << "│    Users    │───▶│Load Balancer│───▶│ Web Servers │" << endl;
        cout << "└─────────────┘    └─────────────┘    └─────────────┘" << endl;
        cout << "                                             │" << endl;
        cout << "                                             ▼" << endl;
        cout << "┌─────────────┐    ┌─────────────┐    ┌─────────────┐" << endl;
        cout << "│    Cache    │◀───│ App Servers │───▶│  Database   │" << endl;
        cout << "└─────────────┘    └─────────────┘    └─────────────┘" << endl;
        cout << "                           │" << endl;
        cout << "                           ▼" << endl;
        cout << "                  ┌─────────────┐" << endl;
        cout << "                  │Message Queue│" << endl;
        cout << "                  └─────────────┘" << endl;
    }
};

// Architecture Patterns
class ArchitecturePatterns {
public:
    static unique_ptr<SystemArchitecture> createMicroservicesArchitecture() {
        auto architecture = make_unique<SystemArchitecture>("Microservices Architecture");
        
        // API Gateway
        auto apiGateway = make_unique<ArchitectureComponent>("api-gateway", "API Gateway", ComponentType::API_GATEWAY);
        apiGateway->addResponsibility("Route requests to appropriate microservices");
        apiGateway->addResponsibility("Handle authentication and authorization");
        apiGateway->addResponsibility("Rate limiting and throttling");
        apiGateway->setTechnology("Implementation", "Kong/AWS API Gateway");
        architecture->addComponent(move(apiGateway));
        
        // User Service
        auto userService = make_unique<ArchitectureComponent>("user-service", "User Service", ComponentType::MICROSERVICE);
        userService->addResponsibility("User registration and authentication");
        userService->addResponsibility("User profile management");
        userService->setTechnology("Framework", "Spring Boot/Node.js");
        userService->setTechnology("Database", "PostgreSQL");
        architecture->addComponent(move(userService));
        
        // Order Service
        auto orderService = make_unique<ArchitectureComponent>("order-service", "Order Service", ComponentType::MICROSERVICE);
        orderService->addResponsibility("Order creation and management");
        orderService->addResponsibility("Order status tracking");
        orderService->setTechnology("Framework", "Spring Boot");
        orderService->setTechnology("Database", "MySQL");
        architecture->addComponent(move(orderService));
        
        // Payment Service
        auto paymentService = make_unique<ArchitectureComponent>("payment-service", "Payment Service", ComponentType::MICROSERVICE);
        paymentService->addResponsibility("Payment processing");
        paymentService->addResponsibility("Payment history");
        paymentService->setTechnology("Framework", "Node.js");
        paymentService->setTechnology("Database", "PostgreSQL");
        architecture->addComponent(move(paymentService));
        
        // Message Queue
        auto messageQueue = make_unique<ArchitectureComponent>("message-queue", "Message Queue", ComponentType::MESSAGE_QUEUE);
        messageQueue->addResponsibility("Asynchronous communication between services");
        messageQueue->addResponsibility("Event-driven architecture support");
        messageQueue->setTechnology("Implementation", "Apache Kafka/RabbitMQ");
        architecture->addComponent(move(messageQueue));
        
        // Data flows
        architecture->addDataFlow("api-gateway", "user-service");
        architecture->addDataFlow("api-gateway", "order-service");
        architecture->addDataFlow("api-gateway", "payment-service");
        architecture->addDataFlow("order-service", "message-queue");
        architecture->addDataFlow("payment-service", "message-queue");
        
        // Design decisions
        architecture->addDesignDecision("Use microservices for better scalability and team autonomy");
        architecture->addDesignDecision("Implement API Gateway for centralized routing and security");
        architecture->addDesignDecision("Use message queues for loose coupling between services");
        architecture->addDesignDecision("Database per service for data isolation");
        
        // Trade-offs
        architecture->addTradeOff("Microservices complexity", "Better scalability and maintainability");
        architecture->addTradeOff("Network latency", "Service independence");
        architecture->addTradeOff("Distributed system challenges", "Team autonomy and technology diversity");
        
        return architecture;
    }
    
    static unique_ptr<SystemArchitecture> createMonolithicArchitecture() {
        auto architecture = make_unique<SystemArchitecture>("Monolithic Architecture");
        
        // Load Balancer
        auto loadBalancer = make_unique<ArchitectureComponent>("load-balancer", "Load Balancer", ComponentType::LOAD_BALANCER);
        loadBalancer->addResponsibility("Distribute incoming requests");
        loadBalancer->addResponsibility("Health checking");
        loadBalancer->setTechnology("Implementation", "Nginx/HAProxy");
        architecture->addComponent(move(loadBalancer));
        
        // Application Servers
        auto appServer = make_unique<ArchitectureComponent>("app-servers", "Application Servers", ComponentType::APPLICATION_SERVER);
        appServer->addResponsibility("Handle all business logic");
        appServer->addResponsibility("User management, orders, payments");
        appServer->addResponsibility("Session management");
        appServer->setTechnology("Framework", "Spring Boot/Django");
        appServer->setConfiguration("Instances", "3-5 servers");
        architecture->addComponent(move(appServer));
        
        // Database
        auto database = make_unique<ArchitectureComponent>("database", "Primary Database", ComponentType::DATABASE);
        database->addResponsibility("Store all application data");
        database->addResponsibility("ACID transactions");
        database->setTechnology("Type", "PostgreSQL/MySQL");
        database->setConfiguration("Setup", "Master-Slave replication");
        architecture->addComponent(move(database));
        
        // Cache
        auto cache = make_unique<ArchitectureComponent>("cache", "Cache Layer", ComponentType::CACHE);
        cache->addResponsibility("Cache frequently accessed data");
        cache->addResponsibility("Session storage");
        cache->setTechnology("Implementation", "Redis/Memcached");
        architecture->addComponent(move(cache));
        
        // Data flows
        architecture->addDataFlow("load-balancer", "app-servers");
        architecture->addDataFlow("app-servers", "database");
        architecture->addDataFlow("app-servers", "cache");
        
        // Design decisions
        architecture->addDesignDecision("Single deployable unit for simplicity");
        architecture->addDesignDecision("Shared database for ACID transactions");
        architecture->addDesignDecision("Horizontal scaling through load balancing");
        
        // Trade-offs
        architecture->addTradeOff("Single point of failure", "Simpler deployment and testing");
        architecture->addTradeOff("Technology lock-in", "Easier development and debugging");
        architecture->addTradeOff("Scaling limitations", "Lower operational complexity");
        
        return architecture;
    }
};
```

---

## 🔧 DETAILED COMPONENT DESIGN

### What is Component Design?
**Real-World Analogy**: Like designing the internal layout of a hospital - after planning the overall building, you design each department (emergency, surgery, pharmacy) with specific workflows, equipment, and staff requirements.

```cpp
// Detailed Component Design Framework

// API Design
class APIDesign {
private:
    struct Endpoint {
        string path;
        string method;
        string description;
        map<string, string> parameters;
        map<string, string> responses;
        vector<string> examples;
        
        Endpoint(const string& p, const string& m, const string& desc)
            : path(p), method(m), description(desc) {}
    };
    
    string serviceName;
    vector<unique_ptr<Endpoint>> endpoints;
    map<string, string> commonHeaders;
    string baseURL;
    
public:
    APIDesign(const string& service) : serviceName(service) {}
    
    void setBaseURL(const string& url) {
        baseURL = url;
    }
    
    void addCommonHeader(const string& header, const string& description) {
        commonHeaders[header] = description;
    }
    
    void addEndpoint(const string& path, const string& method, const string& description) {
        endpoints.push_back(make_unique<Endpoint>(path, method, description));
    }
    
    void addParameter(const string& path, const string& paramName, const string& paramDesc) {
        for (auto& endpoint : endpoints) {
            if (endpoint->path == path) {
                endpoint->parameters[paramName] = paramDesc;
                break;
            }
        }
    }
    
    void addResponse(const string& path, const string& statusCode, const string& description) {
        for (auto& endpoint : endpoints) {
            if (endpoint->path == path) {
                endpoint->responses[statusCode] = description;
                break;
            }
        }
    }
    
    void displayAPIDesign() const {
        cout << "\n=== API Design: " << serviceName << " ===" << endl;
        cout << "Base URL: " << baseURL << endl;
        
        if (!commonHeaders.empty()) {
            cout << "\nCommon Headers:" << endl;
            for (const auto& header : commonHeaders) {
                cout << "  " << header.first << ": " << header.second << endl;
            }
        }
        
        cout << "\nEndpoints:" << endl;
        for (const auto& endpoint : endpoints) {
            cout << "\n" << endpoint->method << " " << endpoint->path << endl;
            cout << "  Description: " << endpoint->description << endl;
            
            if (!endpoint->parameters.empty()) {
                cout << "  Parameters:" << endl;
                for (const auto& param : endpoint->parameters) {
                    cout << "    " << param.first << ": " << param.second << endl;
                }
            }
            
            if (!endpoint->responses.empty()) {
                cout << "  Responses:" << endl;
                for (const auto& response : endpoint->responses) {
                    cout << "    " << response.first << ": " << response.second << endl;
                }
            }
        }
    }
};

// Database Schema Design
class DatabaseSchema {
private:
    struct Table {
        string name;
        map<string, string> columns; // column_name -> data_type
        vector<string> primaryKeys;
        map<string, string> foreignKeys; // column -> referenced_table.column
        vector<string> indexes;
        
        Table(const string& tableName) : name(tableName) {}
    };
    
    string databaseName;
    vector<unique_ptr<Table>> tables;
    map<string, string> relationships;
    
public:
    DatabaseSchema(const string& dbName) : databaseName(dbName) {}
    
    void addTable(const string& tableName) {
        tables.push_back(make_unique<Table>(tableName));
    }
    
    void addColumn(const string& tableName, const string& columnName, const string& dataType) {
        for (auto& table : tables) {
            if (table->name == tableName) {
                table->columns[columnName] = dataType;
                break;
            }
        }
    }
    
    void addPrimaryKey(const string& tableName, const string& columnName) {
        for (auto& table : tables) {
            if (table->name == tableName) {
                table->primaryKeys.push_back(columnName);
                break;
            }
        }
    }
    
    void addForeignKey(const string& tableName, const string& columnName, const string& reference) {
        for (auto& table : tables) {
            if (table->name == tableName) {
                table->foreignKeys[columnName] = reference;
                break;
            }
        }
    }
    
    void addIndex(const string& tableName, const string& indexName) {
        for (auto& table : tables) {
            if (table->name == tableName) {
                table->indexes.push_back(indexName);
                break;
            }
        }
    }
    
    void addRelationship(const string& table1, const string& table2) {
        relationships[table1] = table2;
    }
    
    void displaySchema() const {
        cout << "\n=== Database Schema: " << databaseName << " ===" << endl;
        
        for (const auto& table : tables) {
            cout << "\nTable: " << table->name << endl;
            
            cout << "  Columns:" << endl;
            for (const auto& column : table->columns) {
                cout << "    " << column.first << " " << column.second;
                
                // Mark primary keys
                if (find(table->primaryKeys.begin(), table->primaryKeys.end(), column.first) != table->primaryKeys.end()) {
                    cout << " [PK]";
                }
                
                // Mark foreign keys
                auto fkIt = table->foreignKeys.find(column.first);
                if (fkIt != table->foreignKeys.end()) {
                    cout << " [FK -> " << fkIt->second << "]";
                }
                
                cout << endl;
            }
            
            if (!table->indexes.empty()) {
                cout << "  Indexes: ";
                for (size_t i = 0; i < table->indexes.size(); i++) {
                    cout << table->indexes[i];
                    if (i < table->indexes.size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
        
        if (!relationships.empty()) {
            cout << "\nRelationships:" << endl;
            for (const auto& rel : relationships) {
                cout << "  " << rel.first << " -> " << rel.second << endl;
            }
        }
    }
};

// Caching Strategy Design
class CachingStrategy {
private:
    struct CacheLayer {
        string name;
        string type; // "in-memory", "distributed", "browser"
        string technology;
        int ttl; // time to live in seconds
        vector<string> dataTypes;
        string evictionPolicy;
        
        CacheLayer(const string& cacheName, const string& cacheType, const string& tech, int timeToLive)
            : name(cacheName), type(cacheType), technology(tech), ttl(timeToLive) {}
    };
    
    vector<unique_ptr<CacheLayer>> cacheLayers;
    map<string, string> cachePatterns;
    
public:
    void addCacheLayer(const string& name, const string& type, const string& technology, int ttl) {
        cacheLayers.push_back(make_unique<CacheLayer>(name, type, technology, ttl));
    }
    
    void addDataType(const string& layerName, const string& dataType) {
        for (auto& layer : cacheLayers) {
            if (layer->name == layerName) {
                layer->dataTypes.push_back(dataType);
                break;
            }
        }
    }
    
    void setEvictionPolicy(const string& layerName, const string& policy) {
        for (auto& layer : cacheLayers) {
            if (layer->name == layerName) {
                layer->evictionPolicy = policy;
                break;
            }
        }
    }
    
    void addCachePattern(const string& pattern, const string& description) {
        cachePatterns[pattern] = description;
    }
    
    void displayCachingStrategy() const {
        cout << "\n=== Caching Strategy ===" << endl;
        
        cout << "\nCache Layers:" << endl;
        for (const auto& layer : cacheLayers) {
            cout << "\n" << layer->name << " (" << layer->type << ")" << endl;
            cout << "  Technology: " << layer->technology << endl;
            cout << "  TTL: " << layer->ttl << " seconds" << endl;
            cout << "  Eviction Policy: " << layer->evictionPolicy << endl;
            
            if (!layer->dataTypes.empty()) {
                cout << "  Data Types: ";
                for (size_t i = 0; i < layer->dataTypes.size(); i++) {
                    cout << layer->dataTypes[i];
                    if (i < layer->dataTypes.size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
        
        if (!cachePatterns.empty()) {
            cout << "\nCaching Patterns:" << endl;
            for (const auto& pattern : cachePatterns) {
                cout << "  " << pattern.first << ": " << pattern.second << endl;
            }
        }
    }
};

// Component Design Factory
class ComponentDesignFactory {
public:
    static unique_ptr<APIDesign> createUserServiceAPI() {
        auto api = make_unique<APIDesign>("User Service");
        api->setBaseURL("https://api.example.com/v1/users");
        
        api->addCommonHeader("Authorization", "Bearer token for authentication");
        api->addCommonHeader("Content-Type", "application/json");
        
        // User registration
        api->addEndpoint("/register", "POST", "Register a new user");
        api->addParameter("/register", "email", "User's email address");
        api->addParameter("/register", "password", "User's password");
        api->addParameter("/register", "name", "User's full name");
        api->addResponse("/register", "201", "User created successfully");
        api->addResponse("/register", "400", "Invalid input data");
        api->addResponse("/register", "409", "Email already exists");
        
        // User login
        api->addEndpoint("/login", "POST", "Authenticate user");
        api->addParameter("/login", "email", "User's email");
        api->addParameter("/login", "password", "User's password");
        api->addResponse("/login", "200", "Login successful with JWT token");
        api->addResponse("/login", "401", "Invalid credentials");
        
        // Get user profile
        api->addEndpoint("/{userId}", "GET", "Get user profile");
        api->addParameter("/{userId}", "userId", "Unique user identifier");
        api->addResponse("/{userId}", "200", "User profile data");
        api->addResponse("/{userId}", "404", "User not found");
        
        return api;
    }
    
    static unique_ptr<DatabaseSchema> createECommerceSchema() {
        auto schema = make_unique<DatabaseSchema>("ecommerce_db");
        
        // Users table
        schema->addTable("users");
        schema->addColumn("users", "id", "BIGINT AUTO_INCREMENT");
        schema->addColumn("users", "email", "VARCHAR(255) UNIQUE NOT NULL");
        schema->addColumn("users", "password_hash", "VARCHAR(255) NOT NULL");
        schema->addColumn("users", "name", "VARCHAR(255) NOT NULL");
        schema->addColumn("users", "created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        schema->addPrimaryKey("users", "id");
        schema->addIndex("users", "idx_email");
        
        // Products table
        schema->addTable("products");
        schema->addColumn("products", "id", "BIGINT AUTO_INCREMENT");
        schema->addColumn("products", "name", "VARCHAR(255) NOT NULL");
        schema->addColumn("products", "description", "TEXT");
        schema->addColumn("products", "price", "DECIMAL(10,2) NOT NULL");
        schema->addColumn("products", "stock_quantity", "INT NOT NULL");
        schema->addColumn("products", "category_id", "BIGINT");
        schema->addPrimaryKey("products", "id");
        schema->addForeignKey("products", "category_id", "categories.id");
        schema->addIndex("products", "idx_category");
        
        // Orders table
        schema->addTable("orders");
        schema->addColumn("orders", "id", "BIGINT AUTO_INCREMENT");
        schema->addColumn("orders", "user_id", "BIGINT NOT NULL");
        schema->addColumn("orders", "total_amount", "DECIMAL(10,2) NOT NULL");
        schema->addColumn("orders", "status", "ENUM('pending','confirmed','shipped','delivered') DEFAULT 'pending'");
        schema->addColumn("orders", "created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        schema->addPrimaryKey("orders", "id");
        schema->addForeignKey("orders", "user_id", "users.id");
        schema->addIndex("orders", "idx_user_id");
        schema->addIndex("orders", "idx_status");
        
        // Relationships
        schema->addRelationship("users", "orders");
        schema->addRelationship("products", "order_items");
        schema->addRelationship("orders", "order_items");
        
        return schema;
    }
    
    static unique_ptr<CachingStrategy> createMultiLayerCaching() {
        auto strategy = make_unique<CachingStrategy>();
        
        // Browser cache
        strategy->addCacheLayer("Browser Cache", "browser", "HTTP Headers", 3600);
        strategy->addDataType("Browser Cache", "Static assets (CSS, JS, images)");
        strategy->setEvictionPolicy("Browser Cache", "TTL-based");
        
        // CDN cache
        strategy->addCacheLayer("CDN Cache", "distributed", "CloudFlare/AWS CloudFront", 86400);
        strategy->addDataType("CDN Cache", "Static content");
        strategy->addDataType("CDN Cache", "API responses");
        strategy->setEvictionPolicy("CDN Cache", "LRU with TTL");
        
        // Application cache
        strategy->addCacheLayer("Application Cache", "in-memory", "Redis", 1800);
        strategy->addDataType("Application Cache", "User sessions");
        strategy->addDataType("Application Cache", "Frequently accessed data");
        strategy->setEvictionPolicy("Application Cache", "LRU");
        
        // Database query cache
        strategy->addCacheLayer("Query Cache", "in-memory", "Redis", 300);
        strategy->addDataType("Query Cache", "Database query results");
        strategy->setEvictionPolicy("Query Cache", "TTL with manual invalidation");
        
        // Cache patterns
        strategy->addCachePattern("Cache-Aside", "Application manages cache explicitly");
        strategy->addCachePattern("Write-Through", "Write to cache and database simultaneously");
        strategy->addCachePattern("Write-Behind", "Write to cache immediately, database asynchronously");
        
        return strategy;
    }
};
```

---

## 🚨 RELIABILITY AND FAILURE HANDLING

### What is System Reliability?
**Real-World Analogy**: Like designing a hospital's emergency protocols - you need backup power, redundant systems, evacuation plans, and trained staff to handle any crisis while maintaining patient care.

```cpp
// Reliability and Failure Handling Framework

// Failure Types
enum class FailureType {
    HARDWARE_FAILURE,
    SOFTWARE_BUG,
    NETWORK_PARTITION,
    OVERLOAD,
    DATA_CORRUPTION,
    SECURITY_BREACH,
    HUMAN_ERROR
};

// Reliability Pattern
class ReliabilityPattern {
private:
    string name;
    string description;
    FailureType targetFailure;
    vector<string> implementations;
    map<string, string> tradeOffs;
    
public:
    ReliabilityPattern(const string& patternName, const string& desc, FailureType failure)
        : name(patternName), description(desc), targetFailure(failure) {}
    
    void addImplementation(const string& implementation) {
        implementations.push_back(implementation);
    }
    
    void addTradeOff(const string& benefit, const string& cost) {
        tradeOffs[benefit] = cost;
    }
    
    void display() const {
        cout << "\nReliability Pattern: " << name << endl;
        cout << "  Description: " << description << endl;
        cout << "  Target Failure: " << getFailureTypeString(targetFailure) << endl;
        
        if (!implementations.empty()) {
            cout << "  Implementations:" << endl;
            for (const auto& impl : implementations) {
                cout << "    - " << impl << endl;
            }
        }
        
        if (!tradeOffs.empty()) {
            cout << "  Trade-offs:" << endl;
            for (const auto& tradeOff : tradeOffs) {
                cout << "    " << tradeOff.first << " vs " << tradeOff.second << endl;
            }
        }
    }
    
    private:
    string getFailureTypeString(FailureType failure) const {
        switch (failure) {
            case FailureType::HARDWARE_FAILURE: return "Hardware Failure";
            case FailureType::SOFTWARE_BUG: return "Software Bug";
            case FailureType::NETWORK_PARTITION: return "Network Partition";
            case FailureType::OVERLOAD: return "System Overload";
            case FailureType::DATA_CORRUPTION: return "Data Corruption";
            case FailureType::SECURITY_BREACH: return "Security Breach";
            case FailureType::HUMAN_ERROR: return "Human Error";
            default: return "Unknown";
        }
    }
};

// Reliability Strategy
class ReliabilityStrategy {
private:
    vector<unique_ptr<ReliabilityPattern>> patterns;
    map<string, string> slaRequirements;
    
public:
    void addPattern(unique_ptr<ReliabilityPattern> pattern) {
        patterns.push_back(move(pattern));
    }
    
    void setSLARequirement(const string& metric, const string& target) {
        slaRequirements[metric] = target;
    }
    
    void displayReliabilityStrategy() const {
        cout << "\n=== Reliability Strategy ===" << endl;
        
        if (!slaRequirements.empty()) {
            cout << "\nSLA Requirements:" << endl;
            for (const auto& sla : slaRequirements) {
                cout << "  " << sla.first << ": " << sla.second << endl;
            }
        }
        
        cout << "\nReliability Patterns:" << endl;
        for (const auto& pattern : patterns) {
            pattern->display();
        }
    }
};

// Common Reliability Patterns
class ReliabilityPatterns {
public:
    static unique_ptr<ReliabilityPattern> createCircuitBreakerPattern() {
        auto pattern = make_unique<ReliabilityPattern>(
            "Circuit Breaker",
            "Prevent cascading failures by stopping calls to failing services",
            FailureType::SOFTWARE_BUG
        );
        
        pattern->addImplementation("Monitor failure rate and response time");
        pattern->addImplementation("Open circuit when thresholds exceeded");
        pattern->addImplementation("Allow periodic test calls to check recovery");
        pattern->addImplementation("Close circuit when service recovers");
        
        pattern->addTradeOff("Prevents cascading failures", "Temporary service unavailability");
        pattern->addTradeOff("Fast failure detection", "Additional complexity");
        
        return pattern;
    }
    
    static unique_ptr<ReliabilityPattern> createRetryPattern() {
        auto pattern = make_unique<ReliabilityPattern>(
            "Retry with Exponential Backoff",
            "Automatically retry failed operations with increasing delays",
            FailureType::NETWORK_PARTITION
        );
        
        pattern->addImplementation("Implement exponential backoff algorithm");
        pattern->addImplementation("Add jitter to prevent thundering herd");
        pattern->addImplementation("Set maximum retry attempts");
        pattern->addImplementation("Use idempotent operations only");
        
        pattern->addTradeOff("Handles transient failures", "Increased latency");
        pattern->addTradeOff("Automatic recovery", "Potential resource waste");
        
        return pattern;
    }
    
    static unique_ptr<ReliabilityPattern> createBulkheadPattern() {
        auto pattern = make_unique<ReliabilityPattern>(
            "Bulkhead Isolation",
            "Isolate critical resources to prevent total system failure",
            FailureType::OVERLOAD
        );
        
        pattern->addImplementation("Separate thread pools for different operations");
        pattern->addImplementation("Isolate database connections");
        pattern->addImplementation("Use separate service instances");
        pattern->addImplementation("Implement resource quotas");
        
        pattern->addTradeOff("Fault isolation", "Resource overhead");
        pattern->addTradeOff("Prevents total failure", "Reduced resource efficiency");
        
        return pattern;
    }
    
    static unique_ptr<ReliabilityPattern> createRedundancyPattern() {
        auto pattern = make_unique<ReliabilityPattern>(
            "Redundancy and Replication",
            "Maintain multiple copies of critical components",
            FailureType::HARDWARE_FAILURE
        );
        
        pattern->addImplementation("Deploy across multiple availability zones");
        pattern->addImplementation("Implement database replication");
        pattern->addImplementation("Use load balancers with health checks");
        pattern->addImplementation("Maintain hot standby systems");
        
        pattern->addTradeOff("High availability", "Increased cost");
        pattern->addTradeOff("Fault tolerance", "Complexity in consistency");
        
        return pattern;
    }
};

// Interview Simulation Framework
class InterviewSimulation {
private:
    unique_ptr<InterviewQuestion> currentQuestion;
    CapacityCalculator capacityCalculator;
    unique_ptr<SystemArchitecture> architecture;
    ReliabilityStrategy reliabilityStrategy;
    
public:
    void startInterview(unique_ptr<InterviewQuestion> question) {
        currentQuestion = move(question);
        
        cout << "\n" << string(80, '=') << endl;
        cout << "SYSTEM DESIGN INTERVIEW SIMULATION" << endl;
        cout << string(80, '=') << endl;
        
        // Step 1: Problem Understanding
        currentQuestion->displayProblemStatement();
        
        // Step 2: Requirements Analysis
        currentQuestion->analyzeRequirements();
        
        // Step 3: Capacity Estimation
        performCapacityEstimation();
        
        // Step 4: High-Level Design
        designHighLevelArchitecture();
        
        // Step 5: Detailed Design
        designDetailedComponents();
        
        // Step 6: Reliability and Failure Handling
        designReliabilityStrategy();
        
        // Step 7: Summary and Trade-offs
        provideSummary();
    }
    
private:
    void performCapacityEstimation() {
        cout << "\n" << string(60, '-') << endl;
        cout << "STEP 3: CAPACITY ESTIMATION" << endl;
        cout << string(60, '-') << endl;
        
        // Example estimation for URL shortener
        capacityCalculator.setTrafficEstimate(100000000, 300000000, 10, 3.0);
        capacityCalculator.setStorageEstimate(1024, 200, 1.2, 5);
        capacityCalculator.setBandwidthEstimate(1024, 100.0, 0.3);
        
        capacityCalculator.calculateCapacity();
        
        ScalingStrategy scalingStrategy;
        scalingStrategy.designScalingStrategy();
    }
    
    void designHighLevelArchitecture() {
        cout << "\n" << string(60, '-') << endl;
        cout << "STEP 4: HIGH-LEVEL ARCHITECTURE" << endl;
        cout << string(60, '-') << endl;
        
        // Create a sample architecture
        architecture = ArchitecturePatterns::createMicroservicesArchitecture();
        architecture->displayArchitecture();
        architecture->generateArchitectureDiagram();
    }
    
    void designDetailedComponents() {
        cout << "\n" << string(60, '-') << endl;
        cout << "STEP 5: DETAILED COMPONENT DESIGN" << endl;
        cout << string(60, '-') << endl;
        
        // API Design
        auto apiDesign = ComponentDesignFactory::createUserServiceAPI();
        apiDesign->displayAPIDesign();
        
        // Database Schema
        auto dbSchema = ComponentDesignFactory::createECommerceSchema();
        dbSchema->displaySchema();
        
        // Caching Strategy
        auto cachingStrategy = ComponentDesignFactory::createMultiLayerCaching();
        cachingStrategy->displayCachingStrategy();
    }
    
    void designReliabilityStrategy() {
        cout << "\n" << string(60, '-') << endl;
        cout << "STEP 6: RELIABILITY AND FAILURE HANDLING" << endl;
        cout << string(60, '-') << endl;
        
        reliabilityStrategy.setSLARequirement("Availability", "99.9%");
        reliabilityStrategy.setSLARequirement("Response Time", "< 100ms");
        reliabilityStrategy.setSLARequirement("Error Rate", "< 0.1%");
        
        reliabilityStrategy.addPattern(ReliabilityPatterns::createCircuitBreakerPattern());
        reliabilityStrategy.addPattern(ReliabilityPatterns::createRetryPattern());
        reliabilityStrategy.addPattern(ReliabilityPatterns::createBulkheadPattern());
        reliabilityStrategy.addPattern(ReliabilityPatterns::createRedundancyPattern());
        
        reliabilityStrategy.displayReliabilityStrategy();
    }
    
    void provideSummary() {
        cout << "\n" << string(60, '-') << endl;
        cout << "STEP 7: SUMMARY AND NEXT STEPS" << endl;
        cout << string(60, '-') << endl;
        
        cout << "\nKey Design Decisions:" << endl;
        cout << "1. Microservices architecture for scalability and team autonomy" << endl;
        cout << "2. Multi-layer caching strategy for performance" << endl;
        cout << "3. Database sharding for horizontal scaling" << endl;
        cout << "4. Circuit breaker pattern for fault tolerance" << endl;
        cout << "5. Load balancing for high availability" << endl;
        
        cout << "\nTrade-offs Made:" << endl;
        cout << "• Consistency vs Availability (chose eventual consistency)" << endl;
        cout << "• Complexity vs Scalability (chose scalability)" << endl;
        cout << "• Cost vs Performance (optimized for performance)" << endl;
        
        cout << "\nMonitoring and Metrics:" << endl;
        cout << "• Response time and throughput monitoring" << endl;
        cout << "• Error rate and availability tracking" << endl;
        cout << "• Resource utilization metrics" << endl;
        cout << "• Business metrics (user engagement, conversion rates)" << endl;
        
        cout << "\nFuture Enhancements:" << endl;
        cout << "• Machine learning for personalization" << endl;
        cout << "• Real-time analytics and recommendations" << endl;
        cout << "• Global content delivery network expansion" << endl;
        cout << "• Advanced security features (fraud detection)" << endl;
        
        cout << "\nScaling Considerations:" << endl;
        cout << "• Horizontal scaling of stateless services" << endl;
        cout << "• Database sharding strategies" << endl;
        cout << "• CDN for global content delivery" << endl;
        cout << "• Auto-scaling based on demand patterns" << endl;
    }
};

// Interview Practice Framework
class InterviewPractice {
public:
    static void practiceURLShortener() {
        cout << "\n🎯 PRACTICING: URL Shortener Design" << endl;
        
        InterviewSimulation simulation;
        auto question = SystemDesignQuestions::createURLShortenerQuestion();
        simulation.startInterview(move(question));
    }
    
    static void practiceChatSystem() {
        cout << "\n🎯 PRACTICING: Chat System Design" << endl;
        
        InterviewSimulation simulation;
        auto question = SystemDesignQuestions::createChatSystemQuestion();
        simulation.startInterview(move(question));
    }
    
    static void practiceSocialMediaFeed() {
        cout << "\n🎯 PRACTICING: Social Media Feed Design" << endl;
        
        InterviewSimulation simulation;
        auto question = SystemDesignQuestions::createSocialMediaFeedQuestion();
        simulation.startInterview(move(question));
    }
    
    static void displayInterviewTips() {
        cout << "\n=== SYSTEM DESIGN INTERVIEW TIPS ===" << endl;
        
        cout << "\n📋 Before the Interview:" << endl;
        cout << "• Review common system design patterns" << endl;
        cout << "• Practice capacity estimation calculations" << endl;
        cout << "• Study real-world system architectures" << endl;
        cout << "• Understand trade-offs between different approaches" << endl;
        
        cout << "\n🎯 During the Interview:" << endl;
        cout << "• Ask clarifying questions first" << endl;
        cout << "• Start with high-level design, then dive into details" << endl;
        cout << "• Explain your thought process clearly" << endl;
        cout << "• Discuss trade-offs and alternatives" << endl;
        cout << "• Consider scalability, reliability, and performance" << endl;
        
        cout << "\n⚡ Common Mistakes to Avoid:" << endl;
        cout << "• Jumping into details without understanding requirements" << endl;
        cout << "• Ignoring capacity estimation and scaling" << endl;
        cout << "• Not discussing failure scenarios" << endl;
        cout << "• Over-engineering the solution" << endl;
        cout << "• Not explaining trade-offs" << endl;
        
        cout << "\n🏆 Success Criteria:" << endl;
        cout << "• Clear problem understanding and requirements gathering" << endl;
        cout << "• Realistic capacity estimation" << endl;
        cout << "• Well-structured high-level architecture" << endl;
        cout << "• Detailed component design with justification" << endl;
        cout << "• Comprehensive failure handling strategy" << endl;
        cout << "• Discussion of monitoring and operational concerns" << endl;
    }
};
```

---

## ⚡ Key Takeaways

1. **Structured Approach**: Follow a systematic process from requirements to detailed design
2. **Requirements Analysis**: Ask clarifying questions and categorize functional vs non-functional requirements
3. **Capacity Planning**: Estimate traffic, storage, and bandwidth needs with realistic calculations
4. **Architecture Design**: Start with high-level components and gradually add detail
5. **Component Design**: Design APIs, databases, and caching strategies with specific technologies
6. **Reliability Planning**: Consider failure scenarios and implement appropriate patterns
7. **Trade-off Analysis**: Discuss pros and cons of different design decisions

## 🎯 Interview Success Framework

### **Phase 1: Problem Understanding (10-15 minutes)**
- Ask clarifying questions about scale, features, and constraints
- Define functional and non-functional requirements
- Establish key assumptions and success metrics

### **Phase 2: Capacity Estimation (10-15 minutes)**
- Calculate traffic patterns and peak loads
- Estimate storage requirements and growth
- Determine bandwidth and server capacity needs

### **Phase 3: High-Level Design (15-20 minutes)**
- Design overall system architecture
- Identify major components and their interactions
- Create system diagram with data flow

### **Phase 4: Detailed Design (15-20 minutes)**
- Design APIs and data models
- Specify database schema and caching strategy
- Detail critical algorithms and workflows

### **Phase 5: Reliability & Scale (10-15 minutes)**
- Discuss failure scenarios and mitigation strategies
- Plan for monitoring and operational concerns
- Address security and compliance requirements

## 🚀 Next Steps

- Practice with different system design problems (search engine, ride-sharing, video streaming)
- Study real-world architectures from tech companies
- Learn about specific technologies and their trade-offs
- Practice capacity estimation with different scales
- Understand distributed systems concepts deeply
- Stay updated with current industry trends and patterns

---
*"System design is not about finding the perfect solution, but about making informed trade-offs that best serve the requirements and constraints."* - System Design Wisdom 🏗️
