# Heaps - Priority-Based Trees (Like Hospital Emergency Rooms)

## 🌟 Real-World Story: The Hospital Emergency Room

Imagine you're managing a busy hospital emergency room! 🏥

**The Challenge**: Patients arrive at different times, but they can't be treated in first-come-first-served order. A patient with a heart attack needs immediate attention, even if someone with a minor cut arrived first!

**Traditional Queue (FIFO)**:
```
Waiting Line: [Minor Cut] → [Broken Arm] → [Heart Attack] → [Headache]
Problem: Heart attack patient waits behind minor injuries! 😱
```

**Emergency Room Priority System (Heap)**:
```
Priority Tree (Max-Heap by urgency):
        Heart Attack (10)
       /                \
  Broken Arm (7)    Headache (3)
  /
Minor Cut (2)

Treatment Order: Heart Attack → Broken Arm → Headache → Minor Cut
```

**The Heap Rules**:
- **Highest priority** patient is always at the **top** (root)
- **Parent** always has **higher priority** than children
- When highest priority patient is treated, the **next highest** automatically moves to the top
- **New patients** are efficiently inserted while maintaining priority order

This is exactly how a **Heap** works! It's a special binary tree where:
- **Parent nodes** have **higher priority** than their children (Max-Heap)
- OR **Parent nodes** have **lower priority** than their children (Min-Heap)
- The **root** always contains the **highest/lowest priority** element
- Enables **efficient priority-based operations**!

## 🎯 What You'll Learn
- Understanding heaps through emergency room and priority analogies
- Max-heap vs Min-heap concepts
- Heap operations: insert, extract, heapify
- Array-based heap implementation
- Priority queues and real-world applications

---

## 📝 Table of Contents
1. [Why Heaps Matter](#why-heaps-matter)
2. [Heap Properties and Types](#heap-properties-and-types)
3. [Heap Operations](#heap-operations)
4. [Array-Based Implementation](#array-based-implementation)
5. [Priority Queue Applications](#priority-queue-applications)
6. [Real-World Applications](#real-world-applications)
7. [Practice Problems](#practice-problems)

---

## Why Heaps Matter

### 🎫 The Concert Ticket Problem

**Scenario**: You're selling concert tickets with different pricing tiers.

**Traditional Approach (Unsorted List)**:
- VIP: $500, Premium: $200, Standard: $100, Economy: $50
- To find the most expensive available ticket: Check every ticket type
- Time: O(n) - slow for large venues!

**Heap Approach (Priority-Based)**:
```
Max-Heap (Highest Price First):
        VIP ($500)
       /          \
Premium ($200)  Standard ($100)
  /
Economy ($50)

Always get highest-priced available ticket in O(1) time!
```

### 🚨 The Task Scheduler Problem

**Operating System Task Management**:
```
Process Priority Heap:
        Critical System (Priority 10)
       /                           \
  Important App (8)          Background (3)
  /              \           /
User Task (5)  Update (6)  Cleanup (1)

CPU always processes highest priority task first!
```

**Benefits**:
- **Instant access** to highest priority item: O(1)
- **Efficient insertion** of new items: O(log n)
- **Efficient removal** of highest priority: O(log n)
- **Automatic reordering** when priorities change

---

## Heap Properties and Types

### 🔺 Max-Heap vs Min-Heap

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class HeapDemo {
public:
    void explainHeapTypes() {
        cout << "🔺 Heap Types Explanation" << endl;
        cout << "=========================" << endl;
        cout << endl;
        
        cout << "📈 MAX-HEAP (Parent ≥ Children):" << endl;
        cout << "        100" << endl;
        cout << "       /   \\" << endl;
        cout << "      80    90" << endl;
        cout << "     / \\   /" << endl;
        cout << "    70 60 85" << endl;
        cout << endl;
        cout << "✅ Properties:" << endl;
        cout << "   - Root has MAXIMUM value" << endl;
        cout << "   - Every parent ≥ its children" << endl;
        cout << "   - Used for: Priority queues, finding maximum" << endl;
        cout << endl;
        
        cout << "📉 MIN-HEAP (Parent ≤ Children):" << endl;
        cout << "        10" << endl;
        cout << "       /  \\" << endl;
        cout << "      20   30" << endl;
        cout << "     / \\  /" << endl;
        cout << "    40 50 35" << endl;
        cout << endl;
        cout << "✅ Properties:" << endl;
        cout << "   - Root has MINIMUM value" << endl;
        cout << "   - Every parent ≤ its children" << endl;
        cout << "   - Used for: Finding minimum, shortest paths" << endl;
        cout << endl;
        
        cout << "🔍 Key Differences from BST:" << endl;
        cout << "   BST: Left < Root < Right (ordered left-to-right)" << endl;
        cout << "   Heap: Parent > Children (ordered top-to-bottom)" << endl;
        cout << "   BST: Good for searching specific values" << endl;
        cout << "   Heap: Good for finding min/max quickly" << endl;
    }
    
    bool isMaxHeap(vector<int>& arr) {
        int n = arr.size();
        
        // Check heap property for all non-leaf nodes
        for (int i = 0; i < n / 2; i++) {
            int leftChild = 2 * i + 1;
            int rightChild = 2 * i + 2;
            
            // Check left child
            if (leftChild < n && arr[i] < arr[leftChild]) {
                return false;
            }
            
            // Check right child
            if (rightChild < n && arr[i] < arr[rightChild]) {
                return false;
            }
        }
        
        return true;
    }
    
    void testHeapProperty() {
        cout << "\n🧪 Testing Heap Property:" << endl;
        cout << "=========================" << endl;
        
        vector<int> maxHeapArray = {100, 80, 90, 70, 60, 85};
        vector<int> notHeapArray = {100, 80, 90, 95, 60, 85}; // 95 > 80 violates max-heap
        
        cout << "Array 1: ";
        for (int val : maxHeapArray) cout << val << " ";
        cout << "\nIs Max-Heap: " << (isMaxHeap(maxHeapArray) ? "YES ✅" : "NO ❌") << endl;
        
        cout << "\nArray 2: ";
        for (int val : notHeapArray) cout << val << " ";
        cout << "\nIs Max-Heap: " << (isMaxHeap(notHeapArray) ? "YES ✅" : "NO ❌") << endl;
    }
};

int main() {
    HeapDemo demo;
    demo.explainHeapTypes();
    demo.testHeapProperty();
    
    return 0;
}
```

### 📊 Complete Binary Tree Structure

Heaps are **complete binary trees** stored in arrays:

```
Heap Tree:           Array Representation:
     50              [50, 30, 40, 10, 20, 35, 25]
   /    \             0   1   2   3   4   5   6
  30     40
 / \    / \
10 20  35 25

Array Index Relationships:
- Parent of node i: (i-1)/2
- Left child of node i: 2*i + 1  
- Right child of node i: 2*i + 2
```

---

## Heap Operations

### 🔄 Insert Operation (Bubble Up)

```cpp
#include <iostream>
#include <vector>
using namespace std;

class MaxHeap {
private:
    vector<int> heap;
    
    // Helper function to maintain heap property upward
    void heapifyUp(int index) {
        if (index == 0) return; // Reached root
        
        int parentIndex = (index - 1) / 2;
        
        if (heap[index] > heap[parentIndex]) {
            cout << "   🔄 Swapping " << heap[index] << " with parent " << heap[parentIndex] << endl;
            swap(heap[index], heap[parentIndex]);
            heapifyUp(parentIndex); // Continue bubbling up
        }
    }
    
    // Helper function to maintain heap property downward
    void heapifyDown(int index) {
        int largest = index;
        int leftChild = 2 * index + 1;
        int rightChild = 2 * index + 2;
        
        // Find largest among parent and children
        if (leftChild < heap.size() && heap[leftChild] > heap[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < heap.size() && heap[rightChild] > heap[largest]) {
            largest = rightChild;
        }
        
        // If largest is not the parent, swap and continue
        if (largest != index) {
            cout << "   🔄 Swapping " << heap[index] << " with " << heap[largest] << endl;
            swap(heap[index], heap[largest]);
            heapifyDown(largest);
        }
    }
    
public:
    // Insert new element (like admitting new patient)
    void insert(int value) {
        cout << "\n🏥 Admitting patient with priority " << value << endl;
        
        // Add to end of heap (last position in complete binary tree)
        heap.push_back(value);
        cout << "   📍 Added to position " << (heap.size() - 1) << endl;
        
        // Bubble up to maintain heap property
        cout << "   ⬆️ Bubbling up to correct position..." << endl;
        heapifyUp(heap.size() - 1);
        
        cout << "   ✅ Patient positioned correctly!" << endl;
        displayHeap();
    }
    
    // Extract maximum element (treat highest priority patient)
    int extractMax() {
        if (heap.empty()) {
            cout << "❌ No patients to treat!" << endl;
            return -1;
        }
        
        int maxValue = heap[0];
        cout << "\n🏥 Treating highest priority patient: " << maxValue << endl;
        
        // Move last element to root
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!heap.empty()) {
            cout << "   📍 Moved last patient " << heap[0] << " to front" << endl;
            cout << "   ⬇️ Bubbling down to correct position..." << endl;
            heapifyDown(0);
        }
        
        cout << "   ✅ Treatment complete!" << endl;
        displayHeap();
        return maxValue;
    }
    
    // Peek at maximum without removing
    int peek() {
        if (heap.empty()) {
            cout << "👀 No patients waiting" << endl;
            return -1;
        }
        
        cout << "👀 Next patient priority: " << heap[0] << endl;
        return heap[0];
    }
    
    // Display current heap
    void displayHeap() {
        if (heap.empty()) {
            cout << "🏥 Emergency room is empty!" << endl;
            return;
        }
        
        cout << "   Current queue: ";
        for (int i = 0; i < heap.size(); i++) {
            cout << heap[i];
            if (i == 0) cout << "(next)";
            if (i < heap.size() - 1) cout << " → ";
        }
        cout << endl;
    }
    
    // Get heap size
    int size() {
        return heap.size();
    }
    
    bool empty() {
        return heap.empty();
    }
};

int main() {
    MaxHeap emergencyRoom;
    
    cout << "🏥 Emergency Room Priority System" << endl;
    cout << "=================================" << endl;
    
    // Patients arriving with different priorities
    emergencyRoom.insert(5);   // Moderate injury
    emergencyRoom.insert(10);  // Critical condition
    emergencyRoom.insert(3);   // Minor issue
    emergencyRoom.insert(8);   // Serious condition
    emergencyRoom.insert(1);   // Very minor
    emergencyRoom.insert(9);   // Very serious
    
    cout << "\n🔍 Checking next patient:" << endl;
    emergencyRoom.peek();
    
    // Treating patients in priority order
    cout << "\n👩‍⚕️ Treating patients in priority order:" << endl;
    while (!emergencyRoom.empty()) {
        emergencyRoom.extractMax();
    }
    
    return 0;
}
```

### 🏗️ Build Heap (Heapify)

```cpp
class HeapBuilder {
public:
    // Build heap from unsorted array
    vector<int> buildMaxHeap(vector<int> arr) {
        cout << "\n🏗️ Building Max-Heap from unsorted array" << endl;
        cout << "=========================================" << endl;
        
        cout << "Original array: ";
        for (int val : arr) cout << val << " ";
        cout << endl;
        
        int n = arr.size();
        
        // Start from last non-leaf node and heapify downward
        for (int i = n / 2 - 1; i >= 0; i--) {
            cout << "\n🔧 Heapifying subtree rooted at index " << i << " (value: " << arr[i] << ")" << endl;
            heapifyDown(arr, n, i);
        }
        
        cout << "\n✅ Heap construction complete!" << endl;
        cout << "Final heap: ";
        for (int val : arr) cout << val << " ";
        cout << endl;
        
        return arr;
    }
    
private:
    void heapifyDown(vector<int>& arr, int n, int index) {
        int largest = index;
        int leftChild = 2 * index + 1;
        int rightChild = 2 * index + 2;
        
        // Find largest among parent and children
        if (leftChild < n && arr[leftChild] > arr[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < n && arr[rightChild] > arr[largest]) {
            largest = rightChild;
        }
        
        // If largest is not the parent, swap and continue
        if (largest != index) {
            cout << "   🔄 Swapping " << arr[index] << " with " << arr[largest] << endl;
            swap(arr[index], arr[largest]);
            heapifyDown(arr, n, largest);
        }
    }
};

int main() {
    HeapBuilder builder;
    
    vector<int> unsortedArray = {4, 10, 3, 5, 1, 8, 9, 2};
    vector<int> heap = builder.buildMaxHeap(unsortedArray);
    
    return 0;
}
```

---

## Array-Based Implementation

### 📦 Complete Heap Implementation

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

template<typename T>
class Heap {
private:
    vector<T> data;
    bool isMaxHeap; // true for max-heap, false for min-heap
    
    int parent(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return 2 * i + 1; }
    int rightChild(int i) { return 2 * i + 2; }
    
    bool compare(T a, T b) {
        return isMaxHeap ? (a > b) : (a < b);
    }
    
    void heapifyUp(int index) {
        if (index == 0) return;
        
        int parentIdx = parent(index);
        if (compare(data[index], data[parentIdx])) {
            swap(data[index], data[parentIdx]);
            heapifyUp(parentIdx);
        }
    }
    
    void heapifyDown(int index) {
        int targetIdx = index;
        int leftIdx = leftChild(index);
        int rightIdx = rightChild(index);
        
        if (leftIdx < data.size() && compare(data[leftIdx], data[targetIdx])) {
            targetIdx = leftIdx;
        }
        
        if (rightIdx < data.size() && compare(data[rightIdx], data[targetIdx])) {
            targetIdx = rightIdx;
        }
        
        if (targetIdx != index) {
            swap(data[index], data[targetIdx]);
            heapifyDown(targetIdx);
        }
    }
    
public:
    Heap(bool maxHeap = true) : isMaxHeap(maxHeap) {
        cout << "📦 Created " << (maxHeap ? "Max" : "Min") << "-Heap" << endl;
    }
    
    void insert(T value) {
        data.push_back(value);
        heapifyUp(data.size() - 1);
        cout << "➕ Inserted " << value << " (size: " << data.size() << ")" << endl;
    }
    
    T extract() {
        if (data.empty()) {
            throw runtime_error("Heap is empty!");
        }
        
        T result = data[0];
        data[0] = data.back();
        data.pop_back();
        
        if (!data.empty()) {
            heapifyDown(0);
        }
        
        cout << "➖ Extracted " << result << " (size: " << data.size() << ")" << endl;
        return result;
    }
    
    T peek() {
        if (data.empty()) {
            throw runtime_error("Heap is empty!");
        }
        return data[0];
    }
    
    bool empty() { return data.empty(); }
    int size() { return data.size(); }
    
    void display() {
        if (data.empty()) {
            cout << "📦 Heap is empty!" << endl;
            return;
        }
        
        cout << "📦 Heap contents: ";
        for (int i = 0; i < data.size(); i++) {
            cout << data[i];
            if (i == 0) cout << "(top)";
            if (i < data.size() - 1) cout << " ";
        }
        cout << endl;
    }
    
    // Build heap from existing array
    void buildHeap(vector<T> arr) {
        data = arr;
        
        // Start from last non-leaf node
        for (int i = data.size() / 2 - 1; i >= 0; i--) {
            heapifyDown(i);
        }
        
        cout << "🏗️ Built heap from array (size: " << data.size() << ")" << endl;
    }
    
    // Heap sort
    vector<T> heapSort() {
        vector<T> original = data; // Save original
        vector<T> sorted;
        
        cout << "\n🔄 Performing heap sort..." << endl;
        
        while (!data.empty()) {
            sorted.push_back(extract());
        }
        
        data = original; // Restore original heap
        
        if (!isMaxHeap) {
            reverse(sorted.begin(), sorted.end());
        }
        
        return sorted;
    }
};

int main() {
    cout << "📦 Complete Heap Implementation Demo" << endl;
    cout << "====================================" << endl;
    
    // Max-Heap demo
    Heap<int> maxHeap(true);
    
    cout << "\n➕ Building Max-Heap:" << endl;
    vector<int> values = {4, 10, 3, 5, 1, 8, 9, 2};
    for (int val : values) {
        maxHeap.insert(val);
    }
    maxHeap.display();
    
    cout << "\n👀 Peek at maximum: " << maxHeap.peek() << endl;
    
    cout << "\n➖ Extracting elements:" << endl;
    for (int i = 0; i < 3; i++) {
        maxHeap.extract();
        maxHeap.display();
    }
    
    // Min-Heap demo
    cout << "\n" << string(40, '-') << endl;
    Heap<int> minHeap(false);
    
    cout << "\n➕ Building Min-Heap:" << endl;
    minHeap.buildHeap({4, 10, 3, 5, 1, 8, 9, 2});
    minHeap.display();
    
    cout << "\n👀 Peek at minimum: " << minHeap.peek() << endl;
    
    // Heap sort demo
    cout << "\n🔄 Heap Sort Demo:" << endl;
    vector<int> sorted = minHeap.heapSort();
    cout << "Sorted array: ";
    for (int val : sorted) cout << val << " ";
    cout << endl;
    
    return 0;
}
```

---

## Priority Queue Applications

### 🎮 Game Leaderboard System

```cpp
#include <iostream>
#include <string>
#include <queue>
using namespace std;

struct Player {
    string name;
    int score;
    int level;
    
    Player(string n, int s, int l) : name(n), score(s), level(l) {}
    
    // For priority queue (higher score = higher priority)
    bool operator<(const Player& other) const {
        if (score != other.score) {
            return score < other.score; // Higher score has higher priority
        }
        return level < other.level; // If scores equal, higher level wins
    }
};

class GameLeaderboard {
private:
    priority_queue<Player> leaderboard; // Max-heap by default
    
public:
    void addPlayer(string name, int score, int level) {
        leaderboard.push(Player(name, score, level));
        cout << "🎮 Added player: " << name 
             << " (Score: " << score << ", Level: " << level << ")" << endl;
    }
    
    void showTopPlayers(int count = 5) {
        cout << "\n🏆 Top " << count << " Players:" << endl;
        cout << "========================" << endl;
        
        priority_queue<Player> temp = leaderboard; // Copy for display
        
        for (int i = 1; i <= count && !temp.empty(); i++) {
            Player top = temp.top();
            temp.pop();
            
            cout << i << ". " << top.name 
                 << " - Score: " << top.score 
                 << ", Level: " << top.level << endl;
        }
    }
    
    Player getWinner() {
        if (leaderboard.empty()) {
            throw runtime_error("No players in leaderboard!");
        }
        
        Player winner = leaderboard.top();
        cout << "\n👑 Tournament Winner: " << winner.name 
             << " (Score: " << winner.score << ")" << endl;
        
        return winner;
    }
    
    void updateScore(string playerName, int newScore) {
        // Note: In real implementation, you'd need a more sophisticated
        // data structure to efficiently update scores
        cout << "📊 Score updated for " << playerName << ": " << newScore << endl;
        cout << "   (In practice, would rebuild heap or use indexed heap)" << endl;
    }
};

int main() {
    GameLeaderboard tournament;
    
    cout << "🎮 Game Tournament Leaderboard" << endl;
    cout << "==============================" << endl;
    
    // Players joining tournament
    tournament.addPlayer("Alice", 95000, 45);
    tournament.addPlayer("Bob", 87000, 38);
    tournament.addPlayer("Charlie", 92000, 42);
    tournament.addPlayer("Diana", 98000, 47);
    tournament.addPlayer("Eve", 89000, 40);
    tournament.addPlayer("Frank", 95000, 43); // Same score as Alice, lower level
    
    // Show current standings
    tournament.showTopPlayers();
    
    // Announce winner
    tournament.getWinner();
    
    return 0;
}
```

### 📋 Task Scheduler with Deadlines

```cpp
#include <iostream>
#include <string>
#include <queue>
#include <ctime>
using namespace std;

struct Task {
    string name;
    int priority;
    time_t deadline;
    int estimatedTime; // in minutes
    
    Task(string n, int p, time_t d, int t) 
        : name(n), priority(p), deadline(d), estimatedTime(t) {}
    
    // Higher priority and earlier deadline = higher precedence
    bool operator<(const Task& other) const {
        if (priority != other.priority) {
            return priority < other.priority; // Higher priority first
        }
        return deadline > other.deadline; // Earlier deadline first
    }
};

class TaskScheduler {
private:
    priority_queue<Task> taskQueue;
    
public:
    void addTask(string name, int priority, int hoursFromNow, int estimatedMinutes) {
        time_t now = time(0);
        time_t deadline = now + (hoursFromNow * 3600); // Convert hours to seconds
        
        taskQueue.push(Task(name, priority, deadline, estimatedMinutes));
        
        cout << "📋 Added task: " << name 
             << " (Priority: " << priority 
             << ", Due in: " << hoursFromNow << "h"
             << ", Est. time: " << estimatedMinutes << "m)" << endl;
    }
    
    void processNextTask() {
        if (taskQueue.empty()) {
            cout << "✅ All tasks completed!" << endl;
            return;
        }
        
        Task nextTask = taskQueue.top();
        taskQueue.pop();
        
        time_t now = time(0);
        int hoursLeft = (nextTask.deadline - now) / 3600;
        
        cout << "\n⚡ Processing: " << nextTask.name << endl;
        cout << "   Priority: " << nextTask.priority << endl;
        cout << "   Time left: " << hoursLeft << " hours" << endl;
        cout << "   Estimated duration: " << nextTask.estimatedTime << " minutes" << endl;
        
        if (hoursLeft < 0) {
            cout << "   ⚠️ WARNING: Task is overdue!" << endl;
        }
    }
    
    void showTaskQueue() {
        if (taskQueue.empty()) {
            cout << "\n📋 No pending tasks!" << endl;
            return;
        }
        
        cout << "\n📋 Pending Tasks (in priority order):" << endl;
        cout << "=====================================" << endl;
        
        priority_queue<Task> temp = taskQueue;
        int position = 1;
        
        while (!temp.empty()) {
            Task task = temp.top();
            temp.pop();
            
            time_t now = time(0);
            int hoursLeft = (task.deadline - now) / 3600;
            
            cout << position << ". " << task.name 
                 << " (P:" << task.priority 
                 << ", " << hoursLeft << "h left)" << endl;
            position++;
        }
    }
    
    int pendingTasks() {
        return taskQueue.size();
    }
};

int main() {
    TaskScheduler scheduler;
    
    cout << "📋 Priority Task Scheduler" << endl;
    cout << "==========================" << endl;
    
    // Adding tasks with different priorities and deadlines
    scheduler.addTask("Fix critical bug", 10, 2, 60);        // High priority, due soon
    scheduler.addTask("Write documentation", 3, 24, 120);    // Low priority, due later
    scheduler.addTask("Code review", 7, 4, 30);              // Medium priority
    scheduler.addTask("Deploy to production", 9, 1, 45);     // High priority, due very soon
    scheduler.addTask("Team meeting", 5, 8, 60);             // Medium priority
    scheduler.addTask("Update dependencies", 4, 48, 90);     // Low priority, due much later
    
    // Show current task queue
    scheduler.showTaskQueue();
    
    // Process tasks in priority order
    cout << "\n⚡ Processing tasks in optimal order:" << endl;
    cout << "====================================" << endl;
    
    while (scheduler.pendingTasks() > 0) {
        scheduler.processNextTask();
        
        if (scheduler.pendingTasks() > 0) {
            cout << "\n📊 Remaining tasks: " << scheduler.pendingTasks() << endl;
            cout << string(40, '-') << endl;
        }
    }
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🚑 Emergency Response System

```cpp
#include <iostream>
#include <string>
#include <queue>
#include <ctime>
using namespace std;

struct Emergency {
    string type;
    string location;
    int severity; // 1-10, 10 being most severe
    time_t reportTime;
    string description;
    
    Emergency(string t, string loc, int sev, string desc) 
        : type(t), location(loc), severity(sev), description(desc) {
        reportTime = time(0);
    }
    
    // Higher severity = higher priority
    bool operator<(const Emergency& other) const {
        if (severity != other.severity) {
            return severity < other.severity; // Higher severity first
        }
        return reportTime > other.reportTime; // Earlier report first if same severity
    }
};

class EmergencyDispatch {
private:
    priority_queue<Emergency> emergencyQueue;
    
public:
    void reportEmergency(string type, string location, int severity, string description) {
        emergencyQueue.push(Emergency(type, location, severity, description));
        
        cout << "🚨 Emergency reported: " << type 
             << " at " << location 
             << " (Severity: " << severity << "/10)" << endl;
        cout << "   Description: " << description << endl;
        
        if (severity >= 8) {
            cout << "   🚁 CRITICAL: Dispatching immediate response!" << endl;
        }
    }
    
    void dispatchNextUnit() {
        if (emergencyQueue.empty()) {
            cout << "✅ No pending emergencies!" << endl;
            return;
        }
        
        Emergency next = emergencyQueue.top();
        emergencyQueue.pop();
        
        time_t now = time(0);
        int minutesWaiting = (now - next.reportTime) / 60;
        
        cout << "\n🚑 Dispatching to: " << next.type << endl;
        cout << "   Location: " << next.location << endl;
        cout << "   Severity: " << next.severity << "/10" << endl;
        cout << "   Description: " << next.description << endl;
        cout << "   Response time: " << minutesWaiting << " minutes" << endl;
        
        if (minutesWaiting > 10 && next.severity >= 7) {
            cout << "   ⚠️ WARNING: High-severity emergency delayed!" << endl;
        }
    }
    
    void showEmergencyQueue() {
        if (emergencyQueue.empty()) {
            cout << "\n🚑 No pending emergencies!" << endl;
            return;
        }
        
        cout << "\n🚨 Emergency Queue (by priority):" << endl;
        cout << "=================================" << endl;
        
        priority_queue<Emergency> temp = emergencyQueue;
        int position = 1;
        
        while (!temp.empty()) {
            Emergency emergency = temp.top();
            temp.pop();
            
            time_t now = time(0);
            int minutesWaiting = (now - emergency.reportTime) / 60;
            
            cout << position << ". " << emergency.type 
                 << " (Severity: " << emergency.severity 
                 << ", Waiting: " << minutesWaiting << "m)" << endl;
            position++;
        }
    }
};

int main() {
    EmergencyDispatch dispatch;
    
    cout << "🚑 Emergency Response System" << endl;
    cout << "============================" << endl;
    
    // Various emergencies being reported
    dispatch.reportEmergency("House Fire", "123 Main St", 9, "Multi-story building, residents trapped");
    dispatch.reportEmergency("Car Accident", "Highway 101", 6, "Two-car collision, minor injuries");
    dispatch.reportEmergency("Heart Attack", "456 Oak Ave", 10, "65-year-old male, chest pain");
    dispatch.reportEmergency("Cat in Tree", "789 Pine St", 2, "Cat stuck 20 feet up");
    dispatch.reportEmergency("Gas Leak", "321 Elm St", 8, "Strong gas odor, area evacuated");
    
    // Show current emergency queue
    dispatch.showEmergencyQueue();
    
    // Dispatch units in priority order
    cout << "\n🚑 Dispatching emergency units:" << endl;
    cout << "===============================" << endl;
    
    for (int i = 0; i < 3; i++) {
        dispatch.dispatchNextUnit();
        cout << string(40, '-') << endl;
    }
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🔢 Kth Largest Element

**Story**: You're running a coding competition and need to find the Kth highest score efficiently.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class KthLargestFinder {
public:
    // Using Min-Heap to find Kth largest
    int findKthLargest(vector<int>& nums, int k) {
        // Use min-heap of size k
        priority_queue<int, vector<int>, greater<int>> minHeap;
        
        cout << "🔢 Finding " << k << "th largest element" << endl;
        cout << "Array: ";
        for (int num : nums) cout << num << " ";
        cout << endl;
        
        for (int num : nums) {
            minHeap.push(num);
            cout << "   Added " << num << " to heap" << endl;
            
            // Keep only k largest elements
            if (minHeap.size() > k) {
                int removed = minHeap.top();
                minHeap.pop();
                cout << "   Removed " << removed << " (keeping top " << k << ")" << endl;
            }
        }
        
        int result = minHeap.top();
        cout << "🎯 " << k << "th largest element: " << result << endl;
        return result;
    }
    
    void demonstrateKthLargest() {
        vector<int> scores = {85, 92, 78, 96, 88, 91, 87, 94, 89, 93};
        
        cout << "🏆 Coding Competition Scores" << endl;
        cout << "============================" << endl;
        
        // Find different rankings
        for (int k = 1; k <= 3; k++) {
            cout << "\nFinding " << k << "th place:" << endl;
            findKthLargest(scores, k);
            cout << string(30, '-') << endl;
        }
    }
};

int main() {
    KthLargestFinder finder;
    finder.demonstrateKthLargest();
    
    return 0;
}
```

### Problem 2: 🌊 Merge K Sorted Lists

**Story**: You have multiple sorted score lists from different game levels that need to be merged into one master leaderboard.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    
    ListNode(int x) : val(x), next(nullptr) {}
};

struct Compare {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val; // Min-heap (smallest first)
    }
};

class ListMerger {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, Compare> minHeap;
        
        cout << "🌊 Merging " << lists.size() << " sorted lists" << endl;
        
        // Add first node of each list to heap
        for (int i = 0; i < lists.size(); i++) {
            if (lists[i] != nullptr) {
                minHeap.push(lists[i]);
                cout << "   Added list " << i << " starting with " << lists[i]->val << endl;
            }
        }
        
        ListNode* dummy = new ListNode(0);
        ListNode* current = dummy;
        
        cout << "\n🔄 Merging process:" << endl;
        
        while (!minHeap.empty()) {
            ListNode* smallest = minHeap.top();
            minHeap.pop();
            
            cout << "   Taking " << smallest->val << " from heap" << endl;
            
            current->next = smallest;
            current = current->next;
            
            // Add next node from the same list
            if (smallest->next != nullptr) {
                minHeap.push(smallest->next);
                cout << "   Added " << smallest->next->val << " to heap" << endl;
            }
        }
        
        return dummy->next;
    }
    
    void printList(ListNode* head, string name) {
        cout << name << ": ";
        while (head != nullptr) {
            cout << head->val;
            if (head->next != nullptr) cout << " → ";
            head = head->next;
        }
        cout << endl;
    }
    
    void demonstrateMerging() {
        cout << "🎮 Game Level Score Merging" << endl;
        cout << "===========================" << endl;
        
        // Create sorted lists (level scores)
        ListNode* level1 = new ListNode(100);
        level1->next = new ListNode(400);
        level1->next->next = new ListNode(500);
        
        ListNode* level2 = new ListNode(150);
        level2->next = new ListNode(200);
        level2->next->next = new ListNode(600);
        
        ListNode* level3 = new ListNode(250);
        level3->next = new ListNode(300);
        
        vector<ListNode*> lists = {level1, level2, level3};
        
        cout << "\nOriginal level scores:" << endl;
        printList(level1, "Level 1");
        printList(level2, "Level 2");
        printList(level3, "Level 3");
        
        cout << endl;
        ListNode* merged = mergeKLists(lists);
        
        cout << "\n🏆 Master Leaderboard:" << endl;
        printList(merged, "Merged");
    }
};

int main() {
    ListMerger merger;
    merger.demonstrateMerging();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Heap Fundamentals
1. **Complete Binary Tree**: Efficiently stored in arrays
2. **Heap Property**: Parent-child relationship (max or min)
3. **Priority Access**: Root always contains highest/lowest priority
4. **Efficient Operations**: Insert, extract in O(log n)
5. **Array Indexing**: Parent at (i-1)/2, children at 2i+1 and 2i+2

### Time Complexities
- **Insert**: O(log n) - bubble up operation
- **Extract Max/Min**: O(log n) - bubble down operation
- **Peek**: O(1) - just access root
- **Build Heap**: O(n) - heapify from bottom up
- **Heap Sort**: O(n log n) - extract all elements

### Space Complexity
- **Storage**: O(n) for n elements
- **Operations**: O(1) auxiliary space (in-place)

### Heap Types
1. **Max-Heap**: Parent ≥ children (root = maximum)
2. **Min-Heap**: Parent ≤ children (root = minimum)
3. **Binary Heap**: Each node has at most 2 children
4. **D-ary Heap**: Each node has at most d children

### When to Use Heaps
✅ **Perfect for:**
- Priority queues and task scheduling
- Finding kth largest/smallest elements
- Heap sort algorithm
- Graph algorithms (Dijkstra's, Prim's)
- Event simulation systems
- Top-k problems

❌ **Not suitable for:**
- Searching for arbitrary elements (O(n))
- Accessing elements by index
- When you need sorted order of all elements
- Frequent updates to priorities (without rebuilding)

### Common Applications
1. **🏥 Hospital Emergency Rooms**: Patient priority management
2. **💻 Operating Systems**: Process scheduling
3. **🎮 Game Development**: Event queues, AI decision making
4. **📊 Data Analysis**: Finding top-k elements
5. **🌐 Network Routing**: Shortest path algorithms
6. **📈 Stock Trading**: Order book management

### Heap vs Other Data Structures
| Operation | Heap | BST | Array | Linked List |
|-----------|------|-----|-------|-------------|
| Find Min/Max | O(1) | O(log n) | O(n) | O(n) |
| Insert | O(log n) | O(log n) | O(1) | O(1) |
| Delete Min/Max | O(log n) | O(log n) | O(n) | O(n) |
| Search | O(n) | O(log n) | O(n) | O(n) |
| Space | O(n) | O(n) | O(n) | O(n) |

---

## 🚀 What's Next?

Fantastic! You've completed the Tree Structures section and mastered heaps - understanding how they efficiently manage priorities like hospital emergency rooms. 

You've now learned:
- **Binary Trees**: Hierarchical data organization
- **Binary Search Trees**: Ordered trees for efficient searching  
- **Heaps**: Priority-based trees for efficient min/max operations

Next, let's move to [Advanced Structures](04_Advanced_Structures/11_Hash_Tables.md) starting with Hash Tables - data structures that work like library catalogs for lightning-fast lookups!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Last stone weight, kth largest element in stream
2. **Medium**: Top k frequent elements, merge k sorted lists
3. **Hard**: Sliding window maximum, find median from data stream

### Tips for Success
1. **Understand Heap Property**: Parent-child relationship is key
2. **Master Array Representation**: Know index relationships by heart
3. **Practice Heapify**: Both up and down operations
4. **Think Priority**: When you need min/max efficiently, think heap
5. **Combine with Other Structures**: Heaps work great with hash tables

### Common Patterns
1. **Top-K Problems**: Use heap of size k
2. **Priority Scheduling**: Max-heap for highest priority first
3. **Streaming Data**: Maintain running min/max
4. **Graph Algorithms**: Priority queues for shortest paths
5. **Merge Operations**: Combine multiple sorted sequences

**Remember: Heaps are like hospital emergency rooms - the most critical cases always get treated first, and the system automatically reorganizes when priorities change!** 🏥
