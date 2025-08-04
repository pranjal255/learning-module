# Low Level System Components - Understanding the Foundation

## 🌟 Real-World Story: The City Infrastructure

Imagine you're the mayor of a city. For citizens to live comfortably, you need:
- **Roads and highways** (networking and communication)
- **Power grid** (memory and processing)
- **Water and sewage systems** (file systems and storage)
- **Security systems** (authentication and authorization)
- **Traffic management** (concurrency and threading)

Just like a city needs solid infrastructure, software systems need robust low-level components to function efficiently. Understanding these components helps you build better, more reliable applications!

## 🎯 Why Low-Level Components Matter

### Real Applications:
- **Operating Systems**: Process management, memory allocation
- **Database Systems**: Storage engines, buffer management
- **Web Servers**: Connection handling, request processing
- **Game Engines**: Real-time rendering, physics simulation

## 📊 Core System Components

### 🧠 Memory Management
### 🗂️ File Systems
### 🌐 Networking
### 🔒 Security
### 🔄 Concurrency

---

## 🧠 MEMORY MANAGEMENT

### 1. 💾 Memory Hierarchy
**Real-World Analogy**: Like organizing your workspace - desk (registers), bookshelf (cache), filing cabinet (RAM), warehouse (disk)

```cpp
#include <iostream>
#include <vector>
#include <chrono>
#include <memory>
#include <cstring>

using namespace std;
using namespace chrono;

class MemoryHierarchy {
public:
    // Demonstrate memory access patterns
    static void demonstrateMemoryHierarchy() {
        const int SIZE = 1000000;
        vector<int> data(SIZE);
        
        // Initialize data
        for (int i = 0; i < SIZE; i++) {
            data[i] = i;
        }
        
        cout << "=== Memory Access Patterns ===" << endl;
        
        // Sequential access (cache-friendly)
        auto start = high_resolution_clock::now();
        long sum1 = 0;
        for (int i = 0; i < SIZE; i++) {
            sum1 += data[i];
        }
        auto end = high_resolution_clock::now();
        auto sequential_time = duration_cast<microseconds>(end - start);
        
        // Random access (cache-unfriendly)
        start = high_resolution_clock::now();
        long sum2 = 0;
        for (int i = 0; i < SIZE; i++) {
            int index = (i * 7919) % SIZE;  // Pseudo-random access
            sum2 += data[index];
        }
        end = high_resolution_clock::now();
        auto random_time = duration_cast<microseconds>(end - start);
        
        cout << "Sequential access time: " << sequential_time.count() << " μs" << endl;
        cout << "Random access time: " << random_time.count() << " μs" << endl;
        cout << "Random is " << (double)random_time.count() / sequential_time.count() 
             << "x slower" << endl;
    }
    
    // Memory layout demonstration
    struct MemoryLayout {
        char a;      // 1 byte
        int b;       // 4 bytes (with padding)
        char c;      // 1 byte
        double d;    // 8 bytes (with padding)
        
        void printLayout() {
            cout << "=== Memory Layout ===" << endl;
            cout << "Struct size: " << sizeof(MemoryLayout) << " bytes" << endl;
            cout << "Address of a: " << (void*)&a << endl;
            cout << "Address of b: " << (void*)&b << endl;
            cout << "Address of c: " << (void*)&c << endl;
            cout << "Address of d: " << (void*)&d << endl;
            
            cout << "Offset of a: " << offsetof(MemoryLayout, a) << endl;
            cout << "Offset of b: " << offsetof(MemoryLayout, b) << endl;
            cout << "Offset of c: " << offsetof(MemoryLayout, c) << endl;
            cout << "Offset of d: " << offsetof(MemoryLayout, d) << endl;
        }
    };
};

// Custom memory allocator example
class MemoryPool {
private:
    char* pool;
    size_t poolSize;
    size_t blockSize;
    vector<void*> freeBlocks;
    
public:
    MemoryPool(size_t numBlocks, size_t blockSz) 
        : poolSize(numBlocks * blockSz), blockSize(blockSz) {
        pool = new char[poolSize];
        
        // Initialize free block list
        for (size_t i = 0; i < numBlocks; i++) {
            freeBlocks.push_back(pool + i * blockSize);
        }
        
        cout << "Memory pool created: " << numBlocks << " blocks of " 
             << blockSize << " bytes each" << endl;
    }
    
    ~MemoryPool() {
        delete[] pool;
    }
    
    void* allocate() {
        if (freeBlocks.empty()) {
            cout << "Memory pool exhausted!" << endl;
            return nullptr;
        }
        
        void* block = freeBlocks.back();
        freeBlocks.pop_back();
        return block;
    }
    
    void deallocate(void* ptr) {
        if (ptr >= pool && ptr < pool + poolSize) {
            freeBlocks.push_back(ptr);
        }
    }
    
    size_t availableBlocks() const {
        return freeBlocks.size();
    }
};

// RAII (Resource Acquisition Is Initialization) example
class RAIIExample {
private:
    int* data;
    size_t size;
    
public:
    RAIIExample(size_t sz) : size(sz) {
        data = new int[size];
        cout << "Allocated " << size << " integers" << endl;
    }
    
    ~RAIIExample() {
        delete[] data;
        cout << "Deallocated " << size << " integers" << endl;
    }
    
    // Copy constructor
    RAIIExample(const RAIIExample& other) : size(other.size) {
        data = new int[size];
        memcpy(data, other.data, size * sizeof(int));
        cout << "Copy constructed " << size << " integers" << endl;
    }
    
    // Move constructor
    RAIIExample(RAIIExample&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        cout << "Move constructed " << size << " integers" << endl;
    }
    
    // Assignment operators
    RAIIExample& operator=(const RAIIExample& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            memcpy(data, other.data, size * sizeof(int));
        }
        return *this;
    }
    
    RAIIExample& operator=(RAIIExample&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    int& operator[](size_t index) {
        return data[index];
    }
    
    size_t getSize() const { return size; }
};
```

### 2. 🗂️ File Systems
**Real-World Analogy**: Like organizing documents in filing cabinets with folders, labels, and indexes

```cpp
#include <fstream>
#include <filesystem>
#include <sys/stat.h>

namespace fs = std::filesystem;

class FileSystemOperations {
public:
    // File I/O operations
    static bool writeFile(const string& filename, const string& content) {
        ofstream file(filename, ios::binary);
        if (!file.is_open()) {
            cout << "Error: Cannot open file for writing: " << filename << endl;
            return false;
        }
        
        file.write(content.c_str(), content.size());
        file.close();
        
        cout << "Written " << content.size() << " bytes to " << filename << endl;
        return true;
    }
    
    static string readFile(const string& filename) {
        ifstream file(filename, ios::binary);
        if (!file.is_open()) {
            cout << "Error: Cannot open file for reading: " << filename << endl;
            return "";
        }
        
        // Get file size
        file.seekg(0, ios::end);
        size_t fileSize = file.tellg();
        file.seekg(0, ios::beg);
        
        // Read entire file
        string content(fileSize, '\0');
        file.read(&content[0], fileSize);
        file.close();
        
        cout << "Read " << fileSize << " bytes from " << filename << endl;
        return content;
    }
    
    // Directory operations
    static void listDirectory(const string& path) {
        cout << "=== Directory listing: " << path << " ===" << endl;
        
        try {
            for (const auto& entry : fs::directory_iterator(path)) {
                cout << (entry.is_directory() ? "[DIR]  " : "[FILE] ");
                cout << entry.path().filename().string();
                
                if (entry.is_regular_file()) {
                    cout << " (" << entry.file_size() << " bytes)";
                }
                
                cout << endl;
            }
        } catch (const fs::filesystem_error& ex) {
            cout << "Error: " << ex.what() << endl;
        }
    }
    
    static bool createDirectory(const string& path) {
        try {
            if (fs::create_directories(path)) {
                cout << "Created directory: " << path << endl;
                return true;
            } else {
                cout << "Directory already exists: " << path << endl;
                return true;
            }
        } catch (const fs::filesystem_error& ex) {
            cout << "Error creating directory: " << ex.what() << endl;
            return false;
        }
    }
    
    // File metadata
    static void getFileInfo(const string& filename) {
        try {
            if (!fs::exists(filename)) {
                cout << "File does not exist: " << filename << endl;
                return;
            }
            
            auto fileSize = fs::file_size(filename);
            auto lastWrite = fs::last_write_time(filename);
            
            cout << "=== File Info: " << filename << " ===" << endl;
            cout << "Size: " << fileSize << " bytes" << endl;
            cout << "Type: " << (fs::is_directory(filename) ? "Directory" : "File") << endl;
            cout << "Permissions: " << oct << fs::status(filename).permissions() << dec << endl;
            
            // Convert file time to system time (simplified)
            auto sctp = chrono::time_point_cast<chrono::system_clock::duration>(
                lastWrite - fs::file_time_type::clock::now() + chrono::system_clock::now()
            );
            auto time_t = chrono::system_clock::to_time_t(sctp);
            cout << "Last modified: " << ctime(&time_t);
            
        } catch (const fs::filesystem_error& ex) {
            cout << "Error getting file info: " << ex.what() << endl;
        }
    }
};

// Simple file-based database
class SimpleFileDB {
private:
    string dbPath;
    
public:
    SimpleFileDB(const string& path) : dbPath(path) {
        FileSystemOperations::createDirectory(dbPath);
    }
    
    bool store(const string& key, const string& value) {
        string filename = dbPath + "/" + key + ".dat";
        return FileSystemOperations::writeFile(filename, value);
    }
    
    string retrieve(const string& key) {
        string filename = dbPath + "/" + key + ".dat";
        return FileSystemOperations::readFile(filename);
    }
    
    bool remove(const string& key) {
        string filename = dbPath + "/" + key + ".dat";
        try {
            if (fs::remove(filename)) {
                cout << "Removed key: " << key << endl;
                return true;
            } else {
                cout << "Key not found: " << key << endl;
                return false;
            }
        } catch (const fs::filesystem_error& ex) {
            cout << "Error removing key: " << ex.what() << endl;
            return false;
        }
    }
    
    vector<string> listKeys() {
        vector<string> keys;
        try {
            for (const auto& entry : fs::directory_iterator(dbPath)) {
                if (entry.is_regular_file()) {
                    string filename = entry.path().filename().string();
                    if (filename.ends_with(".dat")) {
                        keys.push_back(filename.substr(0, filename.length() - 4));
                    }
                }
            }
        } catch (const fs::filesystem_error& ex) {
            cout << "Error listing keys: " << ex.what() << endl;
        }
        return keys;
    }
};
```

### 3. 🌐 Networking Fundamentals
**Real-World Analogy**: Like the postal system - addresses, protocols, and reliable delivery

```cpp
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>

class NetworkingBasics {
public:
    // TCP Server example
    class TCPServer {
    private:
        int serverSocket;
        int port;
        bool running;
        
    public:
        TCPServer(int p) : port(p), running(false) {}
        
        bool start() {
            // Create socket
            serverSocket = socket(AF_INET, SOCK_STREAM, 0);
            if (serverSocket < 0) {
                cout << "Error creating socket" << endl;
                return false;
            }
            
            // Set socket options
            int opt = 1;
            setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
            
            // Bind to address
            sockaddr_in serverAddr{};
            serverAddr.sin_family = AF_INET;
            serverAddr.sin_addr.s_addr = INADDR_ANY;
            serverAddr.sin_port = htons(port);
            
            if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
                cout << "Error binding socket to port " << port << endl;
                close(serverSocket);
                return false;
            }
            
            // Listen for connections
            if (listen(serverSocket, 5) < 0) {
                cout << "Error listening on socket" << endl;
                close(serverSocket);
                return false;
            }
            
            running = true;
            cout << "TCP Server started on port " << port << endl;
            return true;
        }
        
        void acceptConnections() {
            while (running) {
                sockaddr_in clientAddr{};
                socklen_t clientLen = sizeof(clientAddr);
                
                int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
                if (clientSocket < 0) {
                    if (running) {
                        cout << "Error accepting connection" << endl;
                    }
                    continue;
                }
                
                cout << "Client connected from " << inet_ntoa(clientAddr.sin_addr) << endl;
                
                // Handle client in separate thread
                thread clientThread(&TCPServer::handleClient, this, clientSocket);
                clientThread.detach();
            }
        }
        
        void handleClient(int clientSocket) {
            char buffer[1024];
            
            while (true) {
                int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
                if (bytesReceived <= 0) {
                    break;
                }
                
                buffer[bytesReceived] = '\0';
                cout << "Received: " << buffer << endl;
                
                // Echo back to client
                string response = "Echo: " + string(buffer);
                send(clientSocket, response.c_str(), response.length(), 0);
            }
            
            cout << "Client disconnected" << endl;
            close(clientSocket);
        }
        
        void stop() {
            running = false;
            close(serverSocket);
            cout << "TCP Server stopped" << endl;
        }
    };
    
    // TCP Client example
    class TCPClient {
    private:
        int clientSocket;
        string serverIP;
        int serverPort;
        
    public:
        TCPClient(const string& ip, int port) : serverIP(ip), serverPort(port) {}
        
        bool connect() {
            clientSocket = socket(AF_INET, SOCK_STREAM, 0);
            if (clientSocket < 0) {
                cout << "Error creating client socket" << endl;
                return false;
            }
            
            sockaddr_in serverAddr{};
            serverAddr.sin_family = AF_INET;
            serverAddr.sin_port = htons(serverPort);
            inet_pton(AF_INET, serverIP.c_str(), &serverAddr.sin_addr);
            
            if (::connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
                cout << "Error connecting to server" << endl;
                close(clientSocket);
                return false;
            }
            
            cout << "Connected to server " << serverIP << ":" << serverPort << endl;
            return true;
        }
        
        bool sendMessage(const string& message) {
            int bytesSent = send(clientSocket, message.c_str(), message.length(), 0);
            if (bytesSent < 0) {
                cout << "Error sending message" << endl;
                return false;
            }
            
            char buffer[1024];
            int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
            if (bytesReceived > 0) {
                buffer[bytesReceived] = '\0';
                cout << "Server response: " << buffer << endl;
            }
            
            return true;
        }
        
        void disconnect() {
            close(clientSocket);
            cout << "Disconnected from server" << endl;
        }
    };
    
    // HTTP request parser (simplified)
    class HTTPParser {
    public:
        struct HTTPRequest {
            string method;
            string path;
            string version;
            map<string, string> headers;
            string body;
        };
        
        static HTTPRequest parseRequest(const string& rawRequest) {
            HTTPRequest request;
            istringstream stream(rawRequest);
            string line;
            
            // Parse request line
            if (getline(stream, line)) {
                istringstream requestLine(line);
                requestLine >> request.method >> request.path >> request.version;
            }
            
            // Parse headers
            while (getline(stream, line) && !line.empty() && line != "\r") {
                size_t colonPos = line.find(':');
                if (colonPos != string::npos) {
                    string key = line.substr(0, colonPos);
                    string value = line.substr(colonPos + 1);
                    
                    // Trim whitespace
                    key.erase(0, key.find_first_not_of(" \t"));
                    key.erase(key.find_last_not_of(" \t\r") + 1);
                    value.erase(0, value.find_first_not_of(" \t"));
                    value.erase(value.find_last_not_of(" \t\r") + 1);
                    
                    request.headers[key] = value;
                }
            }
            
            // Parse body (rest of the stream)
            string bodyLine;
            while (getline(stream, bodyLine)) {
                request.body += bodyLine + "\n";
            }
            
            return request;
        }
        
        static string createResponse(int statusCode, const string& statusText, 
                                   const map<string, string>& headers, const string& body) {
            string response = "HTTP/1.1 " + to_string(statusCode) + " " + statusText + "\r\n";
            
            for (const auto& header : headers) {
                response += header.first + ": " + header.second + "\r\n";
            }
            
            response += "Content-Length: " + to_string(body.length()) + "\r\n";
            response += "\r\n";
            response += body;
            
            return response;
        }
    };
};
```

### 4. 🔒 Security Fundamentals
**Real-World Analogy**: Like bank security - multiple layers, authentication, encryption, and audit trails

```cpp
#include <openssl/sha.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <iomanip>
#include <sstream>

class SecurityFundamentals {
public:
    // Hash functions
    class HashingUtils {
    public:
        static string sha256(const string& input) {
            unsigned char hash[SHA256_DIGEST_LENGTH];
            SHA256_CTX sha256;
            SHA256_Init(&sha256);
            SHA256_Update(&sha256, input.c_str(), input.length());
            SHA256_Final(hash, &sha256);
            
            stringstream ss;
            for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
                ss << hex << setw(2) << setfill('0') << (int)hash[i];
            }
            return ss.str();
        }
        
        static string generateSalt(int length = 16) {
            unsigned char salt[length];
            if (RAND_bytes(salt, length) != 1) {
                throw runtime_error("Failed to generate random salt");
            }
            
            stringstream ss;
            for (int i = 0; i < length; i++) {
                ss << hex << setw(2) << setfill('0') << (int)salt[i];
            }
            return ss.str();
        }
        
        static string hashPassword(const string& password, const string& salt) {
            return sha256(password + salt);
        }
    };
    
    // Simple authentication system
    class AuthenticationSystem {
    private:
        struct User {
            string username;
            string passwordHash;
            string salt;
            vector<string> roles;
            time_t lastLogin;
            int failedAttempts;
            bool isLocked;
        };
        
        map<string, User> users;
        map<string, time_t> sessions;  // sessionId -> expiry time
        
    public:
        bool registerUser(const string& username, const string& password, 
                         const vector<string>& roles = {"user"}) {
            if (users.find(username) != users.end()) {
                cout << "User already exists: " << username << endl;
                return false;
            }
            
            User user;
            user.username = username;
            user.salt = HashingUtils::generateSalt();
            user.passwordHash = HashingUtils::hashPassword(password, user.salt);
            user.roles = roles;
            user.lastLogin = 0;
            user.failedAttempts = 0;
            user.isLocked = false;
            
            users[username] = user;
            cout << "User registered: " << username << endl;
            return true;
        }
        
        string login(const string& username, const string& password) {
            auto it = users.find(username);
            if (it == users.end()) {
                cout << "User not found: " << username << endl;
                return "";
            }
            
            User& user = it->second;
            
            if (user.isLocked) {
                cout << "Account locked: " << username << endl;
                return "";
            }
            
            string hashedPassword = HashingUtils::hashPassword(password, user.salt);
            if (hashedPassword != user.passwordHash) {
                user.failedAttempts++;
                if (user.failedAttempts >= 3) {
                    user.isLocked = true;
                    cout << "Account locked due to failed attempts: " << username << endl;
                } else {
                    cout << "Invalid password for: " << username << endl;
                }
                return "";
            }
            
            // Reset failed attempts on successful login
            user.failedAttempts = 0;
            user.lastLogin = time(nullptr);
            
            // Generate session token
            string sessionId = HashingUtils::generateSalt(32);
            sessions[sessionId] = time(nullptr) + 3600;  // 1 hour expiry
            
            cout << "Login successful: " << username << endl;
            return sessionId;
        }
        
        bool validateSession(const string& sessionId) {
            auto it = sessions.find(sessionId);
            if (it == sessions.end()) {
                return false;
            }
            
            if (time(nullptr) > it->second) {
                sessions.erase(it);  // Remove expired session
                return false;
            }
            
            return true;
        }
        
        void logout(const string& sessionId) {
            sessions.erase(sessionId);
            cout << "Session logged out" << endl;
        }
        
        bool hasRole(const string& username, const string& role) {
            auto it = users.find(username);
            if (it == users.end()) {
                return false;
            }
            
            const auto& userRoles = it->second.roles;
            return find(userRoles.begin(), userRoles.end(), role) != userRoles.end();
        }
    };
    
    // Simple encryption (for demonstration - use proper crypto libraries in production)
    class SimpleEncryption {
    public:
        static string xorEncrypt(const string& plaintext, const string& key) {
            string ciphertext = plaintext;
            for (size_t i = 0; i < plaintext.length(); i++) {
                ciphertext[i] ^= key[i % key.length()];
            }
            return ciphertext;
        }
        
        static string xorDecrypt(const string& ciphertext, const string& key) {
            return xorEncrypt(ciphertext, key);  // XOR is symmetric
        }
        
        // Base64 encoding for safe text transmission
        static string base64Encode(const string& input) {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            string encoded;
            int val = 0, valb = -6;
            
            for (unsigned char c : input) {
                val = (val << 8) + c;
                valb += 8;
                while (valb >= 0) {
                    encoded.push_back(chars[(val >> valb) & 0x3F]);
                    valb -= 6;
                }
            }
            
            if (valb > -6) {
                encoded.push_back(chars[((val << 8) >> (valb + 8)) & 0x3F]);
            }
            
            while (encoded.size() % 4) {
                encoded.push_back('=');
            }
            
            return encoded;
        }
    };
};
```

### 5. 🔄 Concurrency and Threading
**Real-World Analogy**: Like managing a restaurant kitchen - multiple chefs working together, coordinating tasks, avoiding conflicts

```cpp
#include <thread>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <queue>
#include <future>

class ConcurrencyExamples {
public:
    // Thread-safe counter
    class ThreadSafeCounter {
    private:
        mutable mutex mtx;
        int count;
        
    public:
        ThreadSafeCounter() : count(0) {}
        
        void increment() {
            lock_guard<mutex> lock(mtx);
            count++;
        }
        
        void decrement() {
            lock_guard<mutex> lock(mtx);
            count--;
        }
        
        int getValue() const {
            lock_guard<mutex> lock(mtx);
            return count;
        }
    };
    
    // Producer-Consumer pattern
    class ProducerConsumer {
    private:
        queue<int> buffer;
        mutex mtx;
        condition_variable cv;
        bool finished;
        size_t maxSize;
        
    public:
        ProducerConsumer(size_t maxSz) : finished(false), maxSize(maxSz) {}
        
        void produce(int item) {
            unique_lock<mutex> lock(mtx);
            cv.wait(lock, [this] { return buffer.size() < maxSize; });
            
            buffer.push(item);
            cout << "Produced: " << item << " (buffer size: " << buffer.size() << ")" << endl;
            
            cv.notify_one();
        }
        
        bool consume(int& item) {
            unique_lock<mutex> lock(mtx);
            cv.wait(lock, [this] { return !buffer.empty() || finished; });
            
            if (buffer.empty() && finished) {
                return false;
            }
            
            item = buffer.front();
            buffer.pop();
            cout << "Consumed: " << item << " (buffer size: " << buffer.size() << ")" << endl;
            
            cv.notify_one();
            return true;
        }
        
        void finish() {
            lock_guard<mutex> lock(mtx);
            finished = true;
            cv.notify_all();
        }
    };
    
    // Thread pool implementation
    class ThreadPool {
    private:
        vector<thread> workers;
        queue<function<void()>> tasks;
        mutex queueMutex;
        condition_variable condition;
        bool stop;
        
    public:
        ThreadPool(size_t numThreads) : stop(false) {
            for (size_t i = 0; i < numThreads; i++) {
                workers.emplace_back([this] {
                    while (true) {
                        function<void()> task;
                        
                        {
                            unique_lock<mutex> lock(queueMutex);
                            condition.wait(lock, [this] { return stop || !tasks.empty(); });
                            
                            if (stop && tasks.empty()) {
                                return;
                            }
                            
                            task = move(tasks.front());
                            tasks.pop();
                        }
                        
                        task();
                    }
                });
            }
            
            cout << "Thread pool created with " << numThreads << " threads" << endl;
        }
        
        template<class F, class... Args>
        auto enqueue(F&& f, Args&&... args) -> future<typename result_of<F(Args...)>::type> {
            using return_type = typename result_of<F(Args...)>::type;
            
            auto task = make_shared<packaged_task<return_type()>>(
                bind(forward<F>(f), forward<Args>(args)...)
            );
            
            future<return_type> result = task->get_future();
            
            {
                unique_lock<mutex> lock(queueMutex);
                if (stop) {
                    throw runtime_error("enqueue on stopped ThreadPool");
                }
                
                tasks.emplace([task]() { (*task)(); });
            }
            
            condition.notify_one();
            return result;
        }
        
        ~ThreadPool() {
            {
                unique_lock<mutex> lock(queueMutex);
                stop = true;
            }
            
            condition.notify_all();
            
            for (thread& worker : workers) {
                worker.join();
            }
            
            cout << "Thread pool destroyed" << endl;
        }
    };
    
    // Atomic operations example
    class AtomicOperations {
    private:
        atomic<int> counter{0};
        atomic<bool> flag{false};
        
    public:
        void incrementCounter() {
            counter.fetch_add(1);
        }
        
        void decrementCounter() {
            counter.fetch_sub(1);
        }
        
        int getCounter() const {
            return counter.load();
        }
        
        void setFlag() {
            flag.store(true);
        }
        
        bool checkFlag() const {
            return flag.load();
        }
        
        // Compare and swap
        bool compareAndSwap(int expected, int desired) {
            return counter.compare_exchange_weak(expected, desired);
        }
    };
    
    // Deadlock demonstration and prevention
    class DeadlockExample {
    private:
        mutex mutex1;
        mutex mutex2;
        
    public:
        // ❌ Potential deadlock - different lock order
        void badMethod1() {
            lock_guard<mutex> lock1(mutex1);
            this_thread::sleep_for(chrono::milliseconds(10));
            lock_guard<mutex> lock2(mutex2);
            cout << "Method 1 executed" << endl;
        }
        
        void badMethod2() {
            lock_guard<mutex> lock2(mutex2);
            this_thread::sleep_for(chrono::milliseconds(10));
            lock_guard<mutex> lock1(mutex1);
            cout << "Method 2 executed" << endl;
        }
        
        // ✅ Deadlock prevention - consistent lock order
        void goodMethod1() {
            lock_guard<mutex> lock1(mutex1);
            lock_guard<mutex> lock2(mutex2);
            cout << "Good method 1 executed" << endl;
        }
        
        void goodMethod2() {
            lock_guard<mutex> lock1(mutex1);
            lock_guard<mutex> lock2(mutex2);
            cout << "Good method 2 executed" << endl;
        }
        
        // ✅ Using std::lock to avoid deadlock
        void safeMethod1() {
            lock(mutex1, mutex2);
            lock_guard<mutex> lock1(mutex1, adopt_lock);
            lock_guard<mutex> lock2(mutex2, adopt_lock);
            cout << "Safe method 1 executed" << endl;
        }
        
        void safeMethod2() {
            lock(mutex1, mutex2);
            lock_guard<mutex> lock1(mutex1, adopt_lock);
            lock_guard<mutex> lock2(mutex2, adopt_lock);
            cout << "Safe method 2 executed" << endl;
        }
    };
};
```

---

## 🎮 Practice Problems

### Problem 1: Memory-Efficient Data Structure
Implement a memory pool allocator for a specific data structure:
- Fixed-size block allocation
- Memory reuse and fragmentation handling
- Performance comparison with standard allocator

### Problem 2: File-Based Cache System
Create a file-based caching system:
- LRU eviction policy
- Persistent storage across restarts
- Thread-safe operations
- Configurable cache size limits

### Problem 3: Multi-threaded Web Server
Build a basic multi-threaded web server:
- Handle multiple concurrent connections
- Parse HTTP requests and generate responses
- Implement connection pooling
- Add basic security features

---

## 🚀 Real Applications

### 1. **Database Systems**
```cpp
// Low-level components in database engines
class DatabaseEngine {
    // Buffer pool management
    // Lock management for concurrency
    // Storage engine with file I/O
    // Query execution with threading
};
```

### 2. **Operating Systems**
```cpp
// OS kernel components
class OperatingSystem {
    // Process scheduling and management
    // Memory management (virtual memory)
    // File system implementation
    // Device drivers and I/O
};
```

### 3. **Game Engines**
```cpp
// Real-time game engine components
class GameEngine {
    // Memory pools for game objects
    // Multi-threaded rendering pipeline
    // Asset loading and caching
    // Network synchronization
};
```

---

## 📚 Performance Optimization Tips

### Memory Optimization:
```cpp
class MemoryOptimization {
public:
    // 1. Use memory pools for frequent allocations
    // 2. Align data structures for cache efficiency
    // 3. Minimize memory fragmentation
    // 4. Use RAII for automatic resource management
    
    // Cache-friendly data layout
    struct CacheFriendly {
        // Group frequently accessed data together
        int frequentData[4];
        // Separate rarely used data
        char rareData[100];
    };
};
```

### I/O Optimization:
```cpp
class IOOptimization {
public:
    // 1. Use buffered I/O for small operations
    // 2. Implement asynchronous I/O for better throughput
    // 3. Batch operations when possible
    // 4. Use memory-mapped files for large data
    
    static void demonstrateBufferedIO() {
        // Buffered writes are much faster
        ofstream file("output.txt", ios::binary);
        file.rdbuf()->pubsetbuf(nullptr, 8192);  // 8KB buffer
    }
};
```

### Concurrency Best Practices:
```cpp
class ConcurrencyBestPractices {
public:
    // 1. Minimize shared state
    // 2. Use lock-free data structures when possible
    // 3. Avoid fine-grained locking
    // 4. Use thread-local storage for per-thread data
    
    static thread_local int threadLocalCounter;
    
    void incrementThreadLocal() {
        threadLocalCounter++;  // No synchronization needed
    }
};
```

---

## ⚡ Key Takeaways

1. **Memory management is crucial** - Understand allocation patterns and optimize accordingly
2. **File I/O can be a bottleneck** - Use appropriate buffering and async operations
3. **Network programming requires careful error handling** - Always check return values
4. **Security should be built-in** - Don't add it as an afterthought
5. **Concurrency is complex** - Start simple and add complexity gradually
6. **Profile before optimizing** - Measure to find real bottlenecks

## 🎯 Next Steps

- Study operating system concepts in depth
- Learn about computer architecture and CPU optimization
- Explore advanced networking protocols and patterns
- Practice implementing low-level data structures
- Understand compiler optimizations and assembly language

---
*"Understanding the foundation makes you a better architect - know your building blocks!"* 🏗️
