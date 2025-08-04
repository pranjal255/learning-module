# Distributed Systems Concepts - Building Reliable Distributed Systems

## 🌟 Real-World Story: The Global Restaurant Chain

Imagine you're running a global restaurant chain with locations across different continents. You face challenges that mirror distributed systems:

- **Consistency**: All locations should have the same menu and prices
- **Availability**: Restaurants should stay open even if headquarters is unreachable
- **Partition Tolerance**: Locations should operate independently during network outages
- **Consensus**: All managers need to agree on new policies
- **Replication**: Popular recipes should be available at multiple locations
- **Eventual Consistency**: Menu updates eventually reach all locations

Just like managing a global restaurant chain, distributed systems must handle coordination, failures, and consistency across multiple independent nodes!

## 🎯 Why Distributed Systems Matter

### Real Applications:
- **Google**: Processes 8.5 billion searches daily across global data centers
- **Facebook**: Serves 3 billion users with data replicated worldwide
- **Amazon**: Handles millions of transactions with 99.99% availability
- **Netflix**: Streams content from edge servers globally

## 📊 Core Distributed Systems Concepts

### 🔄 CAP Theorem
### 🤝 Consensus Algorithms
### 📋 Replication Strategies
### ⏰ Distributed Clocks and Ordering
### 🔧 Failure Detection and Recovery

---

## 🔄 CAP THEOREM

### What is CAP Theorem?
**Real-World Analogy**: Like a restaurant chain where you can only guarantee 2 out of 3: same menu everywhere (Consistency), all locations open (Availability), or operating during communication breakdowns (Partition tolerance).

```cpp
// CAP Theorem demonstration with different system configurations
#include <vector>
#include <map>
#include <thread>
#include <chrono>
#include <random>

// Base distributed node
class DistributedNode {
protected:
    string nodeId;
    map<string, string> data;
    vector<string> connectedNodes;
    bool isPartitioned;
    bool isAvailable;
    mutex nodeMutex;
    
public:
    DistributedNode(const string& id) : nodeId(id), isPartitioned(false), isAvailable(true) {}
    
    virtual bool write(const string& key, const string& value) = 0;
    virtual string read(const string& key) = 0;
    
    void simulatePartition(bool partitioned) {
        lock_guard<mutex> lock(nodeMutex);
        isPartitioned = partitioned;
        cout << "Node " << nodeId << (partitioned ? " PARTITIONED" : " CONNECTED") << endl;
    }
    
    void setAvailable(bool available) {
        lock_guard<mutex> lock(nodeMutex);
        isAvailable = available;
        cout << "Node " << nodeId << (available ? " AVAILABLE" : " UNAVAILABLE") << endl;
    }
    
    string getNodeId() const { return nodeId; }
    bool getPartitionStatus() const { return isPartitioned; }
    bool getAvailabilityStatus() const { return isAvailable; }
    
    void displayData() {
        lock_guard<mutex> lock(nodeMutex);
        cout << "Node " << nodeId << " data: ";
        for (const auto& item : data) {
            cout << "[" << item.first << ":" << item.second << "] ";
        }
        cout << endl;
    }
};

// CP System (Consistency + Partition Tolerance, sacrifices Availability)
class CPSystem : public DistributedNode {
private:
    vector<CPSystem*> replicas;
    int requiredAcks;
    
public:
    CPSystem(const string& id, int acks = 2) : DistributedNode(id), requiredAcks(acks) {}
    
    void addReplica(CPSystem* replica) {
        replicas.push_back(replica);
    }
    
    bool write(const string& key, const string& value) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable) {
            cout << "CP System: Node " << nodeId << " unavailable for write" << endl;
            return false;
        }
        
        // Count available replicas
        int availableReplicas = 1; // self
        for (auto* replica : replicas) {
            if (replica->isAvailable && !replica->isPartitioned) {
                availableReplicas++;
            }
        }
        
        // Require majority for consistency
        if (availableReplicas < requiredAcks) {
            cout << "CP System: Insufficient replicas (" << availableReplicas 
                 << "/" << requiredAcks << ") - REJECTING write to maintain consistency" << endl;
            return false; // Sacrifice availability for consistency
        }
        
        // Write to self
        data[key] = value;
        cout << "CP System: Node " << nodeId << " wrote " << key << "=" << value << endl;
        
        // Synchronously replicate to available nodes
        int acks = 1;
        for (auto* replica : replicas) {
            if (replica->isAvailable && !replica->isPartitioned) {
                replica->replicateWrite(key, value);
                acks++;
                if (acks >= requiredAcks) break;
            }
        }
        
        return acks >= requiredAcks;
    }
    
    string read(const string& key) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable) {
            return ""; // Unavailable
        }
        
        auto it = data.find(key);
        if (it != data.end()) {
            cout << "CP System: Node " << nodeId << " read " << key << "=" << it->second << endl;
            return it->second;
        }
        
        return ""; // Not found
    }
    
    void replicateWrite(const string& key, const string& value) {
        lock_guard<mutex> lock(nodeMutex);
        data[key] = value;
        cout << "CP System: Node " << nodeId << " replicated " << key << "=" << value << endl;
    }
};

// AP System (Availability + Partition Tolerance, sacrifices Consistency)
class APSystem : public DistributedNode {
private:
    vector<APSystem*> replicas;
    
public:
    APSystem(const string& id) : DistributedNode(id) {}
    
    void addReplica(APSystem* replica) {
        replicas.push_back(replica);
    }
    
    bool write(const string& key, const string& value) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable) {
            cout << "AP System: Node " << nodeId << " unavailable" << endl;
            return false;
        }
        
        // Always accept writes for availability
        data[key] = value;
        cout << "AP System: Node " << nodeId << " wrote " << key << "=" << value << endl;
        
        // Asynchronously replicate to available nodes (best effort)
        thread([this, key, value]() {
            for (auto* replica : replicas) {
                if (replica->isAvailable && !replica->isPartitioned) {
                    replica->asyncReplicateWrite(key, value);
                }
            }
        }).detach();
        
        return true; // Always available
    }
    
    string read(const string& key) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable) {
            return "";
        }
        
        auto it = data.find(key);
        if (it != data.end()) {
            cout << "AP System: Node " << nodeId << " read " << key << "=" << it->second 
                 << " (may be stale)" << endl;
            return it->second;
        }
        
        return "";
    }
    
    void asyncReplicateWrite(const string& key, const string& value) {
        // Simulate network delay
        this_thread::sleep_for(chrono::milliseconds(100));
        
        lock_guard<mutex> lock(nodeMutex);
        if (isAvailable && !isPartitioned) {
            data[key] = value;
            cout << "AP System: Node " << nodeId << " async replicated " << key << "=" << value << endl;
        }
    }
    
    // Conflict resolution for eventual consistency
    void resolveConflicts() {
        cout << "AP System: Node " << nodeId << " resolving conflicts..." << endl;
        // In real systems: last-writer-wins, vector clocks, CRDTs, etc.
    }
};

// CA System (Consistency + Availability, no Partition Tolerance)
class CASystem : public DistributedNode {
private:
    vector<CASystem*> replicas;
    
public:
    CASystem(const string& id) : DistributedNode(id) {}
    
    void addReplica(CASystem* replica) {
        replicas.push_back(replica);
    }
    
    bool write(const string& key, const string& value) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable || isPartitioned) {
            cout << "CA System: Node " << nodeId << " cannot write during partition" << endl;
            return false; // Cannot handle partitions
        }
        
        // Check if all replicas are reachable
        for (auto* replica : replicas) {
            if (replica->isPartitioned || !replica->isAvailable) {
                cout << "CA System: Partition detected - STOPPING operations" << endl;
                return false; // Stop all operations during partition
            }
        }
        
        // Synchronously write to all replicas
        data[key] = value;
        cout << "CA System: Node " << nodeId << " wrote " << key << "=" << value << endl;
        
        for (auto* replica : replicas) {
            replica->syncReplicateWrite(key, value);
        }
        
        return true;
    }
    
    string read(const string& key) override {
        lock_guard<mutex> lock(nodeMutex);
        
        if (!isAvailable || isPartitioned) {
            return ""; // Cannot serve during partition
        }
        
        auto it = data.find(key);
        if (it != data.end()) {
            cout << "CA System: Node " << nodeId << " read " << key << "=" << it->second << endl;
            return it->second;
        }
        
        return "";
    }
    
    void syncReplicateWrite(const string& key, const string& value) {
        lock_guard<mutex> lock(nodeMutex);
        data[key] = value;
        cout << "CA System: Node " << nodeId << " sync replicated " << key << "=" << value << endl;
    }
};

// CAP Theorem demonstration
class CAPTheoremDemo {
public:
    static void demonstrateCP() {
        cout << "\n=== CP System Demo (Consistency + Partition Tolerance) ===" << endl;
        
        CPSystem node1("CP-Node1", 2);
        CPSystem node2("CP-Node2", 2);
        CPSystem node3("CP-Node3", 2);
        
        node1.addReplica(&node2);
        node1.addReplica(&node3);
        
        // Normal operation
        cout << "\n--- Normal Operation ---" << endl;
        node1.write("user:1", "John");
        node1.read("user:1");
        
        // Simulate partition
        cout << "\n--- Partition Scenario ---" << endl;
        node2.simulatePartition(true);
        node3.simulatePartition(true);
        
        // Write should fail (consistency over availability)
        node1.write("user:2", "Jane");
        
        node1.displayData();
        node2.displayData();
        node3.displayData();
    }
    
    static void demonstrateAP() {
        cout << "\n=== AP System Demo (Availability + Partition Tolerance) ===" << endl;
        
        APSystem node1("AP-Node1");
        APSystem node2("AP-Node2");
        APSystem node3("AP-Node3");
        
        node1.addReplica(&node2);
        node1.addReplica(&node3);
        
        // Normal operation
        cout << "\n--- Normal Operation ---" << endl;
        node1.write("user:1", "John");
        this_thread::sleep_for(chrono::milliseconds(200)); // Wait for async replication
        
        // Simulate partition
        cout << "\n--- Partition Scenario ---" << endl;
        node2.simulatePartition(true);
        node3.simulatePartition(true);
        
        // Writes continue (availability over consistency)
        node1.write("user:1", "John_Updated");
        node2.write("user:1", "John_Different"); // Conflicting write
        
        this_thread::sleep_for(chrono::milliseconds(200));
        
        node1.displayData();
        node2.displayData();
        node3.displayData();
        
        // Resolve conflicts when partition heals
        node2.simulatePartition(false);
        node2.resolveConflicts();
    }
    
    static void demonstrateCA() {
        cout << "\n=== CA System Demo (Consistency + Availability) ===" << endl;
        
        CASystem node1("CA-Node1");
        CASystem node2("CA-Node2");
        
        node1.addReplica(&node2);
        
        // Normal operation
        cout << "\n--- Normal Operation ---" << endl;
        node1.write("user:1", "John");
        node1.read("user:1");
        
        // Simulate partition
        cout << "\n--- Partition Scenario ---" << endl;
        node2.simulatePartition(true);
        
        // System stops working (cannot handle partitions)
        node1.write("user:2", "Jane");
        node1.read("user:1");
        
        node1.displayData();
        node2.displayData();
    }
};
```

---

## 🤝 CONSENSUS ALGORITHMS

### What is Consensus?
**Real-World Analogy**: Like a group of friends deciding where to go for dinner - they need to agree on one choice even if some friends are unreachable or give conflicting opinions.

```cpp
// Raft Consensus Algorithm Implementation
#include <random>
#include <algorithm>

class RaftNode {
public:
    enum class State {
        FOLLOWER,
        CANDIDATE,
        LEADER
    };
    
    struct LogEntry {
        int term;
        string command;
        int index;
        
        LogEntry(int t, const string& cmd, int idx) : term(t), command(cmd), index(idx) {}
    };
    
private:
    string nodeId;
    State currentState;
    int currentTerm;
    string votedFor;
    vector<LogEntry> log;
    int commitIndex;
    int lastApplied;
    
    // Leader state
    map<string, int> nextIndex;
    map<string, int> matchIndex;
    
    // Election
    vector<string> cluster;
    set<string> votesReceived;
    chrono::steady_clock::time_point lastHeartbeat;
    chrono::milliseconds electionTimeout;
    
    // Random number generation
    random_device rd;
    mt19937 gen;
    
    mutex nodeMutex;
    
public:
    RaftNode(const string& id, const vector<string>& clusterNodes) 
        : nodeId(id), currentState(State::FOLLOWER), currentTerm(0), 
          commitIndex(-1), lastApplied(-1), cluster(clusterNodes), gen(rd()) {
        resetElectionTimeout();
        lastHeartbeat = chrono::steady_clock::now();
    }
    
    // Election process
    void startElection() {
        lock_guard<mutex> lock(nodeMutex);
        
        currentState = State::CANDIDATE;
        currentTerm++;
        votedFor = nodeId;
        votesReceived.clear();
        votesReceived.insert(nodeId); // Vote for self
        resetElectionTimeout();
        
        cout << "Node " << nodeId << " started election for term " << currentTerm << endl;
        
        // Request votes from other nodes
        for (const string& node : cluster) {
            if (node != nodeId) {
                requestVote(node);
            }
        }
        
        checkElectionResult();
    }
    
    bool requestVote(const string& candidateId, int term, int lastLogIndex, int lastLogTerm) {
        lock_guard<mutex> lock(nodeMutex);
        
        // Reply false if term < currentTerm
        if (term < currentTerm) {
            cout << "Node " << nodeId << " rejected vote for " << candidateId 
                 << " (term " << term << " < " << currentTerm << ")" << endl;
            return false;
        }
        
        // Update term if necessary
        if (term > currentTerm) {
            currentTerm = term;
            votedFor = "";
            currentState = State::FOLLOWER;
        }
        
        // Vote if haven't voted or voted for this candidate
        if (votedFor.empty() || votedFor == candidateId) {
            // Check log is at least as up-to-date
            int myLastLogTerm = log.empty() ? 0 : log.back().term;
            int myLastLogIndex = log.size() - 1;
            
            if (lastLogTerm > myLastLogTerm || 
                (lastLogTerm == myLastLogTerm && lastLogIndex >= myLastLogIndex)) {
                votedFor = candidateId;
                resetElectionTimeout();
                cout << "Node " << nodeId << " voted for " << candidateId 
                     << " in term " << term << endl;
                return true;
            }
        }
        
        cout << "Node " << nodeId << " rejected vote for " << candidateId << endl;
        return false;
    }
    
    void receiveVote(const string& voterId, bool granted) {
        lock_guard<mutex> lock(nodeMutex);
        
        if (currentState != State::CANDIDATE) {
            return;
        }
        
        if (granted) {
            votesReceived.insert(voterId);
            cout << "Node " << nodeId << " received vote from " << voterId << endl;
            checkElectionResult();
        }
    }
    
    void checkElectionResult() {
        int majority = (cluster.size() / 2) + 1;
        
        if (votesReceived.size() >= majority) {
            becomeLeader();
        }
    }
    
    void becomeLeader() {
        currentState = State::LEADER;
        cout << "Node " << nodeId << " became LEADER for term " << currentTerm << endl;
        
        // Initialize leader state
        for (const string& node : cluster) {
            if (node != nodeId) {
                nextIndex[node] = log.size();
                matchIndex[node] = -1;
            }
        }
        
        // Send initial heartbeats
        sendHeartbeats();
    }
    
    // Log replication
    bool appendEntries(const string& leaderId, int term, int prevLogIndex, 
                      int prevLogTerm, const vector<LogEntry>& entries, int leaderCommit) {
        lock_guard<mutex> lock(nodeMutex);
        
        lastHeartbeat = chrono::steady_clock::now();
        
        // Reply false if term < currentTerm
        if (term < currentTerm) {
            return false;
        }
        
        // Update term and become follower
        if (term > currentTerm) {
            currentTerm = term;
            votedFor = "";
        }
        currentState = State::FOLLOWER;
        
        // Reply false if log doesn't contain an entry at prevLogIndex
        if (prevLogIndex >= 0 && 
            (prevLogIndex >= log.size() || log[prevLogIndex].term != prevLogTerm)) {
            cout << "Node " << nodeId << " log inconsistency at index " << prevLogIndex << endl;
            return false;
        }
        
        // Append new entries
        if (!entries.empty()) {
            // Delete conflicting entries
            if (prevLogIndex + 1 < log.size()) {
                log.erase(log.begin() + prevLogIndex + 1, log.end());
            }
            
            // Append new entries
            for (const auto& entry : entries) {
                log.push_back(entry);
                cout << "Node " << nodeId << " appended entry: " << entry.command << endl;
            }
        }
        
        // Update commit index
        if (leaderCommit > commitIndex) {
            commitIndex = min(leaderCommit, (int)log.size() - 1);
            applyCommittedEntries();
        }
        
        return true;
    }
    
    void sendHeartbeats() {
        if (currentState != State::LEADER) {
            return;
        }
        
        cout << "Leader " << nodeId << " sending heartbeats" << endl;
        
        for (const string& node : cluster) {
            if (node != nodeId) {
                sendAppendEntries(node);
            }
        }
    }
    
    void sendAppendEntries(const string& nodeId) {
        int prevLogIndex = nextIndex[nodeId] - 1;
        int prevLogTerm = (prevLogIndex >= 0) ? log[prevLogIndex].term : 0;
        
        vector<LogEntry> entries;
        if (nextIndex[nodeId] < log.size()) {
            entries.assign(log.begin() + nextIndex[nodeId], log.end());
        }
        
        // Simulate sending appendEntries RPC
        // In real implementation, this would be a network call
        cout << "Leader " << this->nodeId << " sending " << entries.size() 
             << " entries to " << nodeId << endl;
    }
    
    // Client operations
    bool clientWrite(const string& command) {
        lock_guard<mutex> lock(nodeMutex);
        
        if (currentState != State::LEADER) {
            cout << "Node " << nodeId << " is not leader, cannot accept writes" << endl;
            return false;
        }
        
        // Append to local log
        LogEntry entry(currentTerm, command, log.size());
        log.push_back(entry);
        
        cout << "Leader " << nodeId << " accepted write: " << command << endl;
        
        // Replicate to followers
        replicateToFollowers();
        
        return true;
    }
    
    void replicateToFollowers() {
        for (const string& node : cluster) {
            if (node != nodeId) {
                sendAppendEntries(node);
            }
        }
    }
    
    void applyCommittedEntries() {
        while (lastApplied < commitIndex) {
            lastApplied++;
            cout << "Node " << nodeId << " applied: " << log[lastApplied].command << endl;
        }
    }
    
    // Utility methods
    void resetElectionTimeout() {
        uniform_int_distribution<> dis(150, 300);
        electionTimeout = chrono::milliseconds(dis(gen));
    }
    
    bool isElectionTimeoutExpired() {
        auto now = chrono::steady_clock::now();
        return (now - lastHeartbeat) > electionTimeout;
    }
    
    void tick() {
        lock_guard<mutex> lock(nodeMutex);
        
        if (currentState == State::LEADER) {
            sendHeartbeats();
        } else if (isElectionTimeoutExpired()) {
            startElection();
        }
    }
    
    // Getters
    State getState() const { return currentState; }
    int getTerm() const { return currentTerm; }
    string getNodeId() const { return nodeId; }
    
    void displayStatus() {
        lock_guard<mutex> lock(nodeMutex);
        string stateStr = (currentState == State::LEADER) ? "LEADER" :
                         (currentState == State::CANDIDATE) ? "CANDIDATE" : "FOLLOWER";
        
        cout << "Node " << nodeId << " - State: " << stateStr 
             << ", Term: " << currentTerm 
             << ", Log size: " << log.size()
             << ", Commit index: " << commitIndex << endl;
    }
    
private:
    void requestVote(const string& nodeId) {
        int lastLogIndex = log.empty() ? -1 : log.size() - 1;
        int lastLogTerm = log.empty() ? 0 : log.back().term;
        
        // Simulate sending requestVote RPC
        cout << "Candidate " << this->nodeId << " requesting vote from " << nodeId << endl;
    }
};

// Raft Cluster simulation
class RaftCluster {
private:
    vector<unique_ptr<RaftNode>> nodes;
    thread simulationThread;
    bool running;
    
public:
    RaftCluster(const vector<string>& nodeIds) : running(false) {
        for (const string& id : nodeIds) {
            nodes.push_back(make_unique<RaftNode>(id, nodeIds));
        }
    }
    
    void start() {
        running = true;
        simulationThread = thread(&RaftCluster::simulate, this);
        cout << "Raft cluster started with " << nodes.size() << " nodes" << endl;
    }
    
    void stop() {
        running = false;
        if (simulationThread.joinable()) {
            simulationThread.join();
        }
    }
    
    void simulate() {
        while (running) {
            for (auto& node : nodes) {
                node->tick();
            }
            
            this_thread::sleep_for(chrono::milliseconds(50));
        }
    }
    
    void clientWrite(const string& command) {
        // Find leader and send write
        for (auto& node : nodes) {
            if (node->getState() == RaftNode::State::LEADER) {
                node->clientWrite(command);
                return;
            }
        }
        cout << "No leader available for write: " << command << endl;
    }
    
    void displayClusterStatus() {
        cout << "\n=== Raft Cluster Status ===" << endl;
        for (auto& node : nodes) {
            node->displayStatus();
        }
    }
};
```

---

## 📋 REPLICATION STRATEGIES

### What is Replication?
**Real-World Analogy**: Like having backup copies of important documents in different safe locations - if one location is compromised, you still have access to your data.

```cpp
// Different replication strategies
class ReplicationStrategy {
public:
    virtual ~ReplicationStrategy() = default;
    virtual bool replicate(const string& key, const string& value) = 0;
    virtual string read(const string& key) = 0;
    virtual void handleNodeFailure(const string& nodeId) = 0;
};

// Master-Slave Replication
class MasterSlaveReplication : public ReplicationStrategy {
private:
    struct Node {
        string nodeId;
        map<string, string> data;
        bool isAvailable;
        bool isMaster;
        
        Node(const string& id, bool master = false) 
            : nodeId(id), isAvailable(true), isMaster(master) {}
    };
    
    unique_ptr<Node> master;
    vector<unique_ptr<Node>> slaves;
    mutex replicationMutex;
    
public:
    MasterSlaveReplication(const string& masterId, const vector<string>& slaveIds) {
        master = make_unique<Node>(masterId, true);
        
        for (const string& slaveId : slaveIds) {
            slaves.push_back(make_unique<Node>(slaveId, false));
        }
        
        cout << "Master-Slave replication initialized with master " << masterId 
             << " and " << slaves.size() << " slaves" << endl;
    }
    
    bool replicate(const string& key, const string& value) override {
        lock_guard<mutex> lock(replicationMutex);
        
        if (!master->isAvailable) {
            cout << "Master unavailable - write rejected" << endl;
            return false;
        }
        
        // Write to master first
        master->data[key] = value;
        cout << "Master " << master->nodeId << " wrote " << key << "=" << value << endl;
        
        // Asynchronously replicate to slaves
        thread([this, key, value]() {
            for (auto& slave : slaves) {
                if (slave->isAvailable) {
                    // Simulate network delay
                    this_thread::sleep_for(chrono::milliseconds(10));
                    slave->data[key] = value;
                    cout << "Slave " << slave->nodeId << " replicated " << key << "=" << value << endl;
                }
            }
        }).detach();
        
        return true;
    }
    
    string read(const string& key) override {
        lock_guard<mutex> lock(replicationMutex);
        
        // Read from master for strong consistency
        if (master->isAvailable) {
            auto it = master->data.find(key);
            if (it != master->data.end()) {
                cout << "Read from master: " << key << "=" << it->second << endl;
                return it->second;
            }
        }
        
        // Fallback to slaves for availability
        for (auto& slave : slaves) {
            if (slave->isAvailable) {
                auto it = slave->data.find(key);
                if (it != slave->data.end()) {
                    cout << "Read from slave " << slave->nodeId << ": " << key << "=" << it->second 
                         << " (potentially stale)" << endl;
                    return it->second;
                }
            }
        }
        
        return ""; // Not found
    }
    
    void handleNodeFailure(const string& nodeId) override {
        lock_guard<mutex> lock(replicationMutex);
        
        if (master->nodeId == nodeId) {
            master->isAvailable = false;
            cout << "Master " << nodeId << " failed - promoting slave to master" << endl;
            promoteSlaveToMaster();
        } else {
            for (auto& slave : slaves) {
                if (slave->nodeId == nodeId) {
                    slave->isAvailable = false;
                    cout << "Slave " << nodeId << " failed" << endl;
                    break;
                }
            }
        }
    }
    
private:
    void promoteSlaveToMaster() {
        // Find most up-to-date slave
        Node* bestSlave = nullptr;
        size_t maxDataSize = 0;
        
        for (auto& slave : slaves) {
            if (slave->isAvailable && slave->data.size() > maxDataSize) {
                bestSlave = slave.get();
                maxDataSize = slave->data.size();
            }
        }
        
        if (bestSlave) {
            bestSlave->isMaster = true;
            master = make_unique<Node>(bestSlave->nodeId, true);
            master->data = bestSlave->data;
            master->isAvailable = true;
            
            cout << "Promoted slave " << bestSlave->nodeId << " to master" << endl;
        }
    }
};

// Multi-Master Replication
class MultiMasterReplication : public ReplicationStrategy {
private:
    struct Node {
        string nodeId;
        map<string, string> data;
        map<string, int> vectorClock; // For conflict resolution
        bool isAvailable;
        
        Node(const string& id) : nodeId(id), isAvailable(true) {}
    };
    
    vector<unique_ptr<Node>> masters;
    mutex replicationMutex;
    
public:
    MultiMasterReplication(const vector<string>& masterIds) {
        for (const string& id : masterIds) {
            masters.push_back(make_unique<Node>(id));
        }
        
        cout << "Multi-Master replication initialized with " << masters.size() << " masters" << endl;
    }
    
    bool replicate(const string& key, const string& value) override {
        lock_guard<mutex> lock(replicationMutex);
        
        // Write to any available master
        for (auto& master : masters) {
            if (master->isAvailable) {
                master->data[key] = value;
                master->vectorClock[master->nodeId]++;
                
                cout << "Master " << master->nodeId << " wrote " << key << "=" << value << endl;
                
                // Asynchronously replicate to other masters
                thread([this, key, value, &master]() {
                    for (auto& otherMaster : masters) {
                        if (otherMaster->nodeId != master->nodeId && otherMaster->isAvailable) {
                            this_thread::sleep_for(chrono::milliseconds(20));
                            otherMaster->data[key] = value;
                            cout << "Replicated to master " << otherMaster->nodeId << endl;
                        }
                    }
                }).detach();
                
                return true;
            }
        }
        
        return false;
    }
    
    string read(const string& key) override {
        lock_guard<mutex> lock(replicationMutex);
        
        // Read from any available master
        for (auto& master : masters) {
            if (master->isAvailable) {
                auto it = master->data.find(key);
                if (it != master->data.end()) {
                    cout << "Read from master " << master->nodeId << ": " << key << "=" << it->second << endl;
                    return it->second;
                }
            }
        }
        
        return "";
    }
    
    void handleNodeFailure(const string& nodeId) override {
        lock_guard<mutex> lock(replicationMutex);
        
        for (auto& master : masters) {
            if (master->nodeId == nodeId) {
                master->isAvailable = false;
                cout << "Master " << nodeId << " failed" << endl;
                break;
            }
        }
    }
    
    void resolveConflicts() {
        cout << "Resolving conflicts using vector clocks..." << endl;
        // Implement conflict resolution logic
    }
};
```

---

## ⏰ DISTRIBUTED CLOCKS AND ORDERING

### What are Distributed Clocks?
**Real-World Analogy**: Like coordinating a global conference call where participants are in different time zones - you need a way to order events and establish causality.

```cpp
// Logical Clock implementations
class LogicalClock {
public:
    virtual ~LogicalClock() = default;
    virtual int tick() = 0;
    virtual void update(int receivedTime) = 0;
    virtual int getTime() const = 0;
};

// Lamport Clock
class LamportClock : public LogicalClock {
private:
    atomic<int> logicalTime{0};
    
public:
    int tick() override {
        return ++logicalTime;
    }
    
    void update(int receivedTime) override {
        int currentTime = logicalTime.load();
        logicalTime.store(max(currentTime, receivedTime) + 1);
    }
    
    int getTime() const override {
        return logicalTime.load();
    }
};

// Vector Clock
class VectorClock : public LogicalClock {
private:
    string nodeId;
    map<string, int> clock;
    vector<string> nodeIds;
    mutex clockMutex;
    
public:
    VectorClock(const string& id, const vector<string>& nodes) : nodeId(id), nodeIds(nodes) {
        for (const string& node : nodes) {
            clock[node] = 0;
        }
    }
    
    int tick() override {
        lock_guard<mutex> lock(clockMutex);
        return ++clock[nodeId];
    }
    
    void update(int receivedTime) override {
        // For vector clocks, we need the full vector
        // This is simplified - in practice, you'd receive the full vector
        lock_guard<mutex> lock(clockMutex);
        clock[nodeId]++;
    }
    
    void update(const map<string, int>& receivedClock) {
        lock_guard<mutex> lock(clockMutex);
        
        for (const string& node : nodeIds) {
            if (node != nodeId) {
                auto it = receivedClock.find(node);
                if (it != receivedClock.end()) {
                    clock[node] = max(clock[node], it->second);
                }
            }
        }
        clock[nodeId]++;
    }
    
    int getTime() const override {
        lock_guard<mutex> lock(clockMutex);
        return clock.at(nodeId);
    }
    
    map<string, int> getVectorClock() const {
        lock_guard<mutex> lock(clockMutex);
        return clock;
    }
    
    // Check if this event happened before another
    bool happenedBefore(const map<string, int>& otherClock) const {
        lock_guard<mutex> lock(clockMutex);
        
        bool allLessOrEqual = true;
        bool atLeastOneLess = false;
        
        for (const string& node : nodeIds) {
            int myTime = clock.at(node);
            int otherTime = otherClock.at(node);
            
            if (myTime > otherTime) {
                allLessOrEqual = false;
                break;
            }
            if (myTime < otherTime) {
                atLeastOneLess = true;
            }
        }
        
        return allLessOrEqual && atLeastOneLess;
    }
    
    void displayClock() const {
        lock_guard<mutex> lock(clockMutex);
        cout << "Node " << nodeId << " vector clock: [";
        for (const auto& entry : clock) {
            cout << entry.first << ":" << entry.second << " ";
        }
        cout << "]" << endl;
    }
};

// Distributed Event with ordering
struct DistributedEvent {
    string eventId;
    string nodeId;
    string eventType;
    string data;
    int lamportTime;
    map<string, int> vectorTime;
    chrono::system_clock::time_point physicalTime;
    
    DistributedEvent(const string& id, const string& node, const string& type, 
                    const string& eventData, int lTime, const map<string, int>& vTime)
        : eventId(id), nodeId(node), eventType(type), data(eventData), 
          lamportTime(lTime), vectorTime(vTime), physicalTime(chrono::system_clock::now()) {}
};

// Event ordering system
class EventOrderingSystem {
private:
    vector<DistributedEvent> events;
    mutex eventsMutex;
    
public:
    void addEvent(const DistributedEvent& event) {
        lock_guard<mutex> lock(eventsMutex);
        events.push_back(event);
        cout << "Added event " << event.eventId << " from node " << event.nodeId 
             << " with Lamport time " << event.lamportTime << endl;
    }
    
    vector<DistributedEvent> getLamportOrdering() {
        lock_guard<mutex> lock(eventsMutex);
        
        vector<DistributedEvent> sortedEvents = events;
        sort(sortedEvents.begin(), sortedEvents.end(), 
            [](const DistributedEvent& a, const DistributedEvent& b) {
                if (a.lamportTime != b.lamportTime) {
                    return a.lamportTime < b.lamportTime;
                }
                return a.nodeId < b.nodeId; // Tie-breaker
            });
        
        return sortedEvents;
    }
    
    vector<DistributedEvent> getCausalOrdering() {
        lock_guard<mutex> lock(eventsMutex);
        
        vector<DistributedEvent> orderedEvents;
        vector<DistributedEvent> remainingEvents = events;
        
        while (!remainingEvents.empty()) {
            for (auto it = remainingEvents.begin(); it != remainingEvents.end(); ++it) {
                bool canAdd = true;
                
                // Check if all causally preceding events are already ordered
                for (const auto& orderedEvent : orderedEvents) {
                    VectorClock tempClock("temp", {"A", "B", "C"});
                    if (tempClock.happenedBefore(it->vectorTime)) {
                        // This event depends on an event not yet ordered
                        canAdd = false;
                        break;
                    }
                }
                
                if (canAdd) {
                    orderedEvents.push_back(*it);
                    remainingEvents.erase(it);
                    break;
                }
            }
        }
        
        return orderedEvents;
    }
    
    void displayEventOrdering(const string& orderingType) {
        vector<DistributedEvent> orderedEvents;
        
        if (orderingType == "lamport") {
            orderedEvents = getLamportOrdering();
        } else if (orderingType == "causal") {
            orderedEvents = getCausalOrdering();
        }
        
        cout << "\n=== " << orderingType << " Ordering ===" << endl;
        for (const auto& event : orderedEvents) {
            cout << "Event " << event.eventId << " (Node " << event.nodeId 
                 << ", Lamport: " << event.lamportTime << "): " << event.data << endl;
        }
    }
};
```

---

## 🔧 FAILURE DETECTION AND RECOVERY

### What is Failure Detection?
**Real-World Analogy**: Like a security system that monitors all doors and windows - if one stops responding, the system needs to detect it and take appropriate action.

```cpp
// Failure Detection System
class FailureDetector {
public:
    enum class NodeStatus {
        ALIVE,
        SUSPECTED,
        FAILED
    };
    
private:
    struct NodeInfo {
        string nodeId;
        NodeStatus status;
        chrono::steady_clock::time_point lastHeartbeat;
        int missedHeartbeats;
        double suspicionLevel;
        
        NodeInfo(const string& id) : nodeId(id), status(NodeStatus::ALIVE), 
                                   lastHeartbeat(chrono::steady_clock::now()), 
                                   missedHeartbeats(0), suspicionLevel(0.0) {}
    };
    
    map<string, unique_ptr<NodeInfo>> nodes;
    chrono::milliseconds heartbeatInterval;
    chrono::milliseconds timeoutThreshold;
    int maxMissedHeartbeats;
    mutex detectorMutex;
    
    // Monitoring thread
    thread monitoringThread;
    bool monitoring;
    
public:
    FailureDetector(chrono::milliseconds interval = chrono::milliseconds(1000),
                   chrono::milliseconds timeout = chrono::milliseconds(5000),
                   int maxMissed = 3)
        : heartbeatInterval(interval), timeoutThreshold(timeout), 
          maxMissedHeartbeats(maxMissed), monitoring(false) {}
    
    ~FailureDetector() {
        stopMonitoring();
    }
    
    void addNode(const string& nodeId) {
        lock_guard<mutex> lock(detectorMutex);
        nodes[nodeId] = make_unique<NodeInfo>(nodeId);
        cout << "Added node " << nodeId << " to failure detector" << endl;
    }
    
    void removeNode(const string& nodeId) {
        lock_guard<mutex> lock(detectorMutex);
        nodes.erase(nodeId);
        cout << "Removed node " << nodeId << " from failure detector" << endl;
    }
    
    void receiveHeartbeat(const string& nodeId) {
        lock_guard<mutex> lock(detectorMutex);
        
        auto it = nodes.find(nodeId);
        if (it != nodes.end()) {
            it->second->lastHeartbeat = chrono::steady_clock::now();
            it->second->missedHeartbeats = 0;
            it->second->suspicionLevel = 0.0;
            
            if (it->second->status != NodeStatus::ALIVE) {
                it->second->status = NodeStatus::ALIVE;
                cout << "Node " << nodeId << " recovered" << endl;
            }
        }
    }
    
    void startMonitoring() {
        monitoring = true;
        monitoringThread = thread(&FailureDetector::monitorNodes, this);
        cout << "Failure detector monitoring started" << endl;
    }
    
    void stopMonitoring() {
        monitoring = false;
        if (monitoringThread.joinable()) {
            monitoringThread.join();
        }
    }
    
    NodeStatus getNodeStatus(const string& nodeId) {
        lock_guard<mutex> lock(detectorMutex);
        auto it = nodes.find(nodeId);
        return (it != nodes.end()) ? it->second->status : NodeStatus::FAILED;
    }
    
    vector<string> getAliveNodes() {
        lock_guard<mutex> lock(detectorMutex);
        vector<string> aliveNodes;
        
        for (const auto& node : nodes) {
            if (node.second->status == NodeStatus::ALIVE) {
                aliveNodes.push_back(node.first);
            }
        }
        
        return aliveNodes;
    }
    
    vector<string> getFailedNodes() {
        lock_guard<mutex> lock(detectorMutex);
        vector<string> failedNodes;
        
        for (const auto& node : nodes) {
            if (node.second->status == NodeStatus::FAILED) {
                failedNodes.push_back(node.first);
            }
        }
        
        return failedNodes;
    }
    
    void displayStatus() {
        lock_guard<mutex> lock(detectorMutex);
        
        cout << "\n=== Failure Detector Status ===" << endl;
        for (const auto& node : nodes) {
            string statusStr = (node.second->status == NodeStatus::ALIVE) ? "ALIVE" :
                              (node.second->status == NodeStatus::SUSPECTED) ? "SUSPECTED" : "FAILED";
            
            auto timeSinceHeartbeat = chrono::steady_clock::now() - node.second->lastHeartbeat;
            auto millisSince = chrono::duration_cast<chrono::milliseconds>(timeSinceHeartbeat);
            
            cout << "Node " << node.first << " - Status: " << statusStr 
                 << ", Last heartbeat: " << millisSince.count() << "ms ago"
                 << ", Missed: " << node.second->missedHeartbeats 
                 << ", Suspicion: " << (int)(node.second->suspicionLevel * 100) << "%" << endl;
        }
    }
    
private:
    void monitorNodes() {
        while (monitoring) {
            {
                lock_guard<mutex> lock(detectorMutex);
                auto now = chrono::steady_clock::now();
                
                for (auto& node : nodes) {
                    auto timeSinceHeartbeat = now - node.second->lastHeartbeat;
                    
                    if (timeSinceHeartbeat > heartbeatInterval) {
                        node.second->missedHeartbeats++;
                        node.second->suspicionLevel = min(1.0, 
                            (double)node.second->missedHeartbeats / maxMissedHeartbeats);
                        
                        if (node.second->missedHeartbeats >= maxMissedHeartbeats) {
                            if (node.second->status != NodeStatus::FAILED) {
                                node.second->status = NodeStatus::FAILED;
                                cout << "Node " << node.first << " marked as FAILED" << endl;
                            }
                        } else if (node.second->suspicionLevel > 0.5) {
                            if (node.second->status == NodeStatus::ALIVE) {
                                node.second->status = NodeStatus::SUSPECTED;
                                cout << "Node " << node.first << " marked as SUSPECTED" << endl;
                            }
                        }
                    }
                }
            }
            
            this_thread::sleep_for(heartbeatInterval);
        }
    }
};

// Recovery Manager
class RecoveryManager {
private:
    FailureDetector& failureDetector;
    map<string, function<void(const string&)>> recoveryStrategies;
    mutex recoveryMutex;
    
public:
    RecoveryManager(FailureDetector& detector) : failureDetector(detector) {}
    
    void registerRecoveryStrategy(const string& nodeType, function<void(const string&)> strategy) {
        lock_guard<mutex> lock(recoveryMutex);
        recoveryStrategies[nodeType] = strategy;
        cout << "Registered recovery strategy for " << nodeType << " nodes" << endl;
    }
    
    void handleNodeFailure(const string& nodeId, const string& nodeType) {
        lock_guard<mutex> lock(recoveryMutex);
        
        cout << "Handling failure of " << nodeType << " node " << nodeId << endl;
        
        auto it = recoveryStrategies.find(nodeType);
        if (it != recoveryStrategies.end()) {
            it->second(nodeId);
        } else {
            defaultRecoveryStrategy(nodeId);
        }
    }
    
private:
    void defaultRecoveryStrategy(const string& nodeId) {
        cout << "Applying default recovery strategy for node " << nodeId << endl;
        
        // 1. Remove failed node from active set
        // 2. Redistribute its responsibilities
        // 3. Start replacement node if needed
        // 4. Update routing tables
        
        cout << "Default recovery completed for node " << nodeId << endl;
    }
};
```

---

## ⚡ Key Takeaways

1. **CAP Theorem** forces you to choose 2 out of 3: Consistency, Availability, Partition tolerance
2. **Consensus algorithms** like Raft ensure all nodes agree on the same state
3. **Replication strategies** provide fault tolerance but introduce complexity
4. **Logical clocks** help order events in distributed systems without synchronized physical clocks
5. **Failure detection** is crucial for maintaining system health and triggering recovery
6. **Recovery mechanisms** ensure systems can heal themselves after failures

## 🎯 Next Steps

- Study specific consensus algorithms (Paxos, PBFT, etc.)
- Learn about distributed databases and sharding strategies
- Explore consistency models (eventual, strong, causal)
- Understand distributed transactions and two-phase commit
- Practice designing fault-tolerant distributed systems

---
*"In distributed systems, everything that can go wrong will go wrong, and you need to be prepared for it!"* 🌐
