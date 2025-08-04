# Backtracking - The Systematic Explorer

## 🌟 Real-World Story: The Maze Explorer

Imagine you're exploring a mysterious maze to find a hidden treasure! 🗺️

**The Challenge**: You need to find a path from the entrance to the treasure, but the maze has many dead ends and false paths.

**The Backtracking Approach**:
1. **Start at the entrance** and mark your current position
2. **Try each possible direction** (up, down, left, right)
3. **If you hit a wall or dead end**, backtrack to the previous position
4. **Try the next untried direction** from that position
5. **If you find the treasure**, you've found a solution!
6. **If all directions fail**, backtrack further and try other paths

**The Magic**: You systematically explore ALL possible paths, but you're smart about it - when you realize a path won't work, you backtrack and try something else!

This is exactly how **Backtracking** works! It helps us:
- **Explore all possible solutions** systematically
- **Prune invalid paths** early to save time
- **Find one or all solutions** to constraint satisfaction problems
- **Handle complex decision trees** efficiently

## 🎯 What You'll Learn
- Backtracking principles and systematic exploration
- Classic backtracking problems with step-by-step solutions
- Optimization techniques and pruning strategies
- Real-world applications in AI and constraint solving

---

## 📝 Table of Contents
1. [Backtracking Fundamentals](#backtracking-fundamentals)
2. [Classic Backtracking Problems](#classic-backtracking-problems)
3. [Optimization and Pruning](#optimization-and-pruning)
4. [Advanced Backtracking Techniques](#advanced-backtracking-techniques)
5. [Real-World Applications](#real-world-applications)
6. [Tips, Tricks & Common Pitfalls](#tips-tricks--common-pitfalls)

---

## Backtracking Fundamentals

### 🎯 The Backtracking Template

Backtracking follows a systematic approach to explore solution spaces:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class BacktrackingFundamentals {
public:
    void explainBacktrackingPrinciples() {
        cout << "🎯 Backtracking Core Principles" << endl;
        cout << "===============================" << endl;
        cout << endl;
        
        cout << "1. 🔍 SYSTEMATIC EXPLORATION:" << endl;
        cout << "   • Try all possible choices at each step" << endl;
        cout << "   • Build solution incrementally" << endl;
        cout << "   • Explore decision tree depth-first" << endl;
        cout << endl;
        
        cout << "2. 🔙 BACKTRACK ON FAILURE:" << endl;
        cout << "   • When current path leads to invalid state" << endl;
        cout << "   • Undo the last choice made" << endl;
        cout << "   • Try the next alternative" << endl;
        cout << endl;
        
        cout << "3. ✂️ PRUNING:" << endl;
        cout << "   • Eliminate branches that can't lead to solution" << endl;
        cout << "   • Check constraints early" << endl;
        cout << "   • Avoid unnecessary exploration" << endl;
        cout << endl;
        
        cout << "4. 🔄 BACKTRACKING TEMPLATE:" << endl;
        cout << "   bool backtrack(state) {" << endl;
        cout << "       if (isComplete(state)) {" << endl;
        cout << "           if (isValid(state)) return true;" << endl;
        cout << "           else return false;" << endl;
        cout << "       }" << endl;
        cout << "       " << endl;
        cout << "       for (each choice) {" << endl;
        cout << "           makeChoice(choice);" << endl;
        cout << "           if (backtrack(newState)) return true;" << endl;
        cout << "           undoChoice(choice); // Backtrack" << endl;
        cout << "       }" << endl;
        cout << "       return false;" << endl;
        cout << "   }" << endl;
    }
    
    // Simple example: Generate all binary strings of length n
    void generateBinaryStrings(int n, string current = "", int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 Exploring: \"" << current << "\" (depth " << depth << ")" << endl;
        
        // Base case: complete string
        if (current.length() == n) {
            cout << indent << "✅ Found solution: \"" << current << "\"" << endl;
            return;
        }
        
        // Try adding '0'
        cout << indent << "📝 Trying to add '0'" << endl;
        current += '0';
        generateBinaryStrings(n, current, depth + 1);
        current.pop_back(); // Backtrack
        cout << indent << "🔙 Backtracked from '0', current: \"" << current << "\"" << endl;
        
        // Try adding '1'
        cout << indent << "📝 Trying to add '1'" << endl;
        current += '1';
        generateBinaryStrings(n, current, depth + 1);
        current.pop_back(); // Backtrack
        cout << indent << "🔙 Backtracked from '1', current: \"" << current << "\"" << endl;
    }
    
    void demonstrateFundamentals() {
        explainBacktrackingPrinciples();
        
        cout << "\n🔢 Example: Generate All Binary Strings of Length 3" << endl;
        cout << "===================================================" << endl;
        generateBinaryStrings(3);
        
        cout << "\n📊 Analysis:" << endl;
        cout << "• Explores 2^n possible strings" << endl;
        cout << "• Each string requires n decisions" << endl;
        cout << "• Time Complexity: O(2^n)" << endl;
        cout << "• Space Complexity: O(n) - recursion depth" << endl;
    }
};

int main() {
    BacktrackingFundamentals demo;
    demo.demonstrateFundamentals();
    
    return 0;
}
```

### 🔍 Problem Recognition

```cpp
class BacktrackingRecognition {
public:
    void identifyBacktrackingProblems() {
        cout << "\n🔍 How to Recognize Backtracking Problems" << endl;
        cout << "=========================================" << endl;
        cout << endl;
        
        cout << "🎯 PROBLEM CHARACTERISTICS:" << endl;
        cout << "• Need to find ALL solutions or ONE valid solution" << endl;
        cout << "• Problem involves making a sequence of choices" << endl;
        cout << "• Constraints that must be satisfied" << endl;
        cout << "• Solution can be built incrementally" << endl;
        cout << "• Can detect invalid states early" << endl;
        cout << endl;
        
        cout << "🔍 COMMON PATTERNS:" << endl;
        cout << "1. Permutations and Combinations" << endl;
        cout << "2. Subset Generation" << endl;
        cout << "3. Puzzle Solving (Sudoku, N-Queens)" << endl;
        cout << "4. Path Finding with Constraints" << endl;
        cout << "5. Game Tree Search" << endl;
        cout << "6. Constraint Satisfaction Problems" << endl;
        cout << endl;
        
        cout << "✅ BACKTRACKING CHECKLIST:" << endl;
        cout << "□ Can problem be broken into choices?" << endl;
        cout << "□ Can you detect invalid states early?" << endl;
        cout << "□ Is solution built step by step?" << endl;
        cout << "□ Can you undo choices easily?" << endl;
        cout << "□ Need to explore multiple possibilities?" << endl;
    }
    
    void demonstrateRecognition() {
        cout << "\n📝 Example Problem Analysis" << endl;
        cout << "===========================" << endl;
        
        cout << "PROBLEM: 'N-Queens'" << endl;
        cout << "Place N queens on N×N chessboard such that" << endl;
        cout << "no two queens attack each other." << endl;
        cout << endl;
        
        cout << "🔍 ANALYSIS:" << endl;
        cout << "• Choices: Where to place each queen" << endl;
        cout << "• Constraints: No two queens in same row/column/diagonal" << endl;
        cout << "• Incremental: Place one queen at a time" << endl;
        cout << "• Early detection: Check conflicts after each placement" << endl;
        cout << "• Backtrack: Remove queen if no valid placement" << endl;
        cout << endl;
        
        cout << "✅ CONCLUSION: Perfect for backtracking!" << endl;
        cout << "Strategy: Try each column for current row, backtrack on conflict" << endl;
    }
};

int main() {
    BacktrackingRecognition demo;
    demo.identifyBacktrackingProblems();
    demo.demonstrateRecognition();
    
    return 0;
}
```

---

## Classic Backtracking Problems

### 👑 N-Queens Problem - The Royal Placement

```cpp
class NQueensProblem {
private:
    vector<vector<string>> solutions;
    int solutionCount = 0;
    
    bool isSafe(vector<string>& board, int row, int col, int n) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') {
                return false;
            }
        }
        
        // Check upper-left diagonal
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') {
                return false;
            }
        }
        
        // Check upper-right diagonal
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') {
                return false;
            }
        }
        
        return true;
    }
    
    void printBoard(const vector<string>& board, int solutionNum) {
        cout << "\n👑 Solution " << solutionNum << ":" << endl;
        for (int i = 0; i < board.size(); i++) {
            cout << "  ";
            for (int j = 0; j < board[i].length(); j++) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
    }
    
    void solveNQueens(vector<string>& board, int row, int n, int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 Trying to place queen in row " << row << endl;
        
        // Base case: all queens placed
        if (row == n) {
            solutionCount++;
            cout << indent << "✅ Found solution " << solutionCount << "!" << endl;
            solutions.push_back(board);
            printBoard(board, solutionCount);
            return;
        }
        
        // Try placing queen in each column of current row
        for (int col = 0; col < n; col++) {
            cout << indent << "📝 Trying column " << col << " in row " << row << endl;
            
            if (isSafe(board, row, col, n)) {
                cout << indent << "✅ Safe to place queen at (" << row << ", " << col << ")" << endl;
                
                // Make choice
                board[row][col] = 'Q';
                
                // Recurse to next row
                solveNQueens(board, row + 1, n, depth + 1);
                
                // Backtrack
                board[row][col] = '.';
                cout << indent << "🔙 Backtracked from (" << row << ", " << col << ")" << endl;
            } else {
                cout << indent << "❌ Not safe to place queen at (" << row << ", " << col << ")" << endl;
            }
        }
    }
    
public:
    void solveNQueens(int n) {
        cout << "👑 N-Queens Problem (N = " << n << ")" << endl;
        cout << "==============================" << endl;
        
        vector<string> board(n, string(n, '.'));
        solutions.clear();
        solutionCount = 0;
        
        cout << "Initial board:" << endl;
        printBoard(board, 0);
        
        cout << "\nStarting backtracking search..." << endl;
        solveNQueens(board, 0, n);
        
        cout << "\n📊 Results:" << endl;
        cout << "Total solutions found: " << solutionCount << endl;
        cout << "Time Complexity: O(N!) - trying all permutations with pruning" << endl;
        cout << "Space Complexity: O(N) - recursion depth" << endl;
    }
};

int main() {
    NQueensProblem demo;
    demo.solveNQueens(4);
    
    return 0;
}
```

### 🧩 Sudoku Solver - The Logic Puzzle Master

```cpp
class SudokuSolver {
private:
    bool isValid(vector<vector<int>>& board, int row, int col, int num) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) {
                return false;
            }
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) {
                return false;
            }
        }
        
        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = boxRow; i < boxRow + 3; i++) {
            for (int j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] == num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    void printBoard(const vector<vector<int>>& board) {
        cout << "  +-------+-------+-------+" << endl;
        for (int i = 0; i < 9; i++) {
            cout << "  | ";
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    cout << ". ";
                } else {
                    cout << board[i][j] << " ";
                }
                if ((j + 1) % 3 == 0) cout << "| ";
            }
            cout << endl;
            if ((i + 1) % 3 == 0) {
                cout << "  +-------+-------+-------+" << endl;
            }
        }
    }
    
    bool solveSudoku(vector<vector<int>>& board, int depth = 0) {
        string indent(depth * 2, ' ');
        
        // Find next empty cell
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    cout << indent << "🔍 Found empty cell at (" << i << ", " << j << ")" << endl;
                    
                    // Try numbers 1-9
                    for (int num = 1; num <= 9; num++) {
                        cout << indent << "📝 Trying number " << num << " at (" << i << ", " << j << ")" << endl;
                        
                        if (isValid(board, i, j, num)) {
                            cout << indent << "✅ " << num << " is valid at (" << i << ", " << j << ")" << endl;
                            
                            // Make choice
                            board[i][j] = num;
                            
                            // Recurse
                            if (solveSudoku(board, depth + 1)) {
                                return true;
                            }
                            
                            // Backtrack
                            board[i][j] = 0;
                            cout << indent << "🔙 Backtracked from (" << i << ", " << j << "), removed " << num << endl;
                        } else {
                            cout << indent << "❌ " << num << " is not valid at (" << i << ", " << j << ")" << endl;
                        }
                    }
                    
                    // No valid number found
                    cout << indent << "💀 No valid number for (" << i << ", " << j << "), backtracking..." << endl;
                    return false;
                }
            }
        }
        
        // All cells filled
        cout << indent << "🎉 Sudoku solved!" << endl;
        return true;
    }
    
public:
    void solveSudoku(vector<vector<int>>& board) {
        cout << "🧩 Sudoku Solver" << endl;
        cout << "================" << endl;
        
        cout << "\nInitial puzzle:" << endl;
        printBoard(board);
        
        cout << "\nStarting backtracking search..." << endl;
        
        if (solveSudoku(board)) {
            cout << "\n✅ Solution found!" << endl;
            printBoard(board);
        } else {
            cout << "\n❌ No solution exists!" << endl;
        }
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(9^(empty_cells)) - worst case" << endl;
        cout << "Space Complexity: O(empty_cells) - recursion depth" << endl;
        cout << "Pruning: Constraint checking eliminates invalid branches early" << endl;
    }
};

int main() {
    // Example Sudoku puzzle (0 represents empty cells)
    vector<vector<int>> board = {
        {5, 3, 0, 0, 7, 0, 0, 0, 0},
        {6, 0, 0, 1, 9, 5, 0, 0, 0},
        {0, 9, 8, 0, 0, 0, 0, 6, 0},
        {8, 0, 0, 0, 6, 0, 0, 0, 3},
        {4, 0, 0, 8, 0, 3, 0, 0, 1},
        {7, 0, 0, 0, 2, 0, 0, 0, 6},
        {0, 6, 0, 0, 0, 0, 2, 8, 0},
        {0, 0, 0, 4, 1, 9, 0, 0, 5},
        {0, 0, 0, 0, 8, 0, 0, 7, 9}
    };
    
    SudokuSolver solver;
    solver.solveSudoku(board);
    
    return 0;
}
```

### 🎯 Subset Generation - The Combination Explorer

```cpp
class SubsetGeneration {
public:
    // Generate all subsets of given array
    void generateSubsets(vector<int>& nums, vector<int>& current, int index, 
                        vector<vector<int>>& result, int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 At index " << index << ", current subset: [";
        for (int i = 0; i < current.size(); i++) {
            cout << current[i];
            if (i < current.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
        
        // Base case: processed all elements
        if (index == nums.size()) {
            result.push_back(current);
            cout << indent << "✅ Added subset to result" << endl;
            return;
        }
        
        // Choice 1: Don't include current element
        cout << indent << "📝 Choice 1: Don't include " << nums[index] << endl;
        generateSubsets(nums, current, index + 1, result, depth + 1);
        
        // Choice 2: Include current element
        cout << indent << "📝 Choice 2: Include " << nums[index] << endl;
        current.push_back(nums[index]);
        generateSubsets(nums, current, index + 1, result, depth + 1);
        
        // Backtrack
        current.pop_back();
        cout << indent << "🔙 Backtracked, removed " << nums[index] << endl;
    }
    
    // Generate all permutations
    void generatePermutations(vector<int>& nums, vector<int>& current, 
                             vector<bool>& used, vector<vector<int>>& result, int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 Current permutation: [";
        for (int i = 0; i < current.size(); i++) {
            cout << current[i];
            if (i < current.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
        
        // Base case: permutation complete
        if (current.size() == nums.size()) {
            result.push_back(current);
            cout << indent << "✅ Added permutation to result" << endl;
            return;
        }
        
        // Try each unused element
        for (int i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                cout << indent << "📝 Trying to add " << nums[i] << " at position " << current.size() << endl;
                
                // Make choice
                current.push_back(nums[i]);
                used[i] = true;
                
                // Recurse
                generatePermutations(nums, current, used, result, depth + 1);
                
                // Backtrack
                current.pop_back();
                used[i] = false;
                cout << indent << "🔙 Backtracked, removed " << nums[i] << endl;
            }
        }
    }
    
    void demonstrateSubsetGeneration() {
        cout << "🎯 Subset and Permutation Generation" << endl;
        cout << "====================================" << endl;
        
        vector<int> nums = {1, 2, 3};
        
        // Generate all subsets
        cout << "\n1. GENERATING ALL SUBSETS:" << endl;
        cout << "Array: [1, 2, 3]" << endl;
        
        vector<vector<int>> subsets;
        vector<int> currentSubset;
        generateSubsets(nums, currentSubset, 0, subsets);
        
        cout << "\n📋 All subsets:" << endl;
        for (int i = 0; i < subsets.size(); i++) {
            cout << "  [";
            for (int j = 0; j < subsets[i].size(); j++) {
                cout << subsets[i][j];
                if (j < subsets[i].size() - 1) cout << ", ";
            }
            cout << "]" << endl;
        }
        
        // Generate all permutations
        cout << "\n2. GENERATING ALL PERMUTATIONS:" << endl;
        cout << "Array: [1, 2, 3]" << endl;
        
        vector<vector<int>> permutations;
        vector<int> currentPerm;
        vector<bool> used(nums.size(), false);
        generatePermutations(nums, currentPerm, used, permutations);
        
        cout << "\n📋 All permutations:" << endl;
        for (int i = 0; i < permutations.size(); i++) {
            cout << "  [";
            for (int j = 0; j < permutations[i].size(); j++) {
                cout << permutations[i][j];
                if (j < permutations[i].size() - 1) cout << ", ";
            }
            cout << "]" << endl;
        }
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Subsets: 2^n total subsets, O(2^n) time" << endl;
        cout << "Permutations: n! total permutations, O(n!) time" << endl;
        cout << "Both use O(n) space for recursion depth" << endl;
    }
};

int main() {
    SubsetGeneration demo;
    demo.demonstrateSubsetGeneration();
    
    return 0;
}
```

### 🗺️ Maze Solving - The Path Finder

```cpp
class MazeSolver {
private:
    vector<vector<int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    vector<string> dirNames = {"UP", "DOWN", "LEFT", "RIGHT"};
    
    bool isValid(vector<vector<char>>& maze, int x, int y, vector<vector<bool>>& visited) {
        int rows = maze.size();
        int cols = maze[0].size();
        
        return x >= 0 && x < rows && y >= 0 && y < cols && 
               maze[x][y] != '#' && !visited[x][y];
    }
    
    void printMaze(const vector<vector<char>>& maze, const vector<pair<int,int>>& path) {
        vector<vector<char>> display = maze;
        
        // Mark path
        for (int i = 1; i < path.size() - 1; i++) {
            display[path[i].first][path[i].second] = '*';
        }
        
        // Mark start and end
        if (!path.empty()) {
            display[path[0].first][path[0].second] = 'S';
            display[path.back().first][path.back().second] = 'E';
        }
        
        cout << "  ";
        for (int j = 0; j < display[0].size(); j++) {
            cout << j << " ";
        }
        cout << endl;
        
        for (int i = 0; i < display.size(); i++) {
            cout << i << " ";
            for (int j = 0; j < display[i].size(); j++) {
                cout << display[i][j] << " ";
            }
            cout << endl;
        }
    }
    
    bool solveMaze(vector<vector<char>>& maze, int x, int y, int targetX, int targetY,
                   vector<vector<bool>>& visited, vector<pair<int,int>>& path, int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 Exploring position (" << x << ", " << y << ")" << endl;
        
        // Check if reached target
        if (x == targetX && y == targetY) {
            path.push_back({x, y});
            cout << indent << "🎯 Found target at (" << x << ", " << y << ")!" << endl;
            return true;
        }
        
        // Mark current cell as visited
        visited[x][y] = true;
        path.push_back({x, y});
        cout << indent << "📍 Added (" << x << ", " << y << ") to path" << endl;
        
        // Try all four directions
        for (int i = 0; i < 4; i++) {
            int newX = x + directions[i][0];
            int newY = y + directions[i][1];
            
            cout << indent << "📝 Trying " << dirNames[i] << " to (" << newX << ", " << newY << ")" << endl;
            
            if (isValid(maze, newX, newY, visited)) {
                cout << indent << "✅ Valid move " << dirNames[i] << endl;
                
                if (solveMaze(maze, newX, newY, targetX, targetY, visited, path, depth + 1)) {
                    return true;
                }
            } else {
                cout << indent << "❌ Invalid move " << dirNames[i] << " (wall/visited/out of bounds)" << endl;
            }
        }
        
        // Backtrack
        visited[x][y] = false;
        path.pop_back();
        cout << indent << "🔙 Backtracked from (" << x << ", " << y << ")" << endl;
        
        return false;
    }
    
public:
    void solveMaze(vector<vector<char>>& maze, int startX, int startY, int targetX, int targetY) {
        cout << "🗺️ Maze Solving with Backtracking" << endl;
        cout << "==================================" << endl;
        
        cout << "\nMaze layout (# = wall, . = open, S = start, E = end):" << endl;
        vector<pair<int,int>> emptyPath;
        printMaze(maze, emptyPath);
        
        cout << "\nStart: (" << startX << ", " << startY << ")" << endl;
        cout << "Target: (" << targetX << ", " << targetY << ")" << endl;
        
        vector<vector<bool>> visited(maze.size(), vector<bool>(maze[0].size(), false));
        vector<pair<int,int>> path;
        
        cout << "\nStarting backtracking search..." << endl;
        
        if (solveMaze(maze, startX, startY, targetX, targetY, visited, path)) {
            cout << "\n✅ Path found!" << endl;
            cout << "Solution path (* = path, S = start, E = end):" << endl;
            printMaze(maze, path);
            
            cout << "\nPath coordinates:" << endl;
            for (int i = 0; i < path.size(); i++) {
                cout << "  Step " << i << ": (" << path[i].first << ", " << path[i].second << ")" << endl;
            }
            cout << "Total steps: " << path.size() - 1 << endl;
        } else {
            cout << "\n❌ No path found!" << endl;
        }
        
        cout << "\n📊 Analysis:" << endl;
        cout << "Time Complexity: O(4^(m×n)) - worst case explores all paths" << endl;
        cout << "Space Complexity: O(m×n) - visited array and recursion depth" << endl;
        cout << "Pruning: Visited cells and boundary checks eliminate branches" << endl;
    }
};

int main() {
    // Create a sample maze
    vector<vector<char>> maze = {
        {'.', '.', '#', '.', '.'},
        {'#', '.', '#', '.', '#'},
        {'.', '.', '.', '.', '.'},
        {'.', '#', '#', '#', '.'},
        {'.', '.', '.', '.', '.'}
    };
    
    MazeSolver solver;
    solver.solveMaze(maze, 0, 0, 4, 4);
    
    return 0;
}
```

---

## Optimization and Pruning

### ✂️ Pruning Techniques

```cpp
class BacktrackingOptimization {
public:
    void explainPruningTechniques() {
        cout << "✂️ Pruning Techniques for Backtracking" << endl;
        cout << "======================================" << endl;
        cout << endl;
        
        cout << "1. 🚫 CONSTRAINT CHECKING:" << endl;
        cout << "   • Check constraints as early as possible" << endl;
        cout << "   • Eliminate invalid branches immediately" << endl;
        cout << "   • Example: N-Queens diagonal checking" << endl;
        cout << endl;
        
        cout << "2. 🎯 BOUND CHECKING:" << endl;
        cout << "   • Use bounds to eliminate suboptimal branches" << endl;
        cout << "   • Maintain best solution found so far" << endl;
        cout << "   • Prune if current path can't improve" << endl;
        cout << endl;
        
        cout << "3. 🔄 ORDERING HEURISTICS:" << endl;
        cout << "   • Try most promising choices first" << endl;
        cout << "   • Use domain knowledge for ordering" << endl;
        cout << "   • Example: Most constrained variable first" << endl;
        cout << endl;
        
        cout << "4. 🧠 MEMOIZATION:" << endl;
        cout << "   • Cache results of subproblems" << endl;
        cout << "   • Avoid recomputing same states" << endl;
        cout << "   • Trade space for time" << endl;
    }
    
    // Example: Optimized N-Queens with better pruning
    class OptimizedNQueens {
    private:
        vector<bool> cols, diag1, diag2;
        int solutionCount = 0;
        
    public:
        void solveNQueens(int n, int row = 0) {
            if (row == 0) {
                cols.assign(n, false);
                diag1.assign(2 * n - 1, false);
                diag2.assign(2 * n - 1, false);
                solutionCount = 0;
                cout << "🚀 Optimized N-Queens with O(1) conflict checking" << endl;
            }
            
            if (row == n) {
                solutionCount++;
                cout << "✅ Solution " << solutionCount << " found!" << endl;
                return;
            }
            
            for (int col = 0; col < n; col++) {
                // O(1) conflict checking using arrays
                if (!cols[col] && !diag1[row - col + n - 1] && !diag2[row + col]) {
                    // Place queen
                    cols[col] = diag1[row - col + n - 1] = diag2[row + col] = true;
                    
                    solveNQueens(n, row + 1);
                    
                    // Remove queen (backtrack)
                    cols[col] = diag1[row - col + n - 1] = diag2[row + col] = false;
                }
            }
        }
    };
    
    void demonstrateOptimization() {
        explainPruningTechniques();
        
        cout << "\n🚀 Optimized N-Queens Example:" << endl;
        OptimizedNQueens solver;
        solver.solveNQueens(8);
        
        cout << "\n📊 Optimization Benefits:" << endl;
        cout << "• O(1) conflict checking vs O(n) naive approach" << endl;
        cout << "• Early pruning eliminates invalid branches" << endl;
        cout << "• Significant speedup for larger board sizes" << endl;
    }
};

int main() {
    BacktrackingOptimization demo;
    demo.demonstrateOptimization();
    
    return 0;
}
```

---

## Advanced Backtracking Techniques

### 🎮 Game Tree Search - Minimax Algorithm

```cpp
class MinimaxGameTree {
private:
    struct GameState {
        vector<vector<char>> board;
        bool isMaximizing;
        
        GameState(vector<vector<char>>& b, bool max) : board(b), isMaximizing(max) {}
    };
    
    bool isWinner(vector<vector<char>>& board, char player) {
        // Check rows, columns, and diagonals
        for (int i = 0; i < 3; i++) {
            if ((board[i][0] == player && board[i][1] == player && board[i][2] == player) ||
                (board[0][i] == player && board[1][i] == player && board[2][i] == player)) {
                return true;
            }
        }
        
        return (board[0][0] == player && board[1][1] == player && board[2][2] == player) ||
               (board[0][2] == player && board[1][1] == player && board[2][0] == player);
    }
    
    bool isBoardFull(vector<vector<char>>& board) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') return false;
            }
        }
        return true;
    }
    
    int evaluate(vector<vector<char>>& board) {
        if (isWinner(board, 'X')) return 10;
        if (isWinner(board, 'O')) return -10;
        return 0;
    }
    
    void printBoard(vector<vector<char>>& board) {
        cout << "  +---+---+---+" << endl;
        for (int i = 0; i < 3; i++) {
            cout << "  | ";
            for (int j = 0; j < 3; j++) {
                cout << board[i][j] << " | ";
            }
            cout << endl << "  +---+---+---+" << endl;
        }
    }
    
    int minimax(vector<vector<char>>& board, int depth, bool isMaximizing, int alpha, int beta) {
        cout << string(depth * 2, ' ') << "🎮 Minimax depth " << depth 
             << " (" << (isMaximizing ? "MAX" : "MIN") << ")" << endl;
        
        int score = evaluate(board);
        
        // Terminal states
        if (score == 10) return score - depth;  // Prefer quicker wins
        if (score == -10) return score + depth; // Prefer delayed losses
        if (isBoardFull(board)) return 0;
        
        if (isMaximizing) {
            int maxEval = INT_MIN;
            
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == ' ') {
                        cout << string(depth * 2, ' ') << "📝 MAX trying move (" << i << ", " << j << ")" << endl;
                        
                        board[i][j] = 'X';
                        int eval = minimax(board, depth + 1, false, alpha, beta);
                        board[i][j] = ' ';
                        
                        maxEval = max(maxEval, eval);
                        alpha = max(alpha, eval);
                        
                        cout << string(depth * 2, ' ') << "📊 MAX eval: " << eval << ", best: " << maxEval << endl;
                        
                        if (beta <= alpha) {
                            cout << string(depth * 2, ' ') << "✂️ Alpha-beta pruning!" << endl;
                            break;
                        }
                    }
                }
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            int minEval = INT_MAX;
            
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == ' ') {
                        cout << string(depth * 2, ' ') << "📝 MIN trying move (" << i << ", " << j << ")" << endl;
                        
                        board[i][j] = 'O';
                        int eval = minimax(board, depth + 1, true, alpha, beta);
                        board[i][j] = ' ';
                        
                        minEval = min(minEval, eval);
                        beta = min(beta, eval);
                        
                        cout << string(depth * 2, ' ') << "📊 MIN eval: " << eval << ", best: " << minEval << endl;
                        
                        if (beta <= alpha) {
                            cout << string(depth * 2, ' ') << "✂️ Alpha-beta pruning!" << endl;
                            break;
                        }
                    }
                }
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }
    
public:
    pair<int, int> findBestMove(vector<vector<char>>& board) {
        cout << "🎮 Finding Best Move with Minimax + Alpha-Beta Pruning" << endl;
        cout << "=======================================================" << endl;
        
        cout << "\nCurrent board state:" << endl;
        printBoard(board);
        
        int bestVal = INT_MIN;
        pair<int, int> bestMove = {-1, -1};
        
        cout << "\nEvaluating all possible moves for X:" << endl;
        
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    cout << "\n🔍 Evaluating move (" << i << ", " << j << "):" << endl;
                    
                    board[i][j] = 'X';
                    int moveVal = minimax(board, 0, false, INT_MIN, INT_MAX);
                    board[i][j] = ' ';
                    
                    cout << "📊 Move (" << i << ", " << j << ") value: " << moveVal << endl;
                    
                    if (moveVal > bestVal) {
                        bestMove = {i, j};
                        bestVal = moveVal;
                        cout << "🎯 New best move: (" << i << ", " << j << ")" << endl;
                    }
                }
            }
        }
        
        cout << "\n✅ Best move: (" << bestMove.first << ", " << bestMove.second 
             << ") with value " << bestVal << endl;
        
        return bestMove;
    }
};

int main() {
    vector<vector<char>> board = {
        {'X', 'O', 'X'},
        {' ', 'X', ' '},
        {'O', ' ', 'O'}
    };
    
    MinimaxGameTree game;
    game.findBestMove(board);
    
    return 0;
}
```

### 🧩 Constraint Satisfaction Problems

```cpp
class ConstraintSatisfaction {
private:
    struct Variable {
        string name;
        vector<int> domain;
        int value;
        
        Variable(string n, vector<int> d) : name(n), domain(d), value(-1) {}
    };
    
    struct Constraint {
        int var1, var2;
        function<bool(int, int)> check;
        
        Constraint(int v1, int v2, function<bool(int, int)> c) : var1(v1), var2(v2), check(c) {}
    };
    
    vector<Variable> variables;
    vector<Constraint> constraints;
    
    bool isConsistent(int varIndex, int value) {
        for (const auto& constraint : constraints) {
            if (constraint.var1 == varIndex && variables[constraint.var2].value != -1) {
                if (!constraint.check(value, variables[constraint.var2].value)) {
                    return false;
                }
            }
            if (constraint.var2 == varIndex && variables[constraint.var1].value != -1) {
                if (!constraint.check(variables[constraint.var1].value, value)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    int selectUnassignedVariable() {
        // Most Constrained Variable (MCV) heuristic
        int minDomain = INT_MAX;
        int selectedVar = -1;
        
        for (int i = 0; i < variables.size(); i++) {
            if (variables[i].value == -1) {
                int validValues = 0;
                for (int val : variables[i].domain) {
                    if (isConsistent(i, val)) {
                        validValues++;
                    }
                }
                
                if (validValues < minDomain) {
                    minDomain = validValues;
                    selectedVar = i;
                }
            }
        }
        
        return selectedVar;
    }
    
    bool backtrackCSP(int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🔍 CSP Backtrack depth " << depth << endl;
        
        // Check if assignment is complete
        bool complete = true;
        for (const auto& var : variables) {
            if (var.value == -1) {
                complete = false;
                break;
            }
        }
        
        if (complete) {
            cout << indent << "✅ Complete assignment found!" << endl;
            return true;
        }
        
        // Select unassigned variable using heuristic
        int varIndex = selectUnassignedVariable();
        if (varIndex == -1) return false;
        
        cout << indent << "📝 Selected variable: " << variables[varIndex].name << endl;
        
        // Try each value in domain
        for (int value : variables[varIndex].domain) {
            cout << indent << "🎯 Trying value " << value << " for " << variables[varIndex].name << endl;
            
            if (isConsistent(varIndex, value)) {
                cout << indent << "✅ Value " << value << " is consistent" << endl;
                
                // Make assignment
                variables[varIndex].value = value;
                
                // Recurse
                if (backtrackCSP(depth + 1)) {
                    return true;
                }
                
                // Backtrack
                variables[varIndex].value = -1;
                cout << indent << "🔙 Backtracked from " << variables[varIndex].name << " = " << value << endl;
            } else {
                cout << indent << "❌ Value " << value << " violates constraints" << endl;
            }
        }
        
        return false;
    }
    
public:
    void addVariable(string name, vector<int> domain) {
        variables.push_back(Variable(name, domain));
    }
    
    void addConstraint(int var1, int var2, function<bool(int, int)> check) {
        constraints.push_back(Constraint(var1, var2, check));
    }
    
    void solveCSP() {
        cout << "🧩 Constraint Satisfaction Problem Solver" << endl;
        cout << "=========================================" << endl;
        
        cout << "\nVariables and domains:" << endl;
        for (int i = 0; i < variables.size(); i++) {
            cout << "  " << variables[i].name << ": {";
            for (int j = 0; j < variables[i].domain.size(); j++) {
                cout << variables[i].domain[j];
                if (j < variables[i].domain.size() - 1) cout << ", ";
            }
            cout << "}" << endl;
        }
        
        cout << "\nConstraints:" << endl;
        for (int i = 0; i < constraints.size(); i++) {
            cout << "  " << variables[constraints[i].var1].name 
                 << " and " << variables[constraints[i].var2].name << endl;
        }
        
        cout << "\nStarting CSP backtracking..." << endl;
        
        if (backtrackCSP()) {
            cout << "\n✅ Solution found!" << endl;
            cout << "Final assignment:" << endl;
            for (const auto& var : variables) {
                cout << "  " << var.name << " = " << var.value << endl;
            }
        } else {
            cout << "\n❌ No solution exists!" << endl;
        }
    }
};

int main() {
    // Example: Map coloring problem
    ConstraintSatisfaction csp;
    
    // Variables: regions to color
    csp.addVariable("WA", {1, 2, 3}); // Red, Green, Blue
    csp.addVariable("NT", {1, 2, 3});
    csp.addVariable("SA", {1, 2, 3});
    csp.addVariable("Q", {1, 2, 3});
    
    // Constraints: adjacent regions must have different colors
    csp.addConstraint(0, 1, [](int a, int b) { return a != b; }); // WA != NT
    csp.addConstraint(0, 2, [](int a, int b) { return a != b; }); // WA != SA
    csp.addConstraint(1, 2, [](int a, int b) { return a != b; }); // NT != SA
    csp.addConstraint(1, 3, [](int a, int b) { return a != b; }); // NT != Q
    csp.addConstraint(2, 3, [](int a, int b) { return a != b; }); // SA != Q
    
    csp.solveCSP();
    
    return 0;
}
```

---

## Real-World Applications

### 1. 🤖 AI Planning and Scheduling

```cpp
class AIPlanning {
private:
    struct Task {
        string name;
        int duration;
        int priority;
        vector<int> dependencies;
        int startTime;
        
        Task(string n, int d, int p) : name(n), duration(d), priority(p), startTime(-1) {}
    };
    
    vector<Task> tasks;
    vector<int> schedule;
    int totalTime;
    
    bool canSchedule(int taskIndex, int time) {
        // Check dependencies
        for (int dep : tasks[taskIndex].dependencies) {
            if (tasks[dep].startTime == -1 || 
                tasks[dep].startTime + tasks[dep].duration > time) {
                return false;
            }
        }
        
        // Check resource conflicts (simplified)
        for (int i = 0; i < tasks.size(); i++) {
            if (i != taskIndex && tasks[i].startTime != -1) {
                int taskEnd = time + tasks[taskIndex].duration;
                int otherEnd = tasks[i].startTime + tasks[i].duration;
                
                if (!(taskEnd <= tasks[i].startTime || time >= otherEnd)) {
                    return false; // Overlap
                }
            }
        }
        
        return true;
    }
    
    bool scheduleTask(int taskIndex, int depth = 0) {
        string indent(depth * 2, ' ');
        cout << indent << "🤖 Scheduling task " << taskIndex << ": " << tasks[taskIndex].name << endl;
        
        if (taskIndex == tasks.size()) {
            cout << indent << "✅ All tasks scheduled!" << endl;
            return true;
        }
        
        // Try different start times
        for (int time = 0; time <= totalTime; time++) {
            cout << indent << "📝 Trying start time " << time << " for " << tasks[taskIndex].name << endl;
            
            if (canSchedule(taskIndex, time)) {
                cout << indent << "✅ Time " << time << " is valid" << endl;
                
                // Schedule task
                tasks[taskIndex].startTime = time;
                
                // Recurse to next task
                if (scheduleTask(taskIndex + 1, depth + 1)) {
                    return true;
                }
                
                // Backtrack
                tasks[taskIndex].startTime = -1;
                cout << indent << "🔙 Backtracked from " << tasks[taskIndex].name << " at time " << time << endl;
            } else {
                cout << indent << "❌ Time " << time << " conflicts with dependencies/resources" << endl;
            }
        }
        
        return false;
    }
    
public:
    void addTask(string name, int duration, int priority, vector<int> deps = {}) {
        tasks.push_back(Task(name, duration, priority));
        tasks.back().dependencies = deps;
    }
    
    void solveScheduling(int maxTime) {
        cout << "🤖 AI Task Scheduling with Backtracking" << endl;
        cout << "=======================================" << endl;
        
        totalTime = maxTime;
        
        cout << "\nTasks to schedule:" << endl;
        for (int i = 0; i < tasks.size(); i++) {
            cout << "  " << i << ": " << tasks[i].name 
                 << " (duration: " << tasks[i].duration 
                 << ", priority: " << tasks[i].priority << ")" << endl;
            
            if (!tasks[i].dependencies.empty()) {
                cout << "     Dependencies: ";
                for (int dep : tasks[i].dependencies) {
                    cout << dep << " ";
                }
                cout << endl;
            }
        }
        
        cout << "\nStarting scheduling..." << endl;
        
        if (scheduleTask(0)) {
            cout << "\n✅ Schedule found!" << endl;
            cout << "Final schedule:" << endl;
            
            for (int i = 0; i < tasks.size(); i++) {
                cout << "  " << tasks[i].name 
                     << ": Start=" << tasks[i].startTime 
                     << ", End=" << (tasks[i].startTime + tasks[i].duration) << endl;
            }
        } else {
            cout << "\n❌ No valid schedule found!" << endl;
        }
    }
};

int main() {
    AIPlanning planner;
    
    planner.addTask("Setup", 2, 1);
    planner.addTask("Design", 3, 2, {0});
    planner.addTask("Code", 4, 3, {1});
    planner.addTask("Test", 2, 2, {2});
    planner.addTask("Deploy", 1, 1, {3});
    
    planner.solveScheduling(15);
    
    return 0;
}
```

---

## Tips, Tricks & Common Pitfalls

### 🎯 Pro Tips for Backtracking

```cpp
class BacktrackingTipsAndTricks {
public:
    void demonstrateProTips() {
        cout << "🎯 Pro Tips for Backtracking Algorithms" << endl;
        cout << "=======================================" << endl;
        cout << endl;
        
        cout << "1. 🔍 EARLY CONSTRAINT CHECKING:" << endl;
        cout << "   ✅ Check constraints as soon as possible" << endl;
        cout << "   ✅ Fail fast to avoid deep, useless recursion" << endl;
        cout << "   ✅ Use forward checking to detect dead ends" << endl;
        cout << endl;
        
        cout << "2. 🎯 SMART VARIABLE ORDERING:" << endl;
        cout << "   ✅ Most Constrained Variable (MCV) first" << endl;
        cout << "   ✅ Most Constraining Variable for tie-breaking" << endl;
        cout << "   ✅ Use domain knowledge for ordering" << endl;
        cout << endl;
        
        cout << "3. 📊 VALUE ORDERING HEURISTICS:" << endl;
        cout << "   ✅ Least Constraining Value (LCV) first" << endl;
        cout << "   ✅ Try most promising values early" << endl;
        cout << "   ✅ Use problem-specific heuristics" << endl;
        cout << endl;
        
        cout << "4. ✂️ EFFECTIVE PRUNING:" << endl;
        cout << "   ✅ Alpha-beta pruning for game trees" << endl;
        cout << "   ✅ Bound checking for optimization problems" << endl;
        cout << "   ✅ Symmetry breaking to avoid equivalent states" << endl;
        cout << endl;
        
        cout << "5. 💾 MEMOIZATION AND CACHING:" << endl;
        cout << "   ✅ Cache expensive computations" << endl;
        cout << "   ✅ Remember failed states to avoid revisiting" << endl;
        cout << "   ✅ Use transposition tables for game trees" << endl;
    }
    
    void demonstrateCommonMistakes() {
        cout << "\n❌ Common Backtracking Mistakes" << endl;
        cout << "===============================" << endl;
        cout << endl;
        
        cout << "MISTAKE 1: Late Constraint Checking" << endl;
        cout << "❌ Problem: Checking constraints only at leaf nodes" << endl;
        cout << "✅ Solution: Check constraints immediately after each choice" << endl;
        cout << "   Example: N-Queens - check conflicts after placing each queen" << endl;
        cout << endl;
        
        cout << "MISTAKE 2: Poor Variable Ordering" << endl;
        cout << "❌ Problem: Random or fixed variable ordering" << endl;
        cout << "✅ Solution: Use heuristics like MCV or domain knowledge" << endl;
        cout << "   Example: Sudoku - fill cells with fewest possibilities first" << endl;
        cout << endl;
        
        cout << "MISTAKE 3: Forgetting to Backtrack" << endl;
        cout << "❌ Problem: Not undoing changes when backtracking" << endl;
        cout << "✅ Solution: Always restore state after failed branch" << endl;
        cout << "   Example: Maze solving - unmark visited cells" << endl;
        cout << endl;
        
        cout << "MISTAKE 4: Inefficient State Representation" << endl;
        cout << "❌ Problem: Expensive copy operations for state" << endl;
        cout << "✅ Solution: Use efficient undo operations" << endl;
        cout << "   Example: Use arrays instead of copying entire board" << endl;
        cout << endl;
        
        cout << "MISTAKE 5: No Pruning or Poor Pruning" << endl;
        cout << "❌ Problem: Exploring obviously invalid branches" << endl;
        cout << "✅ Solution: Implement effective pruning strategies" << endl;
        cout << "   Example: Alpha-beta pruning in game trees" << endl;
    }
    
    void demonstrateOptimizationStrategies() {
        cout << "\n🚀 Advanced Optimization Strategies" << endl;
        cout << "===================================" << endl;
        cout << endl;
        
        cout << "1. ITERATIVE DEEPENING:" << endl;
        cout << "   • Gradually increase search depth" << endl;
        cout << "   • Good for finding solutions quickly" << endl;
        cout << "   • Memory efficient" << endl;
        cout << endl;
        
        cout << "2. CONSTRAINT PROPAGATION:" << endl;
        cout << "   • Reduce domains based on constraints" << endl;
        cout << "   • Arc consistency algorithms" << endl;
        cout << "   • Forward checking" << endl;
        cout << endl;
        
        cout << "3. RANDOMIZATION AND RESTARTS:" << endl;
        cout << "   • Random variable/value selection" << endl;
        cout << "   • Restart with different random seed" << endl;
        cout << "   • Escape local minima" << endl;
        cout << endl;
        
        cout << "4. PARALLEL BACKTRACKING:" << endl;
        cout << "   • Explore different branches in parallel" << endl;
        cout << "   • Work stealing for load balancing" << endl;
        cout << "   • Shared pruning information" << endl;
        cout << endl;
        
        cout << "5. LEARNING AND ADAPTATION:" << endl;
        cout << "   • Learn from failed branches" << endl;
        cout << "   • Conflict-driven clause learning" << endl;
        cout << "   • Adaptive heuristics" << endl;
    }
};

int main() {
    BacktrackingTipsAndTricks tips;
    tips.demonstrateProTips();
    tips.demonstrateCommonMistakes();
    tips.demonstrateOptimizationStrategies();
    
    return 0;
}
```

---

## 🎯 Key Takeaways

### Backtracking Fundamentals
1. **Systematic Exploration**: Try all possibilities in organized manner
2. **Incremental Construction**: Build solution step by step
3. **Backtrack on Failure**: Undo choices when they lead to dead ends
4. **Constraint Checking**: Validate choices as early as possible

### When to Use Backtracking
✅ **Perfect for**:
- Constraint satisfaction problems
- Puzzle solving (Sudoku, N-Queens)
- Combinatorial optimization
- Game tree search
- Path finding with constraints
- Generating permutations/combinations

❌ **Not suitable for**:
- Problems with optimal substructure (use DP)
- Simple optimization (use greedy)
- Large search spaces without pruning
- Real-time systems (too slow)

### Optimization Techniques
1. **Early Pruning**: Check constraints immediately
2. **Smart Ordering**: Use heuristics for variable/value selection
3. **Memoization**: Cache expensive computations
4. **Alpha-Beta Pruning**: For game trees
5. **Constraint Propagation**: Reduce search space

### Real-World Applications
1. **🤖 AI Planning**: Task scheduling, resource allocation
2. **🎮 Game Development**: AI decision making, puzzle solving
3. **🧩 Constraint Solving**: Configuration problems, timetabling
4. **🔍 Optimization**: Route planning, assignment problems
5. **🧬 Bioinformatics**: Sequence alignment, protein folding

---

## 🚀 What's Next?

Congratulations! You've completed the comprehensive Data Structures and Algorithms learning guide! 🎉

You now have mastery over:
- **18 Complete Topics**: From basic arrays to advanced backtracking
- **Fundamental Concepts**: Time complexity, space optimization, algorithm design
- **Classic Problems**: With step-by-step solutions and real-world applications
- **Implementation Skills**: Practical C++ code with detailed explanations
- **Problem-Solving Strategies**: When to use each algorithm and data structure

### 🎯 Your DSA Journey Summary:
1. **📁 Foundations**: C++ basics, complexity analysis
2. **📊 Linear Structures**: Arrays, strings, linked lists, stacks, queues
3. **🌳 Tree Structures**: Binary trees, BST, heaps
4. **🔗 Advanced Structures**: Hash tables, graphs
5. **⚡ Algorithms**: Searching, sorting, recursion, DP, greedy, backtracking

### 🚀 Next Steps:
1. **Practice**: Solve problems on LeetCode, HackerRank, Codeforces
