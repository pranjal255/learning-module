# Database Systems and Storage - Building Robust Data Foundations

## 🌟 Real-World Story: The Digital Library Evolution

Imagine transforming a traditional library into a modern digital system. You face the same challenges as database designers:

- **Card Catalogs** (Relational DBs): Structured, organized, but rigid filing systems
- **Digital Archives** (NoSQL): Flexible storage for different document types
- **Reading Rooms** (ACID): Ensuring multiple readers don't interfere with each other
- **Branch Libraries** (Sharding): Distributing books across multiple locations
- **Backup Vaults** (Replication): Keeping copies in different buildings for safety
- **Quick Reference** (Indexing): Creating shortcuts to find information fast
- **Reservation System** (Transactions): Ensuring fair access and consistency

Just like evolving from physical to digital libraries, modern database systems must balance structure with flexibility, consistency with performance, and reliability with scalability!

## 🎯 Why Database Systems Matter

### Real Applications:
- **Amazon**: Handles 600+ million items with complex inventory management
- **Facebook**: Stores 300+ petabytes of user data across multiple database types
- **Netflix**: Manages viewing history for 230+ million users globally
- **Google**: Processes 20+ petabytes of data daily across distributed systems

## 📊 Database System Components

### 🗄️ Storage Engines and Data Structures
### 🔄 Transaction Processing (ACID)
### 📈 Database Scaling Strategies
### 🔍 Indexing and Query Optimization
### 🌐 Distributed Database Architectures

---

## 🗄️ STORAGE ENGINES AND DATA STRUCTURES

### What are Storage Engines?
**Real-World Analogy**: Like different filing systems - some optimized for quick lookups (B-trees), others for fast writes (LSM-trees), and some for analytical queries (columnar storage).

```cpp
// Storage engine implementations
#include <fstream>
#include <vector>
#include <map>
#include <memory>
#include <algorithm>

// Base storage engine interface
template<typename Key, typename Value>
class StorageEngine {
public:
    virtual ~StorageEngine() = default;
    virtual void put(const Key& key, const Value& value) = 0;
    virtual bool get(const Key& key, Value& value) = 0;
    virtual void remove(const Key& key) = 0;
    virtual void flush() = 0;
    virtual size_t size() const = 0;
};

// B+ Tree Storage Engine (like InnoDB)
template<typename Key, typename Value>
class BTreeStorageEngine : public StorageEngine<Key, Value> {
private:
    struct BTreeNode {
        bool isLeaf;
        vector<Key> keys;
        vector<Value> values; // Only for leaf nodes
        vector<shared_ptr<BTreeNode>> children; // Only for internal nodes
        shared_ptr<BTreeNode> next; // For leaf node linking
        
        BTreeNode(bool leaf = true) : isLeaf(leaf) {}
    };
    
    shared_ptr<BTreeNode> root;
    int maxKeys; // Maximum keys per node
    size_t totalSize;
    
    // Performance metrics
    mutable atomic<int> readCount{0};
    mutable atomic<int> writeCount{0};
    mutable atomic<int> nodeAccesses{0};
    
public:
    BTreeStorageEngine(int maxKeysPerNode = 4) : maxKeys(maxKeysPerNode), totalSize(0) {
        root = make_shared<BTreeNode>(true);
    }
    
    void put(const Key& key, const Value& value) override {
        writeCount++;
        
        if (root->keys.size() == maxKeys) {
            // Root is full, create new root
            auto newRoot = make_shared<BTreeNode>(false);
            newRoot->children.push_back(root);
            splitChild(newRoot, 0);
            root = newRoot;
        }
        
        insertNonFull(root, key, value);
        totalSize++;
        
        cout << "B-Tree: Inserted " << key << " = " << value << endl;
    }
    
    bool get(const Key& key, Value& value) override {
        readCount++;
        return search(root, key, value);
    }
    
    void remove(const Key& key) override {
        // Simplified removal (full implementation would handle underflow)
        removeFromNode(root, key);
        totalSize--;
        cout << "B-Tree: Removed " << key << endl;
    }
    
    void flush() override {
        // Simulate flushing to disk
        cout << "B-Tree: Flushed " << totalSize << " entries to disk" << endl;
    }
    
    size_t size() const override {
        return totalSize;
    }
    
    void displayStats() const {
        cout << "\n=== B-Tree Storage Engine Statistics ===" << endl;
        cout << "Total Entries: " << totalSize << endl;
        cout << "Read Operations: " << readCount.load() << endl;
        cout << "Write Operations: " << writeCount.load() << endl;
        cout << "Node Accesses: " << nodeAccesses.load() << endl;
        cout << "Tree Height: " << getHeight(root) << endl;
    }
    
    void displayTree() const {
        cout << "\n=== B-Tree Structure ===" << endl;
        displayNode(root, 0);
    }
    
private:
    void insertNonFull(shared_ptr<BTreeNode> node, const Key& key, const Value& value) {
        nodeAccesses++;
        
        if (node->isLeaf) {
            // Insert into leaf node
            auto it = lower_bound(node->keys.begin(), node->keys.end(), key);
            int index = it - node->keys.begin();
            
            if (it != node->keys.end() && *it == key) {
                // Update existing key
                node->values[index] = value;
            } else {
                // Insert new key
                node->keys.insert(it, key);
                node->values.insert(node->values.begin() + index, value);
            }
        } else {
            // Find child to insert into
            auto it = lower_bound(node->keys.begin(), node->keys.end(), key);
            int index = it - node->keys.begin();
            
            if (node->children[index]->keys.size() == maxKeys) {
                splitChild(node, index);
                if (key > node->keys[index]) {
                    index++;
                }
            }
            
            insertNonFull(node->children[index], key, value);
        }
    }
    
    void splitChild(shared_ptr<BTreeNode> parent, int index) {
        auto fullChild = parent->children[index];
        auto newChild = make_shared<BTreeNode>(fullChild->isLeaf);
        
        int mid = maxKeys / 2;
        
        // Move half the keys to new child
        newChild->keys.assign(fullChild->keys.begin() + mid + 1, fullChild->keys.end());
        fullChild->keys.resize(mid);
        
        if (fullChild->isLeaf) {
            newChild->values.assign(fullChild->values.begin() + mid + 1, fullChild->values.end());
            fullChild->values.resize(mid);
            newChild->next = fullChild->next;
            fullChild->next = newChild;
        } else {
            newChild->children.assign(fullChild->children.begin() + mid + 1, fullChild->children.end());
            fullChild->children.resize(mid + 1);
        }
        
        // Move middle key up to parent
        Key middleKey = fullChild->keys[mid];
        if (!fullChild->isLeaf) {
            fullChild->keys.resize(mid);
        }
        
        parent->keys.insert(parent->keys.begin() + index, middleKey);
        parent->children.insert(parent->children.begin() + index + 1, newChild);
    }
    
    bool search(shared_ptr<BTreeNode> node, const Key& key, Value& value) const {
        nodeAccesses++;
        
        auto it = lower_bound(node->keys.begin(), node->keys.end(), key);
        int index = it - node->keys.begin();
        
        if (it != node->keys.end() && *it == key) {
            if (node->isLeaf) {
                value = node->values[index];
                return true;
            }
            // For internal nodes, continue to child
        }
        
        if (node->isLeaf) {
            return false;
        }
        
        return search(node->children[index], key, value);
    }
    
    void removeFromNode(shared_ptr<BTreeNode> node, const Key& key) {
        auto it = find(node->keys.begin(), node->keys.end(), key);
        if (it != node->keys.end()) {
            int index = it - node->keys.begin();
            node->keys.erase(it);
            if (node->isLeaf) {
                node->values.erase(node->values.begin() + index);
            }
        }
    }
    
    int getHeight(shared_ptr<BTreeNode> node) const {
        if (!node || node->isLeaf) {
            return 1;
        }
        return 1 + getHeight(node->children[0]);
    }
    
    void displayNode(shared_ptr<BTreeNode> node, int level) const {
        if (!node) return;
        
        string indent(level * 2, ' ');
        cout << indent << "Level " << level << ": [";
        for (size_t i = 0; i < node->keys.size(); i++) {
            cout << node->keys[i];
            if (node->isLeaf && i < node->values.size()) {
                cout << ":" << node->values[i];
            }
            if (i < node->keys.size() - 1) cout << ", ";
        }
        cout << "]" << (node->isLeaf ? " (leaf)" : " (internal)") << endl;
        
        if (!node->isLeaf) {
            for (auto& child : node->children) {
                displayNode(child, level + 1);
            }
        }
    }
};

// LSM Tree Storage Engine (like RocksDB/Cassandra)
template<typename Key, typename Value>
class LSMTreeStorageEngine : public StorageEngine<Key, Value> {
private:
    struct MemTable {
        map<Key, Value> data;
        size_t size;
        chrono::steady_clock::time_point createdAt;
        
        MemTable() : size(0), createdAt(chrono::steady_clock::now()) {}
    };
    
    struct SSTable {
        string filename;
        map<Key, Value> data; // In real implementation, this would be on disk
        size_t size;
        int level;
        
        SSTable(const string& name, int lvl) : filename(name), size(0), level(lvl) {}
    };
    
    unique_ptr<MemTable> activeMemTable;
    vector<unique_ptr<MemTable>> immutableMemTables;
    vector<vector<unique_ptr<SSTable>>> levels; // Level 0, 1, 2, etc.
    
    size_t memTableMaxSize;
    size_t totalSize;
    
    // Background compaction
    thread compactionThread;
    bool compactionRunning;
    mutex lsmMutex;
    
    // Performance metrics
    mutable atomic<int> memTableHits{0};
    mutable atomic<int> ssTableHits{0};
    mutable atomic<int> compactions{0};
    
public:
    LSMTreeStorageEngine(size_t maxMemTableSize = 1000) 
        : memTableMaxSize(maxMemTableSize), totalSize(0), compactionRunning(false) {
        activeMemTable = make_unique<MemTable>();
        levels.resize(5); // 5 levels
    }
    
    ~LSMTreeStorageEngine() {
        stopCompaction();
    }
    
    void startCompaction() {
        compactionRunning = true;
        compactionThread = thread(&LSMTreeStorageEngine::compactionLoop, this);
        cout << "LSM-Tree: Background compaction started" << endl;
    }
    
    void stopCompaction() {
        compactionRunning = false;
        if (compactionThread.joinable()) {
            compactionThread.join();
        }
    }
    
    void put(const Key& key, const Value& value) override {
        lock_guard<mutex> lock(lsmMutex);
        
        activeMemTable->data[key] = value;
        activeMemTable->size++;
        totalSize++;
        
        // Check if memtable is full
        if (activeMemTable->size >= memTableMaxSize) {
            flushMemTable();
        }
        
        cout << "LSM-Tree: Wrote " << key << " = " << value << " to memtable" << endl;
    }
    
    bool get(const Key& key, Value& value) override {
        lock_guard<mutex> lock(lsmMutex);
        
        // Check active memtable first
        auto it = activeMemTable->data.find(key);
        if (it != activeMemTable->data.end()) {
            value = it->second;
            memTableHits++;
            cout << "LSM-Tree: Found " << key << " in active memtable" << endl;
            return true;
        }
        
        // Check immutable memtables
        for (auto& memTable : immutableMemTables) {
            auto it = memTable->data.find(key);
            if (it != memTable->data.end()) {
                value = it->second;
                memTableHits++;
                cout << "LSM-Tree: Found " << key << " in immutable memtable" << endl;
                return true;
            }
        }
        
        // Check SSTables from newest to oldest
        for (int level = 0; level < levels.size(); level++) {
            for (auto& ssTable : levels[level]) {
                auto it = ssTable->data.find(key);
                if (it != ssTable->data.end()) {
                    value = it->second;
                    ssTableHits++;
                    cout << "LSM-Tree: Found " << key << " in SSTable level " << level << endl;
                    return true;
                }
            }
        }
        
        return false;
    }
    
    void remove(const Key& key) override {
        // In LSM trees, deletes are handled as tombstone markers
        put(key, Value{}); // Simplified - would use special tombstone value
        cout << "LSM-Tree: Marked " << key << " for deletion" << endl;
    }
    
    void flush() override {
        lock_guard<mutex> lock(lsmMutex);
        if (activeMemTable->size > 0) {
            flushMemTable();
        }
        cout << "LSM-Tree: Flushed all memtables to SSTables" << endl;
    }
    
    size_t size() const override {
        return totalSize;
    }
    
    void displayStats() const {
        lock_guard<mutex> lock(lsmMutex);
        
        cout << "\n=== LSM-Tree Storage Engine Statistics ===" << endl;
        cout << "Total Entries: " << totalSize << endl;
        cout << "Active MemTable Size: " << activeMemTable->size << endl;
        cout << "Immutable MemTables: " << immutableMemTables.size() << endl;
        cout << "MemTable Hits: " << memTableHits.load() << endl;
        cout << "SSTable Hits: " << ssTableHits.load() << endl;
        cout << "Compactions Performed: " << compactions.load() << endl;
        
        for (int i = 0; i < levels.size(); i++) {
            cout << "Level " << i << " SSTables: " << levels[i].size() << endl;
        }
    }
    
private:
    void flushMemTable() {
        // Move active memtable to immutable
        immutableMemTables.push_back(move(activeMemTable));
        activeMemTable = make_unique<MemTable>();
        
        // Create SSTable from oldest immutable memtable
        if (immutableMemTables.size() > 2) { // Keep some in memory
            auto oldestMemTable = move(immutableMemTables.front());
            immutableMemTables.erase(immutableMemTables.begin());
            
            createSSTable(move(oldestMemTable), 0);
        }
    }
    
    void createSSTable(unique_ptr<MemTable> memTable, int level) {
        string filename = "sstable_" + to_string(levels[level].size()) + "_level_" + to_string(level);
        auto ssTable = make_unique<SSTable>(filename, level);
        
        ssTable->data = memTable->data;
        ssTable->size = memTable->size;
        
        levels[level].push_back(move(ssTable));
        
        cout << "LSM-Tree: Created SSTable " << filename << " at level " << level << endl;
    }
    
    void compactionLoop() {
        while (compactionRunning) {
            this_thread::sleep_for(chrono::seconds(5));
            
            lock_guard<mutex> lock(lsmMutex);
            
            // Check if any level needs compaction
            for (int level = 0; level < levels.size() - 1; level++) {
                if (shouldCompact(level)) {
                    performCompaction(level);
                    compactions++;
                }
            }
        }
    }
    
    bool shouldCompact(int level) {
        // Simple compaction trigger: too many SSTables at this level
        size_t maxSSTables = (level == 0) ? 4 : 10;
        return levels[level].size() > maxSSTables;
    }
    
    void performCompaction(int level) {
        if (levels[level].empty() || level >= levels.size() - 1) {
            return;
        }
        
        cout << "LSM-Tree: Compacting level " << level << " to level " << (level + 1) << endl;
        
        // Merge all SSTables at this level
        map<Key, Value> mergedData;
        for (auto& ssTable : levels[level]) {
            for (const auto& entry : ssTable->data) {
                mergedData[entry.first] = entry.second;
            }
        }
        
        // Clear current level
        levels[level].clear();
        
        // Create new SSTable at next level
        string filename = "compacted_sstable_level_" + to_string(level + 1);
        auto compactedSSTable = make_unique<SSTable>(filename, level + 1);
        compactedSSTable->data = mergedData;
        compactedSSTable->size = mergedData.size();
        
        levels[level + 1].push_back(move(compactedSSTable));
        
        cout << "LSM-Tree: Compaction completed, merged " << mergedData.size() << " entries" << endl;
    }
};

// Columnar Storage Engine (like Parquet/ClickHouse)
template<typename Key, typename Value>
class ColumnarStorageEngine : public StorageEngine<Key, Value> {
private:
    struct Column {
        string name;
        vector<Value> values;
        vector<bool> nullMask;
        
        Column(const string& n) : name(n) {}
    };
    
    map<string, unique_ptr<Column>> columns;
    vector<Key> rowKeys;
    size_t rowCount;
    
    // Compression simulation
    map<string, double> compressionRatios;
    
public:
    ColumnarStorageEngine() : rowCount(0) {}
    
    void put(const Key& key, const Value& value) override {
        // In a real columnar store, value would be a row with multiple columns
        // For simplicity, we'll treat it as a single column
        
        if (columns.find("data") == columns.end()) {
            columns["data"] = make_unique<Column>("data");
        }
        
        rowKeys.push_back(key);
        columns["data"]->values.push_back(value);
        columns["data"]->nullMask.push_back(false);
        rowCount++;
        
        // Simulate compression
        if (rowCount % 1000 == 0) {
            compressColumn("data");
        }
        
        cout << "Columnar: Stored " << key << " = " << value << " (row " << rowCount << ")" << endl;
    }
    
    bool get(const Key& key, Value& value) override {
        auto it = find(rowKeys.begin(), rowKeys.end(), key);
        if (it != rowKeys.end()) {
            size_t index = it - rowKeys.begin();
            if (index < columns["data"]->values.size()) {
                value = columns["data"]->values[index];
                cout << "Columnar: Retrieved " << key << " = " << value << endl;
                return true;
            }
        }
        return false;
    }
    
    void remove(const Key& key) override {
        auto it = find(rowKeys.begin(), rowKeys.end(), key);
        if (it != rowKeys.end()) {
            size_t index = it - rowKeys.begin();
            rowKeys.erase(it);
            
            for (auto& columnPair : columns) {
                auto& column = columnPair.second;
                if (index < column->values.size()) {
                    column->values.erase(column->values.begin() + index);
                    column->nullMask.erase(column->nullMask.begin() + index);
                }
            }
            
            rowCount--;
            cout << "Columnar: Removed row for key " << key << endl;
        }
    }
    
    void flush() override {
        // Compress all columns
        for (auto& columnPair : columns) {
            compressColumn(columnPair.first);
        }
        cout << "Columnar: Flushed and compressed all columns" << endl;
    }
    
    size_t size() const override {
        return rowCount;
    }
    
    // Analytical query support
    vector<Value> columnScan(const string& columnName) {
        auto it = columns.find(columnName);
        if (it != columns.end()) {
            cout << "Columnar: Performing column scan on " << columnName << endl;
            return it->second->values;
        }
        return {};
    }
    
    Value aggregate(const string& columnName, const string& operation) {
        auto values = columnScan(columnName);
        if (values.empty()) return Value{};
        
        if (operation == "SUM") {
            Value sum = Value{};
            for (const auto& val : values) {
                sum += val;
            }
            cout << "Columnar: SUM(" << columnName << ") = " << sum << endl;
            return sum;
        } else if (operation == "AVG") {
            Value sum = Value{};
            for (const auto& val : values) {
                sum += val;
            }
            Value avg = sum / values.size();
            cout << "Columnar: AVG(" << columnName << ") = " << avg << endl;
            return avg;
        } else if (operation == "MAX") {
            Value max = *max_element(values.begin(), values.end());
            cout << "Columnar: MAX(" << columnName << ") = " << max << endl;
            return max;
        }
        
        return Value{};
    }
    
    void displayStats() const {
        cout << "\n=== Columnar Storage Engine Statistics ===" << endl;
        cout << "Total Rows: " << rowCount << endl;
        cout << "Total Columns: " << columns.size() << endl;
        
        for (const auto& columnPair : columns) {
            const auto& column = columnPair.second;
            cout << "Column " << column->name << ": " << column->values.size() << " values";
            
            auto it = compressionRatios.find(column->name);
            if (it != compressionRatios.end()) {
                cout << " (compression: " << (it->second * 100) << "%)";
            }
            cout << endl;
        }
    }
    
private:
    void compressColumn(const string& columnName) {
        auto it = columns.find(columnName);
        if (it != columns.end()) {
            // Simulate compression (in reality, would use techniques like RLE, dictionary encoding, etc.)
            size_t originalSize = it->second->values.size() * sizeof(Value);
            size_t compressedSize = originalSize * 0.7; // Assume 30% compression
            
            double ratio = 1.0 - (double)compressedSize / originalSize;
            compressionRatios[columnName] = ratio;
            
            cout << "Columnar: Compressed column " << columnName 
                 << " (saved " << (ratio * 100) << "%)" << endl;
        }
    }
};
```

---

## 🔄 TRANSACTION PROCESSING (ACID)

### What are ACID Properties?
**Real-World Analogy**: Like a bank transfer - it must be Atomic (all or nothing), Consistent (balance rules maintained), Isolated (other transfers don't interfere), and Durable (permanently recorded).

```cpp
// ACID Transaction System Implementation
#include <unordered_set>
#include <condition_variable>

// Transaction states
enum class TransactionState {
    ACTIVE,
    COMMITTED,
    ABORTED,
    PREPARING
};

// Lock types for concurrency control
enum class LockType {
    SHARED,
    EXCLUSIVE
};

// Transaction class
template<typename Key, typename Value>
class Transaction {
private:
    string transactionId;
    TransactionState state;
    chrono::steady_clock::time_point startTime;
    
    // Read and write sets
    map<Key, Value> readSet;
    map<Key, Value> writeSet;
    set<Key> lockedKeys;
    
public:
    Transaction(const string& id) 
        : transactionId(id), state(TransactionState::ACTIVE), 
          startTime(chrono::steady_clock::now()) {}
    
    string getId() const { return transactionId; }
    TransactionState getState() const { return state; }
    void setState(TransactionState newState) { state = newState; }
    
    void addRead(const Key& key, const Value& value) {
        readSet[key] = value;
    }
    
    void addWrite(const Key& key, const Value& value) {
        writeSet[key] = value;
    }
    
    void addLock(const Key& key) {
        lockedKeys.insert(key);
    }
    
    const map<Key, Value>& getWriteSet() const { return writeSet; }
    const map<Key, Value>& getReadSet() const { return readSet; }
    const set<Key>& getLockedKeys() const { return lockedKeys; }
    
    chrono::milliseconds getDuration() const {
        auto now = chrono::steady_clock::now();
        return chrono::duration_cast<chrono::milliseconds>(now - startTime);
    }
};

// Lock manager for concurrency control
template<typename Key>
class LockManager {
private:
    struct LockInfo {
        LockType type;
        string transactionId;
        chrono::steady_clock::time_point acquiredAt;
        
        LockInfo(LockType t, const string& txnId) 
            : type(t), transactionId(txnId), acquiredAt(chrono::steady_clock::now()) {}
    };
    
    map<Key, vector<LockInfo>> locks;
    map<Key, queue<pair<string, LockType>>> waitQueue;
    mutex lockMutex;
    condition_variable lockCondition;
    
    // Deadlock detection
    map<string, set<string>> waitForGraph;
    
public:
    bool acquireLock(const Key& key, LockType type, const string& transactionId, 
                    chrono::milliseconds timeout = chrono::milliseconds(5000)) {
        unique_lock<mutex> lock(lockMutex);
        
        if (canGrantLock(key, type, transactionId)) {
            locks[key].emplace_back(type, transactionId);
            cout << "Lock Manager: Granted " << (type == LockType::SHARED ? "SHARED" : "EXCLUSIVE") 
                 << " lock on " << key << " to transaction " << transactionId << endl;
            return true;
        }
        
        // Add to wait queue
        waitQueue[key].push({transactionId, type});
        updateWaitForGraph(transactionId, key);
        
        // Check for deadlock
        if (detectDeadlock(transactionId)) {
            cout << "Lock Manager: Deadlock detected for transaction " << transactionId << endl;
            waitQueue[key].pop(); // Remove from wait queue
            return false;
        }
        
        cout << "Lock Manager: Transaction " << transactionId << " waiting for " 
             << (type == LockType::SHARED ? "SHARED" : "EXCLUSIVE") << " lock on " << key << endl;
        
        // Wait for lock with timeout
        bool acquired = lockCondition.wait_for(lock, timeout, [this, &key, type, &transactionId] {
            return canGrantLock(key, type, transactionId);
        });
        
        if (acquired) {
            locks[key].emplace_back(type, transactionId);
            // Remove from wait queue
            auto& queue = waitQueue[key];
            queue.pop();
            cout << "Lock Manager: Granted " << (type == LockType::SHARED ? "SHARED" : "EXCLUSIVE") 
                 << " lock on " << key << " to transaction " << transactionId << " after wait" << endl;
        } else {
            cout << "Lock Manager: Timeout waiting for lock on " << key 
                 << " for transaction " << transactionId << endl;
        }
        
        return acquired;
    }
    
    void releaseLock(const Key& key, const string& transactionId) {
        lock_guard<mutex> lock(lockMutex);
        
        auto it = locks.find(key);
        if (it != locks.end()) {
            auto& lockList = it->second;
            lockList.erase(
                remove_if(lockList.begin(), lockList.end(),
                    [&transactionId](const LockInfo& info) {
                        return info.transactionId == transactionId;
                    }),
                lockList.end()
            );
            
            if (lockList.empty()) {
                locks.erase(it);
            }
            
            cout << "Lock Manager: Released lock on " << key 
                 << " for transaction " << transactionId << endl;
        }
        
        // Notify waiting transactions
        lockCondition.notify_all();
    }
    
    void releaseAllLocks(const string& transactionId) {
        lock_guard<mutex> lock(lockMutex);
        
        for (auto it = locks.begin(); it != locks.end();) {
            auto& lockList = it->second;
            lockList.erase(
                remove_if(lockList.begin(), lockList.end(),
                    [&transactionId](const LockInfo& info) {
                        return info.transactionId == transactionId;
                    }),
                lockList.end()
            );
            
            if (lockList.empty()) {
                it = locks.erase(it);
            } else {
                ++it;
            }
        }
        
        cout << "Lock Manager: Released all locks for transaction " << transactionId << endl;
        lockCondition.notify_all();
    }
    
private:
    bool canGrantLock(const Key& key, LockType type, const string& transactionId) {
        auto it = locks.find(key);
        if (it == locks.end()) {
            return true; // No existing locks
        }
        
        const auto& lockList = it->second;
        
        // Check if transaction already has a lock
        for (const auto& lockInfo : lockList) {
            if (lockInfo.transactionId == transactionId) {
                return true; // Already has lock
            }
        }
        
        // Check compatibility
        if (type == LockType::SHARED) {
            // Shared locks are compatible with other shared locks
            for (const auto& lockInfo : lockList) {
                if (lockInfo.type == LockType::EXCLUSIVE) {
                    return false;
                }
            }
            return true;
        } else {
            // Exclusive locks are not compatible with any other locks
            return lockList.empty();
        }
    }
    
    void updateWaitForGraph(const string& transactionId, const Key& key) {
        auto it = locks.find(key);
        if (it != locks.end()) {
            for (const auto& lockInfo : it->second) {
                waitForGraph[transactionId].insert(lockInfo.transactionId);
            }
        }
    }
    
    bool detectDeadlock(const string& transactionId) {
        set<string> visited;
        set<string> recursionStack;
        return hasDeadlockCycle(transactionId, visited, recursionStack);
    }
    
    bool hasDeadlockCycle(const string& txnId, set<string>& visited, set<string>& recursionStack) {
        visited.insert(txnId);
        recursionStack.insert(txnId);
        
        auto it = waitForGraph.find(txnId);
        if (it != waitForGraph.end()) {
            for (const string& dependentTxn : it->second) {
                if (recursionStack.find(dependentTxn) != recursionStack.end()) {
                    return true; // Cycle detected
                }
                
                if (visited.find(dependentTxn) == visited.end()) {
                    if (hasDeadlockCycle(dependentTxn, visited, recursionStack)) {
                        return true;
                    }
                }
            }
        }
        
        recursionStack.erase(txnId);
        return false;
    }
};

// ACID Transaction Manager
template<typename Key, typename Value>
class TransactionManager {
private:
    unique_ptr<StorageEngine<Key, Value>> storageEngine;
    unique_ptr<LockManager<Key>> lockManager;
    map<string, unique_ptr<Transaction<Key, Value>>> activeTransactions;
    
    // Write-ahead log for durability
    vector<string> writeAheadLog;
    
    mutex transactionMutex;
    atomic<int> transactionCounter{0};
    
    // Performance metrics
    atomic<int> committedTransactions{0};
    atomic<int> abortedTransactions{0};
    
public:
    TransactionManager(unique_ptr<StorageEngine<Key, Value>> engine)
        : storageEngine(move(engine)), lockManager(make_unique<LockManager<Key>>()) {}
    
    string beginTransaction() {
        lock_guard<mutex> lock(transactionMutex);
        
        string txnId = "txn_" + to_string(++transactionCounter);
        activeTransactions[txnId] = make_unique<Transaction<Key, Value>>(txnId);
        
        cout << "Transaction Manager: Started transaction " << txnId << endl;
        return txnId;
    }
    
    bool read(const string& transactionId, const Key& key, Value& value) {
        lock_guard<mutex> lock(transactionMutex);
        
        auto txnIt = activeTransactions.find(transactionId);
        if (txnIt == activeTransactions.end()) {
            cout << "Transaction Manager: Transaction " << transactionId << " not found" << endl;
            return false;
        }
        
        auto& transaction = txnIt->second;
        
        // Acquire shared lock
        if (!lockManager->acquireLock(key, LockType::SHARED, transactionId)) {
            cout << "Transaction Manager: Failed to acquire read lock for " << transactionId << endl;
            return false;
        }
        
        transaction->addLock(key);
        
        // Read from storage engine
        if (storageEngine->get(key, value)) {
            transaction->addRead(key, value);
            cout << "Transaction Manager: Transaction " << transactionId << " read " << key << " = " << value << endl;
            return true;
        }
        
        return false;
    }
    
    bool write(const string& transactionId, const Key& key, const Value& value) {
        lock_guard<mutex> lock(transactionMutex);
        
        auto txnIt = activeTransactions.find(transactionId);
        if (txnIt == activeTransactions.end()) {
            cout << "Transaction Manager: Transaction " << transactionId << " not found" << endl;
            return false;
        }
        
        auto& transaction = txnIt->second;
        
        // Acquire exclusive lock
        if (!lockManager->acquireLock(key, LockType::EXCLUSIVE, transactionId)) {
            cout << "Transaction Manager: Failed to acquire write lock for " << transactionId << endl;
            return false;
        }
        
        transaction->addLock(key);
        transaction->addWrite(key, value);
        
        // Add to write-ahead log
        string logEntry = "WRITE " + transactionId + " " + to_string(key) + " " + to_string(value);
        writeAheadLog.push_back(logEntry);
        
        cout << "Transaction Manager: Transaction " << transactionId << " wrote " << key << " = " << value << endl;
        return true;
    }
    
    bool commit(const string& transactionId) {
        lock_guard<mutex> lock(transactionMutex);
        
        auto txnIt = activeTransactions.find(transactionId);
        if (txnIt == activeTransactions.end()) {
            cout << "Transaction Manager: Transaction " << transactionId << " not found" << endl;
            return false;
        }
        
        auto& transaction = txnIt->second;
        
        // Validate transaction (simplified)
        if (!validateTransaction(*transaction)) {
            abort(transactionId);
            return false;
        }
        
        // Apply writes to storage engine
        for (const auto& write : transaction->getWriteSet()) {
            storageEngine->put(write.first, write.second);
        }
        
        // Add commit record to log
        string commitEntry = "COMMIT " + transactionId;
        writeAheadLog.push_back(commitEntry);
        
        // Release all locks
        lockManager->releaseAllLocks(transactionId);
        
        transaction->setState(TransactionState::COMMITTED);
        activeTransactions.erase(txnIt);
        committedTransactions++;
        
        cout << "Transaction Manager: Transaction " << transactionId << " COMMITTED" << endl;
        return true;
    }
    
    void abort(const string& transactionId) {
        lock_guard<mutex> lock(transactionMutex);
        
        auto txnIt = activeTransactions.find(transactionId);
        if (txnIt == activeTransactions.end()) {
            cout << "Transaction Manager: Transaction " << transactionId << " not found" << endl;
            return;
        }
        
        auto& transaction = txnIt->second;
        
        // Add abort record to log
        string abortEntry = "ABORT " + transactionId;
        writeAheadLog.push_back(abortEntry);
        
        // Release all locks
        lockManager->releaseAllLocks(transactionId);
        
        transaction->setState(TransactionState::ABORTED);
        activeTransactions.erase(txnIt);
        abortedTransactions++;
        
        cout << "Transaction Manager: Transaction " << transactionId << " ABORTED" << endl;
    }
    
    void displayStats() {
        lock_guard<mutex> lock(transactionMutex);
        
        cout << "\n=== Transaction Manager Statistics ===" << endl;
        cout << "Active Transactions: " << activeTransactions.size() << endl;
        cout << "Committed Transactions: " << committedTransactions.load() << endl;
        cout << "Aborted Transactions: " << abortedTransactions.load() << endl;
        cout << "Write-Ahead Log Entries: " << writeAheadLog.size() << endl;
        
        for (const auto& txnPair : activeTransactions) {
            const auto& txn = txnPair.second;
            cout << "Transaction " << txn->getId() << " - Duration: " 
                 << txn->getDuration().count() << "ms, Locks: " << txn->getLockedKeys().size() << endl;
        }
    }
    
private:
    bool validateTransaction(const Transaction<Key, Value>& transaction) {
        // Simplified validation - in reality, would check for conflicts, constraints, etc.
        return transaction.getState() == TransactionState::ACTIVE;
    }
};
```

---

## 📈 DATABASE SCALING STRATEGIES

### What is Database Scaling?
**Real-World Analogy**: Like expanding a library system - you can build a bigger library (vertical scaling), open branch libraries (horizontal scaling), or specialize libraries by topic (sharding).

```cpp
// Database scaling implementations
#include <random>

// Database sharding implementation
template<typename Key, typename Value>
class ShardedDatabase {
private:
    struct Shard {
        string shardId;
        unique_ptr<StorageEngine<Key, Value>> storage;
        string location;
        bool isHealthy;
        atomic<int> requestCount{0};
        
        Shard(const string& id, unique_ptr<StorageEngine<Key, Value>> engine, const string& loc)
            : shardId(id), storage(move(engine)), location(loc), isHealthy(true) {}
    };
    
    vector<unique_ptr<Shard>> shards;
    function<int(const Key&)> shardingFunction;
    mutex shardMutex;
    
    // Rebalancing
    thread rebalancingThread;
    bool rebalancingRunning;
    
public:
    ShardedDatabase(function<int(const Key&)> shardFunc) 
        : shardingFunction(shardFunc), rebalancingRunning(false) {}
    
    ~ShardedDatabase() {
        stopRebalancing();
    }
    
    void addShard(const string& shardId, unique_ptr<StorageEngine<Key, Value>> storage, const string& location) {
        lock_guard<mutex> lock(shardMutex);
        shards.push_back(make_unique<Shard>(shardId, move(storage), location));
        cout << "Sharded DB: Added shard " << shardId << " at " << location << endl;
    }
    
    void removeShard(const string& shardId) {
        lock_guard<mutex> lock(shardMutex);
        
        auto it = find_if(shards.begin(), shards.end(),
            [&shardId](const unique_ptr<Shard>& shard) {
                return shard->shardId == shardId;
            });
        
        if (it != shards.end()) {
            cout << "Sharded DB: Removing shard " << shardId << endl;
            // In reality, would migrate data to other shards
            shards.erase(it);
        }
    }
    
    bool put(const Key& key, const Value& value) {
        Shard* targetShard = getShardForKey(key);
        if (targetShard && targetShard->isHealthy) {
            targetShard->storage->put(key, value);
            targetShard->requestCount++;
            cout << "Sharded DB: Stored " << key << " in shard " << targetShard->shardId << endl;
            return true;
        }
        return false;
    }
    
    bool get(const Key& key, Value& value) {
        Shard* targetShard = getShardForKey(key);
        if (targetShard && targetShard->isHealthy) {
            targetShard->requestCount++;
            if (targetShard->storage->get(key, value)) {
                cout << "Sharded DB: Retrieved " << key << " from shard " << targetShard->shardId << endl;
                return true;
            }
        }
        return false;
    }
    
    void remove(const Key& key) {
        Shard* targetShard = getShardForKey(key);
        if (targetShard && targetShard->isHealthy) {
            targetShard->storage->remove(key);
            targetShard->requestCount++;
            cout << "Sharded DB: Removed " << key << " from shard " << targetShard->shardId << endl;
        }
    }
    
    void startRebalancing() {
        rebalancingRunning = true;
        rebalancingThread = thread(&ShardedDatabase::rebalancingLoop, this);
        cout << "Sharded DB: Started rebalancing thread" << endl;
    }
    
    void stopRebalancing() {
        rebalancingRunning = false;
        if (rebalancingThread.joinable()) {
            rebalancingThread.join();
        }
    }
    
    void displayShardStats() {
        lock_guard<mutex> lock(shardMutex);
        
        cout << "\n=== Sharded Database Statistics ===" << endl;
        cout << "Total Shards: " << shards.size() << endl;
        
        int totalRequests = 0;
        for (const auto& shard : shards) {
            int requests = shard->requestCount.load();
            totalRequests += requests;
            
            cout << "Shard " << shard->shardId << " [" << shard->location << "] - "
                 << "Health: " << (shard->isHealthy ? "Healthy" : "Unhealthy")
                 << ", Requests: " << requests
                 << ", Size: " << shard->storage->size() << endl;
        }
        
        cout << "Total Requests: " << totalRequests << endl;
        
        // Show load distribution
        if (totalRequests > 0) {
            cout << "Load Distribution:" << endl;
            for (const auto& shard : shards) {
                double percentage = (double)shard->requestCount.load() / totalRequests * 100;
                cout << "  " << shard->shardId << ": " << percentage << "%" << endl;
            }
        }
    }
    
private:
    Shard* getShardForKey(const Key& key) {
        if (shards.empty()) return nullptr;
        
        int shardIndex = shardingFunction(key) % shards.size();
        return shards[shardIndex].get();
    }
    
    void rebalancingLoop() {
        while (rebalancingRunning) {
            this_thread::sleep_for(chrono::seconds(10));
            
            lock_guard<mutex> lock(shardMutex);
            
            // Check if rebalancing is needed
            if (shouldRebalance()) {
                performRebalancing();
            }
        }
    }
    
    bool shouldRebalance() {
        if (shards.size() < 2) return false;
        
        // Calculate load imbalance
        int totalRequests = 0;
        int maxRequests = 0;
        int minRequests = INT_MAX;
        
        for (const auto& shard : shards) {
            int requests = shard->requestCount.load();
            totalRequests += requests;
            maxRequests = max(maxRequests, requests);
            minRequests = min(minRequests, requests);
        }
        
        if (totalRequests == 0) return false;
        
        double imbalanceRatio = (double)(maxRequests - minRequests) / totalRequests;
        return imbalanceRatio > 0.3; // 30% imbalance threshold
    }
    
    void performRebalancing() {
        cout << "Sharded DB: Performing rebalancing..." << endl;
        
        // In a real implementation, this would:
        // 1. Identify hot and cold shards
        // 2. Move data from hot shards to cold shards
        // 3. Update routing tables
        // 4. Handle ongoing requests during migration
        
        // For simulation, just reset counters
        for (auto& shard : shards) {
            shard->requestCount.store(0);
        }
        
        cout << "Sharded DB: Rebalancing completed" << endl;
    }
};

// Read replica implementation
template<typename Key, typename Value>
class ReadReplicaDatabase {
private:
    struct Replica {
        string replicaId;
        unique_ptr<StorageEngine<Key, Value>> storage;
        string location;
        bool isHealthy;
        bool isPrimary;
        atomic<int> readCount{0};
        atomic<int> writeCount{0};
        chrono::steady_clock::time_point lastSync;
        
        Replica(const string& id, unique_ptr<StorageEngine<Key, Value>> engine, 
               const string& loc, bool primary = false)
            : replicaId(id), storage(move(engine)), location(loc), 
              isHealthy(true), isPrimary(primary), lastSync(chrono::steady_clock::now()) {}
    };
    
    vector<unique_ptr<Replica>> replicas;
    Replica* primaryReplica;
    mutex replicaMutex;
    
    // Replication
    thread replicationThread;
    bool replicationRunning;
    queue<pair<Key, Value>> replicationQueue;
    condition_variable replicationCondition;
    
public:
    ReadReplicaDatabase() : primaryReplica(nullptr), replicationRunning(false) {}
    
    ~ReadReplicaDatabase() {
        stopReplication();
    }
    
    void addReplica(const string& replicaId, unique_ptr<StorageEngine<Key, Value>> storage, 
                   const string& location, bool isPrimary = false) {
        lock_guard<mutex> lock(replicaMutex);
        
        auto replica = make_unique<Replica>(replicaId, move(storage), location, isPrimary);
        Replica* replicaPtr = replica.get();
        
        replicas.push_back(move(replica));
        
        if (isPrimary) {
            primaryReplica = replicaPtr;
            cout << "Read Replica DB: Added PRIMARY replica " << replicaId << " at " << location << endl;
        } else {
            cout << "Read Replica DB: Added READ replica " << replicaId << " at " << location << endl;
        }
    }
    
    void startReplication() {
        replicationRunning = true;
        replicationThread = thread(&ReadReplicaDatabase::replicationLoop, this);
        cout << "Read Replica DB: Started replication thread" << endl;
    }
    
    void stopReplication() {
        replicationRunning = false;
        replicationCondition.notify_all();
        if (replicationThread.joinable()) {
            replicationThread.join();
        }
    }
    
    bool write(const Key& key, const Value& value) {
        lock_guard<mutex> lock(replicaMutex);
        
        if (!primaryReplica || !primaryReplica->isHealthy) {
            cout << "Read Replica DB: No healthy primary replica available" << endl;
            return false;
        }
        
        // Write to primary
        primaryReplica->storage->put(key, value);
        primaryReplica->writeCount++;
        
        // Queue for replication to read replicas
        replicationQueue.push({key, value});
        replicationCondition.notify_one();
        
        cout << "Read Replica DB: Wrote " << key << " to primary replica " << primaryReplica->replicaId << endl;
        return true;
    }
    
    bool read(const Key& key, Value& value) {
        lock_guard<mutex> lock(replicaMutex);
        
        // Try to read from least loaded read replica
        Replica* bestReplica = selectReadReplica();
        
        if (bestReplica && bestReplica->isHealthy) {
            if (bestReplica->storage->get(key, value)) {
                bestReplica->readCount++;
                cout << "Read Replica DB: Read " << key << " from replica " << bestReplica->replicaId << endl;
                return true;
            }
        }
        
        // Fallback to primary if read replicas fail
        if (primaryReplica && primaryReplica->isHealthy) {
            if (primaryReplica->storage->get(key, value)) {
                primaryReplica->readCount++;
                cout << "Read Replica DB: Read " << key << " from primary replica (fallback)" << endl;
                return true;
            }
        }
        
        return false;
    }
    
    void displayReplicaStats() {
        lock_guard<mutex> lock(replicaMutex);
        
        cout << "\n=== Read Replica Database Statistics ===" << endl;
        cout << "Total Replicas: " << replicas.size() << endl;
        
        for (const auto& replica : replicas) {
            auto timeSinceSync = chrono::steady_clock::now() - replica->lastSync;
            auto syncLag = chrono::duration_cast<chrono::seconds>(timeSinceSync);
            
            cout << "Replica " << replica->replicaId << " [" << replica->location << "] - "
                 << "Type: " << (replica->isPrimary ? "PRIMARY" : "READ")
                 << ", Health: " << (replica->isHealthy ? "Healthy" : "Unhealthy")
                 << ", Reads: " << replica->readCount.load()
                 << ", Writes: " << replica->writeCount.load()
                 << ", Sync Lag: " << syncLag.count() << "s" << endl;
        }
    }
    
private:
    Replica* selectReadReplica() {
        Replica* bestReplica = nullptr;
        int minReads = INT_MAX;
        
        for (const auto& replica : replicas) {
            if (!replica->isPrimary && replica->isHealthy) {
                int reads = replica->readCount.load();
                if (reads < minReads) {
                    minReads = reads;
                    bestReplica = replica.get();
                }
            }
        }
        
        return bestReplica;
    }
    
    void replicationLoop() {
        while (replicationRunning) {
            unique_lock<mutex> lock(replicaMutex);
            replicationCondition.wait(lock, [this] { return !replicationQueue.empty() || !replicationRunning; });
            
            if (!replicationRunning) break;
            
            // Process replication queue
            while (!replicationQueue.empty()) {
                auto replicationItem = replicationQueue.front();
                replicationQueue.pop();
                
                // Replicate to all read replicas
                for (auto& replica : replicas) {
                    if (!replica->isPrimary && replica->isHealthy) {
                        replica->storage->put(replicationItem.first, replicationItem.second);
                        replica->lastSync = chrono::steady_clock::now();
                        cout << "Read Replica DB: Replicated " << replicationItem.first 
                             << " to replica " << replica->replicaId << endl;
                    }
                }
            }
        }
    }
};
```

---

## ⚡ Key Takeaways

1. **Storage engines** determine how data is organized and accessed (B-trees for OLTP, LSM-trees for writes, columnar for analytics)
2. **ACID properties** ensure data integrity through atomicity, consistency, isolation, and durability
3. **Scaling strategies** include sharding (horizontal partitioning) and read replicas (read scaling)
4. **Transaction management** handles concurrency control, deadlock detection, and recovery
5. **Choose the right approach** based on your workload characteristics and consistency requirements

## 🎯 Next Steps

- Study specific database systems (PostgreSQL, MongoDB, Cassandra, etc.)
- Learn about database optimization and query planning
- Explore NoSQL database models and their trade-offs
- Understand database backup and recovery strategies
- Practice designing databases for different application patterns

---
*"Data is the new oil, but databases are the refineries that make it valuable!"* 🗄️
