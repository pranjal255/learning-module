# Time and Space Complexity Analysis

## 🎯 What You'll Learn
- What is algorithm complexity?
- Big O notation explained simply
- How to analyze time complexity
- How to analyze space complexity
- Common complexity patterns
- Practical examples with C++ code

---

## 📝 Table of Contents
1. [Why Complexity Matters](#why-complexity-matters)
2. [Big O Notation](#big-o-notation)
3. [Time Complexity](#time-complexity)
4. [Space Complexity](#space-complexity)
5. [Common Complexity Classes](#common-complexity-classes)
6. [Analyzing Code Examples](#analyzing-code-examples)
7. [Best vs Average vs Worst Case](#best-vs-average-vs-worst-case)
8. [Practice Problems](#practice-problems)

---

## Why Complexity Matters

### Real-World Example
Imagine you're looking for a specific book in a library:

**Method 1: Linear Search**
- Check every book one by one from start to end
- If library has 1 million books, worst case: check all 1 million books
- Time: Could take hours!

**Method 2: Using Library System (Binary Search)**
- Books are organized, use catalog system
- Eliminate half the possibilities with each step
- Time: Find any book in about 20 steps maximum!

This is why algorithm efficiency matters - the difference between hours and seconds!

```cpp
#include <iostream>
#include <vector>
#include <chrono>
using namespace std;

// Linear Search - O(n)
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// Binary Search - O(log n) - array must be sorted
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 13;
    
    cout << "Linear Search result: " << linearSearch(arr, target) << endl;
    cout << "Binary Search result: " << binarySearch(arr, target) << endl;
    
    return 0;
}
```

---

## Big O Notation

### What is Big O?
Big O notation describes how the runtime or space requirements of an algorithm grow as the input size increases.

**Think of it like this:**
- O(1): No matter how big the input, always takes the same time
- O(n): If input doubles, time roughly doubles
- O(n²): If input doubles, time roughly quadruples

### Visual Representation
```
Time
 ^
 |     O(n²)
 |    /
 |   /
 |  /     O(n log n)
 | /     /
 |/     /
 |     /    O(n)
 |    /    /
 |   /    /
 |  /    /     O(log n)
 | /    /     /
 |/    /     /
 |    /     /_________ O(1)
 |___/________________> Input Size (n)
```

### Common Big O Notations (Best to Worst)
1. **O(1)** - Constant time
2. **O(log n)** - Logarithmic time
3. **O(n)** - Linear time
4. **O(n log n)** - Linearithmic time
5. **O(n²)** - Quadratic time
6. **O(2ⁿ)** - Exponential time

---

## Time Complexity

### O(1) - Constant Time
**Definition:** Operation takes the same time regardless of input size.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(1) - Accessing array element by index
int getFirstElement(vector<int>& arr) {
    return arr[0];  // Always takes same time, regardless of array size
}

// O(1) - Simple arithmetic operations
int add(int a, int b) {
    return a + b;  // Always takes same time
}

// O(1) - Hash table lookup (average case)
int main() {
    vector<int> small = {1, 2, 3};
    vector<int> large(1000000, 5);
    
    // Both take exactly the same time!
    cout << "First element of small array: " << getFirstElement(small) << endl;
    cout << "First element of large array: " << getFirstElement(large) << endl;
    
    return 0;
}
```

### O(log n) - Logarithmic Time
**Definition:** Time increases slowly as input size increases.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(log n) - Binary Search
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    int steps = 0;
    
    while (left <= right) {
        steps++;
        int mid = left + (right - left) / 2;
        
        cout << "Step " << steps << ": Checking index " << mid 
             << " (value: " << arr[mid] << ")" << endl;
        
        if (arr[mid] == target) {
            cout << "Found in " << steps << " steps!" << endl;
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    cout << "Not found after " << steps << " steps" << endl;
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31};
    
    cout << "Searching for 23 in array of size " << arr.size() << ":" << endl;
    binarySearch(arr, 23);
    
    return 0;
}
```

### O(n) - Linear Time
**Definition:** Time increases proportionally with input size.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(n) - Linear Search
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// O(n) - Finding sum of array
int arraySum(vector<int>& arr) {
    int sum = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
    }
    return sum;
}

// O(n) - Printing all elements
void printArray(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};
    
    cout << "Array: ";
    printArray(arr);  // O(n)
    
    cout << "Sum: " << arraySum(arr) << endl;  // O(n)
    
    cout << "Searching for 7: " << linearSearch(arr, 7) << endl;  // O(n)
    
    return 0;
}
```

### O(n²) - Quadratic Time
**Definition:** Time increases quadratically with input size.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(n²) - Bubble Sort
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    int comparisons = 0;
    
    for (int i = 0; i < n - 1; i++) {        // Outer loop: n times
        for (int j = 0; j < n - i - 1; j++) { // Inner loop: n times
            comparisons++;
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
    
    cout << "Total comparisons: " << comparisons << endl;
    cout << "For array size " << n << ", we did approximately n² = " 
         << n * n << " operations" << endl;
}

// O(n²) - Finding all pairs
void printAllPairs(vector<int>& arr) {
    cout << "All pairs:" << endl;
    for (int i = 0; i < arr.size(); i++) {
        for (int j = i + 1; j < arr.size(); j++) {
            cout << "(" << arr[i] << ", " << arr[j] << ") ";
        }
    }
    cout << endl;
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    cout << "Original array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    bubbleSort(arr);
    
    cout << "Sorted array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### O(2ⁿ) - Exponential Time
**Definition:** Time doubles with each additional input element.

```cpp
#include <iostream>
using namespace std;

// O(2^n) - Naive Fibonacci (very inefficient!)
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// O(n) - Efficient Fibonacci
int fibonacciEfficient(int n) {
    if (n <= 1) return n;
    
    int prev2 = 0, prev1 = 1, current;
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}

int main() {
    int n = 10;
    
    cout << "Fibonacci(" << n << ") using O(2^n) method: " 
         << fibonacci(n) << endl;
    
    cout << "Fibonacci(" << n << ") using O(n) method: " 
         << fibonacciEfficient(n) << endl;
    
    // Try with larger numbers to see the difference!
    // fibonacci(40) will take several seconds
    // fibonacciEfficient(40) will be instant
    
    return 0;
}
```

---

## Space Complexity

### What is Space Complexity?
Space complexity measures how much extra memory an algorithm uses as the input size grows.

### O(1) - Constant Space
```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(1) space - only uses a few variables
int findMax(vector<int>& arr) {
    int maxVal = arr[0];  // One variable
    
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    
    return maxVal;  // Space used doesn't depend on input size
}

int main() {
    vector<int> arr = {3, 7, 2, 9, 1, 5};
    cout << "Maximum value: " << findMax(arr) << endl;
    return 0;
}
```

### O(n) - Linear Space
```cpp
#include <iostream>
#include <vector>
using namespace std;

// O(n) space - creates a copy of the array
vector<int> reverseArray(vector<int>& arr) {
    vector<int> reversed(arr.size());  // New array of size n
    
    for (int i = 0; i < arr.size(); i++) {
        reversed[i] = arr[arr.size() - 1 - i];
    }
    
    return reversed;  // Space used = O(n)
}

// O(1) space - reverses in place
void reverseInPlace(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
    // No extra space needed!
}

int main() {
    vector<int> arr1 = {1, 2, 3, 4, 5};
    vector<int> arr2 = {1, 2, 3, 4, 5};
    
    // Method 1: O(n) space
    vector<int> reversed = reverseArray(arr1);
    cout << "Reversed (new array): ";
    for (int x : reversed) cout << x << " ";
    cout << endl;
    
    // Method 2: O(1) space
    reverseInPlace(arr2);
    cout << "Reversed (in place): ";
    for (int x : arr2) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

---

## Common Complexity Classes

### Summary Table
| Big O | Name | Example | Description |
|-------|------|---------|-------------|
| O(1) | Constant | Array access | Same time always |
| O(log n) | Logarithmic | Binary search | Very efficient |
| O(n) | Linear | Linear search | Reasonable |
| O(n log n) | Linearithmic | Merge sort | Good for sorting |
| O(n²) | Quadratic | Bubble sort | Slow for large inputs |
| O(2ⁿ) | Exponential | Naive fibonacci | Very slow |

### Growth Comparison
```cpp
#include <iostream>
#include <iomanip>
using namespace std;

void complexityComparison() {
    cout << setw(10) << "n" 
         << setw(12) << "O(1)" 
         << setw(12) << "O(log n)" 
         << setw(12) << "O(n)" 
         << setw(12) << "O(n log n)" 
         << setw(12) << "O(n²)" << endl;
    
    cout << string(70, '-') << endl;
    
    int sizes[] = {1, 10, 100, 1000, 10000};
    
    for (int n : sizes) {
        cout << setw(10) << n
             << setw(12) << 1
             << setw(12) << (int)(log2(n))
             << setw(12) << n
             << setw(12) << (int)(n * log2(n))
             << setw(12) << n * n << endl;
    }
}

int main() {
    cout << "Algorithm Complexity Comparison:" << endl;
    complexityComparison();
    return 0;
}
```

---

## Analyzing Code Examples

### Example 1: Nested Loops
```cpp
#include <iostream>
#include <vector>
using namespace std;

// What's the time complexity?
void example1(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n; i++) {        // Loop 1: n times
        for (int j = 0; j < n; j++) {    // Loop 2: n times (for each i)
            cout << arr[i] << " " << arr[j] << endl;
        }
    }
    // Answer: O(n²) - nested loops both run n times
}

// What about this one?
void example2(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n; i++) {        // Loop 1: n times
        cout << arr[i] << endl;
    }
    
    for (int j = 0; j < n; j++) {        // Loop 2: n times
        cout << arr[j] << endl;
    }
    // Answer: O(n) - two separate loops, so n + n = 2n = O(n)
}

int main() {
    vector<int> arr = {1, 2, 3};
    
    cout << "Example 1 (O(n²)):" << endl;
    example1(arr);
    
    cout << "\nExample 2 (O(n)):" << endl;
    example2(arr);
    
    return 0;
}
```

### Example 2: Recursive Functions
```cpp
#include <iostream>
using namespace std;

// What's the time complexity?
void printNumbers(int n) {
    if (n <= 0) return;
    
    cout << n << " ";
    printNumbers(n - 1);  // Calls itself with n-1
}
// Answer: O(n) - function calls itself n times

// What about this one?
int binarySearchRecursive(vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}
// Answer: O(log n) - eliminates half the search space each time

int main() {
    cout << "Printing numbers from 5 to 1:" << endl;
    printNumbers(5);
    cout << endl;
    
    return 0;
}
```

---

## Best vs Average vs Worst Case

### Understanding Different Cases
```cpp
#include <iostream>
#include <vector>
using namespace std;

int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            cout << "Found at position " << i << " after " << (i + 1) << " comparisons" << endl;
            return i;
        }
    }
    cout << "Not found after " << arr.size() << " comparisons" << endl;
    return -1;
}

int main() {
    vector<int> arr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    
    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl << endl;
    
    // Best case: O(1) - element is at the beginning
    cout << "Best case - searching for 10:" << endl;
    linearSearch(arr, 10);
    cout << endl;
    
    // Average case: O(n/2) = O(n) - element is in the middle
    cout << "Average case - searching for 50:" << endl;
    linearSearch(arr, 50);
    cout << endl;
    
    // Worst case: O(n) - element is at the end or not present
    cout << "Worst case - searching for 100:" << endl;
    linearSearch(arr, 100);
    cout << endl;
    
    cout << "Worst case - searching for 999 (not present):" << endl;
    linearSearch(arr, 999);
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: Analyze These Functions
```cpp
#include <iostream>
#include <vector>
using namespace std;

// Function A - What's the time complexity?
void functionA(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = i + 1; j < arr.size(); j++) {
            if (arr[i] > arr[j]) {
                swap(arr[i], arr[j]);
            }
        }
    }
}
// Answer: O(n²)

// Function B - What's the time complexity?
void functionB(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i += 2) {
        cout << arr[i] << " ";
    }
}
// Answer: O(n) - even though we skip elements, we still visit n/2 elements

// Function C - What's the time complexity?
void functionC(int n) {
    for (int i = 1; i < n; i *= 2) {
        cout << i << " ";
    }
}
// Answer: O(log n) - i doubles each time: 1, 2, 4, 8, 16...

int main() {
    vector<int> arr = {5, 2, 8, 1, 9, 3};
    
    cout << "Testing functions:" << endl;
    
    cout << "Function B output: ";
    functionB(arr);
    cout << endl;
    
    cout << "Function C output (n=16): ";
    functionC(16);
    cout << endl;
    
    return 0;
}
```

### Problem 2: Space Complexity Analysis
```cpp
#include <iostream>
#include <vector>
using namespace std;

// Function X - What's the space complexity?
vector<int> functionX(vector<int>& arr) {
    vector<int> result;
    for (int i = 0; i < arr.size(); i++) {
        result.push_back(arr[i] * 2);
    }
    return result;
}
// Answer: O(n) - creates new array of size n

// Function Y - What's the space complexity?
void functionY(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        arr[i] *= 2;
    }
}
// Answer: O(1) - modifies array in place, no extra space

// Function Z - What's the space complexity?
void functionZ(int n) {
    if (n <= 0) return;
    
    int temp = n;
    cout << temp << " ";
    functionZ(n - 1);
}
// Answer: O(n) - recursive calls use stack space

int main() {
    vector<int> arr1 = {1, 2, 3, 4, 5};
    vector<int> arr2 = {1, 2, 3, 4, 5};
    
    cout << "Original arrays:" << endl;
    cout << "arr1: "; for (int x : arr1) cout << x << " "; cout << endl;
    cout << "arr2: "; for (int x : arr2) cout << x << " "; cout << endl;
    
    vector<int> result = functionX(arr1);  // O(n) space
    functionY(arr2);                       // O(1) space
    
    cout << "\nAfter function calls:" << endl;
    cout << "result: "; for (int x : result) cout << x << " "; cout << endl;
    cout << "arr2: "; for (int x : arr2) cout << x << " "; cout << endl;
    
    return 0;
}
```

---

## 🎯 Key Takeaways

1. **Big O describes growth rate** - How performance changes with input size
2. **Focus on worst case** - Usually what we care about most
3. **Drop constants and lower terms** - O(2n + 5) becomes O(n)
4. **Space vs Time tradeoffs** - Sometimes you can trade one for the other
5. **Nested loops often mean O(n²)** - Be careful with multiple loops
6. **Recursive functions** - Analyze how many times they call themselves

### Quick Reference
- **O(1)**: Hash table lookup, array access
- **O(log n)**: Binary search, balanced tree operations
- **O(n)**: Linear search, single loop through array
- **O(n log n)**: Efficient sorting (merge sort, heap sort)
- **O(n²)**: Nested loops, bubble sort
- **O(2ⁿ)**: Recursive fibonacci, subset generation

---

## 🚀 What's Next?

Now that you understand how to analyze algorithm efficiency, you're ready to dive into your first data structure: [Arrays](03_Arrays.md)!

---

## 📚 Practice Tips

1. **Always ask**: "What happens when input size doubles?"
2. **Count the loops**: Nested loops often indicate higher complexity
3. **Consider best, average, and worst cases**
4. **Practice with small examples** first, then generalize
5. **Remember**: Understanding complexity helps you choose the right algorithm!

**Remember: Good algorithms can make the difference between a program that runs in seconds vs hours!** ⚡
