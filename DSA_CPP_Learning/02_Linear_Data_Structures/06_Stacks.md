# Stacks - Last In, First Out (Like a Stack of Plates)

## 🌟 Real-World Story: The Cafeteria Plate Stack

Picture yourself in a busy cafeteria! 🍽️

There's a **stack of clean plates** at the serving counter. When you need a plate:
- You take the **top plate** (the last one placed)
- When staff cleans plates, they add them to the **top of the stack**
- You **never** take a plate from the middle or bottom - that would cause all plates above to fall!

```
    ┌─────┐  ← Take from here (TOP)
    │Plate│
    ├─────┤
    │Plate│
    ├─────┤
    │Plate│
    ├─────┤
    │Plate│
    └─────┘  ← Bottom (never touch directly)
```

This is exactly how a **Stack** works! It follows the **LIFO** principle:
- **L**ast **I**n, **F**irst **O**ut
- You can only add (push) or remove (pop) from the **top**
- Just like plates, books, or pancakes stacked on top of each other!

## 🎯 What You'll Learn
- Understanding stacks through everyday analogies
- Stack operations with visual examples
- Implementation using arrays and linked lists
- Real-world applications of stacks
- Common stack problems and solutions

---

## 📝 Table of Contents
1. [Why Stacks Matter](#why-stacks-matter)
2. [Stack Operations - The Plate Example](#stack-operations---the-plate-example)
3. [Implementation Methods](#implementation-methods)
4. [Real-World Applications](#real-world-applications)
5. [Common Stack Problems](#common-stack-problems)
6. [Practice Problems](#practice-problems)

---

## Why Stacks Matter

### 📚 The Book Stack Problem

**Scenario**: You're organizing books on your desk.

**The Natural Way (Stack Behavior)**:
- You place books one on top of another
- To get a book from the middle, you must first remove all books above it
- The last book you placed is the first one you can access
- This is exactly how computer memory and function calls work!

```
Reading Order (LIFO):
┌─────────────┐  ← 3rd: "Data Structures" (read first)
│Book 3       │
├─────────────┤
│Book 2       │  ← 2nd: "Algorithms"
├─────────────┤
│Book 1       │  ← 1st: "C++ Basics" (read last)
└─────────────┘
```

### 🥞 The Pancake Stack Analogy

**Making Pancakes**:
- You cook pancakes one by one
- Each new pancake goes on **top** of the stack
- You eat from the **top** (the freshest pancake first)
- The first pancake you made is at the bottom (eaten last)

**Why This Matters in Programming**:
- **Function calls**: When function A calls function B, B goes on top of the call stack
- **Undo operations**: Last action performed is the first one to be undone
- **Browser history**: Back button removes the most recent page first

---

## Stack Operations - The Plate Example

Let's implement a stack using our cafeteria plate analogy:

### 🍽️ Basic Stack Implementation

```cpp
#include <iostream>
#include <vector>
using namespace std;

class PlateStack {
private:
    vector<string> plates;  // Our stack of plates
    int maxCapacity;        // Maximum plates the stack can hold
    
public:
    PlateStack(int capacity = 10) {
        maxCapacity = capacity;
        cout << "🍽️ Created a plate stack with capacity: " << capacity << endl;
    }
    
    // PUSH: Add a plate to the top
    void push(string plateType) {
        if (isFull()) {
            cout << "❌ Stack overflow! Can't add more plates - stack is full!" << endl;
            return;
        }
        
        plates.push_back(plateType);
        cout << "📥 Added " << plateType << " plate to the top!" << endl;
        cout << "   Stack height: " << plates.size() << endl;
    }
    
    // POP: Remove the top plate
    string pop() {
        if (isEmpty()) {
            cout << "❌ Stack underflow! No plates to remove!" << endl;
            return "";
        }
        
        string topPlate = plates.back();
        plates.pop_back();
        cout << "📤 Removed " << topPlate << " plate from the top!" << endl;
        cout << "   Stack height: " << plates.size() << endl;
        
        return topPlate;
    }
    
    // PEEK/TOP: Look at the top plate without removing it
    string peek() {
        if (isEmpty()) {
            cout << "👀 No plates to peek at - stack is empty!" << endl;
            return "";
        }
        
        string topPlate = plates.back();
        cout << "👀 Top plate is: " << topPlate << endl;
        return topPlate;
    }
    
    // Check if stack is empty
    bool isEmpty() {
        return plates.empty();
    }
    
    // Check if stack is full
    bool isFull() {
        return plates.size() >= maxCapacity;
    }
    
    // Get current size
    int size() {
        return plates.size();
    }
    
    // Display the entire stack
    void displayStack() {
        if (isEmpty()) {
            cout << "🍽️ Plate stack is empty!" << endl;
            return;
        }
        
        cout << "\n🍽️ Current Plate Stack (top to bottom):" << endl;
        cout << "=================================" << endl;
        
        for (int i = plates.size() - 1; i >= 0; i--) {
            cout << "│ " << plates[i] << " │";
            if (i == plates.size() - 1) {
                cout << " ← TOP";
            }
            cout << endl;
        }
        cout << "└─────────────┘" << endl;
        cout << "Height: " << plates.size() << "/" << maxCapacity << endl;
    }
};

int main() {
    PlateStack cafeteriaStack(5);
    
    cout << "\n🍽️ Cafeteria Plate Stack Simulation" << endl;
    cout << "====================================" << endl;
    
    // Adding plates (PUSH operations)
    cout << "\n📥 Staff adding clean plates:" << endl;
    cafeteriaStack.push("White Dinner");
    cafeteriaStack.push("Blue Salad");
    cafeteriaStack.push("Red Dessert");
    
    cafeteriaStack.displayStack();
    
    // Checking top plate (PEEK operation)
    cout << "\n👀 Customer checking top plate:" << endl;
    cafeteriaStack.peek();
    
    // Taking plates (POP operations)
    cout << "\n📤 Customers taking plates:" << endl;
    cafeteriaStack.pop();  // Customer takes red dessert plate
    cafeteriaStack.pop();  // Customer takes blue salad plate
    
    cafeteriaStack.displayStack();
    
    // Adding more plates
    cout << "\n📥 Adding more plates:" << endl;
    cafeteriaStack.push("Green Soup");
    cafeteriaStack.push("Yellow Bread");
    
    cafeteriaStack.displayStack();
    
    return 0;
}
```

**Output:**
```
🍽️ Created a plate stack with capacity: 5

🍽️ Cafeteria Plate Stack Simulation
====================================

📥 Staff adding clean plates:
📥 Added White Dinner plate to the top!
   Stack height: 1
📥 Added Blue Salad plate to the top!
   Stack height: 2
📥 Added Red Dessert plate to the top!
   Stack height: 3

🍽️ Current Plate Stack (top to bottom):
=================================
│ Red Dessert │ ← TOP
│ Blue Salad │
│ White Dinner │
└─────────────┘
Height: 3/5

👀 Customer checking top plate:
👀 Top plate is: Red Dessert

📤 Customers taking plates:
📤 Removed Red Dessert plate from the top!
   Stack height: 2
📤 Removed Blue Salad plate from the top!
   Stack height: 1
```

### 🔍 Understanding Stack Memory Layout

```
Stack Growth (PUSH operations):

Step 1: push("A")     Step 2: push("B")     Step 3: push("C")
┌─────┐               ┌─────┐               ┌─────┐ ← TOP
│  A  │ ← TOP         │  B  │ ← TOP         │  C  │
└─────┘               ├─────┤               ├─────┤
                      │  A  │               │  B  │
                      └─────┘               ├─────┤
                                           │  A  │
                                           └─────┘

Stack Shrinking (POP operations):

Step 4: pop() → "C"   Step 5: pop() → "B"   Step 6: pop() → "A"
┌─────┐               ┌─────┐               
│  B  │ ← TOP         │  A  │ ← TOP         (empty stack)
├─────┤               └─────┘               
│  A  │                                     
└─────┘                                     
```

---

## Implementation Methods

### 1. 🗃️ Array-Based Stack Implementation

```cpp
#include <iostream>
using namespace std;

class ArrayStack {
private:
    int* stackArray;
    int topIndex;
    int maxSize;
    
public:
    ArrayStack(int size) {
        maxSize = size;
        stackArray = new int[maxSize];
        topIndex = -1;  // Empty stack
        cout << "📦 Created array-based stack with size: " << size << endl;
    }
    
    ~ArrayStack() {
        delete[] stackArray;
    }
    
    void push(int value) {
        if (topIndex >= maxSize - 1) {
            cout << "❌ Stack Overflow! Cannot push " << value << endl;
            return;
        }
        
        topIndex++;
        stackArray[topIndex] = value;
        cout << "📥 Pushed " << value << " at position " << topIndex << endl;
    }
    
    int pop() {
        if (topIndex < 0) {
            cout << "❌ Stack Underflow! Cannot pop from empty stack" << endl;
            return -1;
        }
        
        int value = stackArray[topIndex];
        topIndex--;
        cout << "📤 Popped " << value << endl;
        return value;
    }
    
    int peek() {
        if (topIndex < 0) {
            cout << "👀 Stack is empty!" << endl;
            return -1;
        }
        
        return stackArray[topIndex];
    }
    
    bool isEmpty() {
        return topIndex < 0;
    }
    
    bool isFull() {
        return topIndex >= maxSize - 1;
    }
    
    void display() {
        if (isEmpty()) {
            cout << "📦 Stack is empty!" << endl;
            return;
        }
        
        cout << "\n📦 Array Stack Contents:" << endl;
        for (int i = topIndex; i >= 0; i--) {
            cout << "│ " << stackArray[i] << " │";
            if (i == topIndex) cout << " ← TOP (index " << i << ")";
            cout << endl;
        }
        cout << "└───┘" << endl;
    }
};

int main() {
    ArrayStack stack(5);
    
    // Test operations
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();
    
    cout << "\nTop element: " << stack.peek() << endl;
    
    stack.pop();
    stack.pop();
    stack.display();
    
    return 0;
}
```

### 2. 🔗 Linked List-Based Stack Implementation

```cpp
#include <iostream>
using namespace std;

struct StackNode {
    int data;
    StackNode* next;
    
    StackNode(int value) {
        data = value;
        next = nullptr;
    }
};

class LinkedStack {
private:
    StackNode* topNode;
    int stackSize;
    
public:
    LinkedStack() {
        topNode = nullptr;
        stackSize = 0;
        cout << "🔗 Created linked list-based stack" << endl;
    }
    
    ~LinkedStack() {
        while (!isEmpty()) {
            pop();
        }
    }
    
    void push(int value) {
        StackNode* newNode = new StackNode(value);
        newNode->next = topNode;
        topNode = newNode;
        stackSize++;
        
        cout << "📥 Pushed " << value << " (stack size: " << stackSize << ")" << endl;
    }
    
    int pop() {
        if (isEmpty()) {
            cout << "❌ Cannot pop from empty stack!" << endl;
            return -1;
        }
        
        StackNode* nodeToDelete = topNode;
        int value = topNode->data;
        topNode = topNode->next;
        delete nodeToDelete;
        stackSize--;
        
        cout << "📤 Popped " << value << " (stack size: " << stackSize << ")" << endl;
        return value;
    }
    
    int peek() {
        if (isEmpty()) {
            cout << "👀 Stack is empty!" << endl;
            return -1;
        }
        
        return topNode->data;
    }
    
    bool isEmpty() {
        return topNode == nullptr;
    }
    
    int size() {
        return stackSize;
    }
    
    void display() {
        if (isEmpty()) {
            cout << "🔗 Stack is empty!" << endl;
            return;
        }
        
        cout << "\n🔗 Linked Stack Contents:" << endl;
        StackNode* current = topNode;
        int position = 0;
        
        while (current != nullptr) {
            cout << "│ " << current->data << " │";
            if (position == 0) cout << " ← TOP";
            cout << endl;
            current = current->next;
            position++;
        }
        cout << "└───┘" << endl;
        cout << "Size: " << stackSize << endl;
    }
};

int main() {
    LinkedStack stack;
    
    // Test operations
    stack.push(100);
    stack.push(200);
    stack.push(300);
    stack.display();
    
    cout << "\nTop element: " << stack.peek() << endl;
    
    stack.pop();
    stack.display();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🌐 Browser History (Back Button)

```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

class BrowserHistory {
private:
    stack<string> history;
    string currentPage;
    
public:
    BrowserHistory() {
        currentPage = "Home";
        cout << "🌐 Browser started at: " << currentPage << endl;
    }
    
    void visitPage(string url) {
        // Push current page to history before visiting new page
        history.push(currentPage);
        currentPage = url;
        cout << "🔗 Visited: " << currentPage << endl;
        cout << "   History depth: " << history.size() << endl;
    }
    
    void goBack() {
        if (history.empty()) {
            cout << "⬅️ Cannot go back - no history!" << endl;
            return;
        }
        
        cout << "⬅️ Going back from: " << currentPage;
        currentPage = history.top();
        history.pop();
        cout << " to: " << currentPage << endl;
        cout << "   History depth: " << history.size() << endl;
    }
    
    void showCurrentPage() {
        cout << "📍 Current page: " << currentPage << endl;
    }
    
    void showHistory() {
        if (history.empty()) {
            cout << "📚 No browsing history" << endl;
            return;
        }
        
        cout << "\n📚 Browsing History (most recent first):" << endl;
        stack<string> temp = history;  // Copy to display without modifying
        int position = 1;
        
        while (!temp.empty()) {
            cout << position << ". " << temp.top() << endl;
            temp.pop();
            position++;
        }
    }
};

int main() {
    BrowserHistory browser;
    
    cout << "\n🌐 Browser Navigation Simulation" << endl;
    cout << "=================================" << endl;
    
    // User browsing
    browser.visitPage("google.com");
    browser.visitPage("stackoverflow.com");
    browser.visitPage("github.com");
    browser.visitPage("youtube.com");
    
    browser.showCurrentPage();
    browser.showHistory();
    
    // User clicking back button
    cout << "\n⬅️ User clicking back button:" << endl;
    browser.goBack();
    browser.goBack();
    
    browser.showCurrentPage();
    browser.showHistory();
    
    return 0;
}
```

### 2. ↩️ Undo/Redo Operations (Text Editor)

```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

struct Action {
    string type;        // "type", "delete", "format"
    string content;     // What was typed/deleted
    int position;       // Where the action occurred
    
    Action(string t, string c, int p) : type(t), content(c), position(p) {}
};

class TextEditor {
private:
    string document;
    stack<Action> undoStack;
    stack<Action> redoStack;
    
public:
    TextEditor() {
        document = "";
        cout << "📝 Text Editor initialized" << endl;
    }
    
    void typeText(string text, int position = -1) {
        if (position == -1) position = document.length();
        
        // Clear redo stack when new action is performed
        while (!redoStack.empty()) redoStack.pop();
        
        // Save action for undo
        undoStack.push(Action("type", text, position));
        
        // Perform the action
        document.insert(position, text);
        cout << "⌨️ Typed: \"" << text << "\"" << endl;
        showDocument();
    }
    
    void deleteText(int position, int length) {
        if (position >= document.length()) return;
        
        // Clear redo stack
        while (!redoStack.empty()) redoStack.pop();
        
        // Save deleted text for undo
        string deletedText = document.substr(position, length);
        undoStack.push(Action("delete", deletedText, position));
        
        // Perform deletion
        document.erase(position, length);
        cout << "🗑️ Deleted: \"" << deletedText << "\" at position " << position << endl;
        showDocument();
    }
    
    void undo() {
        if (undoStack.empty()) {
            cout << "↩️ Nothing to undo!" << endl;
            return;
        }
        
        Action lastAction = undoStack.top();
        undoStack.pop();
        
        // Save for redo
        redoStack.push(lastAction);
        
        // Reverse the action
        if (lastAction.type == "type") {
            // Undo typing by deleting
            document.erase(lastAction.position, lastAction.content.length());
            cout << "↩️ Undid typing: \"" << lastAction.content << "\"" << endl;
        } else if (lastAction.type == "delete") {
            // Undo deletion by inserting back
            document.insert(lastAction.position, lastAction.content);
            cout << "↩️ Undid deletion: \"" << lastAction.content << "\"" << endl;
        }
        
        showDocument();
    }
    
    void redo() {
        if (redoStack.empty()) {
            cout << "↪️ Nothing to redo!" << endl;
            return;
        }
        
        Action actionToRedo = redoStack.top();
        redoStack.pop();
        
        // Save for undo again
        undoStack.push(actionToRedo);
        
        // Redo the action
        if (actionToRedo.type == "type") {
            document.insert(actionToRedo.position, actionToRedo.content);
            cout << "↪️ Redid typing: \"" << actionToRedo.content << "\"" << endl;
        } else if (actionToRedo.type == "delete") {
            document.erase(actionToRedo.position, actionToRedo.content.length());
            cout << "↪️ Redid deletion: \"" << actionToRedo.content << "\"" << endl;
        }
        
        showDocument();
    }
    
    void showDocument() {
        cout << "📄 Document: \"" << document << "\"" << endl;
        cout << "   Undo stack size: " << undoStack.size() 
             << ", Redo stack size: " << redoStack.size() << endl;
    }
};

int main() {
    TextEditor editor;
    
    cout << "\n📝 Text Editor with Undo/Redo" << endl;
    cout << "==============================" << endl;
    
    // User typing
    editor.typeText("Hello");
    editor.typeText(" World");
    editor.typeText("!");
    
    // User makes a mistake and deletes
    editor.deleteText(5, 6);  // Delete " World"
    editor.typeText(" C++");
    
    cout << "\n↩️ User pressing Ctrl+Z (Undo):" << endl;
    editor.undo();  // Undo " C++"
    editor.undo();  // Undo deletion of " World"
    
    cout << "\n↪️ User pressing Ctrl+Y (Redo):" << endl;
    editor.redo();  // Redo deletion
    editor.redo();  // Redo " C++"
    
    return 0;
}
```

### 3. 🧮 Expression Evaluation (Calculator)

```cpp
#include <iostream>
#include <stack>
#include <string>
#include <cctype>
using namespace std;

class Calculator {
private:
    // Check operator precedence
    int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return 0;
    }
    
    // Perform calculation
    int calculate(int a, int b, char op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return 0;
        }
    }
    
public:
    // Convert infix to postfix notation
    string infixToPostfix(string infix) {
        stack<char> operators;
        string postfix = "";
        
        cout << "🔄 Converting infix to postfix:" << endl;
        cout << "Infix: " << infix << endl;
        
        for (char c : infix) {
            if (isdigit(c)) {
                postfix += c;
                postfix += " ";
            } else if (c == '(') {
                operators.push(c);
            } else if (c == ')') {
                while (!operators.empty() && operators.top() != '(') {
                    postfix += operators.top();
                    postfix += " ";
                    operators.pop();
                }
                operators.pop();  // Remove '('
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                while (!operators.empty() && 
                       precedence(operators.top()) >= precedence(c)) {
                    postfix += operators.top();
                    postfix += " ";
                    operators.pop();
                }
                operators.push(c);
            }
        }
        
        while (!operators.empty()) {
            postfix += operators.top();
            postfix += " ";
            operators.pop();
        }
        
        cout << "Postfix: " << postfix << endl;
        return postfix;
    }
    
    // Evaluate postfix expression
    int evaluatePostfix(string postfix) {
        stack<int> operands;
        
        cout << "\n🧮 Evaluating postfix expression:" << endl;
        
        for (int i = 0; i < postfix.length(); i++) {
            char c = postfix[i];
            
            if (isdigit(c)) {
                operands.push(c - '0');
                cout << "📥 Pushed operand: " << (c - '0') << endl;
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                int b = operands.top(); operands.pop();
                int a = operands.top(); operands.pop();
                
                int result = calculate(a, b, c);
                operands.push(result);
                
                cout << "🔢 Calculated: " << a << " " << c << " " << b 
                     << " = " << result << endl;
            }
        }
        
        return operands.top();
    }
    
    int evaluateExpression(string expression) {
        cout << "\n🧮 Calculator: " << expression << endl;
        cout << "================================" << endl;
        
        string postfix = infixToPostfix(expression);
        int result = evaluatePostfix(postfix);
        
        cout << "\n✅ Final Result: " << result << endl;
        return result;
    }
};

int main() {
    Calculator calc;
    
    // Test expressions
    calc.evaluateExpression("3+4*2");
    cout << "\n" << string(40, '-') << endl;
    calc.evaluateExpression("(3+4)*2");
    cout << "\n" << string(40, '-') << endl;
    calc.evaluateExpression("2+3*4-1");
    
    return 0;
}
```

---

## Common Stack Problems

### Problem 1: 🔍 Balanced Parentheses Checker

**Story**: You're a code editor checking if parentheses are properly balanced in programming code.

```cpp
#include <iostream>
#include <stack>
#include <string>
#include <unordered_map>
using namespace std;

class ParenthesesChecker {
private:
    unordered_map<char, char> pairs = {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };
    
public:
    bool isBalanced(string expression) {
        stack<char> openBrackets;
        
        cout << "🔍 Checking: \"" << expression << "\"" << endl;
        
        for (int i = 0; i < expression.length(); i++) {
            char c = expression[i];
            
            // If it's an opening bracket
            if (c == '(' || c == '{' || c == '[') {
                openBrackets.push(c);
                cout << "📥 Found opening '" << c << "' at position " << i << endl;
            }
            // If it's a closing bracket
            else if (c == ')' || c == '}' || c == ']') {
                cout << "📤 Found closing '" << c << "' at position " << i;
                
                if (openBrackets.empty()) {
                    cout << " - ERROR: No matching opening bracket!" << endl;
                    return false;
                }
                
                char lastOpening = openBrackets.top();
                openBrackets.pop();
                
                if (pairs[c] != lastOpening) {
                    cout << " - ERROR: Doesn't match '" << lastOpening << "'!" << endl;
                    return false;
                }
                
                cout << " - Matches '" << lastOpening << "' ✅" << endl;
            }
        }
        
        if (!openBrackets.empty()) {
            cout << "❌ ERROR: " << openBrackets.size() 
                 << " unclosed opening bracket(s)!" << endl;
            return false;
        }
        
        cout << "✅ All brackets are balanced!" << endl;
        return true;
    }
};

int main() {
    ParenthesesChecker checker;
    
    cout << "🔍 Parentheses Balance Checker" << endl;
    cout << "==============================" << endl;
    
    vector<string> testCases = {
        "()",
        "()[]{}", 
        "((()))",
        "({[]})",
        "(()",
        "())",
        "({[}])",
        ""
    };
    
    for (string test : testCases) {
        cout << "\nTest: " << (test.empty() ? "(empty string)" : test) << endl;
        bool result = checker.isBalanced(test);
        cout << "Result: " << (result ? "BALANCED ✅" : "NOT BALANCED ❌") << endl;
        cout << string(40, '-') << endl;
    }
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: 📚 Book Stack Manager

**Story**: You're managing a stack of books in a library. Implement operations to add, remove, and find books.

```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

struct Book {
    string title;
    string author;
    int pages;
    
    Book(string t, string a, int p) : title(t), author(a), pages(p) {}
};

class BookStack {
private:
    stack<Book> books;
    
public:
    void addBook(string title, string author, int pages) {
        books.push(Book(title, author, pages));
        cout << "📚 Added: \"" << title << "\" by " << author 
             << " (" << pages << " pages)" << endl;
        cout << "   Stack height: " << books.size() << " books" << endl;
    }
    
    void removeTopBook() {
        if (books.empty()) {
            cout << "❌ No books to remove!" << endl;
            return;
        }
        
        Book topBook = books.top();
        books.pop();
        cout << "📤 Removed: \"" << topBook.title << "\" by " << topBook.author << endl;
        cout << "   Stack height: " << books.size() << " books" << endl;
    }
    
    void peekTopBook() {
        if (books.empty()) {
            cout << "👀 No books in the stack!" << endl;
            return;
        }
        
        Book topBook = books.top();
        cout << "👀 Top book: \"" << topBook.title << "\" by " << topBook.author 
             << " (" << topBook.pages << " pages)" << endl;
    }
    
    void displayStack() {
        if (books.empty()) {
            cout << "📚 Book stack is empty!" << endl;
            return;
        }
        
        cout << "\n📚 Current Book Stack (top to bottom):" << endl;
        cout << "======================================" << endl;
        
        stack<Book> temp = books;  // Copy to display without modifying
        int position = 1;
        
        while (!temp.empty()) {
            Book book = temp.top();
            temp.pop();
            cout << position << ". \"" << book.title << "\" by " << book.author 
                 << " (" << book.pages << " pages)";
            if (position == 1) cout << " ← TOP";
            cout << endl;
            position++;
        }
        cout << "Total books: " << books.size() << endl;
    }
    
    bool isEmpty() {
        return books.empty();
    }
    
    int size() {
        return books.size();
    }
};

int main() {
    BookStack library;
    
    cout << "📚 Library Book Stack Manager" << endl;
    cout << "=============================" << endl;
    
    // Adding books
    library.addBook("The C++ Programming Language", "Bjarne Stroustrup", 1376);
    library.addBook("Clean Code", "Robert Martin", 464);
    library.addBook("Design Patterns", "Gang of Four", 395);
    
    library.displayStack();
    
    // Checking top book
    cout << "\n👀 Checking top book:" << endl;
    library.peekTopBook();
    
    // Removing books
    cout << "\n📤 Students borrowing books:" << endl;
    library.removeTopBook();
    library.removeTopBook();
    
    library.displayStack();
    
    return 0;
}
```

### Problem 2: 🎮 Function Call Stack Simulator

**Story**: Simulate how programming languages manage function calls using a stack.

```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

struct FunctionCall {
    string functionName;
    string parameters;
    int lineNumber;
    
    FunctionCall(string name, string params, int line) 
        : functionName(name), parameters(params), lineNumber(line) {}
};

class CallStack {
private:
    stack<FunctionCall> callStack;
    
public:
    void callFunction(string name, string params, int line) {
        callStack.push(FunctionCall(name, params, line));
        cout << "📞 Called: " << name << "(" << params << ") at line " << line << endl;
        displayCallStack();
    }
    
    void returnFromFunction() {
        if (callStack.empty()) {
            cout << "❌ No function to return from!" << endl;
            return;
        }
        
        FunctionCall returning = callStack.top();
        callStack.pop();
        cout << "🔙 Returned from: " << returning.functionName << endl;
        displayCallStack();
    }
    
    void displayCallStack() {
        if (callStack.empty()) {
            cout << "📋 Call stack is empty" << endl;
            return;
        }
        
        cout << "\n📋 Current Call Stack:" << endl;
        cout << "=====================" << endl;
        
        stack<FunctionCall> temp = callStack;
        int depth = 0;
        
        while (!temp.empty()) {
            FunctionCall call = temp.top();
            temp.pop();
            
            for (int i = 0; i < depth; i++) cout << "  ";
            cout << "│ " << call.functionName << "(" << call.parameters << ")";
            if (depth == 0) cout << " ← CURRENT";
            cout << endl;
            depth++;
        }
        cout << "Stack depth: " << callStack.size() << endl;
    }
    
    void simulateStackOverflow() {
        cout << "\n💥 Simulating infinite recursion (stack overflow):" << endl;
        for (int i = 1; i <= 5; i++) {
            callFunction("recursiveFunction", "n=" + to_string(i), 10 + i);
        }
        cout << "💥 Stack Overflow! Too many function calls!" << endl;
    }
};

int main() {
    CallStack programStack;
    
    cout << "🎮 Function Call Stack Simulator" << endl;
    cout << "=================================" << endl;
    
    // Simulate a program execution
    programStack.callFunction("main", "", 1);
    programStack.callFunction("calculateSum", "a=5, b=3", 5);
    programStack.callFunction("add", "x=5, y=3", 12);
    
    cout << "\n🔙 Functions completing execution:" << endl;
    programStack.returnFromFunction();  // add returns
    programStack.returnFromFunction();  // calculateSum returns
    
    programStack.callFunction("printResult", "result=8", 7);
    programStack.returnFromFunction();  // printResult returns
    programStack.returnFromFunction();  // main returns
    
    // Demonstrate stack overflow
    programStack.simulateStackOverflow();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Stack Fundamentals
1. **LIFO Principle**: Last In, First Out - like a stack of plates
2. **Top Access Only**: Can only add/remove from the top
3. **Push Operation**: Add element to top - O(1)
4. **Pop Operation**: Remove element from top - O(1)
5. **Peek/Top**: Look at top element without removing - O(1)

### Time Complexities
- **Push**: O(1) - constant time
- **Pop**: O(1) - constant time  
- **Peek/Top**: O(1) - constant time
- **Search**: O(n) - must pop elements to search
- **Size**: O(1) - if we maintain a counter

### Space Complexity
- **O(n)** where n is the number of elements
- **Array implementation**: Fixed space, may waste memory
- **Linked list implementation**: Dynamic space, extra pointer overhead

### When to Use Stacks
✅ **Perfect for:**
- Function call management
- Undo/Redo operations
- Expression evaluation
- Backtracking algorithms
- Browser history
- Syntax parsing

❌ **Not suitable for:**
- Random access to elements
- Searching through all elements
- When you need FIFO behavior (use queue instead)

### Real-World Applications
1. **🌐 Web Browsers**: Back button functionality
2. **📝 Text Editors**: Undo/Redo operations
3. **🧮 Calculators**: Expression evaluation
4. **💻 Programming Languages**: Function call management
5. **🎮 Games**: Backtracking in puzzles and mazes
6. **📱 Mobile Apps**: Navigation stack

---

## 🚀 What's Next?

Excellent work! You've mastered stacks and learned how they work like plates in a cafeteria. Next, let's explore [Queues](02_Linear_Data_Structures/07_Queues.md) - a data structure that works like a line at a coffee shop where the first person in line gets served first!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Valid parentheses, implement stack using queues
2. **Medium**: Evaluate reverse Polish notation, next greater element
3. **Hard**: Largest rectangle in histogram, basic calculator

### Tips for Success
1. **Think LIFO** - Always remember Last In, First Out
2. **Visualize with real objects** - Use plates, books, or pancakes as mental models
3. **Practice with recursion** - Understand how function calls use stacks
4. **Master parentheses problems** - They're very common in interviews
5. **Understand expression evaluation** - Important for calculator implementations

### Common Mistakes to Avoid
1. **Forgetting to check empty stack** before popping
2. **Confusing stack with queue** behavior
3. **Not handling stack overflow/underflow** properly
4. **Trying to access middle elements** directly

**Remember: Stacks are like a stack of plates - you can only work with the top one! Master this simple concept and you'll solve many complex problems!** 🍽️
