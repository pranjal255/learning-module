# Arrays - Your First Data Structure

## 🎯 What You'll Learn
- What are arrays and why they're important
- Static vs Dynamic arrays
- Array operations and their complexities
- Multi-dimensional arrays
- Common array algorithms
- Real-world applications and problems

---

## 📝 Table of Contents
1. [Introduction to Arrays](#introduction-to-arrays)
2. [Static Arrays](#static-arrays)
3. [Dynamic Arrays (Vectors)](#dynamic-arrays-vectors)
4. [Array Operations](#array-operations)
5. [Multi-dimensional Arrays](#multi-dimensional-arrays)
6. [Common Array Algorithms](#common-array-algorithms)
7. [Array Problems & Solutions](#array-problems--solutions)
8. [Practice Problems](#practice-problems)

---

## Introduction to Arrays

### What is an Array?
An array is a collection of elements of the same type stored in contiguous memory locations. Think of it like a row of boxes, each containing a value, and each box has a number (index).

```
Array: [10, 20, 30, 40, 50]
Index:  0   1   2   3   4

Memory Layout:
┌────┬────┬────┬────┬────┐
│ 10 │ 20 │ 30 │ 40 │ 50 │
└────┴────┴────┴────┴────┘
```

### Why Arrays are Important
1. **Foundation**: Many other data structures are built using arrays
2. **Efficiency**: Direct access to elements using index - O(1)
3. **Memory**: Elements stored contiguously in memory
4. **Versatility**: Used in almost every program

### Basic Array Example
```cpp
#include <iostream>
using namespace std;

int main() {
    // Creating an array
    int numbers[5] = {10, 20, 30, 40, 50};
    
    // Accessing elements (0-indexed)
    cout << "First element: " << numbers[0] << endl;    // 10
    cout << "Third element: " << numbers[2] << endl;    // 30
    cout << "Last element: " << numbers[4] << endl;     // 50
    
    // Modifying elements
    numbers[1] = 25;
    cout << "Modified second element: " << numbers[1] << endl; // 25
    
    // Array size
    int size = sizeof(numbers) / sizeof(numbers[0]);
    cout << "Array size: " << size << endl;
    
    return 0;
}
```

---

## Static Arrays

### Declaration and Initialization
```cpp
#include <iostream>
using namespace std;

int main() {
    // Method 1: Declare and initialize
    int arr1[5] = {1, 2, 3, 4, 5};
    
    // Method 2: Declare then assign
    int arr2[3];
    arr2[0] = 10;
    arr2[1] = 20;
    arr2[2] = 30;
    
    // Method 3: Partial initialization (rest filled with 0)
    int arr3[5] = {1, 2};  // {1, 2, 0, 0, 0}
    
    // Method 4: Size inferred from initialization
    int arr4[] = {1, 2, 3, 4};  // Size is 4
    
    // Method 5: Initialize all elements to same value
    int arr5[5] = {0};  // All elements are 0
    
    // Printing arrays
    cout << "arr1: ";
    for (int i = 0; i < 5; i++) {
        cout << arr1[i] << " ";
    }
    cout << endl;
    
    cout << "arr3: ";
    for (int i = 0; i < 5; i++) {
        cout << arr3[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Array Traversal
```cpp
#include <iostream>
using namespace std;

void printArray(int arr[], int size) {
    cout << "Array elements: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

void printArrayReverse(int arr[], int size) {
    cout << "Array in reverse: ";
    for (int i = size - 1; i >= 0; i--) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    int numbers[] = {5, 10, 15, 20, 25};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printArray(numbers, size);
    printArrayReverse(numbers, size);
    
    // Using range-based for loop (C++11)
    cout << "Using range-based loop: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Limitations of Static Arrays
```cpp
#include <iostream>
using namespace std;

int main() {
    // 1. Fixed size - decided at compile time
    const int SIZE = 5;
    int arr[SIZE];
    
    // 2. Cannot change size during runtime
    // int newSize = 10;
    // int dynamicArr[newSize];  // This won't work in older C++ standards
    
    // 3. No bounds checking
    int numbers[3] = {1, 2, 3};
    // numbers[5] = 100;  // Dangerous! May cause undefined behavior
    
    // 4. Cannot return arrays from functions easily
    // int[] createArray() { ... }  // This won't work
    
    cout << "Static arrays have limitations!" << endl;
    cout << "That's why we use dynamic arrays (vectors)!" << endl;
    
    return 0;
}
```

---

## Dynamic Arrays (Vectors)

### Introduction to Vectors
Vectors are dynamic arrays that can grow and shrink during runtime. They're part of the C++ Standard Template Library (STL).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Creating vectors
    vector<int> v1;                    // Empty vector
    vector<int> v2(5);                 // Vector with 5 elements (all 0)
    vector<int> v3(5, 10);             // Vector with 5 elements (all 10)
    vector<int> v4 = {1, 2, 3, 4, 5}; // Initialize with values
    
    // Vector properties
    cout << "v2 size: " << v2.size() << endl;
    cout << "v3 capacity: " << v3.capacity() << endl;
    cout << "v1 is empty: " << v1.empty() << endl;
    
    // Printing vector
    cout << "v4: ";
    for (int i = 0; i < v4.size(); i++) {
        cout << v4[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Vector Operations
```cpp
#include <iostream>
#include <vector>
using namespace std;

void printVector(const vector<int>& v, const string& name) {
    cout << name << ": ";
    for (int x : v) {
        cout << x << " ";
    }
    cout << " (size: " << v.size() << ")" << endl;
}

int main() {
    vector<int> numbers;
    
    // Adding elements
    numbers.push_back(10);    // Add to end
    numbers.push_back(20);
    numbers.push_back(30);
    printVector(numbers, "After push_back");
    
    // Inserting at specific position
    numbers.insert(numbers.begin() + 1, 15);  // Insert 15 at index 1
    printVector(numbers, "After insert");
    
    // Accessing elements
    cout << "First element: " << numbers.front() << endl;
    cout << "Last element: " << numbers.back() << endl;
    cout << "Element at index 2: " << numbers[2] << endl;
    cout << "Element at index 2 (safe): " << numbers.at(2) << endl;
    
    // Modifying elements
    numbers[0] = 5;
    printVector(numbers, "After modification");
    
    // Removing elements
    numbers.pop_back();       // Remove last element
    printVector(numbers, "After pop_back");
    
    numbers.erase(numbers.begin() + 1);  // Remove element at index 1
    printVector(numbers, "After erase");
    
    // Clear all elements
    numbers.clear();
    cout << "After clear - size: " << numbers.size() << endl;
    
    return 0;
}
```

### Vector vs Array Comparison
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Static Array
    int staticArr[5] = {1, 2, 3, 4, 5};
    
    // Dynamic Array (Vector)
    vector<int> dynamicArr = {1, 2, 3, 4, 5};
    
    cout << "=== Comparison ===" << endl;
    
    // Size
    cout << "Static array size: " << sizeof(staticArr)/sizeof(staticArr[0]) << endl;
    cout << "Vector size: " << dynamicArr.size() << endl;
    
    // Adding elements
    // staticArr[5] = 6;  // Dangerous! Out of bounds
    dynamicArr.push_back(6);  // Safe and easy
    cout << "Vector after adding element: " << dynamicArr.size() << endl;
    
    // Memory management
    cout << "Static array: Fixed memory" << endl;
    cout << "Vector: Automatic memory management" << endl;
    
    // Bounds checking
    // cout << staticArr[10];     // No bounds checking
    // cout << dynamicArr.at(10); // Throws exception if out of bounds
    
    return 0;
}
```

---

## Array Operations

### Time Complexity Analysis
```cpp
#include <iostream>
#include <vector>
#include <chrono>
using namespace std;

class ArrayOperations {
public:
    // O(1) - Access element by index
    static int access(vector<int>& arr, int index) {
        return arr[index];
    }
    
    // O(n) - Search for element (unsorted array)
    static int linearSearch(vector<int>& arr, int target) {
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
    
    // O(log n) - Search in sorted array
    static int binarySearch(vector<int>& arr, int target) {
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
    
    // O(1) - Insert at end (amortized)
    static void insertAtEnd(vector<int>& arr, int value) {
        arr.push_back(value);
    }
    
    // O(n) - Insert at beginning
    static void insertAtBeginning(vector<int>& arr, int value) {
        arr.insert(arr.begin(), value);
    }
    
    // O(n) - Insert at specific position
    static void insertAt(vector<int>& arr, int index, int value) {
        arr.insert(arr.begin() + index, value);
    }
    
    // O(1) - Delete from end
    static void deleteFromEnd(vector<int>& arr) {
        if (!arr.empty()) {
            arr.pop_back();
        }
    }
    
    // O(n) - Delete from beginning
    static void deleteFromBeginning(vector<int>& arr) {
        if (!arr.empty()) {
            arr.erase(arr.begin());
        }
    }
    
    // O(n) - Delete from specific position
    static void deleteAt(vector<int>& arr, int index) {
        if (index >= 0 && index < arr.size()) {
            arr.erase(arr.begin() + index);
        }
    }
};

void printVector(const vector<int>& arr) {
    for (int x : arr) cout << x << " ";
    cout << endl;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9};
    
    cout << "Original array: ";
    printVector(arr);
    
    // Access - O(1)
    cout << "Element at index 2: " << ArrayOperations::access(arr, 2) << endl;
    
    // Search - O(n)
    int pos = ArrayOperations::linearSearch(arr, 5);
    cout << "Linear search for 5: " << (pos != -1 ? "Found at " + to_string(pos) : "Not found") << endl;
    
    // Insert operations
    ArrayOperations::insertAtEnd(arr, 11);
    cout << "After inserting 11 at end: ";
    printVector(arr);
    
    ArrayOperations::insertAtBeginning(arr, 0);
    cout << "After inserting 0 at beginning: ";
    printVector(arr);
    
    ArrayOperations::insertAt(arr, 3, 4);
    cout << "After inserting 4 at index 3: ";
    printVector(arr);
    
    // Delete operations
    ArrayOperations::deleteFromEnd(arr);
    cout << "After deleting from end: ";
    printVector(arr);
    
    ArrayOperations::deleteAt(arr, 2);
    cout << "After deleting from index 2: ";
    printVector(arr);
    
    return 0;
}
```

---

## Multi-dimensional Arrays

### 2D Arrays (Matrices)
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Static 2D array
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    // Dynamic 2D array using vector
    vector<vector<int>> dynamicMatrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    // Creating 2D vector with specific size
    int rows = 3, cols = 4;
    vector<vector<int>> matrix2D(rows, vector<int>(cols, 0));
    
    // Filling the matrix
    int value = 1;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            matrix2D[i][j] = value++;
        }
    }
    
    // Printing 2D array
    cout << "Static 2D array:" << endl;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            cout << matrix[i][j] << "\t";
        }
        cout << endl;
    }
    
    cout << "\nDynamic 2D array:" << endl;
    for (int i = 0; i < matrix2D.size(); i++) {
        for (int j = 0; j < matrix2D[i].size(); j++) {
            cout << matrix2D[i][j] << "\t";
        }
        cout << endl;
    }
    
    return 0;
}
```

### Matrix Operations
```cpp
#include <iostream>
#include <vector>
using namespace std;

class Matrix {
public:
    // Add two matrices
    static vector<vector<int>> add(const vector<vector<int>>& A, const vector<vector<int>>& B) {
        int rows = A.size();
        int cols = A[0].size();
        vector<vector<int>> result(rows, vector<int>(cols));
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = A[i][j] + B[i][j];
            }
        }
        return result;
    }
    
    // Transpose matrix
    static vector<vector<int>> transpose(const vector<vector<int>>& matrix) {
        int rows = matrix.size();
        int cols = matrix[0].size();
        vector<vector<int>> result(cols, vector<int>(rows));
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }
    
    // Print matrix
    static void print(const vector<vector<int>>& matrix) {
        for (const auto& row : matrix) {
            for (int val : row) {
                cout << val << "\t";
            }
            cout << endl;
        }
    }
    
    // Search in matrix (sorted row-wise and column-wise)
    static bool searchMatrix(const vector<vector<int>>& matrix, int target) {
        if (matrix.empty()) return false;
        
        int rows = matrix.size();
        int cols = matrix[0].size();
        int row = 0, col = cols - 1;
        
        while (row < rows && col >= 0) {
            if (matrix[row][col] == target) {
                return true;
            } else if (matrix[row][col] > target) {
                col--;
            } else {
                row++;
            }
        }
        return false;
    }
};

int main() {
    vector<vector<int>> A = {{1, 2, 3}, {4, 5, 6}};
    vector<vector<int>> B = {{7, 8, 9}, {10, 11, 12}};
    
    cout << "Matrix A:" << endl;
    Matrix::print(A);
    
    cout << "\nMatrix B:" << endl;
    Matrix::print(B);
    
    cout << "\nA + B:" << endl;
    vector<vector<int>> sum = Matrix::add(A, B);
    Matrix::print(sum);
    
    cout << "\nTranspose of A:" << endl;
    vector<vector<int>> transposeA = Matrix::transpose(A);
    Matrix::print(transposeA);
    
    return 0;
}
```

---

## Common Array Algorithms

### Sorting Algorithms
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class SortingAlgorithms {
public:
    // Bubble Sort - O(n²)
    static void bubbleSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }
        }
    }
    
    // Selection Sort - O(n²)
    static void selectionSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            swap(arr[i], arr[minIdx]);
        }
    }
    
    // Insertion Sort - O(n²)
    static void insertionSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
    
    // Quick Sort - O(n log n) average, O(n²) worst
    static void quickSort(vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
private:
    static int partition(vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }
};

void printArray(const vector<int>& arr, const string& name) {
    cout << name << ": ";
    for (int x : arr) cout << x << " ";
    cout << endl;
}

int main() {
    vector<int> original = {64, 34, 25, 12, 22, 11, 90};
    
    // Test different sorting algorithms
    vector<int> arr1 = original;
    SortingAlgorithms::bubbleSort(arr1);
    printArray(arr1, "Bubble Sort");
    
    vector<int> arr2 = original;
    SortingAlgorithms::selectionSort(arr2);
    printArray(arr2, "Selection Sort");
    
    vector<int> arr3 = original;
    SortingAlgorithms::insertionSort(arr3);
    printArray(arr3, "Insertion Sort");
    
    vector<int> arr4 = original;
    SortingAlgorithms::quickSort(arr4, 0, arr4.size() - 1);
    printArray(arr4, "Quick Sort");
    
    // Using STL sort - O(n log n)
    vector<int> arr5 = original;
    sort(arr5.begin(), arr5.end());
    printArray(arr5, "STL Sort");
    
    return 0;
}
```

### Array Manipulation Algorithms
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class ArrayAlgorithms {
public:
    // Reverse array - O(n)
    static void reverse(vector<int>& arr) {
        int left = 0, right = arr.size() - 1;
        while (left < right) {
            swap(arr[left], arr[right]);
            left++;
            right--;
        }
    }
    
    // Rotate array left by k positions - O(n)
    static void rotateLeft(vector<int>& arr, int k) {
        int n = arr.size();
        k = k % n;  // Handle k > n
        
        reverse(arr.begin(), arr.begin() + k);
        reverse(arr.begin() + k, arr.end());
        reverse(arr.begin(), arr.end());
    }
    
    // Find maximum element - O(n)
    static int findMax(const vector<int>& arr) {
        int maxVal = arr[0];
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] > maxVal) {
                maxVal = arr[i];
            }
        }
        return maxVal;
    }
    
    // Find second largest - O(n)
    static int findSecondLargest(const vector<int>& arr) {
        int largest = INT_MIN, secondLargest = INT_MIN;
        
        for (int num : arr) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num > secondLargest && num != largest) {
                secondLargest = num;
            }
        }
        return secondLargest;
    }
    
    // Remove duplicates from sorted array - O(n)
    static int removeDuplicates(vector<int>& arr) {
        if (arr.empty()) return 0;
        
        int writeIndex = 1;
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] != arr[i - 1]) {
                arr[writeIndex] = arr[i];
                writeIndex++;
            }
        }
        return writeIndex;
    }
    
    // Check if array is sorted - O(n)
    static bool isSorted(const vector<int>& arr) {
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
};

void printArray(const vector<int>& arr, const string& name) {
    cout << name << ": ";
    for (int x : arr) cout << x << " ";
    cout << endl;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    printArray(arr, "Original");
    
    // Reverse
    ArrayAlgorithms::reverse(arr);
    printArray(arr, "Reversed");
    
    // Rotate left by 2
    ArrayAlgorithms::rotateLeft(arr, 2);
    printArray(arr, "Rotated left by 2");
    
    // Find max
    cout << "Maximum element: " << ArrayAlgorithms::findMax(arr) << endl;
    
    // Check if sorted
    cout << "Is sorted: " << (ArrayAlgorithms::isSorted(arr) ? "Yes" : "No") << endl;
    
    // Remove duplicates
    vector<int> duplicates = {1, 1, 2, 2, 3, 4, 4, 5};
    printArray(duplicates, "With duplicates");
    int newSize = ArrayAlgorithms::removeDuplicates(duplicates);
    cout << "After removing duplicates (size " << newSize << "): ";
    for (int i = 0; i < newSize; i++) {
        cout << duplicates[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

---

## Array Problems & Solutions

### Problem 1: Two Sum
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class TwoSum {
public:
    // Brute Force - O(n²)
    static vector<int> twoSumBruteForce(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
    
    // Hash Map - O(n)
    static vector<int> twoSumOptimal(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    cout << "Array: ";
    for (int x : nums) cout << x << " ";
    cout << "\nTarget: " << target << endl;
    
    vector<int> result1 = TwoSum::twoSumBruteForce(nums, target);
    cout << "Brute Force result: [" << result1[0] << ", " << result1[1] << "]" << endl;
    
    vector<int> result2 = TwoSum::twoSumOptimal(nums, target);
    cout << "Optimal result: [" << result2[0] << ", " << result2[1] << "]" << endl;
    
    return 0;
}
```

### Problem 2: Maximum Subarray Sum (Kadane's Algorithm)
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class MaxSubarray {
public:
    // Kadane's Algorithm - O(n)
    static int maxSubarraySum(vector<int>& nums) {
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
            maxSoFar = max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
    }
    
    // Also return the subarray indices
    static pair<int, pair<int, int>> maxSubarrayWithIndices(vector<int>& nums) {
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        int start = 0, end = 0, tempStart = 0;
        
        for (int i = 1; i < nums.size(); i++) {
            if (maxEndingHere < 0) {
                maxEndingHere = nums[i];
                tempStart = i;
            } else {
                maxEndingHere += nums[i];
            }
            
            if (maxEndingHere > maxSoFar) {
                maxSoFar = maxEndingHere;
                start = tempStart;
                end = i;
            }
        }
        
        return {maxSoFar, {start, end}};
    }
};

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    
    cout << "Array: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    int maxSum = MaxSubarray::maxSubarraySum(nums);
    cout << "Maximum subarray sum: " << maxSum << endl;
    
    auto result = MaxSubarray::maxSubarrayWithIndices(nums);
    cout << "Maximum sum: " << result.first << endl;
    cout << "Subarray from index " << result.second.first 
         << " to " << result.second.second << ": ";
    
    for (int i = result.second.first; i <= result.second.second; i++) {
        cout << nums[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

### Problem 3: Array Rotation
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class ArrayRotation {
public:
    // Method 1: Using extra space - O(n) time, O(n) space
    static void rotateRightExtraSpace(vector<int>& arr, int k) {
        int n = arr.size();
        k = k % n;
        
        vector<int> temp(n);
        for (int i = 0; i < n; i++) {
            temp[(i + k) % n] = arr[i];
        }
        arr = temp;
    }
    
    // Method 2: Using reversal - O(n) time, O(1) space
    static void rotateRightOptimal(vector<int>& arr, int k) {
        int n = arr.size();
        k = k % n;
        
        // Reverse entire array
        reverse(arr.begin(), arr.end());
        // Reverse first k elements
        reverse(arr.begin(), arr.begin() + k);
        // Reverse remaining elements
        reverse(arr.begin() + k, arr.end());
    }
};

int main() {
    vector<int> arr1 = {1, 2, 3, 4, 5, 6, 7};
    vector<int> arr2 = arr1;
    
    cout << "Original: ";
    for (int x : arr1) cout << x << " ";
    cout << endl;
    
    ArrayRotation::rotateRightExtraSpace(arr1, 3);
    cout << "Rotated right by 3 (extra space): ";
    for (int x : arr1) cout << x << " ";
    cout << endl;
    
    ArrayRotation::rotateRightOptimal(arr2, 3);
    cout << "Rotated right by 3 (optimal): ";
    for (int x : arr2) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: Find Missing Number
```cpp
#include <iostream>
#include <vector>
using namespace std;

class MissingNumber {
public:
    // Method 1: Using sum formula - O(n) time, O(1) space
    static int findMissingSum(vector<int>& nums) {
        int n = nums.size() + 1;  // Original array should have n numbers
        int expectedSum = n * (n - 1) / 2;  // Sum of 0 to n-1
        int actualSum = 0;
        
        for (int num : nums) {
            actualSum += num;
        }
        
        return expectedSum - actualSum;
    }
    
    // Method 2: Using XOR - O(n) time, O(1) space
    static int findMissingXOR(vector<int>& nums) {
        int n = nums.size();
        int xorAll = 0, xorArray = 0;
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xorAll ^= i;
        }
        
        // XOR all numbers in array
        for (int num : nums) {
            xorArray ^= num;
        }
        
        return xorAll ^ xorArray;
    }
};

int main() {
    vector<int> nums = {3, 0, 1};  // Missing 2
    
    cout << "Array: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    cout << "Missing number (sum method): " << MissingNumber::findMissingSum(nums) << endl;
    cout << "Missing number (XOR method): " << MissingNumber::findMissingXOR(nums) << endl;
    
    return 0;
}
```

### Problem 2: Move Zeros to End
```cpp
#include <iostream>
#include <vector>
using namespace std;

class MoveZeros {
public:
    // Two-pointer approach - O(n) time, O(1) space
    static void moveZerosToEnd(vector<int>& nums) {
        int writeIndex = 0;
        
        // Move all non-zero elements to the front
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                nums[writeIndex] = nums[i];
                writeIndex++;
            }
        }
        
        // Fill remaining positions with zeros
        while (writeIndex < nums.size()) {
            nums[writeIndex] = 0;
            writeIndex++;
        }
    }
    
    // Alternative: Swap approach
    static void moveZerosSwap(vector<int>& nums) {
        int left = 0;
        
        for (int right = 0; right < nums.size(); right++) {
            if (nums[right] != 0) {
                swap(nums[left], nums[right]);
                left++;
            }
        }
    }
};

void printArray(const vector<int>& arr, const string& name) {
    cout << name << ": ";
    for (int x : arr) cout << x << " ";
    cout << endl;
}

int main() {
    vector<int> nums1 = {0, 1, 0, 3, 12};
    vector<int> nums2 = nums1;
    
    printArray(nums1, "Original");
    
    MoveZeros::moveZerosToEnd(nums1);
    printArray(nums1, "After moving zeros (method 1)");
    
    MoveZeros::moveZerosSwap(nums2);
    printArray(nums2, "After moving zeros (method 2)");
    
    return 0;
}
```

### Problem 3: Best Time to Buy and Sell Stock
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class StockProfit {
public:
    // Single pass solution - O(n) time, O(1) space
    static int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int minPrice = prices[0];
        int maxProfit = 0;
        
        for (int i = 1; i < prices.size(); i++) {
            // Update minimum price seen so far
            minPrice = min(minPrice, prices[i]);
            
            // Calculate profit if we sell today
            int profit = prices[i] - minPrice;
            
            // Update maximum profit
            maxProfit = max(maxProfit, profit);
        }
        
        return maxProfit;
    }
    
    // With buy and sell days
    static pair<int, pair<int, int>> maxProfitWithDays(vector<int>& prices) {
        if (prices.empty()) return {0, {-1, -1}};
        
        int minPrice = prices[0];
        int maxProfit = 0;
        int buyDay = 0, sellDay = 0;
        int tempBuyDay = 0;
        
        for (int i = 1; i < prices.size(); i++) {
            if (prices[i] < minPrice) {
                minPrice = prices[i];
                tempBuyDay = i;
            }
            
            int profit = prices[i] - minPrice;
            if (profit > maxProfit) {
                maxProfit = profit;
                buyDay = tempBuyDay;
                sellDay = i;
            }
        }
        
        return {maxProfit, {buyDay, sellDay}};
    }
};

int main() {
    vector<int> prices = {7, 1, 5, 3, 6, 4};
    
    cout << "Stock prices: ";
    for (int price : prices) cout << price << " ";
    cout << endl;
    
    int profit = StockProfit::maxProfit(prices);
    cout << "Maximum profit: " << profit << endl;
    
    auto result = StockProfit::maxProfitWithDays(prices);
    cout << "Maximum profit: " << result.first << endl;
    cout << "Buy on day " << result.second.first << " (price: " << prices[result.second.first] << ")" << endl;
    cout << "Sell on day " << result.second.second << " (price: " << prices[result.second.second] << ")" << endl;
    
    return 0;
}
```

### Problem 4: Contains Duplicate
```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

class ContainsDuplicate {
public:
    // Method 1: Sorting - O(n log n) time, O(1) space
    static bool containsDuplicateSort(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] == nums[i - 1]) {
                return true;
            }
        }
        return false;
    }
    
    // Method 2: Hash Set - O(n) time, O(n) space
    static bool containsDuplicateHash(vector<int>& nums) {
        unordered_set<int> seen;
        
        for (int num : nums) {
            if (seen.find(num) != seen.end()) {
                return true;
            }
            seen.insert(num);
        }
        return false;
    }
};

int main() {
    vector<int> nums1 = {1, 2, 3, 1};
    vector<int> nums2 = {1, 2, 3, 4};
    vector<int> nums1_copy = nums1;  // For sorting method
    
    cout << "Array 1: ";
    for (int x : nums1) cout << x << " ";
    cout << endl;
    
    cout << "Contains duplicate (hash): " << (ContainsDuplicate::containsDuplicateHash(nums1) ? "Yes" : "No") << endl;
    cout << "Contains duplicate (sort): " << (ContainsDuplicate::containsDuplicateSort(nums1_copy) ? "Yes" : "No") << endl;
    
    cout << "\nArray 2: ";
    for (int x : nums2) cout << x << " ";
    cout << endl;
    
    cout << "Contains duplicate (hash): " << (ContainsDuplicate::containsDuplicateHash(nums2) ? "Yes" : "No") << endl;
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Array Fundamentals
1. **Index-based access**: O(1) time complexity for accessing elements
2. **Contiguous memory**: Elements stored next to each other in memory
3. **Fixed vs Dynamic**: Static arrays have fixed size, vectors can grow
4. **Zero-indexed**: First element is at index 0

### Time Complexities
- **Access**: O(1)
- **Search**: O(n) for unsorted, O(log n) for sorted
- **Insertion**: O(1) at end, O(n) at beginning/middle
- **Deletion**: O(1) at end, O(n) at beginning/middle

### Common Patterns
1. **Two Pointers**: For problems involving pairs or reversing
2. **Sliding Window**: For subarray problems
3. **Hash Maps**: For fast lookups and counting
4. **Sorting**: Often simplifies complex problems

### Best Practices
1. **Use vectors over static arrays** for flexibility
2. **Check bounds** to avoid segmentation faults
3. **Consider space-time tradeoffs** when choosing algorithms
4. **Practice common patterns** like two pointers and sliding window

---

## 🚀 What's Next?

Congratulations! You've mastered arrays, the foundation of many data structures. Next, let's explore [Strings](04_Strings.md) - a special type of array that works with text data!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Find duplicate number, merge sorted arrays
2. **Medium**: 3Sum, product of array except self
3. **Hard**: Median of two sorted arrays, trapping rain water

### Tips for Success
1. **Start with brute force** - get a working solution first
2. **Optimize gradually** - improve time/space complexity step by step
3. **Draw examples** - visualize the problem with small arrays
4. **Test edge cases** - empty arrays, single elements, duplicates
5. **Practice regularly** - consistency is key to mastering arrays!

**Remember: Arrays are everywhere in programming - master them and you'll have a solid foundation for all other data structures!** 🎯
