# Binary Trees - Hierarchical Data Like Family Trees

## 🌟 Real-World Story: The Family Tree

Imagine you're creating a family tree for your relatives! 👨‍👩‍👧‍👦

```
        Grandpa John (Root)
       /              \
   Dad Mike        Aunt Sarah
   /      \        /         \
Alice    Bob   Carol      Diana
```

In this family tree:
- **Grandpa John** is at the top (root)
- Each person can have **at most 2 children** (left and right)
- **Dad Mike** and **Aunt Sarah** are siblings (same level)
- **Alice, Bob, Carol, Diana** are cousins (same level)
- You can trace any person's ancestry by following the path upward

This is exactly how a **Binary Tree** works! It's a hierarchical structure where:
- Each node has **at most 2 children** (left and right)
- There's one **root** node at the top
- Nodes are organized in **levels** (generations)
- You can navigate from parent to children or trace back to ancestors

## 🎯 What You'll Learn
- Understanding binary trees through family analogies
- Tree terminology and structure
- Different types of binary trees
- Tree traversal methods (visiting all family members)
- Implementation and real-world applications

---

## 📝 Table of Contents
1. [Why Binary Trees Matter](#why-binary-trees-matter)
2. [Tree Terminology](#tree-terminology)
3. [Types of Binary Trees](#types-of-binary-trees)
4. [Tree Traversal Methods](#tree-traversal-methods)
5. [Implementation](#implementation)
6. [Real-World Applications](#real-world-applications)
7. [Practice Problems](#practice-problems)

---

## Why Binary Trees Matter

### 🏢 The Company Hierarchy Problem

**Scenario**: You're organizing a company structure.

**Traditional List Approach**:
- CEO → Manager1 → Employee1, Employee2, Employee3...
- Hard to show relationships between different departments
- Difficult to find reporting structures

**Tree Approach (Hierarchical)**:
```
           CEO (Root)
          /          \
    CTO (Tech)    CFO (Finance)
    /        \         /        \
Dev Team  QA Team  Accounting  HR
```

**Why Trees Are Better**:
- **Natural hierarchy**: Shows clear reporting relationships
- **Efficient searching**: Find any employee's manager quickly
- **Organized structure**: Easy to understand company organization
- **Scalable**: Easy to add new departments or teams

### 🗂️ The File System Analogy

Your computer's file system is a tree!

```
Root Directory (/)
├── Users
│   ├── John
│   │   ├── Documents
│   │   └── Pictures
│   └── Sarah
│       ├── Music
│       └── Videos
└── Applications
    ├── Chrome
    └── VSCode
```

Each folder can contain **at most** other folders and files, creating a natural tree structure.

---

## Tree Terminology

Let's learn tree terms using our family tree analogy:

### 🌳 Basic Tree Terms

```cpp
#include <iostream>
#include <string>
using namespace std;

struct FamilyMember {
    string name;
    FamilyMember* leftChild;   // First child
    FamilyMember* rightChild;  // Second child
    
    FamilyMember(string n) {
        name = n;
        leftChild = nullptr;
        rightChild = nullptr;
    }
};

class FamilyTree {
public:
    FamilyMember* root;  // The oldest ancestor
    
    FamilyTree() {
        root = nullptr;
    }
    
    void explainTerminology() {
        cout << "🌳 Binary Tree Terminology (Family Tree Style):" << endl;
        cout << "=============================================" << endl;
        
        cout << "📍 ROOT: The topmost person (oldest ancestor)" << endl;
        cout << "   Example: Grandpa John" << endl;
        
        cout << "\n👨‍👩‍👧‍👦 NODE: Each person in the family tree" << endl;
        cout << "   Example: Every family member is a node" << endl;
        
        cout << "\n👶 LEAF: Person with no children" << endl;
        cout << "   Example: Alice, Bob, Carol, Diana" << endl;
        
        cout << "\n👨‍👦 PARENT: Person who has children" << endl;
        cout << "   Example: Dad Mike is parent of Alice and Bob" << endl;
        
        cout << "\n👶👶 CHILDREN: Direct descendants" << endl;
        cout << "   Example: Alice and Bob are children of Dad Mike" << endl;
        
        cout << "\n👫 SIBLINGS: People with same parent" << endl;
        cout << "   Example: Alice and Bob are siblings" << endl;
        
        cout << "\n📏 HEIGHT: Number of generations from root to deepest person" << endl;
        cout << "   Example: If we have great-grandchildren, height = 3" << endl;
        
        cout << "\n📊 LEVEL/DEPTH: Which generation someone belongs to" << endl;
        cout << "   Level 0: Grandpa John" << endl;
        cout << "   Level 1: Dad Mike, Aunt Sarah" << endl;
        cout << "   Level 2: Alice, Bob, Carol, Diana" << endl;
        
        cout << "\n🌿 SUBTREE: A person and all their descendants" << endl;
        cout << "   Example: Dad Mike's subtree includes Mike, Alice, and Bob" << endl;
    }
};

int main() {
    FamilyTree family;
    family.explainTerminology();
    
    return 0;
}
```

### 📊 Visual Tree Structure

```
Tree Properties:
                    A (Root, Level 0)
                   / \
                  B   C (Level 1)
                 / \   \
                D   E   F (Level 2, Leaves)

- Root: A
- Internal Nodes: A, B, C  
- Leaf Nodes: D, E, F
- Height: 2 (maximum levels from root)
- Size: 6 (total nodes)
- B's children: D, E
- C's children: none (only right child F)
```

---

## Types of Binary Trees

### 1. 🌳 Full Binary Tree (Perfect Family)

Every parent has exactly 0 or 2 children (no single children):

```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    
    Node(int value) {
        data = value;
        left = nullptr;
        right = nullptr;
    }
};

class BinaryTreeTypes {
public:
    // Check if tree is full (every node has 0 or 2 children)
    bool isFullBinaryTree(Node* root) {
        if (root == nullptr) {
            return true;  // Empty tree is full
        }
        
        // If it's a leaf node
        if (root->left == nullptr && root->right == nullptr) {
            return true;
        }
        
        // If it has both children
        if (root->left != nullptr && root->right != nullptr) {
            return isFullBinaryTree(root->left) && isFullBinaryTree(root->right);
        }
        
        // If it has only one child, it's not full
        return false;
    }
    
    void demonstrateFullTree() {
        cout << "🌳 Full Binary Tree Example:" << endl;
        cout << "============================" << endl;
        cout << "Every parent has exactly 0 or 2 children" << endl;
        cout << endl;
        cout << "        A" << endl;
        cout << "       / \\" << endl;
        cout << "      B   C" << endl;
        cout << "     / \\ / \\" << endl;
        cout << "    D  E F  G" << endl;
        cout << endl;
        cout << "✅ This is FULL because:" << endl;
        cout << "   - A has 2 children (B, C)" << endl;
        cout << "   - B has 2 children (D, E)" << endl;
        cout << "   - C has 2 children (F, G)" << endl;
        cout << "   - D, E, F, G have 0 children (leaves)" << endl;
    }
};

int main() {
    BinaryTreeTypes treeTypes;
    treeTypes.demonstrateFullTree();
    
    // Create a full binary tree
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);
    root->right->left = new Node(6);
    root->right->right = new Node(7);
    
    cout << "\n🔍 Checking if our tree is full: " 
         << (treeTypes.isFullBinaryTree(root) ? "YES ✅" : "NO ❌") << endl;
    
    return 0;
}
```

### 2. 🏢 Complete Binary Tree (Organized Company)

All levels are filled except possibly the last, and the last level is filled from left to right:

```cpp
#include <iostream>
#include <queue>
using namespace std;

class CompleteBinaryTree {
public:
    bool isCompleteBinaryTree(Node* root) {
        if (root == nullptr) {
            return true;
        }
        
        queue<Node*> q;
        q.push(root);
        bool foundNull = false;
        
        while (!q.empty()) {
            Node* current = q.front();
            q.pop();
            
            if (current == nullptr) {
                foundNull = true;
            } else {
                // If we found a null before and now we have a non-null node
                if (foundNull) {
                    return false;
                }
                
                q.push(current->left);
                q.push(current->right);
            }
        }
        
        return true;
    }
    
    void demonstrateCompleteTree() {
        cout << "\n🏢 Complete Binary Tree Example:" << endl;
        cout << "=================================" << endl;
        cout << "All levels filled from left to right" << endl;
        cout << endl;
        cout << "        A (Level 0)" << endl;
        cout << "       / \\" << endl;
        cout << "      B   C (Level 1)" << endl;
        cout << "     / \\ /" << endl;
        cout << "    D  E F (Level 2)" << endl;
        cout << endl;
        cout << "✅ This is COMPLETE because:" << endl;
        cout << "   - Level 0: Completely filled (A)" << endl;
        cout << "   - Level 1: Completely filled (B, C)" << endl;
        cout << "   - Level 2: Filled from left to right (D, E, F)" << endl;
        cout << endl;
        cout << "❌ This would NOT be complete:" << endl;
        cout << "        A" << endl;
        cout << "       / \\" << endl;
        cout << "      B   C" << endl;
        cout << "       \\   \\" << endl;
        cout << "        E   F" << endl;
        cout << "   (Missing D, but E is present - violates left-to-right rule)" << endl;
    }
};

int main() {
    CompleteBinaryTree completeTree;
    completeTree.demonstrateCompleteTree();
    
    return 0;
}
```

### 3. ⚖️ Balanced Binary Tree (Stable Structure)

The height difference between left and right subtrees is at most 1:

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

class BalancedBinaryTree {
public:
    int getHeight(Node* root) {
        if (root == nullptr) {
            return 0;
        }
        
        return 1 + max(getHeight(root->left), getHeight(root->right));
    }
    
    bool isBalanced(Node* root) {
        if (root == nullptr) {
            return true;
        }
        
        int leftHeight = getHeight(root->left);
        int rightHeight = getHeight(root->right);
        
        // Check if current node is balanced and recursively check subtrees
        return abs(leftHeight - rightHeight) <= 1 && 
               isBalanced(root->left) && 
               isBalanced(root->right);
    }
    
    void demonstrateBalancedTree() {
        cout << "\n⚖️ Balanced Binary Tree Example:" << endl;
        cout << "=================================" << endl;
        cout << "Height difference between left and right subtrees ≤ 1" << endl;
        cout << endl;
        cout << "✅ BALANCED Tree:" << endl;
        cout << "        A" << endl;
        cout << "       / \\" << endl;
        cout << "      B   C" << endl;
        cout << "     / \\" << endl;
        cout << "    D   E" << endl;
        cout << "   Left subtree height: 2" << endl;
        cout << "   Right subtree height: 1" << endl;
        cout << "   Difference: |2-1| = 1 ≤ 1 ✅" << endl;
        cout << endl;
        cout << "❌ UNBALANCED Tree:" << endl;
        cout << "        A" << endl;
        cout << "       /" << endl;
        cout << "      B" << endl;
        cout << "     /" << endl;
        cout << "    C" << endl;
        cout << "   /" << endl;
        cout << "  D" << endl;
        cout << "   Left subtree height: 3" << endl;
        cout << "   Right subtree height: 0" << endl;
        cout << "   Difference: |3-0| = 3 > 1 ❌" << endl;
    }
};

int main() {
    BalancedBinaryTree balancedTree;
    balancedTree.demonstrateBalancedTree();
    
    return 0;
}
```

---

## Tree Traversal Methods

Tree traversal is like visiting all family members in different orders:

### 🚶‍♂️ Depth-First Traversals

```cpp
#include <iostream>
#include <stack>
using namespace std;

class TreeTraversal {
private:
    struct Node {
        string name;
        Node* left;
        Node* right;
        
        Node(string n) : name(n), left(nullptr), right(nullptr) {}
    };
    
    Node* root;
    
public:
    TreeTraversal() {
        // Create a family tree
        root = new Node("Grandpa");
        root->left = new Node("Dad");
        root->right = new Node("Uncle");
        root->left->left = new Node("Alice");
        root->left->right = new Node("Bob");
        root->right->left = new Node("Carol");
        root->right->right = new Node("Diana");
    }
    
    // 1. PREORDER: Visit parent before children (Root → Left → Right)
    void preorderTraversal(Node* node) {
        if (node == nullptr) return;
        
        cout << node->name << " ";  // Visit root first
        preorderTraversal(node->left);   // Then left subtree
        preorderTraversal(node->right);  // Then right subtree
    }
    
    // 2. INORDER: Visit left child, then parent, then right child (Left → Root → Right)
    void inorderTraversal(Node* node) {
        if (node == nullptr) return;
        
        inorderTraversal(node->left);    // Visit left subtree first
        cout << node->name << " ";       // Then visit root
        inorderTraversal(node->right);   // Then right subtree
    }
    
    // 3. POSTORDER: Visit children before parent (Left → Right → Root)
    void postorderTraversal(Node* node) {
        if (node == nullptr) return;
        
        postorderTraversal(node->left);   // Visit left subtree first
        postorderTraversal(node->right);  // Then right subtree
        cout << node->name << " ";        // Finally visit root
    }
    
    void demonstrateTraversals() {
        cout << "🚶‍♂️ Tree Traversal Methods (Family Visit Orders):" << endl;
        cout << "=================================================" << endl;
        cout << endl;
        cout << "Family Tree:" << endl;
        cout << "        Grandpa" << endl;
        cout << "       /       \\" << endl;
        cout << "     Dad      Uncle" << endl;
        cout << "    /  \\      /    \\" << endl;
        cout << "Alice  Bob  Carol Diana" << endl;
        cout << endl;
        
        cout << "1️⃣ PREORDER (Meet parents before children):" << endl;
        cout << "   Use case: Copying the tree structure" << endl;
        cout << "   Order: ";
        preorderTraversal(root);
        cout << endl;
        cout << "   Story: Meet Grandpa first, then his children, then grandchildren" << endl;
        cout << endl;
        
        cout << "2️⃣ INORDER (Meet left child, parent, right child):" << endl;
        cout << "   Use case: Getting sorted order (in BST)" << endl;
        cout << "   Order: ";
        inorderTraversal(root);
        cout << endl;
        cout << "   Story: Visit leftmost person first, work your way right" << endl;
        cout << endl;
        
        cout << "3️⃣ POSTORDER (Meet children before parents):" << endl;
        cout << "   Use case: Deleting tree (delete children first)" << endl;
        cout << "   Order: ";
        postorderTraversal(root);
        cout << endl;
        cout << "   Story: Meet all grandchildren first, then parents, finally grandpa" << endl;
    }
    
    Node* getRoot() { return root; }
};

int main() {
    TreeTraversal familyTree;
    familyTree.demonstrateTraversals();
    
    return 0;
}
```

### 🌊 Breadth-First Traversal (Level Order)

```cpp
#include <iostream>
#include <queue>
using namespace std;

class LevelOrderTraversal {
public:
    void levelOrderTraversal(TreeTraversal::Node* root) {
        if (root == nullptr) return;
        
        queue<TreeTraversal::Node*> q;
        q.push(root);
        
        cout << "🌊 LEVEL ORDER (Visit by generations):" << endl;
        cout << "   Use case: Printing tree level by level" << endl;
        cout << "   Story: Meet all people of same generation together" << endl;
        cout << endl;
        
        int level = 0;
        while (!q.empty()) {
            int levelSize = q.size();
            cout << "Generation " << level << ": ";
            
            for (int i = 0; i < levelSize; i++) {
                TreeTraversal::Node* current = q.front();
                q.pop();
                
                cout << current->name << " ";
                
                if (current->left) q.push(current->left);
                if (current->right) q.push(current->right);
            }
            cout << endl;
            level++;
        }
    }
    
    void demonstrateLevelOrder() {
        TreeTraversal familyTree;
        levelOrderTraversal(familyTree.getRoot());
    }
};

int main() {
    LevelOrderTraversal levelTraversal;
    levelTraversal.demonstrateLevelOrder();
    
    return 0;
}
```

---

## Implementation

### 🏗️ Complete Binary Tree Implementation

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

template<typename T>
class BinaryTree {
private:
    struct Node {
        T data;
        Node* left;
        Node* right;
        
        Node(T value) : data(value), left(nullptr), right(nullptr) {}
    };
    
    Node* root;
    
    // Helper function to delete tree
    void deleteTree(Node* node) {
        if (node == nullptr) return;
        deleteTree(node->left);
        deleteTree(node->right);
        delete node;
    }
    
    // Helper function to calculate height
    int getHeight(Node* node) {
        if (node == nullptr) return 0;
        return 1 + max(getHeight(node->left), getHeight(node->right));
    }
    
    // Helper function to count nodes
    int countNodes(Node* node) {
        if (node == nullptr) return 0;
        return 1 + countNodes(node->left) + countNodes(node->right);
    }
    
public:
    BinaryTree() : root(nullptr) {}
    
    ~BinaryTree() {
        deleteTree(root);
    }
    
    // Insert using level order (creates complete binary tree)
    void insert(T value) {
        Node* newNode = new Node(value);
        
        if (root == nullptr) {
            root = newNode;
            cout << "🌳 Inserted " << value << " as root" << endl;
            return;
        }
        
        queue<Node*> q;
        q.push(root);
        
        while (!q.empty()) {
            Node* current = q.front();
            q.pop();
            
            if (current->left == nullptr) {
                current->left = newNode;
                cout << "🌿 Inserted " << value << " as left child of " << current->data << endl;
                return;
            } else if (current->right == nullptr) {
                current->right = newNode;
                cout << "🌿 Inserted " << value << " as right child of " << current->data << endl;
                return;
            } else {
                q.push(current->left);
                q.push(current->right);
            }
        }
    }
    
    // Search for a value
    bool search(T value) {
        return searchHelper(root, value);
    }
    
    bool searchHelper(Node* node, T value) {
        if (node == nullptr) return false;
        if (node->data == value) return true;
        
        return searchHelper(node->left, value) || searchHelper(node->right, value);
    }
    
    // Display tree structure
    void displayTree() {
        if (root == nullptr) {
            cout << "🌳 Tree is empty!" << endl;
            return;
        }
        
        cout << "\n🌳 Tree Structure (Level Order):" << endl;
        cout << "================================" << endl;
        
        queue<Node*> q;
        q.push(root);
        int level = 0;
        
        while (!q.empty()) {
            int levelSize = q.size();
            cout << "Level " << level << ": ";
            
            for (int i = 0; i < levelSize; i++) {
                Node* current = q.front();
                q.pop();
                
                cout << current->data << " ";
                
                if (current->left) q.push(current->left);
                if (current->right) q.push(current->right);
            }
            cout << endl;
            level++;
        }
    }
    
    // Get tree statistics
    void getTreeStats() {
        cout << "\n📊 Tree Statistics:" << endl;
        cout << "==================" << endl;
        cout << "Height: " << getHeight(root) << endl;
        cout << "Total nodes: " << countNodes(root) << endl;
        cout << "Is empty: " << (root == nullptr ? "Yes" : "No") << endl;
    }
    
    // Traversal methods
    void preorder() {
        cout << "\n🔄 Preorder Traversal: ";
        preorderHelper(root);
        cout << endl;
    }
    
    void inorder() {
        cout << "🔄 Inorder Traversal: ";
        inorderHelper(root);
        cout << endl;
    }
    
    void postorder() {
        cout << "🔄 Postorder Traversal: ";
        postorderHelper(root);
        cout << endl;
    }
    
private:
    void preorderHelper(Node* node) {
        if (node == nullptr) return;
        cout << node->data << " ";
        preorderHelper(node->left);
        preorderHelper(node->right);
    }
    
    void inorderHelper(Node* node) {
        if (node == nullptr) return;
        inorderHelper(node->left);
        cout << node->data << " ";
        inorderHelper(node->right);
    }
    
    void postorderHelper(Node* node) {
        if (node == nullptr) return;
        postorderHelper(node->left);
        postorderHelper(node->right);
        cout << node->data << " ";
    }
};

int main() {
    BinaryTree<int> tree;
    
    cout << "🌳 Binary Tree Implementation Demo" << endl;
    cout << "==================================" << endl;
    
    // Insert elements
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    tree.insert(6);
    tree.insert(7);
    
    // Display tree
    tree.displayTree();
    
    // Show statistics
    tree.getTreeStats();
    
    // Test search
    cout << "\n🔍 Search Results:" << endl;
    cout << "Search for 5: " << (tree.search(5) ? "Found ✅" : "Not found ❌") << endl;
    cout << "Search for 10: " << (tree.search(10) ? "Found ✅" : "Not found ❌") << endl;
    
    // Show all traversals
    tree.preorder();
    tree.inorder();
    tree.postorder();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🗂️ File System Explorer

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct FileSystemNode {
    string name;
    bool isDirectory;
    vector<FileSystemNode*> children;
    
    FileSystemNode(string n, bool isDir = false) 
        : name(n), isDirectory(isDir) {}
};

class FileSystemExplorer {
private:
    FileSystemNode* root;
    
public:
    FileSystemExplorer() {
        // Create a sample file system
        root = new FileSystemNode("Root", true);
        
        // Create Users directory
        FileSystemNode* users = new FileSystemNode("Users", true);
        root->children.push_back(users);
        
        // Create user directories
        FileSystemNode* john = new FileSystemNode("John", true);
        FileSystemNode* sarah = new FileSystemNode("Sarah", true);
        users->children.push_back(john);
        users->children.push_back(sarah);
        
        // John's files
        john->children.push_back(new FileSystemNode("resume.pdf", false));
        john->children.push_back(new FileSystemNode("photos", true));
        john->children.back()->children.push_back(new FileSystemNode("vacation.jpg", false));
        
        // Sarah's files
        sarah->children.push_back(new FileSystemNode("music", true));
        sarah->children.push_back(new FileSystemNode("documents", true));
        sarah->children.at(0)->children.push_back(new FileSystemNode("song1.mp3", false));
        sarah->children.at(1)->children.push_back(new FileSystemNode("report.docx", false));
        
        cout << "🗂️ File System Explorer Created!" << endl;
    }
    
    void displayFileSystem(FileSystemNode* node = nullptr, int depth = 0) {
        if (node == nullptr) node = root;
        
        // Print indentation
        for (int i = 0; i < depth; i++) {
            cout << "  ";
        }
        
        // Print file/directory with appropriate icon
        if (node->isDirectory) {
            cout << "📁 " << node->name << "/" << endl;
        } else {
            cout << "📄 " << node->name << endl;
        }
        
        // Recursively display children
        for (FileSystemNode* child : node->children) {
            displayFileSystem(child, depth + 1);
        }
    }
    
    FileSystemNode* findFile(string fileName, FileSystemNode* node = nullptr) {
        if (node == nullptr) node = root;
        
        if (node->name == fileName) {
            return node;
        }
        
        for (FileSystemNode* child : node->children) {
            FileSystemNode* result = findFile(fileName, child);
            if (result != nullptr) {
                return result;
            }
        }
        
        return nullptr;
    }
    
    void searchFile(string fileName) {
        cout << "\n🔍 Searching for: " << fileName << endl;
        FileSystemNode* result = findFile(fileName);
        
        if (result != nullptr) {
            cout << "✅ Found: " << (result->isDirectory ? "📁 " : "📄 ") 
                 << result->name << endl;
        } else {
            cout << "❌ File not found!" << endl;
        }
    }
};

int main() {
    FileSystemExplorer explorer;
    
    cout << "\n🗂️ File System Structure:" << endl;
    cout << "=========================" << endl;
    explorer.displayFileSystem();
    
    // Test file search
    explorer.searchFile("resume.pdf");
    explorer.searchFile("song1.mp3");
    explorer.searchFile("nonexistent.txt");
    
    return 0;
}
```

### 2. 🧮 Expression Tree Calculator

```cpp
#include <iostream>
#include <string>
#include <stack>
using namespace std;

struct ExpressionNode {
    string value;
    ExpressionNode* left;
    ExpressionNode* right;
    
    ExpressionNode(string val) : value(val), left(nullptr), right(nullptr) {}
};

class ExpressionTree {
private:
    ExpressionNode* root;
    
    bool isOperator(string token) {
        return token == "+" || token == "-" || token == "*" || token == "/";
    }
    
    int calculate(int a, int b, string op) {
        if (op == "+") return a + b;
        if (op == "-") return a - b;
        if (op == "*") return a * b;
        if (op == "/") return a / b;
        return 0;
    }
    
    int evaluateTree(ExpressionNode* node) {
        if (node == nullptr) return 0;
        
        // If it's a number (leaf node)
        if (!isOperator(node->value)) {
            return stoi(node->value);
        }
        
        // If it's an operator, evaluate left and right subtrees
        int leftValue = evaluateTree(node->left);
        int rightValue = evaluateTree(node->right);
        
        return calculate(leftValue, rightValue, node->value);
    }
    
    void printTree(ExpressionNode* node, int depth = 0) {
        if (node == nullptr) return;
        
        // Print indentation
        for (int i = 0; i < depth; i++) {
            cout << "  ";
        }
        
        cout << node->value << endl;
        
        if (node->left || node->right) {
            if (node->left) {
                printTree(node->left, depth + 1);
            } else {
                for (int i = 0; i < depth + 1; i++) cout << "  ";
                cout << "null" << endl;
            }
            
            if (node->right) {
                printTree(node->right, depth + 1);
            } else {
                for (int i = 0; i < depth + 1; i++) cout << "  ";
                cout << "null" << endl;
            }
        }
    }
    
public:
    ExpressionTree() : root(nullptr) {}
    
    void buildExpressionTree() {
        // Build tree for expression: (3 + 4) * (2 - 1)
        root = new ExpressionNode("*");
        
        // Left subtree: (3 + 4)
        root->left = new ExpressionNode("+");
        root->left->left = new ExpressionNode("3");
        root->left->right = new ExpressionNode("4");
        
        // Right subtree: (2 - 1)
        root->right = new ExpressionNode("-");
        root->right->left = new ExpressionNode("2");
        root->right->right = new ExpressionNode("1");
        
        cout << "🧮 Built expression tree for: (3 + 4) * (2 - 1)" << endl;
    }
    
    void displayTree() {
        cout << "\n🌳 Expression Tree Structure:" << endl;
        cout << "=============================" << endl;
        printTree(root);
    }
    
    int evaluate() {
        int result = evaluateTree(root);
        cout << "\n🔢 Expression evaluation: " << result << endl;
        return result;
    }
};

int main() {
    ExpressionTree calculator;
    
    calculator.buildExpressionTree();
    calculator.displayTree();
    calculator.evaluate();
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🌳 Tree Height Calculator

**Story**: You're measuring the height of different family trees to understand their depth.

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class TreeHeightCalculator {
public:
    int maxDepth(TreeNode* root) {
        if (root == nullptr) {
            return 0;
        }
        
        int leftDepth = maxDepth(root->left);
        int rightDepth = maxDepth(root->right);
        
        return 1 + max(leftDepth, rightDepth);
    }
    
    void demonstrateHeightCalculation() {
        // Create a sample tree
        TreeNode* root = new TreeNode(1);
        root->left = new TreeNode(2);
        root->right = new TreeNode(3);
        root->left->left = new TreeNode(4);
        root->left->right = new TreeNode(5);
        root->right->right = new TreeNode(6);
        root->left->left->left = new TreeNode(7);
        
        cout << "🌳 Tree Height Calculator" << endl;
        cout << "=========================" << endl;
        cout << "Tree structure:" << endl;
        cout << "        1" << endl;
        cout << "       / \\" << endl;
        cout << "      2   3" << endl;
        cout << "     / \\   \\" << endl;
        cout << "    4   5   6" << endl;
        cout << "   /" << endl;
        cout << "  7" << endl;
        cout << endl;
        cout << "📏 Tree height: " << maxDepth(root) << endl;
    }
};

int main() {
    TreeHeightCalculator calculator;
    calculator.demonstrateHeightCalculation();
    
    return 0;
}
```

### Problem 2: 🔍 Tree Path Finder

**Story**: Find if there's a path from root to any leaf that sums to a target value.

```cpp
#include <iostream>
#include <vector>
using namespace std;

class TreePathFinder {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (root == nullptr) {
            return false;
        }
        
        // If it's a leaf node, check if the value equals remaining sum
        if (root->left == nullptr && root->right == nullptr) {
            return root->val == targetSum;
        }
        
        // Recursively check left and right subtrees with reduced sum
        int remainingSum = targetSum - root->val;
        return hasPathSum(root->left, remainingSum) || 
               hasPathSum(root->right, remainingSum);
    }
    
    void findAllPaths(TreeNode* root, int targetSum, vector<int>& currentPath, 
                     vector<vector<int>>& allPaths) {
        if (root == nullptr) return;
        
        currentPath.push_back(root->val);
        
        // If it's a leaf and sum matches
        if (root->left == nullptr && root->right == nullptr && 
            root->val == targetSum) {
            allPaths.push_back(currentPath);
        } else {
            // Continue searching in subtrees
            findAllPaths(root->left, targetSum - root->val, currentPath, allPaths);
            findAllPaths(root->right, targetSum - root->val, currentPath, allPaths);
        }
        
        currentPath.pop_back(); // Backtrack
    }
    
    void demonstratePathFinding() {
        // Create a sample tree
        TreeNode* root = new TreeNode(5);
        root->left = new TreeNode(4);
        root->right = new TreeNode(8);
        root->left->left = new TreeNode(11);
        root->left->left->left = new TreeNode(7);
        root->left->left->right = new TreeNode(2);
        root->right->left = new TreeNode(13);
        root->right->right = new TreeNode(4);
        root->right->right->right = new TreeNode(1);
        
        cout << "\n🔍 Tree Path Finder" << endl;
        cout << "===================" << endl;
        cout << "Tree structure:" << endl;
        cout << "         5" << endl;
        cout << "        / \\" << endl;
        cout << "       4   8" << endl;
        cout << "      /   / \\" << endl;
        cout << "     11  13  4" << endl;
        cout << "    / \\       \\" << endl;
        cout << "   7   2       1" << endl;
        cout << endl;
        
        int target = 22;
        cout << "🎯 Target sum: " << target << endl;
        cout << "Path exists: " << (hasPathSum(root, target) ? "YES ✅" : "NO ❌") << endl;
        
        // Find all paths
        vector<vector<int>> allPaths;
        vector<int> currentPath;
        findAllPaths(root, target, currentPath, allPaths);
        
        cout << "\n📍 All paths with sum " << target << ":" << endl;
        for (const auto& path : allPaths) {
            cout << "Path: ";
            for (int i = 0; i < path.size(); i++) {
                cout << path[i];
                if (i < path.size() - 1) cout << " → ";
            }
            cout << endl;
        }
    }
};

int main() {
    TreePathFinder pathFinder;
    pathFinder.demonstratePathFinding();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Binary Tree Fundamentals
1. **Hierarchical Structure**: Organizes data in parent-child relationships
2. **At Most 2 Children**: Each node can have 0, 1, or 2 children
3. **Root Node**: Single entry point at the top
4. **Leaf Nodes**: Nodes with no children
5. **Recursive Nature**: Each subtree is also a binary tree

### Time Complexities
- **Search**: O(n) in worst case (unbalanced), O(log n) in balanced trees
- **Insertion**: O(n) worst case, O(log n) in balanced trees
- **Deletion**: O(n) worst case, O(log n) in balanced trees
- **Traversal**: O(n) - must visit all nodes

### Space Complexity
- **Storage**: O(n) for n nodes
- **Recursion**: O(h) where h is height (for recursive operations)

### Types of Binary Trees
1. **Full Binary Tree**: Every node has 0 or 2 children
2. **Complete Binary Tree**: All levels filled except possibly last (left to right)
3. **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
4. **Balanced Binary Tree**: Height difference between subtrees ≤ 1

### Traversal Methods
1. **Preorder**: Root → Left → Right (copying structure)
2. **Inorder**: Left → Root → Right (sorted order in BST)
3. **Postorder**: Left → Right → Root (deleting tree)
4. **Level Order**: Visit by levels (BFS)

### When to Use Binary Trees
✅ **Perfect for:**
- Hierarchical data representation
- Expression parsing and evaluation
- File system organization
- Decision trees
- Huffman coding

❌ **Not suitable for:**
- Sequential data access
- Frequent insertions/deletions in middle
- When you need guaranteed O(log n) operations (use balanced trees)

### Real-World Applications
1. **🗂️ File Systems**: Directory and file organization
2. **🧮 Expression Trees**: Mathematical expression evaluation
3. **🏢 Organization Charts**: Company hierarchy representation
4. **🎮 Game Trees**: Decision making in games
5. **📊 Syntax Trees**: Programming language parsing
6. **🔍 Search Trees**: Efficient searching and sorting

---

## 🚀 What's Next?

Excellent work! You've mastered binary trees and understand how they organize data hierarchically like family trees. Next, let's explore [Binary Search Trees (BST)](03_Tree_Structures/09_BST.md) - special binary trees that maintain sorted order for efficient searching!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Maximum depth, symmetric tree, invert binary tree
2. **Medium**: Level order traversal, path sum, lowest common ancestor
3. **Hard**: Serialize/deserialize tree, binary tree maximum path sum

### Tips for Success
1. **Think Recursively**: Trees are naturally recursive structures
2. **Visualize with Drawings**: Sketch trees to understand problems better
3. **Master Traversals**: Each traversal has specific use cases
4. **Practice Tree Construction**: Build trees from different representations
5. **Understand Base Cases**: Handle null nodes and leaf nodes correctly

### Common Patterns
1. **Divide and Conquer**: Solve for left and right subtrees separately
2. **Tree Traversal**: Use appropriate traversal for the problem
3. **Level-by-Level Processing**: Use queues for level order operations
4. **Path Tracking**: Use backtracking for path-related problems

**Remember: Binary trees are like family trees - each person (node) can have at most two children, and you can trace relationships through the hierarchy!** 🌳
