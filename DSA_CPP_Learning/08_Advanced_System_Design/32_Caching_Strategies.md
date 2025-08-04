# Caching Strategies - Optimizing System Performance

## 🌟 Real-World Story: The Efficient Library System

Imagine you're managing a massive library with millions of books. To serve readers efficiently, you implement different caching strategies:

- **Reading Room Cache** (L1 Cache): Keep the most popular books right at the reading desks
- **Floor Collections** (L2 Cache): Store frequently requested books on each floor
- **Main Catalog** (Database): The complete collection in the basement storage
- **Interlibrary Loans** (CDN): Borrow popular books from nearby libraries
- **Reservation System** (Write-through): Update all locations when new books arrive
- **Periodic Updates** (Write-behind): Batch update the catalog system overnight

Just like a well-organized library system, effective caching strategies dramatically improve system performance by keeping frequently accessed data close to where it's needed!

## 🎯 Why Caching Matters

### Real Applications:
- **Facebook**: Serves 3 billion users with massive caching layers (Memcached, TAO)
- **Netflix**: Uses CDN caching to stream content globally with minimal latency
- **Google**: Caches search results and web pages across thousands of edge servers
- **Amazon**: Product catalogs cached at multiple levels for instant page loads

## 📊 Caching Strategy Types

### 🏠 Cache Levels and Hierarchies
### 📝 Cache Patterns and Policies
### 🔄 Cache Consistency Models
### 🌐 Distributed Caching
### ⚡ Cache Optimization Techniques

---

## 🏠 CACHE LEVELS AND HIERARCHIES

### What are Cache Levels?
**Real-World Analogy**: Like organizing your workspace - frequently used items on your desk (L1), office supplies in desk drawers (L2), and archived files in storage cabinets (L3).

```cpp
// Multi-level cache hierarchy implementation
#include <unordered_map>
#include <list>
#include <chrono>
#include <atomic>

// Base cache interface
template<typename Key, typename Value>
class Cache {
public:
    virtual ~Cache() = default;
    virtual bool get(const Key& key, Value& value) = 0;
    virtual void put(const Key& key, const Value& value) = 0;
    virtual void remove(const Key& key) = 0;
    virtual void clear() = 0;
    virtual size_t size() const = 0;
    virtual double getHitRate() const = 0;
};

// LRU Cache implementation
template<typename Key, typename Value>
class LRUCache : public Cache<Key, Value> {
private:
    struct CacheNode {
        Key key;
        Value value;
        typename list<CacheNode>::iterator listIt;
        chrono::steady_clock::time_point accessTime;
        
        CacheNode(const Key& k, const Value& v) 
            : key(k), value(v), accessTime(chrono::steady_clock::now()) {}
    };
    
    size_t capacity;
    unordered_map<Key, CacheNode> cache;
    list<CacheNode> accessOrder; // Most recent at front
    
    // Statistics
    mutable atomic<int> hits{0};
    mutable atomic<int> misses{0};
    mutable mutex cacheMutex;
    
public:
    LRUCache(size_t cap) : capacity(cap) {}
    
    bool get(const Key& key, Value& value) override {
        lock_guard<mutex> lock(cacheMutex);
        
        auto it = cache.find(key);
        if (it == cache.end()) {
            misses++;
            return false; // Cache miss
        }
        
        // Move to front (most recently used)
        accessOrder.erase(it->second.listIt);
        accessOrder.push_front(it->second);
        it->second.listIt = accessOrder.begin();
        it->second.accessTime = chrono::steady_clock::now();
        
        value = it->second.value;
        hits++;
        return true; // Cache hit
    }
    
    void put(const Key& key, const Value& value) override {
        lock_guard<mutex> lock(cacheMutex);
        
        auto it = cache.find(key);
        if (it != cache.end()) {
            // Update existing key
            accessOrder.erase(it->second.listIt);
            it->second.value = value;
            it->second.accessTime = chrono::steady_clock::now();
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
        accessOrder.push_front(CacheNode(key, value));
        cache[key] = accessOrder.front();
        cache[key].listIt = accessOrder.begin();
    }
    
    void remove(const Key& key) override {
        lock_guard<mutex> lock(cacheMutex);
        
        auto it = cache.find(key);
        if (it != cache.end()) {
            accessOrder.erase(it->second.listIt);
            cache.erase(it);
        }
    }
    
    void clear() override {
        lock_guard<mutex> lock(cacheMutex);
        cache.clear();
        accessOrder.clear();
    }
    
    size_t size() const override {
        lock_guard<mutex> lock(cacheMutex);
        return cache.size();
    }
    
    double getHitRate() const override {
        int totalRequests = hits.load() + misses.load();
        return totalRequests > 0 ? (double)hits.load() / totalRequests : 0.0;
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(cacheMutex);
        cout << "LRU Cache Stats - Size: " << cache.size() << "/" << capacity
             << ", Hit Rate: " << (getHitRate() * 100) << "%"
             << ", Hits: " << hits.load() << ", Misses: " << misses.load() << endl;
    }
};

// LFU (Least Frequently Used) Cache
template<typename Key, typename Value>
class LFUCache : public Cache<Key, Value> {
private:
    struct CacheNode {
        Key key;
        Value value;
        int frequency;
        chrono::steady_clock::time_point lastAccess;
        
        CacheNode(const Key& k, const Value& v) 
            : key(k), value(v), frequency(1), lastAccess(chrono::steady_clock::now()) {}
    };
    
    size_t capacity;
    unordered_map<Key, CacheNode> cache;
    map<int, list<Key>> frequencyGroups; // frequency -> list of keys
    unordered_map<Key, typename list<Key>::iterator> keyPositions;
    int minFrequency;
    
    mutable atomic<int> hits{0};
    mutable atomic<int> misses{0};
    mutable mutex cacheMutex;
    
public:
    LFUCache(size_t cap) : capacity(cap), minFrequency(0) {}
    
    bool get(const Key& key, Value& value) override {
        lock_guard<mutex> lock(cacheMutex);
        
        auto it = cache.find(key);
        if (it == cache.end()) {
            misses++;
            return false;
        }
        
        // Update frequency
        updateFrequency(key);
        value = it->second.value;
        hits++;
        return true;
    }
    
    void put(const Key& key, const Value& value) override {
        lock_guard<mutex> lock(cacheMutex);
        
        if (capacity == 0) return;
        
        auto it = cache.find(key);
        if (it != cache.end()) {
            // Update existing key
            it->second.value = value;
            updateFrequency(key);
            return;
        }
        
        // Add new key
        if (cache.size() >= capacity) {
            evictLFU();
        }
        
        // Insert new item
        cache[key] = CacheNode(key, value);
        frequencyGroups[1].push_back(key);
        keyPositions[key] = prev(frequencyGroups[1].end());
        minFrequency = 1;
    }
    
    void remove(const Key& key) override {
        lock_guard<mutex> lock(cacheMutex);
        
        auto it = cache.find(key);
        if (it != cache.end()) {
            removeFromFrequencyGroup(key, it->second.frequency);
            cache.erase(it);
        }
    }
    
    void clear() override {
        lock_guard<mutex> lock(cacheMutex);
        cache.clear();
        frequencyGroups.clear();
        keyPositions.clear();
        minFrequency = 0;
    }
    
    size_t size() const override {
        lock_guard<mutex> lock(cacheMutex);
        return cache.size();
    }
    
    double getHitRate() const override {
        int totalRequests = hits.load() + misses.load();
        return totalRequests > 0 ? (double)hits.load() / totalRequests : 0.0;
    }
    
private:
    void updateFrequency(const Key& key) {
        auto& node = cache[key];
        int oldFreq = node.frequency;
        int newFreq = oldFreq + 1;
        
        // Remove from old frequency group
        removeFromFrequencyGroup(key, oldFreq);
        
        // Add to new frequency group
        node.frequency = newFreq;
        node.lastAccess = chrono::steady_clock::now();
        frequencyGroups[newFreq].push_back(key);
        keyPositions[key] = prev(frequencyGroups[newFreq].end());
        
        // Update minimum frequency
        if (frequencyGroups[minFrequency].empty()) {
            minFrequency++;
        }
    }
    
    void removeFromFrequencyGroup(const Key& key, int frequency) {
        auto& group = frequencyGroups[frequency];
        auto pos = keyPositions[key];
        group.erase(pos);
        keyPositions.erase(key);
        
        if (group.empty() && frequency == minFrequency) {
            minFrequency++;
        }
    }
    
    void evictLFU() {
        // Remove least frequently used item
        auto& lfuGroup = frequencyGroups[minFrequency];
        Key lfuKey = lfuGroup.front();
        
        lfuGroup.pop_front();
        keyPositions.erase(lfuKey);
        cache.erase(lfuKey);
        
        if (lfuGroup.empty()) {
            frequencyGroups.erase(minFrequency);
        }
    }
};

// Multi-level cache hierarchy
template<typename Key, typename Value>
class MultiLevelCache {
private:
    vector<unique_ptr<Cache<Key, Value>>> cacheLevels;
    vector<string> levelNames;
    
    // Statistics
    mutable atomic<int> totalRequests{0};
    mutable vector<atomic<int>> levelHits;
    
public:
    MultiLevelCache() {}
    
    void addLevel(unique_ptr<Cache<Key, Value>> cache, const string& name) {
        cacheLevels.push_back(move(cache));
        levelNames.push_back(name);
        levelHits.emplace_back(0);
        cout << "Added cache level: " << name << endl;
    }
    
    bool get(const Key& key, Value& value) {
        totalRequests++;
        
        // Check each level from fastest to slowest
        for (size_t i = 0; i < cacheLevels.size(); i++) {
            if (cacheLevels[i]->get(key, value)) {
                levelHits[i]++;
                
                // Promote to higher levels (cache warming)
                promoteToHigherLevels(key, value, i);
                
                cout << "Cache HIT at level " << i << " (" << levelNames[i] << ")" << endl;
                return true;
            }
        }
        
        cout << "Cache MISS at all levels" << endl;
        return false;
    }
    
    void put(const Key& key, const Value& value) {
        // Insert at all levels
        for (auto& cache : cacheLevels) {
            cache->put(key, value);
        }
        cout << "Cached key at all levels" << endl;
    }
    
    void remove(const Key& key) {
        for (auto& cache : cacheLevels) {
            cache->remove(key);
        }
    }
    
    void clear() {
        for (auto& cache : cacheLevels) {
            cache->clear();
        }
    }
    
    void displayHierarchyStats() {
        cout << "\n=== Multi-Level Cache Statistics ===" << endl;
        cout << "Total Requests: " << totalRequests.load() << endl;
        
        for (size_t i = 0; i < cacheLevels.size(); i++) {
            double levelHitRate = totalRequests.load() > 0 ? 
                (double)levelHits[i].load() / totalRequests.load() : 0.0;
            
            cout << "Level " << i << " (" << levelNames[i] << "): "
                 << "Size: " << cacheLevels[i]->size()
                 << ", Hits: " << levelHits[i].load()
                 << ", Hit Rate: " << (levelHitRate * 100) << "%"
                 << ", Individual Hit Rate: " << (cacheLevels[i]->getHitRate() * 100) << "%" << endl;
        }
    }
    
private:
    void promoteToHigherLevels(const Key& key, const Value& value, size_t currentLevel) {
        // Promote to all higher (faster) levels
        for (size_t i = 0; i < currentLevel; i++) {
            cacheLevels[i]->put(key, value);
        }
    }
};
```

---

## 📝 CACHE PATTERNS AND POLICIES

### What are Cache Patterns?
**Real-World Analogy**: Like different strategies for managing your personal library - some books you read immediately (cache-aside), others you pre-order (read-through), and some you update everywhere at once (write-through).

```cpp
// Cache patterns implementation
#include <functional>
#include <future>

// Data source interface (represents database, API, etc.)
template<typename Key, typename Value>
class DataSource {
public:
    virtual ~DataSource() = default;
    virtual Value load(const Key& key) = 0;
    virtual void save(const Key& key, const Value& value) = 0;
    virtual void remove(const Key& key) = 0;
};

// Simulated database
template<typename Key, typename Value>
class SimulatedDatabase : public DataSource<Key, Value> {
private:
    unordered_map<Key, Value> storage;
    mutable atomic<int> loadCount{0};
    mutable atomic<int> saveCount{0};
    
public:
    Value load(const Key& key) override {
        loadCount++;
        // Simulate database latency
        this_thread::sleep_for(chrono::milliseconds(100));
        
        auto it = storage.find(key);
        if (it != storage.end()) {
            cout << "Database LOAD: " << key << " = " << it->second << endl;
            return it->second;
        }
        throw runtime_error("Key not found in database");
    }
    
    void save(const Key& key, const Value& value) override {
        saveCount++;
        // Simulate database latency
        this_thread::sleep_for(chrono::milliseconds(50));
        
        storage[key] = value;
        cout << "Database SAVE: " << key << " = " << value << endl;
    }
    
    void remove(const Key& key) override {
        storage.erase(key);
        cout << "Database REMOVE: " << key << endl;
    }
    
    int getLoadCount() const { return loadCount.load(); }
    int getSaveCount() const { return saveCount.load(); }
    
    void displayStats() const {
        cout << "Database Stats - Loads: " << loadCount.load() 
             << ", Saves: " << saveCount.load() << endl;
    }
};

// Cache-Aside Pattern
template<typename Key, typename Value>
class CacheAsidePattern {
private:
    unique_ptr<Cache<Key, Value>> cache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
public:
    CacheAsidePattern(unique_ptr<Cache<Key, Value>> c, unique_ptr<DataSource<Key, Value>> ds)
        : cache(move(c)), dataSource(move(ds)) {}
    
    Value get(const Key& key) {
        Value value;
        
        // Try cache first
        if (cache->get(key, value)) {
            cout << "Cache-Aside: Cache HIT for " << key << endl;
            return value;
        }
        
        // Cache miss - load from data source
        cout << "Cache-Aside: Cache MISS for " << key << ", loading from database" << endl;
        value = dataSource->load(key);
        
        // Store in cache for future requests
        cache->put(key, value);
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        // Update data source first
        dataSource->save(key, value);
        
        // Invalidate cache (or update it)
        cache->remove(key); // Lazy approach - remove from cache
        // Alternative: cache->put(key, value); // Eager approach - update cache
        
        cout << "Cache-Aside: Updated " << key << " and invalidated cache" << endl;
    }
    
    void remove(const Key& key) {
        dataSource->remove(key);
        cache->remove(key);
        cout << "Cache-Aside: Removed " << key << " from both cache and database" << endl;
    }
};

// Read-Through Pattern
template<typename Key, typename Value>
class ReadThroughPattern {
private:
    unique_ptr<Cache<Key, Value>> cache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
public:
    ReadThroughPattern(unique_ptr<Cache<Key, Value>> c, unique_ptr<DataSource<Key, Value>> ds)
        : cache(move(c)), dataSource(move(ds)) {}
    
    Value get(const Key& key) {
        Value value;
        
        // Try cache first
        if (cache->get(key, value)) {
            cout << "Read-Through: Cache HIT for " << key << endl;
            return value;
        }
        
        // Cache miss - cache loads from data source automatically
        cout << "Read-Through: Cache MISS for " << key << ", cache loading from database" << endl;
        value = dataSource->load(key);
        cache->put(key, value);
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        // In read-through, writes typically go directly to data source
        dataSource->save(key, value);
        cache->remove(key); // Invalidate cache
        cout << "Read-Through: Updated " << key << " in database and invalidated cache" << endl;
    }
};

// Write-Through Pattern
template<typename Key, typename Value>
class WriteThroughPattern {
private:
    unique_ptr<Cache<Key, Value>> cache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
public:
    WriteThroughPattern(unique_ptr<Cache<Key, Value>> c, unique_ptr<DataSource<Key, Value>> ds)
        : cache(move(c)), dataSource(move(ds)) {}
    
    Value get(const Key& key) {
        Value value;
        
        if (cache->get(key, value)) {
            cout << "Write-Through: Cache HIT for " << key << endl;
            return value;
        }
        
        // Cache miss - load from data source
        cout << "Write-Through: Cache MISS for " << key << ", loading from database" << endl;
        value = dataSource->load(key);
        cache->put(key, value);
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        // Write to both cache and data source synchronously
        dataSource->save(key, value);
        cache->put(key, value);
        
        cout << "Write-Through: Updated " << key << " in both cache and database" << endl;
    }
    
    void remove(const Key& key) {
        dataSource->remove(key);
        cache->remove(key);
        cout << "Write-Through: Removed " << key << " from both cache and database" << endl;
    }
};

// Write-Behind (Write-Back) Pattern
template<typename Key, typename Value>
class WriteBehindPattern {
private:
    unique_ptr<Cache<Key, Value>> cache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
    // Dirty data tracking
    unordered_set<Key> dirtyKeys;
    mutex dirtyMutex;
    
    // Background writer
    thread writerThread;
    bool writerRunning;
    condition_variable writerCondition;
    chrono::milliseconds writeDelay;
    
public:
    WriteBehindPattern(unique_ptr<Cache<Key, Value>> c, unique_ptr<DataSource<Key, Value>> ds,
                      chrono::milliseconds delay = chrono::milliseconds(5000))
        : cache(move(c)), dataSource(move(ds)), writerRunning(false), writeDelay(delay) {}
    
    ~WriteBehindPattern() {
        stopWriter();
    }
    
    void startWriter() {
        writerRunning = true;
        writerThread = thread(&WriteBehindPattern::writerLoop, this);
        cout << "Write-Behind: Background writer started" << endl;
    }
    
    void stopWriter() {
        writerRunning = false;
        writerCondition.notify_all();
        if (writerThread.joinable()) {
            writerThread.join();
        }
        
        // Flush remaining dirty data
        flushDirtyData();
    }
    
    Value get(const Key& key) {
        Value value;
        
        if (cache->get(key, value)) {
            cout << "Write-Behind: Cache HIT for " << key << endl;
            return value;
        }
        
        // Cache miss - load from data source
        cout << "Write-Behind: Cache MISS for " << key << ", loading from database" << endl;
        value = dataSource->load(key);
        cache->put(key, value);
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        // Write to cache immediately
        cache->put(key, value);
        
        // Mark as dirty for background writing
        {
            lock_guard<mutex> lock(dirtyMutex);
            dirtyKeys.insert(key);
        }
        writerCondition.notify_one();
        
        cout << "Write-Behind: Updated " << key << " in cache, marked for background write" << endl;
    }
    
    void remove(const Key& key) {
        cache->remove(key);
        
        // Remove from dirty set and delete from data source
        {
            lock_guard<mutex> lock(dirtyMutex);
            dirtyKeys.erase(key);
        }
        dataSource->remove(key);
        
        cout << "Write-Behind: Removed " << key << " from cache and database" << endl;
    }
    
    void flushDirtyData() {
        lock_guard<mutex> lock(dirtyMutex);
        
        for (const Key& key : dirtyKeys) {
            Value value;
            if (cache->get(key, value)) {
                dataSource->save(key, value);
                cout << "Write-Behind: Flushed dirty key " << key << " to database" << endl;
            }
        }
        dirtyKeys.clear();
    }
    
private:
    void writerLoop() {
        while (writerRunning) {
            unique_lock<mutex> lock(dirtyMutex);
            writerCondition.wait_for(lock, writeDelay, [this] { return !dirtyKeys.empty() || !writerRunning; });
            
            if (!writerRunning) break;
            
            // Write dirty keys to data source
            vector<Key> keysToWrite(dirtyKeys.begin(), dirtyKeys.end());
            dirtyKeys.clear();
            lock.unlock();
            
            for (const Key& key : keysToWrite) {
                Value value;
                if (cache->get(key, value)) {
                    dataSource->save(key, value);
                    cout << "Write-Behind: Background write " << key << " to database" << endl;
                }
            }
        }
    }
};

// Refresh-Ahead Pattern
template<typename Key, typename Value>
class RefreshAheadPattern {
private:
    unique_ptr<Cache<Key, Value>> cache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
    // TTL tracking
    unordered_map<Key, chrono::steady_clock::time_point> expirationTimes;
    chrono::milliseconds ttl;
    chrono::milliseconds refreshThreshold;
    mutex ttlMutex;
    
    // Background refresher
    thread refresherThread;
    bool refresherRunning;
    
public:
    RefreshAheadPattern(unique_ptr<Cache<Key, Value>> c, unique_ptr<DataSource<Key, Value>> ds,
                       chrono::milliseconds timeToLive = chrono::milliseconds(10000),
                       chrono::milliseconds threshold = chrono::milliseconds(2000))
        : cache(move(c)), dataSource(move(ds)), ttl(timeToLive), 
          refreshThreshold(threshold), refresherRunning(false) {}
    
    ~RefreshAheadPattern() {
        stopRefresher();
    }
    
    void startRefresher() {
        refresherRunning = true;
        refresherThread = thread(&RefreshAheadPattern::refresherLoop, this);
        cout << "Refresh-Ahead: Background refresher started" << endl;
    }
    
    void stopRefresher() {
        refresherRunning = false;
        if (refresherThread.joinable()) {
            refresherThread.join();
        }
    }
    
    Value get(const Key& key) {
        Value value;
        
        if (cache->get(key, value)) {
            // Check if refresh is needed
            checkAndScheduleRefresh(key);
            cout << "Refresh-Ahead: Cache HIT for " << key << endl;
            return value;
        }
        
        // Cache miss - load from data source
        cout << "Refresh-Ahead: Cache MISS for " << key << ", loading from database" << endl;
        value = dataSource->load(key);
        cache->put(key, value);
        
        // Set expiration time
        {
            lock_guard<mutex> lock(ttlMutex);
            expirationTimes[key] = chrono::steady_clock::now() + ttl;
        }
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        dataSource->save(key, value);
        cache->put(key, value);
        
        // Update expiration time
        {
            lock_guard<mutex> lock(ttlMutex);
            expirationTimes[key] = chrono::steady_clock::now() + ttl;
        }
        
        cout << "Refresh-Ahead: Updated " << key << " with new TTL" << endl;
    }
    
private:
    void checkAndScheduleRefresh(const Key& key) {
        lock_guard<mutex> lock(ttlMutex);
        
        auto it = expirationTimes.find(key);
        if (it != expirationTimes.end()) {
            auto now = chrono::steady_clock::now();
            auto timeToExpiry = it->second - now;
            
            if (timeToExpiry <= refreshThreshold) {
                // Schedule background refresh
                thread([this, key]() {
                    refreshKey(key);
                }).detach();
            }
        }
    }
    
    void refreshKey(const Key& key) {
        try {
            Value value = dataSource->load(key);
            cache->put(key, value);
            
            {
                lock_guard<mutex> lock(ttlMutex);
                expirationTimes[key] = chrono::steady_clock::now() + ttl;
            }
            
            cout << "Refresh-Ahead: Refreshed " << key << " in background" << endl;
        } catch (const exception& e) {
            cout << "Refresh-Ahead: Failed to refresh " << key << ": " << e.what() << endl;
        }
    }
    
    void refresherLoop() {
        while (refresherRunning) {
            this_thread::sleep_for(chrono::milliseconds(1000));
            
            vector<Key> keysToRefresh;
            auto now = chrono::steady_clock::now();
            
            {
                lock_guard<mutex> lock(ttlMutex);
                for (const auto& entry : expirationTimes) {
                    auto timeToExpiry = entry.second - now;
                    if (timeToExpiry <= refreshThreshold) {
                        keysToRefresh.push_back(entry.first);
                    }
                }
            }
            
            for (const Key& key : keysToRefresh) {
                refreshKey(key);
            }
        }
    }
};
```

---

## 🔄 CACHE CONSISTENCY MODELS

### What is Cache Consistency?
**Real-World Analogy**: Like keeping multiple copies of a document synchronized - some updates happen immediately everywhere (strong consistency), others eventually reach all copies (eventual consistency).

```cpp
// Cache consistency models implementation
#include <vector>
#include <algorithm>

// Strong Consistency Cache
template<typename Key, typename Value>
class StrongConsistencyCache {
private:
    struct CacheNode {
        unique_ptr<Cache<Key, Value>> cache;
        string nodeId;
        bool isAvailable;
        
        CacheNode(unique_ptr<Cache<Key, Value>> c, const string& id)
            : cache(move(c)), nodeId(id), isAvailable(true) {}
    };
    
    vector<unique_ptr<CacheNode>> nodes;
    unique_ptr<DataSource<Key, Value>> dataSource;
    mutex consistencyMutex;
    
public:
    StrongConsistencyCache(unique_ptr<DataSource<Key, Value>> ds) : dataSource(move(ds)) {}
    
    void addNode(unique_ptr<Cache<Key, Value>> cache, const string& nodeId) {
        lock_guard<mutex> lock(consistencyMutex);
        nodes.push_back(make_unique<CacheNode>(move(cache), nodeId));
        cout << "Added cache node: " << nodeId << endl;
    }
    
    Value get(const Key& key) {
        lock_guard<mutex> lock(consistencyMutex);
        
        // Try to read from any available node
        for (auto& node : nodes) {
            if (node->isAvailable) {
                Value value;
                if (node->cache->get(key, value)) {
                    cout << "Strong Consistency: Cache HIT on node " << node->nodeId << endl;
                    return value;
                }
            }
        }
        
        // Cache miss - load from data source and update all nodes
        cout << "Strong Consistency: Cache MISS, loading from database" << endl;
        Value value = dataSource->load(key);
        
        // Update all available nodes synchronously
        for (auto& node : nodes) {
            if (node->isAvailable) {
                node->cache->put(key, value);
            }
        }
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        lock_guard<mutex> lock(consistencyMutex);
        
        // Update data source first
        dataSource->save(key, value);
        
        // Update all cache nodes synchronously
        for (auto& node : nodes) {
            if (node->isAvailable) {
                node->cache->put(key, value);
            }
        }
        
        cout << "Strong Consistency: Updated " << key << " on all nodes" << endl;
    }
    
    void remove(const Key& key) {
        lock_guard<mutex> lock(consistencyMutex);
        
        dataSource->remove(key);
        
        // Remove from all cache nodes
        for (auto& node : nodes) {
            if (node->isAvailable) {
                node->cache->remove(key);
            }
        }
        
        cout << "Strong Consistency: Removed " << key << " from all nodes" << endl;
    }
    
    void setNodeAvailability(const string& nodeId, bool available) {
        lock_guard<mutex> lock(consistencyMutex);
        
        for (auto& node : nodes) {
            if (node->nodeId == nodeId) {
                node->isAvailable = available;
                cout << "Node " << nodeId << " set to " << (available ? "available" : "unavailable") << endl;
                break;
            }
        }
    }
};

// Eventual Consistency Cache
template<typename Key, typename Value>
class EventualConsistencyCache {
private:
    struct CacheNode {
        unique_ptr<Cache<Key, Value>> cache;
        string nodeId;
        bool isAvailable;
        queue<pair<Key, Value>> updateQueue;
        mutex nodeMutex;
        
        CacheNode(unique_ptr<Cache<Key, Value>> c, const string& id)
            : cache(move(c)), nodeId(id), isAvailable(true) {}
    };
    
    vector<unique_ptr<CacheNode>> nodes;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
    // Background synchronization
    thread syncThread;
    bool syncRunning;
    chrono::milliseconds syncInterval;
    
public:
    EventualConsistencyCache(unique_ptr<DataSource<Key, Value>> ds, 
                           chrono::milliseconds interval = chrono::milliseconds(1000))
        : dataSource(move(ds)), syncRunning(false), syncInterval(interval) {}
    
    ~EventualConsistencyCache() {
        stopSync();
    }
    
    void addNode(unique_ptr<Cache<Key, Value>> cache, const string& nodeId) {
        nodes.push_back(make_unique<CacheNode>(move(cache), nodeId));
        cout << "Added cache node: " << nodeId << endl;
    }
    
    void startSync() {
        syncRunning = true;
        syncThread = thread(&EventualConsistencyCache::syncLoop, this);
        cout << "Eventual Consistency: Background sync started" << endl;
    }
    
    void stopSync() {
        syncRunning = false;
        if (syncThread.joinable()) {
            syncThread.join();
        }
    }
    
    Value get(const Key& key) {
        // Try to read from any available node (no consistency guarantee)
        for (auto& node : nodes) {
            if (node->isAvailable) {
                Value value;
                if (node->cache->get(key, value)) {
                    cout << "Eventual Consistency: Cache HIT on node " << node->nodeId 
                         << " (may be stale)" << endl;
                    return value;
                }
            }
        }
        
        // Cache miss - load from data source
        cout << "Eventual Consistency: Cache MISS, loading from database" << endl;
        Value value = dataSource->load(key);
        
        // Update first available node
        for (auto& node : nodes) {
            if (node->isAvailable) {
                node->cache->put(key, value);
                break;
            }
        }
        
        return value;
    }
    
    void put(const Key& key, const Value& value) {
        // Update data source
        dataSource->save(key, value);
        
        // Queue updates for all nodes (asynchronous)
        for (auto& node : nodes) {
            if (node->isAvailable) {
                lock_guard<mutex> lock(node->nodeMutex);
                node->updateQueue.push({key, value});
            }
        }
        
        cout << "Eventual Consistency: Queued update for " << key << " on all nodes" << endl;
    }
    
    void remove(const Key& key) {
        dataSource->remove(key);
        
        // Remove from all nodes eventually
        for (auto& node : nodes) {
            if (node->isAvailable) {
                thread([&node, key]() {
                    this_thread::sleep_for(chrono::milliseconds(100));
                    node->cache->remove(key);
                }).detach();
            }
        }
        
        cout << "Eventual Consistency: Scheduled removal of " << key << " from all nodes" << endl;
    }
    
private:
    void syncLoop() {
        while (syncRunning) {
            for (auto& node : nodes) {
                if (node->isAvailable) {
                    processNodeUpdates(*node);
                }
            }
            
            this_thread::sleep_for(syncInterval);
        }
    }
    
    void processNodeUpdates(CacheNode& node) {
        lock_guard<mutex> lock(node.nodeMutex);
        
        while (!node.updateQueue.empty()) {
            auto update = node.updateQueue.front();
            node.updateQueue.pop();
            
            node.cache->put(update.first, update.second);
            cout << "Eventual Consistency: Applied update " << update.first 
                 << " to node " << node.nodeId << endl;
        }
    }
};
```

---

## 🌐 DISTRIBUTED CACHING

### What is Distributed Caching?
**Real-World Analogy**: Like a network of libraries that share popular books - when one library gets a new bestseller, it can share copies with nearby libraries based on demand.

```cpp
// Distributed caching with consistent hashing
#include <functional>
#include <map>

class ConsistentHashRing {
private:
    map<uint32_t, string> ring;
    int virtualNodes;
    
public:
    ConsistentHashRing(int vnodes = 150) : virtualNodes(vnodes) {}
    
    void addNode(const string& nodeId) {
        for (int i = 0; i < virtualNodes; i++) {
            string virtualNodeId = nodeId + ":" + to_string(i);
            uint32_t hash = hashFunction(virtualNodeId);
            ring[hash] = nodeId;
        }
        cout << "Added node " << nodeId << " to hash ring with " << virtualNodes << " virtual nodes" << endl;
    }
    
    void removeNode(const string& nodeId) {
        for (int i = 0; i < virtualNodes; i++) {
            string virtualNodeId = nodeId + ":" + to_string(i);
            uint32_t hash = hashFunction(virtualNodeId);
            ring.erase(hash);
        }
        cout << "Removed node " << nodeId << " from hash ring" << endl;
    }
    
    string getNode(const string& key) {
        if (ring.empty()) {
            return "";
        }
        
        uint32_t keyHash = hashFunction(key);
        auto it = ring.lower_bound(keyHash);
        
        if (it == ring.end()) {
            it = ring.begin(); // Wrap around
        }
        
        return it->second;
    }
    
    vector<string> getNodes(const string& key, int count) {
        vector<string> nodes;
        if (ring.empty()) {
            return nodes;
        }
        
        uint32_t keyHash = hashFunction(key);
        auto it = ring.lower_bound(keyHash);
        
        set<string> uniqueNodes;
        while (uniqueNodes.size() < count && uniqueNodes.size() < getUniqueNodeCount()) {
            if (it == ring.end()) {
                it = ring.begin();
            }
            
            uniqueNodes.insert(it->second);
            ++it;
        }
        
        return vector<string>(uniqueNodes.begin(), uniqueNodes.end());
    }
    
    size_t getUniqueNodeCount() {
        set<string> uniqueNodes;
        for (const auto& entry : ring) {
            uniqueNodes.insert(entry.second);
        }
        return uniqueNodes.size();
    }
    
private:
    uint32_t hashFunction(const string& input) {
        // Simple hash function (in production, use better hash like SHA-1)
        hash<string> hasher;
        return static_cast<uint32_t>(hasher(input));
    }
};

// Distributed cache cluster
template<typename Key, typename Value>
class DistributedCacheCluster {
private:
    struct CacheNode {
        unique_ptr<Cache<Key, Value>> cache;
        string nodeId;
        string address;
        bool isHealthy;
        atomic<int> requestCount{0};
        
        CacheNode(unique_ptr<Cache<Key, Value>> c, const string& id, const string& addr)
            : cache(move(c)), nodeId(id), address(addr), isHealthy(true) {}
    };
    
    map<string, unique_ptr<CacheNode>> nodes;
    ConsistentHashRing hashRing;
    int replicationFactor;
    mutex clusterMutex;
    
    // Statistics
    atomic<int> totalRequests{0};
    atomic<int> cacheHits{0};
    atomic<int> cacheMisses{0};
    
public:
    DistributedCacheCluster(int replicas = 3) : replicationFactor(replicas) {}
    
    void addNode(unique_ptr<Cache<Key, Value>> cache, const string& nodeId, const string& address) {
        lock_guard<mutex> lock(clusterMutex);
        
        nodes[nodeId] = make_unique<CacheNode>(move(cache), nodeId, address);
        hashRing.addNode(nodeId);
        
        cout << "Added cache node " << nodeId << " at " << address << endl;
    }
    
    void removeNode(const string& nodeId) {
        lock_guard<mutex> lock(clusterMutex);
        
        auto it = nodes.find(nodeId);
        if (it != nodes.end()) {
            hashRing.removeNode(nodeId);
            nodes.erase(it);
            cout << "Removed cache node " << nodeId << endl;
        }
    }
    
    bool get(const Key& key, Value& value) {
        totalRequests++;
        
        // Get primary and replica nodes for this key
        vector<string> targetNodes = getTargetNodes(key);
        
        // Try to read from any available replica
        for (const string& nodeId : targetNodes) {
            auto node = getNode(nodeId);
            if (node && node->isHealthy) {
                if (node->cache->get(key, value)) {
                    node->requestCount++;
                    cacheHits++;
                    cout << "Distributed Cache: HIT on node " << nodeId << endl;
                    return true;
                }
            }
        }
        
        cacheMisses++;
        cout << "Distributed Cache: MISS for key " << key << endl;
        return false;
    }
    
    void put(const Key& key, const Value& value) {
        // Get target nodes for replication
        vector<string> targetNodes = getTargetNodes(key);
        
        // Write to all replica nodes
        for (const string& nodeId : targetNodes) {
            auto node = getNode(nodeId);
            if (node && node->isHealthy) {
                node->cache->put(key, value);
                node->requestCount++;
                cout << "Distributed Cache: Stored " << key << " on node " << nodeId << endl;
            }
        }
    }
    
    void remove(const Key& key) {
        vector<string> targetNodes = getTargetNodes(key);
        
        for (const string& nodeId : targetNodes) {
            auto node = getNode(nodeId);
            if (node && node->isHealthy) {
                node->cache->remove(key);
                cout << "Distributed Cache: Removed " << key << " from node " << nodeId << endl;
            }
        }
    }
    
    void setNodeHealth(const string& nodeId, bool healthy) {
        lock_guard<mutex> lock(clusterMutex);
        
        auto it = nodes.find(nodeId);
        if (it != nodes.end()) {
            it->second->isHealthy = healthy;
            cout << "Node " << nodeId << " marked as " << (healthy ? "healthy" : "unhealthy") << endl;
        }
    }
    
    void displayClusterStats() {
        lock_guard<mutex> lock(clusterMutex);
        
        cout << "\n=== Distributed Cache Cluster Statistics ===" << endl;
        cout << "Total Nodes: " << nodes.size() << endl;
        cout << "Replication Factor: " << replicationFactor << endl;
        cout << "Total Requests: " << totalRequests.load() << endl;
        cout << "Cache Hits: " << cacheHits.load() << endl;
        cout << "Cache Misses: " << cacheMisses.load() << endl;
        cout << "Hit Rate: " << (double)cacheHits.load() / totalRequests.load() * 100 << "%" << endl;
        
        cout << "\nNode Statistics:" << endl;
        for (const auto& entry : nodes) {
            const auto& node = entry.second;
            cout << "Node " << node->nodeId << " [" << node->address << "] - "
                 << "Health: " << (node->isHealthy ? "Healthy" : "Unhealthy")
                 << ", Requests: " << node->requestCount.load()
                 << ", Size: " << node->cache->size() << endl;
        }
    }
    
private:
    vector<string> getTargetNodes(const Key& key) {
        string keyStr = to_string(key); // Convert key to string for hashing
        return hashRing.getNodes(keyStr, replicationFactor);
    }
    
    CacheNode* getNode(const string& nodeId) {
        auto it = nodes.find(nodeId);
        return (it != nodes.end()) ? it->second.get() : nullptr;
    }
};
```

---

## ⚡ CACHE OPTIMIZATION TECHNIQUES

### What are Cache Optimizations?
**Real-World Analogy**: Like optimizing a warehouse - using smart shelving (bloom filters), predictive stocking (prefetching), and efficient space usage (compression).

```cpp
// Cache optimization techniques
#include <bitset>
#include <vector>

// Bloom Filter for cache optimization
class BloomFilter {
private:
    bitset<1000000> bits; // 1M bits
    vector<function<size_t(const string&)>> hashFunctions;
    
public:
    BloomFilter() {
        // Initialize multiple hash functions
        hashFunctions.push_back([](const string& s) {
            hash<string> h1;
            return h1(s) % 1000000;
        });
        
        hashFunctions.push_back([](const string& s) {
            size_t hash = 0;
            for (char c : s) {
                hash = hash * 31 + c;
            }
            return hash % 1000000;
        });
        
        hashFunctions.push_back([](const string& s) {
            size_t hash = 5381;
            for (char c : s) {
                hash = ((hash << 5) + hash) + c;
            }
            return hash % 1000000;
        });
    }
    
    void add(const string& item) {
        for (auto& hashFunc : hashFunctions) {
            size_t index = hashFunc(item);
            bits.set(index);
        }
    }
    
    bool mightContain(const string& item) {
        for (auto& hashFunc : hashFunctions) {
            size_t index = hashFunc(item);
            if (!bits.test(index)) {
                return false; // Definitely not in set
            }
        }
        return true; // Might be in set
    }
    
    void clear() {
        bits.reset();
    }
};

// Cache with Bloom Filter optimization
template<typename Key, typename Value>
class BloomFilterCache : public Cache<Key, Value> {
private:
    unique_ptr<Cache<Key, Value>> underlyingCache;
    BloomFilter bloomFilter;
    
    mutable atomic<int> bloomHits{0};
    mutable atomic<int> bloomMisses{0};
    mutable atomic<int> falsePositives{0};
    
public:
    BloomFilterCache(unique_ptr<Cache<Key, Value>> cache) 
        : underlyingCache(move(cache)) {}
    
    bool get(const Key& key, Value& value) override {
        string keyStr = to_string(key);
        
        // Check bloom filter first
        if (!bloomFilter.mightContain(keyStr)) {
            bloomHits++;
            cout << "Bloom Filter: Definitely not in cache" << endl;
            return false; // Definitely not in cache
        }
        
        bloomMisses++;
        
        // Might be in cache, check actual cache
        if (underlyingCache->get(key, value)) {
            cout << "Bloom Filter: Cache HIT (bloom filter correct)" << endl;
            return true;
        } else {
            falsePositives++;
            cout << "Bloom Filter: False positive detected" << endl;
            return false;
        }
    }
    
    void put(const Key& key, const Value& value) override {
        underlyingCache->put(key, value);
        
        // Add to bloom filter
        string keyStr = to_string(key);
        bloomFilter.add(keyStr);
    }
    
    void remove(const Key& key) override {
        underlyingCache->remove(key);
        // Note: Bloom filter doesn't support removal
    }
    
    void clear() override {
        underlyingCache->clear();
        bloomFilter.clear();
    }
    
    size_t size() const override {
        return underlyingCache->size();
    }
    
    double getHitRate() const override {
        return underlyingCache->getHitRate();
    }
    
    void displayBloomStats() const {
        int totalBloomChecks = bloomHits.load() + bloomMisses.load();
        double bloomEfficiency = totalBloomChecks > 0 ? 
            (double)bloomHits.load() / totalBloomChecks : 0.0;
        
        cout << "\n=== Bloom Filter Statistics ===" << endl;
        cout << "Bloom Hits (avoided cache check): " << bloomHits.load() << endl;
        cout << "Bloom Misses (checked cache): " << bloomMisses.load() << endl;
        cout << "False Positives: " << falsePositives.load() << endl;
        cout << "Bloom Efficiency: " << (bloomEfficiency * 100) << "%" << endl;
    }
};

// Prefetching Cache
template<typename Key, typename Value>
class PrefetchingCache : public Cache<Key, Value> {
private:
    unique_ptr<Cache<Key, Value>> underlyingCache;
    unique_ptr<DataSource<Key, Value>> dataSource;
    
    // Access pattern tracking
    map<Key, vector<Key>> accessPatterns; // key -> frequently accessed after keys
    map<Key, int> accessCounts;
    mutex patternMutex;
    
    // Prefetching
    thread prefetchThread;
    queue<Key> prefetchQueue;
    mutex prefetchMutex;
    condition_variable prefetchCondition;
    bool prefetchRunning;
    
public:
    PrefetchingCache(unique_ptr<Cache<Key, Value>> cache, unique_ptr<DataSource<Key, Value>> ds)
        : underlyingCache(move(cache)), dataSource(move(ds)), prefetchRunning(false) {}
    
    ~PrefetchingCache() {
        stopPrefetching();
    }
    
    void startPrefetching() {
        prefetchRunning = true;
        prefetchThread = thread(&PrefetchingCache::prefetchLoop, this);
        cout << "Prefetching cache: Background prefetching started" << endl;
    }
    
    void stopPrefetching() {
        prefetchRunning = false;
        prefetchCondition.notify_all();
        if (prefetchThread.joinable()) {
            prefetchThread.join();
        }
    }
    
    bool get(const Key& key, Value& value) override {
        // Update access patterns
        updateAccessPattern(key);
        
        // Try cache first
        if (underlyingCache->get(key, value)) {
            // Schedule prefetching of related keys
            schedulePrefetch(key);
            return true;
        }
        
        return false;
    }
    
    void put(const Key& key, const Value& value) override {
        underlyingCache->put(key, value);
    }
    
    void remove(const Key& key) override {
        underlyingCache->remove(key);
    }
    
    void clear() override {
        underlyingCache->clear();
        
        lock_guard<mutex> lock(patternMutex);
        accessPatterns.clear();
        accessCounts.clear();
    }
    
    size_t size() const override {
        return underlyingCache->size();
    }
    
    double getHitRate() const override {
        return underlyingCache->getHitRate();
    }
    
private:
    void updateAccessPattern(const Key& key) {
        lock_guard<mutex> lock(patternMutex);
        
        accessCounts[key]++;
        
        // Track sequential access patterns
        static Key lastKey = Key{};
        if (lastKey != Key{}) {
            accessPatterns[lastKey].push_back(key);
            
            // Keep only recent patterns (limit size)
            if (accessPatterns[lastKey].size() > 10) {
                accessPatterns[lastKey].erase(accessPatterns[lastKey].begin());
            }
        }
        lastKey = key;
    }
    
    void schedulePrefetch(const Key& key) {
        lock_guard<mutex> patternLock(patternMutex);
        
        auto it = accessPatterns.find(key);
        if (it != accessPatterns.end()) {
            // Find most frequently accessed keys after this one
            map<Key, int> nextKeyFrequency;
            for (const Key& nextKey : it->second) {
                nextKeyFrequency[nextKey]++;
            }
            
            // Schedule prefetch for top candidates
            for (const auto& entry : nextKeyFrequency) {
                if (entry.second >= 2) { // Accessed at least twice after current key
                    {
                        lock_guard<mutex> prefetchLock(prefetchMutex);
                        prefetchQueue.push(entry.first);
                    }
                    prefetchCondition.notify_one();
                }
            }
        }
    }
    
    void prefetchLoop() {
        while (prefetchRunning) {
            unique_lock<mutex> lock(prefetchMutex);
            prefetchCondition.wait(lock, [this] { return !prefetchQueue.empty() || !prefetchRunning; });
            
            if (!prefetchRunning) break;
            
            Key keyToPrefetch = prefetchQueue.front();
            prefetchQueue.pop();
            lock.unlock();
            
            // Check if already in cache
            Value value;
            if (!underlyingCache->get(keyToPrefetch, value)) {
                try {
                    // Load from data source and cache
                    value = dataSource->load(keyToPrefetch);
                    underlyingCache->put(keyToPrefetch, value);
                    cout << "Prefetching: Loaded " << keyToPrefetch << " into cache" << endl;
                } catch (const exception& e) {
                    cout << "Prefetching: Failed to load " << keyToPrefetch << ": " << e.what() << endl;
                }
            }
        }
    }
};

// Compressed Cache
template<typename Key, typename Value>
class CompressedCache : public Cache<Key, Value> {
private:
    unique_ptr<Cache<Key, string>> underlyingCache; // Store compressed data as strings
    
    mutable atomic<int> compressionSavings{0};
    mutable atomic<int> totalOriginalSize{0};
    
public:
    CompressedCache(unique_ptr<Cache<Key, string>> cache) 
        : underlyingCache(move(cache)) {}
    
    bool get(const Key& key, Value& value) override {
        string compressedData;
        if (underlyingCache->get(key, compressedData)) {
            value = decompress(compressedData);
            cout << "Compressed Cache: Decompressed data for key " << key << endl;
            return true;
        }
        return false;
    }
    
    void put(const Key& key, const Value& value) override {
        string originalData = serialize(value);
        string compressedData = compress(originalData);
        
        // Track compression savings
        int originalSize = originalData.size();
        int compressedSize = compressedData.size();
        totalOriginalSize += originalSize;
        compressionSavings += (originalSize - compressedSize);
        
        underlyingCache->put(key, compressedData);
        
        cout << "Compressed Cache: Compressed " << originalSize << " bytes to " 
             << compressedSize << " bytes (saved " << (originalSize - compressedSize) << " bytes)" << endl;
    }
    
    void remove(const Key& key) override {
        underlyingCache->remove(key);
    }
    
    void clear() override {
        underlyingCache->clear();
    }
    
    size_t size() const override {
        return underlyingCache->size();
    }
    
    double getHitRate() const override {
        return underlyingCache->getHitRate();
    }
    
    void displayCompressionStats() const {
        double compressionRatio = totalOriginalSize.load() > 0 ? 
            (double)compressionSavings.load() / totalOriginalSize.load() : 0.0;
        
        cout << "\n=== Compression Statistics ===" << endl;
        cout << "Total Original Size: " << totalOriginalSize.load() << " bytes" << endl;
        cout << "Total Savings: " << compressionSavings.load() << " bytes" << endl;
        cout << "Compression Ratio: " << (compressionRatio * 100) << "%" << endl;
    }
    
private:
    string serialize(const Value& value) {
        // Simple serialization (in practice, use proper serialization)
        return to_string(value);
    }
    
    Value deserialize(const string& data) {
        // Simple deserialization
        return stoi(data);
    }
    
    string compress(const string& data) {
        // Simple compression simulation (in practice, use zlib, lz4, etc.)
        string compressed = data;
        
        // Remove duplicate characters (very basic compression)
        string result;
        char lastChar = '\0';
        int count = 0;
        
        for (char c : compressed) {
            if (c == lastChar) {
                count++;
            } else {
                if (count > 1) {
                    result += to_string(count);
                }
                if (lastChar != '\0') {
                    result += lastChar;
                }
                lastChar = c;
                count = 1;
            }
        }
        
        if (count > 1) {
            result += to_string(count);
        }
        result += lastChar;
        
        return result.size() < data.size() ? result : data;
    }
    
    Value decompress(const string& compressedData) {
        // Simple decompression (reverse of compress)
        // In practice, this would be much more sophisticated
        return deserialize(compressedData);
    }
};
```

---

## ⚡ Key Takeaways

1. **Cache hierarchies** improve performance by keeping hot data in faster storage levels
2. **Cache patterns** (aside, through, behind) offer different consistency and performance trade-offs
3. **Consistency models** balance data freshness with system availability
4. **Distributed caching** scales cache capacity and provides fault tolerance
5. **Optimization techniques** like bloom filters and prefetching can dramatically improve cache efficiency
6. **Choose the right strategy** based on your specific use case and requirements

## 🎯 Next Steps

- Study cache replacement algorithms (LRU, LFU, ARC, etc.)
- Learn about cache coherence protocols in multi-core systems
- Explore real-world caching solutions (Redis, Memcached, Hazelcast)
- Practice designing caching strategies for different application patterns
- Understand cache performance monitoring and tuning

---
*"There are only two hard things in Computer Science: cache invalidation and naming things."* - Phil Karlton 🚀
