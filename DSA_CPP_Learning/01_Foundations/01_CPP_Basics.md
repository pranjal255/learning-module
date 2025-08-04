# C++ Basics for DSA - Your Programming Foundation

## 🌟 Real-World Story: Learning a New Language

Imagine you're moving to a new country and need to learn the local language to communicate effectively. Just like learning any spoken language, programming in C++ requires understanding:

- **Grammar Rules** (Syntax): How to structure sentences correctly
- **Vocabulary** (Keywords): Essential words you need to know
- **Pronunciation** (Compilation): Making sure you're understood correctly
- **Conversation Skills** (Problem Solving): Putting it all together to communicate ideas

C++ is your gateway to the world of Data Structures and Algorithms - it's like learning the fundamental language that will help you express complex computational ideas clearly and efficiently!

## 🎯 What You'll Learn
- Essential C++ concepts needed for DSA with detailed explanations
- Basic syntax and data types with real-world examples
- Functions and classes with step-by-step breakdowns
- Memory management basics with visual explanations
- Input/output operations with practical demonstrations

---

## 📝 Table of Contents
1. [Basic Syntax](#basic-syntax)
2. [Data Types](#data-types)
3. [Variables and Constants](#variables-and-constants)
4. [Input/Output](#inputoutput)
5. [Functions](#functions)
6. [Arrays Basics](#arrays-basics)
7. [Pointers and References](#pointers-and-references)
8. [Classes and Objects](#classes-and-objects)
9. [STL Basics](#stl-basics)
10. [Practice Problems](#practice-problems)

---

## Basic Syntax

### 🎯 Your First C++ Program - Step by Step

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, DSA World!" << endl;
    return 0;
}
```

**🔍 Line-by-Line Explanation:**

```cpp
#include <iostream>
```
- **What it does:** Tells the compiler to include the input/output stream library
- **Why we need it:** Provides access to `cout`, `cin`, and other I/O functions
- **Real-world analogy:** Like importing a dictionary when learning a new language

```cpp
using namespace std;
```
- **What it does:** Allows us to use standard library functions without the `std::` prefix
- **Why we need it:** Without this, we'd have to write `std::cout` instead of just `cout`
- **Alternative:** You can write `std::cout` everywhere instead of using this line

```cpp
int main() {
```
- **What it does:** Defines the main function - the entry point of every C++ program
- **Why it's special:** The operating system calls this function when your program starts
- **Return type:** `int` means this function returns an integer value

```cpp
    cout << "Hello, DSA World!" << endl;
```
- **What it does:** Prints text to the console (screen)
- **`cout`:** "Character output" - sends data to the standard output stream
- **`<<`:** Stream insertion operator - "sends" data to cout
- **`endl`:** Ends the line and flushes the output buffer (like pressing Enter)

```cpp
    return 0;
```
- **What it does:** Returns 0 to the operating system
- **Why 0:** By convention, 0 means "program executed successfully"
- **Other values:** Non-zero values typically indicate errors

**📤 Expected Output:**
```
Hello, DSA World!
```

**🎓 Key Learning Points:**
- Every C++ program must have exactly one `main()` function
- Statements end with semicolons (`;`)
- Code blocks are enclosed in curly braces `{}`
- Indentation makes code readable (use 2 or 4 spaces consistently)

---

## Data Types

### 🎯 Fundamental Data Types - Your Data Toolbox

**Real-World Analogy:** Think of data types like different containers in your kitchen:
- **int**: Like a small jar for counting items (whole numbers)
- **double**: Like a measuring cup for precise amounts (decimal numbers)
- **char**: Like a single letter tile in Scrabble
- **bool**: Like a light switch (on/off, true/false)
- **string**: Like a sentence written on paper

```cpp
#include <iostream>
using namespace std;

int main() {
    // Integer types
    int age = 25;                    // 4 bytes, range: -2^31 to 2^31-1
    long long bigNumber = 1000000000LL; // 8 bytes, for very large numbers
    
    // Floating point types
    float price = 99.99f;            // 4 bytes, 7 decimal digits precision
    double precise = 3.14159265359;  // 8 bytes, 15 decimal digits precision
    
    // Character type
    char grade = 'A';                // 1 byte, single character
    
    // Boolean type
    bool isPassed = true;            // 1 byte, true or false
    
    // String (from STL)
    string name = "Alice";           // Variable length text
    
    // Display all values
    cout << "Age: " << age << endl;
    cout << "Big Number: " << bigNumber << endl;
    cout << "Price: " << price << endl;
    cout << "Precise: " << precise << endl;
    cout << "Grade: " << grade << endl;
    cout << "Passed: " << isPassed << endl;
    cout << "Name: " << name << endl;
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
int age = 25;
```
- **What it does:** Creates an integer variable to store whole numbers
- **Memory:** Uses 4 bytes (32 bits) of memory
- **Range:** Can store values from -2,147,483,648 to 2,147,483,647
- **When to use:** For counting, indexing, and whole number calculations

```cpp
long long bigNumber = 1000000000LL;
```
- **What it does:** Creates a larger integer for very big numbers
- **Memory:** Uses 8 bytes (64 bits) of memory
- **Range:** Can store values from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
- **LL suffix:** Tells compiler this is a long long literal
- **When to use:** For very large numbers that don't fit in regular int

```cpp
float price = 99.99f;
```
- **What it does:** Stores decimal numbers with moderate precision
- **Memory:** Uses 4 bytes
- **Precision:** About 7 decimal digits
- **f suffix:** Tells compiler this is a float literal (not double)
- **When to use:** When you need decimals but don't need high precision

```cpp
double precise = 3.14159265359;
```
- **What it does:** Stores decimal numbers with high precision
- **Memory:** Uses 8 bytes
- **Precision:** About 15 decimal digits
- **When to use:** For scientific calculations, financial calculations requiring precision

```cpp
char grade = 'A';
```
- **What it does:** Stores a single character
- **Memory:** Uses 1 byte
- **Single quotes:** Must use single quotes for char literals
- **When to use:** For single characters, ASCII values

```cpp
bool isPassed = true;
```
- **What it does:** Stores true or false values
- **Memory:** Uses 1 byte (though only needs 1 bit)
- **Values:** Only `true` or `false`
- **When to use:** For flags, conditions, yes/no situations

```cpp
string name = "Alice";
```
- **What it does:** Stores text of any length
- **Memory:** Variable (depends on text length)
- **Double quotes:** Must use double quotes for string literals
- **When to use:** For names, sentences, any text data

**📤 Expected Output:**
```
Age: 25
Big Number: 1000000000
Price: 99.99
Precise: 3.14159
Grade: A
Passed: 1
Name: Alice
```

**🎓 Key Learning Points:**
- `bool` prints as 1 (true) or 0 (false)
- Choose the right data type based on your needs
- Larger types use more memory but can store bigger/more precise values

### 🔍 Size of Data Types - Understanding Memory Usage

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Size of int: " << sizeof(int) << " bytes" << endl;
    cout << "Size of long long: " << sizeof(long long) << " bytes" << endl;
    cout << "Size of float: " << sizeof(float) << " bytes" << endl;
    cout << "Size of double: " << sizeof(double) << " bytes" << endl;
    cout << "Size of char: " << sizeof(char) << " bytes" << endl;
    cout << "Size of bool: " << sizeof(bool) << " bytes" << endl;
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
sizeof(int)
```
- **What it does:** Returns the number of bytes used by the data type
- **Why it matters:** Helps you understand memory usage
- **Platform dependent:** Size may vary on different systems (but usually standard)

**📤 Expected Output (typical 64-bit system):**
```
Size of int: 4 bytes
Size of long long: 8 bytes
Size of float: 4 bytes
Size of double: 8 bytes
Size of char: 1 bytes
Size of bool: 1 bytes
```

**🎓 Memory Usage Guide:**
- **1 byte = 8 bits**
- **int (4 bytes):** Can represent 2^32 different values
- **char (1 byte):** Can represent 256 different characters
- **bool (1 byte):** Only needs 1 bit but uses 1 byte for efficiency
- **Choose wisely:** Larger types use more memory but offer more range/precision

---

## Variables and Constants

### 🎯 Variables - Your Data Storage Boxes

**Real-World Analogy:** Variables are like labeled boxes in a warehouse:
- **Declaration:** Getting an empty box and putting a label on it
- **Initialization:** Putting something in the box when you first get it
- **Assignment:** Changing what's inside the box later

```cpp
#include <iostream>
using namespace std;

int main() {
    // Variable declaration and initialization
    int x;          // Declaration only
    x = 10;         // Assignment
    
    int y = 20;     // Declaration + initialization
    
    // Multiple variables of same type
    int a = 1, b = 2, c = 3;
    
    cout << "x = " << x << ", y = " << y << endl;
    cout << "a = " << a << ", b = " << b << ", c = " << c << endl;
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
int x;
```
- **What it does:** Creates a variable named `x` that can store integers
- **Memory:** Allocates 4 bytes of memory
- **Initial value:** Contains garbage value (undefined)
- **Best practice:** Always initialize variables before using them

```cpp
x = 10;
```
- **What it does:** Assigns the value 10 to variable `x`
- **Assignment operator:** `=` copies the value on the right to the variable on the left
- **Now x contains:** The value 10

```cpp
int y = 20;
```
- **What it does:** Declares and initializes `y` in one step
- **Preferred method:** This is cleaner and safer than separate declaration and assignment

```cpp
int a = 1, b = 2, c = 3;
```
- **What it does:** Declares multiple variables of the same type in one line
- **Comma separator:** Each variable can have its own initial value
- **Equivalent to:** `int a = 1; int b = 2; int c = 3;`

**📤 Expected Output:**
```
x = 10, y = 20
a = 1, b = 2, c = 3
```

### 🔒 Constants - Values That Never Change

**Real-World Analogy:** Constants are like engraved stone tablets - once created, they can never be changed:
- **Mathematical constants:** π (pi), e (Euler's number)
- **Physical constants:** Speed of light, gravitational constant
- **Configuration values:** Maximum array size, default settings

```cpp
#include <iostream>
using namespace std;

int main() {
    // Using const keyword
    const int MAX_SIZE = 100;
    const double PI = 3.14159;
    
    // Using #define (older method)
    #define ARRAY_SIZE 50
    
    cout << "Max size: " << MAX_SIZE << endl;
    cout << "PI: " << PI << endl;
    cout << "Array size: " << ARRAY_SIZE << endl;
    
    // MAX_SIZE = 200; // This would cause an error!
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
const int MAX_SIZE = 100;
```
- **What it does:** Creates a constant integer that cannot be changed
- **const keyword:** Tells compiler this value is read-only
- **Must initialize:** Constants must be given a value when declared
- **Naming convention:** Usually written in ALL_CAPS

```cpp
const double PI = 3.14159;
```
- **What it does:** Creates a constant for mathematical calculations
- **Type:** Can be any data type (int, double, string, etc.)
- **Memory efficient:** Compiler may optimize by replacing with actual value

```cpp
#define ARRAY_SIZE 50
```
- **What it does:** Creates a preprocessor macro (older C-style method)
- **How it works:** Text replacement before compilation
- **No type checking:** Less safe than `const`
- **Modern preference:** Use `const` instead of `#define` for constants

```cpp
// MAX_SIZE = 200; // This would cause an error!
```
- **What happens:** Compiler error - cannot modify a constant
- **Error message:** Something like "assignment of read-only variable"

**📤 Expected Output:**
```
Max size: 100
PI: 3.14159
Array size: 50
```

**🎓 Key Learning Points:**
- **Always initialize variables** to avoid garbage values
- **Use const for values that shouldn't change** (safer than #define)
- **Choose meaningful variable names** (age, not a; maxSize, not ms)
- **Follow naming conventions** (camelCase for variables, ALL_CAPS for constants)

---

## Input/Output

### 🎯 Basic Input/Output - Talking to Your Program

**Real-World Analogy:** Input/Output is like having a conversation:
- **Output (cout):** You speaking to someone
- **Input (cin):** Someone speaking to you
- **Buffer:** Like waiting for someone to finish their sentence before responding

```cpp
#include <iostream>
using namespace std;

int main() {
    string name;
    int age;
    double height;
    
    // Taking input
    cout << "Enter your name: ";
    cin >> name;  // Note: cin stops at whitespace
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Enter your height (in meters): ";
    cin >> height;
    
    // Displaying output
    cout << "\n--- Your Information ---" << endl;
    cout << "Name: " << name << endl;
    cout << "Age: " << age << " years" << endl;
    cout << "Height: " << height << " meters" << endl;
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
cout << "Enter your name: ";
```
- **What it does:** Displays a prompt message to the user
- **cout:** "Character output" stream for displaying text
- **No endl:** Keeps cursor on same line for user input

```cpp
cin >> name;
```
- **What it does:** Reads input from keyboard into the variable
- **cin:** "Character input" stream for reading data
- **>> operator:** Extraction operator - "extracts" data from input stream
- **Important limitation:** Stops reading at first whitespace (space, tab, newline)

```cpp
cin >> age;
```
- **What it does:** Reads an integer from input
- **Type safety:** Automatically converts string input to integer
- **Error handling:** If user enters non-integer, program may behave unexpectedly

**📤 Expected Output (with sample input):**
```
Enter your name: Alice
Enter your age: 25
Enter your height (in meters): 1.65

--- Your Information ---
Name: Alice
Age: 25 years
Height: 1.65 meters
```

**⚠️ Important Note:** If user enters "Alice Smith" for name, only "Alice" will be stored because `cin >>` stops at spaces.

### 🔍 Reading Full Lines - Handling Spaces in Input

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName;
    
    cout << "Enter your full name: ";
    getline(cin, fullName);  // Reads entire line including spaces
    
    cout << "Hello, " << fullName << "!" << endl;
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
getline(cin, fullName);
```
- **What it does:** Reads an entire line including spaces until Enter is pressed
- **Parameters:** Input stream (cin) and string variable to store the line
- **Advantage:** Can handle names like "John Smith" or "Mary Jane Watson"
- **When to use:** When you need to read text that might contain spaces

**📤 Expected Output (with sample input):**
```
Enter your full name: Alice Smith Johnson
Hello, Alice Smith Johnson!
```

**🎓 Key Differences:**
- **cin >>:** Stops at first whitespace
- **getline():** Reads until newline character (Enter key)

### 💡 Common Input/Output Patterns

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string firstName, lastName;
    int age;
    
    // Method 1: Using cin >> (stops at spaces)
    cout << "Enter first name: ";
    cin >> firstName;
    
    cout << "Enter last name: ";
    cin >> lastName;
    
    cout << "Enter age: ";
    cin >> age;
    
    // Clear the input buffer before getline
    cin.ignore(); // Important: removes leftover newline
    
    string address;
    cout << "Enter address: ";
    getline(cin, address);
    
    cout << "\n=== Your Information ===" << endl;
    cout << "Name: " << firstName << " " << lastName << endl;
    cout << "Age: " << age << endl;
    cout << "Address: " << address << endl;
    
    return 0;
}
```

**🔍 Key Learning Point:**

```cpp
cin.ignore();
```
- **What it does:** Removes leftover newline character from input buffer
- **Why needed:** After `cin >> age`, a newline remains in buffer
- **Without it:** `getline()` would read the leftover newline and skip user input
- **Best practice:** Always use after `cin >>` before `getline()`

**📤 Expected Output:**
```
Enter first name: John
Enter last name: Doe
Enter age: 30
Enter address: 123 Main Street, Anytown
=== Your Information ===
Name: John Doe
Age: 30
Address: 123 Main Street, Anytown
```

---

## Functions

### 🎯 Basic Functions - Building Reusable Code Blocks

**Real-World Analogy:** Functions are like specialized tools in a toolbox:
- **add()**: Like a calculator - takes two numbers, returns their sum
- **greet()**: Like a greeting card template - takes a name, prints a personalized message
- **isEven()**: Like a quality checker - takes a number, tells you if it meets criteria

```cpp
#include <iostream>
using namespace std;

// Function to add two numbers
int add(int a, int b) {
    return a + b;
}

// Function to print a greeting
void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

// Function to check if a number is even
bool isEven(int num) {
    return num % 2 == 0;
}

int main() {
    int x = 5, y = 3;
    
    // Calling functions
    int sum = add(x, y);
    cout << x << " + " << y << " = " << sum << endl;
    
    greet("Alice");
    
    if (isEven(x)) {
        cout << x << " is even" << endl;
    } else {
        cout << x << " is odd" << endl;
    }
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
int add(int a, int b) {
    return a + b;
}
```
- **Return type:** `int` - this function returns an integer value
- **Function name:** `add` - descriptive name explaining what it does
- **Parameters:** `int a, int b` - two integer inputs the function needs
- **Return statement:** `return a + b` - sends the result back to the caller
- **When to use:** When you need to perform the same calculation multiple times

```cpp
void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}
```
- **Return type:** `void` - this function doesn't return any value
- **Parameter:** `string name` - takes a name as input
- **Side effect:** Prints to console instead of returning a value
- **When to use:** For actions that don't need to return data (printing, file operations)

```cpp
bool isEven(int num) {
    return num % 2 == 0;
}
```
- **Return type:** `bool` - returns true or false
- **Logic:** `num % 2 == 0` checks if remainder when divided by 2 is 0
- **Modulo operator (%):** Returns remainder of division
- **When to use:** For yes/no questions about data

```cpp
int sum = add(x, y);
```
- **Function call:** Executes the `add` function with values 5 and 3
- **Return value:** The result (8) is stored in variable `sum`
- **Parameters:** `x` and `y` are copied to `a` and `b` inside the function

**📤 Expected Output:**
```
5 + 3 = 8
Hello, Alice!
5 is odd
```

**🎓 Function Anatomy:**
```cpp
return_type function_name(parameter_type parameter_name) {
    // Function body
    return value; // (only if return_type is not void)
}
```

### 🔄 Function Overloading - Same Name, Different Signatures

**Real-World Analogy:** Function overloading is like having different sized screwdrivers with the same name but different specifications - the right one is automatically chosen based on what you're working with.

```cpp
#include <iostream>
using namespace std;

// Same function name, different parameters
int multiply(int a, int b) {
    return a * b;
}

double multiply(double a, double b) {
    return a * b;
}

int multiply(int a, int b, int c) {
    return a * b * c;
}

int main() {
    cout << multiply(3, 4) << endl;        // Calls int version
    cout << multiply(2.5, 3.0) << endl;    // Calls double version
    cout << multiply(2, 3, 4) << endl;     // Calls three-parameter version
    
    return 0;
}
```

**🔍 Detailed Explanation:**

```cpp
int multiply(int a, int b) {
    return a * b;
}
```
- **Signature:** Two integer parameters
- **Purpose:** Multiplies two whole numbers
- **Return type:** Integer result

```cpp
double multiply(double a, double b) {
    return a * b;
}
```
- **Signature:** Two double parameters
- **Purpose:** Multiplies two decimal numbers
- **Return type:** Double result (preserves decimal precision)

```cpp
int multiply(int a, int b, int c) {
    return a * b * c;
}
```
- **Signature:** Three integer parameters
- **Purpose:** Multiplies three whole numbers
- **Different from first:** Number of parameters is different

**Function Call Resolution:**
```cpp
multiply(3, 4)        // Compiler chooses: int multiply(int, int)
multiply(2.5, 3.0)    // Compiler chooses: double multiply(double, double)
multiply(2, 3, 4)     // Compiler chooses: int multiply(int, int, int)
```

**📤 Expected Output:**
```
12
7.5
24
```

**🎓 Overloading Rules:**
- **Different parameter types:** `int` vs `double`
- **Different number of parameters:** 2 vs 3 parameters
- **Different parameter order:** `(int, double)` vs `(double, int)`
- **Cannot overload by return type alone:** `int func()` vs `double func()` is invalid

### 💡 Advanced Function Concepts

```cpp
#include <iostream>
using namespace std;

// Function with default parameters
void printInfo(string name, int age = 18, string city = "Unknown") {
    cout << "Name: " << name << ", Age: " << age << ", City: " << city << endl;
}

// Function that modifies variables (pass by reference)
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

// Function that takes array as parameter
void printArray(int arr[], int size) {
    cout << "Array elements: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    // Default parameters
    printInfo("Alice");                    // Uses default age and city
    printInfo("Bob", 25);                  // Uses default city
    printInfo("Charlie", 30, "New York");  // All parameters provided
    
    // Pass by reference
    int x = 10, y = 20;
    cout << "Before swap: x = " << x << ", y = " << y << endl;
    swap(x, y);
    cout << "After swap: x = " << x << ", y = " << y << endl;
    
    // Array parameter
    int numbers[] = {1, 2, 3, 4, 5};
    printArray(numbers, 5);
    
    return 0;
}
```

**🔍 Key Concepts:**

```cpp
void printInfo(string name, int age = 18, string city = "Unknown")
```
- **Default parameters:** If not provided, use default values
- **Rule:** Default parameters must be at the end
- **Flexibility:** Can call with 1, 2, or 3 arguments

```cpp
void swap(int& a, int& b)
```
- **Pass by reference:** `&` means function can modify the original variables
- **Without &:** Function would work on copies, original variables unchanged
- **Use case:** When function needs to modify input variables

```cpp
void printArray(int arr[], int size)
```
- **Array parameter:** Arrays are automatically passed by reference
- **Size parameter:** Arrays don't carry size information, must pass separately
- **Equivalent:** `int* arr` (pointer notation)

**📤 Expected Output:**
```
Name: Alice, Age: 18, City: Unknown
Name: Bob, Age: 25, City: Unknown
Name: Charlie, Age: 30, City: New York
Before swap: x = 10, y = 20
After swap: x = 20, y = 10
Array elements: 1 2 3 4 5
```

---

## Arrays Basics

### Static Arrays
```cpp
#include <iostream>
using namespace std;

int main() {
    // Array declaration and initialization
    int numbers[5] = {10, 20, 30, 40, 50};
    
    // Accessing array elements (0-indexed)
    cout << "First element: " << numbers[0] << endl;
    cout << "Last element: " << numbers[4] << endl;
    
    // Modifying array elements
    numbers[2] = 35;
    
    // Printing all elements
    cout << "Array elements: ";
    for (int i = 0; i < 5; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    // Array size
    int size = sizeof(numbers) / sizeof(numbers[0]);
    cout << "Array size: " << size << endl;
    
    return 0;
}
```

### 2D Arrays
```cpp
#include <iostream>
using namespace std;

int main() {
    // 2D array (matrix)
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    // Printing 2D array
    cout << "Matrix:" << endl;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

---

## Pointers and References

### Pointers
```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 42;
    int* ptr = &x;  // ptr stores the address of x
    
    cout << "Value of x: " << x << endl;
    cout << "Address of x: " << &x << endl;
    cout << "Value of ptr: " << ptr << endl;
    cout << "Value pointed by ptr: " << *ptr << endl;
    
    // Modifying value through pointer
    *ptr = 100;
    cout << "New value of x: " << x << endl;
    
    return 0;
}
```

### References
```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 42;
    int& ref = x;  // ref is an alias for x
    
    cout << "Value of x: " << x << endl;
    cout << "Value of ref: " << ref << endl;
    
    // Modifying through reference
    ref = 100;
    cout << "New value of x: " << x << endl;
    
    return 0;
}
```

---

## Classes and Objects

### Basic Class
```cpp
#include <iostream>
using namespace std;

class Student {
private:
    string name;
    int age;
    double gpa;

public:
    // Constructor
    Student(string n, int a, double g) {
        name = n;
        age = a;
        gpa = g;
    }
    
    // Getter methods
    string getName() { return name; }
    int getAge() { return age; }
    double getGPA() { return gpa; }
    
    // Setter methods
    void setGPA(double g) { gpa = g; }
    
    // Method to display student info
    void displayInfo() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "GPA: " << gpa << endl;
    }
};

int main() {
    // Creating objects
    Student student1("Alice", 20, 3.8);
    Student student2("Bob", 19, 3.5);
    
    // Using objects
    student1.displayInfo();
    cout << endl;
    student2.displayInfo();
    
    return 0;
}
```

---

## STL Basics

### Vector (Dynamic Array)
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Creating a vector
    vector<int> numbers;
    
    // Adding elements
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);
    
    // Accessing elements
    cout << "First element: " << numbers[0] << endl;
    cout << "Size: " << numbers.size() << endl;
    
    // Iterating through vector
    cout << "All elements: ";
    for (int i = 0; i < numbers.size(); i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    // Using range-based for loop (C++11)
    cout << "Using range-based loop: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
```

### String Operations
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str1 = "Hello";
    string str2 = "World";
    
    // String concatenation
    string result = str1 + " " + str2;
    cout << "Concatenated: " << result << endl;
    
    // String length
    cout << "Length: " << result.length() << endl;
    
    // Accessing characters
    cout << "First character: " << result[0] << endl;
    
    // Substring
    string sub = result.substr(0, 5);  // From index 0, length 5
    cout << "Substring: " << sub << endl;
    
    // Finding in string
    size_t pos = result.find("World");
    if (pos != string::npos) {
        cout << "Found 'World' at position: " << pos << endl;
    }
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: Basic Calculator
```cpp
#include <iostream>
using namespace std;

double calculator(double a, double b, char op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return (b != 0) ? a / b : 0;
        default: return 0;
    }
}

int main() {
    double num1, num2;
    char operation;
    
    cout << "Enter first number: ";
    cin >> num1;
    
    cout << "Enter operation (+, -, *, /): ";
    cin >> operation;
    
    cout << "Enter second number: ";
    cin >> num2;
    
    double result = calculator(num1, num2, operation);
    cout << "Result: " << result << endl;
    
    return 0;
}
```

### Problem 2: Array Sum and Average
```cpp
#include <iostream>
using namespace std;

int main() {
    const int SIZE = 5;
    int numbers[SIZE];
    int sum = 0;
    
    // Input numbers
    cout << "Enter " << SIZE << " numbers:" << endl;
    for (int i = 0; i < SIZE; i++) {
        cout << "Number " << (i + 1) << ": ";
        cin >> numbers[i];
        sum += numbers[i];
    }
    
    // Calculate average
    double average = (double)sum / SIZE;
    
    // Display results
    cout << "\nResults:" << endl;
    cout << "Sum: " << sum << endl;
    cout << "Average: " << average << endl;
    
    return 0;
}
```

### Problem 3: Simple Class Example
```cpp
#include <iostream>
#include <vector>
using namespace std;

class Rectangle {
private:
    double length, width;

public:
    Rectangle(double l, double w) : length(l), width(w) {}
    
    double area() {
        return length * width;
    }
    
    double perimeter() {
        return 2 * (length + width);
    }
    
    void display() {
        cout << "Rectangle: " << length << " x " << width << endl;
        cout << "Area: " << area() << endl;
        cout << "Perimeter: " << perimeter() << endl;
    }
};

int main() {
    Rectangle rect(5.0, 3.0);
    rect.display();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

1. **Data Types**: Choose the right type for your data
2. **Functions**: Break your code into reusable pieces
3. **Arrays**: Foundation for more complex data structures
4. **Pointers**: Essential for dynamic memory management
5. **Classes**: Organize code using object-oriented principles
6. **STL**: Use built-in containers like vector and string

---

## 🚀 What's Next?

Now that you understand C++ basics, you're ready to learn about [Time and Space Complexity](02_Complexity_Analysis.md) - a crucial concept for analyzing algorithm efficiency!

---

## 📚 Additional Resources

- Practice more C++ basics on online platforms
- Experiment with the code examples
- Try modifying the examples to see what happens
- Don't worry if everything doesn't click immediately - it takes practice!

Remember: **Understanding comes with practice!** 💪
