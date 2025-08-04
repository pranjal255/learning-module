# Strings - Working with Text Data

## 🎯 What You'll Learn
- Understanding strings as character arrays
- String operations and manipulations
- String algorithms and patterns
- Common string problems and solutions
- Performance considerations with strings

---

## 📝 Table of Contents
1. [Introduction to Strings](#introduction-to-strings)
2. [String Basics in C++](#string-basics-in-c)
3. [String Operations](#string-operations)
4. [String Algorithms](#string-algorithms)
5. [Pattern Matching](#pattern-matching)
6. [String Problems & Solutions](#string-problems--solutions)
7. [Practice Problems](#practice-problems)

---

## Introduction to Strings

### What is a String?
A string is a sequence of characters. In C++, strings can be represented in two main ways:
1. **C-style strings**: Arrays of characters ending with null terminator '\0'
2. **C++ string class**: Dynamic string objects with built-in methods

```
String: "Hello"
Memory: ['H', 'e', 'l', 'l', 'o', '\0']
Index:   0    1    2    3    4    5
```

### Why Strings are Important
1. **Text Processing**: Essential for handling user input, file processing
2. **Data Parsing**: Converting and validating data formats
3. **Communication**: Network protocols, APIs often use string data
4. **User Interface**: Displaying information to users

### Basic String Example
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // C++ string
    string greeting = "Hello, World!";
    
    // C-style string
    char cString[] = "Hello, C-style!";
    
    // String properties
    cout << "C++ string: " << greeting << endl;
    cout << "Length: " << greeting.length() << endl;
    cout << "Size: " << greeting.size() << endl;
    cout << "Empty: " << greeting.empty() << endl;
    
    cout << "\nC-style string: " << cString << endl;
    cout << "Length: " << strlen(cString) << endl;
    
    return 0;
}
```

---

## String Basics in C++

### String Declaration and Initialization
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Different ways to create strings
    string str1;                          // Empty string
    string str2 = "Hello";                // Direct initialization
    string str3("World");                 // Constructor initialization
    string str4(5, 'A');                 // 5 'A's: "AAAAA"
    string str5 = str2;                   // Copy constructor
    string str6(str2, 1, 3);             // Substring: "ell"
    
    // Character array to string
    char charArray[] = "C-style";
    string str7(charArray);
    
    // Printing all strings
    cout << "str1: '" << str1 << "'" << endl;
    cout << "str2: " << str2 << endl;
    cout << "str3: " << str3 << endl;
    cout << "str4: " << str4 << endl;
    cout << "str5: " << str5 << endl;
    cout << "str6: " << str6 << endl;
    cout << "str7: " << str7 << endl;
    
    return 0;
}
```

### String Input and Output
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name, fullName, sentence;
    
    // Basic input (stops at whitespace)
    cout << "Enter your first name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    
    // Clear input buffer
    cin.ignore();
    
    // Input with spaces using getline
    cout << "Enter your full name: ";
    getline(cin, fullName);
    cout << "Nice to meet you, " << fullName << "!" << endl;
    
    // Input entire line
    cout << "Enter a sentence: ";
    getline(cin, sentence);
    cout << "You said: " << sentence << endl;
    
    return 0;
}
```

### String Properties and Access
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text = "Programming";
    
    // String properties
    cout << "String: " << text << endl;
    cout << "Length: " << text.length() << endl;
    cout << "Size: " << text.size() << endl;
    cout << "Capacity: " << text.capacity() << endl;
    cout << "Max size: " << text.max_size() << endl;
    cout << "Empty: " << (text.empty() ? "Yes" : "No") << endl;
    
    // Character access
    cout << "\nCharacter access:" << endl;
    cout << "First character: " << text[0] << endl;
    cout << "Last character: " << text[text.length() - 1] << endl;
    cout << "Character at index 3: " << text.at(3) << endl;
    cout << "Front: " << text.front() << endl;
    cout << "Back: " << text.back() << endl;
    
    // Iterating through characters
    cout << "\nAll characters: ";
    for (int i = 0; i < text.length(); i++) {
        cout << text[i] << " ";
    }
    cout << endl;
    
    // Range-based for loop
    cout << "Using range-based loop: ";
    for (char c : text) {
        cout << c << " ";
    }
    cout << endl;
    
    return 0;
}
```

---

## String Operations

### Basic String Operations
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str1 = "Hello";
    string str2 = "World";
    string str3;
    
    // Concatenation
    str3 = str1 + " " + str2;
    cout << "Concatenation: " << str3 << endl;
    
    // Append
    string greeting = "Hello";
    greeting += " ";
    greeting += str2;
    greeting.append("!");
    cout << "After append: " << greeting << endl;
    
    // Assignment
    string copy = str1;
    cout << "Copy: " << copy << endl;
    
    // Comparison
    cout << "\nString comparisons:" << endl;
    cout << "str1 == str2: " << (str1 == str2) << endl;
    cout << "str1 != str2: " << (str1 != str2) << endl;
    cout << "str1 < str2: " << (str1 < str2) << endl;
    cout << "str1.compare(str2): " << str1.compare(str2) << endl;
    
    return 0;
}
```

### String Modification
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text = "Hello World";
    cout << "Original: " << text << endl;
    
    // Insert
    text.insert(5, ",");
    cout << "After insert: " << text << endl;
    
    // Replace
    text.replace(0, 5, "Hi");
    cout << "After replace: " << text << endl;
    
    // Erase
    text.erase(2, 1);  // Remove 1 character at index 2
    cout << "After erase: " << text << endl;
    
    // Push and pop
    text.push_back('!');
    cout << "After push_back: " << text << endl;
    
    text.pop_back();
    cout << "After pop_back: " << text << endl;
    
    // Clear
    string temp = text;
    temp.clear();
    cout << "After clear: '" << temp << "' (empty: " << temp.empty() << ")" << endl;
    
    return 0;
}
```

### Substring Operations
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text = "Programming is fun!";
    cout << "Original string: " << text << endl;
    
    // Substring extraction
    string sub1 = text.substr(0, 11);    // "Programming"
    string sub2 = text.substr(12, 2);    // "is"
    string sub3 = text.substr(15);       // "fun!"
    
    cout << "Substring 1: " << sub1 << endl;
    cout << "Substring 2: " << sub2 << endl;
    cout << "Substring 3: " << sub3 << endl;
    
    // Finding substrings
    size_t pos1 = text.find("is");
    size_t pos2 = text.find("Python");
    
    cout << "\nFind operations:" << endl;
    if (pos1 != string::npos) {
        cout << "'is' found at position: " << pos1 << endl;
    }
    
    if (pos2 == string::npos) {
        cout << "'Python' not found" << endl;
    }
    
    // Find last occurrence
    string repeated = "hello world hello";
    size_t lastPos = repeated.rfind("hello");
    cout << "Last 'hello' at position: " << lastPos << endl;
    
    // Find first of any character
    size_t vowelPos = text.find_first_of("aeiou");
    cout << "First vowel at position: " << vowelPos << " ('" << text[vowelPos] << "')" << endl;
    
    return 0;
}
```

---

## String Algorithms

### String Reversal
```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class StringReversal {
public:
    // Method 1: Using two pointers
    static string reverseTwoPointers(string str) {
        int left = 0, right = str.length() - 1;
        
        while (left < right) {
            swap(str[left], str[right]);
            left++;
            right--;
        }
        
        return str;
    }
    
    // Method 2: Using STL reverse
    static string reverseSTL(string str) {
        reverse(str.begin(), str.end());
        return str;
    }
    
    // Method 3: Using recursion
    static string reverseRecursive(string str) {
        if (str.length() <= 1) {
            return str;
        }
        return str.back() + reverseRecursive(str.substr(0, str.length() - 1));
    }
    
    // Reverse words in a string
    static string reverseWords(string str) {
        string result = "";
        string word = "";
        
        for (char c : str) {
            if (c == ' ') {
                if (!word.empty()) {
                    if (!result.empty()) result = " " + result;
                    result = word + result;
                    word = "";
                }
            } else {
                word += c;
            }
        }
        
        if (!word.empty()) {
            if (!result.empty()) result = " " + result;
            result = word + result;
        }
        
        return result;
    }
};

int main() {
    string original = "Hello World";
    
    cout << "Original: " << original << endl;
    cout << "Reverse (two pointers): " << StringReversal::reverseTwoPointers(original) << endl;
    cout << "Reverse (STL): " << StringReversal::reverseSTL(original) << endl;
    cout << "Reverse (recursive): " << StringReversal::reverseRecursive(original) << endl;
    
    string sentence = "The quick brown fox";
    cout << "\nOriginal sentence: " << sentence << endl;
    cout << "Reverse words: " << StringReversal::reverseWords(sentence) << endl;
    
    return 0;
}
```

### Palindrome Checking
```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class PalindromeChecker {
public:
    // Simple palindrome check
    static bool isPalindrome(string str) {
        int left = 0, right = str.length() - 1;
        
        while (left < right) {
            if (str[left] != str[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
    
    // Palindrome check ignoring case and non-alphanumeric
    static bool isPalindromeAdvanced(string str) {
        string cleaned = "";
        
        // Clean the string
        for (char c : str) {
            if (isalnum(c)) {
                cleaned += tolower(c);
            }
        }
        
        return isPalindrome(cleaned);
    }
    
    // Check if string can be rearranged to form palindrome
    static bool canFormPalindrome(string str) {
        int charCount[256] = {0};
        
        // Count character frequencies
        for (char c : str) {
            charCount[c]++;
        }
        
        // Count odd frequencies
        int oddCount = 0;
        for (int i = 0; i < 256; i++) {
            if (charCount[i] % 2 == 1) {
                oddCount++;
            }
        }
        
        // For palindrome, at most one character can have odd frequency
        return oddCount <= 1;
    }
    
    // Find longest palindromic substring
    static string longestPalindrome(string str) {
        if (str.empty()) return "";
        
        int start = 0, maxLen = 1;
        
        for (int i = 0; i < str.length(); i++) {
            // Check for odd length palindromes
            int len1 = expandAroundCenter(str, i, i);
            // Check for even length palindromes
            int len2 = expandAroundCenter(str, i, i + 1);
            
            int len = max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        
        return str.substr(start, maxLen);
    }
    
private:
    static int expandAroundCenter(string str, int left, int right) {
        while (left >= 0 && right < str.length() && str[left] == str[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }
};

int main() {
    vector<string> testStrings = {"racecar", "hello", "A man a plan a canal Panama", "race a car"};
    
    for (string str : testStrings) {
        cout << "String: \"" << str << "\"" << endl;
        cout << "  Simple palindrome: " << (PalindromeChecker::isPalindrome(str) ? "Yes" : "No") << endl;
        cout << "  Advanced palindrome: " << (PalindromeChecker::isPalindromeAdvanced(str) ? "Yes" : "No") << endl;
        cout << "  Can form palindrome: " << (PalindromeChecker::canFormPalindrome(str) ? "Yes" : "No") << endl;
        cout << "  Longest palindrome: \"" << PalindromeChecker::longestPalindrome(str) << "\"" << endl;
        cout << endl;
    }
    
    return 0;
}
```

### Anagram Detection
```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

class AnagramDetector {
public:
    // Method 1: Using sorting
    static bool areAnagramsSort(string str1, string str2) {
        if (str1.length() != str2.length()) {
            return false;
        }
        
        sort(str1.begin(), str1.end());
        sort(str2.begin(), str2.end());
        
        return str1 == str2;
    }
    
    // Method 2: Using character counting
    static bool areAnagramsCount(string str1, string str2) {
        if (str1.length() != str2.length()) {
            return false;
        }
        
        int charCount[256] = {0};
        
        // Count characters in first string
        for (char c : str1) {
            charCount[c]++;
        }
        
        // Subtract characters from second string
        for (char c : str2) {
            charCount[c]--;
        }
        
        // Check if all counts are zero
        for (int i = 0; i < 256; i++) {
            if (charCount[i] != 0) {
                return false;
            }
        }
        
        return true;
    }
    
    // Method 3: Using hash map
    static bool areAnagramsHashMap(string str1, string str2) {
        if (str1.length() != str2.length()) {
            return false;
        }
        
        unordered_map<char, int> charMap;
        
        // Count characters in first string
        for (char c : str1) {
            charMap[c]++;
        }
        
        // Subtract characters from second string
        for (char c : str2) {
            charMap[c]--;
            if (charMap[c] == 0) {
                charMap.erase(c);
            }
        }
        
        return charMap.empty();
    }
    
    // Group anagrams together
    static vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        
        for (string str : strs) {
            string key = str;
            sort(key.begin(), key.end());
            groups[key].push_back(str);
        }
        
        vector<vector<string>> result;
        for (auto& group : groups) {
            result.push_back(group.second);
        }
        
        return result;
    }
};

int main() {
    string str1 = "listen";
    string str2 = "silent";
    string str3 = "hello";
    
    cout << "Testing anagram detection:" << endl;
    cout << "\"" << str1 << "\" and \"" << str2 << "\":" << endl;
    cout << "  Sort method: " << (AnagramDetector::areAnagramsSort(str1, str2) ? "Anagrams" : "Not anagrams") << endl;
    cout << "  Count method: " << (AnagramDetector::areAnagramsCount(str1, str2) ? "Anagrams" : "Not anagrams") << endl;
    cout << "  HashMap method: " << (AnagramDetector::areAnagramsHashMap(str1, str2) ? "Anagrams" : "Not anagrams") << endl;
    
    cout << "\n\"" << str1 << "\" and \"" << str3 << "\":" << endl;
    cout << "  Sort method: " << (AnagramDetector::areAnagramsSort(str1, str3) ? "Anagrams" : "Not anagrams") << endl;
    
    // Group anagrams example
    vector<string> words = {"eat", "tea", "tan", "ate", "nat", "bat"};
    cout << "\nGrouping anagrams:" << endl;
    cout << "Input: ";
    for (string word : words) cout << "\"" << word << "\" ";
    cout << endl;
    
    vector<vector<string>> groups = AnagramDetector::groupAnagrams(words);
    cout << "Groups:" << endl;
    for (auto& group : groups) {
        cout << "  [";
        for (int i = 0; i < group.size(); i++) {
            cout << "\"" << group[i] << "\"";
            if (i < group.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
    
    return 0;
}
```

---

## Pattern Matching

### Naive Pattern Matching
```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class PatternMatching {
public:
    // Naive pattern matching - O(nm) where n = text length, m = pattern length
    static vector<int> naiveSearch(string text, string pattern) {
        vector<int> matches;
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
                matches.push_back(i);
            }
        }
        
        return matches;
    }
    
    // KMP (Knuth-Morris-Pratt) Algorithm - O(n + m)
    static vector<int> KMPSearch(string text, string pattern) {
        vector<int> matches;
        vector<int> lps = computeLPS(pattern);
        
        int i = 0; // index for text
        int j = 0; // index for pattern
        
        while (i < text.length()) {
            if (pattern[j] == text[i]) {
                i++;
                j++;
            }
            
            if (j == pattern.length()) {
                matches.push_back(i - j);
                j = lps[j - 1];
            } else if (i < text.length() && pattern[j] != text[i]) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
    
private:
    // Compute Longest Prefix Suffix array for KMP
    static vector<int> computeLPS(string pattern) {
        int m = pattern.length();
        vector<int> lps(m, 0);
        int len = 0;
        int i = 1;
        
        while (i < m) {
            if (pattern[i] == pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        return lps;
    }
};

void printMatches(const vector<int>& matches, const string& algorithm) {
    cout << algorithm << " matches at positions: ";
    if (matches.empty()) {
        cout << "None";
    } else {
        for (int i = 0; i < matches.size(); i++) {
            cout << matches[i];
            if (i < matches.size() - 1) cout << ", ";
        }
    }
    cout << endl;
}

int main() {
    string text = "ABABDABACDABABCABCABCABCABC";
    string pattern = "ABABCAB";
    
    cout << "Text: " << text << endl;
    cout << "Pattern: " << pattern << endl << endl;
    
    // Naive search
    vector<int> naiveMatches = PatternMatching::naiveSearch(text, pattern);
    printMatches(naiveMatches, "Naive");
    
    // KMP search
    vector<int> kmpMatches = PatternMatching::KMPSearch(text, pattern);
    printMatches(kmpMatches, "KMP");
    
    return 0;
}
```

### String Matching with Wildcards
```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class WildcardMatching {
public:
    // Wildcard pattern matching using dynamic programming
    // '*' matches any sequence of characters (including empty)
    // '?' matches any single character
    static bool isMatch(string text, string pattern) {
        int m = text.length();
        int n = pattern.length();
        
        // Create DP table
        vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
        
        // Empty pattern matches empty string
        dp[0][0] = true;
        
        // Handle patterns like a* or *a* etc.
        for (int j = 1; j <= n; j++) {
            if (pattern[j - 1] == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (pattern[j - 1] == '*') {
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                } else if (pattern[j - 1] == '?' || text[i - 1] == pattern[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        
        return dp[m][n];
    }
    
    // Regular expression matching (simplified)
    // '.' matches any single character
    // '*' matches zero or more of the preceding character
    static bool isMatchRegex(string text, string pattern) {
        return isMatchRegexHelper(text, pattern, 0, 0);
    }
    
private:
    static bool isMatchRegexHelper(string text, string pattern, int i, int j) {
        // Base case: reached end of pattern
        if (j == pattern.length()) {
            return i == text.length();
        }
        
        // Check if current characters match
        bool firstMatch = (i < text.length() && 
                          (pattern[j] == text[i] || pattern[j] == '.'));
        
        // Handle '*' case
        if (j + 1 < pattern.length() && pattern[j + 1] == '*') {
            return (isMatchRegexHelper(text, pattern, i, j + 2) || // Zero occurrences
                   (firstMatch && isMatchRegexHelper(text, pattern, i + 1, j))); // One or more
        } else {
            return firstMatch && isMatchRegexHelper(text, pattern, i + 1, j + 1);
        }
    }
};

int main() {
    // Wildcard matching tests
    vector<pair<string, string>> wildcardTests = {
        {"adceb", "*a*b*"},
        {"acdcb", "a*c?b"},
        {"abcdef", "a*f"},
        {"abc", "a*c"}
    };
    
    cout << "Wildcard Pattern Matching:" << endl;
    for (auto& test : wildcardTests) {
        bool result = WildcardMatching::isMatch(test.first, test.second);
        cout << "Text: \"" << test.first << "\", Pattern: \"" << test.second 
             << "\" -> " << (result ? "Match" : "No Match") << endl;
    }
    
    // Regular expression tests
    vector<pair<string, string>> regexTests = {
        {"aa", "a"},
        {"aa", "a*"},
        {"ab", ".*"},
        {"aab", "c*a*b"},
        {"mississippi", "mis*is*p*."}
    };
    
    cout << "\nRegular Expression Matching:" << endl;
    for (auto& test : regexTests) {
        bool result = WildcardMatching::isMatchRegex(test.first, test.second);
        cout << "Text: \"" << test.first << "\", Pattern: \"" << test.second 
             << "\" -> " << (result ? "Match" : "No Match") << endl;
    }
    
    return 0;
}
```

---

## String Problems & Solutions

### Problem 1: Valid Parentheses
```cpp
#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class ValidParentheses {
public:
    static bool isValid(string s) {
        stack<char> stk;
        unordered_map<char, char> mapping = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };
        
        for (char c : s) {
            if (mapping.find(c) != mapping.end()) {
                // Closing bracket
                if (stk.empty() || stk.top() != mapping[c]) {
                    return false;
                }
                stk.pop();
            } else {
                // Opening bracket
                stk.push(c);
            }
        }
        
        return stk.empty();
    }
    
    // Generate all valid parentheses combinations
    static vector<string> generateParentheses(int n) {
        vector<string> result;
        generateHelper(result, "", 0, 0, n);
        return result;
    }
    
private:
    static void generateHelper(vector<string>& result, string current, 
                              int open, int close, int max) {
        if (current.length() == max * 2) {
            result.push_back(current);
            return;
        }
        
        if (open < max) {
            generateHelper(result, current + "(", open + 1, close, max);
        }
        if (close < open) {
            generateHelper(result, current + ")", open, close + 1, max);
        }
    }
};

int main() {
    vector<string> testCases = {"()", "()[]{}", "(]", "([)]", "{[]}"};
    
    cout << "Valid Parentheses Test:" << endl;
    for (string test : testCases) {
        bool valid = ValidParentheses::isValid(test);
        cout << "\"" << test << "\" -> " << (valid ? "Valid" : "Invalid") << endl;
    }
    
    cout << "\nGenerate Valid Parentheses (n=3):" << endl;
    vector<string> generated = ValidParentheses::generateParentheses(3);
    for (string combo : generated) {
        cout << "\"" << combo << "\" ";
    }
    cout << endl;
    
    return 0;
}
```

### Problem 2: Longest Common Subsequence
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class LongestCommonSubsequence {
public:
    // Find length of LCS using dynamic programming
    static int longestCommonSubsequence(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // Get the actual LCS string
    static string getLCS(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Reconstruct LCS
        string lcs = "";
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1[i - 1] == text2[j - 1]) {
                lcs = text1[i - 1] + lcs;
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
};

int main() {
    string text1 = "abcde";
    string text2 = "ace";
    
    cout << "Text 1: " << text1 << endl;
    cout << "Text 2: " << text2 << endl;
    
    int lcsLength = LongestCommonSubsequence::longestCommonSubsequence(text1, text2);
    string lcsString = LongestCommonSubsequence::getLCS(text1, text2);
    
    cout << "LCS Length: " << lcsLength << endl;
    cout << "LCS String: \"" << lcsString << "\"" << endl;
    
    return 0;
}
```

### Problem 3: String Compression
```cpp
#include <iostream>
#include <string>
using namespace std;

class StringCompression {
public:
    // Basic string compression (e.g., "aabcccccaaa" -> "a2b1c5a3")
    static string compress(string str) {
        if (str.empty()) return str;
        
        string compressed = "";
        int count = 1;
        
        for (int i = 1; i < str.length(); i++) {
            if (str[i] == str[i - 1]) {
                count++;
            } else {
                compressed += str[i - 1] + to_string(count);
                count = 1;
            }
        }
        
        // Add the last group
        compressed += str.back() + to_string(count);
        
        // Return original if compression doesn't save space
        return compressed.length() < str.length() ? compressed : str;
    }
    
    // Run-length encoding
    static string runLengthEncode(string str) {
        if (str.empty()) return str;
        
        string encoded = "";
        int count = 1;
        
        for (int i = 1; i < str.length(); i++) {
            if (str[i] == str[i - 1]) {
                count++;
            } else {
                encoded += to_string(count) + str[i - 1];
                count = 1;
            }
        }
        
        encoded += to_string(count) + str.back();
        return encoded;
    }
    
    // Decompress run-length encoded string
    static string runLengthDecode(string encoded) {
        string decoded = "";
        
        for (int i = 0; i < encoded.length(); i += 2) {
            int count = encoded[i] - '0';
            char ch = encoded[i + 1];
            
            for (int j = 0; j < count; j++) {
                decoded += ch;
            }
        }
        
        return decoded;
    }
};

int main() {
    string original = "aabcccccaaa";
    
    cout << "Original: " << original << endl;
    
    string compressed = StringCompression::compress(original);
    cout << "Compressed: " << compressed << endl;
    
    string encoded = StringCompression::runLengthEncode(original);
    cout << "Run-length encoded: " << encoded << endl;
    
    string decoded = StringCompression::runLengthDecode(encoded);
    cout << "Decoded: " << decoded << endl;
    
    return 0;
}
```

---

## Practice Problems

### Problem 1: First Unique Character
```cpp
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

class FirstUniqueCharacter {
public:
    // Find first unique character using hash map
    static int firstUniqChar(string s) {
        unordered_map<char, int> charCount;
        
        // Count frequency of each character
        for (char c : s) {
            charCount[c]++;
        }
        
        // Find first character with frequency 1
        for (int i = 0; i < s.length(); i++) {
            if (charCount[s[i]] == 1) {
                return i;
            }
        }
        
        return -1; // No unique character found
    }
    
    // Alternative: Using array for counting (faster for ASCII)
    static int firstUniqCharArray(string s) {
        int charCount[26] = {0};
        
        // Count frequency
        for (char c : s) {
            charCount[c - 'a']++;
        }
        
        // Find first unique
        for (int i = 0; i < s.length(); i++) {
            if (charCount[s[i] - 'a'] == 1) {
                return i;
            }
        }
        
        return -1;
    }
};

int main() {
    vector<string> testStrings = {"leetcode", "loveleetcode", "aabb"};
    
    for (string str : testStrings) {
        int index = FirstUniqueCharacter::firstUniqChar(str);
        cout << "String: \"" << str << "\"" << endl;
        if (index != -1) {
            cout << "First unique character: '" << str[index] << "' at index " << index << endl;
        } else {
            cout << "No unique character found" << endl;
        }
        cout << endl;
    }
    
    return 0;
}
```

### Problem 2: String to Integer (atoi)
```cpp
#include <iostream>
#include <string>
#include <climits>
using namespace std;

class StringToInteger {
public:
    static int myAtoi(string s) {
        int i = 0;
        int sign = 1;
        long result = 0;
        
        // Skip leading whitespaces
        while (i < s.length() && s[i] == ' ') {
            i++;
        }
        
        // Handle sign
        if (i < s.length() && (s[i] == '+' || s[i] == '-')) {
            sign = (s[i] == '-') ? -1 : 1;
            i++;
        }
        
        // Convert digits
        while (i < s.length() && isdigit(s[i])) {
            result = result * 10 + (s[i] - '0');
            
            // Check for overflow
            if (result * sign > INT_MAX) {
                return INT_MAX;
            }
            if (result * sign < INT_MIN) {
                return INT_MIN;
            }
            
            i++;
        }
        
        return result * sign;
    }
    
    // Convert integer to string
    static string intToString(int num) {
        if (num == 0) return "0";
        
        string result = "";
        bool negative = num < 0;
        
        if (negative) {
            num = -num;
        }
        
        while (num > 0) {
            result = char('0' + num % 10) + result;
            num /= 10;
        }
        
        if (negative) {
            result = "-" + result;
        }
        
        return result;
    }
};

int main() {
    vector<string> testCases = {"42", "   -42", "4193 with words", "words and 987", "-91283472332"};
    
    cout << "String to Integer conversion:" << endl;
    for (string test : testCases) {
        int result = StringToInteger::myAtoi(test);
        cout << "\"" << test << "\" -> " << result << endl;
    }
    
    cout << "\nInteger to String conversion:" << endl;
    vector<int> numbers = {42, -42, 0, 123, -123};
    for (int num : numbers) {
        string result = StringToInteger::intToString(num);
        cout << num << " -> \"" << result << "\"" << endl;
    }
    
    return 0;
}
```

### Problem 3: Longest Substring Without Repeating Characters
```cpp
#include <iostream>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <algorithm>
using namespace std;

class LongestSubstring {
public:
    // Sliding window approach with set
    static int lengthOfLongestSubstring(string s) {
        unordered_set<char> charSet;
        int left = 0, maxLength = 0;
        
        for (int right = 0; right < s.length(); right++) {
            // If character is already in set, shrink window from left
            while (charSet.find(s[right]) != charSet.end()) {
                charSet.erase(s[left]);
                left++;
            }
            
            charSet.insert(s[right]);
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    // Optimized sliding window with hash map
    static int lengthOfLongestSubstringOptimized(string s) {
        unordered_map<char, int> charIndex;
        int left = 0, maxLength = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charIndex.find(s[right]) != charIndex.end() && charIndex[s[right]] >= left) {
                left = charIndex[s[right]] + 1;
            }
            
            charIndex[s[right]] = right;
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    // Get the actual longest substring
    static string getLongestSubstring(string s) {
        unordered_map<char, int> charIndex;
        int left = 0, maxLength = 0, start = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charIndex.find(s[right]) != charIndex.end() && charIndex[s[right]] >= left) {
                left = charIndex[s[right]] + 1;
            }
            
            charIndex[s[right]] = right;
            if (right - left + 1 > maxLength) {
                maxLength = right - left + 1;
                start = left;
            }
        }
        
        return s.substr(start, maxLength);
    }
};

int main() {
    vector<string> testStrings = {"abcabcbb", "bbbbb", "pwwkew", "dvdf", ""};
    
    for (string str : testStrings) {
        int length1 = LongestSubstring::lengthOfLongestSubstring(str);
        int length2 = LongestSubstring::lengthOfLongestSubstringOptimized(str);
        string substring = LongestSubstring::getLongestSubstring(str);
        
        cout << "String: \"" << str << "\"" << endl;
        cout << "Length (method 1): " << length1 << endl;
        cout << "Length (method 2): " << length2 << endl;
        cout << "Longest substring: \"" << substring << "\"" << endl;
        cout << endl;
    }
    
    return 0;
}
```

### Problem 4: Word Break
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

class WordBreak {
public:
    // Check if string can be segmented into dictionary words
    static bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.length() + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.find(s.substr(j, i - j)) != wordSet.end()) {
                    dp[i] = true;
                    break;
                }
            }
        }
        
        return dp[s.length()];
    }
    
    // Get all possible word break combinations
    static vector<string> wordBreakII(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        vector<string> result;
        string current = "";
        
        backtrack(s, 0, wordSet, current, result);
        return result;
    }
    
private:
    static void backtrack(string s, int start, unordered_set<string>& wordSet, 
                         string current, vector<string>& result) {
        if (start == s.length()) {
            result.push_back(current.substr(1)); // Remove leading space
            return;
        }
        
        for (int end = start + 1; end <= s.length(); end++) {
            string word = s.substr(start, end - start);
            if (wordSet.find(word) != wordSet.end()) {
                backtrack(s, end, wordSet, current + " " + word, result);
            }
        }
    }
};

int main() {
    string s1 = "leetcode";
    vector<string> wordDict1 = {"leet", "code"};
    
    string s2 = "applepenapple";
    vector<string> wordDict2 = {"apple", "pen"};
    
    string s3 = "catsanddog";
    vector<string> wordDict3 = {"cat", "cats", "and", "sand", "dog"};
    
    cout << "Word Break Test:" << endl;
    cout << "\"" << s1 << "\" can be segmented: " << (WordBreak::wordBreak(s1, wordDict1) ? "Yes" : "No") << endl;
    cout << "\"" << s2 << "\" can be segmented: " << (WordBreak::wordBreak(s2, wordDict2) ? "Yes" : "No") << endl;
    
    cout << "\nAll possible segmentations for \"" << s3 << "\":" << endl;
    vector<string> segmentations = WordBreak::wordBreakII(s3, wordDict3);
    for (string seg : segmentations) {
        cout << "\"" << seg << "\"" << endl;
    }
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### String Fundamentals
1. **Character Arrays**: Strings are sequences of characters
2. **Null Termination**: C-style strings end with '\0'
3. **Dynamic vs Static**: C++ strings are dynamic, C-style are static
4. **Indexing**: Zero-based indexing like arrays

### Time Complexities
- **Access**: O(1) for character at index
- **Search**: O(n) for substring search (naive), O(n+m) for KMP
- **Concatenation**: O(n+m) where n, m are string lengths
- **Comparison**: O(min(n,m)) for lexicographic comparison

### Common Patterns
1. **Two Pointers**: For palindromes, reversing
2. **Sliding Window**: For substring problems
3. **Hash Maps**: For character counting, anagrams
4. **Dynamic Programming**: For complex string matching

### Best Practices
1. **Use C++ strings** over C-style for safety and convenience
2. **Consider string immutability** - operations create new strings
3. **Use appropriate algorithms** - KMP for pattern matching, etc.
4. **Handle edge cases** - empty strings, single characters

### Performance Tips
1. **Reserve space** when building large strings
2. **Use string_view** for read-only operations (C++17)
3. **Avoid repeated concatenation** in loops
4. **Consider StringBuilder pattern** for multiple concatenations

---

## 🚀 What's Next?

Excellent work! You've mastered strings and their algorithms. Next, let's explore [Linked Lists](05_Linked_Lists.md) - a fundamental dynamic data structure that forms the basis for many other data structures!

---

## 📚 Additional Practice

### Recommended Problems
1. **Easy**: Reverse string, valid palindrome, implement strStr()
2. **Medium**: Group anagrams, longest palindromic substring
3. **Hard**: Regular expression matching, edit distance

### Tips for Success
1. **Master the basics** - string operations, indexing, iteration
2. **Practice pattern matching** - understand KMP, Rabin-Karp algorithms
3. **Use appropriate data structures** - hash maps for counting, sets for uniqueness
4. **Consider space-time tradeoffs** - in-place vs extra space solutions
5. **Handle Unicode** - be aware of multi-byte characters in real applications

**Remember: Strings are everywhere in programming - from user input to data processing. Master string algorithms and you'll solve many real-world problems efficiently!** 🎯
