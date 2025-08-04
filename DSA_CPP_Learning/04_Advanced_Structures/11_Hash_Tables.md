# Hash Tables - Lightning-Fast Lookups (Like Library Catalogs)

## 🌟 Real-World Story: The Library Catalog System

Imagine you're working at a massive library with millions of books! 📚

**The Old Way (Linear Search)**:
- Student asks: "Do you have 'Harry Potter and the Sorcerer's Stone'?"
- You start from the first shelf and check every single book
- After 3 hours: "Sorry, we don't have it" or "Found it on shelf 50,000!"
- **Extremely slow** for large libraries!

**The Modern Way (Library Catalog System)**:
```
Book Title → Catalog Number → Shelf Location
"Harry Potter" → Hash(title) → Shelf 247
"Lord of the Rings" → Hash(title) → Shelf 891
"1984" → Hash(title) → Shelf 156

Student: "Do you have Harry Potter?"
Librarian: *checks catalog* "Yes! Shelf 247, Section B"
Time taken: 30 seconds!
```

**The Magic Behind It**:
- Each book title goes through a **hash function** (like a special calculator)
- The hash function converts the title into a **shelf number**
- **Direct access** to the exact location - no searching needed!
- **Constant time** lookup: O(1) - same speed whether you have 100 or 1 million books!

This is exactly how a **Hash Table** works! It's a data structure that:
- Uses a **hash function** to convert keys into array indices
- Provides **instant access** to values using their keys
- Achieves **O(1) average time** for search, insert, and delete operations
- Works like a **super-efficient filing system**!

## 🎯 What You'll Learn
- Understanding hash tables through library and dictionary analogies
- Hash functions and collision resolution techniques
- Implementation strategies and performance optimization
- Real-world applications in databases, caches, and more

---

## 📝 Table of Contents
1. [Why Hash Tables Matter](#why-hash-tables-matter)
2. [Hash Functions](#hash-functions)
3. [Collision Resolution](#collision-resolution)
4. [Implementation Strategies](#implementation-strategies)
5. [Performance Analysis](#performance-analysis)
6. [Real-World Applications](#real-world-applications)
7. [Practice Problems](#practice-problems)

---

## Why Hash Tables Matter

### 🏪 The Store Inventory Problem

**Scenario**: You're managing a store with thousands of products.

**Array/List Approach**:
```cpp
// Finding product by ID
for (int i = 0; i < products.size(); i++) {
    if (products[i].id == targetId) {
        return products[i]; // Found after checking i items
    }
}
// Time: O(n) - could check every item!
```

**Hash Table Approach**:
```cpp
// Direct access by product ID
Product product = inventory[hash(productId)];
// Time: O(1) - instant access!
```

### 📞 The Phone Book Analogy

**Traditional Phone Book**:
- Names sorted alphabetically
- To find "Smith, John": Flip through pages, use binary search
- Time: O(log n) - pretty good, but not instant

**Hash Table Phone Book**:
```
Name → Hash Function → Index → Phone Number
"Smith, John" → hash("Smith, John") → 1247 → "555-0123"
"Johnson, Mary" → hash("Johnson, Mary") → 3891 → "555-0456"

Lookup time: O(1) - instant!
```

### 🎮 The Game Leaderboard Problem

**Scenario**: Track player scores in real-time during a massive online game.

```cpp
// Without Hash Table - Linear search
Player findPlayer(string username) {
    for (Player p : players) {
        if (p.username == username) return p; // O(n) time
    }
}

// With Hash Table - Direct access
Player findPlayer(string username) {
    return playerTable[username]; // O(1) time
}
```

**Why This Matters**:
- **Gaming**: Instant player lookups during matches
- **Databases**: Fast record retrieval
- **Web browsers**: Quick cache lookups
- **Compilers**: Symbol table management

---

## Hash Functions

### 🧮 The Magic Calculator

A hash function is like a special calculator that converts any input into a number:

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class HashFunctionDemo {
public:
    // Simple hash function for strings
    int simpleStringHash(string key, int tableSize) {
        int hash = 0;
        for (char c : key) {
            hash += c; // Add ASCII values
        }
        return hash % tableSize;
    }
    
    // Better hash function (djb2 algorithm)
    int djb2Hash(string key, int tableSize) {
        unsigned long hash = 5381;
        for (char c : key) {
            hash = ((hash << 5) + hash) + c; // hash * 33 + c
        }
        return hash % tableSize;
    }
    
    // Hash function for integers
    int integerHash(int key, int tableSize) {
        return key % tableSize;
    }
    
    void demonstrateHashFunctions() {
        cout << "🧮 Hash Function Demonstration" << endl;
        cout << "==============================" << endl;
        
        vector<string> names = {"Alice", "Bob", "Charlie", "Diana", "Eve"};
        int tableSize = 10;
        
        cout << "\n📊 Simple String Hash (sum of ASCII values):" << endl;
        for (string name : names) {
            int hash = simpleStringHash(name, tableSize);
            cout << "hash(\"" << name << "\") = " << hash << endl;
        }
        
        cout << "\n📊 DJB2 Hash (better distribution):" << endl;
        for (string name : names) {
            int hash = djb2Hash(name, tableSize);
            cout << "hash(\"" << name << "\") = " << hash << endl;
        }
        
        cout << "\n📊 Integer Hash:" << endl;
        vector<int> numbers = {123, 456, 789, 1011, 1213};
        for (int num : numbers) {
            int hash = integerHash(num, tableSize);
            cout << "hash(" << num << ") = " << hash << endl;
        }
    }
    
    void explainHashProperties() {
        cout << "\n🔍 Good Hash Function Properties:" << endl;
        cout << "=================================" << endl;
        cout << "1. 🎯 DETERMINISTIC: Same input always gives same output" << endl;
        cout << "2. ⚡ FAST: Quick to compute" << endl;
        cout << "3. 📊 UNIFORM: Distributes keys evenly across table" << endl;
        cout << "4. 🔀 AVALANCHE: Small input change → big output change" << endl;
        cout << endl;
        
        cout << "❌ Bad Hash Function Example:" << endl;
        cout << "   hash(key) = 0  // Always returns 0!" << endl;
        cout << "   Problem: All keys map to same index (clustering)" << endl;
        cout << endl;
        
        cout << "✅ Good Hash Function Example:" << endl;
        cout << "   hash(key) = (key * 31 + 17) % table_size" << endl;
        cout << "   Benefits: Even distribution, fast computation" << endl;
    }
};

int main() {
    HashFunctionDemo demo;
    demo.demonstrateHashFunctions();
    demo.explainHashProperties();
    
    return 0;
}
```

### 🎲 Hash Function Visualization

```
Input → Hash Function → Index
"Apple"  → hash("Apple")  → 3
"Banana" → hash("Banana") → 7
"Cherry" → hash("Cherry") → 1
"Date"   → hash("Date")   → 9

Hash Table Array:
[0] → empty
[1] → "Cherry"
[2] → empty  
[3] → "Apple"
[4] → empty
[5] → empty
[6] → empty
[7] → "Banana"
[8] → empty
[9] → "Date"
```

---

## Collision Resolution

### 💥 When Hash Functions Collide

Sometimes different keys produce the same hash value - this is called a **collision**:

```
hash("John") = 5
hash("Jane") = 5  ← Collision! Both want index 5
```

### 🔗 Method 1: Chaining (Separate Chaining)

Like having multiple books on the same shelf:

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <string>
using namespace std;

class HashTableChaining {
private:
    vector<list<pair<string, int>>> table;
    int tableSize;
    
    int hash(string key) {
        int hashValue = 0;
        for (char c : key) {
            hashValue = (hashValue * 31 + c) % tableSize;
        }
        return hashValue;
    }
    
public:
    HashTableChaining(int size) {
        tableSize = size;
        table.resize(tableSize);
        cout << "🔗 Created hash table with chaining (size: " << size << ")" << endl;
    }
    
    void insert(string key, int value) {
        int index = hash(key);
        
        // Check if key already exists
        for (auto& pair : table[index]) {
            if (pair.first == key) {
                pair.second = value; // Update existing
                cout << "📝 Updated " << key << " = " << value << " at index " << index << endl;
                return;
            }
        }
        
        // Add new key-value pair
        table[index].push_back({key, value});
        cout << "➕ Inserted " << key << " = " << value << " at index " << index;
        if (table[index].size() > 1) {
            cout << " (collision resolved by chaining)";
        }
        cout << endl;
    }
    
    bool search(string key, int& value) {
        int index = hash(key);
        cout << "🔍 Searching for " << key << " at index " << index << endl;
        
        for (auto& pair : table[index]) {
            if (pair.first == key) {
                value = pair.second;
                cout << "✅ Found " << key << " = " << value << endl;
                return true;
            }
        }
        
        cout << "❌ " << key << " not found" << endl;
        return false;
    }
    
    void remove(string key) {
        int index = hash(key);
        
        auto& chain = table[index];
        for (auto it = chain.begin(); it != chain.end(); ++it) {
            if (it->first == key) {
                cout << "🗑️ Removed " << key << " from index " << index << endl;
                chain.erase(it);
                return;
            }
        }
        
        cout << "❌ Cannot remove " << key << " - not found" << endl;
    }
    
    void display() {
        cout << "\n📊 Hash Table Contents:" << endl;
        cout << "======================" << endl;
        
        for (int i = 0; i < tableSize; i++) {
            cout << "[" << i << "] → ";
            if (table[i].empty()) {
                cout << "empty";
            } else {
                bool first = true;
                for (auto& pair : table[i]) {
                    if (!first) cout << " → ";
                    cout << "{" << pair.first << ":" << pair.second << "}";
                    first = false;
                }
            }
            cout << endl;
        }
    }
};

int main() {
    HashTableChaining phoneBook(7);
    
    cout << "\n📞 Building Phone Directory" << endl;
    cout << "===========================" << endl;
    
    // Insert contacts
    phoneBook.insert("Alice", 1234);
    phoneBook.insert("Bob", 5678);
    phoneBook.insert("Charlie", 9012);
    phoneBook.insert("Diana", 3456);
    phoneBook.insert("Eve", 7890);
    
    // Display table
    phoneBook.display();
    
    // Search for contacts
    cout << "\n🔍 Looking up contacts:" << endl;
    int number;
    phoneBook.search("Alice", number);
    phoneBook.search("Frank", number);
    
    // Remove a contact
    cout << "\n🗑️ Removing contact:" << endl;
    phoneBook.remove("Bob");
    phoneBook.display();
    
    return 0;
}
```

### 🏃‍♂️ Method 2: Open Addressing (Linear Probing)

Like finding the next available parking spot:

```cpp
class HashTableLinearProbing {
private:
    vector<pair<string, int>> table;
    vector<bool> occupied;
    int tableSize;
    int numElements;
    
    int hash(string key) {
        int hashValue = 0;
        for (char c : key) {
            hashValue = (hashValue * 31 + c) % tableSize;
        }
        return hashValue;
    }
    
public:
    HashTableLinearProbing(int size) {
        tableSize = size;
        numElements = 0;
        table.resize(tableSize);
        occupied.resize(tableSize, false);
        cout << "🏃‍♂️ Created hash table with linear probing (size: " << size << ")" << endl;
    }
    
    void insert(string key, int value) {
        if (numElements >= tableSize * 0.7) { // Load factor check
            cout << "⚠️ Table is getting full (load factor > 0.7)" << endl;
        }
        
        int index = hash(key);
        int originalIndex = index;
        int probes = 0;
        
        cout << "➕ Inserting " << key << " = " << value << endl;
        cout << "   Initial hash: " << index << endl;
        
        while (occupied[index]) {
            if (table[index].first == key) {
                table[index].second = value; // Update existing
                cout << "   📝 Updated existing key at index " << index << endl;
                return;
            }
            
            index = (index + 1) % tableSize; // Linear probing
            probes++;
            cout << "   🔍 Collision! Probing index " << index << " (probe #" << probes << ")" << endl;
            
            if (index == originalIndex) {
                cout << "   ❌ Table is full!" << endl;
                return;
            }
        }
        
        table[index] = {key, value};
        occupied[index] = true;
        numElements++;
        cout << "   ✅ Inserted at index " << index << " after " << probes << " probes" << endl;
    }
    
    bool search(string key, int& value) {
        int index = hash(key);
        int originalIndex = index;
        int probes = 0;
        
        cout << "🔍 Searching for " << key << endl;
        cout << "   Starting at index " << index << endl;
        
        while (occupied[index]) {
            if (table[index].first == key) {
                value = table[index].second;
                cout << "   ✅ Found at index " << index << " after " << probes << " probes" << endl;
                return true;
            }
            
            index = (index + 1) % tableSize;
            probes++;
            cout << "   🔍 Probing index " << index << " (probe #" << probes << ")" << endl;
            
            if (index == originalIndex) break;
        }
        
        cout << "   ❌ Not found after " << probes << " probes" << endl;
        return false;
    }
    
    void display() {
        cout << "\n📊 Hash Table Contents:" << endl;
        cout << "======================" << endl;
        cout << "Load factor: " << (double)numElements / tableSize << endl;
        cout << endl;
        
        for (int i = 0; i < tableSize; i++) {
            cout << "[" << i << "] → ";
            if (occupied[i]) {
                cout << "{" << table[i].first << ":" << table[i].second << "}";
            } else {
                cout << "empty";
            }
            cout << endl;
        }
    }
};

int main() {
    HashTableLinearProbing inventory(7);
    
    cout << "\n📦 Building Product Inventory" << endl;
    cout << "=============================" << endl;
    
    // Insert products
    inventory.insert("Laptop", 999);
    inventory.insert("Mouse", 25);
    inventory.insert("Keyboard", 75);
    inventory.insert("Monitor", 300);
    inventory.insert("Webcam", 50);
    
    // Display table
    inventory.display();
    
    // Search for products
    cout << "\n🔍 Looking up products:" << endl;
    int price;
    inventory.search("Laptop", price);
    inventory.search("Tablet", price);
    
    return 0;
}
```

### 🎯 Collision Resolution Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Chaining** | Simple, handles high load factors | Extra memory for pointers | General purpose |
| **Linear Probing** | Cache-friendly, no extra memory | Clustering issues | Low load factors |
| **Quadratic Probing** | Reduces clustering | More complex | Medium load factors |
| **Double Hashing** | Best distribution | Most complex | High-performance needs |

---

## Implementation Strategies

### 🏗️ Complete Hash Table Implementation

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <functional>
using namespace std;

template<typename K, typename V>
class HashTable {
private:
    struct Entry {
        K key;
        V value;
        bool occupied;
        bool deleted; // For lazy deletion
        
        Entry() : occupied(false), deleted(false) {}
        Entry(K k, V v) : key(k), value(v), occupied(true), deleted(false) {}
    };
    
    vector<Entry> table;
    int tableSize;
    int numElements;
    int numDeleted;
    double maxLoadFactor;
    
    // Hash function using std::hash
    int hash(K key) {
        return std::hash<K>{}(key) % tableSize;
    }
    
    // Secondary hash for double hashing
    int hash2(K key) {
        int h = std::hash<K>{}(key);
        return 7 - (h % 7); // Prime number different from table size
    }
    
    // Find index for key using double hashing
    int findIndex(K key) {
        int index = hash(key);
        int step = hash2(key);
        int originalIndex = index;
        
        while (table[index].occupied || table[index].deleted) {
            if (table[index].occupied && table[index].key == key) {
                return index; // Found existing key
            }
            
            index = (index + step) % tableSize;
            if (index == originalIndex) {
                break; // Table full
            }
        }
        
        return index; // Empty slot or full table
    }
    
    // Resize table when load factor gets too high
    void resize() {
        cout << "🔄 Resizing table from " << tableSize << " to " << tableSize * 2 << endl;
        
        vector<Entry> oldTable = table;
        int oldSize = tableSize;
        
        tableSize *= 2;
        table.clear();
        table.resize(tableSize);
        numElements = 0;
        numDeleted = 0;
        
        // Rehash all elements
        for (int i = 0; i < oldSize; i++) {
            if (oldTable[i].occupied && !oldTable[i].deleted) {
                insert(oldTable[i].key, oldTable[i].value);
            }
        }
    }
    
    double getLoadFactor() {
        return (double)(numElements + numDeleted) / tableSize;
    }
    
public:
    HashTable(int initialSize = 11, double maxLoad = 0.7) {
        tableSize = initialSize;
        maxLoadFactor = maxLoad;
        numElements = 0;
        numDeleted = 0;
        table.resize(tableSize);
        
        cout << "🏗️ Created hash table (size: " << tableSize 
             << ", max load factor: " << maxLoadFactor << ")" << endl;
    }
    
    void insert(K key, V value) {
        // Resize if load factor too high
        if (getLoadFactor() > maxLoadFactor) {
            resize();
        }
        
        int index = findIndex(key);
        
        if (table[index].occupied && !table[index].deleted) {
            // Update existing key
            table[index].value = value;
            cout << "📝 Updated " << key << " = " << value << endl;
        } else {
            // Insert new key
            if (table[index].deleted) {
                numDeleted--;
            }
            table[index] = Entry(key, value);
            numElements++;
            cout << "➕ Inserted " << key << " = " << value << " at index " << index << endl;
        }
    }
    
    bool search(K key, V& value) {
        int index = hash(key);
        int step = hash2(key);
        int originalIndex = index;
        int probes = 0;
        
        while (table[index].occupied || table[index].deleted) {
            if (table[index].occupied && !table[index].deleted && table[index].key == key) {
                value = table[index].value;
                cout << "✅ Found " << key << " = " << value << " (probes: " << probes << ")" << endl;
                return true;
            }
            
            index = (index + step) % tableSize;
            probes++;
            
            if (index == originalIndex) break;
        }
        
        cout << "❌ " << key << " not found (probes: " << probes << ")" << endl;
        return false;
    }
    
    bool remove(K key) {
        int index = hash(key);
        int step = hash2(key);
        int originalIndex = index;
        
        while (table[index].occupied || table[index].deleted) {
            if (table[index].occupied && !table[index].deleted && table[index].key == key) {
                table[index].deleted = true;
                table[index].occupied = false;
                numElements--;
                numDeleted++;
                cout << "🗑️ Removed " << key << " from index " << index << endl;
                return true;
            }
            
            index = (index + step) % tableSize;
            if (index == originalIndex) break;
        }
        
        cout << "❌ Cannot remove " << key << " - not found" << endl;
        return false;
    }
    
    void displayStats() {
        cout << "\n📊 Hash Table Statistics:" << endl;
        cout << "========================" << endl;
        cout << "Table size: " << tableSize << endl;
        cout << "Elements: " << numElements << endl;
        cout << "Deleted slots: " << numDeleted << endl;
        cout << "Load factor: " << getLoadFactor() << endl;
        cout << "Utilization: " << (double)numElements / tableSize << endl;
    }
    
    void display() {
        cout << "\n📋 Hash Table Contents:" << endl;
        cout << "======================" << endl;
        
        for (int i = 0; i < tableSize; i++) {
            cout << "[" << i << "] → ";
            if (table[i].occupied && !table[i].deleted) {
                cout << "{" << table[i].key << ":" << table[i].value << "}";
            } else if (table[i].deleted) {
                cout << "DELETED";
            } else {
                cout << "empty";
            }
            cout << endl;
        }
    }
};

int main() {
    HashTable<string, int> studentGrades;
    
    cout << "🎓 Student Grade Management System" << endl;
    cout << "==================================" << endl;
    
    // Insert student grades
    studentGrades.insert("Alice", 95);
    studentGrades.insert("Bob", 87);
    studentGrades.insert("Charlie", 92);
    studentGrades.insert("Diana", 88);
    studentGrades.insert("Eve", 94);
    studentGrades.insert("Frank", 85);
    studentGrades.insert("Grace", 91);
    studentGrades.insert("Henry", 89);
    
    studentGrades.displayStats();
    studentGrades.display();
    
    // Search for grades
    cout << "\n🔍 Looking up student grades:" << endl;
    int grade;
    studentGrades.search("Alice", grade);
    studentGrades.search("Bob", grade);
    studentGrades.search("Zoe", grade);
    
    // Update a grade
    cout << "\n📝 Updating grades:" << endl;
    studentGrades.insert("Alice", 98); // Update existing
    
    // Remove a student
    cout << "\n🗑️ Removing students:" << endl;
    studentGrades.remove("Charlie");
    
    studentGrades.displayStats();
    
    return 0;
}
```

---

## Performance Analysis

### ⚡ Time Complexity Analysis

```cpp
class PerformanceAnalyzer {
public:
    void analyzeComplexity() {
        cout << "⚡ Hash Table Time Complexity Analysis" << endl;
        cout << "=====================================" << endl;
        cout << endl;
        
        cout << "🎯 AVERAGE CASE (Good hash function, low load factor):" << endl;
        cout << "   Search:  O(1) - Direct access to index" << endl;
        cout << "   Insert:  O(1) - Find empty slot quickly" << endl;
        cout << "   Delete:  O(1) - Mark slot as deleted" << endl;
        cout << endl;
        
        cout << "😱 WORST CASE (Poor hash function, high collisions):" << endl;
        cout << "   Search:  O(n) - All keys hash to same index" << endl;
        cout << "   Insert:  O(n) - Must probe many slots" << endl;
        cout << "   Delete:  O(n) - Must search through collisions" << endl;
        cout << endl;
        
        cout << "📊 SPACE COMPLEXITY:" << endl;
        cout << "   Storage: O(n) - Array of size proportional to elements" << endl;
        cout << "   Chaining: O(n) - Extra space for linked lists" << endl;
        cout << "   Open Addressing: O(n) - Just the array" << endl;
        cout << endl;
        
        cout << "🎛️ LOAD FACTOR IMPACT:" << endl;
        cout << "   α = n/m (n = elements, m = table size)" << endl;
        cout << "   α < 0.5: Excellent performance" << endl;
        cout << "   α < 0.7: Good performance" << endl;
        cout << "   α > 0.8: Performance degrades" << endl;
        cout << "   α > 0.9: Poor performance" << endl;
    }
    
    void compareWithOtherStructures() {
        cout << "\n🏆 Hash Table vs Other Data Structures" << endl;
        cout << "======================================" << endl;
        cout << endl;
        
        cout << "| Operation | Hash Table | Array | BST | Linked List |" << endl;
        cout << "|-----------|------------|-------|-----|-------------|" << endl;
        cout << "| Search    | O(1) avg   | O(n)  |O(log n)| O(n)     |" << endl;
        cout << "| Insert    | O(1) avg   | O(1)* |O(log n)| O(1)     |" << endl;
        cout << "| Delete    | O(1) avg   | O(n)* |O(log n)| O(n)     |" << endl;
        cout << "| Memory    | O(n)       | O(n)  | O(n)   | O(n)     |" << endl;
        cout << "| Ordered   | No         | No    | Yes    | No       |" << endl;
        cout << endl;
        cout << "* Array insert/delete at specific position" << endl;
        cout << endl;
        
        cout << "✅ Hash Tables Excel At:" << endl;
        cout << "   - Fast lookups by key" << endl;
        cout << "   - Implementing dictionaries/maps" << endl;
        cout << "   - Caching and memoization" << endl;
        cout << "   - Database indexing" << endl;
        cout << endl;
        
        cout << "❌ Hash Tables Struggle With:" << endl;
        cout << "   - Maintaining sorted order" << endl;
        cout << "   - Range queries" << endl;
        cout << "   - Finding min/max efficiently" << endl;
        cout << "   - Memory usage (load factor overhead)" << endl;
    }
};

int main() {
    PerformanceAnalyzer analyzer;
    analyzer.analyzeComplexity();
    analyzer.compareWithOtherStructures();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 💾 Database Indexing System

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
using namespace std;

struct DatabaseRecord {
    int id;
    string name;
    string email;
    int age;
    
    DatabaseRecord(int i, string n, string e, int a) 
        : id(i), name(n), email(e), age(a) {}
};

class DatabaseIndex {
private:
    vector<DatabaseRecord> records;
    unordered_map<int, int> idIndex;        // ID → record position
    unordered_map<string, int> emailIndex;  // Email → record position
    unordered_map<string, vector<int>> nameIndex; // Name → list of positions
    
public:
    void addRecord(int id, string name, string email, int age) {
        int position = records.size();
        records.push_back(DatabaseRecord(id, name, email, age));
        
        // Update all indices
        idIndex[id] = position;
        emailIndex[email] = position;
        nameIndex[name].push_back(position);
        
        cout << "📝 Added record: ID=" << id << ", Name=" << name 
             << ", Email=" << email << ", Age=" << age << endl;
    }
    
    DatabaseRecord* findById(int id) {
        cout << "🔍 Searching by ID: " << id << endl;
        
        auto it = idIndex.find(id);
        if (it != idIndex.end()) {
            int position = it->second;
            cout << "✅ Found in O(1) time!" << endl;
            return &records[position];
        }
        
        cout << "❌ Record not found" << endl;
        return nullptr;
    }
    
    DatabaseRecord* findByEmail(string email) {
        cout << "🔍 Searching by email: " << email << endl;
        
        auto it = emailIndex.find(email);
        if (it != emailIndex.end()) {
            int position = it->second;
            cout << "✅ Found in O(1) time!" << endl;
            return &records[position];
        }
        
        cout << "❌ Record not found" << endl;
        return nullptr;
    }
    
    vector<DatabaseRecord*> findByName(string name) {
        cout << "🔍 Searching by name: " << name << endl;
        vector<DatabaseRecord*> results;
        
        auto it = nameIndex.find(name);
        if (it != nameIndex.end()) {
            for (int position : it->second) {
                results.push_back(&records[position]);
            }
            cout << "✅ Found " << results.size() << " records in O(1) time!" << endl;
        } else {
            cout << "❌ No records found" << endl;
        }
        
        return results;
    }
    
    void displayStats() {
        cout << "\n📊 Database Statistics:" << endl;
        cout << "======================" << endl;
        cout << "Total records: " << records.size() << endl;
        cout << "ID index size: " << idIndex.size() << endl;
        cout << "Email index size: " << emailIndex.size() << endl;
        cout << "Name index entries: " << nameIndex.size() << endl;
    }
};

int main() {
    DatabaseIndex db;
    
    cout << "💾 Database Indexing System" << endl;
    cout << "===========================" << endl;
    
    // Add records
    db.addRecord(1001, "Alice Johnson", "alice@email.com", 25);
    db.addRecord(1002, "Bob Smith", "bob@email.com", 30);
    db.addRecord(1003, "Alice Brown", "alice.brown@email.com", 28);
    db.addRecord(1004, "Charlie Davis", "charlie@email.com", 35);
    db.addRecord(1005, "Alice Wilson", "alice.w@email.com", 22);
    
    db.displayStats();
    
    // Fast lookups using different indices
    cout << "\n🚀 Lightning-fast lookups:" << endl;
    
    // Search by ID
    DatabaseRecord* record = db.findById(1003);
    if (record) {
        cout << "   Found: " << record->name << ", Age: " << record->age << endl;
    }
    
    // Search by email
    record = db.findByEmail("bob@email.com");
    if (record) {
        cout << "   Found: " << record->name << ", ID: " << record->id << endl;
    }
    
    // Search by name (multiple results)
    vector<DatabaseRecord*> alices = db.findByName("Alice Johnson");
    for (auto alice : alices) {
        cout << "   Found Alice: ID=" << alice->id << ", Email=" << alice->email << endl;
    }
    
    return 0;
}
```

### 2. 🌐 Web Browser Cache System

```cpp
#include <iostream>
#include <unordered_map>
#include <string>
#include <ctime>
using namespace std;

struct CacheEntry {
    string content;
    time_t timestamp;
    int accessCount;
    
    CacheEntry(string c) : content(c), accessCount(1) {
        timestamp = time(0);
    }
};

class WebCache {
private:
    unordered_map<string, CacheEntry> cache;
    int maxSize;
    int hits;
    int misses;
    
public:
    WebCache(int size = 100) : maxSize(size), hits(0), misses(0) {
        cout << "🌐 Web cache initialized (max size: " << size << ")" << endl;
    }
    
    string getPage(string url) {
        cout << "🔍 Requesting: " << url << endl;
        
        auto it = cache.find(url);
        if (it != cache.end()) {
            // Cache hit!
            hits++;
            it->second.accessCount++;
            it->second.timestamp = time(0); // Update access time
            
            cout << "✅ Cache HIT! Served from cache" << endl;
            cout << "   Access count: " << it->second.accessCount << endl;
            return it->second.content;
        } else {
            // Cache miss - simulate fetching from server
            misses++;
            cout << "❌ Cache MISS! Fetching from server..." << endl;
            
            // Simulate server response
            string content = "Content for " + url + " (fetched at " + to_string(time(0)) + ")";
            
            // Add to cache
            if (cache.size() >= maxSize) {
                evictLeastRecentlyUsed();
            }
            
            cache[url] = CacheEntry(content);
            cout << "📦 Cached page for future requests" << endl;
            
            return content;
        }
    }
    
    void evictLeastRecentlyUsed() {
        if (cache.empty()) return;
        
        string lruUrl;
        time_t oldestTime = time(0);
        
        for (auto& pair : cache) {
            if (pair.second.timestamp < oldestTime) {
                oldestTime = pair.second.timestamp;
                lruUrl = pair.first;
            }
        }
        
        cache.erase(lruUrl);
        cout << "🗑️ Evicted LRU page: " << lruUrl << endl;
    }
    
    void displayStats() {
        cout << "\n📊 Cache Statistics:" << endl;
        cout << "===================" << endl;
        cout << "Cache size: " << cache.size() << "/" << maxSize << endl;
        cout << "Cache hits: " << hits << endl;
        cout << "Cache misses: " << misses << endl;
        
        if (hits + misses > 0) {
            double hitRate = (double)hits / (hits + misses) * 100;
            cout << "Hit rate: " << hitRate << "%" << endl;
        }
        
        cout << "\nCached pages:" << endl;
        for (auto& pair : cache) {
            cout << "  " << pair.first << " (accessed " << pair.second.accessCount << " times)" << endl;
        }
    }
};

int main() {
    WebCache browserCache(3); // Small cache for demo
    
    cout << "\n🌐 Web Browser Cache Simulation" << endl;
    cout << "===============================" << endl;
    
    // Simulate browsing
    browserCache.getPage("https://google.com");
    browserCache.getPage("https://github.com");
    browserCache.getPage("https://stackoverflow.com");
    
    cout << "\n🔄 Revisiting pages (should hit cache):" << endl;
    browserCache.getPage("https://google.com");
    browserCache.getPage("https://github.com");
    
    cout << "\n📄 Adding new page (should trigger eviction):" << endl;
    browserCache.getPage("https://reddit.com");
    
    cout << "\n🔍 Checking evicted page:" << endl;
    browserCache.getPage("https://stackoverflow.com");
    
    browserCache.displayStats();
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🔤 Two Sum Problem

**Story**: You're organizing a charity event where people donate money. You need to find two donors whose combined donation equals a target amount.

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class TwoSumSolver {
public:
    // Brute force approach - O(n²)
    vector<int> twoSumBruteForce(vector<int>& donations, int target) {
        cout << "🐌 Brute Force Approach (O(n²)):" << endl;
        
        for (int i = 0; i < donations.size(); i++) {
            for (int j = i + 1; j < donations.size(); j++) {
                if (donations[i] + donations[j] == target) {
                    cout << "✅ Found: $" << donations[i] << " + $" << donations[j] 
                         << " = $" << target << endl;
                    return {i, j};
                }
            }
        }
        
        cout << "❌ No solution found" << endl;
        return {};
    }
    
    // Hash table approach - O(n)
    vector<int> twoSumHashTable(vector<int>& donations, int target) {
        cout << "⚡ Hash Table Approach (O(n)):" << endl;
        
        unordered_map<int, int> seen; // value → index
        
        for (int i = 0; i < donations.size(); i++) {
            int needed = target - donations[i];
            cout << "   Checking donation $" << donations[i] 
                 << ", need $" << needed << " to reach target" << endl;
            
            if (seen.find(needed) != seen.end()) {
                int j = seen[needed];
                cout << "✅ Found: $" << donations[j] << " + $" << donations[i] 
                     << " = $" << target << endl;
                return {j, i};
            }
            
            seen[donations[i]] = i;
            cout << "   Added $" << donations[i] << " to hash table" << endl;
        }
        
        cout << "❌ No solution found" << endl;
        return {};
    }
    
    void demonstrateTwoSum() {
        vector<int> donations = {50, 25, 75, 100, 30, 45};
        int target = 125;
        
        cout << "💰 Charity Donation Two Sum Problem" << endl;
        cout << "===================================" << endl;
        cout << "Donations: ";
        for (int d : donations) cout << "$" << d << " ";
        cout << "\nTarget sum: $" << target << endl;
        cout << endl;
        
        // Compare both approaches
        twoSumBruteForce(donations, target);
        cout << endl;
        twoSumHashTable(donations, target);
    }
};

int main() {
    TwoSumSolver solver;
    solver.demonstrateTwoSum();
    
    return 0;
}
```

### Problem 2: 📊 Frequency Counter

**Story**: You're analyzing customer feedback to find the most common words mentioned.

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class FrequencyAnalyzer {
public:
    unordered_map<string, int> countWordFrequency(vector<string>& words) {
        unordered_map<string, int> frequency;
        
        cout << "📊 Counting word frequencies:" << endl;
        
        for (string word : words) {
            frequency[word]++;
            cout << "   '" << word << "' count: " << frequency[word] << endl;
        }
        
        return frequency;
    }
    
    vector<pair<string, int>> getTopWords(unordered_map<string, int>& frequency, int k) {
        vector<pair<string, int>> wordCounts;
        
        // Convert map to vector for sorting
        for (auto& pair : frequency) {
            wordCounts.push_back(pair);
        }
        
        // Sort by frequency (descending)
        sort(wordCounts.begin(), wordCounts.end(), 
             [](const pair<string, int>& a, const pair<string, int>& b) {
                 return a.second > b.second;
             });
        
        // Return top k words
        vector<pair<string, int>> topWords;
        for (int i = 0; i < min(k, (int)wordCounts.size()); i++) {
            topWords.push_back(wordCounts[i]);
        }
        
        return topWords;
    }
    
    void analyzeFeedback() {
        vector<string> feedback = {
            "great", "service", "excellent", "food", "great", "staff",
            "delicious", "food", "amazing", "service", "great", "experience",
            "wonderful", "staff", "excellent", "food", "great", "atmosphere",
            "service", "outstanding", "food", "great", "value"
        };
        
        cout << "📝 Customer Feedback Analysis" << endl;
        cout << "=============================" << endl;
        cout << "Total feedback words: " << feedback.size() << endl;
        cout << endl;
        
        // Count frequencies
        auto frequency = countWordFrequency(feedback);
        
        cout << "\n🏆 Top 5 Most Mentioned Words:" << endl;
        cout << "==============================" << endl;
        
        auto topWords = getTopWords(frequency, 5);
        for (int i = 0; i < topWords.size(); i++) {
            cout << (i + 1) << ". '" << topWords[i].first 
                 << "' - mentioned " << topWords[i].second << " times" << endl;
        }
        
        cout << "\n📈 All word frequencies:" << endl;
        for (auto& pair : frequency) {
            cout << "   '" << pair.first << "': " << pair.second << endl;
        }
    }
};

int main() {
    FrequencyAnalyzer analyzer;
    analyzer.analyzeFeedback();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Hash Table Fundamentals
1. **Direct Access**: Convert keys to array indices for O(1) access
2. **Hash Function**: Maps keys to indices uniformly and efficiently
3. **Collision Resolution**: Handle multiple keys mapping to same index
4. **Load Factor**: Ratio of elements to table size affects performance
5. **Dynamic Resizing**: Maintain performance as data grows

### Time Complexities
- **Search**: O(1) average, O(n) worst case
- **Insert**: O(1) average, O(n) worst case (with resizing)
- **Delete**: O(1) average, O(n) worst case
- **Space**: O(n) for n elements

### Hash Function Properties
1. **Deterministic**: Same input always produces same output
2. **Uniform Distribution**: Spreads keys evenly across table
3. **Fast Computation**: Quick to calculate
4. **Avalanche Effect**: Small input changes cause large output changes

### Collision Resolution Methods
1. **Chaining**: Store colliding elements in linked lists
2. **Linear Probing**: Check next available slot sequentially
3. **Quadratic Probing**: Check slots at quadratic intervals
4. **Double Hashing**: Use second hash function for step size

### When to Use Hash Tables
✅ **Perfect for:**
- Fast key-value lookups (dictionaries, maps)
- Implementing sets and checking membership
- Caching and memoization
- Database indexing
- Counting frequencies
- Finding duplicates

❌ **Not suitable for:**
- Maintaining sorted order
- Range queries (find all keys between x and y)
- Finding minimum/maximum efficiently
- When memory is extremely limited

### Real-World Applications
1. **💾 Database Systems**: Index tables for fast record lookup
2. **🌐 Web Browsers**: Page caching for faster loading
3. **🔐 Security**: Password storage with hashing
4. **📊 Analytics**: Frequency counting and statistics
5. **🎮 Gaming**: Player data lookup, leaderboards
6. **💻 Compilers**: Symbol tables for variable lookup

### Load Factor Guidelines
- **α < 0.5**: Excellent performance, some wasted space
- **α = 0.7**: Good balance of performance and space
- **α > 0.8**: Performance starts to degrade
- **α > 0.9**: Poor performance, frequent collisions

---

## 🚀 What's Next?

Excellent! You've mastered hash tables and understand how they provide lightning-fast lookups like library catalog systems. Next, let's explore [Graphs](04_Advanced_Structures/12_Graphs.md) - data structures that model relationships and connections, perfect for social networks, maps, and network routing!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Valid anagram, contains duplicate, intersection of two arrays
2. **Medium**: Group anagrams, top k frequent elements, longest substring without repeating characters
3. **Hard**: Substring with concatenation of all words, longest consecutive sequence

### Tips for Success
1. **Choose Good Hash Functions**: Use proven algorithms like djb2 or FNV
2. **Monitor Load Factor**: Keep it below 0.7 for good performance
3. **Handle Collisions Properly**: Choose appropriate resolution method
4. **Consider Memory Usage**: Hash tables can use more memory than other structures
5. **Think About Key Types**: Ensure keys are hashable and comparable

### Common Patterns
1. **Frequency Counting**: Count occurrences of elements
2. **Two Pointer + Hash**: Solve sum problems efficiently
3. **Sliding Window + Hash**: Track elements in moving window
4. **Memoization**: Cache expensive function results
5. **Set Operations**: Union, intersection, difference

**Remember: Hash tables are like library catalogs - they provide instant access to exactly what you're looking for, making them perfect for fast lookups and data organization!** 📚
