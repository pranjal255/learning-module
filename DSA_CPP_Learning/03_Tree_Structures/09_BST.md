# Binary Search Trees - Organized Trees for Fast Searching

## 🌟 Real-World Story: The Library Catalog System

Imagine you're organizing a massive library! 📚

**Traditional Approach (Unsorted)**:
- Books scattered randomly on shelves
- To find "Harry Potter", you'd have to check every single book
- Adding new books? Just put them anywhere
- Very slow to find anything!

**Library Catalog System (BST Approach)**:
```
        "M" (Middle Section)
       /                  \
   "F" (Fiction)      "S" (Science)
   /        \         /           \
"C"(Comics) "H"(Horror) "P"(Physics) "Z"(Zoology)
```

**The BST Rules**:
- **Left side**: All books with titles **less than** current section
- **Right side**: All books with titles **greater than** current section
- To find "Harry Potter": Start at "M" → Go left to "F" → Go right to "H" → Found!
- **Much faster** than checking every book!

This is exactly how a **Binary Search Tree (BST)** works! It's a special binary tree where:
- **Left subtree** contains values **smaller** than the root
- **Right subtree** contains values **larger** than the root
- This property applies to **every node** in the tree
- Enables **fast searching**, just like a well-organized library!

## 🎯 What You'll Learn
- Understanding BST through library and dictionary analogies
- BST properties and why they matter
- Efficient search, insertion, and deletion operations
- Tree balancing and performance considerations
- Real-world applications and implementations

---

## 📝 Table of Contents
1. [Why BSTs Matter](#why-bsts-matter)
2. [BST Properties and Rules](#bst-properties-and-rules)
3. [Basic BST Operations](#basic-bst-operations)
4. [Advanced Operations](#advanced-operations)
5. [BST Implementation](#bst-implementation)
6. [Real-World Applications](#real-world-applications)
7. [Practice Problems](#practice-problems)

---

## Why BSTs Matter

### 📖 The Dictionary Problem

**Scenario**: You're looking up words in a dictionary.

**Linear Search (Unsorted List)**:
- Start from the first word
- Check every word until you find the target
- Average: Check half the dictionary
- Time: O(n) - very slow for large dictionaries!

**Binary Search Tree (Organized Dictionary)**:
```
        "MIDDLE"
       /        \
   "APPLE"    "ZEBRA"
   /    \      /     \
"ANT" "BOOK" "WATER" "ZOO"
```

**BST Search Process**:
1. Looking for "BOOK"? Start at "MIDDLE"
2. "BOOK" < "MIDDLE"? Go left to "APPLE"
3. "BOOK" > "APPLE"? Go right to "BOOK"
4. Found in just 3 steps instead of potentially thousands!

### 🏪 The Store Inventory Analogy

**Imagine organizing a store by product IDs**:

```
Product ID Organization (BST):
        500 (Electronics)
       /              \
   200 (Books)    800 (Clothing)
   /      \       /           \
 100    300    600         900
(Toys) (Food) (Sports)  (Furniture)
```

**Benefits**:
- **Fast lookup**: Find any product in O(log n) time
- **Sorted order**: Easy to list products in ID order
- **Range queries**: Find all products between ID 200-600
- **Efficient updates**: Add/remove products quickly

---

## BST Properties and Rules

### 🔍 The BST Property

```cpp
#include <iostream>
using namespace std;

struct BSTNode {
    int data;
    BSTNode* left;
    BSTNode* right;
    
    BSTNode(int value) {
        data = value;
        left = nullptr;
        right = nullptr;
    }
};

class BSTValidator {
public:
    // Check if a tree is a valid BST
    bool isValidBST(BSTNode* root) {
        return validateBST(root, INT_MIN, INT_MAX);
    }
    
    bool validateBST(BSTNode* node, int minVal, int maxVal) {
        if (node == nullptr) {
            return true;  // Empty tree is valid BST
        }
        
        // Check if current node violates BST property
        if (node->data <= minVal || node->data >= maxVal) {
            return false;
        }
        
        // Recursively validate left and right subtrees
        return validateBST(node->left, minVal, node->data) &&
               validateBST(node->right, node->data, maxVal);
    }
    
    void demonstrateBSTProperty() {
        cout << "🔍 BST Property Demonstration" << endl;
        cout << "=============================" << endl;
        cout << endl;
        
        cout << "✅ VALID BST:" << endl;
        cout << "     50" << endl;
        cout << "    /  \\" << endl;
        cout << "   30   70" << endl;
        cout << "  / \\   / \\" << endl;
        cout << " 20 40 60 80" << endl;
        cout << endl;
        cout << "Rules followed:" << endl;
        cout << "- All left descendants < 50" << endl;
        cout << "- All right descendants > 50" << endl;
        cout << "- Same rule applies to every subtree" << endl;
        cout << endl;
        
        cout << "❌ INVALID BST:" << endl;
        cout << "     50" << endl;
        cout << "    /  \\" << endl;
        cout << "   30   70" << endl;
        cout << "  / \\   / \\" << endl;
        cout << " 20 60 40 80" << endl;
        cout << endl;
        cout << "Problem: 60 is in left subtree but 60 > 50!" << endl;
        cout << "Problem: 40 is in right subtree but 40 < 50!" << endl;
    }
    
    void testBSTValidation() {
        // Create a valid BST
        BSTNode* validRoot = new BSTNode(50);
        validRoot->left = new BSTNode(30);
        validRoot->right = new BSTNode(70);
        validRoot->left->left = new BSTNode(20);
        validRoot->left->right = new BSTNode(40);
        validRoot->right->left = new BSTNode(60);
        validRoot->right->right = new BSTNode(80);
        
        cout << "\n🧪 Testing BST Validation:" << endl;
        cout << "Valid BST test: " << (isValidBST(validRoot) ? "PASS ✅" : "FAIL ❌") << endl;
        
        // Create an invalid BST
        BSTNode* invalidRoot = new BSTNode(50);
        invalidRoot->left = new BSTNode(30);
        invalidRoot->right = new BSTNode(70);
        invalidRoot->left->left = new BSTNode(20);
        invalidRoot->left->right = new BSTNode(60);  // Invalid: 60 > 50 but in left subtree
        
        cout << "Invalid BST test: " << (isValidBST(invalidRoot) ? "FAIL ❌" : "PASS ✅") << endl;
    }
};

int main() {
    BSTValidator validator;
    validator.demonstrateBSTProperty();
    validator.testBSTValidation();
    
    return 0;
}
```

### 📊 BST vs Regular Binary Tree

```
Regular Binary Tree (No Order):
        5
       / \
      8   3
     / \   \
    2   7   9

BST (Ordered):
        5
       / \
      3   8
     /   / \
    2   7   9

Key Difference:
- Regular: No ordering rule
- BST: Left < Root < Right (for every node)
```

---

## Basic BST Operations

### 🔍 Search Operation

```cpp
#include <iostream>
using namespace std;

class BST {
private:
    struct Node {
        int data;
        Node* left;
        Node* right;
        
        Node(int value) : data(value), left(nullptr), right(nullptr) {}
    };
    
    Node* root;
    
public:
    BST() : root(nullptr) {}
    
    // Search for a value (like looking up a word in dictionary)
    bool search(int value) {
        return searchHelper(root, value);
    }
    
    bool searchHelper(Node* node, int value) {
        // Base case: reached end or found the value
        if (node == nullptr) {
            return false;  // Value not found
        }
        
        if (node->data == value) {
            cout << "🎯 Found " << value << "!" << endl;
            return true;   // Value found
        }
        
        // Decide which direction to go
        if (value < node->data) {
            cout << "🔍 " << value << " < " << node->data << ", going left..." << endl;
            return searchHelper(node->left, value);
        } else {
            cout << "🔍 " << value << " > " << node->data << ", going right..." << endl;
            return searchHelper(node->right, value);
        }
    }
    
    // Insert a new value (like adding a new book to library)
    void insert(int value) {
        root = insertHelper(root, value);
    }
    
    Node* insertHelper(Node* node, int value) {
        // Base case: found the spot to insert
        if (node == nullptr) {
            cout << "📚 Inserted " << value << " at new position" << endl;
            return new Node(value);
        }
        
        // Decide where to insert
        if (value < node->data) {
            cout << "📍 " << value << " < " << node->data << ", inserting in left subtree" << endl;
            node->left = insertHelper(node->left, value);
        } else if (value > node->data) {
            cout << "📍 " << value << " > " << node->data << ", inserting in right subtree" << endl;
            node->right = insertHelper(node->right, value);
        } else {
            cout << "⚠️ " << value << " already exists, no insertion needed" << endl;
        }
        
        return node;
    }
    
    // In-order traversal (gives sorted order!)
    void inorderTraversal() {
        cout << "\n📋 BST in sorted order: ";
        inorderHelper(root);
        cout << endl;
    }
    
    void inorderHelper(Node* node) {
        if (node == nullptr) return;
        
        inorderHelper(node->left);   // Visit left subtree
        cout << node->data << " ";   // Visit root
        inorderHelper(node->right);  // Visit right subtree
    }
    
    // Find minimum value (leftmost node)
    int findMin() {
        if (root == nullptr) {
            cout << "❌ Tree is empty!" << endl;
            return -1;
        }
        
        Node* current = root;
        while (current->left != nullptr) {
            current = current->left;
        }
        
        cout << "📉 Minimum value: " << current->data << endl;
        return current->data;
    }
    
    // Find maximum value (rightmost node)
    int findMax() {
        if (root == nullptr) {
            cout << "❌ Tree is empty!" << endl;
            return -1;
        }
        
        Node* current = root;
        while (current->right != nullptr) {
            current = current->right;
        }
        
        cout << "📈 Maximum value: " << current->data << endl;
        return current->data;
    }
    
    void demonstrateOperations() {
        cout << "🌳 BST Operations Demo" << endl;
        cout << "=====================" << endl;
        
        // Insert values
        cout << "\n📚 Building library catalog:" << endl;
        insert(50);  // Root
        insert(30);  // Left subtree
        insert(70);  // Right subtree
        insert(20);
        insert(40);
        insert(60);
        insert(80);
        
        // Show sorted order
        inorderTraversal();
        
        // Find min/max
        cout << "\n📊 Finding extremes:" << endl;
        findMin();
        findMax();
        
        // Search for values
        cout << "\n🔍 Searching for books:" << endl;
        search(40);  // Should find
        search(25);  // Should not find
        search(70);  // Should find
    }
};

int main() {
    BST library;
    library.demonstrateOperations();
    
    return 0;
}
```

### ❌ Delete Operation

```cpp
class BSTWithDeletion : public BST {
public:
    void deleteValue(int value) {
        root = deleteHelper(root, value);
    }
    
private:
    Node* deleteHelper(Node* node, int value) {
        if (node == nullptr) {
            cout << "❌ Value " << value << " not found for deletion" << endl;
            return node;
        }
        
        // Find the node to delete
        if (value < node->data) {
            node->left = deleteHelper(node->left, value);
        } else if (value > node->data) {
            node->right = deleteHelper(node->right, value);
        } else {
            // Found the node to delete
            cout << "🗑️ Deleting " << value << endl;
            
            // Case 1: Node has no children (leaf)
            if (node->left == nullptr && node->right == nullptr) {
                cout << "   Case 1: Leaf node - simple deletion" << endl;
                delete node;
                return nullptr;
            }
            
            // Case 2: Node has one child
            else if (node->left == nullptr) {
                cout << "   Case 2: Node with right child only" << endl;
                Node* temp = node->right;
                delete node;
                return temp;
            } else if (node->right == nullptr) {
                cout << "   Case 2: Node with left child only" << endl;
                Node* temp = node->left;
                delete node;
                return temp;
            }
            
            // Case 3: Node has two children
            else {
                cout << "   Case 3: Node with two children" << endl;
                
                // Find inorder successor (smallest in right subtree)
                Node* successor = findMinNode(node->right);
                cout << "   Replacing with successor: " << successor->data << endl;
                
                // Replace current node's data with successor's data
                node->data = successor->data;
                
                // Delete the successor
                node->right = deleteHelper(node->right, successor->data);
            }
        }
        
        return node;
    }
    
    Node* findMinNode(Node* node) {
        while (node->left != nullptr) {
            node = node->left;
        }
        return node;
    }
    
public:
    void demonstrateDeletion() {
        cout << "\n🗑️ BST Deletion Demo" << endl;
        cout << "====================" << endl;
        
        // Build a tree
        insert(50);
        insert(30);
        insert(70);
        insert(20);
        insert(40);
        insert(60);
        insert(80);
        insert(35);
        insert(45);
        
        cout << "\nOriginal tree:" << endl;
        inorderTraversal();
        
        // Delete leaf node
        cout << "\n🍃 Deleting leaf node (35):" << endl;
        deleteValue(35);
        inorderTraversal();
        
        // Delete node with one child
        cout << "\n🌿 Deleting node with one child (20):" << endl;
        deleteValue(20);
        inorderTraversal();
        
        // Delete node with two children
        cout << "\n🌳 Deleting node with two children (30):" << endl;
        deleteValue(30);
        inorderTraversal();
    }
};

int main() {
    BSTWithDeletion advancedBST;
    advancedBST.demonstrateDeletion();
    
    return 0;
}
```

---

## Advanced Operations

### 🎯 Range Queries and Tree Statistics

```cpp
#include <iostream>
#include <vector>
using namespace std;

class AdvancedBST {
private:
    struct Node {
        int data;
        Node* left;
        Node* right;
        
        Node(int value) : data(value), left(nullptr), right(nullptr) {}
    };
    
    Node* root;
    
public:
    AdvancedBST() : root(nullptr) {}
    
    void insert(int value) {
        root = insertHelper(root, value);
    }
    
    Node* insertHelper(Node* node, int value) {
        if (node == nullptr) {
            return new Node(value);
        }
        
        if (value < node->data) {
            node->left = insertHelper(node->left, value);
        } else if (value > node->data) {
            node->right = insertHelper(node->right, value);
        }
        
        return node;
    }
    
    // Find all values in a range [min, max]
    vector<int> rangeQuery(int minVal, int maxVal) {
        vector<int> result;
        rangeQueryHelper(root, minVal, maxVal, result);
        return result;
    }
    
    void rangeQueryHelper(Node* node, int minVal, int maxVal, vector<int>& result) {
        if (node == nullptr) return;
        
        // If current node is in range, add it
        if (node->data >= minVal && node->data <= maxVal) {
            result.push_back(node->data);
        }
        
        // Recursively search left subtree if there might be values in range
        if (node->data > minVal) {
            rangeQueryHelper(node->left, minVal, maxVal, result);
        }
        
        // Recursively search right subtree if there might be values in range
        if (node->data < maxVal) {
            rangeQueryHelper(node->right, minVal, maxVal, result);
        }
    }
    
    // Find k-th smallest element
    int kthSmallest(int k) {
        int count = 0;
        return kthSmallestHelper(root, k, count);
    }
    
    int kthSmallestHelper(Node* node, int k, int& count) {
        if (node == nullptr) return -1;
        
        // Search in left subtree first (smaller values)
        int leftResult = kthSmallestHelper(node->left, k, count);
        if (leftResult != -1) return leftResult;
        
        // Process current node
        count++;
        if (count == k) return node->data;
        
        // Search in right subtree
        return kthSmallestHelper(node->right, k, count);
    }
    
    // Calculate tree height
    int getHeight() {
        return getHeightHelper(root);
    }
    
    int getHeightHelper(Node* node) {
        if (node == nullptr) return 0;
        return 1 + max(getHeightHelper(node->left), getHeightHelper(node->right));
    }
    
    // Count total nodes
    int countNodes() {
        return countNodesHelper(root);
    }
    
    int countNodesHelper(Node* node) {
        if (node == nullptr) return 0;
        return 1 + countNodesHelper(node->left) + countNodesHelper(node->right);
    }
    
    // Check if tree is balanced
    bool isBalanced() {
        return isBalancedHelper(root) != -1;
    }
    
    int isBalancedHelper(Node* node) {
        if (node == nullptr) return 0;
        
        int leftHeight = isBalancedHelper(node->left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = isBalancedHelper(node->right);
        if (rightHeight == -1) return -1;
        
        if (abs(leftHeight - rightHeight) > 1) return -1;
        
        return 1 + max(leftHeight, rightHeight);
    }
    
    void demonstrateAdvancedOperations() {
        cout << "🎯 Advanced BST Operations" << endl;
        cout << "==========================" << endl;
        
        // Build a sample tree
        vector<int> values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        for (int val : values) {
            insert(val);
        }
        
        cout << "\nBuilt BST with values: ";
        for (int val : values) {
            cout << val << " ";
        }
        cout << endl;
        
        // Range query
        cout << "\n📊 Range Query [25, 60]:" << endl;
        vector<int> rangeResult = rangeQuery(25, 60);
        cout << "Values in range: ";
        for (int val : rangeResult) {
            cout << val << " ";
        }
        cout << endl;
        
        // K-th smallest
        cout << "\n🏆 Finding k-th smallest elements:" << endl;
        for (int k = 1; k <= 5; k++) {
            cout << k << "-th smallest: " << kthSmallest(k) << endl;
        }
        
        // Tree statistics
        cout << "\n📈 Tree Statistics:" << endl;
        cout << "Height: " << getHeight() << endl;
        cout << "Total nodes: " << countNodes() << endl;
        cout << "Is balanced: " << (isBalanced() ? "Yes ✅" : "No ❌") << endl;
    }
};

int main() {
    AdvancedBST advancedBST;
    advancedBST.demonstrateAdvancedOperations();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 📞 Phone Directory System

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Contact {
    string name;
    string phoneNumber;
    string email;
    
    Contact(string n, string phone, string mail) 
        : name(n), phoneNumber(phone), email(mail) {}
};

struct PhoneNode {
    Contact contact;
    PhoneNode* left;
    PhoneNode* right;
    
    PhoneNode(Contact c) : contact(c), left(nullptr), right(nullptr) {}
};

class PhoneDirectory {
private:
    PhoneNode* root;
    
public:
    PhoneDirectory() : root(nullptr) {}
    
    void addContact(string name, string phone, string email) {
        Contact newContact(name, phone, email);
        root = insertContact(root, newContact);
        cout << "📞 Added contact: " << name << endl;
    }
    
    PhoneNode* insertContact(PhoneNode* node, Contact contact) {
        if (node == nullptr) {
            return new PhoneNode(contact);
        }
        
        if (contact.name < node->contact.name) {
            node->left = insertContact(node->left, contact);
        } else if (contact.name > node->contact.name) {
            node->right = insertContact(node->right, contact);
        } else {
            // Update existing contact
            node->contact = contact;
            cout << "📝 Updated existing contact: " << contact.name << endl;
        }
        
        return node;
    }
    
    Contact* searchContact(string name) {
        PhoneNode* result = searchHelper(root, name);
        return result ? &(result->contact) : nullptr;
    }
    
    PhoneNode* searchHelper(PhoneNode* node, string name) {
        if (node == nullptr || node->contact.name == name) {
            return node;
        }
        
        if (name < node->contact.name) {
            return searchHelper(node->left, name);
        } else {
            return searchHelper(node->right, name);
        }
    }
    
    void displayAllContacts() {
        cout << "\n📋 All Contacts (Alphabetical Order):" << endl;
        cout << "=====================================" << endl;
        displayInOrder(root);
    }
    
    void displayInOrder(PhoneNode* node) {
        if (node == nullptr) return;
        
        displayInOrder(node->left);
        cout << "👤 " << node->contact.name 
             << " | 📞 " << node->contact.phoneNumber 
             << " | 📧 " << node->contact.email << endl;
        displayInOrder(node->right);
    }
    
    void findContact(string name) {
        cout << "\n🔍 Searching for: " << name << endl;
        Contact* contact = searchContact(name);
        
        if (contact) {
            cout << "✅ Found contact:" << endl;
            cout << "   Name: " << contact->name << endl;
            cout << "   Phone: " << contact->phoneNumber << endl;
            cout << "   Email: " << contact->email << endl;
        } else {
            cout << "❌ Contact not found!" << endl;
        }
    }
};

int main() {
    PhoneDirectory directory;
    
    cout << "📞 Phone Directory System (BST)" << endl;
    cout << "===============================" << endl;
    
    // Add contacts
    directory.addContact("Alice Johnson", "555-0101", "alice@email.com");
    directory.addContact("Bob Smith", "555-0102", "bob@email.com");
    directory.addContact("Charlie Brown", "555-0103", "charlie@email.com");
    directory.addContact("Diana Prince", "555-0104", "diana@email.com");
    directory.addContact("Eve Wilson", "555-0105", "eve@email.com");
    
    // Display all contacts
    directory.displayAllContacts();
    
    // Search for specific contacts
    directory.findContact("Charlie Brown");
    directory.findContact("Frank Miller");
    directory.findContact("Alice Johnson");
    
    return 0;
}
```

### 2. 🏪 Inventory Management System

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Product {
    int productId;
    string name;
    double price;
    int quantity;
    
    Product(int id, string n, double p, int q) 
        : productId(id), name(n), price(p), quantity(q) {}
};

struct InventoryNode {
    Product product;
    InventoryNode* left;
    InventoryNode* right;
    
    InventoryNode(Product p) : product(p), left(nullptr), right(nullptr) {}
};

class InventorySystem {
private:
    InventoryNode* root;
    
public:
    InventorySystem() : root(nullptr) {}
    
    void addProduct(int id, string name, double price, int quantity) {
        Product newProduct(id, name, price, quantity);
        root = insertProduct(root, newProduct);
        cout << "📦 Added product: " << name << " (ID: " << id << ")" << endl;
    }
    
    InventoryNode* insertProduct(InventoryNode* node, Product product) {
        if (node == nullptr) {
            return new InventoryNode(product);
        }
        
        if (product.productId < node->product.productId) {
            node->left = insertProduct(node->left, product);
        } else if (product.productId > node->product.productId) {
            node->right = insertProduct(node->right, product);
        } else {
            // Update existing product
            node->product = product;
            cout << "📝 Updated product ID: " << product.productId << endl;
        }
        
        return node;
    }
    
    Product* findProduct(int productId) {
        InventoryNode* result = searchHelper(root, productId);
        return result ? &(result->product) : nullptr;
    }
    
    InventoryNode* searchHelper(InventoryNode* node, int productId) {
        if (node == nullptr || node->product.productId == productId) {
            return node;
        }
        
        if (productId < node->product.productId) {
            return searchHelper(node->left, productId);
        } else {
            return searchHelper(node->right, productId);
        }
    }
    
    void updateStock(int productId, int newQuantity) {
        Product* product = findProduct(productId);
        if (product) {
            int oldQuantity = product->quantity;
            product->quantity = newQuantity;
            cout << "📊 Updated stock for " << product->name 
                 << ": " << oldQuantity << " → " << newQuantity << endl;
        } else {
            cout << "❌ Product ID " << productId << " not found!" << endl;
        }
    }
    
    void displayInventory() {
        cout << "\n📋 Current Inventory (by Product ID):" << endl;
        cout << "=====================================" << endl;
        displayInOrder(root);
    }
    
    void displayInOrder(InventoryNode* node) {
        if (node == nullptr) return;
        
        displayInOrder(node->left);
        cout << "🏷️ ID: " << node->product.productId 
             << " | " << node->product.name 
             << " | $" << node->product.price 
             << " | Stock: " << node->product.quantity << endl;
        displayInOrder(node->right);
    }
    
    void searchProduct(int productId) {
        cout << "\n🔍 Searching for Product ID: " << productId << endl;
        Product* product = findProduct(productId);
        
        if (product) {
            cout << "✅ Product found:" << endl;
            cout << "   ID: " << product->productId << endl;
            cout << "   Name: " << product->name << endl;
            cout << "   Price: $" << product->price << endl;
            cout << "   Stock: " << product->quantity << endl;
        } else {
            cout << "❌ Product not found!" << endl;
        }
    }
};

int main() {
    InventorySystem inventory;
    
    cout << "🏪 Inventory Management System (BST)" << endl;
    cout << "====================================" << endl;
    
    // Add products
    inventory.addProduct(150, "Laptop", 999.99, 25);
    inventory.addProduct(75, "Mouse", 29.99, 100);
    inventory.addProduct(200, "Monitor", 299.99, 15);
    inventory.addProduct(50, "Keyboard", 79.99, 50);
    inventory.addProduct(300, "Printer", 199.99, 8);
    
    // Display inventory
    inventory.displayInventory();
    
    // Search for products
    inventory.searchProduct(150);
    inventory.searchProduct(999);
    
    // Update stock
    cout << "\n📦 Stock Updates:" << endl;
    inventory.updateStock(75, 85);  // Mouse stock update
    inventory.updateStock(200, 20); // Monitor stock update
    
    // Display updated inventory
    inventory.displayInventory();
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 🔍 BST Validation

**Story**: You're auditing different organizational systems to ensure they follow proper BST rules.

```cpp
#include <iostream>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BSTValidator {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (node == nullptr) return true;
        
        if (node->val <= minVal || node->val >= maxVal) {
            return false;
        }
        
        return validate(node->left, minVal, node->val) && 
               validate(node->right, node->val, maxVal);
    }
    
    void testValidation() {
        cout << "🔍 BST Validation Test" << endl;
        cout << "=====================" << endl;
        
        // Test case 1: Valid BST
        TreeNode* validBST = new TreeNode(5);
        validBST->left = new TreeNode(3);
        validBST->right = new TreeNode(8);
        validBST->left->left = new TreeNode(2);
        validBST->left->right = new TreeNode(4);
        validBST->right->left = new TreeNode(7);
        validBST->right->right = new TreeNode(9);
        
        cout << "Test 1 - Valid BST: " << (isValidBST(validBST) ? "PASS ✅" : "FAIL ❌") << endl;
        
        // Test case 2: Invalid BST
        TreeNode* invalidBST = new TreeNode(5);
        invalidBST->left = new TreeNode(3);
        invalidBST->right = new TreeNode(8);
        invalidBST->left->left = new TreeNode(2);
        invalidBST->left->right = new TreeNode(6);  // Invalid: 6 > 5 but in left subtree
        
        cout << "Test 2 - Invalid BST: " << (isValidBST(invalidBST) ? "FAIL ❌" : "PASS ✅") << endl;
    }
};

int main() {
    BSTValidator validator;
    validator.testValidation();
    
    return 0;
}
```

### Problem 2: 🎯 Lowest Common Ancestor

**Story**: In a company hierarchy (BST), find the lowest common manager of two employees.

```cpp
#include <iostream>
using namespace std;

class LCAFinder {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (root == nullptr) return nullptr;
        
        // If both nodes are smaller, LCA is in left subtree
        if (p->val < root->val && q->val < root->val) {
            return lowestCommonAncestor(root->left, p, q);
        }
        
        // If both nodes are larger, LCA is in right subtree
        if (p->val > root->val && q->val > root->val) {
            return lowestCommonAncestor(root->right, p, q);
        }
        
        // If one is smaller and one is larger, current node is LCA
        return root;
    }
    
    void demonstrateLCA() {
        cout << "\n🎯 Lowest Common Ancestor Demo" << endl;
        cout << "==============================" << endl;
        
        // Build company hierarchy
        TreeNode* ceo = new TreeNode(50);        // CEO
        TreeNode* cto = new TreeNode(30);        // CTO
        TreeNode* cfo = new TreeNode(70);        // CFO
        TreeNode* dev1 = new TreeNode(20);       // Developer 1
        TreeNode* dev2 = new TreeNode(40);       // Developer 2
        TreeNode* acc1 = new TreeNode(60);       // Accountant 1
        TreeNode* acc2 = new TreeNode(80);       // Accountant 2
        
        ceo->left = cto;
        ceo->right = cfo;
        cto->left = dev1;
        cto->right = dev2;
        cfo->left = acc1;
        cfo->right = acc2;
        
        cout << "Company Hierarchy:" << endl;
        cout << "        CEO(50)" << endl;
        cout << "       /       \\" << endl;
        cout << "   CTO(30)   CFO(70)" << endl;
        cout << "   /    \\     /    \\" << endl;
        cout << "Dev1(20) Dev2(40) Acc1(60) Acc2(80)" << endl;
        cout << endl;
        
        // Find LCA of different employee pairs
        TreeNode* lca1 = lowestCommonAncestor(ceo, dev1, dev2);
        cout << "LCA of Dev1(20) and Dev2(40): " << lca1->val << " (CTO)" << endl;
        
        TreeNode* lca2 = lowestCommonAncestor(ceo, dev1, acc1);
        cout << "LCA of Dev1(20) and Acc1(60): " << lca2->val << " (CEO)" << endl;
        
        TreeNode* lca3 = lowestCommonAncestor(ceo, acc1, acc2);
        cout << "LCA of Acc1(60) and Acc2(80): " << lca3->val << " (CFO)" << endl;
    }
};

int main() {
    LCAFinder lcaFinder;
    lcaFinder.demonstrateLCA();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### BST Fundamentals
1. **Ordered Structure**: Left < Root < Right for every node
2. **Efficient Search**: O(log n) average case, O(n) worst case
3. **In-order Traversal**: Gives sorted sequence
4. **Dynamic Operations**: Insert, delete, search efficiently
5. **Self-Organizing**: Maintains order automatically

### Time Complexities
- **Search**: O(log n) average, O(n) worst case (skewed tree)
- **Insertion**: O(log n) average, O(n) worst case
- **Deletion**: O(log n) average, O(n) worst case
- **Traversal**: O(n) - must visit all nodes
- **Min/Max**: O(log n) average, O(n) worst case

### Space Complexity
- **Storage**: O(n) for n nodes
- **Recursion**: O(log n) average, O(n) worst case (for recursive operations)

### BST Properties
1. **Binary Tree**: Each node has at most 2 children
2. **Search Property**: Left subtree < root < right subtree
3. **Recursive Definition**: Every subtree is also a BST
4. **Unique Path**: Only one path from root to any node

### When to Use BSTs
✅ **Perfect for:**
- Maintaining sorted data with frequent insertions/deletions
- Range queries (find all elements between x and y)
- Finding k-th smallest/largest elements
- Dictionary/map implementations
- Database indexing

❌ **Not suitable for:**
- When you need guaranteed O(log n) (use balanced trees like AVL/Red-Black)
- Frequent random access by index
- When data doesn't have natural ordering
- Memory-constrained environments (extra pointer overhead)

### Common Pitfalls
1. **Skewed Trees**: Can degrade to O(n) operations
2. **Duplicate Handling**: Need clear policy for equal values
3. **Deletion Complexity**: Three cases to handle correctly
4. **Validation**: Ensuring BST property is maintained

### Real-World Applications
1. **📞 Phone Directories**: Fast name-based lookups
2. **🏪 Inventory Systems**: Product ID-based organization
3. **📊 Database Indexing**: B-trees (generalized BSTs)
4. **🔍 Search Engines**: Organizing and ranking results
5. **📁 File Systems**: Directory structures
6. **🎮 Game Development**: Spatial partitioning, collision detection

---

## 🚀 What's Next?

Excellent! You've mastered Binary Search Trees and understand how they organize data for efficient searching like a well-organized library. Next, let's explore [Heaps](03_Tree_Structures/10_Heaps.md) - special trees that maintain priority order, perfect for scenarios like hospital emergency rooms where the most critical patients get treated first!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Search in BST, insert into BST, minimum distance between BST nodes
2. **Medium**: Validate BST, lowest common ancestor, convert sorted array to BST
3. **Hard**: Recover BST, largest BST subtree, serialize and deserialize BST

### Tips for Success
1. **Master the BST Property**: Left < Root < Right for every node
2. **Think Recursively**: BST operations naturally use recursion
3. **Handle Edge Cases**: Empty trees, single nodes, duplicate values
4. **Practice Tree Traversals**: In-order gives sorted sequence in BST
5. **Understand Balancing**: Know when BST degrades to linked list

### Common Patterns
1. **Binary Search**: Use BST property to eliminate half the search space
2. **In-order Traversal**: For sorted operations and validation
3. **Recursive Structure**: Most operations follow similar recursive pattern
4. **Range Queries**: Efficiently find elements in a range
5. **Predecessor/Successor**: Finding next smaller/larger elements

**Remember: BSTs are like organized libraries - everything has its proper place, making searches incredibly fast when the system is well-balanced!** 📚
