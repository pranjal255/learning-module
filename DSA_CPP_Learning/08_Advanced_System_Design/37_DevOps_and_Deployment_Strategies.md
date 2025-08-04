# DevOps and Deployment Strategies - Building Reliable Release Pipelines

## 🌟 Real-World Story: The Modern Software Factory

Imagine running a modern car manufacturing plant with automated assembly lines, quality control checkpoints, and just-in-time delivery. You need the same automation and reliability for software deployment:

- **Assembly Line** (CI/CD Pipeline): Automated stages from code commit to production deployment
- **Quality Gates** (Testing): Automated testing at every stage to catch defects early
- **Inventory Management** (Artifact Storage): Versioned builds stored and tracked through the pipeline
- **Production Line** (Deployment): Controlled rollout with monitoring and rollback capabilities
- **Quality Control** (Monitoring): Real-time health checks and performance validation
- **Shift Changes** (Blue-Green Deployment): Seamless transitions between production environments
- **Recall Process** (Rollback Strategy): Quick recovery when issues are detected

Just like a well-orchestrated manufacturing process, DevOps enables reliable, repeatable, and rapid software delivery!

## 🎯 Why DevOps Matters

### Real Applications:
- **Netflix**: Deploys thousands of times per day with automated canary releases
- **Amazon**: Achieves 11.7 seconds average deployment time with zero-downtime deployments
- **Google**: Uses continuous deployment with automated testing and gradual rollouts
- **Facebook**: Deploys to production twice daily with comprehensive monitoring

## 📊 DevOps System Components

### 🔄 CI/CD Pipeline Architecture
### 🧪 Automated Testing Strategies
### 📦 Containerization and Orchestration
### 🚀 Deployment Patterns and Strategies
### 📊 Infrastructure as Code and Monitoring

---

## 🔄 CI/CD PIPELINE ARCHITECTURE

### What is CI/CD?
**Real-World Analogy**: Like a modern bakery's production line - ingredients (code) go through mixing (integration), baking (testing), quality control (validation), and packaging (deployment) in an automated, repeatable process.

```cpp
// CI/CD Pipeline Implementation
#include <chrono>
#include <vector>
#include <map>
#include <memory>
#include <functional>
#include <thread>
#include <atomic>
#include <queue>

// Pipeline Stage Status
enum class StageStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILED,
    SKIPPED,
    CANCELLED
};

// Pipeline Stage
class PipelineStage {
private:
    string name;
    string description;
    vector<string> dependencies;
    function<bool()> executor;
    StageStatus status;
    chrono::system_clock::time_point startTime;
    chrono::system_clock::time_point endTime;
    string errorMessage;
    map<string, string> artifacts;
    
public:
    PipelineStage(const string& stageName, const string& desc, 
                 function<bool()> exec, const vector<string>& deps = {})
        : name(stageName), description(desc), executor(exec), 
          dependencies(deps), status(StageStatus::PENDING) {}
    
    bool execute() {
        status = StageStatus::RUNNING;
        startTime = chrono::system_clock::now();
        
        cout << "Executing stage: " << name << endl;
        
        try {
            bool success = executor();
            endTime = chrono::system_clock::now();
            
            if (success) {
                status = StageStatus::SUCCESS;
                cout << "Stage " << name << " completed successfully" << endl;
            } else {
                status = StageStatus::FAILED;
                errorMessage = "Stage execution returned false";
                cout << "Stage " << name << " failed" << endl;
            }
            
            return success;
        } catch (const exception& e) {
            endTime = chrono::system_clock::now();
            status = StageStatus::FAILED;
            errorMessage = e.what();
            cout << "Stage " << name << " failed with exception: " << e.what() << endl;
            return false;
        }
    }
    
    void skip() {
        status = StageStatus::SKIPPED;
        cout << "Stage " << name << " skipped" << endl;
    }
    
    void cancel() {
        status = StageStatus::CANCELLED;
        cout << "Stage " << name << " cancelled" << endl;
    }
    
    chrono::milliseconds getDuration() const {
        if (status == StageStatus::RUNNING || status == StageStatus::PENDING) {
            return chrono::milliseconds(0);
        }
        return chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
    }
    
    void addArtifact(const string& key, const string& value) {
        artifacts[key] = value;
    }
    
    // Getters
    string getName() const { return name; }
    string getDescription() const { return description; }
    StageStatus getStatus() const { return status; }
    vector<string> getDependencies() const { return dependencies; }
    string getErrorMessage() const { return errorMessage; }
    map<string, string> getArtifacts() const { return artifacts; }
    
    string getStatusString() const {
        switch (status) {
            case StageStatus::PENDING: return "PENDING";
            case StageStatus::RUNNING: return "RUNNING";
            case StageStatus::SUCCESS: return "SUCCESS";
            case StageStatus::FAILED: return "FAILED";
            case StageStatus::SKIPPED: return "SKIPPED";
            case StageStatus::CANCELLED: return "CANCELLED";
            default: return "UNKNOWN";
        }
    }
};

// Build Information
struct BuildInfo {
    string buildId;
    string commitHash;
    string branch;
    string author;
    chrono::system_clock::time_point timestamp;
    map<string, string> environment;
    
    BuildInfo(const string& id, const string& commit, const string& br, const string& auth)
        : buildId(id), commitHash(commit), branch(br), author(auth),
          timestamp(chrono::system_clock::now()) {}
};

// Pipeline Execution
class Pipeline {
private:
    string pipelineId;
    string name;
    vector<unique_ptr<PipelineStage>> stages;
    BuildInfo buildInfo;
    StageStatus overallStatus;
    chrono::system_clock::time_point startTime;
    chrono::system_clock::time_point endTime;
    
    // Pipeline configuration
    bool failFast;
    int maxParallelStages;
    
public:
    Pipeline(const string& id, const string& pipelineName, const BuildInfo& build)
        : pipelineId(id), name(pipelineName), buildInfo(build), 
          overallStatus(StageStatus::PENDING), failFast(true), maxParallelStages(3) {}
    
    void addStage(unique_ptr<PipelineStage> stage) {
        stages.push_back(move(stage));
    }
    
    bool execute() {
        startTime = chrono::system_clock::now();
        overallStatus = StageStatus::RUNNING;
        
        cout << "\n=== Starting Pipeline: " << name << " ===" << endl;
        cout << "Build ID: " << buildInfo.buildId << endl;
        cout << "Commit: " << buildInfo.commitHash << endl;
        cout << "Branch: " << buildInfo.branch << endl;
        cout << "Author: " << buildInfo.author << endl;
        
        bool success = executeStages();
        
        endTime = chrono::system_clock::now();
        overallStatus = success ? StageStatus::SUCCESS : StageStatus::FAILED;
        
        displayResults();
        return success;
    }
    
    void displayResults() const {
        cout << "\n=== Pipeline Results ===" << endl;
        cout << "Pipeline: " << name << endl;
        cout << "Status: " << getStatusString(overallStatus) << endl;
        cout << "Duration: " << getDuration().count() << "ms" << endl;
        
        cout << "\nStage Results:" << endl;
        for (const auto& stage : stages) {
            cout << "  " << stage->getName() << ": " << stage->getStatusString();
            if (stage->getStatus() != StageStatus::PENDING) {
                cout << " (" << stage->getDuration().count() << "ms)";
            }
            if (stage->getStatus() == StageStatus::FAILED) {
                cout << " - " << stage->getErrorMessage();
            }
            cout << endl;
        }
        
        // Display artifacts
        cout << "\nArtifacts:" << endl;
        for (const auto& stage : stages) {
            auto artifacts = stage->getArtifacts();
            if (!artifacts.empty()) {
                cout << "  " << stage->getName() << ":" << endl;
                for (const auto& artifact : artifacts) {
                    cout << "    " << artifact.first << ": " << artifact.second << endl;
                }
            }
        }
    }
    
    chrono::milliseconds getDuration() const {
        if (overallStatus == StageStatus::RUNNING || overallStatus == StageStatus::PENDING) {
            return chrono::milliseconds(0);
        }
        return chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
    }
    
    string getPipelineId() const { return pipelineId; }
    StageStatus getOverallStatus() const { return overallStatus; }
    
private:
    bool executeStages() {
        // Build dependency graph
        map<string, vector<string>> dependencyGraph;
        map<string, int> inDegree;
        
        for (const auto& stage : stages) {
            inDegree[stage->getName()] = stage->getDependencies().size();
            for (const string& dep : stage->getDependencies()) {
                dependencyGraph[dep].push_back(stage->getName());
            }
        }
        
        // Topological sort execution
        queue<string> readyStages;
        map<string, PipelineStage*> stageMap;
        
        for (const auto& stage : stages) {
            stageMap[stage->getName()] = stage.get();
            if (inDegree[stage->getName()] == 0) {
                readyStages.push(stage->getName());
            }
        }
        
        while (!readyStages.empty()) {
            string stageName = readyStages.front();
            readyStages.pop();
            
            PipelineStage* stage = stageMap[stageName];
            bool success = stage->execute();
            
            if (!success && failFast) {
                // Cancel remaining stages
                for (const auto& remainingStage : stages) {
                    if (remainingStage->getStatus() == StageStatus::PENDING) {
                        remainingStage->cancel();
                    }
                }
                return false;
            }
            
            // Update dependencies
            for (const string& dependent : dependencyGraph[stageName]) {
                inDegree[dependent]--;
                if (inDegree[dependent] == 0) {
                    if (success || !failFast) {
                        readyStages.push(dependent);
                    } else {
                        stageMap[dependent]->skip();
                    }
                }
            }
        }
        
        // Check if all stages completed successfully
        for (const auto& stage : stages) {
            if (stage->getStatus() == StageStatus::FAILED) {
                return false;
            }
        }
        
        return true;
    }
    
    string getStatusString(StageStatus status) const {
        switch (status) {
            case StageStatus::PENDING: return "PENDING";
            case StageStatus::RUNNING: return "RUNNING";
            case StageStatus::SUCCESS: return "SUCCESS";
            case StageStatus::FAILED: return "FAILED";
            case StageStatus::SKIPPED: return "SKIPPED";
            case StageStatus::CANCELLED: return "CANCELLED";
            default: return "UNKNOWN";
        }
    }
};

// CI/CD Pipeline Manager
class PipelineManager {
private:
    map<string, unique_ptr<Pipeline>> pipelines;
    queue<string> pipelineQueue;
    thread executorThread;
    atomic<bool> running{false};
    mutable mutex managerMutex;
    condition_variable pipelineCondition;
    
    // Statistics
    atomic<int> totalPipelines{0};
    atomic<int> successfulPipelines{0};
    atomic<int> failedPipelines{0};
    
public:
    PipelineManager() {}
    
    ~PipelineManager() {
        stop();
    }
    
    void start() {
        running = true;
        executorThread = thread(&PipelineManager::executorLoop, this);
        cout << "Pipeline manager started" << endl;
    }
    
    void stop() {
        running = false;
        pipelineCondition.notify_all();
        if (executorThread.joinable()) {
            executorThread.join();
        }
        cout << "Pipeline manager stopped" << endl;
    }
    
    string submitPipeline(unique_ptr<Pipeline> pipeline) {
        lock_guard<mutex> lock(managerMutex);
        
        string pipelineId = pipeline->getPipelineId();
        pipelines[pipelineId] = move(pipeline);
        pipelineQueue.push(pipelineId);
        totalPipelines++;
        
        cout << "Pipeline submitted: " << pipelineId << endl;
        pipelineCondition.notify_one();
        
        return pipelineId;
    }
    
    Pipeline* getPipeline(const string& pipelineId) {
        lock_guard<mutex> lock(managerMutex);
        
        auto it = pipelines.find(pipelineId);
        return (it != pipelines.end()) ? it->second.get() : nullptr;
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(managerMutex);
        
        cout << "\n=== Pipeline Manager Statistics ===" << endl;
        cout << "Total Pipelines: " << totalPipelines.load() << endl;
        cout << "Successful: " << successfulPipelines.load() << endl;
        cout << "Failed: " << failedPipelines.load() << endl;
        cout << "Queued: " << pipelineQueue.size() << endl;
        
        if (totalPipelines.load() > 0) {
            double successRate = (double)successfulPipelines.load() / totalPipelines.load() * 100;
            cout << "Success Rate: " << successRate << "%" << endl;
        }
    }
    
private:
    void executorLoop() {
        while (running) {
            string pipelineId;
            
            {
                unique_lock<mutex> lock(managerMutex);
                if (!pipelineCondition.wait_for(lock, chrono::seconds(1), 
                    [this] { return !pipelineQueue.empty() || !running; })) {
                    continue;
                }
                
                if (!running) break;
                
                pipelineId = pipelineQueue.front();
                pipelineQueue.pop();
            }
            
            // Execute pipeline
            Pipeline* pipeline = getPipeline(pipelineId);
            if (pipeline) {
                bool success = pipeline->execute();
                
                if (success) {
                    successfulPipelines++;
                } else {
                    failedPipelines++;
                }
            }
        }
    }
};

// Pipeline Builder
class PipelineBuilder {
private:
    unique_ptr<Pipeline> pipeline;
    
public:
    PipelineBuilder(const string& pipelineId, const string& name, const BuildInfo& buildInfo) {
        pipeline = make_unique<Pipeline>(pipelineId, name, buildInfo);
    }
    
    PipelineBuilder& addStage(const string& name, const string& description,
                             function<bool()> executor, const vector<string>& dependencies = {}) {
        auto stage = make_unique<PipelineStage>(name, description, executor, dependencies);
        pipeline->addStage(move(stage));
        return *this;
    }
    
    unique_ptr<Pipeline> build() {
        return move(pipeline);
    }
};
```

---

## 🧪 AUTOMATED TESTING STRATEGIES

### What is Test Automation?
**Real-World Analogy**: Like quality control in a pharmaceutical factory - automated tests at every stage ensure product safety and efficacy before reaching consumers.

```cpp
// Automated Testing Framework Implementation
#include <regex>

// Test Result
enum class TestResult {
    PASS,
    FAIL,
    SKIP,
    ERROR
};

// Test Case
class TestCase {
private:
    string name;
    string description;
    function<bool()> testFunction;
    TestResult result;
    string errorMessage;
    chrono::milliseconds duration;
    
public:
    TestCase(const string& testName, const string& desc, function<bool()> testFunc)
        : name(testName), description(desc), testFunction(testFunc), result(TestResult::SKIP) {}
    
    void execute() {
        auto startTime = chrono::high_resolution_clock::now();
        
        try {
            bool success = testFunction();
            result = success ? TestResult::PASS : TestResult::FAIL;
            
            if (!success) {
                errorMessage = "Test assertion failed";
            }
        } catch (const exception& e) {
            result = TestResult::ERROR;
            errorMessage = e.what();
        }
        
        auto endTime = chrono::high_resolution_clock::now();
        duration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
        
        cout << "Test: " << name << " - " << getResultString() << " (" << duration.count() << "ms)" << endl;
        if (result != TestResult::PASS) {
            cout << "  Error: " << errorMessage << endl;
        }
    }
    
    string getName() const { return name; }
    TestResult getResult() const { return result; }
    string getErrorMessage() const { return errorMessage; }
    chrono::milliseconds getDuration() const { return duration; }
    
    string getResultString() const {
        switch (result) {
            case TestResult::PASS: return "PASS";
            case TestResult::FAIL: return "FAIL";
            case TestResult::SKIP: return "SKIP";
            case TestResult::ERROR: return "ERROR";
            default: return "UNKNOWN";
        }
    }
};

// Test Suite
class TestSuite {
private:
    string name;
    vector<unique_ptr<TestCase>> testCases;
    chrono::milliseconds totalDuration{0};
    
public:
    TestSuite(const string& suiteName) : name(suiteName) {}
    
    void addTest(unique_ptr<TestCase> testCase) {
        testCases.push_back(move(testCase));
    }
    
    void execute() {
        cout << "\n=== Executing Test Suite: " << name << " ===" << endl;
        
        auto startTime = chrono::high_resolution_clock::now();
        
        for (auto& testCase : testCases) {
            testCase->execute();
        }
        
        auto endTime = chrono::high_resolution_clock::now();
        totalDuration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
        
        displayResults();
    }
    
    void displayResults() const {
        int passed = 0, failed = 0, errors = 0, skipped = 0;
        
        for (const auto& testCase : testCases) {
            switch (testCase->getResult()) {
                case TestResult::PASS: passed++; break;
                case TestResult::FAIL: failed++; break;
                case TestResult::ERROR: errors++; break;
                case TestResult::SKIP: skipped++; break;
            }
        }
        
        cout << "\n=== Test Suite Results: " << name << " ===" << endl;
        cout << "Total Tests: " << testCases.size() << endl;
        cout << "Passed: " << passed << endl;
        cout << "Failed: " << failed << endl;
        cout << "Errors: " << errors << endl;
        cout << "Skipped: " << skipped << endl;
        cout << "Duration: " << totalDuration.count() << "ms" << endl;
        
        if (testCases.size() > 0) {
            double successRate = (double)passed / testCases.size() * 100;
            cout << "Success Rate: " << successRate << "%" << endl;
        }
    }
    
    bool allTestsPassed() const {
        for (const auto& testCase : testCases) {
            if (testCase->getResult() != TestResult::PASS) {
                return false;
            }
        }
        return true;
    }
    
    string getName() const { return name; }
    size_t getTestCount() const { return testCases.size(); }
};

// Test Runner
class TestRunner {
private:
    vector<unique_ptr<TestSuite>> testSuites;
    
public:
    void addTestSuite(unique_ptr<TestSuite> suite) {
        testSuites.push_back(move(suite));
    }
    
    bool executeAll() {
        cout << "\n=== Starting Test Execution ===" << endl;
        
        bool allPassed = true;
        int totalTests = 0;
        int totalPassed = 0;
        
        for (auto& suite : testSuites) {
            suite->execute();
            totalTests += suite->getTestCount();
            
            if (!suite->allTestsPassed()) {
                allPassed = false;
            }
            
            // Count passed tests (simplified)
            for (size_t i = 0; i < suite->getTestCount(); i++) {
                totalPassed++; // Simplified counting
            }
        }
        
        cout << "\n=== Overall Test Results ===" << endl;
        cout << "Test Suites: " << testSuites.size() << endl;
        cout << "Total Tests: " << totalTests << endl;
        cout << "Overall Status: " << (allPassed ? "PASS" : "FAIL") << endl;
        
        return allPassed;
    }
};

// Unit Test Framework
class UnitTestFramework {
public:
    static bool assertEquals(int expected, int actual, const string& message = "") {
        if (expected != actual) {
            cout << "Assertion failed: " << message << " (expected: " << expected << ", actual: " << actual << ")" << endl;
            return false;
        }
        return true;
    }
    
    static bool assertTrue(bool condition, const string& message = "") {
        if (!condition) {
            cout << "Assertion failed: " << message << " (condition was false)" << endl;
            return false;
        }
        return true;
    }
    
    static bool assertFalse(bool condition, const string& message = "") {
        if (condition) {
            cout << "Assertion failed: " << message << " (condition was true)" << endl;
            return false;
        }
        return true;
    }
    
    static bool assertStringEquals(const string& expected, const string& actual, const string& message = "") {
        if (expected != actual) {
            cout << "Assertion failed: " << message << " (expected: '" << expected << "', actual: '" << actual << "')" << endl;
            return false;
        }
        return true;
    }
    
    static bool assertThrows(function<void()> func, const string& message = "") {
        try {
            func();
            cout << "Assertion failed: " << message << " (expected exception but none was thrown)" << endl;
            return false;
        } catch (...) {
            return true;
        }
    }
};

// Integration Test Framework
class IntegrationTestFramework {
private:
    map<string, string> testEnvironment;
    
public:
    void setEnvironmentVariable(const string& key, const string& value) {
        testEnvironment[key] = value;
    }
    
    bool setupTestDatabase() {
        cout << "Setting up test database..." << endl;
        // Simulate database setup
        this_thread::sleep_for(chrono::milliseconds(100));
        return true;
    }
    
    bool teardownTestDatabase() {
        cout << "Tearing down test database..." << endl;
        // Simulate database cleanup
        this_thread::sleep_for(chrono::milliseconds(50));
        return true;
    }
    
    bool testAPIEndpoint(const string& endpoint, const string& expectedResponse) {
        cout << "Testing API endpoint: " << endpoint << endl;
        
        // Simulate API call
        this_thread::sleep_for(chrono::milliseconds(200));
        
        // Simulate response validation
        string actualResponse = "OK"; // Simplified
        return actualResponse == expectedResponse;
    }
    
    bool testServiceIntegration(const string& serviceA, const string& serviceB) {
        cout << "Testing integration between " << serviceA << " and " << serviceB << endl;
        
        // Simulate service communication test
        this_thread::sleep_for(chrono::milliseconds(300));
        
        return true; // Simplified
    }
};

// Performance Test Framework
class PerformanceTestFramework {
private:
    struct PerformanceMetrics {
        chrono::milliseconds averageResponseTime{0};
        chrono::milliseconds maxResponseTime{0};
        chrono::milliseconds minResponseTime{999999};
        int totalRequests{0};
        int successfulRequests{0};
        double throughput{0.0}; // requests per second
    };
    
public:
    PerformanceMetrics loadTest(function<bool()> testFunction, int numberOfRequests, int concurrency) {
        cout << "Starting load test: " << numberOfRequests << " requests with " << concurrency << " concurrent users" << endl;
        
        PerformanceMetrics metrics;
        vector<chrono::milliseconds> responseTimes;
        
        auto startTime = chrono::high_resolution_clock::now();
        
        // Simulate concurrent execution
        vector<thread> workers;
        atomic<int> completedRequests{0};
        atomic<int> successfulRequests{0};
        
        for (int i = 0; i < concurrency; i++) {
            workers.emplace_back([&, numberOfRequests, concurrency]() {
                int requestsPerWorker = numberOfRequests / concurrency;
                
                for (int j = 0; j < requestsPerWorker; j++) {
                    auto requestStart = chrono::high_resolution_clock::now();
                    
                    bool success = testFunction();
                    
                    auto requestEnd = chrono::high_resolution_clock::now();
                    auto responseTime = chrono::duration_cast<chrono::milliseconds>(requestEnd - requestStart);
                    
                    responseTimes.push_back(responseTime);
                    completedRequests++;
                    
                    if (success) {
                        successfulRequests++;
                    }
                }
            });
        }
        
        // Wait for all workers to complete
        for (auto& worker : workers) {
            worker.join();
        }
        
        auto endTime = chrono::high_resolution_clock::now();
        auto totalDuration = chrono::duration_cast<chrono::milliseconds>(endTime - startTime);
        
        // Calculate metrics
        metrics.totalRequests = completedRequests.load();
        metrics.successfulRequests = successfulRequests.load();
        
        if (!responseTimes.empty()) {
            auto totalTime = accumulate(responseTimes.begin(), responseTimes.end(), chrono::milliseconds(0));
            metrics.averageResponseTime = totalTime / responseTimes.size();
            metrics.maxResponseTime = *max_element(responseTimes.begin(), responseTimes.end());
            metrics.minResponseTime = *min_element(responseTimes.begin(), responseTimes.end());
        }
        
        if (totalDuration.count() > 0) {
            metrics.throughput = (double)metrics.totalRequests / (totalDuration.count() / 1000.0);
        }
        
        displayPerformanceResults(metrics);
        return metrics;
    }
    
private:
    void displayPerformanceResults(const PerformanceMetrics& metrics) {
        cout << "\n=== Performance Test Results ===" << endl;
        cout << "Total Requests: " << metrics.totalRequests << endl;
        cout << "Successful Requests: " << metrics.successfulRequests << endl;
        cout << "Average Response Time: " << metrics.averageResponseTime.count() << "ms" << endl;
        cout << "Min Response Time: " << metrics.minResponseTime.count() << "ms" << endl;
        cout << "Max Response Time: " << metrics.maxResponseTime.count() << "ms" << endl;
        cout << "Throughput: " << metrics.throughput << " requests/second" << endl;
        
        if (metrics.totalRequests > 0) {
            double successRate = (double)metrics.successfulRequests / metrics.totalRequests * 100;
            cout << "Success Rate: " << successRate << "%" << endl;
        }
    }
};
```

---

## 📦 CONTAINERIZATION AND ORCHESTRATION

### What is Containerization?
**Real-World Analogy**: Like shipping containers - applications are packaged with all their dependencies into standardized containers that can run anywhere, just like how shipping containers can be transported by ship, truck, or train.

```cpp
// Container and Orchestration Implementation
#include <unordered_set>

// Container Status
enum class ContainerStatus {
    CREATED,
    RUNNING,
    STOPPED,
    FAILED,
    RESTARTING
};

// Container Configuration
struct ContainerConfig {
    string image;
    map<string, string> environment;
    vector<string> ports;
    map<string, string> volumes;
    vector<string> commands;
    int memoryLimit; // MB
    double cpuLimit; // CPU cores
    
    ContainerConfig(const string& img) : image(img), memoryLimit(512), cpuLimit(1.0) {}
};

// Container
class Container {
private:
    string containerId;
    string name;
    ContainerConfig config;
    ContainerStatus status;
    chrono::system_clock::time_point startTime;
    chrono::system_clock::time_point stopTime;
    int restartCount;
    string errorMessage;
    
    // Resource usage
    double cpuUsage;
    int memoryUsage;
    
public:
    Container(const string& id, const string& containerName, const ContainerConfig& cfg)
        : containerId(id), name(containerName), config(cfg), status(ContainerStatus::CREATED),
          restartCount(0), cpuUsage(0.0), memoryUsage(0) {}
    
    bool start() {
        if (status == ContainerStatus::RUNNING) {
            return true;
        }
        
        cout << "Starting container: " << name << " (image: " << config.image << ")" << endl;
        
        // Simulate container startup
        this_thread::sleep_for(chrono::milliseconds(500));
        
        // Simulate startup success/failure
        if (rand() % 10 < 9) { // 90% success rate
            status = ContainerStatus::RUNNING;
            startTime = chrono::system_clock::now();
            
            // Simulate resource usage
            cpuUsage = 0.1 + (rand() % 50) / 100.0; // 0.1 - 0.6 CPU
            memoryUsage = 100 + (rand() % 300); // 100-400 MB
            
            cout << "Container " << name << " started successfully" << endl;
            return true;
        } else {
            status = ContainerStatus::FAILED;
            errorMessage = "Container failed to start";
            cout << "Container " << name << " failed to start" << endl;
            return false;
        }
    }
    
    bool stop() {
        if (status != ContainerStatus::RUNNING) {
            return true;
        }
        
        cout << "Stopping container: " << name << endl;
        
        status = ContainerStatus::STOPPED;
        stopTime = chrono::system_clock::now();
        cpuUsage = 0.0;
        memoryUsage = 0;
        
        cout << "Container " << name << " stopped" << endl;
        return true;
    }
    
    bool restart() {
        cout << "Restarting container: " << name << endl;
        
        stop();
        restartCount++;
        
        // Brief pause before restart
        this_thread::sleep_for(chrono::milliseconds(100));
        
        return start();
    }
    
    void updateResourceUsage() {
        if (status == ContainerStatus::RUNNING) {
            // Simulate fluctuating resource usage
            cpuUsage = max(0.05, cpuUsage + (rand() % 21 - 10) / 100.0); // ±10%
            cpuUsage = min(config.cpuLimit, cpuUsage);
            
            memoryUsage = max(50, memoryUsage + (rand() % 21 - 10)); // ±10 MB
            memoryUsage = min(config.memoryLimit, memoryUsage);
        }
    }
    
    chrono::milliseconds getUptime() const {
        if (status != ContainerStatus::RUNNING) {
            return chrono::milliseconds(0);
        }
        
        auto now = chrono::system_clock::now();
        return chrono::duration_cast<chrono::milliseconds>(now - startTime);
    }
    
    // Getters
    string getContainerId() const { return containerId; }
    string getName() const { return name; }
    ContainerStatus getStatus() const { return status; }
    double getCpuUsage() const { return cpuUsage; }
    int getMemoryUsage() const { return memoryUsage; }
    int getRestartCount() const { return restartCount; }
    string getErrorMessage() const { return errorMessage; }
    
    string getStatusString() const {
        switch (status) {
            case ContainerStatus::CREATED: return "CREATED";
            case ContainerStatus::RUNNING: return "RUNNING";
            case ContainerStatus::STOPPED: return "STOPPED";
            case ContainerStatus::FAILED: return "FAILED";
            case ContainerStatus::RESTARTING: return "RESTARTING";
            default: return "UNKNOWN";
        }
    }
    
    void displayInfo() const {
        cout << "Container: " << name << " (" << containerId << ")" << endl;
        cout << "  Image: " << config.image << endl;
        cout << "  Status: " << getStatusString() << endl;
        cout << "  CPU Usage: " << cpuUsage << " cores" << endl;
        cout << "  Memory Usage: " << memoryUsage << " MB" << endl;
        cout << "  Restart Count: " << restartCount << endl;
        
        if (status == ContainerStatus::RUNNING) {
            cout << "  Uptime: " << getUptime().count() << "ms" << endl;
        }
        
        if (!errorMessage.empty()) {
            cout << "  Error: " << errorMessage << endl;
        }
    }
};

// Container Orchestrator
class ContainerOrchestrator {
private:
    map<string, unique_ptr<Container>> containers;
    thread monitoringThread;
    atomic<bool> monitoring{false};
    mutable mutex orchestratorMutex;
    
    // Health check configuration
    chrono::seconds healthCheckInterval;
    int maxRestartAttempts;
    
public:
    ContainerOrchestrator() : healthCheckInterval(chrono::seconds(30)), maxRestartAttempts(3) {}
    
    ~ContainerOrchestrator() {
        stopMonitoring();
    }
    
    string createContainer(const string& name, const ContainerConfig& config) {
        lock_guard<mutex> lock(orchestratorMutex);
        
        string containerId = generateContainerId();
        auto container = make_unique<Container>(containerId, name, config);
        
        containers[containerId] = move(container);
        
        cout << "Created container: " << name << " (" << containerId << ")" << endl;
        return containerId;
    }
    
    bool startContainer(const string& containerId) {
        lock_guard<mutex> lock(orchestratorMutex);
        
        auto it = containers.find(containerId);
        if (it != containers.end()) {
            return it->second->start();
        }
        return false;
    }
    
    bool stopContainer(const string& containerId) {
        lock_guard<mutex> lock(orchestratorMutex);
        
        auto it = containers.find(containerId);
        if (it != containers.end()) {
            return it->second->stop();
        }
        return false;
    }
    
    bool restartContainer(const string& containerId) {
        lock_guard<mutex> lock(orchestratorMutex);
        
        auto it = containers.find(containerId);
        if (it != containers.end()) {
            return it->second->restart();
        }
        return false;
    }
    
    void removeContainer(const string& containerId) {
        lock_guard<mutex> lock(orchestratorMutex);
        
        auto it = containers.find(containerId);
        if (it != containers.end()) {
            it->second->stop();
            containers.erase(it);
            cout << "Removed container: " << containerId << endl;
        }
    }
    
    void startMonitoring() {
        monitoring = true;
        monitoringThread = thread(&ContainerOrchestrator::monitoringLoop, this);
        cout << "Started container monitoring" << endl;
    }
    
    void stopMonitoring() {
        monitoring = false;
        if (monitoringThread.joinable()) {
            monitoringThread.join();
        }
        cout << "Stopped container monitoring" << endl;
    }
    
    void displayContainerStats() const {
        lock_guard<mutex> lock(orchestratorMutex);
        
        cout << "\n=== Container Statistics ===" << endl;
        cout << "Total Containers: " << containers.size() << endl;
        
        int running = 0, stopped = 0, failed = 0;
        double totalCpu = 0.0;
        int totalMemory = 0;
        
        for (const auto& containerPair : containers) {
            const auto& container = containerPair.second;
            
            switch (container->getStatus()) {
                case ContainerStatus::RUNNING:
                    running++;
                    totalCpu += container->getCpuUsage();
                    totalMemory += container->getMemoryUsage();
                    break;
                case ContainerStatus::STOPPED:
                    stopped++;
                    break;
                case ContainerStatus::FAILED:
                    failed++;
                    break;
                default:
                    break;
            }
        }
        
        cout << "Running: " << running << endl;
        cout << "Stopped: " << stopped << endl;
        cout << "Failed: " << failed << endl;
        cout << "Total CPU Usage: " << totalCpu << " cores" << endl;
        cout << "Total Memory Usage: " << totalMemory << " MB" << endl;
        
        cout << "\nContainer Details:" << endl;
        for (const auto& containerPair : containers) {
            containerPair.second->displayInfo();
            cout << endl;
        }
    }
    
    vector<string> getRunningContainers() const {
        lock_guard<mutex> lock(orchestratorMutex);
        
        vector<string> runningContainers;
        for (const auto& containerPair : containers) {
            if (containerPair.second->getStatus() == ContainerStatus::RUNNING) {
                runningContainers.push_back(containerPair.first);
            }
        }
        return runningContainers;
    }
    
private:
    string generateContainerId() {
        static atomic<int> counter{0};
        return "container_" + to_string(++counter);
    }
    
    void monitoringLoop() {
        while (monitoring) {
            this_thread::sleep_for(healthCheckInterval);
            
            if (!monitoring) break;
            
            performHealthChecks();
            updateResourceUsage();
        }
    }
    
    void performHealthChecks() {
        lock_guard<mutex> lock(orchestratorMutex);
        
        for (auto& containerPair : containers) {
            auto& container = containerPair.second;
            
            if (container->getStatus() == ContainerStatus::FAILED && 
                container->getRestartCount() < maxRestartAttempts) {
                
                cout << "Attempting to restart failed container: " << container->getName() << endl;
                container->restart();
            }
        }
    }
    
    void updateResourceUsage() {
        lock_guard<mutex> lock(orchestratorMutex);
        
        for (auto& containerPair : containers) {
            containerPair.second->updateResourceUsage();
        }
    }
};

// Service Definition
struct ServiceDefinition {
    string serviceName;
    string image;
    int replicas;
    map<string, string> environment;
    vector<string> ports;
    ContainerConfig containerConfig;
    
    ServiceDefinition(const string& name, const string& img, int rep = 1)
        : serviceName(name), image(img), replicas(rep), containerConfig(img) {}
};

// Kubernetes-like Service Orchestrator
class ServiceOrchestrator {
private:
    map<string, ServiceDefinition> services;
    map<string, vector<string>> serviceContainers; // service -> container IDs
    ContainerOrchestrator& containerOrchestrator;
    
public:
    ServiceOrchestrator(ContainerOrchestrator& orchestrator) 
        : containerOrchestrator(orchestrator) {}
    
    void deployService(const ServiceDefinition& service) {
        cout << "Deploying service: " << service.serviceName << " (replicas: " << service.replicas << ")" << endl;
        
        services[service.serviceName] = service;
        serviceContainers[service.serviceName].clear();
        
        // Create and start containers for replicas
        for (int i = 0; i < service.replicas; i++) {
            string containerName = service.serviceName + "_replica_" + to_string(i + 1);
            string containerId = containerOrchestrator.createContainer(containerName, service.containerConfig);
            
            serviceContainers[service.serviceName].push_back(containerId);
            containerOrchestrator.startContainer(containerId);
        }
        
        cout << "Service " << service.serviceName << " deployed successfully" << endl;
    }
    
    void scaleService(const string& serviceName, int newReplicas) {
        auto serviceIt = services.find(serviceName);
        if (serviceIt == services.end()) {
            cout << "Service not found: " << serviceName << endl;
            return;
        }
        
        auto& service = serviceIt->second;
        int currentReplicas = service.replicas;
        
        cout << "Scaling service " << serviceName << " from " << currentReplicas << " to " << newReplicas << " replicas" << endl;
        
        if (newReplicas > currentReplicas) {
            // Scale up
            for (int i = currentReplicas; i < newReplicas; i++) {
                string containerName = serviceName + "_replica_" + to_string(i + 1);
                string containerId = containerOrchestrator.createContainer(containerName, service.containerConfig);
                
                serviceContainers[serviceName].push_back(containerId);
                containerOrchestrator.startContainer(containerId);
            }
        } else if (newReplicas < currentReplicas) {
            // Scale down
            auto& containers = serviceContainers[serviceName];
            for (int i = currentReplicas - 1; i >= newReplicas; i--) {
                if (i < containers.size()) {
                    containerOrchestrator.removeContainer(containers[i]);
                    containers.erase(containers.begin() + i);
                }
            }
        }
        
        service.replicas = newReplicas;
        cout << "Service " << serviceName << " scaled to " << newReplicas << " replicas" << endl;
    }
    
    void removeService(const string& serviceName) {
        auto serviceIt = services.find(serviceName);
        if (serviceIt == services.end()) {
            cout << "Service not found: " << serviceName << endl;
            return;
        }
        
        cout << "Removing service: " << serviceName << endl;
        
        // Remove all containers for this service
        auto& containers = serviceContainers[serviceName];
        for (const string& containerId : containers) {
            containerOrchestrator.removeContainer(containerId);
        }
        
        services.erase(serviceIt);
        serviceContainers.erase(serviceName);
        
        cout << "Service " << serviceName << " removed" << endl;
    }
    
    void displayServices() const {
        cout << "\n=== Deployed Services ===" << endl;
        
        if (services.empty()) {
            cout << "No services deployed" << endl;
            return;
        }
        
        for (const auto& servicePair : services) {
            const auto& service = servicePair.second;
            const auto& containers = serviceContainers.at(servicePair.first);
            
            cout << "Service: " << service.serviceName << endl;
            cout << "  Image: " << service.image << endl;
            cout << "  Replicas: " << service.replicas << endl;
            cout << "  Containers: " << containers.size() << endl;
            
            // Count running containers
            int runningCount = 0;
            auto runningContainers = containerOrchestrator.getRunningContainers();
            for (const string& containerId : containers) {
                if (find(runningContainers.begin(), runningContainers.end(), containerId) != runningContainers.end()) {
                    runningCount++;
                }
            }
            
            cout << "  Running: " << runningCount << "/" << containers.size() << endl;
            cout << endl;
        }
    }
};
```

---

## 🚀 DEPLOYMENT PATTERNS AND STRATEGIES

### What are Deployment Strategies?
**Real-World Analogy**: Like updating a fleet of delivery trucks - you can replace all at once (big bang), one at a time (rolling), run old and new simultaneously (blue-green), or test with a few customers first (canary).

```cpp
// Deployment Strategies Implementation

// Deployment Strategy Types
enum class DeploymentStrategy {
    BLUE_GREEN,
    ROLLING,
    CANARY,
    RECREATE
};

// Deployment Status
enum class DeploymentStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    ROLLED_BACK
};

// Deployment Configuration
struct DeploymentConfig {
    string applicationName;
    string newVersion;
    string currentVersion;
    DeploymentStrategy strategy;
    int totalInstances;
    int batchSize; // For rolling deployments
    double canaryPercentage; // For canary deployments
    chrono::seconds healthCheckDelay;
    int maxUnavailable;
    
    DeploymentConfig(const string& app, const string& newVer, const string& currentVer)
        : applicationName(app), newVersion(newVer), currentVersion(currentVer),
          strategy(DeploymentStrategy::ROLLING), totalInstances(3), batchSize(1),
          canaryPercentage(10.0), healthCheckDelay(chrono::seconds(30)), maxUnavailable(1) {}
};

// Application Instance
class ApplicationInstance {
private:
    string instanceId;
    string version;
    bool healthy;
    chrono::system_clock::time_point startTime;
    
public:
    ApplicationInstance(const string& id, const string& ver)
        : instanceId(id), version(ver), healthy(false),
          startTime(chrono::system_clock::now()) {}
    
    bool deploy() {
        cout << "Deploying instance " << instanceId << " (version: " << version << ")" << endl;
        
        // Simulate deployment time
        this_thread::sleep_for(chrono::milliseconds(1000));
        
        // Simulate deployment success/failure
        if (rand() % 10 < 9) { // 90% success rate
            healthy = true;
            cout << "Instance " << instanceId << " deployed successfully" << endl;
            return true;
        } else {
            healthy = false;
            cout << "Instance " << instanceId << " deployment failed" << endl;
            return false;
        }
    }
    
    bool performHealthCheck() {
        // Simulate health check
        this_thread::sleep_for(chrono::milliseconds(100));
        
        // Simulate occasional health check failures
        if (rand() % 20 == 0) { // 5% failure rate
            healthy = false;
            cout << "Health check failed for instance " << instanceId << endl;
            return false;
        }
        
        healthy = true;
        return true;
    }
    
    void stop() {
        healthy = false;
        cout << "Stopped instance " << instanceId << endl;
    }
    
    // Getters
    string getInstanceId() const { return instanceId; }
    string getVersion() const { return version; }
    bool isHealthy() const { return healthy; }
    
    chrono::milliseconds getUptime() const {
        auto now = chrono::system_clock::now();
        return chrono::duration_cast<chrono::milliseconds>(now - startTime);
    }
};

// Deployment Manager
class DeploymentManager {
private:
    map<string, vector<unique_ptr<ApplicationInstance>>> applications;
    mutable mutex deploymentMutex;
    
public:
    bool executeDeployment(const DeploymentConfig& config) {
        cout << "\n=== Starting Deployment ===" << endl;
        cout << "Application: " << config.applicationName << endl;
        cout << "Strategy: " << strategyToString(config.strategy) << endl;
        cout << "Current Version: " << config.currentVersion << endl;
        cout << "New Version: " << config.newVersion << endl;
        
        switch (config.strategy) {
            case DeploymentStrategy::BLUE_GREEN:
                return executeBlueGreenDeployment(config);
            case DeploymentStrategy::ROLLING:
                return executeRollingDeployment(config);
            case DeploymentStrategy::CANARY:
                return executeCanaryDeployment(config);
            case DeploymentStrategy::RECREATE:
                return executeRecreateDeployment(config);
            default:
                cout << "Unknown deployment strategy" << endl;
                return false;
        }
    }
    
private:
    bool executeBlueGreenDeployment(const DeploymentConfig& config) {
        cout << "\n--- Blue-Green Deployment ---" << endl;
        
        // Create green environment (new version)
        vector<unique_ptr<ApplicationInstance>> greenInstances;
        
        cout << "Creating green environment..." << endl;
        for (int i = 0; i < config.totalInstances; i++) {
            string instanceId = config.applicationName + "_green_" + to_string(i + 1);
            auto instance = make_unique<ApplicationInstance>(instanceId, config.newVersion);
            
            if (!instance->deploy()) {
                cout << "Green environment deployment failed" << endl;
                return false;
            }
            
            greenInstances.push_back(move(instance));
        }
        
        // Health check green environment
        cout << "Performing health checks on green environment..." << endl;
        this_thread::sleep_for(config.healthCheckDelay);
        
        bool allHealthy = true;
        for (auto& instance : greenInstances) {
            if (!instance->performHealthCheck()) {
                allHealthy = false;
                break;
            }
        }
        
        if (!allHealthy) {
            cout << "Green environment health checks failed, rolling back..." << endl;
            return false;
        }
        
        // Switch traffic to green (simulate)
        cout << "Switching traffic to green environment..." << endl;
        this_thread::sleep_for(chrono::milliseconds(500));
        
        // Stop blue environment (old version)
        cout << "Stopping blue environment..." << endl;
        auto& blueInstances = applications[config.applicationName];
        for (auto& instance : blueInstances) {
            instance->stop();
        }
        
        // Replace blue with green
        applications[config.applicationName] = move(greenInstances);
        
        cout << "Blue-Green deployment completed successfully" << endl;
        return true;
    }
    
    bool executeRollingDeployment(const DeploymentConfig& config) {
        cout << "\n--- Rolling Deployment ---" << endl;
        
        auto& instances = applications[config.applicationName];
        
        // Initialize if not exists
        if (instances.empty()) {
            for (int i = 0; i < config.totalInstances; i++) {
                string instanceId = config.applicationName + "_" + to_string(i + 1);
                instances.push_back(make_unique<ApplicationInstance>(instanceId, config.currentVersion));
            }
        }
        
        // Rolling update in batches
        for (int i = 0; i < instances.size(); i += config.batchSize) {
            cout << "Updating batch starting at instance " << (i + 1) << endl;
            
            // Update batch
            for (int j = i; j < min((int)instances.size(), i + config.batchSize); j++) {
                // Stop old instance
                instances[j]->stop();
                
                // Create new instance
                string instanceId = config.applicationName + "_" + to_string(j + 1);
                auto newInstance = make_unique<ApplicationInstance>(instanceId, config.newVersion);
                
                if (!newInstance->deploy()) {
                    cout << "Rolling deployment failed at instance " << (j + 1) << endl;
                    return false;
                }
                
                instances[j] = move(newInstance);
            }
            
            // Health check after batch
            cout << "Performing health checks..." << endl;
            this_thread::sleep_for(config.healthCheckDelay);
            
            bool batchHealthy = true;
            for (int j = i; j < min((int)instances.size(), i + config.batchSize); j++) {
                if (!instances[j]->performHealthCheck()) {
                    batchHealthy = false;
                    break;
                }
            }
            
            if (!batchHealthy) {
                cout << "Health checks failed, stopping deployment" << endl;
                return false;
            }
            
            cout << "Batch " << (i / config.batchSize + 1) << " completed successfully" << endl;
        }
        
        cout << "Rolling deployment completed successfully" << endl;
        return true;
    }
    
    bool executeCanaryDeployment(const DeploymentConfig& config) {
        cout << "\n--- Canary Deployment ---" << endl;
        
        auto& instances = applications[config.applicationName];
        
        // Calculate canary instances
        int canaryCount = max(1, (int)(config.totalInstances * config.canaryPercentage / 100.0));
        
        cout << "Deploying " << canaryCount << " canary instances (" << config.canaryPercentage << "%)" << endl;
        
        // Deploy canary instances
        vector<unique_ptr<ApplicationInstance>> canaryInstances;
        for (int i = 0; i < canaryCount; i++) {
            string instanceId = config.applicationName + "_canary_" + to_string(i + 1);
            auto instance = make_unique<ApplicationInstance>(instanceId, config.newVersion);
            
            if (!instance->deploy()) {
                cout << "Canary deployment failed" << endl;
                return false;
            }
            
            canaryInstances.push_back(move(instance));
        }
        
        // Monitor canary instances
        cout << "Monitoring canary instances..." << endl;
        this_thread::sleep_for(config.healthCheckDelay * 2); // Longer monitoring period
        
        bool canaryHealthy = true;
        for (auto& instance : canaryInstances) {
            if (!instance->performHealthCheck()) {
                canaryHealthy = false;
                break;
            }
        }
        
        if (!canaryHealthy) {
            cout << "Canary instances failed health checks, aborting deployment" << endl;
            return false;
        }
        
        cout << "Canary instances healthy, proceeding with full deployment..." << endl;
        
        // Deploy to remaining instances
        DeploymentConfig fullConfig = config;
        fullConfig.strategy = DeploymentStrategy::ROLLING;
        
        return executeRollingDeployment(fullConfig);
    }
    
    bool executeRecreateDeployment(const DeploymentConfig& config) {
        cout << "\n--- Recreate Deployment ---" << endl;
        
        auto& instances = applications[config.applicationName];
        
        // Stop all instances
        cout << "Stopping all instances..." << endl;
        for (auto& instance : instances) {
            instance->stop();
        }
        
        instances.clear();
        
        // Create new instances
        cout << "Creating new instances..." << endl;
        for (int i = 0; i < config.totalInstances; i++) {
            string instanceId = config.applicationName + "_" + to_string(i + 1);
            auto instance = make_unique<ApplicationInstance>(instanceId, config.newVersion);
            
            if (!instance->deploy()) {
                cout << "Recreate deployment failed at instance " << (i + 1) << endl;
                return false;
            }
            
            instances.push_back(move(instance));
        }
        
        // Health check all instances
        cout << "Performing health checks..." << endl;
        this_thread::sleep_for(config.healthCheckDelay);
        
        for (auto& instance : instances) {
            if (!instance->performHealthCheck()) {
                cout << "Health checks failed" << endl;
                return false;
            }
        }
        
        cout << "Recreate deployment completed successfully" << endl;
        return true;
    }
    
    string strategyToString(DeploymentStrategy strategy) const {
        switch (strategy) {
            case DeploymentStrategy::BLUE_GREEN: return "Blue-Green";
            case DeploymentStrategy::ROLLING: return "Rolling";
            case DeploymentStrategy::CANARY: return "Canary";
            case DeploymentStrategy::RECREATE: return "Recreate";
            default: return "Unknown";
        }
    }
    
public:
    void displayApplicationStatus(const string& applicationName) const {
        lock_guard<mutex> lock(deploymentMutex);
        
        auto it = applications.find(applicationName);
        if (it == applications.end()) {
            cout << "Application not found: " << applicationName << endl;
            return;
        }
        
        const auto& instances = it->second;
        
        cout << "\n=== Application Status: " << applicationName << " ===" << endl;
        cout << "Total Instances: " << instances.size() << endl;
        
        int healthy = 0;
        map<string, int> versionCounts;
        
        for (const auto& instance : instances) {
            if (instance->isHealthy()) {
                healthy++;
            }
            versionCounts[instance->getVersion()]++;
        }
        
        cout << "Healthy Instances: " << healthy << "/" << instances.size() << endl;
        
        cout << "Version Distribution:" << endl;
        for (const auto& versionCount : versionCounts) {
            cout << "  " << versionCount.first << ": " << versionCount.second << " instances" << endl;
        }
        
        cout << "\nInstance Details:" << endl;
        for (const auto& instance : instances) {
            cout << "  " << instance->getInstanceId() 
                 << " (v" << instance->getVersion() << ") - "
                 << (instance->isHealthy() ? "HEALTHY" : "UNHEALTHY")
                 << " (uptime: " << instance->getUptime().count() << "ms)" << endl;
        }
    }
};
```

---

## 📊 INFRASTRUCTURE AS CODE AND MONITORING

### What is Infrastructure as Code?
**Real-World Analogy**: Like architectural blueprints for buildings - instead of manually constructing each building, you create detailed plans that can be used to build identical structures anywhere, ensuring consistency and repeatability.

```cpp
// Infrastructure as Code Implementation

// Resource Types
enum class ResourceType {
    VIRTUAL_MACHINE,
    LOAD_BALANCER,
    DATABASE,
    STORAGE,
    NETWORK,
    SECURITY_GROUP
};

// Resource Status
enum class ResourceStatus {
    PLANNED,
    CREATING,
    CREATED,
    UPDATING,
    DELETING,
    DELETED,
    FAILED
};

// Infrastructure Resource
class InfrastructureResource {
private:
    string resourceId;
    string name;
    ResourceType type;
    ResourceStatus status;
    map<string, string> properties;
    vector<string> dependencies;
    chrono::system_clock::time_point createdAt;
    string errorMessage;
    
public:
    InfrastructureResource(const string& id, const string& resourceName, ResourceType resourceType)
        : resourceId(id), name(resourceName), type(resourceType), status(ResourceStatus::PLANNED) {}
    
    bool create() {
        status = ResourceStatus::CREATING;
        cout << "Creating " << typeToString(type) << ": " << name << endl;
        
        // Simulate resource creation time
        this_thread::sleep_for(chrono::milliseconds(500 + rand() % 1000));
        
        // Simulate creation success/failure
        if (rand() % 10 < 9) { // 90% success rate
            status = ResourceStatus::CREATED;
            createdAt = chrono::system_clock::now();
            cout << typeToString(type) << " " << name << " created successfully" << endl;
            return true;
        } else {
            status = ResourceStatus::FAILED;
            errorMessage = "Resource creation failed";
            cout << typeToString(type) << " " << name << " creation failed" << endl;
            return false;
        }
    }
    
    bool update() {
        if (status != ResourceStatus::CREATED) {
            return false;
        }
        
        status = ResourceStatus::UPDATING;
        cout << "Updating " << typeToString(type) << ": " << name << endl;
        
        // Simulate update time
        this_thread::sleep_for(chrono::milliseconds(300 + rand() % 500));
        
        // Simulate update success/failure
        if (rand() % 10 < 9) { // 90% success rate
            status = ResourceStatus::CREATED;
            cout << typeToString(type) << " " << name << " updated successfully" << endl;
            return true;
        } else {
            status = ResourceStatus::FAILED;
            errorMessage = "Resource update failed";
            cout << typeToString(type) << " " << name << " update failed" << endl;
            return false;
        }
    }
    
    bool destroy() {
        if (status == ResourceStatus::DELETED) {
            return true;
        }
        
        status = ResourceStatus::DELETING;
        cout << "Deleting " << typeToString(type) << ": " << name << endl;
        
        // Simulate deletion time
        this_thread::sleep_for(chrono::milliseconds(200 + rand() % 300));
        
        status = ResourceStatus::DELETED;
        cout << typeToString(type) << " " << name << " deleted successfully" << endl;
        return true;
    }
    
    void setProperty(const string& key, const string& value) {
        properties[key] = value;
    }
    
    void addDependency(const string& dependencyId) {
        dependencies.push_back(dependencyId);
    }
    
    // Getters
    string getResourceId() const { return resourceId; }
    string getName() const { return name; }
    ResourceType getType() const { return type; }
    ResourceStatus getStatus() const { return status; }
    vector<string> getDependencies() const { return dependencies; }
    string getErrorMessage() const { return errorMessage; }
    
    string getStatusString() const {
        switch (status) {
            case ResourceStatus::PLANNED: return "PLANNED";
            case ResourceStatus::CREATING: return "CREATING";
            case ResourceStatus::CREATED: return "CREATED";
            case ResourceStatus::UPDATING: return "UPDATING";
            case ResourceStatus::DELETING: return "DELETING";
            case ResourceStatus::DELETED: return "DELETED";
            case ResourceStatus::FAILED: return "FAILED";
            default: return "UNKNOWN";
        }
    }
    
    string typeToString(ResourceType type) const {
        switch (type) {
            case ResourceType::VIRTUAL_MACHINE: return "Virtual Machine";
            case ResourceType::LOAD_BALANCER: return "Load Balancer";
            case ResourceType::DATABASE: return "Database";
            case ResourceType::STORAGE: return "Storage";
            case ResourceType::NETWORK: return "Network";
            case ResourceType::SECURITY_GROUP: return "Security Group";
            default: return "Unknown";
        }
    }
    
    void displayInfo() const {
        cout << "Resource: " << name << " (" << resourceId << ")" << endl;
        cout << "  Type: " << typeToString(type) << endl;
        cout << "  Status: " << getStatusString() << endl;
        
        if (!properties.empty()) {
            cout << "  Properties:" << endl;
            for (const auto& prop : properties) {
                cout << "    " << prop.first << ": " << prop.second << endl;
            }
        }
        
        if (!dependencies.empty()) {
            cout << "  Dependencies: ";
            for (size_t i = 0; i < dependencies.size(); i++) {
                cout << dependencies[i];
                if (i < dependencies.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        
        if (!errorMessage.empty()) {
            cout << "  Error: " << errorMessage << endl;
        }
    }
};

// Infrastructure Template
class InfrastructureTemplate {
private:
    string templateName;
    string version;
    vector<unique_ptr<InfrastructureResource>> resources;
    map<string, string> parameters;
    
public:
    InfrastructureTemplate(const string& name, const string& ver)
        : templateName(name), version(ver) {}
    
    void addResource(unique_ptr<InfrastructureResource> resource) {
        resources.push_back(move(resource));
    }
    
    void setParameter(const string& key, const string& value) {
        parameters[key] = value;
    }
    
    bool deploy() {
        cout << "\n=== Deploying Infrastructure Template: " << templateName << " ===" << endl;
        cout << "Version: " << version << endl;
        
        // Build dependency graph
        map<string, vector<string>> dependencyGraph;
        map<string, int> inDegree;
        map<string, InfrastructureResource*> resourceMap;
        
        for (const auto& resource : resources) {
            string resourceId = resource->getResourceId();
            resourceMap[resourceId] = resource.get();
            inDegree[resourceId] = resource->getDependencies().size();
            
            for (const string& dep : resource->getDependencies()) {
                dependencyGraph[dep].push_back(resourceId);
            }
        }
        
        // Topological sort for deployment order
        queue<string> readyResources;
        for (const auto& resource : resources) {
            if (inDegree[resource->getResourceId()] == 0) {
                readyResources.push(resource->getResourceId());
            }
        }
        
        while (!readyResources.empty()) {
            string resourceId = readyResources.front();
            readyResources.pop();
            
            InfrastructureResource* resource = resourceMap[resourceId];
            
            if (!resource->create()) {
                cout << "Infrastructure deployment failed at resource: " << resource->getName() << endl;
                return false;
            }
            
            // Update dependencies
            for (const string& dependent : dependencyGraph[resourceId]) {
                inDegree[dependent]--;
                if (inDegree[dependent] == 0) {
                    readyResources.push(dependent);
                }
            }
        }
        
        cout << "Infrastructure template " << templateName << " deployed successfully" << endl;
        return true;
    }
    
    bool destroy() {
        cout << "\n=== Destroying Infrastructure Template: " << templateName << " ===" << endl;
        
        // Destroy in reverse dependency order
        for (auto it = resources.rbegin(); it != resources.rend(); ++it) {
            if (!(*it)->destroy()) {
                cout << "Failed to destroy resource: " << (*it)->getName() << endl;
                return false;
            }
        }
        
        cout << "Infrastructure template " << templateName << " destroyed successfully" << endl;
        return true;
    }
    
    void displayStatus() const {
        cout << "\n=== Infrastructure Template Status: " << templateName << " ===" << endl;
        cout << "Version: " << version << endl;
        cout << "Resources: " << resources.size() << endl;
        
        int created = 0, failed = 0, planned = 0;
        for (const auto& resource : resources) {
            switch (resource->getStatus()) {
                case ResourceStatus::CREATED: created++; break;
                case ResourceStatus::FAILED: failed++; break;
                case ResourceStatus::PLANNED: planned++; break;
                default: break;
            }
        }
        
        cout << "Created: " << created << endl;
        cout << "Failed: " << failed << endl;
        cout << "Planned: " << planned << endl;
        
        cout << "\nResource Details:" << endl;
        for (const auto& resource : resources) {
            resource->displayInfo();
            cout << endl;
        }
    }
    
    string getTemplateName() const { return templateName; }
    string getVersion() const { return version; }
};

// Infrastructure Manager
class InfrastructureManager {
private:
    map<string, unique_ptr<InfrastructureTemplate>> templates;
    mutable mutex managerMutex;
    
public:
    void addTemplate(unique_ptr<InfrastructureTemplate> infraTemplate) {
        lock_guard<mutex> lock(managerMutex);
        
        string templateName = infraTemplate->getTemplateName();
        templates[templateName] = move(infraTemplate);
        
        cout << "Added infrastructure template: " << templateName << endl;
    }
    
    bool deployTemplate(const string& templateName) {
        lock_guard<mutex> lock(managerMutex);
        
        auto it = templates.find(templateName);
        if (it != templates.end()) {
            return it->second->deploy();
        }
        
        cout << "Template not found: " << templateName << endl;
        return false;
    }
    
    bool destroyTemplate(const string& templateName) {
        lock_guard<mutex> lock(managerMutex);
        
        auto it = templates.find(templateName);
        if (it != templates.end()) {
            return it->second->destroy();
        }
        
        cout << "Template not found: " << templateName << endl;
        return false;
    }
    
    void displayTemplateStatus(const string& templateName) const {
        lock_guard<mutex> lock(managerMutex);
        
        auto it = templates.find(templateName);
        if (it != templates.end()) {
            it->second->displayStatus();
        } else {
            cout << "Template not found: " << templateName << endl;
        }
    }
    
    void displayAllTemplates() const {
        lock_guard<mutex> lock(managerMutex);
        
        cout << "\n=== Infrastructure Templates ===" << endl;
        
        if (templates.empty()) {
            cout << "No templates available" << endl;
            return;
        }
        
        for (const auto& templatePair : templates) {
            const auto& infraTemplate = templatePair.second;
            cout << "Template: " << infraTemplate->getTemplateName() 
                 << " (Version: " << infraTemplate->getVersion() << ")" << endl;
        }
    }
};

// DevOps Metrics and Monitoring
class DevOpsMetrics {
private:
    // Deployment metrics
    atomic<int> totalDeployments{0};
    atomic<int> successfulDeployments{0};
    atomic<int> failedDeployments{0};
    
    // Pipeline metrics
    atomic<int> totalPipelines{0};
    atomic<int> successfulPipelines{0};
    
    // Lead time tracking
    map<string, chrono::system_clock::time_point> deploymentStartTimes;
    vector<chrono::milliseconds> leadTimes;
    
    mutable mutex metricsMutex;
    
public:
    void recordDeploymentStart(const string& deploymentId) {
        lock_guard<mutex> lock(metricsMutex);
        deploymentStartTimes[deploymentId] = chrono::system_clock::now();
        totalDeployments++;
    }
    
    void recordDeploymentEnd(const string& deploymentId, bool success) {
        lock_guard<mutex> lock(metricsMutex);
        
        auto it = deploymentStartTimes.find(deploymentId);
        if (it != deploymentStartTimes.end()) {
            auto endTime = chrono::system_clock::now();
            auto leadTime = chrono::duration_cast<chrono::milliseconds>(endTime - it->second);
            leadTimes.push_back(leadTime);
            deploymentStartTimes.erase(it);
        }
        
        if (success) {
            successfulDeployments++;
        } else {
            failedDeployments++;
        }
    }
    
    void recordPipelineExecution(bool success) {
        totalPipelines++;
        if (success) {
            successfulPipelines++;
        }
    }
    
    void displayDORAMetrics() const {
        lock_guard<mutex> lock(metricsMutex);
        
        cout << "\n=== DORA Metrics (DevOps Research and Assessment) ===" << endl;
        
        // Deployment Frequency
        cout << "Deployment Frequency:" << endl;
        cout << "  Total Deployments: " << totalDeployments.load() << endl;
        cout << "  Successful Deployments: " << successfulDeployments.load() << endl;
        cout << "  Failed Deployments: " << failedDeployments.load() << endl;
        
        if (totalDeployments.load() > 0) {
            double successRate = (double)successfulDeployments.load() / totalDeployments.load() * 100;
            cout << "  Success Rate: " << successRate << "%" << endl;
        }
        
        // Lead Time for Changes
        if (!leadTimes.empty()) {
            auto totalLeadTime = accumulate(leadTimes.begin(), leadTimes.end(), chrono::milliseconds(0));
            auto averageLeadTime = totalLeadTime / leadTimes.size();
            auto maxLeadTime = *max_element(leadTimes.begin(), leadTimes.end());
            auto minLeadTime = *min_element(leadTimes.begin(), leadTimes.end());
            
            cout << "\nLead Time for Changes:" << endl;
            cout << "  Average: " << averageLeadTime.count() << "ms" << endl;
            cout << "  Min: " << minLeadTime.count() << "ms" << endl;
            cout << "  Max: " << maxLeadTime.count() << "ms" << endl;
        }
        
        // Change Failure Rate
        if (totalDeployments.load() > 0) {
            double failureRate = (double)failedDeployments.load() / totalDeployments.load() * 100;
            cout << "\nChange Failure Rate: " << failureRate << "%" << endl;
        }
        
        // Pipeline Performance
        cout << "\nPipeline Performance:" << endl;
        cout << "  Total Pipelines: " << totalPipelines.load() << endl;
        cout << "  Successful Pipelines: " << successfulPipelines.load() << endl;
        
        if (totalPipelines.load() > 0) {
            double pipelineSuccessRate = (double)successfulPipelines.load() / totalPipelines.load() * 100;
            cout << "  Pipeline Success Rate: " << pipelineSuccessRate << "%" << endl;
        }
    }
    
    // DevOps maturity assessment
    void assessDevOpsMaturity() const {
        lock_guard<mutex> lock(metricsMutex);
        
        cout << "\n=== DevOps Maturity Assessment ===" << endl;
        
        double deploymentSuccessRate = totalDeployments.load() > 0 ? 
            (double)successfulDeployments.load() / totalDeployments.load() * 100 : 0;
        
        double pipelineSuccessRate = totalPipelines.load() > 0 ? 
            (double)successfulPipelines.load() / totalPipelines.load() * 100 : 0;
        
        string maturityLevel = "Beginner";
        if (deploymentSuccessRate >= 95 && pipelineSuccessRate >= 90) {
            maturityLevel = "Elite";
        } else if (deploymentSuccessRate >= 85 && pipelineSuccessRate >= 80) {
            maturityLevel = "High";
        } else if (deploymentSuccessRate >= 70 && pipelineSuccessRate >= 70) {
            maturityLevel = "Medium";
        }
        
        cout << "Maturity Level: " << maturityLevel << endl;
        cout << "Deployment Success Rate: " << deploymentSuccessRate << "%" << endl;
        cout << "Pipeline Success Rate: " << pipelineSuccessRate << "%" << endl;
        
        // Recommendations
        cout << "\nRecommendations:" << endl;
        if (deploymentSuccessRate < 90) {
            cout << "- Improve deployment automation and testing" << endl;
        }
        if (pipelineSuccessRate < 85) {
            cout << "- Enhance CI/CD pipeline reliability" << endl;
        }
        if (!leadTimes.empty()) {
            auto avgLeadTime = accumulate(leadTimes.begin(), leadTimes.end(), chrono::milliseconds(0)) / leadTimes.size();
            if (avgLeadTime.count() > 60000) { // > 1 minute
                cout << "- Optimize deployment lead times" << endl;
            }
        }
    }
};
```

---

## ⚡ Key Takeaways

1. **CI/CD pipelines** automate the software delivery process from code commit to production deployment
2. **Automated testing** ensures quality at every stage with unit, integration, and performance tests
3. **Containerization** provides consistent, portable application packaging and deployment
4. **Deployment strategies** enable safe, reliable releases with minimal downtime and risk
5. **Infrastructure as Code** ensures consistent, repeatable infrastructure provisioning
6. **DevOps metrics** measure and improve delivery performance and system reliability
7. **Monitoring and observability** provide visibility into deployment health and performance

## 🎯 Next Steps

- Study specific DevOps tools (Jenkins, GitLab CI, Docker, Kubernetes, Terraform)
- Learn about GitOps and declarative deployment approaches
- Explore advanced deployment patterns (feature flags, progressive delivery)
- Practice implementing comprehensive CI/CD pipelines
- Understand compliance and security in DevOps (DevSecOps)
- Study chaos engineering and reliability testing

---
*"DevOps is not a destination, but a journey of continuous improvement in software delivery and operational excellence."* - Gene Kim 🚀
