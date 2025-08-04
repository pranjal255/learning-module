# Greedy Algorithms - The Art of Local Optimization

## 🌟 Real-World Story: The Smart Cashier

Imagine you're a cashier at a busy store, and a customer needs change for $67! 💰

**The Challenge**: You need to give the correct change using the fewest coins possible from your cash register.

**Available coins**: $25, $10, $5, $1

**The Greedy Approach**:
1. **Always pick the largest coin** that doesn't exceed the remaining amount
2. **$67**: Use $25 → remaining $42
3. **$42**: Use $25 → remaining $17  
4. **$17**: Use $10 → remaining $7
5. **$7**: Use $5 → remaining $2
6. **$2**: Use $1 → remaining $1
7. **$1**: Use $1 → remaining $0

**Result**: 6 coins total ($25 + $25 + $10 + $5 + $1 + $1)

**The Magic**: By making the locally optimal choice (largest coin) at each step, we achieve the globally optimal solution (fewest total coins)!

This is exactly how **Greedy Algorithms** work! They help us:
- **Make locally optimal choices** at each step
- **Build global solutions** from local decisions
- **Solve optimization problems** efficiently
- **Handle real-time decisions** without looking ahead

## 🎯 What You'll Learn
- Greedy algorithm principles and when they work
- Classic greedy problems with step-by-step solutions
- How to prove greedy algorithms are correct
- Real-world applications and optimization techniques

---

## 📝 Table of Contents
1. [Greedy Algorithm Fundamentals](#greedy-algorithm-fundamentals)
2. [Classic Greedy Problems](#classic-greedy-problems)
3. [Greedy vs Dynamic Programming](#greedy-vs-dynamic-programming)
4. [Proof Techniques](#proof-techniques)
5. [Real-World Applications](#real-world-applications)
6. [Tips, Tricks & Common Pitfalls](#tips-tricks--common-pitfalls)

---

## Greedy Algorithm Fundamentals

### 🎯 The Greedy Choice Property

A greedy algorithm works when the problem has the **greedy choice property**:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

class GreedyFundamentals {
public:
    void explainGreedyPrinciples() {
        cout << "🎯 Greedy Algorithm Core Principles" << endl;
        cout << "===================================" << endl;
        cout << endl;
        
        cout << "1. 🎯 GREEDY CHOICE PROPERTY:" << endl;
        cout << "   • A globally optimal solution can be reached by making" << endl;
        cout << "     locally optimal (greedy) choices" << endl;
        cout << "   • Each choice is made based on current information" << endl;
        cout << "   • No need to reconsider previous choices" << endl;
        cout << endl;
        
        cout << "2. 🏗️ OPTIMAL SUBSTRUCTURE:" << endl;
        cout << "   • Optimal solution contains optimal solutions to subproblems" << endl;
        cout << "   • After making a greedy choice, we're left with a subproblem" << endl;
        cout << "   • The subproblem has the same structure as original" << endl;
        cout << endl;
        
        cout << "3. 🔄 GREEDY ALGORITHM TEMPLATE:" << endl;
        cout << "   while (problem not solved) {" << endl;
        cout << "       make greedy choice;" << endl;
        cout << "       reduce problem to smaller subproblem;" << endl;
        cout << "   }" << endl;
        cout << endl;
        
        cout << "4. ⚡ CHARACTERISTICS:" << endl;
        cout << "   • Makes irrevocable decisions" << endl;
        cout << "   • Never reconsiders choices" << endl;
        cout << "   • Usually faster than DP" << endl;
        cout << "   • Doesn't always work!" << endl;
    }
    
    // Example: Coin Change with Greedy (works for standard coin systems)
    void demonstrateCoinChangeGreedy() {
        cout << "\n💰 Coin Change: Greedy Approach" << endl;
        cout << "===============================" << endl;
        
        vector<int> coins = {25, 10, 5, 1}; // Standard US coins
        int amount = 67;
        
        cout << "Available coins: ";
        for (int coin : coins) cout << coin << "¢ ";
        cout << "\nTarget amount: " << amount << "¢" << endl;
        
        vector<int> result;
        int totalCoins = 0;
        
        cout << "\nGreedy selection process:" << endl;
        
        for (int coin : coins) {
            while (amount >= coin) {
                result.push_back(coin);
                amount -= coin;
                totalCoins++;
                
                cout << "Use " << coin << "¢ coin → remaining: " << amount << "¢" << endl;
            }
        }
        
        cout << "\nSolution:" << endl;
        cout << "Coins used: ";
        for (int coin : result) cout << coin << "¢ ";
        cout << "\nTotal coins: " << totalCoins << endl;
        
        // Count frequency of each coin
        cout << "\nBreakdown:" << endl;
        vector<int> count(4, 0);
        for (int coin : result) {
            if (coin == 25) count[0]++;
            else if (coin == 10) count[1]++;
            else if (coin == 5) count[2]++;
            else if (coin == 1) count[3]++;
        }
        
        vector<int> coinTypes = {25, 10, 5, 1};
        for (int i = 0; i < 4; i++) {
            if (count[i] > 0) {
                cout << count[i] << " × " << coinTypes[i] << "¢ = " 
                     << (count[i] * coinTypes[i]) << "¢" << endl;
            }
        }
    }
    
    // Counter-example: When greedy fails
    void demonstrateGreedyFailure() {
        cout << "\n❌ When Greedy Fails: Non-Standard Coins" << endl;
        cout << "=========================================" << endl;
        
        vector<int> coins = {4, 3, 1}; // Non-standard coin system
        int amount = 6;
        
        cout << "Available coins: ";
        for (int coin : coins) cout << coin << "¢ ";
        cout << "\nTarget amount: " << amount << "¢" << endl;
        
        // Greedy approach
        cout << "\nGreedy approach:" << endl;
        vector<int> greedyResult;
        int greedyAmount = amount;
        
        for (int coin : coins) {
            while (greedyAmount >= coin) {
                greedyResult.push_back(coin);
                greedyAmount -= coin;
                cout << "Use " << coin << "¢ coin → remaining: " << greedyAmount << "¢" << endl;
            }
        }
        
        cout << "Greedy solution: ";
        for (int coin : greedyResult) cout << coin << "¢ ";
        cout << " (Total: " << greedyResult.size() << " coins)" << endl;
        
        // Optimal approach
        cout << "\nOptimal solution:" << endl;
        cout << "Use 3¢ + 3¢ = 6¢ (Total: 2 coins)" << endl;
        
        cout << "\n💡 Lesson: Greedy doesn't always work!" << endl;
        cout << "Need to verify greedy choice property for each problem." << endl;
    }
    
    void demonstrateFundamentals() {
        explainGreedyPrinciples();
        demonstrateCoinChangeGreedy();
        demonstrateGreedyFailure();
    }
};

int main() {
    GreedyFundamentals demo;
    demo.demonstrateFundamentals();
    
    return 0;
}
```

### 🔍 Recognizing Greedy Problems

```cpp
class GreedyRecognition {
public:
    void identifyGreedyProblems() {
        cout << "\n🔍 How to Recognize Greedy Problems" << endl;
        cout << "===================================" << endl;
        cout << endl;
        
        cout << "🎯 PROBLEM CHARACTERISTICS:" << endl;
        cout << "• Optimization problem (minimize/maximize)" << endl;
        cout << "• Can make local choices without global knowledge" << endl;
        cout << "• Local optimal choice leads to global optimum" << endl;
        cout << "• No need to reconsider previous decisions" << endl;
        cout << endl;
        
        cout << "🔍 COMMON PATTERNS:" << endl;
        cout << "1. Activity/Interval Selection" << endl;
        cout << "2. Scheduling Problems" << endl;
        cout << "3. Minimum Spanning Tree" << endl;
        cout << "4. Shortest Path (Dijkstra)" << endl;
        cout << "5. Huffman Coding" << endl;
        cout << "6. Fractional Knapsack" << endl;
        cout << endl;
        
        cout << "✅ GREEDY VERIFICATION CHECKLIST:" << endl;
        cout << "□ Can you define a greedy choice?" << endl;
        cout << "□ Does greedy choice lead to optimal subproblem?" << endl;
        cout << "□ Can you prove greedy choice is safe?" << endl;
        cout << "□ Does problem have optimal substructure?" << endl;
        cout << "□ Are there no dependencies between choices?" << endl;
    }
    
    void demonstrateRecognition() {
        cout << "\n📝 Example Problem Analysis" << endl;
        cout << "===========================" << endl;
        
        cout << "PROBLEM: 'Activity Selection'" << endl;
        cout << "Given activities with start/end times, select maximum" << endl;
        cout << "number of non-overlapping activities." << endl;
        cout << endl;
        
        cout << "🔍 ANALYSIS:" << endl;
        cout << "• Goal: Maximize number of activities" << endl;
        cout << "• Greedy choice: Always pick activity that ends earliest" << endl;
        cout << "• Why? Leaves most room for future activities" << endl;
        cout << "• Subproblem: Select from remaining non-overlapping activities" << endl;
        cout << "• Safe choice: Earliest ending activity is always safe" << endl;
        cout << endl;
        
        cout << "✅ CONCLUSION: This is a greedy problem!" << endl;
        cout << "Greedy strategy: Sort by end time, pick earliest ending" << endl;
    }
};

int main() {
    GreedyRecognition demo;
    demo.identifyGreedyProblems();
    demo.demonstrateRecognition();
    
    return 0;
}
```

---

## Classic Greedy Problems

### 🎯 Activity Selection - The Scheduling Master

```cpp
class ActivitySelection {
private:
    struct Activity {
        int id;
        int start;
        int end;
        string name;
        
        Activity(int i, int s, int e, string n) : id(i), start(s), end(e), name(n) {}
    };
    
public:
    vector<Activity> selectActivities(vector<Activity>& activities) {
        cout << "🎯 Activity Selection Problem" << endl;
        cout << "=============================" << endl;
        
        cout << "Available activities:" << endl;
        for (const auto& activity : activities) {
            cout << "  " << activity.id << ": " << activity.name 
                 << " [" << activity.start << ", " << activity.end << "]" << endl;
        }
        
        // Sort by end time (greedy choice)
        sort(activities.begin(), activities.end(), 
             [](const Activity& a, const Activity& b) {
                 return a.end < b.end;
             });
        
        cout << "\nAfter sorting by end time:" << endl;
        for (const auto& activity : activities) {
            cout << "  " << activity.id << ": " << activity.name 
                 << " [" << activity.start << ", " << activity.end << "]" << endl;
        }
        
        vector<Activity> selected;
        cout << "\nGreedy selection process:" << endl;
        
        // Always select first activity (earliest ending)
        selected.push_back(activities[0]);
        int lastEndTime = activities[0].end;
        cout << "✅ Select: " << activities[0].name 
             << " [" << activities[0].start << ", " << activities[0].end << "]" << endl;
        
        // Select subsequent activities that don't overlap
        for (int i = 1; i < activities.size(); i++) {
            if (activities[i].start >= lastEndTime) {
                selected.push_back(activities[i]);
                lastEndTime = activities[i].end;
                cout << "✅ Select: " << activities[i].name 
                     << " [" << activities[i].start << ", " << activities[i].end 
                     << "] (no overlap)" << endl;
            } else {
                cout << "❌ Skip: " << activities[i].name 
                     << " [" << activities[i].start << ", " << activities[i].end 
                     << "] (overlaps with previous)" << endl;
            }
        }
        
        return selected;
    }
    
    void demonstrateActivitySelection() {
        vector<Activity> activities = {
            Activity(1, 1, 4, "Meeting A"),
            Activity(2, 3, 5, "Meeting B"),
            Activity(3, 0, 6, "Meeting C"),
            Activity(4, 5, 7, "Meeting D"),
            Activity(5, 3, 9, "Meeting E"),
            Activity(6, 5, 9, "Meeting F"),
            Activity(7, 6, 10, "Meeting G"),
            Activity(8, 8, 11, "Meeting H"),
            Activity(9, 8, 12, "Meeting I"),
            Activity(10, 2, 14, "Meeting J"),
            Activity(11, 12, 16, "Meeting K")
        };
        
        vector<Activity> selected = selectActivities(activities);
        
        cout << "\n🎯 Final Selection:" << endl;
        cout << "Selected " << selected.size() << " activities:" << endl;
        for (const auto& activity : selected) {
            cout << "  " << activity.name << " [" << activity.start 
                 << ", " << activity.end << "]" << endl;
        }
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(n log n) - dominated by sorting" << endl;
        cout << "Space Complexity: O(1) - if we don't count output" << endl;
        cout << "Greedy Choice: Always pick earliest ending activity" << endl;
        cout << "Why it works: Leaves maximum room for future activities" << endl;
    }
};

int main() {
    ActivitySelection demo;
    demo.demonstrateActivitySelection();
    
    return 0;
}
```

### 🎒 Fractional Knapsack - The Value Maximizer

```cpp
class FractionalKnapsack {
private:
    struct Item {
        int weight;
        int value;
        string name;
        double valuePerWeight;
        
        Item(int w, int v, string n) : weight(w), value(v), name(n) {
            valuePerWeight = (double)value / weight;
        }
    };
    
public:
    double fractionalKnapsack(vector<Item>& items, int capacity) {
        cout << "🎒 Fractional Knapsack Problem" << endl;
        cout << "==============================" << endl;
        
        cout << "Knapsack capacity: " << capacity << " kg" << endl;
        cout << "Available items:" << endl;
        
        for (auto& item : items) {
            cout << "  " << item.name << ": weight=" << item.weight 
                 << "kg, value=$" << item.value 
                 << ", ratio=$" << item.valuePerWeight << "/kg" << endl;
        }
        
        // Sort by value-to-weight ratio (greedy choice)
        sort(items.begin(), items.end(), 
             [](const Item& a, const Item& b) {
                 return a.valuePerWeight > b.valuePerWeight;
             });
        
        cout << "\nAfter sorting by value/weight ratio:" << endl;
        for (const auto& item : items) {
            cout << "  " << item.name << ": $" << item.valuePerWeight << "/kg" << endl;
        }
        
        double totalValue = 0.0;
        int remainingCapacity = capacity;
        
        cout << "\nGreedy selection process:" << endl;
        
        for (const auto& item : items) {
            if (remainingCapacity == 0) break;
            
            if (item.weight <= remainingCapacity) {
                // Take entire item
                totalValue += item.value;
                remainingCapacity -= item.weight;
                
                cout << "✅ Take entire " << item.name 
                     << ": +" << item.weight << "kg, +$" << item.value 
                     << " (remaining capacity: " << remainingCapacity << "kg)" << endl;
            } else {
                // Take fraction of item
                double fraction = (double)remainingCapacity / item.weight;
                double fractionalValue = fraction * item.value;
                totalValue += fractionalValue;
                
                cout << "✅ Take " << (fraction * 100) << "% of " << item.name 
                     << ": +" << remainingCapacity << "kg, +$" << fractionalValue 
                     << " (knapsack full)" << endl;
                
                remainingCapacity = 0;
            }
        }
        
        return totalValue;
    }
    
    void demonstrateFractionalKnapsack() {
        vector<Item> items = {
            Item(10, 60, "Gold Jewelry"),
            Item(20, 100, "Silver Coins"),
            Item(30, 120, "Diamond Ring")
        };
        
        int capacity = 50;
        
        double maxValue = fractionalKnapsack(items, capacity);
        
        cout << "\n🎯 Result:" << endl;
        cout << "Maximum value: $" << maxValue << endl;
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(n log n) - dominated by sorting" << endl;
        cout << "Space Complexity: O(1)" << endl;
        cout << "Greedy Choice: Always pick highest value/weight ratio" << endl;
        cout << "Why it works: Maximizes value per unit weight" << endl;
        
        cout << "\n💡 Note: This is different from 0/1 Knapsack!" << endl;
        cout << "Fractional allows taking parts of items → Greedy works" << endl;
        cout << "0/1 requires whole items → Need Dynamic Programming" << endl;
    }
};

int main() {
    FractionalKnapsack demo;
    demo.demonstrateFractionalKnapsack();
    
    return 0;
}
```

### 🌳 Minimum Spanning Tree - Kruskal's Algorithm

```cpp
class MinimumSpanningTree {
private:
    struct Edge {
        int src, dest, weight;
        
        Edge(int s, int d, int w) : src(s), dest(d), weight(w) {}
        
        bool operator<(const Edge& other) const {
            return weight < other.weight;
        }
    };
    
    // Union-Find data structure for cycle detection
    class UnionFind {
    private:
        vector<int> parent, rank;
        
    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }
        
        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX == rootY) return false; // Already connected
            
            // Union by rank
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            
            return true;
        }
    };
    
public:
    vector<Edge> kruskalMST(vector<Edge>& edges, int vertices) {
        cout << "🌳 Minimum Spanning Tree (Kruskal's Algorithm)" << endl;
        cout << "===============================================" << endl;
        
        cout << "Graph with " << vertices << " vertices:" << endl;
        cout << "Edges (src, dest, weight):" << endl;
        for (const auto& edge : edges) {
            cout << "  (" << edge.src << ", " << edge.dest 
                 << ", " << edge.weight << ")" << endl;
        }
        
        // Sort edges by weight (greedy choice)
        sort(edges.begin(), edges.end());
        
        cout << "\nAfter sorting by weight:" << endl;
        for (const auto& edge : edges) {
            cout << "  (" << edge.src << ", " << edge.dest 
                 << ", " << edge.weight << ")" << endl;
        }
        
        vector<Edge> mst;
        UnionFind uf(vertices);
        int totalWeight = 0;
        
        cout << "\nGreedy selection process:" << endl;
        
        for (const auto& edge : edges) {
            cout << "Considering edge (" << edge.src << ", " << edge.dest 
                 << ", " << edge.weight << "): ";
            
            if (uf.unite(edge.src, edge.dest)) {
                mst.push_back(edge);
                totalWeight += edge.weight;
                cout << "✅ Added (no cycle)" << endl;
                
                if (mst.size() == vertices - 1) {
                    cout << "MST complete!" << endl;
                    break;
                }
            } else {
                cout << "❌ Rejected (creates cycle)" << endl;
            }
        }
        
        cout << "\n🌳 Minimum Spanning Tree:" << endl;
        cout << "Selected edges:" << endl;
        for (const auto& edge : mst) {
            cout << "  (" << edge.src << ", " << edge.dest 
                 << ", " << edge.weight << ")" << endl;
        }
        cout << "Total weight: " << totalWeight << endl;
        
        return mst;
    }
    
    void demonstrateKruskalMST() {
        vector<Edge> edges = {
            Edge(0, 1, 10),
            Edge(0, 2, 6),
            Edge(0, 3, 5),
            Edge(1, 3, 15),
            Edge(2, 3, 4)
        };
        
        int vertices = 4;
        
        vector<Edge> mst = kruskalMST(edges, vertices);
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(E log E) - dominated by sorting" << endl;
        cout << "Space Complexity: O(V) - for Union-Find structure" << endl;
        cout << "Greedy Choice: Always pick minimum weight edge that doesn't create cycle" << endl;
        cout << "Why it works: Cut property of MST" << endl;
        
        cout << "\n💡 Greedy Strategy:" << endl;
        cout << "1. Sort all edges by weight" << endl;
        cout << "2. Pick minimum weight edge that doesn't create cycle" << endl;
        cout << "3. Repeat until we have V-1 edges" << endl;
    }
};

int main() {
    MinimumSpanningTree demo;
    demo.demonstrateKruskalMST();
    
    return 0;
}
```

### 🗜️ Huffman Coding - The Compression Expert

```cpp
class HuffmanCoding {
private:
    struct Node {
        char character;
        int frequency;
        Node* left;
        Node* right;
        
        Node(char c, int f) : character(c), frequency(f), left(nullptr), right(nullptr) {}
        Node(int f) : character('\0'), frequency(f), left(nullptr), right(nullptr) {}
    };
    
    struct Compare {
        bool operator()(Node* a, Node* b) {
            return a->frequency > b->frequency; // Min heap
        }
    };
    
    void generateCodes(Node* root, string code, unordered_map<char, string>& codes) {
        if (!root) return;
        
        if (root->character != '\0') {
            codes[root->character] = code.empty() ? "0" : code; // Handle single character
            return;
        }
        
        generateCodes(root->left, code + "0", codes);
        generateCodes(root->right, code + "1", codes);
    }
    
    void printTree(Node* root, string prefix = "", bool isLast = true) {
        if (!root) return;
        
        cout << prefix << (isLast ? "└── " : "├── ");
        
        if (root->character != '\0') {
            cout << "'" << root->character << "' (" << root->frequency << ")" << endl;
        } else {
            cout << "Internal (" << root->frequency << ")" << endl;
        }
        
        if (root->left || root->right) {
            if (root->right) {
                printTree(root->right, prefix + (isLast ? "    " : "│   "), !root->left);
            }
            if (root->left) {
                printTree(root->left, prefix + (isLast ? "    " : "│   "), true);
            }
        }
    }
    
public:
    unordered_map<char, string> buildHuffmanTree(unordered_map<char, int>& frequencies) {
        cout << "🗜️ Huffman Coding Algorithm" << endl;
        cout << "============================" << endl;
        
        cout << "Character frequencies:" << endl;
        for (const auto& pair : frequencies) {
            cout << "  '" << pair.first << "': " << pair.second << endl;
        }
        
        // Create priority queue (min heap)
        priority_queue<Node*, vector<Node*>, Compare> pq;
        
        cout << "\nBuilding Huffman tree:" << endl;
        
        // Create leaf nodes and add to priority queue
        for (const auto& pair : frequencies) {
            pq.push(new Node(pair.first, pair.second));
            cout << "Added leaf: '" << pair.first << "' (" << pair.second << ")" << endl;
        }
        
        int step = 1;
        
        // Build tree using greedy approach
        while (pq.size() > 1) {
            cout << "\nStep " << step++ << ":" << endl;
            
            // Take two minimum frequency nodes
            Node* right = pq.top(); pq.pop();
            Node* left = pq.top(); pq.pop();
            
            cout << "Combine nodes with frequencies " << left->frequency 
                 << " and " << right->frequency << endl;
            
            // Create internal node
            Node* internal = new Node(left->frequency + right->frequency);
            internal->left = left;
            internal->right = right;
            
            cout << "Created internal node with frequency " << internal->frequency << endl;
            
            pq.push(internal);
        }
        
        Node* root = pq.top();
        
        cout << "\n🌳 Final Huffman Tree:" << endl;
        printTree(root);
        
        // Generate codes
        unordered_map<char, string> codes;
        generateCodes(root, "", codes);
        
        return codes;
    }
    
    void demonstrateHuffmanCoding() {
        unordered_map<char, int> frequencies = {
            {'a', 5},
            {'b', 9},
            {'c', 12},
            {'d', 13},
            {'e', 16},
            {'f', 45}
        };
        
        unordered_map<char, string> codes = buildHuffmanTree(frequencies);
        
        cout << "\n🔤 Generated Huffman Codes:" << endl;
        for (const auto& pair : codes) {
            cout << "  '" << pair.first << "': " << pair.second << endl;
        }
        
        // Calculate compression ratio
        cout << "\n📊 Compression Analysis:" << endl;
        
        int totalChars = 0;
        int originalBits = 0;
        int compressedBits = 0;
        
        for (const auto& freq : frequencies) {
            totalChars += freq.second;
            originalBits += freq.second * 8; // 8 bits per character (ASCII)
            compressedBits += freq.second * codes[freq.first].length();
        }
        
        cout << "Total characters: " << totalChars << endl;
        cout << "Original size: " << originalBits << " bits (" << originalBits/8 << " bytes)" << endl;
        cout << "Compressed size: " << compressedBits << " bits (" << (compressedBits+7)/8 << " bytes)" << endl;
        cout << "Compression ratio: " << (double)originalBits/compressedBits << ":1" << endl;
        cout << "Space saved: " << (1.0 - (double)compressedBits/originalBits) * 100 << "%" << endl;
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(n log n) - heap operations" << endl;
        cout << "Space Complexity: O(n) - for tree and heap" << endl;
        cout << "Greedy Choice: Always combine two minimum frequency nodes" << endl;
        cout << "Why it works: Minimizes expected code length" << endl;
    }
};

int main() {
    HuffmanCoding demo;
    demo.demonstrateHuffmanCoding();
    
    return 0;
}
```

---

## Greedy vs Dynamic Programming

### 🔄 When to Use Which Approach

```cpp
class GreedyVsDP {
public:
    void compareApproaches() {
        cout << "🔄 Greedy vs Dynamic Programming" << endl;
        cout << "================================" << endl;
        cout << endl;
        
        cout << "🎯 GREEDY ALGORITHMS:" << endl;
        cout << "✅ Advantages:" << endl;
        cout << "   • Simple and intuitive" << endl;
        cout << "   • Fast execution (usually O(n log n))" << endl;
        cout << "   • Low memory usage" << endl;
        cout << "   • Makes decisions quickly" << endl;
        cout << "   • Good for real-time systems" << endl;
        cout << endl;
        
        cout << "❌ Disadvantages:" << endl;
        cout << "   • Doesn't always give optimal solution" << endl;
        cout << "   • Hard to prove correctness" << endl;
        cout << "   • Can't backtrack decisions" << endl;
        cout << "   • Limited to specific problem types" << endl;
        cout << endl;
        
        cout << "🧮 DYNAMIC PROGRAMMING:" << endl;
        cout << "✅ Advantages:" << endl;
        cout << "   • Always gives optimal solution (if applicable)" << endl;
        cout << "   • Handles overlapping subproblems efficiently" << endl;
        cout << "   • Can solve complex optimization problems" << endl;
        cout << "   • Systematic approach" << endl;
        cout << endl;
        
        cout << "❌ Disadvantages:" << endl;
        cout << "   • More complex to implement" << endl;
        cout << "   • Higher time/space complexity" << endl;
        cout << "   • Requires careful state design" << endl;
        cout << "   • May be overkill for simple problems" << endl;
    }
    
    void demonstrateKnapsackComparison() {
        cout << "\n🎒 Knapsack Problem Comparison" << endl;
        cout << "==============================" << endl;
        
        cout << "FRACTIONAL KNAPSACK (Greedy works):" << endl;
        cout << "• Can take fractions of items" << endl;
        cout << "• Greedy: Sort by value/weight ratio" << endl;
        cout << "• Always optimal" << endl;
        cout << "• Time: O(n log n)" << endl;
        cout << endl;
        
        cout << "0/1 KNAPSACK (DP required):" << endl;
        cout << "• Must take whole items or nothing" << endl;
        cout << "• Greedy fails (local optimum ≠ global optimum)" << endl;
        cout << "• Need DP for optimal solution" << endl;
        cout << "• Time: O(n × capacity)" << endl;
        cout << endl;
        
        cout << "Example where greedy fails in 0/1:" << endl;
        cout << "Items: (weight, value)" << endl;
        cout << "A: (10, 10), B: (20, 20), C: (15, 15)" << endl;
        cout << "Capacity: 30" << endl;
        cout << endl;
        cout << "Greedy (by ratio): A(1.0) + C(1.0) = value 25" << endl;
        cout << "Optimal: B + (partial A if fractional) = value 30" << endl;
        cout << "But in 0/1: B alone = value 20 < A+C = value 25" << endl;
    }
    
    void demonstrateDecisionFramework() {
        cout << "\n🤔 Decision Framework: Greedy vs DP" << endl;
        cout << "====================================" << endl;
        cout << endl;
        
        cout << "USE GREEDY WHEN:" << endl;
        cout << "✅ Problem has greedy choice property" << endl;
        cout << "✅ Local optimum leads to global optimum" << endl;
        cout << "✅ No dependencies between choices" << endl;
        cout << "✅ Can prove greedy choice is safe" << endl;
        cout << "✅ Need fast, simple solution" << endl;
        cout << endl;
        
        cout << "USE DYNAMIC PROGRAMMING WHEN:" << endl;
        cout << "✅ Overlapping subproblems exist" << endl;
        cout << "✅ Optimal substructure present" << endl;
        cout << "✅ Greedy doesn't work" << endl;
        cout << "✅ Need guaranteed optimal solution" << endl;
        cout << "✅ Can afford higher complexity" << endl;
        cout << endl;
        
        cout << "EXAMPLES:" << endl;
        cout << "Greedy: Activity selection, MST, Huffman coding" << endl;
        cout << "DP: 0/1 knapsack, LCS, edit distance" << endl;
        cout << "Both work: Coin change (depends on coin system)" << endl;
    }
};

int main() {
    GreedyVsDP demo;
    demo.compareApproaches();
    demo.demonstrateKnapsackComparison();
    demo.demonstrateDecisionFramework();
    
    return 0;
}
```

---

## Proof Techniques

### 🔍 How to Prove Greedy Algorithms Work

```cpp
class GreedyProofs {
public:
    void explainProofTechniques() {
        cout << "🔍 Proving Greedy Algorithm Correctness" << endl;
        cout << "=======================================" << endl;
        cout << endl;
        
        cout << "1. 🎯 GREEDY CHOICE PROPERTY:" << endl;
        cout << "   • Show that making greedy choice at each step" << endl;
        cout << "     leads to globally optimal solution" << endl;
        cout << "   • Prove: greedy choice is always safe" << endl;
        cout << endl;
        
        cout << "2. 🏗️ OPTIMAL SUBSTRUCTURE:" << endl;
        cout << "   • Show that after making greedy choice," << endl;
        cout << "     remaining problem has optimal substructure" << endl;
        cout << "   • Prove: optimal solution to original problem" << endl;
        cout << "     contains optimal solutions to subproblems" << endl;
        cout << endl;
        
        cout << "3. 📝 PROOF TECHNIQUES:" << endl;
        cout << "   a) Exchange Argument" << endl;
        cout << "   b) Cut-and-Paste" << endl;
        cout << "   c) Induction" << endl;
        cout << "   d) Contradiction" << endl;
    }
    
    void demonstrateActivitySelectionProof() {
        cout << "\n📝 Proof Example: Activity Selection" << endl;
        cout << "====================================" << endl;
        
        cout << "THEOREM: Selecting activity with earliest end time" << endl;
        cout << "is always part of some optimal solution." << endl;
        cout << endl;
        
        cout << "PROOF (Exchange Argument):" << endl;
        cout << "1. Let A = {a1, a2, ..., ak} be optimal solution" << endl;
        cout << "2. Let a1 be activity with earliest end time" << endl;
        cout << "3. Let aj be first activity in A (earliest end in A)" << endl;
        cout << endl;
        
        cout << "4. If a1 = aj, we're done" << endl;
        cout << "5. If a1 ≠ aj, then end(a1) ≤ end(aj)" << endl;
        cout << "6. Replace aj with a1 in A to get A'" << endl;
        cout << "7. A' is still feasible (no overlaps)" << endl;
        cout << "8. |A'| = |A|, so A' is also optimal" << endl;
        cout << "9. Therefore, a1 is in some optimal solution ✓" << endl;
        cout << endl;
        
        cout << "OPTIMAL SUBSTRUCTURE:" << endl;
        cout << "After selecting a1, remaining activities that" << endl;
        cout << "start after a1 ends form independent subproblem" << endl;
        cout << "with same structure as original problem." << endl;
    }
    
    void demonstrateHuffmanProof() {
        cout << "\n📝 Proof Example: Huffman Coding" << endl;
        cout << "=================================" << endl;
        
        cout << "THEOREM: Huffman algorithm produces optimal" << endl;
        cout << "prefix-free code (minimum expected length)." << endl;
        cout << endl;
        
        cout << "KEY LEMMAS:" << endl;
        cout << "1. In optimal tree, lowest frequency characters" << endl;
        cout << "   are at maximum depth" << endl;
        cout << "2. Two lowest frequency characters can be" << endl;
        cout << "   siblings in optimal tree" << endl;
        cout << endl;
        
        cout << "PROOF SKETCH:" << endl;
        cout << "1. Let x, y be two lowest frequency characters" << endl;
        cout << "2. Show we can make them siblings without" << endl;
        cout << "   increasing total cost" << endl;
        cout << "3. Replace x, y with single character z" << endl;
        cout << "   with frequency f(x) + f(y)" << endl;
        cout << "4. Solve subproblem optimally" << endl;
        cout << "5. Replace z with x, y as children" << endl;
        cout << "6. Result is optimal for original problem ✓" << endl;
    }
    
    void demonstrateProofTechniques() {
        explainProofTechniques();
        demonstrateActivitySelectionProof();
        demonstrateHuffmanProof();
        
        cout << "\n💡 Proof Strategy Tips:" << endl;
        cout << "1. Start with greedy choice property" << endl;
        cout << "2. Use exchange argument when possible" << endl;
        cout << "3. Show optimal substructure" << endl;
        cout << "4. Combine using induction" << endl;
        cout << "5. Consider counterexamples to test" << endl;
    }
};

int main() {
    GreedyProofs demo;
    demo.demonstrateProofTechniques();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 📅 Task Scheduling Optimization

```cpp
class TaskScheduling {
private:
    struct Task {
        string name;
        int deadline;
        int profit;
        int duration;
        
        Task(string n, int d, int p, int dur) : name(n), deadline(d), profit(p), duration(dur) {}
    };
    
public:
    vector<Task> scheduleTasksForMaxProfit(vector<Task>& tasks) {
        cout << "📅 Task Scheduling for Maximum Profit" << endl;
        cout << "=====================================" << endl;
        
        cout << "Available tasks:" << endl;
        for (const auto& task : tasks) {
            cout << "  " << task.name << ": deadline=" << task.deadline 
                 << ", profit=$" << task.profit << ", duration=" << task.duration << endl;
        }
        
        // Sort by profit in descending order (greedy choice)
        sort(tasks.begin(), tasks.end(), 
             [](const Task& a, const Task& b) {
                 return a.profit > b.profit;
             });
        
        cout << "\nAfter sorting by profit (descending):" << endl;
        for (const auto& task : tasks) {
            cout << "  " << task.name << ": $" << task.profit << endl;
        }
        
        vector<Task> scheduled;
        vector<bool> timeSlots(100, false); // Assume max deadline is 100
        
        cout << "\nGreedy scheduling process:" << endl;
        
        for (const auto& task : tasks) {
            cout << "Considering " << task.name << " (deadline=" << task.deadline 
                 << ", profit=$" << task.profit << "): ";
            
            // Find latest available slot before deadline
            bool scheduled_task = false;
            for (int slot = min(task.deadline - 1, 99); slot >= 0; slot--) {
                if (!timeSlots[slot]) {
                    timeSlots[slot] = true;
                    scheduled.push_back(task);
                    scheduled_task = true;
                    cout << "✅ Scheduled at time " << slot << endl;
                    break;
                }
            }
            
            if (!scheduled_task) {
                cout << "❌ Cannot schedule (no available slots)" << endl;
            }
        }
        
        return scheduled;
    }
    
    void demonstrateTaskScheduling() {
        vector<Task> tasks = {
            Task("Project A", 4, 100, 1),
            Task("Project B", 1, 19, 1),
            Task("Project C", 2, 27, 1),
            Task("Project D", 1, 25, 1),
            Task("Project E", 3, 15, 1)
        };
        
        vector<Task> scheduled = scheduleTasksForMaxProfit(tasks);
        
        cout << "\n📅 Final Schedule:" << endl;
        int totalProfit = 0;
        for (const auto& task : scheduled) {
            cout << "  " << task.name << ": $" << task.profit << endl;
            totalProfit += task.profit;
        }
        
        cout << "\nTotal profit: $" << totalProfit << endl;
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(n²) - for each task, check all slots" << endl;
        cout << "Space Complexity: O(max_deadline)" << endl;
        cout << "Greedy Choice: Always pick highest profit task that can be scheduled" << endl;
        cout << "Applications: Project management, CPU scheduling, resource allocation" << endl;
    }
};

int main() {
    TaskScheduling demo;
    demo.demonstrateTaskScheduling();
    
    return 0;
}
```

### 2. 🚛 Vehicle Routing Optimization

```cpp
class VehicleRouting {
private:
    struct Location {
        int id;
        string name;
        double x, y;
        int demand;
        
        Location(int i, string n, double x_coord, double y_coord, int d) 
            : id(i), name(n), x(x_coord), y(y_coord), demand(d) {}
    };
    
    double calculateDistance(const Location& a, const Location& b) {
        double dx = a.x - b.x;
        double dy = a.y - b.y;
        return sqrt(dx * dx + dy * dy);
    }
    
public:
    vector<vector<Location>> optimizeRoutes(vector<Location>& locations, int vehicleCapacity) {
        cout << "🚛 Vehicle Routing Optimization" << endl;
        cout << "===============================" << endl;
        
        cout << "Depot and locations:" << endl;
        for (const auto& loc : locations) {
            cout << "  " << loc.name << " (" << loc.x << ", " << loc.y 
                 << ") demand: " << loc.demand << endl;
        }
        cout << "Vehicle capacity: " << vehicleCapacity << endl;
        
        vector<vector<Location>> routes;
        vector<bool> visited(locations.size(), false);
        visited[0] = true; // Depot is always visited
        
        Location depot = locations[0];
        
        cout << "\nGreedy route construction:" << endl;
        
        while (true) {
            vector<Location> currentRoute;
            currentRoute.push_back(depot);
            
            Location currentLocation = depot;
            int currentLoad = 0;
            bool routeComplete = false;
            
            cout << "\nStarting new route from depot:" << endl;
            
            while (!routeComplete) {
                int nextLocationIndex = -1;
                double minDistance = DBL_MAX;
                
                // Find nearest unvisited location that fits in vehicle
                for (int i = 1; i < locations.size(); i++) {
                    if (!visited[i] && currentLoad + locations[i].demand <= vehicleCapacity) {
                        double distance = calculateDistance(currentLocation, locations[i]);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nextLocationIndex = i;
                        }
                    }
                }
                
                if (nextLocationIndex == -1) {
                    // No more locations can be added to this route
                    currentRoute.push_back(depot); // Return to depot
                    cout << "  Return to depot (route complete)" << endl;
                    routeComplete = true;
                } else {
                    // Add location to route
                    visited[nextLocationIndex] = true;
                    currentLocation = locations[nextLocationIndex];
                    currentLoad += currentLocation.demand;
                    currentRoute.push_back(currentLocation);
                    
                    cout << "  Visit " << currentLocation.name 
                         << " (distance: " << minDistance 
                         << ", load: " << currentLoad << "/" << vehicleCapacity << ")" << endl;
                }
            }
            
            routes.push_back(currentRoute);
            
            // Check if all locations are visited
            bool allVisited = true;
            for (int i = 1; i < locations.size(); i++) {
                if (!visited[i]) {
                    allVisited = false;
                    break;
                }
            }
            
            if (allVisited) break;
        }
        
        return routes;
    }
    
    void demonstrateVehicleRouting() {
        vector<Location> locations = {
            Location(0, "Depot", 0, 0, 0),
            Location(1, "Store A", 2, 3, 10),
            Location(2, "Store B", 5, 1, 15),
            Location(3, "Store C", 3, 6, 12),
            Location(4, "Store D", 7, 4, 8),
            Location(5, "Store E", 1, 5, 20)
        };
        
        int vehicleCapacity = 30;
        
        vector<vector<Location>> routes = optimizeRoutes(locations, vehicleCapacity);
        
        cout << "\n🚛 Optimized Routes:" << endl;
        double totalDistance = 0;
        
        for (int i = 0; i < routes.size(); i++) {
            cout << "\nRoute " << (i + 1) << ": ";
            double routeDistance = 0;
            int routeLoad = 0;
            
            for (int j = 0; j < routes[i].size(); j++) {
                cout << routes[i][j].name;
                if (j < routes[i].size() - 1) {
                    cout << " → ";
                    routeDistance += calculateDistance(routes[i][j], routes[i][j + 1]);
                }
                routeLoad += routes[i][j].demand;
            }
            
            cout << "\n  Distance: " << routeDistance << ", Load: " << routeLoad << endl;
            totalDistance += routeDistance;
        }
        
        cout << "\nTotal distance: " << totalDistance << endl;
        cout << "Number of vehicles used: " << routes.size() << endl;
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(n³) - for each route, find nearest for each position" << endl;
        cout << "Space Complexity: O(n)" << endl;
        cout << "Greedy Choice: Always visit nearest feasible location" << endl;
        cout << "Applications: Delivery services, logistics, supply chain" << endl;
        cout << "Note: This is a heuristic - optimal VRP is NP-hard" << endl;
    }
};

int main() {
    VehicleRouting demo;
    demo.demonstrateVehicleRouting();
    
    return 0;
}
```

---

## Tips, Tricks & Common Pitfalls

### 🎯 Pro Tips for Greedy Algorithms

```cpp
class GreedyTipsAndTricks {
public:
    void demonstrateProTips() {
        cout << "🎯 Pro Tips for Greedy Algorithms" << endl;
        cout << "==================================" << endl;
        cout << endl;
        
        cout << "1. 🔍 PROBLEM IDENTIFICATION:" << endl;
        cout << "   ✅ Look for optimization problems" << endl;
        cout << "   ✅ Check if local optimum = global optimum" << endl;
        cout << "   ✅ Verify no dependencies between choices" << endl;
        cout << "   ✅ Can you define a clear greedy criterion?" << endl;
        cout << endl;
        
        cout << "2. 🎯 GREEDY CHOICE DESIGN:" << endl;
        cout << "   ✅ Choose criterion that maximizes/minimizes objective" << endl;
        cout << "   ✅ Consider multiple criteria (ratio, deadline, etc.)" << endl;
        cout << "   ✅ Sort data to enable greedy selection" << endl;
        cout << "   ✅ Test with small examples first" << endl;
        cout << endl;
        
        cout << "3. 📝 PROOF STRATEGY:" << endl;
        cout << "   ✅ Use exchange argument when possible" << endl;
        cout << "   ✅ Show greedy choice is always safe" << endl;
        cout << "   ✅ Prove optimal substructure" << endl;
        cout << "   ✅ Consider edge cases and counterexamples" << endl;
        cout << endl;
        
        cout << "4. ⚡ IMPLEMENTATION TIPS:" << endl;
        cout << "   ✅ Sort data appropriately" << endl;
        cout << "   ✅ Use efficient data structures (heaps, sets)" << endl;
        cout << "   ✅ Handle edge cases (empty input, single element)" << endl;
        cout << "   ✅ Validate greedy choice at each step" << endl;
    }
    
    void demonstrateCommonMistakes() {
        cout << "\n❌ Common Greedy Algorithm Mistakes" << endl;
        cout << "===================================" << endl;
        cout << endl;
        
        cout << "MISTAKE 1: Assuming Greedy Always Works" << endl;
        cout << "❌ Problem: Using greedy without verification" << endl;
        cout << "✅ Solution: Always prove greedy choice property" << endl;
        cout << "   Example: 0/1 Knapsack - greedy by ratio fails" << endl;
        cout << endl;
        
        cout << "MISTAKE 2: Wrong Greedy Criterion" << endl;
        cout << "❌ Problem: Choosing suboptimal greedy strategy" << endl;
        cout << "✅ Solution: Analyze different criteria carefully" << endl;
        cout << "   Example: Activity selection - sort by start time fails" << endl;
        cout << "   Correct: Sort by end time" << endl;
        cout << endl;
        
        cout << "MISTAKE 3: Ignoring Constraints" << endl;
        cout << "❌ Problem: Making choices that violate constraints" << endl;
        cout << "✅ Solution: Check feasibility before making choice" << endl;
        cout << "   Example: Knapsack - check weight constraint" << endl;
        cout << endl;
        
        cout << "MISTAKE 4: Not Considering All Options" << endl;
        cout << "❌ Problem: Greedy choice too narrow" << endl;
        cout << "✅ Solution: Consider all valid options at each step" << endl;
        cout << "   Example: MST - consider all edges, not just from current vertex" << endl;
        cout << endl;
        
        cout << "MISTAKE 5: Incorrect Sorting" << endl;
        cout << "❌ Problem: Sorting by wrong criterion or direction" << endl;
        cout << "✅ Solution: Carefully analyze what order enables greedy choice" << endl;
        cout << "   Example: Job scheduling - ascending vs descending order matters" << endl;
    }
    
    void demonstrateDebuggingTechniques() {
        cout << "\n🔧 Debugging Greedy Algorithms" << endl;
        cout << "==============================" << endl;
        cout << endl;
        
        cout << "1. TRACE EXECUTION:" << endl;
        cout << "   • Print choices made at each step" << endl;
        cout << "   • Show remaining options" << endl;
        cout << "   • Verify constraints are satisfied" << endl;
        cout << endl;
        
        cout << "2. TEST WITH SMALL EXAMPLES:" << endl;
        cout << "   • Start with 2-3 elements" << endl;
        cout << "   • Manually verify optimal solution" << endl;
        cout << "   • Compare with greedy result" << endl;
        cout << endl;
        
        cout << "3. LOOK FOR COUNTEREXAMPLES:" << endl;
        cout << "   • Try edge cases (empty, single element)" << endl;
        cout << "   • Test with adversarial inputs" << endl;
        cout << "   • Compare with brute force on small inputs" << endl;
        cout << endl;
        
        cout << "4. VERIFY GREEDY PROPERTIES:" << endl;
        cout << "   • Check if greedy choice is always safe" << endl;
        cout << "   • Ensure optimal substructure holds" << endl;
        cout << "   • Look for dependencies between choices" << endl;
        cout << endl;
        
        cout << "5. ALTERNATIVE STRATEGIES:" << endl;
        cout << "   • Try different sorting criteria" << endl;
        cout << "   • Consider multiple greedy approaches" << endl;
        cout << "   • Compare with DP solution if available" << endl;
    }
};

int main() {
    GreedyTipsAndTricks tips;
    tips.demonstrateProTips();
    tips.demonstrateCommonMistakes();
    tips.demonstrateDebuggingTechniques();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Greedy Algorithm Fundamentals
1. **Greedy Choice Property**: Local optimum leads to global optimum
2. **Optimal Substructure**: Problem can be broken into optimal subproblems
3. **Irrevocable Decisions**: Never reconsider previous choices
4. **Fast Execution**: Usually O(n log n) due to sorting

### When Greedy Works
✅ **Perfect for**:
- Activity/interval selection
- Minimum spanning trees
- Huffman coding
- Fractional knapsack
- Some scheduling problems
- Shortest path (Dijkstra)

❌ **Fails for**:
- 0/1 knapsack
- Longest path problems
- Some coin change systems
- Traveling salesman problem

### Proof Techniques
1. **Exchange Argument**: Show greedy choice can replace any choice in optimal solution
2. **Cut Property**: For MST, minimum weight edge across cut is safe
3. **Optimal Substructure**: After greedy choice, remaining problem has same structure
4. **Induction**: Prove correctness step by step

### Real-World Applications
1. **📅 Scheduling**: Task scheduling, CPU scheduling, meeting rooms
2. **🌐 Networks**: Routing protocols, network design, bandwidth allocation
3. **🚛 Logistics**: Vehicle routing, delivery optimization, warehouse management
4. **💰 Finance**: Portfolio optimization, trading strategies, resource allocation
5. **🗜️ Compression**: Data compression, encoding schemes, file optimization

---

## 🚀 What's Next?

Excellent! You've mastered Greedy Algorithms and understand when local optimization leads to global solutions. You now know:
- **Greedy Fundamentals**: Choice property, optimal substructure, and when greedy works
- **Classic Problems**: Activity selection, fractional knapsack, MST, Huffman coding
- **Proof Techniques**: Exchange arguments and correctness verification
- **Real Applications**: Scheduling, routing, and optimization in various domains

Next, let's explore [Backtracking](05_Algorithms/18_Backtracking.md) - the systematic approach to exploring all possible solutions by trying and undoing choices!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Activity selection, fractional knapsack, minimum coins (standard system)
2. **Medium**: Job scheduling, minimum spanning tree, gas station problem
3. **Hard**: Interval scheduling maximization, minimum number of platforms

### Interview Tips
1. **Identify the pattern**: Is this an optimization problem where local choices work?
2. **Define greedy criterion**: What makes a choice "greedy"?
3. **Prove correctness**: Can you show greedy choice is always safe?
4. **Consider alternatives**: What if greedy doesn't work? (Think DP)
5. **Handle edge cases**: Empty input, single element, impossible cases

### Common Greedy Patterns
1. **Sorting-based**: Sort by some criterion, then make greedy choices
2. **Priority-based**: Use heap/priority queue for dynamic greedy selection
3. **Interval problems**: Sort by start/end time, select non-overlapping
4. **Graph problems**: MST, shortest path with specific properties
5. **Resource allocation**: Maximize/minimize usage under constraints

**Remember: Greedy algorithms are like being a smart cashier - make the best local choice at each step, and trust it leads to the best global outcome!** 💰
