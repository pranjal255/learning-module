# Graphs - Networks and Relationships (Like Social Media Connections)

## 🌟 Real-World Story: The Social Network

Imagine you're building a social media platform like Facebook! 👥

**The Challenge**: How do you represent friendships and connections between millions of users?

**Traditional Approach (Lists)**:
```
Alice's friends: [Bob, Charlie, Diana]
Bob's friends: [Alice, Eve, Frank]
Charlie's friends: [Alice, Diana]
...
Problem: Hard to find mutual friends, shortest connection paths, etc.
```

**Graph Approach (Network of Connections)**:
```
    Alice ——————— Bob
     |  \         |
     |   \        |
     |    \       |
  Charlie ——— Diana ——— Eve
     |              |
     |              |
   Frank ————————— Grace
```

**The Graph Magic**:
- **Vertices (Nodes)**: People in the network (Alice, Bob, Charlie...)
- **Edges**: Friendships/connections between people
- **Paths**: Ways to get from one person to another through mutual friends
- **Algorithms**: Find shortest path, mutual friends, friend suggestions, etc.

This is exactly how a **Graph** works! It's a data structure that:
- Represents **relationships** between entities
- Consists of **vertices (nodes)** and **edges (connections)**
- Models **networks** like social media, maps, internet, etc.
- Enables powerful **algorithms** for pathfinding, connectivity, and optimization

## 🎯 What You'll Learn
- Understanding graphs through social networks and map analogies
- Different types of graphs and their representations
- Graph traversal algorithms (DFS, BFS)
- Real-world applications and implementations

---

## 📝 Table of Contents
1. [Why Graphs Matter](#why-graphs-matter)
2. [Graph Types and Terminology](#graph-types-and-terminology)
3. [Graph Representations](#graph-representations)
4. [Graph Traversal Algorithms](#graph-traversal-algorithms)
5. [Common Graph Algorithms](#common-graph-algorithms)
6. [Real-World Applications](#real-world-applications)
7. [Practice Problems](#practice-problems)

---

## Why Graphs Matter

### 🗺️ The GPS Navigation Problem

**Scenario**: You're building a GPS navigation system.

**The Map as a Graph**:
```
Cities = Vertices
Roads = Edges
Distance = Edge Weights

    Seattle ——————— Portland
      |               |
      |               |
   San Francisco ——— Los Angeles
      |               |
      |               |
    Phoenix ——————— Denver
```

**Graph Algorithms Enable**:
- **Shortest Path**: Find fastest route from Seattle to Denver
- **Alternative Routes**: Find multiple paths in case of traffic
- **Network Analysis**: Identify important intersections
- **Route Optimization**: Plan efficient delivery routes

### 🌐 The Internet Connection Problem

**The Internet as a Graph**:
```
Routers = Vertices
Network Links = Edges
Bandwidth = Edge Weights

Router A ——— Router B ——— Router C
    |           |           |
    |           |           |
Router D ——— Router E ——— Router F
```

**Applications**:
- **Packet Routing**: Find best path for data transmission
- **Network Reliability**: Identify critical connection points
- **Load Balancing**: Distribute traffic efficiently
- **Fault Tolerance**: Find alternative paths when links fail

### 🎬 The Movie Recommendation Problem

**Movies and Actors as a Graph**:
```
Movies = Vertices
Shared Actors = Edges

"Avengers" ——— "Iron Man" ——— "Sherlock Holmes"
     |             |              |
     |             |              |
"Thor" ——————— "Doctor Strange" ——— "The Imitation Game"
```

**Graph Analysis Enables**:
- **Recommendations**: "If you liked Iron Man, try Doctor Strange"
- **Actor Connections**: Six degrees of Kevin Bacon
- **Genre Clustering**: Group similar movies
- **Influence Analysis**: Find most connected actors

---

## Graph Types and Terminology

### 📊 Basic Graph Concepts

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class GraphConcepts {
public:
    void explainGraphTerminology() {
        cout << "📊 Graph Terminology (Social Network Style)" << endl;
        cout << "===========================================" << endl;
        cout << endl;
        
        cout << "👤 VERTEX (NODE): A person in the network" << endl;
        cout << "   Example: Alice, Bob, Charlie" << endl;
        cout << endl;
        
        cout << "🔗 EDGE: A friendship/connection between two people" << endl;
        cout << "   Example: Alice ↔ Bob (they are friends)" << endl;
        cout << endl;
        
        cout << "📏 DEGREE: Number of friends a person has" << endl;
        cout << "   Example: If Alice is friends with Bob, Charlie, Diana → degree = 3" << endl;
        cout << endl;
        
        cout << "🛤️ PATH: A sequence of friendships connecting two people" << endl;
        cout << "   Example: Alice → Bob → Eve → Frank" << endl;
        cout << endl;
        
        cout << "🔄 CYCLE: A path that starts and ends at the same person" << endl;
        cout << "   Example: Alice → Bob → Charlie → Alice" << endl;
        cout << endl;
        
        cout << "🌐 CONNECTED: Two people can reach each other through friendships" << endl;
        cout << "   Example: Alice can reach Frank through mutual friends" << endl;
        cout << endl;
        
        cout << "⚖️ WEIGHTED: Friendships have strength/distance values" << endl;
        cout << "   Example: Alice ↔ Bob (close friends: weight 1)" << endl;
        cout << "           Alice ↔ Charlie (acquaintances: weight 5)" << endl;
    }
    
    void demonstrateGraphTypes() {
        cout << "\n🔍 Types of Graphs" << endl;
        cout << "==================" << endl;
        cout << endl;
        
        cout << "1️⃣ UNDIRECTED GRAPH (Mutual Friendships):" << endl;
        cout << "   Alice ↔ Bob (if Alice is Bob's friend, Bob is Alice's friend)" << endl;
        cout << "   Example: Facebook friendships" << endl;
        cout << endl;
        
        cout << "2️⃣ DIRECTED GRAPH (One-way Relationships):" << endl;
        cout << "   Alice → Bob (Alice follows Bob, but Bob doesn't follow Alice)" << endl;
        cout << "   Example: Twitter follows, Instagram follows" << endl;
        cout << endl;
        
        cout << "3️⃣ WEIGHTED GRAPH (Relationships with Strength):" << endl;
        cout << "   Alice ↔ Bob (weight: 10 - best friends)" << endl;
        cout << "   Alice ↔ Charlie (weight: 3 - acquaintances)" << endl;
        cout << "   Example: LinkedIn connection strength" << endl;
        cout << endl;
        
        cout << "4️⃣ UNWEIGHTED GRAPH (Simple Connections):" << endl;
        cout << "   Alice ↔ Bob (either friends or not, no strength measure)" << endl;
        cout << "   Example: Simple friendship networks" << endl;
    }
};

int main() {
    GraphConcepts concepts;
    concepts.explainGraphTerminology();
    concepts.demonstrateGraphTypes();
    
    return 0;
}
```

### 🎨 Visual Graph Examples

```
UNDIRECTED GRAPH (Social Network):
    A ——— B
    |     |
    |     |
    C ——— D

DIRECTED GRAPH (Twitter Follows):
    A ——→ B
    ↑     ↓
    |     |
    C ←—— D

WEIGHTED GRAPH (Road Network):
    A —5— B
    |     |
   3|     |7
    |     |
    C —2— D
```

---

## Graph Representations

### 📋 Adjacency List (Most Common)

Like keeping a contact list for each person:

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <unordered_map>
#include <string>
using namespace std;

class SocialNetworkAdjList {
private:
    unordered_map<string, list<string>> friendships;
    
public:
    void addPerson(string person) {
        if (friendships.find(person) == friendships.end()) {
            friendships[person] = list<string>();
            cout << "👤 Added " << person << " to the network" << endl;
        }
    }
    
    void addFriendship(string person1, string person2) {
        // Add both people if they don't exist
        addPerson(person1);
        addPerson(person2);
        
        // Add mutual friendship (undirected graph)
        friendships[person1].push_back(person2);
        friendships[person2].push_back(person1);
        
        cout << "🤝 " << person1 << " and " << person2 << " are now friends!" << endl;
    }
    
    void displayNetwork() {
        cout << "\n📱 Social Network (Adjacency List):" << endl;
        cout << "===================================" << endl;
        
        for (auto& person : friendships) {
            cout << person.first << "'s friends: ";
            
            if (person.second.empty()) {
                cout << "(no friends yet)";
            } else {
                bool first = true;
                for (string friend_name : person.second) {
                    if (!first) cout << ", ";
                    cout << friend_name;
                    first = false;
                }
            }
            cout << endl;
        }
    }
    
    void showMutualFriends(string person1, string person2) {
        cout << "\n👥 Finding mutual friends of " << person1 << " and " << person2 << ":" << endl;
        
        vector<string> mutual;
        
        for (string friend1 : friendships[person1]) {
            for (string friend2 : friendships[person2]) {
                if (friend1 == friend2) {
                    mutual.push_back(friend1);
                }
            }
        }
        
        if (mutual.empty()) {
            cout << "   No mutual friends found" << endl;
        } else {
            cout << "   Mutual friends: ";
            for (int i = 0; i < mutual.size(); i++) {
                cout << mutual[i];
                if (i < mutual.size() - 1) cout << ", ";
            }
            cout << endl;
        }
    }
    
    int getFriendCount(string person) {
        return friendships[person].size();
    }
    
    void showPopularPeople() {
        cout << "\n🌟 Most Popular People:" << endl;
        cout << "======================" << endl;
        
        for (auto& person : friendships) {
            int friendCount = person.second.size();
            cout << person.first << ": " << friendCount << " friends";
            
            if (friendCount >= 4) {
                cout << " 🌟 (Very Popular!)";
            } else if (friendCount >= 2) {
                cout << " 😊 (Popular)";
            }
            cout << endl;
        }
    }
};

int main() {
    SocialNetworkAdjList network;
    
    cout << "📱 Building Social Network with Adjacency List" << endl;
    cout << "===============================================" << endl;
    
    // Add friendships
    network.addFriendship("Alice", "Bob");
    network.addFriendship("Alice", "Charlie");
    network.addFriendship("Bob", "Diana");
    network.addFriendship("Charlie", "Diana");
    network.addFriendship("Diana", "Eve");
    network.addFriendship("Eve", "Frank");
    network.addFriendship("Alice", "Frank");
    
    // Display the network
    network.displayNetwork();
    
    // Find mutual friends
    network.showMutualFriends("Alice", "Diana");
    network.showMutualFriends("Bob", "Charlie");
    
    // Show popularity
    network.showPopularPeople();
    
    return 0;
}
```

### 📊 Adjacency Matrix (For Dense Graphs)

Like a friendship table with checkmarks:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class SocialNetworkAdjMatrix {
private:
    vector<vector<int>> matrix;
    unordered_map<string, int> personToIndex;
    vector<string> indexToPerson;
    int numPeople;
    
public:
    SocialNetworkAdjMatrix(int maxPeople = 10) {
        numPeople = 0;
        matrix.resize(maxPeople, vector<int>(maxPeople, 0));
        indexToPerson.resize(maxPeople);
        
        cout << "📊 Created social network with adjacency matrix (max: " 
             << maxPeople << " people)" << endl;
    }
    
    void addPerson(string person) {
        if (personToIndex.find(person) == personToIndex.end()) {
            personToIndex[person] = numPeople;
            indexToPerson[numPeople] = person;
            numPeople++;
            cout << "👤 Added " << person << " (index: " << numPeople - 1 << ")" << endl;
        }
    }
    
    void addFriendship(string person1, string person2) {
        addPerson(person1);
        addPerson(person2);
        
        int index1 = personToIndex[person1];
        int index2 = personToIndex[person2];
        
        // Mark as friends (undirected graph)
        matrix[index1][index2] = 1;
        matrix[index2][index1] = 1;
        
        cout << "🤝 " << person1 << " and " << person2 << " are now friends!" << endl;
    }
    
    void displayMatrix() {
        cout << "\n📊 Friendship Matrix:" << endl;
        cout << "=====================" << endl;
        
        // Print header
        cout << "     ";
        for (int i = 0; i < numPeople; i++) {
            cout << indexToPerson[i].substr(0, 3) << " ";
        }
        cout << endl;
        
        // Print matrix
        for (int i = 0; i < numPeople; i++) {
            cout << indexToPerson[i].substr(0, 3) << "  ";
            for (int j = 0; j < numPeople; j++) {
                cout << " " << matrix[i][j] << "  ";
            }
            cout << endl;
        }
        
        cout << "\n1 = Friends, 0 = Not friends" << endl;
    }
    
    bool areFriends(string person1, string person2) {
        if (personToIndex.find(person1) == personToIndex.end() ||
            personToIndex.find(person2) == personToIndex.end()) {
            return false;
        }
        
        int index1 = personToIndex[person1];
        int index2 = personToIndex[person2];
        
        return matrix[index1][index2] == 1;
    }
    
    void checkFriendships() {
        cout << "\n🔍 Friendship Checks:" << endl;
        cout << "====================" << endl;
        
        vector<pair<string, string>> checks = {
            {"Alice", "Bob"}, {"Alice", "Eve"}, {"Charlie", "Diana"}
        };
        
        for (auto& check : checks) {
            bool friends = areFriends(check.first, check.second);
            cout << check.first << " and " << check.second << ": " 
                 << (friends ? "Friends ✅" : "Not friends ❌") << endl;
        }
    }
    
    void analyzeConnections() {
        cout << "\n📈 Connection Analysis:" << endl;
        cout << "======================" << endl;
        
        for (int i = 0; i < numPeople; i++) {
            int friendCount = 0;
            for (int j = 0; j < numPeople; j++) {
                if (i != j && matrix[i][j] == 1) {
                    friendCount++;
                }
            }
            cout << indexToPerson[i] << ": " << friendCount << " friends" << endl;
        }
    }
};

int main() {
    SocialNetworkAdjMatrix network;
    
    cout << "\n📊 Building Social Network with Adjacency Matrix" << endl;
    cout << "=================================================" << endl;
    
    // Add friendships
    network.addFriendship("Alice", "Bob");
    network.addFriendship("Alice", "Charlie");
    network.addFriendship("Bob", "Diana");
    network.addFriendship("Charlie", "Diana");
    network.addFriendship("Diana", "Eve");
    
    // Display matrix
    network.displayMatrix();
    
    // Check specific friendships
    network.checkFriendships();
    
    // Analyze connections
    network.analyzeConnections();
    
    return 0;
}
```

### 🔄 Adjacency List vs Matrix Comparison

| Aspect | Adjacency List | Adjacency Matrix |
|--------|----------------|------------------|
| **Space** | O(V + E) | O(V²) |
| **Add Edge** | O(1) | O(1) |
| **Check Edge** | O(degree) | O(1) |
| **Best For** | Sparse graphs | Dense graphs |
| **Memory** | Less for sparse | More but predictable |

---

## Graph Traversal Algorithms

### 🔍 Depth-First Search (DFS) - Like Exploring a Maze

DFS is like exploring a maze by going as deep as possible before backtracking:

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <stack>
using namespace std;

class GraphDFS {
private:
    unordered_map<string, vector<string>> graph;
    
public:
    void addEdge(string from, string to) {
        graph[from].push_back(to);
        graph[to].push_back(from); // Undirected graph
    }
    
    // Recursive DFS
    void dfsRecursive(string start, unordered_set<string>& visited) {
        visited.insert(start);
        cout << "🔍 Visiting: " << start << endl;
        
        for (string neighbor : graph[start]) {
            if (visited.find(neighbor) == visited.end()) {
                cout << "   Going deeper from " << start << " to " << neighbor << endl;
                dfsRecursive(neighbor, visited);
                cout << "   Backtracking to " << start << endl;
            }
        }
    }
    
    // Iterative DFS using stack
    void dfsIterative(string start) {
        unordered_set<string> visited;
        stack<string> stack;
        
        stack.push(start);
        cout << "\n🔄 DFS Iterative Traversal:" << endl;
        cout << "===========================" << endl;
        
        while (!stack.empty()) {
            string current = stack.top();
            stack.pop();
            
            if (visited.find(current) == visited.end()) {
                visited.insert(current);
                cout << "🔍 Visiting: " << current << endl;
                
                // Add neighbors to stack (in reverse order for consistent traversal)
                for (int i = graph[current].size() - 1; i >= 0; i--) {
                    string neighbor = graph[current][i];
                    if (visited.find(neighbor) == visited.end()) {
                        stack.push(neighbor);
                        cout << "   Added " << neighbor << " to stack" << endl;
                    }
                }
            }
        }
    }
    
    // Find path between two nodes using DFS
    bool findPath(string start, string target, vector<string>& path, 
                  unordered_set<string>& visited) {
        visited.insert(start);
        path.push_back(start);
        
        if (start == target) {
            return true; // Found target
        }
        
        for (string neighbor : graph[start]) {
            if (visited.find(neighbor) == visited.end()) {
                if (findPath(neighbor, target, path, visited)) {
                    return true; // Path found through this neighbor
                }
            }
        }
        
        path.pop_back(); // Backtrack
        return false;
    }
    
    void demonstrateDFS() {
        cout << "🔍 Depth-First Search (DFS) Demo" << endl;
        cout << "================================" << endl;
        cout << "Graph: A—B—D" << endl;
        cout << "       |   |" << endl;
        cout << "       C—E—F" << endl;
        cout << endl;
        
        // Build graph
        addEdge("A", "B");
        addEdge("A", "C");
        addEdge("B", "D");
        addEdge("C", "E");
        addEdge("D", "F");
        addEdge("E", "F");
        
        // Recursive DFS
        cout << "🌊 DFS Recursive Traversal:" << endl;
        cout << "===========================" << endl;
        unordered_set<string> visited;
        dfsRecursive("A", visited);
        
        // Iterative DFS
        dfsIterative("A");
        
        // Find path
        cout << "\n🛤️ Finding path from A to F:" << endl;
        cout << "=============================" << endl;
        vector<string> path;
        unordered_set<string> pathVisited;
        
        if (findPath("A", "F", path, pathVisited)) {
            cout << "✅ Path found: ";
            for (int i = 0; i < path.size(); i++) {
                cout << path[i];
                if (i < path.size() - 1) cout << " → ";
            }
            cout << endl;
        } else {
            cout << "❌ No path found" << endl;
        }
    }
};

int main() {
    GraphDFS dfsDemo;
    dfsDemo.demonstrateDFS();
    
    return 0;
}
```

### 🌊 Breadth-First Search (BFS) - Like Ripples in Water

BFS is like ripples spreading in water, exploring all neighbors before going deeper:

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class GraphBFS {
private:
    unordered_map<string, vector<string>> graph;
    
public:
    void addEdge(string from, string to) {
        graph[from].push_back(to);
        graph[to].push_back(from); // Undirected graph
    }
    
    void bfsTraversal(string start) {
        unordered_set<string> visited;
        queue<string> queue;
        
        queue.push(start);
        visited.insert(start);
        
        cout << "🌊 BFS Traversal (level by level):" << endl;
        cout << "==================================" << endl;
        
        int level = 0;
        while (!queue.empty()) {
            int levelSize = queue.size();
            cout << "Level " << level << ": ";
            
            for (int i = 0; i < levelSize; i++) {
                string current = queue.front();
                queue.pop();
                
                cout << current << " ";
                
                // Add unvisited neighbors
                for (string neighbor : graph[current]) {
                    if (visited.find(neighbor) == visited.end()) {
                        visited.insert(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            cout << endl;
            level++;
        }
    }
    
    // Find shortest path using BFS
    vector<string> findShortestPath(string start, string target) {
        unordered_set<string> visited;
        queue<vector<string>> queue; // Queue of paths
        
        queue.push({start});
        visited.insert(start);
        
        cout << "\n🎯 Finding shortest path from " << start << " to " << target << ":" << endl;
        cout << "=============================================================" << endl;
        
        while (!queue.empty()) {
            vector<string> currentPath = queue.front();
            queue.pop();
            
            string currentNode = currentPath.back();
            
            cout << "Exploring path: ";
            for (int i = 0; i < currentPath.size(); i++) {
                cout << currentPath[i];
                if (i < currentPath.size() - 1) cout << " → ";
            }
            cout << endl;
            
            if (currentNode == target) {
                cout << "✅ Shortest path found!" << endl;
                return currentPath;
            }
            
            for (string neighbor : graph[currentNode]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    vector<string> newPath = currentPath;
                    newPath.push_back(neighbor);
                    queue.push(newPath);
                }
            }
        }
        
        cout << "❌ No path found" << endl;
        return {};
    }
    
    // Check if graph is connected
    bool isConnected() {
        if (graph.empty()) return true;
        
        string startNode = graph.begin()->first;
        unordered_set<string> visited;
        queue<string> queue;
        
        queue.push(startNode);
        visited.insert(startNode);
        
        while (!queue.empty()) {
            string current = queue.front();
            queue.pop();
            
            for (string neighbor : graph[current]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        // Check if all nodes were visited
        for (auto& node : graph) {
            if (visited.find(node.first) == visited.end()) {
                return false;
            }
        }
        
        return true;
    }
    
    void demonstrateBFS() {
        cout << "🌊 Breadth-First Search (BFS) Demo" << endl;
        cout << "==================================" << endl;
        cout << "Social Network:" << endl;
        cout << "Alice—Bob—Diana" << endl;
        cout << "  |     |    |" << endl;
        cout << "Charlie—Eve—Frank" << endl;
        cout << endl;
        
        // Build social network
        addEdge("Alice", "Bob");
        addEdge("Alice", "Charlie");
        addEdge("Bob", "Diana");
        addEdge("Bob", "Eve");
        addEdge("Charlie", "Eve");
        addEdge("Diana", "Frank");
        addEdge("Eve", "Frank");
        
        // BFS traversal
        bfsTraversal("Alice");
        
        // Find shortest path
        vector<string> path = findShortestPath("Alice", "Frank");
        if (!path.empty()) {
            cout << "Shortest connection: ";
            for (int i = 0; i < path.size(); i++) {
                cout << path[i];
                if (i < path.size() - 1) cout << " → ";
            }
            cout << " (" << path.size() - 1 << " degrees of separation)" << endl;
        }
        
        // Check connectivity
        cout << "\n🔗 Network connectivity: " 
             << (isConnected() ? "All people are connected ✅" : "Network is fragmented ❌") 
             << endl;
    }
};

int main() {
    GraphBFS bfsDemo;
    bfsDemo.demonstrateBFS();
    
    return 0;
}
```

### 🔄 DFS vs BFS Comparison

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Strategy** | Go deep first | Go wide first |
| **Data Structure** | Stack (recursion) | Queue |
| **Memory** | O(h) height | O(w) width |
| **Shortest Path** | No guarantee | Guaranteed |
| **Use Cases** | Cycle detection, topological sort | Shortest path, level-order |

---

## Common Graph Algorithms

### 🛤️ Shortest Path Algorithms

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <climits>
using namespace std;

struct Edge {
    string destination;
    int weight;
    
    Edge(string dest, int w) : destination(dest), weight(w) {}
};

class WeightedGraph {
private:
    unordered_map<string, vector<Edge>> graph;
    
public:
    void addEdge(string from, string to, int weight) {
        graph[from].push_back(Edge(to, weight));
        graph[to].push_back(Edge(from, weight)); // Undirected
        
        cout << "🛣️ Added road: " << from << " ↔ " << to 
             << " (distance: " << weight << " km)" << endl;
    }
    
    // Dijkstra's Algorithm for shortest path
    unordered_map<string, int> dijkstra(string start) {
        unordered_map<string, int> distances;
        unordered_map<string, string> previous;
        
        // Initialize distances
        for (auto& node : graph) {
            distances[node.first] = INT_MAX;
        }
        distances[start] = 0;
        
        // Priority queue: {distance, node}
        priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
        pq.push({0, start});
        
        cout << "\n🗺️ Dijkstra's Algorithm from " << start << ":" << endl;
        cout << "=========================================" << endl;
        
        while (!pq.empty()) {
            int currentDist = pq.top().first;
            string currentNode = pq.top().second;
            pq.pop();
            
            if (currentDist > distances[currentNode]) continue;
            
            cout << "Processing " << currentNode << " (distance: " << currentDist << ")" << endl;
            
            for (Edge& edge : graph[currentNode]) {
                int newDist = currentDist + edge.weight;
                
                if (newDist < distances[edge.destination]) {
                    distances[edge.destination] = newDist;
                    previous[edge.destination] = currentNode;
                    pq.push({newDist, edge.destination});
                    
                    cout << "  Updated " << edge.destination 
                         << " distance to " << newDist << endl;
                }
            }
        }
        
        return distances;
    }
    
    void demonstrateShortestPath() {
        cout << "🗺️ GPS Navigation System" << endl;
        cout << "========================" << endl;
        
        // Build road network
        addEdge("Seattle", "Portland", 173);
        addEdge("Seattle", "San Francisco", 808);
        addEdge("Portland", "San Francisco", 635);
        addEdge("San Francisco", "Los Angeles", 383);
        addEdge("Los Angeles", "Phoenix", 372);
        addEdge("Phoenix", "Denver", 602);
        addEdge("Los Angeles", "Denver", 1015);
        
        // Find shortest distances from Seattle
        auto distances = dijkstra("Seattle");
        
        cout << "\n📍 Shortest distances from Seattle:" << endl;
        cout << "====================================" << endl;
        for (auto& dist : distances) {
            if (dist.second != INT_MAX) {
                cout << "Seattle → " << dist.first << ": " << dist.second << " km" << endl;
            }
        }
    }
};

int main() {
    WeightedGraph gps;
    gps.demonstrateShortestPath();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🌐 Social Media Friend Suggestions

```cpp
#include <iostream>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

class SocialMediaNetwork {
private:
    unordered_map<string, unordered_set<string>> friendships;
    
public:
    void addFriendship(string person1, string person2) {
        friendships[person1].insert(person2);
        friendships[person2].insert(person1);
        cout << "🤝 " << person1 << " and " << person2 << " are now friends!" << endl;
    }
    
    vector<pair<string, int>> suggestFriends(string person) {
        unordered_map<string, int> suggestions;
        
        cout << "\n💡 Generating friend suggestions for " << person << ":" << endl;
        cout << "=================================================" << endl;
        
        // Look at friends of friends
        for (string friend_name : friendships[person]) {
            cout << "Checking " << friend_name << "'s friends..." << endl;
            
            for (string friendOfFriend : friendships[friend_name]) {
                // Don't suggest themselves or existing friends
                if (friendOfFriend != person && 
                    friendships[person].find(friendOfFriend) == friendships[person].end()) {
                    
                    suggestions[friendOfFriend]++;
                    cout << "  " << friendOfFriend << " (mutual friends: " 
                         << suggestions[friendOfFriend] << ")" << endl;
                }
            }
        }
        
        // Convert to vector and sort by mutual friend count
        vector<pair<string, int>> sortedSuggestions;
        for (auto& suggestion : suggestions) {
            sortedSuggestions.push_back(suggestion);
        }
        
        sort(sortedSuggestions.begin(), sortedSuggestions.end(),
             [](const pair<string, int>& a, const pair<string, int>& b) {
                 return a.second > b.second;
             });
        
        return sortedSuggestions;
    }
    
    void displaySuggestions(string person) {
        auto suggestions = suggestFriends(person);
        
        cout << "\n🎯 Top friend suggestions for " << person << ":" << endl;
        cout << "=============================================" << endl;
        
        if (suggestions.empty()) {
            cout << "No suggestions available" << endl;
        } else {
            for (int i = 0; i < min(5, (int)suggestions.size()); i++) {
                cout << (i + 1) << ". " << suggestions[i].first 
                     << " (" << suggestions[i].second << " mutual friends)" << endl;
            }
        }
    }
    
    void analyzeNetwork() {
        cout << "\n📊 Network Analysis:" << endl;
        cout << "===================" << endl;
        
        for (auto& person : friendships) {
            cout << person.first << ": " << person.second.size() << " friends" << endl;
        }
    }
};

int main() {
    SocialMediaNetwork network;
    
    cout << "🌐 Social Media Friend Suggestion System" << endl;
    cout << "========================================" << endl;
    
    // Build social network
    network.addFriendship("Alice", "Bob");
    network.addFriendship("Alice", "Charlie");
    network.addFriendship("Bob", "Diana");
    network.addFriendship("Bob", "Eve");
    network.addFriendship("Charlie", "Diana");
    network.addFriendship("Diana", "Frank");
    network.addFriendship("Eve", "Frank");
    network.addFriendship("Frank", "Grace");
    
    // Generate suggestions
    network.displaySuggestions("Alice");
    network.displaySuggestions("Grace");
    
    // Network analysis
    network.analyzeNetwork();
    
    return 0;
}
```

### 2. 🚗 Route Planning System

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

struct Road {
    string destination;
    int distance;
    int trafficLevel; // 1-5, 5 being heavy traffic
    
    Road(string dest, int dist, int traffic) 
        : destination(dest), distance(dist), trafficLevel(traffic) {}
    
    int getTravelTime() const {
        return distance * trafficLevel; // Simple traffic model
    }
};

class RouteNavigator {
private:
    unordered_map<string, vector<Road>> cityMap;
    
public:
    void addRoad(string from, string to, int distance, int traffic = 1) {
        cityMap[from].push_back(Road(to, distance, traffic));
        cityMap[to].push_back(Road(from, distance, traffic));
        
        cout << "🛣️ Added road: " << from << " ↔ " << to 
             << " (" << distance << "km, traffic level: " << traffic << ")" << endl;
    }
    
    void updateTraffic(string from, string to, int newTrafficLevel) {
        for (auto& road : cityMap[from]) {
            if (road.destination == to) {
                road.trafficLevel = newTrafficLevel;
                break;
            }
        }
        
        for (auto& road : cityMap[to]) {
            if (road.destination == from) {
                road.trafficLevel = newTrafficLevel;
                break;
            }
        }
        
        cout << "🚦 Updated traffic on " << from << " ↔ " << to 
             << " to level " << newTrafficLevel << endl;
    }
    
    vector<string> findFastestRoute(string start, string destination) {
        unordered_map<string, int> travelTimes;
        unordered_map<string, string> previous;
        
        // Initialize travel times
        for (auto& city : cityMap) {
            travelTimes[city.first] = INT_MAX;
        }
        travelTimes[start] = 0;
        
        // Priority queue: {travel_time, city}
        priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
        pq.push({0, start});
        
        cout << "\n🗺️ Finding fastest route from " << start << " to " << destination << ":" << endl;
        cout << "=================================================================" << endl;
        
        while (!pq.empty()) {
            int currentTime = pq.top().first;
            string currentCity = pq.top().second;
            pq.pop();
            
            if (currentTime > travelTimes[currentCity]) continue;
            
            cout << "Processing " << currentCity << " (travel time: " << currentTime << ")" << endl;
            
            for (Road& road : cityMap[currentCity]) {
                int newTime = currentTime + road.getTravelTime();
                
                if (newTime < travelTimes[road.destination]) {
                    travelTimes[road.destination] = newTime;
                    previous[road.destination] = currentCity;
                    pq.push({newTime, road.destination});
                    
                    cout << "  Updated " << road.destination 
                         << " travel time to " << newTime << endl;
                }
            }
        }
        
        // Reconstruct path
        vector<string> path;
        string current = destination;
        
        while (current != start) {
            path.push_back(current);
            current = previous[current];
        }
        path.push_back(start);
        
        reverse(path.begin(), path.end());
        return path;
    }
    
    void demonstrateNavigation() {
        cout << "🚗 GPS Route Planning System" << endl;
        cout << "============================" << endl;
        
        // Build city road network
        addRoad("Downtown", "Airport", 25, 3);
        addRoad("Downtown", "Mall", 15, 4);
        addRoad("Downtown", "University", 20, 2);
        addRoad("Airport", "Mall", 30, 1);
        addRoad("Mall", "University", 10, 2);
        addRoad("University", "Hospital", 12, 1);
        addRoad("Hospital", "Airport", 35, 2);
        
        // Find initial route
        vector<string> route = findFastestRoute("Downtown", "Hospital");
        
        cout << "\n🎯 Fastest route found:" << endl;
        cout << "======================" << endl;
        for (int i = 0; i < route.size(); i++) {
            cout << route[i];
            if (i < route.size() - 1) cout << " → ";
        }
        cout << endl;
        
        // Simulate traffic update
        cout << "\n🚦 Traffic update: Heavy traffic on Downtown ↔ Mall" << endl;
        updateTraffic("Downtown", "Mall", 5);
        
        // Find new route
        vector<string> newRoute = findFastestRoute("Downtown", "Hospital");
        
        cout << "\n🔄 Updated fastest route:" << endl;
        cout << "========================" << endl;
        for (int i = 0; i < newRoute.size(); i++) {
            cout << newRoute[i];
            if (i < newRoute.size() - 1) cout << " → ";
        }
        cout << endl;
    }
};

int main() {
    RouteNavigator navigator;
    navigator.demonstrateNavigation();
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🔍 Graph Connectivity

**Story**: You're analyzing a computer network to ensure all computers can communicate with each other.

```cpp
#include <iostream>
#include <unordered_map>
#include <unordered_set>
#include <vector>
using namespace std;

class NetworkConnectivity {
private:
    unordered_map<string, vector<string>> network;
    
public:
    void addConnection(string computer1, string computer2) {
        network[computer1].push_back(computer2);
        network[computer2].push_back(computer1);
        cout << "🔗 Connected " << computer1 << " ↔ " << computer2 << endl;
    }
    
    bool isConnected() {
        if (network.empty()) return true;
        
        // Start DFS from any computer
        string startComputer = network.begin()->first;
        unordered_set<string> visited;
        
        dfs(startComputer, visited);
        
        // Check if all computers were visited
        return visited.size() == network.size();
    }
    
    void dfs(string computer, unordered_set<string>& visited) {
        visited.insert(computer);
        
        for (string neighbor : network[computer]) {
            if (visited.find(neighbor) == visited.end()) {
                dfs(neighbor, visited);
            }
        }
    }
    
    vector<vector<string>> findConnectedComponents() {
        unordered_set<string> visited;
        vector<vector<string>> components;
        
        for (auto& computer : network) {
            if (visited.find(computer.first) == visited.end()) {
                vector<string> component;
                dfsComponent(computer.first, visited, component);
                components.push_back(component);
            }
        }
        
        return components;
    }
    
    void dfsComponent(string computer, unordered_set<string>& visited, vector<string>& component) {
        visited.insert(computer);
        component.push_back(computer);
        
        for (string neighbor : network[computer]) {
            if (visited.find(neighbor) == visited.end()) {
                dfsComponent(neighbor, visited, component);
            }
        }
    }
    
    void analyzeNetwork() {
        cout << "\n🔍 Network Connectivity Analysis" << endl;
        cout << "================================" << endl;
        
        bool connected = isConnected();
        cout << "Network status: " << (connected ? "Fully Connected ✅" : "Fragmented ❌") << endl;
        
        if (!connected) {
            auto components = findConnectedComponents();
            cout << "\nSeparate network segments:" << endl;
            
            for (int i = 0; i < components.size(); i++) {
                cout << "Segment " << (i + 1) << ": ";
                for (int j = 0; j < components[i].size(); j++) {
                    cout << components[i][j];
                    if (j < components[i].size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
    }
};

int main() {
    NetworkConnectivity network;
    
    cout << "🖥️ Computer Network Connectivity Analysis" << endl;
    cout << "=========================================" << endl;
    
    // Build network with some disconnected components
    network.addConnection("Server1", "Workstation1");
    network.addConnection("Server1", "Workstation2");
    network.addConnection("Workstation1", "Workstation2");
    
    // Separate component
    network.addConnection("Laptop1", "Laptop2");
    
    // Another separate component
    network.addConnection("Router1", "Switch1");
    network.addConnection("Switch1", "Printer1");
    
    network.analyzeNetwork();
    
    // Fix connectivity
    cout << "\n🔧 Adding bridge connections..." << endl;
    network.addConnection("Server1", "Router1");
    network.addConnection("Workstation2", "Laptop1");
    
    network.analyzeNetwork();
    
    return 0;
}
```

### Problem 2: 🎯 Shortest Path in Maze

**Story**: You're programming a robot to navigate through a maze to reach the exit.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class MazeNavigator {
private:
    vector<vector<char>> maze;
    int rows, cols;
    
    // Directions: up, right, down, left
    int dx[4] = {-1, 0, 1, 0};
    int dy[4] = {0, 1, 0, -1};
    string directions[4] = {"UP", "RIGHT", "DOWN", "LEFT"};
    
public:
    MazeNavigator(vector<vector<char>>& m) : maze(m) {
        rows = maze.size();
        cols = maze[0].size();
    }
    
    bool isValid(int x, int y) {
        return x >= 0 && x < rows && y >= 0 && y < cols && maze[x][y] != '#';
    }
    
    vector<pair<int, int>> findShortestPath(pair<int, int> start, pair<int, int> end) {
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));
        vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));
        
        queue<pair<int, int>> q;
        q.push(start);
        visited[start.first][start.second] = true;
        
        cout << "🤖 Robot navigating maze using BFS..." << endl;
        cout << "====================================" << endl;
        
        while (!q.empty()) {
            auto current = q.front();
            q.pop();
            
            int x = current.first;
            int y = current.second;
            
            cout << "Exploring position (" << x << ", " << y << ")" << endl;
            
            if (current == end) {
                cout << "🎯 Exit found!" << endl;
                return reconstructPath(parent, start, end);
            }
            
            // Explore all 4 directions
            for (int i = 0; i < 4; i++) {
                int newX = x + dx[i];
                int newY = y + dy[i];
                
                if (isValid(newX, newY) && !visited[newX][newY]) {
                    visited[newX][newY] = true;
                    parent[newX][newY] = current;
                    q.push({newX, newY});
                    
                    cout << "  Added (" << newX << ", " << newY << ") to queue" << endl;
                }
            }
        }
        
        cout << "❌ No path to exit found!" << endl;
        return {};
    }
    
    vector<pair<int, int>> reconstructPath(vector<vector<pair<int, int>>>& parent, 
                                          pair<int, int> start, pair<int, int> end) {
        vector<pair<int, int>> path;
        pair<int, int> current = end;
        
        while (current != start) {
            path.push_back(current);
            current = parent[current.first][current.second];
        }
        path.push_back(start);
        
        reverse(path.begin(), path.end());
        return path;
    }
    
    void displayMaze() {
        cout << "\n🗺️ Maze Layout:" << endl;
        cout << "===============" << endl;
        cout << "S = Start, E = Exit, # = Wall, . = Open path" << endl;
        cout << endl;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cout << maze[i][j] << " ";
            }
            cout << endl;
        }
    }
    
    void displayPath(vector<pair<int, int>>& path) {
        if (path.empty()) {
            cout << "No path to display" << endl;
            return;
        }
        
        cout << "\n🛤️ Shortest Path:" << endl;
        cout << "=================" << endl;
        
        for (int i = 0; i < path.size(); i++) {
            cout << "(" << path[i].first << ", " << path[i].second << ")";
            if (i < path.size() - 1) cout << " → ";
        }
        cout << endl;
        cout << "Path length: " << path.size() - 1 << " steps" << endl;
        
        // Show path on maze
        vector<vector<char>> mazeWithPath = maze;
        for (auto& pos : path) {
            if (mazeWithPath[pos.first][pos.second] == '.') {
                mazeWithPath[pos.first][pos.second] = '*';
            }
        }
        
        cout << "\n🗺️ Maze with path (* = robot's path):" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cout << mazeWithPath[i][j] << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    vector<vector<char>> maze = {
        {'S', '.', '#', '.', '.'},
        {'.', '.', '#', '.', '#'},
        {'#', '.', '.', '.', '.'},
        {'#', '#', '#', '.', '#'},
        {'.', '.', '.', '.', 'E'}
    };
    
    MazeNavigator navigator(maze);
    
    cout << "🤖 Robot Maze Navigation" << endl;
    cout << "========================" << endl;
    
    navigator.displayMaze();
    
    pair<int, int> start = {0, 0}; // Position of 'S'
    pair<int, int> end = {4, 4};   // Position of 'E'
    
    vector<pair<int, int>> path = navigator.findShortestPath(start, end);
    navigator.displayPath(path);
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Graph Fundamentals
1. **Vertices and Edges**: Nodes represent entities, edges represent relationships
2. **Directed vs Undirected**: One-way vs mutual relationships
3. **Weighted vs Unweighted**: Relationships with or without strength/cost
4. **Connected vs Disconnected**: Whether all nodes can reach each other
5. **Cycles**: Paths that start and end at the same vertex

### Graph Representations
1. **Adjacency List**: Space-efficient for sparse graphs O(V + E)
2. **Adjacency Matrix**: Fast edge lookup for dense graphs O(V²)
3. **Edge List**: Simple list of all edges O(E)

### Traversal Algorithms
1. **DFS (Depth-First Search)**: Go deep first, uses stack/recursion
2. **BFS (Breadth-First Search)**: Go wide first, uses queue
3. **Applications**: Pathfinding, connectivity, cycle detection

### Time Complexities
- **DFS/BFS**: O(V + E) for adjacency list, O(V²) for adjacency matrix
- **Dijkstra's Algorithm**: O((V + E) log V) with priority queue
- **Space**: O(V) for visited tracking

### When to Use Graphs
✅ **Perfect for:**
- Social networks and relationships
- Maps and navigation systems
- Network routing and connectivity
- Dependency resolution
- Recommendation systems
- Game AI pathfinding

❌ **Not suitable for:**
- Simple sequential data
- When relationships don't matter
- Memory-constrained environments (can be space-intensive)

### Real-World Applications
1. **🌐 Social Media**: Friend suggestions, influence analysis
2. **🗺️ GPS Navigation**: Route planning, traffic optimization
3. **🌍 Internet**: Packet routing, network topology
4. **🎬 Recommendations**: Movie/product suggestions
5. **🎮 Gaming**: AI pathfinding, game state exploration
6. **📊 Data Analysis**: Dependency graphs, workflow management

---

## 🚀 What's Next?

Excellent! You've completed the Advanced Structures section and mastered graphs - understanding how they model relationships and networks like social media connections. 

You've now learned:
- **Hash Tables**: Lightning-fast lookups like library catalogs
- **Graphs**: Network relationships and pathfinding algorithms

Next, let's move to [Algorithms](05_Algorithms/13_Searching.md) starting with Searching Algorithms - techniques for finding data efficiently in different scenarios!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Number of islands, valid path in graph, find center of star graph
2. **Medium**: Course schedule, clone graph, shortest path in binary matrix
3. **Hard**: Word ladder, minimum spanning tree, strongly connected components

### Tips for Success
1. **Choose Right Representation**: Adjacency list for sparse, matrix for dense
2. **Master DFS and BFS**: Foundation for most graph algorithms
3. **Think About Connectivity**: Connected components, cycles, paths
4. **Practice Pathfinding**: BFS for shortest path, Dijkstra for weighted graphs
5. **Visualize Problems**: Draw graphs to understand relationships

### Common Patterns
1. **Graph Traversal**: DFS/BFS for exploring all nodes
2. **Shortest Path**: BFS for unweighted, Dijkstra for weighted
3. **Connectivity**: Union-Find, DFS for connected components
4. **Cycle Detection**: DFS with color coding
5. **Topological Sort**: DFS-based ordering for dependencies

**Remember: Graphs are like social networks - they show how things connect and relate to each other, enabling powerful analysis of relationships and pathfinding!** 🌐
