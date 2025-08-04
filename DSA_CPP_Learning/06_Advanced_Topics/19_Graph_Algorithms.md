# Graph Algorithms - The Network Navigator

## 🌟 Real-World Story: The GPS Navigation System

Imagine you're building the next Google Maps! 🗺️

**The Challenge**: You need to help millions of users find the best routes between any two locations in the world.

**Your Network**: 
- **Cities** are like nodes in a graph
- **Roads** are like edges connecting the nodes
- **Traffic conditions** affect the "weight" of each road
- **One-way streets** create directed edges

**The Problems You Need to Solve**:
1. **Shortest Path**: What's the fastest route from A to B?
2. **All Reachable Places**: Where can I go from my current location?
3. **Minimum Spanning Network**: What's the cheapest way to connect all cities with roads?
4. **Cycle Detection**: Are there any circular routes that waste time?
5. **Network Connectivity**: Is every city reachable from every other city?

This is exactly what **Graph Algorithms** help us solve! They are the backbone of:
- **🗺️ Navigation systems** (GPS, Google Maps)
- **🌐 Internet routing** (how data travels across the web)
- **📱 Social networks** (friend recommendations, shortest connection paths)
- **🚛 Supply chain optimization** (delivery routes, logistics)
- **🧬 Bioinformatics** (protein interaction networks, gene analysis)

## 🎯 What You'll Learn
- Essential graph algorithms with real-world applications
- Shortest path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall)
- Graph traversal optimizations and advanced techniques
- Network flow and connectivity algorithms

---

## 📝 Table of Contents
1. [Shortest Path Algorithms](#shortest-path-algorithms)
2. [Minimum Spanning Tree Algorithms](#minimum-spanning-tree-algorithms)
3. [Network Flow Algorithms](#network-flow-algorithms)
4. [Advanced Graph Techniques](#advanced-graph-techniques)
5. [Real-World Applications](#real-world-applications)
6. [Tips, Tricks & Optimizations](#tips-tricks--optimizations)

---

## Shortest Path Algorithms

### 🚗 Dijkstra's Algorithm - The Smart GPS

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <unordered_map>
using namespace std;

class DijkstraAlgorithm {
private:
    struct Edge {
        int destination;
        int weight;
        string roadName;
        
        Edge(int dest, int w, string name) : destination(dest), weight(w), roadName(name) {}
    };
    
    struct Node {
        int distance;
        int previous;
        bool visited;
        string cityName;
        
        Node() : distance(INT_MAX), previous(-1), visited(false) {}
        Node(string name) : distance(INT_MAX), previous(-1), visited(false), cityName(name) {}
    };
    
    vector<vector<Edge>> graph;
    vector<Node> nodes;
    
public:
    void addCity(string cityName) {
        nodes.push_back(Node(cityName));
        graph.resize(nodes.size());
    }
    
    void addRoad(int from, int to, int distance, string roadName) {
        graph[from].push_back(Edge(to, distance, roadName));
        graph[to].push_back(Edge(from, distance, roadName)); // Bidirectional road
    }
    
    vector<int> findShortestPath(int start, int end) {
        cout << "🚗 Finding shortest path using Dijkstra's Algorithm" << endl;
        cout << "From: " << nodes[start].cityName << " To: " << nodes[end].cityName << endl;
        cout << "====================================================" << endl;
        
        // Reset all nodes
        for (auto& node : nodes) {
            node.distance = INT_MAX;
            node.previous = -1;
            node.visited = false;
        }
        
        // Priority queue: {distance, node_index}
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        
        // Start from source
        nodes[start].distance = 0;
        pq.push({0, start});
        
        cout << "\nStep-by-step exploration:" << endl;
        int step = 1;
        
        while (!pq.empty()) {
            int currentDist = pq.top().first;
            int currentNode = pq.top().second;
            pq.pop();
            
            if (nodes[currentNode].visited) continue;
            
            nodes[currentNode].visited = true;
            cout << "\nStep " << step++ << ": Visiting " << nodes[currentNode].cityName 
                 << " (distance: " << currentDist << ")" << endl;
            
            if (currentNode == end) {
                cout << "🎯 Reached destination!" << endl;
                break;
            }
            
            // Explore neighbors
            for (const auto& edge : graph[currentNode]) {
                int neighbor = edge.destination;
                int newDistance = currentDist + edge.weight;
                
                cout << "  🔍 Checking road to " << nodes[neighbor].cityName 
                     << " via " << edge.roadName << " (+" << edge.weight << " km)" << endl;
                
                if (!nodes[neighbor].visited && newDistance < nodes[neighbor].distance) {
                    nodes[neighbor].distance = newDistance;
                    nodes[neighbor].previous = currentNode;
                    pq.push({newDistance, neighbor});
                    
                    cout << "    ✅ Better path found! New distance: " << newDistance << " km" << endl;
                } else {
                    cout << "    ❌ Not better than current path (" << nodes[neighbor].distance << " km)" << endl;
                }
            }
        }
        
        // Reconstruct path
        vector<int> path;
        int current = end;
        
        if (nodes[end].distance == INT_MAX) {
            cout << "\n❌ No path found!" << endl;
            return path;
        }
        
        while (current != -1) {
            path.push_back(current);
            current = nodes[current].previous;
        }
        
        reverse(path.begin(), path.end());
        return path;
    }
    
    void printPath(const vector<int>& path) {
        if (path.empty()) return;
        
        cout << "\n🗺️ Shortest Route Found:" << endl;
        cout << "========================" << endl;
        
        int totalDistance = 0;
        
        for (int i = 0; i < path.size(); i++) {
            cout << nodes[path[i]].cityName;
            
            if (i < path.size() - 1) {
                // Find the road between current and next city
                for (const auto& edge : graph[path[i]]) {
                    if (edge.destination == path[i + 1]) {
                        cout << " --(" << edge.roadName << ", " << edge.weight << "km)--> ";
                        totalDistance += edge.weight;
                        break;
                    }
                }
            }
        }
        
        cout << "\n\nTotal Distance: " << totalDistance << " km" << endl;
        cout << "Estimated Time: " << (totalDistance / 60.0) << " hours (at 60 km/h)" << endl;
    }
    
    void demonstrateDijkstra() {
        cout << "🚗 GPS Navigation System Demo" << endl;
        cout << "=============================" << endl;
        
        // Add cities (nodes)
        addCity("New York");     // 0
        addCity("Philadelphia"); // 1
        addCity("Washington");   // 2
        addCity("Boston");       // 3
        addCity("Chicago");      // 4
        addCity("Detroit");      // 5
        
        // Add roads (edges) with distances
        addRoad(0, 1, 95, "I-95");      // NY to Philadelphia
        addRoad(0, 3, 215, "I-84");     // NY to Boston
        addRoad(1, 2, 140, "I-95");     // Philadelphia to Washington
        addRoad(0, 4, 790, "I-80");     // NY to Chicago
        addRoad(3, 4, 980, "I-90");     // Boston to Chicago
        addRoad(4, 5, 280, "I-94");     // Chicago to Detroit
        addRoad(1, 4, 760, "I-76");     // Philadelphia to Chicago
        
        cout << "\nRoad Network:" << endl;
        for (int i = 0; i < nodes.size(); i++) {
            cout << i << ": " << nodes[i].cityName << endl;
            for (const auto& edge : graph[i]) {
                cout << "  → " << nodes[edge.destination].cityName 
                     << " via " << edge.roadName << " (" << edge.weight << " km)" << endl;
            }
        }
        
        // Find shortest path from New York to Chicago
        vector<int> path = findShortestPath(0, 4);
        printPath(path);
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O((V + E) log V) with binary heap" << endl;
        cout << "Space Complexity: O(V)" << endl;
        cout << "Best for: Single-source shortest paths with non-negative weights" << endl;
    }
};

int main() {
    DijkstraAlgorithm gps;
    gps.demonstrateDijkstra();
    
    return 0;
}
```

### 🌐 Bellman-Ford Algorithm - The Robust Route Finder

```cpp
class BellmanFordAlgorithm {
private:
    struct Edge {
        int from, to, weight;
        string description;
        
        Edge(int f, int t, int w, string desc) : from(f), to(t), weight(w), description(desc) {}
    };
    
    vector<Edge> edges;
    vector<string> nodeNames;
    int numNodes;
    
public:
    void addNode(string name) {
        nodeNames.push_back(name);
        numNodes = nodeNames.size();
    }
    
    void addEdge(int from, int to, int weight, string description) {
        edges.push_back(Edge(from, to, weight, description));
    }
    
    pair<vector<int>, bool> findShortestPaths(int source) {
        cout << "🌐 Bellman-Ford Algorithm: Handling Negative Weights" << endl;
        cout << "====================================================" << endl;
        
        vector<int> distance(numNodes, INT_MAX);
        vector<int> predecessor(numNodes, -1);
        
        distance[source] = 0;
        cout << "Starting from: " << nodeNames[source] << endl;
        
        // Relax edges V-1 times
        cout << "\nRelaxation phases:" << endl;
        for (int phase = 1; phase < numNodes; phase++) {
            cout << "\n--- Phase " << phase << " ---" << endl;
            bool updated = false;
            
            for (const auto& edge : edges) {
                if (distance[edge.from] != INT_MAX) {
                    int newDist = distance[edge.from] + edge.weight;
                    
                    if (newDist < distance[edge.to]) {
                        distance[edge.to] = newDist;
                        predecessor[edge.to] = edge.from;
                        updated = true;
                        
                        cout << "  ✅ Updated " << nodeNames[edge.to] 
                             << ": " << distance[edge.to] << " via " << edge.description << endl;
                    }
                }
            }
            
            if (!updated) {
                cout << "  No updates in this phase - algorithm can terminate early!" << endl;
                break;
            }
        }
        
        // Check for negative cycles
        cout << "\n🔍 Checking for negative cycles..." << endl;
        bool hasNegativeCycle = false;
        
        for (const auto& edge : edges) {
            if (distance[edge.from] != INT_MAX) {
                int newDist = distance[edge.from] + edge.weight;
                if (newDist < distance[edge.to]) {
                    hasNegativeCycle = true;
                    cout << "❌ Negative cycle detected involving " << edge.description << "!" << endl;
                    break;
                }
            }
        }
        
        if (!hasNegativeCycle) {
            cout << "✅ No negative cycles found!" << endl;
        }
        
        return {distance, hasNegativeCycle};
    }
    
    void demonstrateBellmanFord() {
        cout << "🌐 Currency Exchange Network Analysis" << endl;
        cout << "====================================" << endl;
        
        // Add currencies (nodes)
        addNode("USD"); // 0
        addNode("EUR"); // 1
        addNode("GBP"); // 2
        addNode("JPY"); // 3
        addNode("CAD"); // 4
        
        // Add exchange rates (edges) - some might create arbitrage opportunities
        addEdge(0, 1, -1, "USD→EUR (rate: 0.85)");    // USD to EUR
        addEdge(1, 2, -2, "EUR→GBP (rate: 0.87)");    // EUR to GBP
        addEdge(2, 0, -1, "GBP→USD (rate: 1.25)");    // GBP to USD (potential arbitrage)
        addEdge(0, 3, -110, "USD→JPY (rate: 110)");   // USD to JPY
        addEdge(3, 1, 1, "JPY→EUR (rate: 0.0077)");   // JPY to EUR
        addEdge(0, 4, -1, "USD→CAD (rate: 1.25)");    // USD to CAD
        addEdge(4, 0, 1, "CAD→USD (rate: 0.79)");     // CAD to USD
        
        cout << "\nExchange Network:" << endl;
        for (const auto& edge : edges) {
            cout << "  " << edge.description << " (weight: " << edge.weight << ")" << endl;
        }
        
        auto result = findShortestPaths(0); // Start from USD
        vector<int> distances = result.first;
        bool hasNegativeCycle = result.second;
        
        if (!hasNegativeCycle) {
            cout << "\n💰 Best Exchange Rates from USD:" << endl;
            for (int i = 0; i < numNodes; i++) {
                if (distances[i] != INT_MAX) {
                    cout << "  To " << nodeNames[i] << ": " << distances[i] << " (log rate)" << endl;
                } else {
                    cout << "  To " << nodeNames[i] << ": Not reachable" << endl;
                }
            }
        } else {
            cout << "\n🚨 ARBITRAGE OPPORTUNITY DETECTED!" << endl;
            cout << "There's a way to make money through currency exchange cycles!" << endl;
        }
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(VE)" << endl;
        cout << "Space Complexity: O(V)" << endl;
        cout << "Best for: Graphs with negative weights, detecting negative cycles" << endl;
    }
};

int main() {
    BellmanFordAlgorithm exchange;
    exchange.demonstrateBellmanFord();
    
    return 0;
}
```

### 🌍 Floyd-Warshall Algorithm - The All-Pairs Distance Calculator

```cpp
class FloydWarshallAlgorithm {
private:
    vector<vector<int>> dist;
    vector<vector<int>> next;
    vector<string> cityNames;
    int numCities;
    
public:
    void addCity(string name) {
        cityNames.push_back(name);
        numCities = cityNames.size();
        
        // Resize matrices
        dist.resize(numCities, vector<int>(numCities, INT_MAX));
        next.resize(numCities, vector<int>(numCities, -1));
        
        // Distance from city to itself is 0
        for (int i = 0; i < numCities; i++) {
            dist[i][i] = 0;
        }
    }
    
    void addRoute(int from, int to, int distance) {
        dist[from][to] = distance;
        next[from][to] = to;
    }
    
    void findAllShortestPaths() {
        cout << "🌍 Floyd-Warshall: Finding All-Pairs Shortest Paths" << endl;
        cout << "===================================================" << endl;
        
        cout << "\nInitial distance matrix:" << endl;
        printMatrix(dist);
        
        // Main algorithm: try each intermediate city
        for (int k = 0; k < numCities; k++) {
            cout << "\n--- Using " << cityNames[k] << " as intermediate city ---" << endl;
            
            for (int i = 0; i < numCities; i++) {
                for (int j = 0; j < numCities; j++) {
                    if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                        int newDist = dist[i][k] + dist[k][j];
                        
                        if (newDist < dist[i][j]) {
                            cout << "  ✅ Better path found: " << cityNames[i] 
                                 << " → " << cityNames[j] << " via " << cityNames[k] 
                                 << " (distance: " << newDist << ")" << endl;
                            
                            dist[i][j] = newDist;
                            next[i][j] = next[i][k];
                        }
                    }
                }
            }
            
            cout << "Distance matrix after phase " << (k + 1) << ":" << endl;
            printMatrix(dist);
        }
    }
    
    void printMatrix(const vector<vector<int>>& matrix) {
        cout << "\n     ";
        for (int j = 0; j < numCities; j++) {
            cout << cityNames[j].substr(0, 3) << "  ";
        }
        cout << endl;
        
        for (int i = 0; i < numCities; i++) {
            cout << cityNames[i].substr(0, 3) << "  ";
            for (int j = 0; j < numCities; j++) {
                if (matrix[i][j] == INT_MAX) {
                    cout << " ∞   ";
                } else {
                    cout << matrix[i][j];
                    if (matrix[i][j] < 10) cout << "   ";
                    else if (matrix[i][j] < 100) cout << "  ";
                    else cout << " ";
                }
            }
            cout << endl;
        }
    }
    
    vector<int> getPath(int from, int to) {
        vector<int> path;
        
        if (next[from][to] == -1) {
            return path; // No path exists
        }
        
        path.push_back(from);
        int current = from;
        
        while (current != to) {
            current = next[current][to];
            path.push_back(current);
        }
        
        return path;
    }
    
    void printPath(int from, int to) {
        vector<int> path = getPath(from, to);
        
        if (path.empty()) {
            cout << "No path from " << cityNames[from] << " to " << cityNames[to] << endl;
            return;
        }
        
        cout << "Path from " << cityNames[from] << " to " << cityNames[to] 
             << " (distance: " << dist[from][to] << "): ";
        
        for (int i = 0; i < path.size(); i++) {
            cout << cityNames[path[i]];
            if (i < path.size() - 1) cout << " → ";
        }
        cout << endl;
    }
    
    void demonstrateFloydWarshall() {
        cout << "🌍 Global Flight Network Analysis" << endl;
        cout << "=================================" << endl;
        
        // Add cities
        addCity("NYC");    // 0
        addCity("London"); // 1
        addCity("Tokyo");  // 2
        addCity("Sydney"); // 3
        addCity("Dubai");  // 4
        
        // Add direct flights with distances (in hundreds of miles)
        addRoute(0, 1, 35);  // NYC to London
        addRoute(1, 0, 35);  // London to NYC
        addRoute(0, 2, 68);  // NYC to Tokyo
        addRoute(2, 0, 68);  // Tokyo to NYC
        addRoute(1, 4, 35);  // London to Dubai
        addRoute(4, 1, 35);  // Dubai to London
        addRoute(4, 2, 55);  // Dubai to Tokyo
        addRoute(2, 4, 55);  // Tokyo to Dubai
        addRoute(2, 3, 48);  // Tokyo to Sydney
        addRoute(3, 2, 48);  // Sydney to Tokyo
        addRoute(4, 3, 75);  // Dubai to Sydney
        addRoute(3, 4, 75);  // Sydney to Dubai
        
        cout << "\nDirect flight network:" << endl;
        for (int i = 0; i < numCities; i++) {
            for (int j = 0; j < numCities; j++) {
                if (i != j && dist[i][j] != INT_MAX) {
                    cout << "  " << cityNames[i] << " → " << cityNames[j] 
                         << ": " << dist[i][j] << "00 miles" << endl;
                }
            }
        }
        
        findAllShortestPaths();
        
        cout << "\n🛫 Shortest Routes Between All Cities:" << endl;
        cout << "======================================" << endl;
        
        for (int i = 0; i < numCities; i++) {
            for (int j = 0; j < numCities; j++) {
                if (i != j) {
                    printPath(i, j);
                }
            }
        }
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(V³)" << endl;
        cout << "Space Complexity: O(V²)" << endl;
        cout << "Best for: All-pairs shortest paths, small to medium graphs" << endl;
    }
};

int main() {
    FloydWarshallAlgorithm airline;
    airline.demonstrateFloydWarshall();
    
    return 0;
}
```

---

## Minimum Spanning Tree Algorithms

### 🌳 Prim's Algorithm - The Growing Tree

```cpp
class PrimAlgorithm {
private:
    struct Edge {
        int to;
        int weight;
        string cableName;
        
        Edge(int t, int w, string name) : to(t), weight(w), cableName(name) {}
        
        bool operator>(const Edge& other) const {
            return weight > other.weight;
        }
    };
    
    vector<vector<Edge>> graph;
    vector<string> cityNames;
    vector<bool> inMST;
    
public:
    void addCity(string name) {
        cityNames.push_back(name);
        graph.resize(cityNames.size());
        inMST.resize(cityNames.size(), false);
    }
    
    void addCable(int from, int to, int cost, string cableName) {
        graph[from].push_back(Edge(to, cost, cableName));
        graph[to].push_back(Edge(from, cost, cableName));
    }
    
    vector<pair<int, int>> findMinimumSpanningTree() {
        cout << "🌳 Prim's Algorithm: Building Minimum Cost Network" << endl;
        cout << "=================================================" << endl;
        
        vector<pair<int, int>> mstEdges;
        priority_queue<pair<int, pair<int, int>>, 
                      vector<pair<int, pair<int, int>>>, 
                      greater<pair<int, pair<int, int>>>> pq;
        
        int totalCost = 0;
        int startCity = 0;
        
        // Start with first city
        inMST[startCity] = true;
        cout << "🏁 Starting from: " << cityNames[startCity] << endl;
        
        // Add all edges from start city to priority queue
        for (const auto& edge : graph[startCity]) {
            pq.push({edge.weight, {startCity, edge.to}});
        }
        
        cout << "\nStep-by-step MST construction:" << endl;
        int step = 1;
        
        while (!pq.empty() && mstEdges.size() < cityNames.size() - 1) {
            int weight = pq.top().first;
            int from = pq.top().second.first;
            int to = pq.top().second.second;
            pq.pop();
            
            // Skip if both vertices are already in MST
            if (inMST[to]) {
                cout << "Step " << step++ << ": Skip " << cityNames[from] 
                     << " → " << cityNames[to] << " (would create cycle)" << endl;
                continue;
            }
            
            // Add edge to MST
            mstEdges.push_back({from, to});
            inMST[to] = true;
            totalCost += weight;
            
            cout << "Step " << step++ << ": Add " << cityNames[from] 
                 << " → " << cityNames[to] << " (cost: $" << weight << "M)" << endl;
            
            // Add all edges from newly added vertex
            for (const auto& edge : graph[to]) {
                if (!inMST[edge.to]) {
                    pq.push({edge.weight, {to, edge.to}});
                }
            }
            
            cout << "  Cities in network: ";
            for (int i = 0; i < cityNames.size(); i++) {
                if (inMST[i]) cout << cityNames[i] << " ";
            }
            cout << endl;
        }
        
        cout << "\n🌳 Minimum Spanning Tree Complete!" << endl;
        cout << "Total network cost: $" << totalCost << " million" << endl;
        
        return mstEdges;
    }
    
    void demonstratePrim() {
        cout << "🌳 Internet Backbone Network Design" << endl;
        cout << "===================================" << endl;
        
        // Add cities
        addCity("San Francisco"); // 0
        addCity("Los Angeles");   // 1
        addCity("Denver");        // 2
        addCity("Chicago");       // 3
        addCity("New York");      // 4
        addCity("Miami");         // 5
        
        // Add potential cable connections with costs (in millions)
        addCable(0, 1, 15, "SF-LA Cable");      // SF to LA
        addCable(0, 2, 25, "SF-Denver Cable");  // SF to Denver
        addCable(1, 2, 20, "LA-Denver Cable");  // LA to Denver
        addCable(1, 5, 35, "LA-Miami Cable");   // LA to Miami
        addCable(2, 3, 18, "Denver-Chicago Cable"); // Denver to Chicago
        addCable(3, 4, 12, "Chicago-NY Cable"); // Chicago to NY
        addCable(3, 5, 30, "Chicago-Miami Cable"); // Chicago to Miami
        addCable(4, 5, 22, "NY-Miami Cable");   // NY to Miami
        addCable(0, 3, 40, "SF-Chicago Cable"); // SF to Chicago (expensive)
        
        cout << "\nAvailable cable connections:" << endl;
        for (int i = 0; i < cityNames.size(); i++) {
            for (const auto& edge : graph[i]) {
                if (i < edge.to) { // Print each edge only once
                    cout << "  " << cityNames[i] << " ↔ " << cityNames[edge.to] 
                         << ": $" << edge.weight << "M (" << edge.cableName << ")" << endl;
                }
            }
        }
        
        vector<pair<int, int>> mst = findMinimumSpanningTree();
        
        cout << "\n🌐 Final Network Topology:" << endl;
        for (const auto& edge : mst) {
            cout << "  " << cityNames[edge.first] << " ↔ " << cityNames[edge.second] << endl;
        }
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(E log V) with binary heap" << endl;
        cout << "Space Complexity: O(V)" << endl;
        cout << "Best for: Dense graphs, when you want to grow the tree incrementally" << endl;
    }
};

int main() {
    PrimAlgorithm network;
    network.demonstratePrim();
    
    return 0;
}
```

---

## Network Flow Algorithms

### 🌊 Ford-Fulkerson Algorithm - The Maximum Flow Finder

```cpp
class FordFulkersonAlgorithm {
private:
    vector<vector<int>> capacity;
    vector<vector<int>> flow;
    vector<string> nodeNames;
    int numNodes;
    
    bool bfs(int source, int sink, vector<int>& parent) {
        vector<bool> visited(numNodes, false);
        queue<int> q;
        
        q.push(source);
        visited[source] = true;
        parent[source] = -1;
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (int v = 0; v < numNodes; v++) {
                if (!visited[v] && capacity[u][v] - flow[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    q.push(v);
                    
                    if (v == sink) return true;
                }
            }
        }
        
        return false;
    }
    
public:
    void addNode(string name) {
        nodeNames.push_back(name);
        numNodes = nodeNames.size();
        
        capacity.resize(numNodes, vector<int>(numNodes, 0));
        flow.resize(numNodes, vector<int>(numNodes, 0));
    }
    
    void addPipe(int from, int to, int cap) {
        capacity[from][to] = cap;
    }
    
    int maxFlow(int source, int sink) {
        cout << "🌊 Ford-Fulkerson: Finding Maximum Flow" << endl;
        cout << "=======================================" << endl;
        
        cout << "Source: " << nodeNames[source] << endl;
        cout << "Sink: " << nodeNames[sink] << endl;
        
        int totalFlow = 0;
        vector<int> parent(numNodes);
        int iteration = 1;
        
        while (bfs(source, sink, parent)) {
            cout << "\n--- Iteration " << iteration++ << " ---" << endl;
            
            // Find minimum capacity along the path
            int pathFlow = INT_MAX;
            cout << "Augmenting path: ";
            
            vector<int> path;
            for (int v = sink; v != source; v = parent[v]) {
                path.push_back(v);
                int u = parent[v];
                pathFlow = min(pathFlow, capacity[u][v] - flow[u][v]);
            }
            path.push_back(source);
            reverse(path.begin(), path.end());
            
            for (int i = 0; i < path.size(); i++) {
                cout << nodeNames[path[i]];
                if (i < path.size() - 1) cout << " → ";
            }
            cout << "\nBottleneck capacity: " << pathFlow << endl;
            
            // Update flow along the path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow; // Reverse edge
            }
            
            totalFlow += pathFlow;
            cout << "Flow added: " << pathFlow << ", Total flow: " << totalFlow << endl;
        }
        
        return totalFlow;
    }
    
    void demonstrateMaxFlow() {
        cout << "🌊 Water Distribution Network" << endl;
        cout << "=============================" << endl;
        
        // Add nodes
        addNode("Reservoir");    // 0 (source)
        addNode("Pump Station"); // 1
        addNode("District A");   // 2
        addNode("District B");   // 3
        addNode("Treatment");    // 4 (sink)
        
        // Add pipes with capacities (in thousands of gallons per hour)
        addPipe(0, 1, 20); // Reservoir to Pump Station
        addPipe(0, 2, 10); // Reservoir to District A
        addPipe(1, 2, 6);  // Pump Station to District A
        addPipe(1, 3, 10); // Pump Station to District B
        addPipe(2, 3, 9);  // District A to District B
        addPipe(2, 4, 10); // District A to Treatment
        addPipe(3, 4, 10); // District B to Treatment
        
        cout << "\nPipe network capacities:" << endl;
        for (int i = 0; i < numNodes; i++) {
            for (int j = 0; j < numNodes; j++) {
                if (capacity[i][j] > 0) {
                    cout << "  " << nodeNames[i] << " → " << nodeNames[j] 
                         << ": " << capacity[i][j] << "k gal/hr" << endl;
                }
            }
        }
        
        int maxFlowValue = maxFlow(0, 4);
        
        cout << "\n🌊 Maximum Flow Result: " << maxFlowValue << "k gallons/hour" << endl;
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(E × max_flow)" << endl;
        cout << "Space Complexity: O(V²)" << endl;
        cout << "Best for: Network flow problems, matching, transportation" << endl;
    }
};

int main() {
    FordFulkersonAlgorithm waterSystem;
    waterSystem.demonstrateMaxFlow();
    
    return 0;
}
```

---

## Advanced Graph Techniques

### 🔍 Topological Sorting - The Dependency Resolver

```cpp
class TopologicalSort {
private:
    vector<vector<int>> graph;
    vector<string> taskNames;
    vector<int> inDegree;
    
public:
    void addTask(string name) {
        taskNames.push_back(name);
        graph.resize(taskNames.size());
        inDegree.resize(taskNames.size(), 0);
    }
    
    void addDependency(int from, int to) {
        graph[from].push_back(to);
        inDegree[to]++;
    }
    
    vector<int> topologicalSort() {
        cout << "🔍 Topological Sort: Resolving Dependencies" << endl;
        cout << "===========================================" << endl;
        
        queue<int> q;
        vector<int> result;
        
        // Find all tasks with no dependencies
        cout << "Tasks with no dependencies:" << endl;
        for (int i = 0; i < taskNames.size(); i++) {
            if (inDegree[i] == 0) {
                q.push(i);
                cout << "  " << taskNames[i] << endl;
            }
        }
        
        cout << "\nProcessing order:" << endl;
        int step = 1;
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            result.push_back(current);
            
            cout << "Step " << step++ << ": Process " << taskNames[current] << endl;
            
            // Remove this task and update dependencies
            for (int dependent : graph[current]) {
                inDegree[dependent]--;
                cout << "  → " << taskNames[dependent] << " dependency count: " << inDegree[dependent] << endl;
                
                if (inDegree[dependent] == 0) {
                    q.push(dependent);
                    cout << "    ✅ " << taskNames[dependent] << " is now ready!" << endl;
                }
            }
        }
        
        if (result.size() != taskNames.size()) {
            cout << "\n❌ Cycle detected! Cannot complete all tasks." << endl;
        }
        
        return result;
    }
    
    void demonstrateTopologicalSort() {
        cout << "🔍 Software Build System" << endl;
        cout << "========================" << endl;
        
        // Add build tasks
        addTask("Download Dependencies"); // 0
        addTask("Compile Core");         // 1
        addTask("Compile UI");           // 2
        addTask("Compile Tests");        // 3
        addTask("Link Application");     // 4
        addTask("Run Tests");            // 5
        addTask("Package");              // 6
        addTask("Deploy");               // 7
        
        // Add dependencies (from → to)
        addDependency(0, 1); // Download → Compile Core
        addDependency(0, 2); // Download → Compile UI
        addDependency(1, 4); // Compile Core → Link
        addDependency(2, 4); // Compile UI → Link
        addDependency(1, 3); // Compile Core → Compile Tests
        addDependency(4, 5); // Link → Run Tests
        addDependency(5, 6); // Run Tests → Package
        addDependency(6, 7); // Package → Deploy
        
        cout << "\nBuild dependencies:" << endl;
        for (int i = 0; i < taskNames.size(); i++) {
            if (!graph[i].empty()) {
                cout << "  " << taskNames[i] << " → ";
                for (int j = 0; j < graph[i].size(); j++) {
                    cout << taskNames[graph[i][j]];
                    if (j < graph[i].size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
        
        vector<int> buildOrder = topologicalSort();
        
        if (buildOrder.size() == taskNames.size()) {
            cout << "\n🏗️ Optimal Build Order:" << endl;
            for (int i = 0; i < buildOrder.size(); i++) {
                cout << (i + 1) << ". " << taskNames[buildOrder[i]] << endl;
            }
        }
        
        cout << "\n📊 Algorithm Analysis:" << endl;
        cout << "Time Complexity: O(V + E)" << endl;
        cout << "Space Complexity: O(V)" << endl;
        cout << "Best for: Scheduling, build systems, course prerequisites" << endl;
    }
};

int main() {
    TopologicalSort buildSystem;
    buildSystem.demonstrateTopologicalSort();
    
    return 0;
}
```

---

## Real-World Applications

### 🌐 Social Network Analysis

```cpp
class SocialNetworkAnalysis {
private:
    vector<vector<int>> friendships;
    vector<string> userNames;
    
public:
    void addUser(string name) {
        userNames.push_back(name);
        friendships.resize(userNames.size());
    }
    
    void addFriendship(int user1, int user2) {
        friendships[user1].push_back(user2);
        friendships[user2].push_back(user1);
    }
    
    vector<int> findShortestConnection(int from, int to) {
        cout << "🔍 Finding shortest connection path" << endl;
        cout << "From: " << userNames[from] << " To: " << userNames[to] << endl;
        
        vector<int> distance(userNames.size(), -1);
        vector<int> parent(userNames.size(), -1);
        queue<int> q;
        
        distance[from] = 0;
        q.push(from);
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            
            if (current == to) break;
            
            for (int friend_id : friendships[current]) {
                if (distance[friend_id] == -1) {
                    distance[friend_id] = distance[current] + 1;
                    parent[friend_id] = current;
                    q.push(friend_id);
                }
            }
        }
        
        // Reconstruct path
        vector<int> path;
        if (distance[to] != -1) {
            int current = to;
            while (current != -1) {
                path.push_back(current);
                current = parent[current];
            }
            reverse(path.begin(), path.end());
        }
        
        return path;
    }
    
    void demonstrateSocialNetwork() {
        cout << "🌐 Social Network Connection Analysis" << endl;
        cout << "====================================" << endl;
        
        // Add users
        addUser("Alice");   // 0
        addUser("Bob");     // 1
        addUser("Charlie"); // 2
        addUser("Diana");   // 3
        addUser("Eve");     // 4
        addUser("Frank");   // 5
        
        // Add friendships
        addFriendship(0, 1); // Alice - Bob
        addFriendship(1, 2); // Bob - Charlie
        addFriendship(2, 3); // Charlie - Diana
        addFriendship(3, 4); // Diana - Eve
        addFriendship(0, 5); // Alice - Frank
        addFriendship(5, 4); // Frank - Eve
        
        cout << "\nFriendship network:" << endl;
        for (int i = 0; i < userNames.size(); i++) {
            cout << userNames[i] << " is friends with: ";
            for (int friend_id : friendships[i]) {
                cout << userNames[friend_id] << " ";
            }
            cout << endl;
        }
        
        // Find connection between Alice and Eve
        vector<int> path = findShortestConnection(0, 4);
        
        if (!path.empty()) {
            cout << "\nShortest connection path:" << endl;
            for (int i = 0; i < path.size(); i++) {
                cout << userNames[path[i]];
                if (i < path.size() - 1) cout << " → ";
            }
            cout << "\nDegrees of separation: " << (path.size() - 1) << endl;
        } else {
            cout << "\nNo connection found!" << endl;
        }
    }
};

int main() {
    SocialNetworkAnalysis network;
    network.demonstrateSocialNetwork();
    
    return 0;
}
```

---

## Tips, Tricks & Optimizations

### 🎯 Graph Algorithm Selection Guide

```cpp
class GraphAlgorithmGuide {
public:
    void demonstrateAlgorithmSelection() {
        cout << "🎯 Graph Algorithm Selection Guide" << endl;
        cout << "==================================" << endl;
        cout << endl;
        
        cout << "🗺️ SHORTEST PATH PROBLEMS:" << endl;
        cout << "• Single source, non-negative weights → Dijkstra's Algorithm" << endl;
        cout << "• Single source, negative weights → Bellman-Ford Algorithm" << endl;
        cout << "• All pairs shortest paths → Floyd-Warshall Algorithm" << endl;
        cout << "• Unweighted graphs → BFS" << endl;
        cout << endl;
        
        cout << "🌳 MINIMUM SPANNING TREE:" << endl;
        cout << "• Dense graphs → Prim's Algorithm" << endl;
        cout << "• Sparse graphs → Kruskal's Algorithm" << endl;
        cout << "• Need to grow tree incrementally → Prim's Algorithm" << endl;
        cout << endl;
        
        cout << "🌊 NETWORK FLOW:" << endl;
        cout << "• Maximum flow → Ford-Fulkerson (Edmonds-Karp)" << endl;
        cout << "• Minimum cost flow → Min-Cost Max-Flow algorithms" << endl;
        cout << "• Bipartite matching → Convert to max flow" << endl;
        cout << endl;
        
        cout << "🔍 GRAPH TRAVERSAL:" << endl;
        cout << "• Shortest path in unweighted → BFS" << endl;
        cout << "• Explore all paths → DFS" << endl;
        cout << "• Topological ordering → DFS or Kahn's algorithm" << endl;
        cout << "• Cycle detection → DFS with color coding" << endl;
        cout << endl;
        
        cout << "⚡ OPTIMIZATION TIPS:" << endl;
        cout << "1. Use adjacency lists for sparse graphs" << endl;
        cout << "2. Use adjacency matrix for dense graphs" << endl;
        cout << "3. Consider bidirectional search for shortest paths" << endl;
        cout << "4. Use priority queues for Dijkstra and Prim" << endl;
        cout << "5. Preprocess graphs when possible" << endl;
        cout << "6. Consider approximation algorithms for NP-hard problems" << endl;
    }
    
    void demonstrateComplexityComparison() {
        cout << "\n📊 Time Complexity Comparison" << endl;
        cout << "==============================" << endl;
        cout << endl;
        
        cout << "Algorithm                | Time Complexity    | Space Complexity" << endl;
        cout << "------------------------|--------------------|-----------------" << endl;
        cout << "BFS/DFS                 | O(V + E)          | O(V)" << endl;
        cout << "Dijkstra (binary heap)  | O((V + E) log V)  | O(V)" << endl;
        cout << "Dijkstra (Fibonacci)    | O(E + V log V)    | O(V)" << endl;
        cout << "Bellman-Ford           | O(VE)             | O(V)" << endl;
        cout << "Floyd-Warshall         | O(V³)             | O(V²)" << endl;
        cout << "Kruskal's MST          | O(E log E)        | O(V)" << endl;
        cout << "Prim's MST             | O(E log V)        | O(V)" << endl;
        cout << "Ford-Fulkerson         | O(E × max_flow)   | O(V²)" << endl;
        cout << "Topological Sort       | O(V + E)          | O(V)" << endl;
    }
};

int main() {
    GraphAlgorithmGuide guide;
    guide.demonstrateAlgorithmSelection();
    guide.demonstrateComplexityComparison();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Graph Algorithm Fundamentals
1. **Choose the right algorithm** for your specific problem type
2. **Consider graph properties**: sparse vs dense, weighted vs unweighted
3. **Understand trade-offs**: time vs space complexity
4. **Use appropriate data structures**: adjacency lists vs matrices

### Essential Algorithms
1. **Dijkstra's**: Single-source shortest paths (non-negative weights)
2. **Bellman-Ford**: Handles negative weights, detects negative cycles
3. **Floyd-Warshall**: All-pairs shortest paths for small graphs
4. **Prim's/Kruskal's**: Minimum spanning trees
5. **Ford-Fulkerson**: Maximum flow in networks

### Real-World Applications
1. **🗺️ Navigation**: GPS systems, route planning
2. **🌐 Networks**: Internet routing, social networks
3. **🏗️ Scheduling**: Task dependencies, project management
4. **💧 Flow Networks**: Transportation, supply chains
5. **🔍 Optimization**: Resource allocation, matching problems

### Optimization Strategies
1. **Data Structure Choice**: Lists vs matrices based on density
2. **Algorithm Variants**: Use faster implementations when available
3. **Preprocessing**: Compute expensive operations once
4. **Approximation**: For NP-hard problems, consider heuristics
5. **Parallel Processing**: Some algorithms can be parallelized

---

## 🚀 What's Next?

You've mastered advanced graph algorithms! These are the building blocks of:
- **Navigation systems** and route optimization
- **Network analysis** and social media algorithms  
- **Supply chain** and logistics optimization
- **Internet infrastructure** and data routing
- **AI and machine learning** graph neural networks

Continue with [String Algorithms](06_Advanced_Topics/20_String_Algorithms.md) to complete your advanced DSA journey!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Network delay time, find center of star graph
2. **Medium**: Course schedule, cheapest flights, network connectivity
3. **Hard**: Critical connections, minimum spanning tree variants

### Interview Tips
1. **Identify the graph type**: Directed/undirected, weighted/unweighted
2. **Choose appropriate representation**: Adjacency list vs matrix
3. **Consider edge cases**: Disconnected graphs, self-loops, negative weights
4. **Optimize for the specific problem**: Don't always use the most general algorithm
5. **Practice implementation**: Graph algorithms have many implementation details

**Remember: Graph algorithms are like having a GPS for any network - they help you navigate efficiently through complex relationships!** 🗺️
