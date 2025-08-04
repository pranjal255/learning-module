# Monitoring and Observability - Building Transparent Systems

## 🌟 Real-World Story: The Smart City Control Center

Imagine managing a smart city with traffic lights, power grids, water systems, and emergency services. You need the same observability as modern software systems:

- **Traffic Cameras** (Metrics): Real-time data on traffic flow, congestion, and incidents
- **Sensor Networks** (Logs): Detailed records from every streetlight, water meter, and air quality monitor
- **Emergency Response** (Traces): Following the complete journey of a 911 call through dispatch, ambulance, and hospital
- **City Dashboard** (Dashboards): Real-time visualization of all city systems and their health
- **Predictive Analytics** (Alerting): Early warning systems for potential infrastructure failures
- **Historical Analysis** (Retention): Long-term data storage for urban planning and optimization
- **Incident Response** (On-call): 24/7 monitoring teams ready to respond to any system failures

Just like a smart city's comprehensive monitoring, modern systems need observability to understand their behavior, performance, and health in real-time!

## 🎯 Why Monitoring Matters

### Real Applications:
- **Netflix**: Monitors 1000+ microservices with custom metrics and distributed tracing
- **Google**: Uses SRE practices with SLIs/SLOs to maintain 99.99% uptime
- **Amazon**: Tracks millions of metrics across AWS services for operational excellence
- **Uber**: Monitors real-time ride matching with sub-second latency requirements

## 📊 Observability System Components

### 📈 Metrics and Time Series Data
### 📝 Logging and Log Aggregation
### 🔍 Distributed Tracing
### 📊 Dashboards and Visualization
### 🚨 Alerting and Incident Response

---

## 📈 METRICS AND TIME SERIES DATA

### What are Metrics?
**Real-World Analogy**: Like a car's dashboard - speedometer (throughput), fuel gauge (resource usage), temperature gauge (system health), and odometer (cumulative counters) give you real-time insights into performance.

```cpp
// Metrics and Time Series Implementation
#include <chrono>
#include <map>
#include <vector>
#include <atomic>
#include <mutex>
#include <thread>
#include <algorithm>
#include <numeric>

// Metric Types
enum class MetricType {
    COUNTER,    // Monotonically increasing (requests, errors)
    GAUGE,      // Point-in-time value (CPU usage, memory)
    HISTOGRAM,  // Distribution of values (response times)
    SUMMARY     // Quantiles and totals
};

// Time Series Data Point
struct DataPoint {
    chrono::system_clock::time_point timestamp;
    double value;
    map<string, string> labels;
    
    DataPoint(double val, const map<string, string>& lbls = {})
        : timestamp(chrono::system_clock::now()), value(val), labels(lbls) {}
};

// Base Metric Class
class Metric {
protected:
    string name;
    string description;
    MetricType type;
    map<string, string> defaultLabels;
    vector<DataPoint> timeSeries;
    mutable mutex metricMutex;
    
    // Retention policy
    chrono::hours retentionPeriod;
    size_t maxDataPoints;
    
public:
    Metric(const string& metricName, const string& desc, MetricType metricType,
           chrono::hours retention = chrono::hours(24), size_t maxPoints = 10000)
        : name(metricName), description(desc), type(metricType),
          retentionPeriod(retention), maxDataPoints(maxPoints) {}
    
    virtual ~Metric() = default;
    
    string getName() const { return name; }
    string getDescription() const { return description; }
    MetricType getType() const { return type; }
    
    void setDefaultLabels(const map<string, string>& labels) {
        lock_guard<mutex> lock(metricMutex);
        defaultLabels = labels;
    }
    
    vector<DataPoint> getTimeSeries(chrono::system_clock::time_point start,
                                   chrono::system_clock::time_point end) const {
        lock_guard<mutex> lock(metricMutex);
        
        vector<DataPoint> result;
        for (const auto& point : timeSeries) {
            if (point.timestamp >= start && point.timestamp <= end) {
                result.push_back(point);
            }
        }
        return result;
    }
    
    virtual void record(double value, const map<string, string>& labels = {}) = 0;
    virtual double getCurrentValue() const = 0;
    
protected:
    void addDataPoint(double value, const map<string, string>& labels = {}) {
        lock_guard<mutex> lock(metricMutex);
        
        map<string, string> combinedLabels = defaultLabels;
        combinedLabels.insert(labels.begin(), labels.end());
        
        timeSeries.emplace_back(value, combinedLabels);
        
        // Cleanup old data
        cleanupOldData();
    }
    
private:
    void cleanupOldData() {
        auto now = chrono::system_clock::now();
        auto cutoff = now - retentionPeriod;
        
        // Remove old data points
        timeSeries.erase(
            remove_if(timeSeries.begin(), timeSeries.end(),
                [cutoff](const DataPoint& point) {
                    return point.timestamp < cutoff;
                }),
            timeSeries.end()
        );
        
        // Limit total data points
        if (timeSeries.size() > maxDataPoints) {
            timeSeries.erase(timeSeries.begin(), 
                           timeSeries.begin() + (timeSeries.size() - maxDataPoints));
        }
    }
};

// Counter Metric
class Counter : public Metric {
private:
    atomic<double> value{0.0};
    
public:
    Counter(const string& name, const string& description)
        : Metric(name, description, MetricType::COUNTER) {}
    
    void record(double increment, const map<string, string>& labels = {}) override {
        if (increment < 0) {
            throw invalid_argument("Counter increment must be non-negative");
        }
        
        value += increment;
        addDataPoint(value.load(), labels);
        
        cout << "Counter " << name << ": " << value.load() << endl;
    }
    
    void increment(const map<string, string>& labels = {}) {
        record(1.0, labels);
    }
    
    double getCurrentValue() const override {
        return value.load();
    }
    
    void reset() {
        value = 0.0;
        addDataPoint(0.0);
    }
};

// Gauge Metric
class Gauge : public Metric {
private:
    atomic<double> value{0.0};
    
public:
    Gauge(const string& name, const string& description)
        : Metric(name, description, MetricType::GAUGE) {}
    
    void record(double newValue, const map<string, string>& labels = {}) override {
        value = newValue;
        addDataPoint(newValue, labels);
        
        cout << "Gauge " << name << ": " << newValue << endl;
    }
    
    void increment(double delta = 1.0, const map<string, string>& labels = {}) {
        double newValue = value.load() + delta;
        record(newValue, labels);
    }
    
    void decrement(double delta = 1.0, const map<string, string>& labels = {}) {
        double newValue = value.load() - delta;
        record(newValue, labels);
    }
    
    double getCurrentValue() const override {
        return value.load();
    }
};

// Histogram Metric
class Histogram : public Metric {
private:
    vector<double> buckets;
    vector<atomic<int>> bucketCounts;
    atomic<int> totalCount{0};
    atomic<double> totalSum{0.0};
    
public:
    Histogram(const string& name, const string& description, 
             const vector<double>& bucketBoundaries = {0.1, 0.5, 1.0, 2.5, 5.0, 10.0})
        : Metric(name, description, MetricType::HISTOGRAM), buckets(bucketBoundaries) {
        
        // Add infinity bucket
        buckets.push_back(numeric_limits<double>::infinity());
        bucketCounts.resize(buckets.size());
    }
    
    void record(double value, const map<string, string>& labels = {}) override {
        totalCount++;
        totalSum += value;
        
        // Find appropriate bucket
        for (size_t i = 0; i < buckets.size(); i++) {
            if (value <= buckets[i]) {
                bucketCounts[i]++;
                break;
            }
        }
        
        addDataPoint(value, labels);
        
        cout << "Histogram " << name << ": recorded " << value 
             << " (total: " << totalCount.load() << ")" << endl;
    }
    
    double getCurrentValue() const override {
        return totalCount.load() > 0 ? totalSum.load() / totalCount.load() : 0.0;
    }
    
    double getQuantile(double quantile) const {
        if (quantile < 0.0 || quantile > 1.0) {
            throw invalid_argument("Quantile must be between 0 and 1");
        }
        
        int targetCount = static_cast<int>(totalCount.load() * quantile);
        int cumulativeCount = 0;
        
        for (size_t i = 0; i < buckets.size(); i++) {
            cumulativeCount += bucketCounts[i].load();
            if (cumulativeCount >= targetCount) {
                return buckets[i];
            }
        }
        
        return buckets.back();
    }
    
    void displayBuckets() const {
        cout << "\nHistogram " << name << " buckets:" << endl;
        for (size_t i = 0; i < buckets.size(); i++) {
            cout << "  <= " << buckets[i] << ": " << bucketCounts[i].load() << endl;
        }
        cout << "Total count: " << totalCount.load() << endl;
        cout << "Average: " << getCurrentValue() << endl;
    }
};

// Metrics Registry
class MetricsRegistry {
private:
    map<string, unique_ptr<Metric>> metrics;
    mutable mutex registryMutex;
    
    // Background collection
    thread collectionThread;
    atomic<bool> collecting{false};
    chrono::seconds collectionInterval;
    
public:
    MetricsRegistry(chrono::seconds interval = chrono::seconds(10))
        : collectionInterval(interval) {}
    
    ~MetricsRegistry() {
        stopCollection();
    }
    
    template<typename MetricType>
    MetricType* registerMetric(unique_ptr<MetricType> metric) {
        lock_guard<mutex> lock(registryMutex);
        
        string name = metric->getName();
        MetricType* ptr = metric.get();
        metrics[name] = move(metric);
        
        cout << "Registered metric: " << name << endl;
        return ptr;
    }
    
    Metric* getMetric(const string& name) {
        lock_guard<mutex> lock(registryMutex);
        
        auto it = metrics.find(name);
        return (it != metrics.end()) ? it->second.get() : nullptr;
    }
    
    vector<string> getMetricNames() const {
        lock_guard<mutex> lock(registryMutex);
        
        vector<string> names;
        for (const auto& metric : metrics) {
            names.push_back(metric.first);
        }
        return names;
    }
    
    void startCollection() {
        collecting = true;
        collectionThread = thread(&MetricsRegistry::collectionLoop, this);
        cout << "Started metrics collection" << endl;
    }
    
    void stopCollection() {
        collecting = false;
        if (collectionThread.joinable()) {
            collectionThread.join();
        }
        cout << "Stopped metrics collection" << endl;
    }
    
    void exportMetrics(const string& format = "prometheus") const {
        lock_guard<mutex> lock(registryMutex);
        
        cout << "\n=== Metrics Export (" << format << ") ===" << endl;
        
        for (const auto& metricPair : metrics) {
            const auto& metric = metricPair.second;
            
            cout << "# HELP " << metric->getName() << " " << metric->getDescription() << endl;
            cout << "# TYPE " << metric->getName() << " ";
            
            switch (metric->getType()) {
                case MetricType::COUNTER: cout << "counter"; break;
                case MetricType::GAUGE: cout << "gauge"; break;
                case MetricType::HISTOGRAM: cout << "histogram"; break;
                case MetricType::SUMMARY: cout << "summary"; break;
            }
            cout << endl;
            
            cout << metric->getName() << " " << metric->getCurrentValue() << endl;
        }
    }
    
private:
    void collectionLoop() {
        while (collecting) {
            this_thread::sleep_for(collectionInterval);
            
            // Collect system metrics
            collectSystemMetrics();
        }
    }
    
    void collectSystemMetrics() {
        // Simulate system metric collection
        auto cpuGauge = dynamic_cast<Gauge*>(getMetric("system_cpu_usage"));
        auto memoryGauge = dynamic_cast<Gauge*>(getMetric("system_memory_usage"));
        
        if (cpuGauge) {
            // Simulate CPU usage (0-100%)
            double cpuUsage = 20.0 + (rand() % 60); // 20-80%
            cpuGauge->record(cpuUsage);
        }
        
        if (memoryGauge) {
            // Simulate memory usage (0-100%)
            double memoryUsage = 30.0 + (rand() % 50); // 30-80%
            memoryGauge->record(memoryUsage);
        }
    }
};

// Performance Monitor
class PerformanceMonitor {
private:
    MetricsRegistry& registry;
    Counter* requestCounter;
    Counter* errorCounter;
    Histogram* responseTimeHistogram;
    Gauge* activeConnectionsGauge;
    
public:
    PerformanceMonitor(MetricsRegistry& reg) : registry(reg) {
        // Register performance metrics
        requestCounter = registry.registerMetric(
            make_unique<Counter>("http_requests_total", "Total HTTP requests")
        );
        
        errorCounter = registry.registerMetric(
            make_unique<Counter>("http_errors_total", "Total HTTP errors")
        );
        
        responseTimeHistogram = registry.registerMetric(
            make_unique<Histogram>("http_response_time_seconds", "HTTP response time in seconds",
                                 vector<double>{0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0})
        );
        
        activeConnectionsGauge = registry.registerMetric(
            make_unique<Gauge>("http_active_connections", "Active HTTP connections")
        );
    }
    
    void recordRequest(const string& method, const string& endpoint, 
                      chrono::milliseconds responseTime, int statusCode) {
        map<string, string> labels = {
            {"method", method},
            {"endpoint", endpoint},
            {"status", to_string(statusCode)}
        };
        
        requestCounter->increment(labels);
        
        if (statusCode >= 400) {
            errorCounter->increment(labels);
        }
        
        double responseTimeSeconds = responseTime.count() / 1000.0;
        responseTimeHistogram->record(responseTimeSeconds, labels);
        
        cout << "Recorded request: " << method << " " << endpoint 
             << " (" << statusCode << ") - " << responseTime.count() << "ms" << endl;
    }
    
    void updateActiveConnections(int connections) {
        activeConnectionsGauge->record(connections);
    }
    
    void displayPerformanceStats() const {
        cout << "\n=== Performance Statistics ===" << endl;
        cout << "Total Requests: " << requestCounter->getCurrentValue() << endl;
        cout << "Total Errors: " << errorCounter->getCurrentValue() << endl;
        cout << "Active Connections: " << activeConnectionsGauge->getCurrentValue() << endl;
        cout << "Average Response Time: " << responseTimeHistogram->getCurrentValue() << "s" << endl;
        
        cout << "\nResponse Time Distribution:" << endl;
        responseTimeHistogram->displayBuckets();
        
        double errorRate = requestCounter->getCurrentValue() > 0 ? 
            (errorCounter->getCurrentValue() / requestCounter->getCurrentValue()) * 100 : 0;
        cout << "Error Rate: " << errorRate << "%" << endl;
    }
};
```

---

## 📝 LOGGING AND LOG AGGREGATION

### What is Structured Logging?
**Real-World Analogy**: Like a hospital's medical records system - each patient interaction is logged with structured data (timestamp, patient ID, doctor, treatment) making it easy to search, analyze, and correlate events.

```cpp
// Logging and Log Aggregation Implementation
#include <sstream>
#include <fstream>
#include <iomanip>

// Log Levels
enum class LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
};

// Log Entry
struct LogEntry {
    chrono::system_clock::time_point timestamp;
    LogLevel level;
    string message;
    string logger;
    string thread;
    map<string, string> fields;
    
    LogEntry(LogLevel lvl, const string& msg, const string& loggerName)
        : timestamp(chrono::system_clock::now()), level(lvl), message(msg), logger(loggerName) {
        
        // Get thread ID
        stringstream ss;
        ss << this_thread::get_id();
        thread = ss.str();
    }
    
    string toString() const {
        auto time_t = chrono::system_clock::to_time_t(timestamp);
        auto ms = chrono::duration_cast<chrono::milliseconds>(timestamp.time_since_epoch()) % 1000;
        
        stringstream ss;
        ss << put_time(localtime(&time_t), "%Y-%m-%d %H:%M:%S");
        ss << "." << setfill('0') << setw(3) << ms.count();
        ss << " [" << levelToString(level) << "] ";
        ss << "[" << logger << "] ";
        ss << "[" << thread << "] ";
        ss << message;
        
        if (!fields.empty()) {
            ss << " {";
            bool first = true;
            for (const auto& field : fields) {
                if (!first) ss << ", ";
                ss << field.first << "=" << field.second;
                first = false;
            }
            ss << "}";
        }
        
        return ss.str();
    }
    
    string toJSON() const {
        auto time_t = chrono::system_clock::to_time_t(timestamp);
        
        stringstream ss;
        ss << "{";
        ss << "\"timestamp\":\"" << put_time(gmtime(&time_t), "%Y-%m-%dT%H:%M:%SZ") << "\",";
        ss << "\"level\":\"" << levelToString(level) << "\",";
        ss << "\"logger\":\"" << logger << "\",";
        ss << "\"thread\":\"" << thread << "\",";
        ss << "\"message\":\"" << message << "\"";
        
        for (const auto& field : fields) {
            ss << ",\"" << field.first << "\":\"" << field.second << "\"";
        }
        
        ss << "}";
        return ss.str();
    }
    
private:
    string levelToString(LogLevel level) const {
        switch (level) {
            case LogLevel::TRACE: return "TRACE";
            case LogLevel::DEBUG: return "DEBUG";
            case LogLevel::INFO: return "INFO";
            case LogLevel::WARN: return "WARN";
            case LogLevel::ERROR: return "ERROR";
            case LogLevel::FATAL: return "FATAL";
            default: return "UNKNOWN";
        }
    }
};

// Log Appender Interface
class LogAppender {
public:
    virtual ~LogAppender() = default;
    virtual void append(const LogEntry& entry) = 0;
    virtual void flush() = 0;
};

// Console Appender
class ConsoleAppender : public LogAppender {
private:
    bool useColors;
    
public:
    ConsoleAppender(bool colors = true) : useColors(colors) {}
    
    void append(const LogEntry& entry) override {
        if (useColors) {
            cout << getColorCode(entry.level) << entry.toString() << "\033[0m" << endl;
        } else {
            cout << entry.toString() << endl;
        }
    }
    
    void flush() override {
        cout.flush();
    }
    
private:
    string getColorCode(LogLevel level) const {
        switch (level) {
            case LogLevel::TRACE: return "\033[37m";  // White
            case LogLevel::DEBUG: return "\033[36m";  // Cyan
            case LogLevel::INFO: return "\033[32m";   // Green
            case LogLevel::WARN: return "\033[33m";   // Yellow
            case LogLevel::ERROR: return "\033[31m";  // Red
            case LogLevel::FATAL: return "\033[35m";  // Magenta
            default: return "\033[0m";
        }
    }
};

// File Appender
class FileAppender : public LogAppender {
private:
    string filename;
    ofstream file;
    size_t maxFileSize;
    int maxBackupFiles;
    size_t currentSize;
    
public:
    FileAppender(const string& fname, size_t maxSize = 10 * 1024 * 1024, int maxBackups = 5)
        : filename(fname), maxFileSize(maxSize), maxBackupFiles(maxBackups), currentSize(0) {
        
        file.open(filename, ios::app);
        if (!file.is_open()) {
            throw runtime_error("Failed to open log file: " + filename);
        }
        
        // Get current file size
        file.seekp(0, ios::end);
        currentSize = file.tellp();
    }
    
    ~FileAppender() {
        if (file.is_open()) {
            file.close();
        }
    }
    
    void append(const LogEntry& entry) override {
        string logLine = entry.toString() + "\n";
        
        if (currentSize + logLine.length() > maxFileSize) {
            rotateFile();
        }
        
        file << logLine;
        currentSize += logLine.length();
    }
    
    void flush() override {
        file.flush();
    }
    
private:
    void rotateFile() {
        file.close();
        
        // Rotate backup files
        for (int i = maxBackupFiles - 1; i > 0; i--) {
            string oldFile = filename + "." + to_string(i);
            string newFile = filename + "." + to_string(i + 1);
            
            if (ifstream(oldFile).good()) {
                rename(oldFile.c_str(), newFile.c_str());
            }
        }
        
        // Move current file to .1
        string backupFile = filename + ".1";
        rename(filename.c_str(), backupFile.c_str());
        
        // Open new file
        file.open(filename, ios::out);
        currentSize = 0;
    }
};

// JSON Appender (for log aggregation)
class JSONAppender : public LogAppender {
private:
    string filename;
    ofstream file;
    
public:
    JSONAppender(const string& fname) : filename(fname) {
        file.open(filename, ios::app);
        if (!file.is_open()) {
            throw runtime_error("Failed to open JSON log file: " + filename);
        }
    }
    
    ~JSONAppender() {
        if (file.is_open()) {
            file.close();
        }
    }
    
    void append(const LogEntry& entry) override {
        file << entry.toJSON() << endl;
    }
    
    void flush() override {
        file.flush();
    }
};

// Logger Class
class Logger {
private:
    string name;
    LogLevel minLevel;
    vector<unique_ptr<LogAppender>> appenders;
    mutable mutex loggerMutex;
    
public:
    Logger(const string& loggerName, LogLevel level = LogLevel::INFO)
        : name(loggerName), minLevel(level) {}
    
    void addAppender(unique_ptr<LogAppender> appender) {
        lock_guard<mutex> lock(loggerMutex);
        appenders.push_back(move(appender));
    }
    
    void setLevel(LogLevel level) {
        minLevel = level;
    }
    
    void log(LogLevel level, const string& message, const map<string, string>& fields = {}) {
        if (level < minLevel) {
            return;
        }
        
        LogEntry entry(level, message, name);
        entry.fields = fields;
        
        lock_guard<mutex> lock(loggerMutex);
        for (auto& appender : appenders) {
            appender->append(entry);
        }
    }
    
    void trace(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::TRACE, message, fields);
    }
    
    void debug(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::DEBUG, message, fields);
    }
    
    void info(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::INFO, message, fields);
    }
    
    void warn(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::WARN, message, fields);
    }
    
    void error(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::ERROR, message, fields);
    }
    
    void fatal(const string& message, const map<string, string>& fields = {}) {
        log(LogLevel::FATAL, message, fields);
    }
    
    void flush() {
        lock_guard<mutex> lock(loggerMutex);
        for (auto& appender : appenders) {
            appender->flush();
        }
    }
};

// Log Manager
class LogManager {
private:
    map<string, unique_ptr<Logger>> loggers;
    mutable mutex managerMutex;
    
    static LogManager* instance;
    
    LogManager() = default;
    
public:
    static LogManager& getInstance() {
        if (!instance) {
            instance = new LogManager();
        }
        return *instance;
    }
    
    Logger* getLogger(const string& name) {
        lock_guard<mutex> lock(managerMutex);
        
        auto it = loggers.find(name);
        if (it != loggers.end()) {
            return it->second.get();
        }
        
        // Create new logger
        auto logger = make_unique<Logger>(name);
        Logger* ptr = logger.get();
        loggers[name] = move(logger);
        
        return ptr;
    }
    
    void configureLogger(const string& name, LogLevel level, 
                        const vector<string>& appenderTypes) {
        auto logger = getLogger(name);
        logger->setLevel(level);
        
        for (const string& type : appenderTypes) {
            if (type == "console") {
                logger->addAppender(make_unique<ConsoleAppender>());
            } else if (type == "file") {
                logger->addAppender(make_unique<FileAppender>(name + ".log"));
            } else if (type == "json") {
                logger->addAppender(make_unique<JSONAppender>(name + ".json"));
            }
        }
    }
    
    void flushAll() {
        lock_guard<mutex> lock(managerMutex);
        for (auto& loggerPair : loggers) {
            loggerPair.second->flush();
        }
    }
};

LogManager* LogManager::instance = nullptr;

// Structured Logging Helper
class StructuredLogger {
private:
    Logger* logger;
    map<string, string> contextFields;
    
public:
    StructuredLogger(const string& name) {
        logger = LogManager::getInstance().getLogger(name);
    }
    
    StructuredLogger& withField(const string& key, const string& value) {
        contextFields[key] = value;
        return *this;
    }
    
    StructuredLogger& withRequestId(const string& requestId) {
        return withField("request_id", requestId);
    }
    
    StructuredLogger& withUserId(const string& userId) {
        return withField("user_id", userId);
    }
    
    StructuredLogger& withComponent(const string& component) {
        return withField("component", component);
    }
    
    void info(const string& message, const map<string, string>& additionalFields = {}) {
        auto fields = contextFields;
        fields.insert(additionalFields.begin(), additionalFields.end());
        logger->info(message, fields);
    }
    
    void error(const string& message, const map<string, string>& additionalFields = {}) {
        auto fields = contextFields;
        fields.insert(additionalFields.begin(), additionalFields.end());
        logger->error(message, fields);
    }
    
    void warn(const string& message, const map<string, string>& additionalFields = {}) {
        auto fields = contextFields;
        fields.insert(additionalFields.begin(), additionalFields.end());
        logger->warn(message, fields);
    }
};
```

---

## 🔍 DISTRIBUTED TRACING

### What is Distributed Tracing?
**Real-World Analogy**: Like tracking a package through the postal system - you can see every step from pickup, sorting facilities, transport, and final delivery, with timing and location data at each stage.

```cpp
// Distributed Tracing Implementation
#include <random>

// Trace Context
struct TraceContext {
    string traceId;
    string spanId;
    string parentSpanId;
    map<string, string> baggage;
    
    TraceContext() {
        traceId = generateTraceId();
        spanId = generateSpanId();
    }
    
    TraceContext(const string& trace, const string& parent)
        : traceId(trace), parentSpanId(parent) {
        spanId = generateSpanId();
    }
    
    string serialize() const {
        return traceId + ":" + spanId + ":" + parentSpanId;
    }
    
    static TraceContext deserialize(const string& serialized) {
        size_t pos1 = serialized.find(':');
        size_t pos2 = serialized.find(':', pos1 + 1);
        
        TraceContext context;
        context.traceId = serialized.substr(0, pos1);
        context.spanId = serialized.substr(pos1 + 1, pos2 - pos1 - 1);
        context.parentSpanId = serialized.substr(pos2 + 1);
        
        return context;
    }
    
private:
    string generateTraceId() {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 15);
        
        string id = "";
        for (int i = 0; i < 32; i++) {
            id += "0123456789abcdef"[dis(gen)];
        }
        return id;
    }
    
    string generateSpanId() {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 15);
        
        string id = "";
        for (int i = 0; i < 16; i++) {
            id += "0123456789abcdef"[dis(gen)];
        }
        return id;
    }
};

// Span
class Span {
private:
    TraceContext context;
    string operationName;
    chrono::system_clock::time_point startTime;
    chrono::system_clock::time_point endTime;
    map<string, string> tags;
    vector<pair<chrono::system_clock::time_point, string>> logs;
    bool finished;
    
public:
    Span(const string& operation, const TraceContext& ctx)
        : operationName(operation), context(ctx), startTime(chrono::system_clock::now()), finished(false) {}
    
    Span& setTag(const string& key, const string& value) {
        tags[key] = value;
        return *this;
    }
    
    Span& log(const string& message) {
        logs.emplace_back(chrono::system_clock::now(), message);
        return *this;
    }
    
    void finish() {
        if (!finished) {
            endTime = chrono::system_clock::now();
            finished = true;
        }
    }
    
    chrono::milliseconds getDuration() const {
        auto end = finished ? endTime : chrono::system_clock::now();
        return chrono::duration_cast<chrono::milliseconds>(end - startTime);
    }
    
    // Getters
    const TraceContext& getContext() const { return context; }
    const string& getOperationName() const { return operationName; }
    const map<string, string>& getTags() const { return tags; }
    const vector<pair<chrono::system_clock::time_point, string>>& getLogs() const { return logs; }
    bool isFinished() const { return finished; }
    
    string toJSON() const {
        stringstream ss;
        ss << "{";
        ss << "\"traceId\":\"" << context.traceId << "\",";
        ss << "\"spanId\":\"" << context.spanId << "\",";
        ss << "\"parentSpanId\":\"" << context.parentSpanId << "\",";
        ss << "\"operationName\":\"" << operationName << "\",";
        ss << "\"startTime\":" << chrono::duration_cast<chrono::microseconds>(startTime.time_since_epoch()).count() << ",";
        
        if (finished) {
            ss << "\"duration\":" << getDuration().count() << ",";
        }
        
        ss << "\"tags\":{";
        bool first = true;
        for (const auto& tag : tags) {
            if (!first) ss << ",";
            ss << "\"" << tag.first << "\":\"" << tag.second << "\"";
            first = false;
        }
        ss << "},";
        
        ss << "\"logs\":[";
        first = true;
        for (const auto& logEntry : logs) {
            if (!first) ss << ",";
            ss << "{\"timestamp\":" << chrono::duration_cast<chrono::microseconds>(logEntry.first.time_since_epoch()).count();
            ss << ",\"message\":\"" << logEntry.second << "\"}";
            first = false;
        }
        ss << "]";
        
        ss << "}";
        return ss.str();
    }
};

// Tracer
class Tracer {
private:
    string serviceName;
    vector<unique_ptr<Span>> spans;
    mutable mutex tracerMutex;
    
    // Span reporting
    function<void(const Span&)> spanReporter;
    
public:
    Tracer(const string& service) : serviceName(service) {}
    
    void setSpanReporter(function<void(const Span&)> reporter) {
        spanReporter = reporter;
    }
    
    unique_ptr<Span> startSpan(const string& operationName, const TraceContext* parentContext = nullptr) {
        TraceContext context;
        
        if (parentContext) {
            context = TraceContext(parentContext->traceId, parentContext->spanId);
        }
        
        auto span = make_unique<Span>(operationName, context);
        span->setTag("service.name", serviceName);
        
        cout << "Started span: " << operationName << " (trace: " << context.traceId << ")" << endl;
        
        return span;
    }
    
    void finishSpan(unique_ptr<Span> span) {
        if (span && !span->isFinished()) {
            span->finish();
            
            cout << "Finished span: " << span->getOperationName() 
                 << " (duration: " << span->getDuration().count() << "ms)" << endl;
            
            if (spanReporter) {
                spanReporter(*span);
            }
            
            {
                lock_guard<mutex> lock(tracerMutex);
                spans.push_back(move(span));
            }
        }
    }
    
    vector<string> getTraces() const {
        lock_guard<mutex> lock(tracerMutex);
        
        vector<string> traces;
        for (const auto& span : spans) {
            traces.push_back(span->toJSON());
        }
        return traces;
    }
    
    void displayTraces() const {
        lock_guard<mutex> lock(tracerMutex);
        
        cout << "\n=== Distributed Traces ===" << endl;
        
        map<string, vector<const Span*>> traceGroups;
        for (const auto& span : spans) {
            traceGroups[span->getContext().traceId].push_back(span.get());
        }
        
        for (const auto& traceGroup : traceGroups) {
            cout << "\nTrace ID: " << traceGroup.first << endl;
            
            for (const auto& span : traceGroup.second) {
                cout << "  Span: " << span->getOperationName();
                cout << " (" << span->getDuration().count() << "ms)";
                
                auto tags = span->getTags();
                auto serviceTag = tags.find("service.name");
                if (serviceTag != tags.end()) {
                    cout << " [" << serviceTag->second << "]";
                }
                cout << endl;
            }
        }
    }
};

// Distributed Tracing Context Propagation
class TracingContext {
private:
    static thread_local unique_ptr<TraceContext> currentContext;
    
public:
    static void setCurrentContext(unique_ptr<TraceContext> context) {
        currentContext = move(context);
    }
    
    static TraceContext* getCurrentContext() {
        return currentContext.get();
    }
    
    static void clearCurrentContext() {
        currentContext.reset();
    }
    
    // HTTP header propagation
    static map<string, string> injectHeaders(const TraceContext& context) {
        map<string, string> headers;
        headers["X-Trace-Id"] = context.traceId;
        headers["X-Span-Id"] = context.spanId;
        headers["X-Parent-Span-Id"] = context.parentSpanId;
        
        for (const auto& baggage : context.baggage) {
            headers["X-Baggage-" + baggage.first] = baggage.second;
        }
        
        return headers;
    }
    
    static TraceContext extractFromHeaders(const map<string, string>& headers) {
        TraceContext context;
        
        auto traceIt = headers.find("X-Trace-Id");
        auto spanIt = headers.find("X-Span-Id");
        auto parentIt = headers.find("X-Parent-Span-Id");
        
        if (traceIt != headers.end()) {
            context.traceId = traceIt->second;
        }
        if (spanIt != headers.end()) {
            context.spanId = spanIt->second;
        }
        if (parentIt != headers.end()) {
            context.parentSpanId = parentIt->second;
        }
        
        // Extract baggage
        for (const auto& header : headers) {
            if (header.first.substr(0, 11) == "X-Baggage-") {
                string key = header.first.substr(11);
                context.baggage[key] = header.second;
            }
        }
        
        return context;
    }
};

thread_local unique_ptr<TraceContext> TracingContext::currentContext = nullptr;
```

---

## 📊 DASHBOARDS AND VISUALIZATION

### What are Monitoring Dashboards?
**Real-World Analogy**: Like an airplane cockpit - pilots need real-time visibility into altitude, speed, fuel, weather, and system status to make informed decisions during flight.

```cpp
// Dashboard and Visualization Implementation

// Dashboard Widget Types
enum class WidgetType {
    LINE_CHART,
    BAR_CHART,
    GAUGE,
    COUNTER,
    TABLE,
    HEATMAP
};

// Dashboard Widget
class DashboardWidget {
protected:
    string id;
    string title;
    WidgetType type;
    map<string, string> configuration;
    
public:
    DashboardWidget(const string& widgetId, const string& widgetTitle, WidgetType widgetType)
        : id(widgetId), title(widgetTitle), type(widgetType) {}
    
    virtual ~DashboardWidget() = default;
    
    string getId() const { return id; }
    string getTitle() const { return title; }
    WidgetType getType() const { return type; }
    
    void setConfiguration(const string& key, const string& value) {
        configuration[key] = value;
    }
    
    virtual string render(const vector<DataPoint>& data) = 0;
    virtual string toJSON() const = 0;
};

// Line Chart Widget
class LineChartWidget : public DashboardWidget {
private:
    string metricName;
    chrono::hours timeRange;
    
public:
    LineChartWidget(const string& id, const string& title, const string& metric, 
                   chrono::hours range = chrono::hours(1))
        : DashboardWidget(id, title, WidgetType::LINE_CHART), metricName(metric), timeRange(range) {}
    
    string render(const vector<DataPoint>& data) override {
        stringstream ss;
        ss << "Line Chart: " << title << endl;
        ss << "Metric: " << metricName << endl;
        ss << "Time Range: " << timeRange.count() << " hours" << endl;
        
        if (!data.empty()) {
            ss << "Data Points: " << data.size() << endl;
            ss << "Latest Value: " << data.back().value << endl;
            
            // Simple ASCII chart
            ss << "Chart: ";
            for (size_t i = 0; i < min(data.size(), size_t(20)); i++) {
                int height = static_cast<int>(data[i].value / 10); // Scale for display
                ss << string(max(1, height), '*') << " ";
            }
            ss << endl;
        }
        
        return ss.str();
    }
    
    string toJSON() const override {
        stringstream ss;
        ss << "{";
        ss << "\"id\":\"" << id << "\",";
        ss << "\"title\":\"" << title << "\",";
        ss << "\"type\":\"line_chart\",";
        ss << "\"metric\":\"" << metricName << "\",";
        ss << "\"timeRange\":" << timeRange.count();
        ss << "}";
        return ss.str();
    }
};

// Gauge Widget
class GaugeWidget : public DashboardWidget {
private:
    string metricName;
    double minValue;
    double maxValue;
    double warningThreshold;
    double criticalThreshold;
    
public:
    GaugeWidget(const string& id, const string& title, const string& metric,
               double min = 0, double max = 100, double warning = 70, double critical = 90)
        : DashboardWidget(id, title, WidgetType::GAUGE), metricName(metric),
          minValue(min), maxValue(max), warningThreshold(warning), criticalThreshold(critical) {}
    
    string render(const vector<DataPoint>& data) override {
        stringstream ss;
        ss << "Gauge: " << title << endl;
        ss << "Metric: " << metricName << endl;
        
        if (!data.empty()) {
            double currentValue = data.back().value;
            ss << "Current Value: " << currentValue << endl;
            
            // Determine status
            string status = "OK";
            if (currentValue >= criticalThreshold) {
                status = "CRITICAL";
            } else if (currentValue >= warningThreshold) {
                status = "WARNING";
            }
            
            ss << "Status: " << status << endl;
            
            // Simple gauge visualization
            double percentage = (currentValue - minValue) / (maxValue - minValue) * 100;
            int filled = static_cast<int>(percentage / 5); // 20 segments
            
            ss << "Gauge: [";
            for (int i = 0; i < 20; i++) {
                if (i < filled) {
                    if (percentage >= 90) ss << "#";
                    else if (percentage >= 70) ss << "=";
                    else ss << "-";
                } else {
                    ss << " ";
                }
            }
            ss << "] " << percentage << "%" << endl;
        }
        
        return ss.str();
    }
    
    string toJSON() const override {
        stringstream ss;
        ss << "{";
        ss << "\"id\":\"" << id << "\",";
        ss << "\"title\":\"" << title << "\",";
        ss << "\"type\":\"gauge\",";
        ss << "\"metric\":\"" << metricName << "\",";
        ss << "\"min\":" << minValue << ",";
        ss << "\"max\":" << maxValue << ",";
        ss << "\"warning\":" << warningThreshold << ",";
        ss << "\"critical\":" << criticalThreshold;
        ss << "}";
        return ss.str();
    }
};

// Dashboard
class Dashboard {
private:
    string id;
    string title;
    vector<unique_ptr<DashboardWidget>> widgets;
    MetricsRegistry& metricsRegistry;
    
    chrono::seconds refreshInterval;
    thread refreshThread;
    atomic<bool> autoRefresh{false};
    
public:
    Dashboard(const string& dashboardId, const string& dashboardTitle, MetricsRegistry& registry)
        : id(dashboardId), title(dashboardTitle), metricsRegistry(registry), 
          refreshInterval(chrono::seconds(30)) {}
    
    ~Dashboard() {
        stopAutoRefresh();
    }
    
    void addWidget(unique_ptr<DashboardWidget> widget) {
        widgets.push_back(move(widget));
        cout << "Added widget to dashboard: " << widgets.back()->getTitle() << endl;
    }
    
    void startAutoRefresh() {
        autoRefresh = true;
        refreshThread = thread(&Dashboard::refreshLoop, this);
        cout << "Started auto-refresh for dashboard: " << title << endl;
    }
    
    void stopAutoRefresh() {
        autoRefresh = false;
        if (refreshThread.joinable()) {
            refreshThread.join();
        }
    }
    
    void render() {
        cout << "\n" << string(60, '=') << endl;
        cout << "Dashboard: " << title << endl;
        cout << "Last Updated: " << getCurrentTimestamp() << endl;
        cout << string(60, '=') << endl;
        
        for (const auto& widget : widgets) {
            cout << "\n" << widget->render(getWidgetData(widget.get())) << endl;
        }
    }
    
    string exportToJSON() const {
        stringstream ss;
        ss << "{";
        ss << "\"id\":\"" << id << "\",";
        ss << "\"title\":\"" << title << "\",";
        ss << "\"widgets\":[";
        
        bool first = true;
        for (const auto& widget : widgets) {
            if (!first) ss << ",";
            ss << widget->toJSON();
            first = false;
        }
        
        ss << "]";
        ss << "}";
        return ss.str();
    }
    
private:
    vector<DataPoint> getWidgetData(DashboardWidget* widget) {
        // Simulate getting data for widget (in reality, would query metrics)
        vector<DataPoint> data;
        
        // Generate sample data
        auto now = chrono::system_clock::now();
        for (int i = 0; i < 10; i++) {
            auto timestamp = now - chrono::minutes(i * 5);
            double value = 50 + (rand() % 40); // Random value between 50-90
            data.emplace_back(value);
            data.back().timestamp = timestamp;
        }
        
        reverse(data.begin(), data.end()); // Chronological order
        return data;
    }
    
    string getCurrentTimestamp() const {
        auto now = chrono::system_clock::now();
        auto time_t = chrono::system_clock::to_time_t(now);
        
        stringstream ss;
        ss << put_time(localtime(&time_t), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }
    
    void refreshLoop() {
        while (autoRefresh) {
            this_thread::sleep_for(refreshInterval);
            if (autoRefresh) {
                render();
            }
        }
    }
};

// Dashboard Manager
class DashboardManager {
private:
    map<string, unique_ptr<Dashboard>> dashboards;
    MetricsRegistry& metricsRegistry;
    
public:
    DashboardManager(MetricsRegistry& registry) : metricsRegistry(registry) {}
    
    Dashboard* createDashboard(const string& id, const string& title) {
        auto dashboard = make_unique<Dashboard>(id, title, metricsRegistry);
        Dashboard* ptr = dashboard.get();
        dashboards[id] = move(dashboard);
        
        cout << "Created dashboard: " << title << endl;
        return ptr;
    }
    
    Dashboard* getDashboard(const string& id) {
        auto it = dashboards.find(id);
        return (it != dashboards.end()) ? it->second.get() : nullptr;
    }
    
    void createSystemDashboard() {
        auto dashboard = createDashboard("system", "System Overview");
        
        // Add system metrics widgets
        dashboard->addWidget(make_unique<GaugeWidget>("cpu_gauge", "CPU Usage", "system_cpu_usage"));
        dashboard->addWidget(make_unique<GaugeWidget>("memory_gauge", "Memory Usage", "system_memory_usage"));
        dashboard->addWidget(make_unique<LineChartWidget>("requests_chart", "Request Rate", "http_requests_total"));
        dashboard->addWidget(make_unique<LineChartWidget>("response_time_chart", "Response Time", "http_response_time_seconds"));
    }
    
    void createApplicationDashboard() {
        auto dashboard = createDashboard("application", "Application Metrics");
        
        dashboard->addWidget(make_unique<LineChartWidget>("error_rate_chart", "Error Rate", "http_errors_total"));
        dashboard->addWidget(make_unique<GaugeWidget>("active_connections_gauge", "Active Connections", "http_active_connections"));
    }
    
    vector<string> getDashboardList() const {
        vector<string> dashboardIds;
        for (const auto& dashboard : dashboards) {
            dashboardIds.push_back(dashboard.first);
        }
        return dashboardIds;
    }
};
```

---

## 🚨 ALERTING AND INCIDENT RESPONSE

### What is Alerting?
**Real-World Analogy**: Like a home security system - motion sensors detect intrusions, smoke detectors identify fires, and the central system notifies homeowners and emergency services based on severity and escalation rules.

```cpp
// Alerting and Incident Response Implementation

// Alert Severity
enum class AlertSeverity {
    INFO,
    WARNING,
    CRITICAL,
    FATAL
};

// Alert Rule
class AlertRule {
private:
    string id;
    string name;
    string metricName;
    string condition; // "greater_than", "less_than", "equals"
    double threshold;
    chrono::minutes evaluationWindow;
    AlertSeverity severity;
    bool enabled;
    
public:
    AlertRule(const string& ruleId, const string& ruleName, const string& metric,
             const string& cond, double thresh, AlertSeverity sev,
             chrono::minutes window = chrono::minutes(5))
        : id(ruleId), name(ruleName), metricName(metric), condition(cond),
          threshold(thresh), severity(sev), evaluationWindow(window), enabled(true) {}
    
    bool evaluate(const vector<DataPoint>& data) const {
        if (!enabled || data.empty()) {
            return false;
        }
        
        // Get recent data within evaluation window
        auto now = chrono::system_clock::now();
        auto windowStart = now - evaluationWindow;
        
        vector<double> recentValues;
        for (const auto& point : data) {
            if (point.timestamp >= windowStart) {
                recentValues.push_back(point.value);
            }
        }
        
        if (recentValues.empty()) {
            return false;
        }
        
        // Calculate average for evaluation
        double average = accumulate(recentValues.begin(), recentValues.end(), 0.0) / recentValues.size();
        
        // Evaluate condition
        if (condition == "greater_than") {
            return average > threshold;
        } else if (condition == "less_than") {
            return average < threshold;
        } else if (condition == "equals") {
            return abs(average - threshold) < 0.001;
        }
        
        return false;
    }
    
    // Getters
    string getId() const { return id; }
    string getName() const { return name; }
    string getMetricName() const { return metricName; }
    AlertSeverity getSeverity() const { return severity; }
    bool isEnabled() const { return enabled; }
    
    void setEnabled(bool enable) { enabled = enable; }
    
    string toString() const {
        stringstream ss;
        ss << name << ": " << metricName << " " << condition << " " << threshold;
        ss << " (severity: " << severityToString(severity) << ")";
        return ss.str();
    }
    
private:
    string severityToString(AlertSeverity sev) const {
        switch (sev) {
            case AlertSeverity::INFO: return "INFO";
            case AlertSeverity::WARNING: return "WARNING";
            case AlertSeverity::CRITICAL: return "CRITICAL";
            case AlertSeverity::FATAL: return "FATAL";
            default: return "UNKNOWN";
        }
    }
};

// Alert
struct Alert {
    string id;
    string ruleName;
    string metricName;
    AlertSeverity severity;
    double currentValue;
    double threshold;
    chrono::system_clock::time_point triggeredAt;
    chrono::system_clock::time_point resolvedAt;
    bool resolved;
    string description;
    
    Alert(const string& alertId, const AlertRule& rule, double value)
        : id(alertId), ruleName(rule.getName()), metricName(rule.getMetricName()),
          severity(rule.getSeverity()), currentValue(value), threshold(0),
          triggeredAt(chrono::system_clock::now()), resolved(false) {
        
        description = "Alert triggered for " + metricName + " with value " + to_string(value);
    }
    
    void resolve() {
        resolved = true;
        resolvedAt = chrono::system_clock::now();
    }
    
    chrono::milliseconds getDuration() const {
        auto end = resolved ? resolvedAt : chrono::system_clock::now();
        return chrono::duration_cast<chrono::milliseconds>(end - triggeredAt);
    }
};

// Notification Channel Interface
class NotificationChannel {
public:
    virtual ~NotificationChannel() = default;
    virtual void sendNotification(const Alert& alert) = 0;
    virtual string getChannelType() const = 0;
};

// Email Notification Channel
class EmailNotificationChannel : public NotificationChannel {
private:
    vector<string> recipients;
    
public:
    EmailNotificationChannel(const vector<string>& emails) : recipients(emails) {}
    
    void sendNotification(const Alert& alert) override {
        cout << "EMAIL ALERT: Sending to " << recipients.size() << " recipients" << endl;
        cout << "Subject: [" << severityToString(alert.severity) << "] " << alert.ruleName << endl;
        cout << "Body: " << alert.description << endl;
        cout << "Current Value: " << alert.currentValue << endl;
        cout << "Triggered At: " << formatTimestamp(alert.triggeredAt) << endl;
        
        // Simulate email sending delay
        this_thread::sleep_for(chrono::milliseconds(100));
    }
    
    string getChannelType() const override {
        return "email";
    }
    
private:
    string severityToString(AlertSeverity severity) const {
        switch (severity) {
            case AlertSeverity::INFO: return "INFO";
            case AlertSeverity::WARNING: return "WARNING";
            case AlertSeverity::CRITICAL: return "CRITICAL";
            case AlertSeverity::FATAL: return "FATAL";
            default: return "UNKNOWN";
        }
    }
    
    string formatTimestamp(const chrono::system_clock::time_point& timestamp) const {
        auto time_t = chrono::system_clock::to_time_t(timestamp);
        stringstream ss;
        ss << put_time(localtime(&time_t), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }
};

// Slack Notification Channel
class SlackNotificationChannel : public NotificationChannel {
private:
    string webhookUrl;
    string channel;
    
public:
    SlackNotificationChannel(const string& webhook, const string& slackChannel)
        : webhookUrl(webhook), channel(slackChannel) {}
    
    void sendNotification(const Alert& alert) override {
        cout << "SLACK ALERT: Sending to channel " << channel << endl;
        cout << "Webhook: " << webhookUrl << endl;
        
        string emoji = getEmojiForSeverity(alert.severity);
        cout << emoji << " *" << alert.ruleName << "*" << endl;
        cout << "Metric: " << alert.metricName << endl;
        cout << "Current Value: " << alert.currentValue << endl;
        cout << "Status: " << (alert.resolved ? "RESOLVED" : "ACTIVE") << endl;
        
        // Simulate Slack API call
        this_thread::sleep_for(chrono::milliseconds(50));
    }
    
    string getChannelType() const override {
        return "slack";
    }
    
private:
    string getEmojiForSeverity(AlertSeverity severity) const {
        switch (severity) {
            case AlertSeverity::INFO: return ":information_source:";
            case AlertSeverity::WARNING: return ":warning:";
            case AlertSeverity::CRITICAL: return ":rotating_light:";
            case AlertSeverity::FATAL: return ":fire:";
            default: return ":question:";
        }
    }
};

// Alert Manager
class AlertManager {
private:
    vector<unique_ptr<AlertRule>> rules;
    vector<unique_ptr<NotificationChannel>> channels;
    map<string, unique_ptr<Alert>> activeAlerts;
    vector<unique_ptr<Alert>> alertHistory;
    
    MetricsRegistry& metricsRegistry;
    
    thread evaluationThread;
    atomic<bool> evaluating{false};
    chrono::seconds evaluationInterval;
    
    mutable mutex alertMutex;
    
public:
    AlertManager(MetricsRegistry& registry, chrono::seconds interval = chrono::seconds(30))
        : metricsRegistry(registry), evaluationInterval(interval) {}
    
    ~AlertManager() {
        stopEvaluation();
    }
    
    void addRule(unique_ptr<AlertRule> rule) {
        rules.push_back(move(rule));
        cout << "Added alert rule: " << rules.back()->getName() << endl;
    }
    
    void addNotificationChannel(unique_ptr<NotificationChannel> channel) {
        channels.push_back(move(channel));
        cout << "Added notification channel: " << channels.back()->getChannelType() << endl;
    }
    
    void startEvaluation() {
        evaluating = true;
        evaluationThread = thread(&AlertManager::evaluationLoop, this);
        cout << "Started alert evaluation" << endl;
    }
    
    void stopEvaluation() {
        evaluating = false;
        if (evaluationThread.joinable()) {
            evaluationThread.join();
        }
        cout << "Stopped alert evaluation" << endl;
    }
    
    void triggerAlert(const AlertRule& rule, double currentValue) {
        lock_guard<mutex> lock(alertMutex);
        
        string alertId = generateAlertId();
        auto alert = make_unique<Alert>(alertId, rule, currentValue);
        
        cout << "ALERT TRIGGERED: " << alert->ruleName << " (Value: " << currentValue << ")" << endl;
        
        // Send notifications
        for (const auto& channel : channels) {
            channel->sendNotification(*alert);
        }
        
        activeAlerts[alertId] = move(alert);
    }
    
    void resolveAlert(const string& alertId) {
        lock_guard<mutex> lock(alertMutex);
        
        auto it = activeAlerts.find(alertId);
        if (it != activeAlerts.end()) {
            it->second->resolve();
            
            cout << "ALERT RESOLVED: " << it->second->ruleName 
                 << " (Duration: " << it->second->getDuration().count() << "ms)" << endl;
            
            // Move to history
            alertHistory.push_back(move(it->second));
            activeAlerts.erase(it);
        }
    }
    
    void displayActiveAlerts() const {
        lock_guard<mutex> lock(alertMutex);
        
        cout << "\n=== Active Alerts ===" << endl;
        if (activeAlerts.empty()) {
            cout << "No active alerts" << endl;
            return;
        }
        
        for (const auto& alertPair : activeAlerts) {
            const auto& alert = alertPair.second;
            cout << "Alert ID: " << alert->id << endl;
            cout << "Rule: " << alert->ruleName << endl;
            cout << "Severity: " << severityToString(alert->severity) << endl;
            cout << "Current Value: " << alert->currentValue << endl;
            cout << "Duration: " << alert->getDuration().count() << "ms" << endl;
            cout << "---" << endl;
        }
    }
    
    void displayAlertStats() const {
        lock_guard<mutex> lock(alertMutex);
        
        cout << "\n=== Alert Statistics ===" << endl;
        cout << "Active Alerts: " << activeAlerts.size() << endl;
        cout << "Total Alert History: " << alertHistory.size() << endl;
        cout << "Alert Rules: " << rules.size() << endl;
        cout << "Notification Channels: " << channels.size() << endl;
        
        // Count by severity
        map<AlertSeverity, int> severityCounts;
        for (const auto& alertPair : activeAlerts) {
            severityCounts[alertPair.second->severity]++;
        }
        
        cout << "\nActive Alerts by Severity:" << endl;
        for (const auto& count : severityCounts) {
            cout << "  " << severityToString(count.first) << ": " << count.second << endl;
        }
    }
    
private:
    void evaluationLoop() {
        while (evaluating) {
            this_thread::sleep_for(evaluationInterval);
            
            if (!evaluating) break;
            
            evaluateRules();
        }
    }
    
    void evaluateRules() {
        for (const auto& rule : rules) {
            if (!rule->isEnabled()) {
                continue;
            }
            
            // Get metric data (simplified - in reality, would query from metrics registry)
            vector<DataPoint> data = getMetricData(rule->getMetricName());
            
            if (rule->evaluate(data)) {
                // Check if alert already exists
                bool alertExists = false;
                {
                    lock_guard<mutex> lock(alertMutex);
                    for (const auto& alertPair : activeAlerts) {
                        if (alertPair.second->ruleName == rule->getName()) {
                            alertExists = true;
                            break;
                        }
                    }
                }
                
                if (!alertExists) {
                    double currentValue = data.empty() ? 0.0 : data.back().value;
                    triggerAlert(*rule, currentValue);
                }
            }
        }
    }
    
    vector<DataPoint> getMetricData(const string& metricName) {
        // Simulate getting metric data
        vector<DataPoint> data;
        auto now = chrono::system_clock::now();
        
        for (int i = 0; i < 5; i++) {
            auto timestamp = now - chrono::minutes(i);
            double value = 50 + (rand() % 50); // Random value 50-100
            data.emplace_back(value);
            data.back().timestamp = timestamp;
        }
        
        return data;
    }
    
    string generateAlertId() {
        static atomic<int> counter{0};
        return "alert_" + to_string(++counter);
    }
    
    string severityToString(AlertSeverity severity) const {
        switch (severity) {
            case AlertSeverity::INFO: return "INFO";
            case AlertSeverity::WARNING: return "WARNING";
            case AlertSeverity::CRITICAL: return "CRITICAL";
            case AlertSeverity::FATAL: return "FATAL";
            default: return "UNKNOWN";
        }
    }
};

// SRE (Site Reliability Engineering) Metrics
class SREMetrics {
private:
    MetricsRegistry& registry;
    
    // SLI (Service Level Indicators)
    Counter* totalRequests;
    Counter* successfulRequests;
    Histogram* latencyHistogram;
    Gauge* availabilityGauge;
    
    // SLO (Service Level Objectives)
    double availabilitySLO; // 99.9%
    double latencySLO; // 95th percentile < 200ms
    double errorRateSLO; // < 0.1%
    
public:
    SREMetrics(MetricsRegistry& reg) : registry(reg), 
        availabilitySLO(99.9), latencySLO(200.0), errorRateSLO(0.1) {
        
        totalRequests = registry.registerMetric(
            make_unique<Counter>("sli_requests_total", "Total requests for SLI calculation")
        );
        
        successfulRequests = registry.registerMetric(
            make_unique<Counter>("sli_requests_successful", "Successful requests for SLI calculation")
        );
        
        latencyHistogram = registry.registerMetric(
            make_unique<Histogram>("sli_latency_seconds", "Request latency for SLI calculation")
        );
        
        availabilityGauge = registry.registerMetric(
            make_unique<Gauge>("sli_availability_percentage", "Current availability percentage")
        );
    }
    
    void recordRequest(bool successful, chrono::milliseconds latency) {
        totalRequests->increment();
        
        if (successful) {
            successfulRequests->increment();
        }
        
        double latencySeconds = latency.count() / 1000.0;
        latencyHistogram->record(latencySeconds);
        
        updateAvailability();
    }
    
    void updateAvailability() {
        double total = totalRequests->getCurrentValue();
        double successful = successfulRequests->getCurrentValue();
        
        if (total > 0) {
            double availability = (successful / total) * 100.0;
            availabilityGauge->record(availability);
        }
    }
    
    void displaySLIStatus() const {
        cout << "\n=== SRE Metrics (SLI/SLO Status) ===" << endl;
        
        double availability = availabilityGauge->getCurrentValue();
        double p95Latency = latencyHistogram->getQuantile(0.95) * 1000; // Convert to ms
        double errorRate = calculateErrorRate();
        
        cout << "Availability: " << availability << "% (SLO: " << availabilitySLO << "%)" << endl;
        cout << "Status: " << (availability >= availabilitySLO ? "✓ MEETING SLO" : "✗ VIOLATING SLO") << endl;
        
        cout << "\nLatency (95th percentile): " << p95Latency << "ms (SLO: " << latencySLO << "ms)" << endl;
        cout << "Status: " << (p95Latency <= latencySLO ? "✓ MEETING SLO" : "✗ VIOLATING SLO") << endl;
        
        cout << "\nError Rate: " << errorRate << "% (SLO: " << errorRateSLO << "%)" << endl;
        cout << "Status: " << (errorRate <= errorRateSLO ? "✓ MEETING SLO" : "✗ VIOLATING SLO") << endl;
        
        // Error Budget
        double errorBudget = calculateErrorBudget();
        cout << "\nError Budget Remaining: " << errorBudget << "%" << endl;
    }
    
private:
    double calculateErrorRate() const {
        double total = totalRequests->getCurrentValue();
        double successful = successfulRequests->getCurrentValue();
        
        if (total == 0) return 0.0;
        
        return ((total - successful) / total) * 100.0;
    }
    
    double calculateErrorBudget() const {
        double allowedErrorRate = 100.0 - availabilitySLO;
        double currentErrorRate = calculateErrorRate();
        
        return max(0.0, allowedErrorRate - currentErrorRate);
    }
};
```

---

## ⚡ Key Takeaways

1. **Metrics** provide quantitative measurements of system behavior and performance
2. **Structured logging** enables efficient searching, filtering, and correlation of events
3. **Distributed tracing** tracks requests across multiple services for end-to-end visibility
4. **Dashboards** visualize system health and performance in real-time
5. **Alerting** proactively notifies teams of issues before they impact users
6. **SRE practices** use SLIs/SLOs to maintain reliability and measure user experience
7. **Observability** combines metrics, logs, and traces for comprehensive system understanding

## 🎯 Next Steps

- Study observability tools (Prometheus, Grafana, Jaeger, ELK Stack)
- Learn about SRE practices and error budget management
- Explore advanced monitoring patterns (synthetic monitoring, chaos engineering)
- Practice implementing custom metrics and dashboards
- Understand compliance and audit logging requirements
- Study performance profiling and optimization techniques

---
*"Observability is not about collecting data; it's about understanding your system's behavior to make informed decisions."* - Charity Majors 📊
