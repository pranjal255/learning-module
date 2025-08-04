# Queues - First In, First Out (Like a Coffee Shop Line)

## 🌟 Real-World Story: The Coffee Shop Line

Picture yourself at a busy coffee shop in the morning! ☕

There's a **line of customers** waiting to order:
- The **first person** who joined the line gets served **first**
- New customers join at the **back** of the line
- You **never** cut in line or serve someone from the middle - that would be unfair!
- The person who has been waiting the **longest** gets their coffee first

```
Front of Line (Served First)    Back of Line (Join Here)
     ↓                               ↓
   [👤] → [👤] → [👤] → [👤] → [👤]
   Alice   Bob   Carol  Diana   Eve
   
   ☕ ← Gets coffee first    Joined line last → 🚶‍♀️
```

This is exactly how a **Queue** works! It follows the **FIFO** principle:
- **F**irst **I**n, **F**irst **O**ut
- Add elements at the **rear/back** (enqueue)
- Remove elements from the **front** (dequeue)
- Just like waiting in line at banks, restaurants, or ticket counters!

## 🎯 What You'll Learn
- Understanding queues through everyday analogies
- Queue operations with visual examples
- Different types of queues
- Implementation using arrays and linked lists
- Real-world applications of queues

---

## 📝 Table of Contents
1. [Why Queues Matter](#why-queues-matter)
2. [Queue Operations - The Coffee Shop Example](#queue-operations---the-coffee-shop-example)
3. [Types of Queues](#types-of-queues)
4. [Implementation Methods](#implementation-methods)
5. [Real-World Applications](#real-world-applications)
6. [Practice Problems](#practice-problems)

---

## Why Queues Matter

### 🏦 The Bank Teller Problem

**Scenario**: You're managing a bank with multiple customers.

**The Fair Way (Queue Behavior)**:
- Customers form a single line
- First customer to arrive gets served first
- New customers join at the back
- No one cuts in line - everyone waits their turn
- This ensures fairness and order!

```
Bank Queue (FIFO):
Teller ← [Customer 1] ← [Customer 2] ← [Customer 3] ← New Customer Joins
         (Served first)                              (Served last)
```

**Why This Matters in Programming**:
- **Task scheduling**: First task submitted gets processed first
- **Print queues**: First document sent to printer gets printed first
- **Network packets**: Data packets are processed in order of arrival
- **Breadth-First Search**: Explore nodes level by level

### 🚗 The Drive-Through Analogy

**At a Drive-Through**:
- Cars line up in order of arrival
- First car in line gets served first
- New cars join at the back
- Cars leave from the front after being served
- No car can "jump" ahead in line

This natural ordering is exactly how computer systems handle many tasks!

---

## Queue Operations - The Coffee Shop Example

Let's implement a queue using our coffee shop analogy:

### ☕ Basic Queue Implementation

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class CoffeeShopQueue {
private:
    vector<string> customers;  // Our queue of customers
    int frontIndex;            // Points to the front customer
    int rearIndex;             // Points to the last customer
    int maxCapacity;           // Maximum customers the shop can handle
    
public:
    CoffeeShopQueue(int capacity = 10) {
        maxCapacity = capacity;
        frontIndex = -1;
        rearIndex = -1;
        cout << "☕ Coffee shop opened with capacity for " << capacity << " customers!" << endl;
    }
    
    // ENQUEUE: Customer joins the line (add to rear)
    void enqueue(string customerName) {
        if (isFull()) {
            cout << "❌ Sorry " << customerName << ", the line is full! Please come back later." << endl;
            return;
        }
        
        customers.push_back(customerName);
        
        if (frontIndex == -1) {
            frontIndex = 0;  // First customer in line
        }
        rearIndex++;
        
        cout << "🚶‍♀️ " << customerName << " joined the line!" << endl;
        cout << "   Position in line: " << (rearIndex - frontIndex + 1) << endl;
        cout << "   Queue size: " << size() << endl;
    }
    
    // DEQUEUE: Serve the front customer (remove from front)
    string dequeue() {
        if (isEmpty()) {
            cout << "❌ No customers to serve - line is empty!" << endl;
            return "";
        }
        
        string servedCustomer = customers[frontIndex];
        frontIndex++;
        
        // Reset queue when empty
        if (frontIndex > rearIndex) {
            frontIndex = -1;
            rearIndex = -1;
            customers.clear();
        }
        
        cout << "☕ Served " << servedCustomer << " their coffee!" << endl;
        cout << "   Queue size: " << size() << endl;
        
        return servedCustomer;
    }
    
    // FRONT: Look at the next customer to be served
    string front() {
        if (isEmpty()) {
            cout << "👀 No customers in line!" << endl;
            return "";
        }
        
        string nextCustomer = customers[frontIndex];
        cout << "👀 Next customer to be served: " << nextCustomer << endl;
        return nextCustomer;
    }
    
    // Check if queue is empty
    bool isEmpty() {
        return frontIndex == -1;
    }
    
    // Check if queue is full
    bool isFull() {
        return size() >= maxCapacity;
    }
    
    // Get current size
    int size() {
        if (isEmpty()) return 0;
        return rearIndex - frontIndex + 1;
    }
    
    // Display the entire queue
    void displayQueue() {
        if (isEmpty()) {
            cout << "☕ Coffee shop line is empty!" << endl;
            return;
        }
        
        cout << "\n☕ Current Coffee Shop Line:" << endl;
        cout << "============================" << endl;
        cout << "Front (Next to be served) → ";
        
        for (int i = frontIndex; i <= rearIndex; i++) {
            cout << customers[i];
            if (i < rearIndex) {
                cout << " → ";
            }
        }
        
        cout << " ← Rear (Last to join)" << endl;
        cout << "Queue size: " << size() << "/" << maxCapacity << endl;
    }
};

int main() {
    CoffeeShopQueue coffeeShop(5);
    
    cout << "\n☕ Coffee Shop Queue Simulation" << endl;
    cout << "===============================" << endl;
    
    // Customers joining the line (ENQUEUE operations)
    cout << "\n🚶‍♀️ Customers joining the line:" << endl;
    coffeeShop.enqueue("Alice");
    coffeeShop.enqueue("Bob");
    coffeeShop.enqueue("Carol");
    coffeeShop.enqueue("Diana");
    
    coffeeShop.displayQueue();
    
    // Check who's next (FRONT operation)
    cout << "\n👀 Barista checking next customer:" << endl;
    coffeeShop.front();
    
    // Serving customers (DEQUEUE operations)
    cout << "\n☕ Barista serving customers:" << endl;
    coffeeShop.dequeue();  // Serve Alice
    coffeeShop.dequeue();  // Serve Bob
    
    coffeeShop.displayQueue();
    
    // More customers join
    cout << "\n🚶‍♀️ More customers arriving:" << endl;
    coffeeShop.enqueue("Eve");
    coffeeShop.enqueue("Frank");
    
    coffeeShop.displayQueue();
    
    return 0;
}
```

**Output:**
```
☕ Coffee shop opened with capacity for 5 customers!

☕ Coffee Shop Queue Simulation
===============================

🚶‍♀️ Customers joining the line:
🚶‍♀️ Alice joined the line!
   Position in line: 1
   Queue size: 1
🚶‍♀️ Bob joined the line!
   Position in line: 2
   Queue size: 2

☕ Current Coffee Shop Line:
============================
Front (Next to be served) → Alice → Bob → Carol → Diana ← Rear (Last to join)
Queue size: 4/5

👀 Barista checking next customer:
👀 Next customer to be served: Alice

☕ Barista serving customers:
☕ Served Alice their coffee!
   Queue size: 3
☕ Served Bob their coffee!
   Queue size: 2
```

### 🔍 Understanding Queue Memory Layout

```
Queue Growth (ENQUEUE operations):

Step 1: enqueue("A")    Step 2: enqueue("B")    Step 3: enqueue("C")
Front → [A] ← Rear      Front → [A][B] ← Rear   Front → [A][B][C] ← Rear

Queue Shrinking (DEQUEUE operations):

Step 4: dequeue() → "A"    Step 5: dequeue() → "B"    Step 6: dequeue() → "C"
Front → [B][C] ← Rear      Front → [C] ← Rear         (empty queue)
```

---

## Types of Queues

### 1. 🎯 Simple Queue (Linear Queue)

Like our coffee shop line - basic FIFO behavior:

```cpp
// Front → [A][B][C][D] ← Rear
// Enqueue at rear, dequeue from front
```

### 2. 🔄 Circular Queue (Ring Buffer)

Like a circular dining table where you can keep going around:

```cpp
#include <iostream>
using namespace std;

class CircularQueue {
private:
    int* queue;
    int front, rear, maxSize, currentSize;
    
public:
    CircularQueue(int size) {
        maxSize = size;
        queue = new int[maxSize];
        front = -1;
        rear = -1;
        currentSize = 0;
        cout << "🔄 Created circular queue with size: " << size << endl;
    }
    
    ~CircularQueue() {
        delete[] queue;
    }
    
    void enqueue(int value) {
        if (isFull()) {
            cout << "❌ Queue is full! Cannot add " << value << endl;
            return;
        }
        
        if (isEmpty()) {
            front = rear = 0;
        } else {
            rear = (rear + 1) % maxSize;  // Circular increment
        }
        
        queue[rear] = value;
        currentSize++;
        cout << "📥 Added " << value << " at position " << rear << endl;
    }
    
    int dequeue() {
        if (isEmpty()) {
            cout << "❌ Queue is empty! Cannot remove" << endl;
            return -1;
        }
        
        int value = queue[front];
        
        if (currentSize == 1) {
            front = rear = -1;  // Queue becomes empty
        } else {
            front = (front + 1) % maxSize;  // Circular increment
        }
        
        currentSize--;
        cout << "📤 Removed " << value << endl;
        return value;
    }
    
    bool isEmpty() {
        return currentSize == 0;
    }
    
    bool isFull() {
        return currentSize == maxSize;
    }
    
    void display() {
        if (isEmpty()) {
            cout << "🔄 Circular queue is empty!" << endl;
            return;
        }
        
        cout << "\n🔄 Circular Queue Contents:" << endl;
        cout << "Front: " << front << ", Rear: " << rear << endl;
        
        int i = front;
        for (int count = 0; count < currentSize; count++) {
            cout << "Position " << i << ": " << queue[i];
            if (i == front) cout << " ← FRONT";
            if (i == rear) cout << " ← REAR";
            cout << endl;
            i = (i + 1) % maxSize;
        }
        cout << "Size: " << currentSize << "/" << maxSize << endl;
    }
};

int main() {
    CircularQueue cq(5);
    
    // Fill the queue
    cq.enqueue(10);
    cq.enqueue(20);
    cq.enqueue(30);
    cq.enqueue(40);
    cq.enqueue(50);
    cq.display();
    
    // Remove some elements
    cq.dequeue();
    cq.dequeue();
    cq.display();
    
    // Add more (demonstrating circular nature)
    cq.enqueue(60);
    cq.enqueue(70);
    cq.display();
    
    return 0;
}
```

### 3. ⭐ Priority Queue (VIP Line)

Like a hospital emergency room where more urgent patients get treated first:

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;

struct Patient {
    string name;
    int priority;  // 1 = Critical, 2 = Urgent, 3 = Normal
    
    Patient(string n, int p) : name(n), priority(p) {}
    
    // For priority queue (higher priority = lower number)
    bool operator<(const Patient& other) const {
        return priority > other.priority;
    }
};

class EmergencyRoom {
private:
    priority_queue<Patient> waitingRoom;
    
public:
    void admitPatient(string name, int priority) {
        waitingRoom.push(Patient(name, priority));
        
        string priorityLevel;
        switch(priority) {
            case 1: priorityLevel = "CRITICAL 🚨"; break;
            case 2: priorityLevel = "URGENT ⚠️"; break;
            case 3: priorityLevel = "NORMAL 📋"; break;
            default: priorityLevel = "UNKNOWN"; break;
        }
        
        cout << "🏥 " << name << " admitted with " << priorityLevel << " priority" << endl;
        cout << "   Patients waiting: " << waitingRoom.size() << endl;
    }
    
    void treatNextPatient() {
        if (waitingRoom.empty()) {
            cout << "🏥 No patients waiting!" << endl;
            return;
        }
        
        Patient nextPatient = waitingRoom.top();
        waitingRoom.pop();
        
        string priorityLevel;
        switch(nextPatient.priority) {
            case 1: priorityLevel = "CRITICAL 🚨"; break;
            case 2: priorityLevel = "URGENT ⚠️"; break;
            case 3: priorityLevel = "NORMAL 📋"; break;
        }
        
        cout << "👩‍⚕️ Treating " << nextPatient.name 
             << " (" << priorityLevel << ")" << endl;
        cout << "   Patients remaining: " << waitingRoom.size() << endl;
    }
    
    void showWaitingRoom() {
        if (waitingRoom.empty()) {
            cout << "🏥 Emergency room is empty!" << endl;
            return;
        }
        
        cout << "\n🏥 Emergency Room Status:" << endl;
        cout << "=========================" << endl;
        cout << "Patients waiting: " << waitingRoom.size() << endl;
        cout << "Next patient: " << waitingRoom.top().name << endl;
    }
};

int main() {
    EmergencyRoom hospital;
    
    cout << "🏥 Emergency Room Priority Queue" << endl;
    cout << "================================" << endl;
    
    // Patients arriving in different order
    hospital.admitPatient("John", 3);      // Normal
    hospital.admitPatient("Alice", 1);     // Critical
    hospital.admitPatient("Bob", 2);       // Urgent
    hospital.admitPatient("Carol", 3);     // Normal
    hospital.admitPatient("Diana", 1);     // Critical
    
    hospital.showWaitingRoom();
    
    // Treating patients (critical patients first!)
    cout << "\n👩‍⚕️ Treating patients by priority:" << endl;
    hospital.treatNextPatient();  // Alice (Critical)
    hospital.treatNextPatient();  // Diana (Critical)
    hospital.treatNextPatient();  // Bob (Urgent)
    hospital.treatNextPatient();  // John (Normal)
    hospital.treatNextPatient();  // Carol (Normal)
    
    return 0;
}
```

### 4. 🔚 Deque (Double-Ended Queue)

Like a line where you can join or leave from both ends:

```cpp
#include <iostream>
#include <deque>
#include <string>
using namespace std;

class RestaurantLine {
private:
    deque<string> line;
    
public:
    // Add customer to front (VIP entry)
    void addVIP(string name) {
        line.push_front(name);
        cout << "⭐ VIP " << name << " added to front of line!" << endl;
        showLine();
    }
    
    // Add customer to back (normal entry)
    void addCustomer(string name) {
        line.push_back(name);
        cout << "🚶‍♀️ " << name << " joined the back of line!" << endl;
        showLine();
    }
    
    // Serve from front
    void serveFromFront() {
        if (line.empty()) {
            cout << "❌ No customers to serve!" << endl;
            return;
        }
        
        string customer = line.front();
        line.pop_front();
        cout << "🍽️ Served " << customer << " from front!" << endl;
        showLine();
    }
    
    // Handle emergency exit from back
    void emergencyExit() {
        if (line.empty()) {
            cout << "❌ No customers in line!" << endl;
            return;
        }
        
        string customer = line.back();
        line.pop_back();
        cout << "🚪 " << customer << " left through emergency exit!" << endl;
        showLine();
    }
    
    void showLine() {
        if (line.empty()) {
            cout << "🍽️ Restaurant line is empty!" << endl;
            return;
        }
        
        cout << "Line: Front → ";
        for (const string& customer : line) {
            cout << customer << " → ";
        }
        cout << "Back (Size: " << line.size() << ")" << endl;
    }
};

int main() {
    RestaurantLine restaurant;
    
    cout << "🍽️ Restaurant Deque (Double-Ended Queue)" << endl;
    cout << "=========================================" << endl;
    
    // Normal customers joining
    restaurant.addCustomer("Alice");
    restaurant.addCustomer("Bob");
    restaurant.addCustomer("Carol");
    
    // VIP customer arrives
    restaurant.addVIP("VIP Diana");
    
    // Serve customers
    restaurant.serveFromFront();
    restaurant.serveFromFront();
    
    // Emergency situation
    restaurant.emergencyExit();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🖨️ Print Queue Manager

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;

struct PrintJob {
    string document;
    string user;
    int pages;
    
    PrintJob(string doc, string u, int p) : document(doc), user(u), pages(p) {}
};

class PrintQueue {
private:
    queue<PrintJob> printJobs;
    bool printerBusy;
    
public:
    PrintQueue() {
        printerBusy = false;
        cout << "🖨️ Print queue initialized!" << endl;
    }
    
    void submitJob(string document, string user, int pages) {
        printJobs.push(PrintJob(document, user, pages));
        cout << "📄 " << user << " submitted '" << document 
             << "' (" << pages << " pages)" << endl;
        cout << "   Jobs in queue: " << printJobs.size() << endl;
        
        if (!printerBusy) {
            processNextJob();
        }
    }
    
    void processNextJob() {
        if (printJobs.empty()) {
            printerBusy = false;
            cout << "🖨️ Printer is idle - no jobs in queue" << endl;
            return;
        }
        
        printerBusy = true;
        PrintJob currentJob = printJobs.front();
        printJobs.pop();
        
        cout << "🖨️ Printing '" << currentJob.document 
             << "' for " << currentJob.user 
             << " (" << currentJob.pages << " pages)" << endl;
        cout << "   Jobs remaining: " << printJobs.size() << endl;
        
        // Simulate printing time
        cout << "   Estimated time: " << currentJob.pages * 2 << " seconds" << endl;
    }
    
    void finishCurrentJob() {
        if (printerBusy) {
            cout << "✅ Print job completed!" << endl;
            processNextJob();  // Start next job
        }
    }
    
    void showQueue() {
        if (printJobs.empty()) {
            cout << "📄 Print queue is empty!" << endl;
            return;
        }
        
        cout << "\n📄 Print Queue Status:" << endl;
        cout << "=====================" << endl;
        cout << "Jobs waiting: " << printJobs.size() << endl;
        cout << "Printer status: " << (printerBusy ? "BUSY 🔴" : "IDLE 🟢") << endl;
    }
};

int main() {
    PrintQueue office;
    
    cout << "\n🖨️ Office Print Queue Simulation" << endl;
    cout << "=================================" << endl;
    
    // Employees submitting print jobs
    office.submitJob("Report.pdf", "Alice", 10);
    office.submitJob("Presentation.pptx", "Bob", 25);
    office.submitJob("Invoice.docx", "Carol", 3);
    
    office.showQueue();
    
    // Simulate job completion
    cout << "\n⏰ After some time..." << endl;
    office.finishCurrentJob();  // Alice's job done
    office.finishCurrentJob();  // Bob's job done
    office.finishCurrentJob();  // Carol's job done
    
    office.showQueue();
    
    return 0;
}
```

### 2. 🌐 Web Server Request Queue

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <chrono>
using namespace std;

struct WebRequest {
    string clientIP;
    string requestType;
    string url;
    int timestamp;
    
    WebRequest(string ip, string type, string u) 
        : clientIP(ip), requestType(type), url(u) {
        timestamp = chrono::duration_cast<chrono::seconds>(
            chrono::system_clock::now().time_since_epoch()).count();
    }
};

class WebServer {
private:
    queue<WebRequest> requestQueue;
    int maxQueueSize;
    int processedRequests;
    
public:
    WebServer(int maxSize = 100) {
        maxQueueSize = maxSize;
        processedRequests = 0;
        cout << "🌐 Web server started (max queue size: " << maxSize << ")" << endl;
    }
    
    void receiveRequest(string clientIP, string requestType, string url) {
        if (requestQueue.size() >= maxQueueSize) {
            cout << "❌ Server overloaded! Request from " << clientIP << " rejected" << endl;
            return;
        }
        
        requestQueue.push(WebRequest(clientIP, requestType, url));
        cout << "📨 Received " << requestType << " request from " << clientIP 
             << " for " << url << endl;
        cout << "   Queue size: " << requestQueue.size() << endl;
    }
    
    void processRequests(int count = 1) {
        for (int i = 0; i < count && !requestQueue.empty(); i++) {
            WebRequest request = requestQueue.front();
            requestQueue.pop();
            
            cout << "⚙️ Processing " << request.requestType 
                 << " request from " << request.clientIP 
                 << " for " << request.url << endl;
            
            processedRequests++;
            
            // Simulate processing time
            cout << "   Response: 200 OK" << endl;
            cout << "   Queue size: " << requestQueue.size() << endl;
        }
    }
    
    void showServerStatus() {
        cout << "\n🌐 Web Server Status:" << endl;
        cout << "====================" << endl;
        cout << "Requests in queue: " << requestQueue.size() << endl;
        cout << "Total processed: " << processedRequests << endl;
        cout << "Server load: " << (requestQueue.size() * 100 / maxQueueSize) << "%" << endl;
    }
};

int main() {
    WebServer server(10);
    
    cout << "\n🌐 Web Server Request Queue Simulation" << endl;
    cout << "=======================================" << endl;
    
    // Simulate incoming requests
    server.receiveRequest("192.168.1.100", "GET", "/index.html");
    server.receiveRequest("192.168.1.101", "POST", "/api/login");
    server.receiveRequest("192.168.1.102", "GET", "/products");
    server.receiveRequest("192.168.1.103", "PUT", "/api/update");
    server.receiveRequest("192.168.1.104", "GET", "/about");
    
    server.showServerStatus();
    
    // Process some requests
    cout << "\n⚙️ Processing requests..." << endl;
    server.processRequests(3);
    
    server.showServerStatus();
    
    // More requests arrive
    cout << "\n📨 More requests arriving..." << endl;
    server.receiveRequest("192.168.1.105", "DELETE", "/api/delete");
    server.receiveRequest("192.168.1.106", "GET", "/contact");
    
    server.showServerStatus();
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🎢 Theme Park Ride Queue

**Story**: You're managing a popular theme park ride with a queue system.

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;

struct Visitor {
    string name;
    int groupSize;
    bool fastPass;
    
    Visitor(string n, int size, bool fp = false) 
        : name(n), groupSize(size), fastPass(fp) {}
};

class ThemeParkRide {
private:
    queue<Visitor> regularQueue;
    queue<Visitor> fastPassQueue;
    int rideCapacity;
    int currentRiders;
    
public:
    ThemeParkRide(int capacity) {
        rideCapacity = capacity;
        currentRiders = 0;
        cout << "🎢 Theme park ride opened! Capacity: " << capacity << " riders" << endl;
    }
    
    void joinQueue(string name, int groupSize, bool fastPass = false) {
        Visitor visitor(name, groupSize, fastPass);
        
        if (fastPass) {
            fastPassQueue.push(visitor);
            cout << "⚡ " << name << " (group of " << groupSize 
                 << ") joined FastPass queue!" << endl;
        } else {
            regularQueue.push(visitor);
            cout << "🚶‍♀️ " << name << " (group of " << groupSize 
                 << ") joined regular queue!" << endl;
        }
        
        showQueueStatus();
    }
    
    void loadRide() {
        if (currentRiders > 0) {
            cout << "🎢 Ride is currently running! Please wait..." << endl;
            return;
        }
        
        cout << "\n🎢 Loading the ride..." << endl;
        currentRiders = 0;
        
        // FastPass gets priority
        while (!fastPassQueue.empty() && currentRiders < rideCapacity) {
            Visitor visitor = fastPassQueue.front();
            if (currentRiders + visitor.groupSize <= rideCapacity) {
                fastPassQueue.pop();
                currentRiders += visitor.groupSize;
                cout << "⚡ Loaded " << visitor.name << " (FastPass group of " 
                     << visitor.groupSize << ")" << endl;
            } else {
                break;  // Group too large for remaining capacity
            }
        }
        
        // Fill remaining spots with regular queue
        while (!regularQueue.empty() && currentRiders < rideCapacity) {
            Visitor visitor = regularQueue.front();
            if (currentRiders + visitor.groupSize <= rideCapacity) {
                regularQueue.pop();
                currentRiders += visitor.groupSize;
                cout << "🚶‍♀️ Loaded " << visitor.name << " (regular group of " 
                     << visitor.groupSize << ")" << endl;
            } else {
                break;  // Group too large for remaining capacity
            }
        }
        
        cout << "🎢 Ride loaded with " << currentRiders << "/" << rideCapacity 
             << " riders!" << endl;
    }
    
    void startRide() {
        if (currentRiders == 0) {
            cout << "❌ No riders on the ride!" << endl;
            return;
        }
        
        cout << "🎢 Ride starting... Enjoy the thrill! 🎉" << endl;
        cout << "⏰ Ride duration: 3 minutes" << endl;
    }
    
    void finishRide() {
        if (currentRiders == 0) {
            cout << "❌ No ride to finish!" << endl;
            return;
        }
        
        cout << "🎢 Ride finished! " << currentRiders << " riders getting off." << endl;
        currentRiders = 0;
        
        if (!fastPassQueue.empty() || !regularQueue.empty()) {
            cout << "🔄 Ready to load next group!" << endl;
        }
    }
    
    void showQueueStatus() {
        cout << "\n🎢 Queue Status:" << endl;
        cout << "===============" << endl;
        cout << "FastPass queue: " << fastPassQueue.size() << " groups" << endl;
        cout << "Regular queue: " << regularQueue.size() << " groups" << endl;
        cout << "Current riders: " << currentRiders << "/" << rideCapacity << endl;
    }
};

int main() {
    ThemeParkRide rollerCoaster(8);
    
    cout << "\n🎢 Theme Park Ride Queue Simulation" << endl;
    cout << "===================================" << endl;
    
    // Visitors joining queues
    rollerCoaster.joinQueue("Smith Family", 4, false);
    rollerCoaster.joinQueue("VIP Johnson", 2, true);
    rollerCoaster.joinQueue("Brown Group", 3, false);
    rollerCoaster.joinQueue("VIP Wilson", 1, true);
    rollerCoaster.joinQueue("Davis Party", 5, false);
    
    // Load and run the ride
    rollerCoaster.loadRide();
    rollerCoaster.startRide();
    
    cout << "\n⏰ After 3 minutes..." << endl;
    rollerCoaster.finishRide();
    
    // Load next group
    rollerCoaster.loadRide();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Queue Fundamentals
1. **FIFO Principle**: First In, First Out - like a coffee shop line
2. **Two-End Access**: Add at rear (enqueue), remove from front (dequeue)
3. **Enqueue Operation**: Add element to rear - O(1)
4. **Dequeue Operation**: Remove element from front - O(1)
5. **Front/Peek**: Look at front element without removing - O(1)

### Time Complexities
- **Enqueue**: O(1) - constant time
- **Dequeue**: O(1) - constant time
- **Front/Peek**: O(1) - constant time
- **Search**: O(n) - must dequeue elements to search
- **Size**: O(1) - if we maintain a counter

### Space Complexity
- **O(n)** where n is the number of elements
- **Array implementation**: May waste space due to shifting
- **Linked list implementation**: Dynamic space, extra pointer overhead
- **Circular queue**: Efficient space utilization

### Types of Queues
1. **Simple Queue**: Basic FIFO behavior
2. **Circular Queue**: Efficient space utilization, wraps around
3. **Priority Queue**: Elements served based on priority, not arrival time
4. **Deque**: Can add/remove from both ends

### When to Use Queues
✅ **Perfect for:**
- Task scheduling (first come, first served)
- Print job management
- Web server request handling
- Breadth-First Search (BFS)
- Buffer for data streams
- Process scheduling in operating systems

❌ **Not suitable for:**
- Random access to elements
- When you need LIFO behavior (use stack instead)
- Priority-based processing (unless using priority queue)

### Real-World Applications
1. **🖨️ Print Queues**: Documents printed in order of submission
2. **🌐 Web Servers**: HTTP requests processed in order
3. **🏥 Hospital Systems**: Patient queues with priority handling
4. **🎮 Game Development**: Event queues, animation queues
5. **📱 Mobile Apps**: Message queues, notification systems
6. **🚗 Traffic Systems**: Traffic light management, toll booth queues

---

## 🚀 What's Next?

Fantastic! You've completed all the linear data structures! You now understand:
- **Arrays**: Direct access collections
- **Strings**: Text processing sequences  
- **Linked Lists**: Dynamic pointer-based structures
- **Stacks**: LIFO (Last In, First Out) structures
- **Queues**: FIFO (First In, First Out) structures

Next, let's explore hierarchical data structures starting with [Binary Trees](03_Tree_Structures/08_Binary_Trees.md) - structures that organize data like family trees!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Implement queue using stacks, first unique character in stream
2. **Medium**: Sliding window maximum, design circular queue
3. **Hard**: Shortest path in binary matrix (BFS), design phone directory

### Tips for Success
1. **Think FIFO** - Always remember First In, First Out
2. **Visualize with real lines** - Use coffee shops, banks, or drive-throughs as mental models
3. **Practice with BFS** - Queues are essential for breadth-first search
4. **Master circular queues** - Important for efficient memory usage
5. **Understand priority queues** - Different from regular queues but very useful

### Common Mistakes to Avoid
1. **Forgetting to check empty queue** before dequeuing
2. **Confusing queue with stack** behavior (FIFO vs LIFO)
3. **Not handling queue overflow** in fixed-size implementations
4. **Mixing up front and rear** pointers

### Queue vs Stack Quick Reference
| Operation | Stack | Queue |
|-----------|-------|-------|
| Add | Push (top) | Enqueue (rear) |
| Remove | Pop (top) | Dequeue (front) |
| Look | Peek/Top | Front |
| Principle | LIFO | FIFO |
| Real-world | Plates, Books | Coffee line, Bank |

**Remember: Queues are like waiting in line - fair, orderly, and first-come-first-served! Master this concept and you'll handle many real-world programming scenarios!** ☕
