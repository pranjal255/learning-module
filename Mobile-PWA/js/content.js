// Learning Content for Mobile PWA
// This file contains all the learning materials converted from markdown to JavaScript objects

window.learningContent = {
    // DSA & C++ Learning Path
    dsa: {
        id: 'dsa',
        title: 'DSA & C++',
        description: 'Master data structures, algorithms, and C++ programming',
        duration: '4-6 months',
        salary: '$80K-$200K+',
        icon: '💻',
        color: '#4CAF50',
        modules: [
            // 01. Foundations
            {
                id: 'dsa-01-cpp-basics',
                title: '01. C++ Basics',
                description: 'Essential C++ concepts needed for DSA',
                path: 'DSA & C++ > Foundations > C++ Basics',
                category: 'Foundations',
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                content: `# C++ Basics for DSA - Your Programming Foundation

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

## Basic Syntax

### 🎯 Your First C++ Program - Step by Step

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, DSA World!" << endl;
    return 0;
}
\`\`\`

**🔍 Line-by-Line Explanation:**

\`\`\`cpp
#include <iostream>
\`\`\`
- **What it does:** Tells the compiler to include the input/output stream library
- **Why we need it:** Provides access to \`cout\`, \`cin\`, and other I/O functions
- **Real-world analogy:** Like importing a dictionary when learning a new language

## Data Types

### 🎯 Fundamental Data Types - Your Data Toolbox

**Real-World Analogy:** Think of data types like different containers in your kitchen:
- **int**: Like a small jar for counting items (whole numbers)
- **double**: Like a measuring cup for precise amounts (decimal numbers)
- **char**: Like a single letter tile in Scrabble
- **bool**: Like a light switch (on/off, true/false)
- **string**: Like a sentence written on paper

\`\`\`cpp
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
    
    return 0;
}
\`\`\`

## Functions

### 🎯 Basic Functions - Building Reusable Code Blocks

\`\`\`cpp
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
\`\`\`

## 🎯 Key Takeaways

1. **Data Types**: Choose the right type for your data
2. **Functions**: Break your code into reusable pieces
3. **Arrays**: Foundation for more complex data structures
4. **Pointers**: Essential for dynamic memory management
5. **Classes**: Organize code using object-oriented principles
6. **STL**: Use built-in containers like vector and string

## 🚀 What's Next?

Now that you understand C++ basics, you're ready to learn about Time and Space Complexity - a crucial concept for analyzing algorithm efficiency!`
            },
            {
                id: 'dsa-02-complexity-analysis',
                title: '02. Complexity Analysis',
                description: 'Understanding time and space complexity',
                path: 'DSA & C++ > Foundations > Complexity Analysis',
                category: 'Foundations',
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                content: `# Time and Space Complexity Analysis

## 🌟 Real-World Story: The Recipe Efficiency Challenge

Imagine you're a chef in a busy restaurant. You have different recipes to prepare the same dish:

- **Recipe A**: Takes 5 minutes for 1 person, 10 minutes for 2 people, 15 minutes for 3 people
- **Recipe B**: Takes 5 minutes regardless of how many people you're serving
- **Recipe C**: Takes 1 minute for 1 person, 4 minutes for 2 people, 9 minutes for 3 people

Which recipe would you choose during rush hour? This is exactly what complexity analysis helps us determine in programming!

## 🎯 What You'll Learn
- Big O notation and its practical meaning
- How to analyze time complexity with real examples
- Space complexity and memory usage
- Common complexity patterns you'll encounter
- How to choose the best algorithm for your needs

## Understanding Big O Notation

### 🎯 The Language of Efficiency

Big O notation describes how an algorithm's performance changes as the input size grows.

**Real-World Analogy:** Think of it like describing how long it takes to find a book:
- **O(1)**: You know exactly where the book is (constant time)
- **O(log n)**: You use the library catalog system (logarithmic time)
- **O(n)**: You check every book one by one (linear time)
- **O(n²)**: You compare every book with every other book (quadratic time)

### Common Time Complexities

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

// O(1) - Constant Time
int getFirstElement(vector<int>& arr) {
    return arr[0];  // Always takes same time regardless of array size
}

// O(n) - Linear Time
int findSum(vector<int>& arr) {
    int sum = 0;
    for (int i = 0; i < arr.size(); i++) {  // Loop runs n times
        sum += arr[i];
    }
    return sum;
}

// O(n²) - Quadratic Time
void printPairs(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {      // Outer loop: n times
        for (int j = 0; j < arr.size(); j++) {  // Inner loop: n times
            cout << arr[i] << ", " << arr[j] << endl;  // Total: n × n = n²
        }
    }
}

// O(log n) - Logarithmic Time (Binary Search)
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;  // Not found
}
\`\`\`

## Time Complexity Examples

### 🔍 Analyzing Real Code

\`\`\`cpp
// Example 1: What's the time complexity?
void example1(int n) {
    for (int i = 0; i < n; i++) {        // Loop runs n times
        cout << i << " ";                 // Constant operation
    }
}
// Answer: O(n) - Linear time
\`\`\`

\`\`\`cpp
// Example 2: What's the time complexity?
void example2(int n) {
    for (int i = 0; i < n; i++) {        // Outer loop: n times
        for (int j = 0; j < n; j++) {    // Inner loop: n times
            cout << i << "," << j << " "; // Constant operation
        }
    }
}
// Answer: O(n²) - Quadratic time
\`\`\`

\`\`\`cpp
// Example 3: What's the time complexity?
void example3(int n) {
    for (int i = 1; i < n; i *= 2) {     // Loop runs log₂(n) times
        cout << i << " ";                 // Constant operation
    }
}
// Answer: O(log n) - Logarithmic time
\`\`\`

## Space Complexity

### 🎯 Memory Usage Analysis

Space complexity measures how much extra memory an algorithm uses relative to input size.

\`\`\`cpp
// O(1) Space - Constant Space
int findMax(vector<int>& arr) {
    int max = arr[0];                    // Only one extra variable
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// O(n) Space - Linear Space
vector<int> createCopy(vector<int>& arr) {
    vector<int> copy;                    // New array of size n
    for (int i = 0; i < arr.size(); i++) {
        copy.push_back(arr[i]);
    }
    return copy;
}

// O(n) Space - Recursive Call Stack
int factorial(int n) {
    if (n <= 1) return 1;               // Base case
    return n * factorial(n - 1);        // Each call uses stack space
}
// Stack depth = n, so space complexity = O(n)
\`\`\`

## Complexity Comparison

### 📊 Performance Visualization

For input size n = 1000:

| Complexity | Operations | Real-world Example |
|------------|------------|-------------------|
| O(1) | 1 | Accessing array element |
| O(log n) | ~10 | Binary search |
| O(n) | 1,000 | Linear search |
| O(n log n) | ~10,000 | Merge sort |
| O(n²) | 1,000,000 | Bubble sort |
| O(2ⁿ) | 2¹⁰⁰⁰ | Brute force password |

## Best, Average, and Worst Case

### 🎯 Understanding Different Scenarios

\`\`\`cpp
// Linear Search Example
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;  // Found!
        }
    }
    return -1;  // Not found
}

/*
Best Case: O(1) - Target is first element
Average Case: O(n/2) = O(n) - Target is in middle
Worst Case: O(n) - Target is last element or not present
*/
\`\`\`

## 🎯 Key Takeaways

1. **Big O describes growth rate**, not exact time
2. **Focus on worst-case** for algorithm analysis
3. **Drop constants and lower-order terms**: O(2n + 5) becomes O(n)
4. **Space-time tradeoffs** often exist
5. **Choose algorithms based on your constraints**

## 🚀 What's Next?

Now that you understand complexity analysis, you're ready to dive into Arrays - the foundation of most data structures!`
            },
            
            // 02. Linear Data Structures
            {
                id: 'dsa-03-arrays',
                title: '03. Arrays',
                description: 'Master array operations and techniques',
                path: 'DSA & C++ > Linear Data Structures > Arrays',
                category: 'Linear Data Structures',
                estimatedTime: '3-4 hours',
                difficulty: 'Beginner',
                content: `# Arrays - The Foundation of Data Structures

## 🌟 Real-World Story: The Library Bookshelf

Imagine a library bookshelf where books are arranged in a specific order. Each book has a position number (index), and you can:
- **Access any book directly** if you know its position
- **Add a new book** at the end or insert it between existing books
- **Remove a book** and shift others to fill the gap
- **Search for a book** by checking each position

This is exactly how arrays work in programming!

## 🎯 What You'll Learn
- Array fundamentals and memory layout
- Common array operations with time complexity
- Two-pointer technique and sliding window
- Array manipulation algorithms
- Problem-solving patterns with arrays

## Array Fundamentals

### 🎯 Understanding Arrays

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Static array
    int staticArr[5] = {1, 2, 3, 4, 5};
    
    // Dynamic array (vector)
    vector<int> dynamicArr = {1, 2, 3, 4, 5};
    
    // Accessing elements - O(1)
    cout << "First element: " << dynamicArr[0] << endl;
    cout << "Last element: " << dynamicArr[dynamicArr.size() - 1] << endl;
    
    // Adding elements - O(1) amortized
    dynamicArr.push_back(6);
    
    // Size and capacity
    cout << "Size: " << dynamicArr.size() << endl;
    
    return 0;
}
\`\`\`

## Common Array Operations

### 🔍 Essential Operations with Complexity Analysis

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class ArrayOperations {
public:
    // Linear Search - O(n)
    int linearSearch(vector<int>& arr, int target) {
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
    
    // Binary Search - O(log n) - requires sorted array
    int binarySearch(vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
    
    // Insert at position - O(n)
    void insertAt(vector<int>& arr, int pos, int value) {
        arr.insert(arr.begin() + pos, value);
    }
    
    // Delete at position - O(n)
    void deleteAt(vector<int>& arr, int pos) {
        if (pos >= 0 && pos < arr.size()) {
            arr.erase(arr.begin() + pos);
        }
    }
    
    // Find maximum element - O(n)
    int findMax(vector<int>& arr) {
        if (arr.empty()) return -1;
        
        int maxVal = arr[0];
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] > maxVal) {
                maxVal = arr[i];
            }
        }
        return maxVal;
    }
    
    // Reverse array - O(n)
    void reverseArray(vector<int>& arr) {
        int left = 0, right = arr.size() - 1;
        
        while (left < right) {
            swap(arr[left], arr[right]);
            left++;
            right--;
        }
    }
};
\`\`\`

## Two-Pointer Technique

### 🎯 Efficient Array Processing

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

class TwoPointerTechniques {
public:
    // Two Sum - Find pair that adds to target
    vector<int> twoSum(vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        
        while (left < right) {
            int sum = arr[left] + arr[right];
            
            if (sum == target) {
                return {left, right};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return {-1, -1};  // Not found
    }
    
    // Remove duplicates from sorted array
    int removeDuplicates(vector<int>& arr) {
        if (arr.empty()) return 0;
        
        int writeIndex = 1;
        
        for (int readIndex = 1; readIndex < arr.size(); readIndex++) {
            if (arr[readIndex] != arr[readIndex - 1]) {
                arr[writeIndex] = arr[readIndex];
                writeIndex++;
            }
        }
        
        return writeIndex;
    }
    
    // Move zeros to end
    void moveZeros(vector<int>& arr) {
        int writeIndex = 0;
        
        // Move all non-zero elements to front
        for (int readIndex = 0; readIndex < arr.size(); readIndex++) {
            if (arr[readIndex] != 0) {
                arr[writeIndex] = arr[readIndex];
                writeIndex++;
            }
        }
        
        // Fill remaining positions with zeros
        while (writeIndex < arr.size()) {
            arr[writeIndex] = 0;
            writeIndex++;
        }
    }
};
\`\`\`

## Sliding Window Technique

### 🎯 Efficient Subarray Processing

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class SlidingWindow {
public:
    // Maximum sum of k consecutive elements
    int maxSumSubarray(vector<int>& arr, int k) {
        if (arr.size() < k) return -1;
        
        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        int maxSum = windowSum;
        
        // Slide the window
        for (int i = k; i < arr.size(); i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    // Longest subarray with sum <= target
    int longestSubarrayWithSum(vector<int>& arr, int target) {
        int left = 0, sum = 0, maxLength = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            sum += arr[right];
            
            // Shrink window if sum exceeds target
            while (sum > target && left <= right) {
                sum -= arr[left];
                left++;
            }
            
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
};
\`\`\`

## Array Rotation

### 🎯 Rotating Arrays Efficiently

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class ArrayRotation {
public:
    // Rotate array to right by k positions
    void rotateRight(vector<int>& arr, int k) {
        int n = arr.size();
        k = k % n;  // Handle k > n
        
        // Method 1: Using reverse
        reverse(arr.begin(), arr.end());           // Reverse entire array
        reverse(arr.begin(), arr.begin() + k);     // Reverse first k elements
        reverse(arr.begin() + k, arr.end());       // Reverse remaining elements
    }
    
    // Rotate array to left by k positions
    void rotateLeft(vector<int>& arr, int k) {
        int n = arr.size();
        k = k % n;  // Handle k > n
        
        reverse(arr.begin(), arr.begin() + k);     // Reverse first k elements
        reverse(arr.begin() + k, arr.end());       // Reverse remaining elements
        reverse(arr.begin(), arr.end());           // Reverse entire array
    }
    
    // Find rotation count in rotated sorted array
    int findRotationCount(vector<int>& arr) {
        int left = 0, right = arr.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] > arr[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left;
    }
};
\`\`\`

## Practice Problems

### 🎯 Essential Array Problems

\`\`\`cpp
#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

class ArrayProblems {
public:
    // Problem 1: Find missing number in array [1, n]
    int findMissingNumber(vector<int>& arr, int n) {
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        
        for (int num : arr) {
            actualSum += num;
        }
        
        return expectedSum - actualSum;
    }
    
    // Problem 2: Find duplicate number
    int findDuplicate(vector<int>& arr) {
        unordered_set<int> seen;
        
        for (int num : arr) {
            if (seen.count(num)) {
                return num;
            }
            seen.insert(num);
        }
        
        return -1;
    }
    
    // Problem 3: Merge two sorted arrays
    vector<int> mergeSortedArrays(vector<int>& arr1, vector<int>& arr2) {
        vector<int> result;
        int i = 0, j = 0;
        
        while (i < arr1.size() && j < arr2.size()) {
            if (arr1[i] <= arr2[j]) {
                result.push_back(arr1[i]);
                i++;
            } else {
                result.push_back(arr2[j]);
                j++;
            }
        }
        
        // Add remaining elements
        while (i < arr1.size()) {
            result.push_back(arr1[i]);
            i++;
        }
        
        while (j < arr2.size()) {
            result.push_back(arr2[j]);
            j++;
        }
        
        return result;
    }
    
    // Problem 4: Find subarray with given sum
    vector<int> findSubarrayWithSum(vector<int>& arr, int target) {
        int left = 0, sum = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            sum += arr[right];
            
            while (sum > target && left <= right) {
                sum -= arr[left];
                left++;
            }
            
            if (sum == target) {
                return {left, right};
            }
        }
        
        return {-1, -1};
    }
};
\`\`\`

## 🎯 Key Takeaways

1. **Arrays provide O(1) access** but O(n) insertion/deletion
2. **Two-pointer technique** is powerful for sorted arrays
3. **Sliding window** efficiently processes subarrays
4. **Array rotation** can be done in O(n) time using reversal
5. **Choose the right approach** based on problem constraints

## 🚀 What's Next?

Now that you've mastered arrays, you're ready to learn about Strings - which are essentially arrays of characters with special operations!`
            },
            
            {
                id: 'dsa-04-strings',
                title: '04. Strings',
                description: 'String manipulation and pattern matching',
                path: 'DSA & C++ > Linear Data Structures > Strings',
                category: 'Linear Data Structures',
                estimatedTime: '3-4 hours',
                difficulty: 'Beginner',
                content: `# Strings - Text Processing Mastery

## 🌟 Real-World Story: The Text Editor

Imagine you're building a text editor like Microsoft Word. You need to:
- **Find and replace** words in documents
- **Check spelling** by comparing against a dictionary
- **Auto-complete** suggestions as users type
- **Format text** by manipulating character sequences
- **Search** for specific patterns in large documents

All these operations work with strings - sequences of characters that form the foundation of text processing!

## 🎯 What You'll Learn
- String fundamentals and operations
- Pattern matching algorithms
- String manipulation techniques
- Common string problems and solutions
- Efficient string processing methods

## String Fundamentals

### 🎯 Understanding Strings in C++

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    // String creation
    string str1 = "Hello";
    string str2("World");
    string str3(5, 'A');  // "AAAAA"
    
    // String operations
    cout << "Length: " << str1.length() << endl;
    cout << "Size: " << str1.size() << endl;
    cout << "Empty: " << str1.empty() << endl;
    
    // Accessing characters
    cout << "First char: " << str1[0] << endl;
    cout << "Last char: " << str1.back() << endl;
    
    // String concatenation
    string result = str1 + " " + str2;
    cout << "Concatenated: " << result << endl;
    
    return 0;
}
\`\`\`

## Basic String Operations

### 🔍 Essential String Methods

\`\`\`cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class StringOperations {
public:
    // String comparison
    void compareStrings() {
        string str1 = "apple";
        string str2 = "banana";
        
        if (str1 == str2) cout << "Equal" << endl;
        else if (str1 < str2) cout << "str1 comes before str2" << endl;
        else cout << "str1 comes after str2" << endl;
    }
    
    // Substring operations
    void substringOperations() {
        string text = "Hello World";
        
        // Extract substring
        string sub = text.substr(6, 5);  // "World"
        cout << "Substring: " << sub << endl;
        
        // Find substring
        size_t pos = text.find("World");
        if (pos != string::npos) {
            cout << "Found at position: " << pos << endl;
        }
        
        // Replace substring
        string replaced = text;
        replaced.replace(6, 5, "C++");
        cout << "Replaced: " << replaced << endl;
    }
    
    // Character operations
    void characterOperations() {
        string text = "Hello123";
        
        for (char c : text) {
            if (isalpha(c)) cout << c << " is alphabetic" << endl;
            if (isdigit(c)) cout << c << " is digit" << endl;
            if (isupper(c)) cout << c << " is uppercase" << endl;
            if (islower(c)) cout << c << " is lowercase" << endl;
        }
    }
    
    // String modification
    void modifyString() {
        string text = "Hello World";
        
        // Convert to uppercase
        transform(text.begin(), text.end(), text.begin(), ::toupper);
        cout << "Uppercase: " << text << endl;
        
        // Convert to lowercase
        transform(text.begin(), text.end(), text.begin(), ::tolower);
        cout << "Lowercase: " << text << endl;
        
        // Reverse string
        reverse(text.begin(), text.end());
        cout << "Reversed: " << text << endl;
    }
};
\`\`\`

## String Algorithms

### 🎯 Pattern Matching and Search

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class StringAlgorithms {
public:
    // Naive pattern matching - O(n*m)
    vector<int> naiveSearch(string text, string pattern) {
        vector<int> positions;
        int n = text.length();
        int m = pattern.length();
        
        for (int i = 0; i <= n - m; i++) {
            int j;
            for (j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) {
                    break;
                }
            }
            if (j == m) {
                positions.push_back(i);
            }
        }
        
        return positions;
    }
    
    // Check if string is palindrome
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
    
    // Longest common prefix
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        
        string prefix = strs[0];
        
        for (int i = 1; i < strs.size(); i++) {
            while (strs[i].find(prefix) != 0) {
                prefix = prefix.substr(0, prefix.length() - 1);
                if (prefix.empty()) return "";
            }
        }
        
        return prefix;
    }
};
\`\`\`

## 🎯 Key Takeaways

1. **Strings are arrays of characters** with special operations
2. **Pattern matching** is fundamental for text processing
3. **Two-pointer technique** works well for palindromes
4. **String manipulation** requires careful handling of indices
5. **Choose efficient algorithms** for large text processing

## 🚀 What's Next?

Now that you've mastered strings, you're ready to learn about Linked Lists - dynamic data structures that grow and shrink during runtime!`
            }
        ]
    },
    
    // Infrastructure & SRE Learning Path
    infrastructure: {
        id: 'infrastructure',
        title: 'Infrastructure & SRE',
        description: 'Master DevOps, cloud platforms, and site reliability engineering',
        duration: '6 months',
        salary: '$90K-$270K+',
        icon: '🏗️',
        color: '#2196F3',
        modules: [
            {
                id: 'infra-01-what-is-infrastructure',
                title: '01. What is Infrastructure',
                description: 'Understanding modern IT infrastructure fundamentals',
                path: 'Infrastructure & SRE > Foundations > What is Infrastructure',
                category: 'Foundations',
                estimatedTime: '2-3 hours',
                difficulty: 'Beginner',
                content: `# What is Infrastructure - The Foundation of Modern Technology

## 🌟 Real-World Story: Building a Digital City

Imagine you're the mayor of a growing city. You need:
- **Roads and highways** (networks) for people to travel
- **Power plants** (servers) to provide electricity
- **Water systems** (databases) to supply clean water
- **Emergency services** (monitoring) to respond to problems
- **Traffic lights** (load balancers) to manage flow
- **Building codes** (security) to ensure safety

This is exactly what IT infrastructure does for digital services - it provides the foundation that makes everything work!

## 🎯 What You'll Learn
- Core infrastructure components and their roles
- Traditional vs. modern infrastructure approaches
- Cloud computing fundamentals
- Infrastructure as Code concepts
- Monitoring and reliability principles

## Understanding Infrastructure

### 🎯 The Building Blocks of Technology

Infrastructure is the collection of hardware, software, networks, and services that support the delivery of IT services to users.

**Key Components:**

\`\`\`
Physical Infrastructure:
├── Servers (Compute)
├── Storage Systems
├── Network Equipment
├── Data Centers
└── Security Systems

Virtual Infrastructure:
├── Virtual Machines
├── Containers
├── Software-Defined Networks
├── Cloud Services
└── Orchestration Platforms
\`\`\`

## Traditional vs. Modern Infrastructure

### 🔍 Evolution of Infrastructure

**Traditional Infrastructure (On-Premises):**
- Physical servers in company data centers
- Manual provisioning and configuration
- Fixed capacity and scaling limitations
- High upfront capital costs
- Long deployment cycles

**Modern Infrastructure (Cloud-Native):**
- Virtual resources from cloud providers
- Automated provisioning and scaling
- Pay-as-you-use pricing model
- Rapid deployment and iteration
- Global availability and redundancy

## Infrastructure Components

### 🎯 Core Building Blocks

**1. Compute Resources**
\`\`\`
Examples:
- Physical servers
- Virtual machines (VMs)
- Containers
- Serverless functions
- Edge computing nodes

Purpose: Execute applications and process data
\`\`\`

**2. Storage Systems**
\`\`\`
Types:
- Block storage (databases, file systems)
- Object storage (files, backups, media)
- File storage (shared file systems)
- Archive storage (long-term retention)

Purpose: Persist and retrieve data reliably
\`\`\`

**3. Networking**
\`\`\`
Components:
- Routers and switches
- Load balancers
- Firewalls
- VPNs
- Content Delivery Networks (CDNs)

Purpose: Connect systems and manage traffic
\`\`\`

**4. Security**
\`\`\`
Elements:
- Identity and access management
- Encryption systems
- Intrusion detection
- Vulnerability scanning
- Compliance monitoring

Purpose: Protect systems and data
\`\`\`

## Cloud Infrastructure

### 🎯 Understanding Cloud Computing

**Infrastructure as a Service (IaaS):**
- Virtual machines and storage
- Examples: AWS EC2, Google Compute Engine
- You manage: OS, applications, data
- Provider manages: Hardware, virtualization

**Platform as a Service (PaaS):**
- Development and deployment platforms
- Examples: AWS Elastic Beanstalk, Google App Engine
- You manage: Applications, data
- Provider manages: Runtime, OS, hardware

**Software as a Service (SaaS):**
- Complete applications
- Examples: Gmail, Salesforce, Office 365
- You manage: Data and user access
- Provider manages: Everything else

## Infrastructure as Code (IaC)

### 🎯 Managing Infrastructure Programmatically

**Traditional Approach:**
\`\`\`
1. Manual server setup
2. GUI-based configuration
3. Documentation in wikis
4. Inconsistent environments
5. Difficult to reproduce
\`\`\`

**Infrastructure as Code:**
\`\`\`
1. Code-defined infrastructure
2. Version-controlled configurations
3. Automated deployments
4. Consistent environments
5. Easy to reproduce and scale
\`\`\`

**Example Tools:**
- **Terraform**: Multi-cloud infrastructure provisioning
- **AWS CloudFormation**: AWS-specific infrastructure
- **Ansible**: Configuration management
- **Kubernetes**: Container orchestration

## Monitoring and Observability

### 🎯 Keeping Systems Healthy

**The Three Pillars:**

**1. Metrics**
\`\`\`
Examples:
- CPU and memory usage
- Request rates and response times
- Error rates and success rates
- Business metrics (users, revenue)

Purpose: Quantitative measurements of system behavior
\`\`\`

**2. Logs**
\`\`\`
Examples:
- Application logs
- System logs
- Security logs
- Audit logs

Purpose: Detailed records of system events
\`\`\`

**3. Traces**
\`\`\`
Examples:
- Request flows through microservices
- Database query execution
- External API calls
- User journey tracking

Purpose: Understanding request flows and dependencies
\`\`\`

## Reliability and Scalability

### 🎯 Building Robust Systems

**High Availability Principles:**
- **Redundancy**: Multiple instances of critical components
- **Failover**: Automatic switching to backup systems
- **Load Distribution**: Spreading traffic across multiple servers
- **Health Checks**: Continuous monitoring of system health

**Scalability Patterns:**
- **Horizontal Scaling**: Adding more servers
- **Vertical Scaling**: Adding more power to existing servers
- **Auto-scaling**: Automatic adjustment based on demand
- **Load Balancing**: Distributing traffic efficiently

## Modern Infrastructure Trends

### 🎯 Current and Emerging Technologies

**Containerization:**
\`\`\`
Benefits:
- Consistent environments
- Resource efficiency
- Rapid deployment
- Microservices architecture
- DevOps integration
\`\`\`

**Serverless Computing:**
\`\`\`
Characteristics:
- No server management
- Pay-per-execution
- Automatic scaling
- Event-driven architecture
- Focus on business logic
\`\`\`

**Edge Computing:**
\`\`\`
Advantages:
- Reduced latency
- Improved performance
- Local data processing
- Bandwidth optimization
- Enhanced user experience
\`\`\`

## 🎯 Key Takeaways

1. **Infrastructure is the foundation** that enables all digital services
2. **Cloud computing** has revolutionized how we build and manage infrastructure
3. **Infrastructure as Code** brings software engineering practices to infrastructure
4. **Monitoring and observability** are essential for reliable systems
5. **Modern trends** focus on automation, scalability, and efficiency

## 🚀 What's Next?

Now that you understand infrastructure fundamentals, you're ready to dive into SRE Fundamentals - the practices and principles that ensure reliable, scalable systems!`
            },
            
            {
                id: 'infra-02-sre-fundamentals',
                title: '02. SRE Fundamentals',
                description: 'Site Reliability Engineering principles and practices',
                path: 'Infrastructure & SRE > Foundations > SRE Fundamentals',
                category: 'Foundations',
                estimatedTime: '3-4 hours',
                difficulty: 'Beginner',
                content: `# SRE Fundamentals - Engineering Reliability at Scale

## 🌟 Real-World Story: The Hospital Emergency System

Imagine you're designing the emergency response system for a major hospital. You need:
- **99.9% uptime** because lives depend on it
- **Rapid response** to critical situations
- **Predictable performance** under stress
- **Continuous improvement** based on incidents
- **Balance** between innovation and stability

This is exactly what Site Reliability Engineering (SRE) does for software systems!

## 🎯 What You'll Learn
- SRE principles and philosophy
- Service Level Objectives (SLOs) and Error Budgets
- Incident management and postmortems
- Monitoring and alerting strategies
- Automation and toil reduction
- Reliability engineering practices

## What is SRE?

### 🎯 Site Reliability Engineering Defined

SRE is a discipline that incorporates aspects of software engineering and applies them to infrastructure and operations problems.

**Core Philosophy:**
\`\`\`
"SRE is what happens when you ask a software engineer 
to design an operations team."
- Ben Treynor, Google
\`\`\`

**Key Principles:**
1. **Embrace Risk**: Perfect reliability is impossible and unnecessary
2. **Service Level Objectives**: Define and measure reliability
3. **Error Budgets**: Balance reliability with feature velocity
4. **Automation**: Eliminate toil through automation
5. **Monitoring**: Observe system behavior and user experience
6. **Emergency Response**: Respond effectively to incidents
7. **Change Management**: Manage risk in system changes
8. **Capacity Planning**: Ensure systems can handle growth

## Service Level Objectives (SLOs)

### 🎯 Defining Reliability Targets

**Service Level Indicators (SLIs):**
Quantitative measures of service behavior
\`\`\`
Examples:
- Request latency (95th percentile < 100ms)
- Availability (uptime percentage)
- Error rate (< 0.1% of requests fail)
- Throughput (requests per second)
\`\`\`

**Service Level Objectives (SLOs):**
Target values for SLIs over a time period
\`\`\`
Example SLO:
"99.9% of HTTP requests will complete successfully 
over a rolling 30-day window"

This allows for:
- 43.2 minutes of downtime per month
- 0.1% error rate
- Clear reliability target
\`\`\`

**Service Level Agreements (SLAs):**
Business contracts with consequences
\`\`\`
Example SLA:
"If availability falls below 99.5% in a month,
customers receive service credits"

SLA ≤ SLO (SLA should be less strict than SLO)
\`\`\`

## Error Budgets

### 🎯 Balancing Reliability and Innovation

**Error Budget Concept:**
\`\`\`
Error Budget = 100% - SLO

If SLO is 99.9% availability:
Error Budget = 0.1% = 43.2 minutes/month

This budget can be "spent" on:
- Planned maintenance
- Feature releases
- Infrastructure changes
- Acceptable failures
\`\`\`

**Error Budget Policy:**
\`\`\`
When Error Budget is:
├── Healthy (> 50% remaining)
│   └── Focus on feature velocity
├── Warning (10-50% remaining)  
│   └── Increase caution, review changes
└── Exhausted (< 10% remaining)
    └── Freeze features, focus on reliability
\`\`\`

## Monitoring and Alerting

### 🎯 Observing System Health

**The Four Golden Signals:**

**1. Latency**
\`\`\`
What: Time to process requests
Why: User experience indicator
How: Measure response times (p50, p95, p99)
Alert: When latency exceeds SLO thresholds
\`\`\`

**2. Traffic**
\`\`\`
What: Demand on your system
Why: Capacity planning and scaling
How: Requests per second, transactions per minute
Alert: When traffic patterns are unusual
\`\`\`

**3. Errors**
\`\`\`
What: Rate of failed requests
Why: Reliability indicator
How: HTTP 5xx errors, exceptions, timeouts
Alert: When error rate exceeds SLO
\`\`\`

**4. Saturation**
\`\`\`
What: How "full" your service is
Why: Performance degradation predictor
How: CPU, memory, disk, network utilization
Alert: Before resources are exhausted
\`\`\`

**Alerting Best Practices:**
\`\`\`
Good Alerts:
├── Actionable (someone can fix it)
├── Urgent (requires immediate attention)
├── User-impacting (affects real users)
└── Novel (not redundant with other alerts)

Avoid:
├── Alert fatigue (too many alerts)
├── False positives (alerts without real issues)
├── Vague alerts (unclear what to do)
└── Redundant alerts (multiple alerts for same issue)
\`\`\`

## Incident Management

### 🎯 Responding to System Failures

**Incident Response Process:**

**1. Detection**
\`\`\`
Sources:
- Monitoring alerts
- User reports
- Internal discovery
- External monitoring

Goal: Detect issues quickly
\`\`\`

**2. Response**
\`\`\`
Immediate Actions:
- Assess impact and severity
- Assemble response team
- Establish communication channels
- Begin mitigation efforts

Roles:
- Incident Commander (coordinates response)
- Communications Lead (updates stakeholders)
- Technical Leads (implement fixes)
\`\`\`

**3. Mitigation**
\`\`\`
Strategies:
- Rollback recent changes
- Failover to backup systems
- Scale up resources
- Apply temporary fixes
- Isolate problematic components

Priority: Restore service first, investigate later
\`\`\`

**4. Recovery**
\`\`\`
Activities:
- Verify service restoration
- Monitor for stability
- Communicate resolution
- Document timeline
- Prepare for postmortem
\`\`\`

## Postmortems

### 🎯 Learning from Failures

**Blameless Postmortem Process:**

**1. Timeline Creation**
\`\`\`
Document:
- When the incident started
- Key events and decisions
- Actions taken
- When service was restored
- Impact on users and business
\`\`\`

**2. Root Cause Analysis**
\`\`\`
Techniques:
- Five Whys method
- Fishbone diagrams
- Fault tree analysis
- Contributing factors identification

Focus: System and process failures, not human error
\`\`\`

**3. Action Items**
\`\`\`
Categories:
- Immediate fixes (prevent recurrence)
- Monitoring improvements (detect faster)
- Process improvements (respond better)
- Long-term architectural changes

Each action item should have:
- Clear description
- Assigned owner
- Target completion date
- Success criteria
\`\`\`

**Postmortem Template:**
\`\`\`
# Incident Postmortem: [Title]

## Summary
Brief description of what happened

## Impact
- Duration: X hours
- Users affected: Y%
- Revenue impact: $Z

## Timeline
- HH:MM - Event description
- HH:MM - Action taken
- HH:MM - Service restored

## Root Cause
What actually caused the incident

## Contributing Factors
What made the incident worse or harder to resolve

## Lessons Learned
What we learned from this incident

## Action Items
1. [Action] - [Owner] - [Due Date]
2. [Action] - [Owner] - [Due Date]
\`\`\`

## Toil and Automation

### 🎯 Reducing Manual Work

**What is Toil?**
\`\`\`
Characteristics:
- Manual work
- Repetitive tasks
- No enduring value
- Scales linearly with service growth
- Reactive (not strategic)

Examples:
- Manual deployments
- Ticket-driven provisioning
- Manual scaling
- Repetitive troubleshooting
\`\`\`

**Automation Strategies:**
\`\`\`
Priorities:
1. Automate frequent, error-prone tasks
2. Eliminate manual scaling operations
3. Automate incident response procedures
4. Self-healing systems where possible

Tools:
- Infrastructure as Code (Terraform)
- Configuration Management (Ansible)
- CI/CD Pipelines (Jenkins, GitLab)
- Monitoring and Alerting (Prometheus)
\`\`\`

## Reliability Engineering Practices

### 🎯 Building Reliable Systems

**Design for Failure:**
\`\`\`
Principles:
- Assume components will fail
- Build redundancy and failover
- Implement circuit breakers
- Design for graceful degradation
- Test failure scenarios regularly
\`\`\`

**Chaos Engineering:**
\`\`\`
Practice:
- Intentionally introduce failures
- Test system resilience
- Validate monitoring and alerting
- Improve incident response
- Build confidence in system reliability

Tools:
- Chaos Monkey (Netflix)
- Gremlin
- Litmus
- Chaos Toolkit
\`\`\`

**Capacity Planning:**
\`\`\`
Activities:
- Monitor resource utilization trends
- Forecast future demand
- Plan for traffic spikes
- Test system limits
- Implement auto-scaling

Considerations:
- Organic growth
- Marketing campaigns
- Seasonal patterns
- New feature launches
\`\`\`

## 🎯 Key Takeaways

1. **SRE balances reliability with feature velocity** using error budgets
2. **SLOs define clear reliability targets** that align with user expectations
3. **Monitoring the four golden signals** provides comprehensive system visibility
4. **Blameless postmortems** turn failures into learning opportunities
5. **Automation reduces toil** and improves system reliability
6. **Design for failure** and test resilience regularly

## 🚀 What's Next?

Now that you understand SRE fundamentals, you're ready to dive into Linux Basics - the foundation of most infrastructure systems!`
            }
        ]
    }
};

// Helper functions for content management
window.contentManager = {
    // Get all modules for a learning path
    getModules: function(pathId) {
        return window.learningContent[pathId]?.modules || [];
    },
    
    // Get a specific module by ID
    getModule: function(moduleId) {
        for (const pathId in window.learningContent) {
            const modules = window.learningContent[pathId].modules;
            const module = modules.find(m => m.id === moduleId);
            if (module) {
                return module;
            }
        }
        return null;
    },
    
    // Get next module in sequence
    getNextModule: function(currentModuleId) {
        for (const pathId in window.learningContent) {
            const modules = window.learningContent[pathId].modules;
            const currentIndex = modules.findIndex(m => m.id === currentModuleId);
            if (currentIndex !== -1 && currentIndex < modules.length - 1) {
                return modules[currentIndex + 1];
            }
        }
        return null;
    },
    
    // Get previous module in sequence
    getPreviousModule: function(currentModuleId) {
        for (const pathId in window.learningContent) {
            const modules = window.learningContent[pathId].modules;
            const currentIndex = modules.findIndex(m => m.id === currentModuleId);
            if (currentIndex > 0) {
                return modules[currentIndex - 1];
            }
        }
        return null;
    },
    
    // Search across all content
    searchContent: function(query) {
        const results = [];
        const lowercaseQuery = query.toLowerCase();
        
        for (const pathId in window.learningContent) {
            const path = window.learningContent[pathId];
            path.modules.forEach(module => {
                const titleMatch = module.title.toLowerCase().includes(lowercaseQuery);
                const descMatch = module.description.toLowerCase().includes(lowercaseQuery);
                const contentMatch = module.content.toLowerCase().includes(lowercaseQuery);
                
                if (titleMatch || descMatch || contentMatch) {
                    // Extract snippet around the match
                    let snippet = '';
                    if (contentMatch) {
                        const contentLower = module.content.toLowerCase();
                        const matchIndex = contentLower.indexOf(lowercaseQuery);
                        const start = Math.max(0, matchIndex - 100);
                        const end = Math.min(module.content.length, matchIndex + 100);
                        snippet = module.content.substring(start, end);
                    } else {
                        snippet = module.description;
                    }
                    
                    results.push({
                        module: module,
                        snippet: snippet,
                        path: module.path
                    });
                }
            });
        }
        
        return results;
    },
    
    // Get total module count
    getTotalModuleCount: function() {
        let total = 0;
        for (const pathId in window.learningContent) {
            total += window.learningContent[pathId].modules.length;
        }
        return total;
    },
    
    // Convert markdown to HTML (basic conversion)
    markdownToHtml: function(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```cpp\n([\s\S]*?)\n```/gim, '<pre><code class="language-cpp">$1</code></pre>')
            .replace(/```\n([\s\S]*?)\n```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            // Line breaks
            .replace(/\n/gim, '<br>');
    }
};

// Initialize content when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update storage manager with total module count
    if (window.storageManager) {
        window.storageManager.data.stats.totalModules = window.contentManager.getTotalModuleCount();
        window.storageManager.saveData();
    }
});
