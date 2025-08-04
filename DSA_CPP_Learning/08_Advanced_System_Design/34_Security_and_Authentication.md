# Security and Authentication - Building Secure Systems

## 🌟 Real-World Story: The Digital Fortress

Imagine you're designing security for a modern bank with multiple branches, online services, and mobile apps. You need the same security principles as digital systems:

- **Identity Verification** (Authentication): Checking if customers are who they claim to be
- **Access Control** (Authorization): Determining what services each customer can use
- **Secure Communication** (Encryption): Protecting data as it travels between locations
- **Audit Trails** (Logging): Recording all transactions for compliance and investigation
- **Fraud Detection** (Monitoring): Identifying suspicious patterns and activities
- **Backup Security** (Key Management): Safely storing and rotating security credentials
- **Emergency Protocols** (Incident Response): Handling security breaches quickly

Just like a bank's multi-layered security approach, modern systems need comprehensive security that protects against various threats while maintaining usability!

## 🎯 Why Security Matters

### Real Applications:
- **Google**: Protects 4+ billion users with advanced threat detection
- **Amazon**: Secures millions of transactions daily with end-to-end encryption
- **Microsoft**: Manages enterprise security for 200+ million Office 365 users
- **Apple**: Implements hardware-level security for billions of devices

## 📊 Security System Components

### 🔐 Authentication and Authorization
### 🔒 Cryptography and Encryption
### 🛡️ Security Protocols and Standards
### 🚨 Threat Detection and Prevention
### 📋 Security Monitoring and Compliance

---

## 🔐 AUTHENTICATION AND AUTHORIZATION

### What is Authentication vs Authorization?
**Real-World Analogy**: Authentication is like checking your ID at a hotel (who you are), while authorization is like your room key determining which floors you can access (what you can do).

```cpp
// Authentication and Authorization System Implementation
#include <openssl/sha.h>
#include <openssl/rand.h>
#include <jwt-cpp/jwt.h>
#include <chrono>
#include <random>

// User and Role Management
enum class UserRole {
    GUEST,
    USER,
    MODERATOR,
    ADMIN,
    SUPER_ADMIN
};

enum class Permission {
    READ,
    WRITE,
    DELETE,
    ADMIN_READ,
    ADMIN_WRITE,
    SYSTEM_CONFIG
};

class User {
private:
    string userId;
    string username;
    string email;
    string passwordHash;
    string salt;
    UserRole role;
    set<Permission> permissions;
    bool isActive;
    chrono::system_clock::time_point createdAt;
    chrono::system_clock::time_point lastLogin;
    int failedLoginAttempts;
    
public:
    User(const string& id, const string& user, const string& mail, 
         const string& password, UserRole r = UserRole::USER)
        : userId(id), username(user), email(mail), role(r), 
          isActive(true), createdAt(chrono::system_clock::now()), 
          failedLoginAttempts(0) {
        
        generateSalt();
        passwordHash = hashPassword(password, salt);
        setDefaultPermissions();
    }
    
    // Getters
    string getUserId() const { return userId; }
    string getUsername() const { return username; }
    string getEmail() const { return email; }
    UserRole getRole() const { return role; }
    bool getIsActive() const { return isActive; }
    int getFailedAttempts() const { return failedLoginAttempts; }
    
    // Authentication
    bool verifyPassword(const string& password) const {
        return passwordHash == hashPassword(password, salt);
    }
    
    void updateLastLogin() {
        lastLogin = chrono::system_clock::now();
        failedLoginAttempts = 0;
    }
    
    void incrementFailedAttempts() {
        failedLoginAttempts++;
        if (failedLoginAttempts >= 5) {
            isActive = false; // Lock account after 5 failed attempts
            cout << "Account locked for user: " << username << endl;
        }
    }
    
    void resetFailedAttempts() {
        failedLoginAttempts = 0;
    }
    
    // Authorization
    bool hasPermission(Permission perm) const {
        return permissions.find(perm) != permissions.end();
    }
    
    void grantPermission(Permission perm) {
        permissions.insert(perm);
    }
    
    void revokePermission(Permission perm) {
        permissions.erase(perm);
    }
    
    void setRole(UserRole newRole) {
        role = newRole;
        setDefaultPermissions();
    }
    
    void displayUserInfo() const {
        cout << "User: " << username << " (" << userId << ")" << endl;
        cout << "Email: " << email << endl;
        cout << "Role: " << roleToString(role) << endl;
        cout << "Active: " << (isActive ? "Yes" : "No") << endl;
        cout << "Failed Attempts: " << failedLoginAttempts << endl;
        cout << "Permissions: ";
        for (const auto& perm : permissions) {
            cout << permissionToString(perm) << " ";
        }
        cout << endl;
    }
    
private:
    void generateSalt() {
        const int saltLength = 16;
        unsigned char saltBytes[saltLength];
        RAND_bytes(saltBytes, saltLength);
        
        salt = "";
        for (int i = 0; i < saltLength; i++) {
            salt += static_cast<char>(saltBytes[i]);
        }
    }
    
    string hashPassword(const string& password, const string& salt) const {
        string combined = password + salt;
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256(reinterpret_cast<const unsigned char*>(combined.c_str()), 
               combined.length(), hash);
        
        string hashedPassword = "";
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            char hex[3];
            sprintf(hex, "%02x", hash[i]);
            hashedPassword += hex;
        }
        return hashedPassword;
    }
    
    void setDefaultPermissions() {
        permissions.clear();
        
        switch (role) {
            case UserRole::GUEST:
                permissions.insert(Permission::READ);
                break;
            case UserRole::USER:
                permissions.insert(Permission::READ);
                permissions.insert(Permission::WRITE);
                break;
            case UserRole::MODERATOR:
                permissions.insert(Permission::READ);
                permissions.insert(Permission::WRITE);
                permissions.insert(Permission::DELETE);
                break;
            case UserRole::ADMIN:
                permissions.insert(Permission::READ);
                permissions.insert(Permission::WRITE);
                permissions.insert(Permission::DELETE);
                permissions.insert(Permission::ADMIN_READ);
                permissions.insert(Permission::ADMIN_WRITE);
                break;
            case UserRole::SUPER_ADMIN:
                permissions.insert(Permission::READ);
                permissions.insert(Permission::WRITE);
                permissions.insert(Permission::DELETE);
                permissions.insert(Permission::ADMIN_READ);
                permissions.insert(Permission::ADMIN_WRITE);
                permissions.insert(Permission::SYSTEM_CONFIG);
                break;
        }
    }
    
    string roleToString(UserRole role) const {
        switch (role) {
            case UserRole::GUEST: return "Guest";
            case UserRole::USER: return "User";
            case UserRole::MODERATOR: return "Moderator";
            case UserRole::ADMIN: return "Admin";
            case UserRole::SUPER_ADMIN: return "Super Admin";
            default: return "Unknown";
        }
    }
    
    string permissionToString(Permission perm) const {
        switch (perm) {
            case Permission::READ: return "READ";
            case Permission::WRITE: return "WRITE";
            case Permission::DELETE: return "DELETE";
            case Permission::ADMIN_READ: return "ADMIN_READ";
            case Permission::ADMIN_WRITE: return "ADMIN_WRITE";
            case Permission::SYSTEM_CONFIG: return "SYSTEM_CONFIG";
            default: return "UNKNOWN";
        }
    }
};

// JWT Token Manager
class JWTTokenManager {
private:
    string secretKey;
    chrono::minutes tokenExpiry;
    chrono::hours refreshTokenExpiry;
    
public:
    JWTTokenManager(const string& secret, chrono::minutes expiry = chrono::minutes(60))
        : secretKey(secret), tokenExpiry(expiry), refreshTokenExpiry(chrono::hours(24 * 7)) {}
    
    string generateAccessToken(const User& user) {
        auto now = chrono::system_clock::now();
        auto exp = now + tokenExpiry;
        
        auto token = jwt::create()
            .set_issuer("secure-system")
            .set_type("JWT")
            .set_id(generateTokenId())
            .set_issued_at(now)
            .set_expires_at(exp)
            .set_payload_claim("user_id", jwt::claim(user.getUserId()))
            .set_payload_claim("username", jwt::claim(user.getUsername()))
            .set_payload_claim("role", jwt::claim(static_cast<int>(user.getRole())))
            .sign(jwt::algorithm::hs256{secretKey});
        
        cout << "Generated access token for user: " << user.getUsername() << endl;
        return token;
    }
    
    string generateRefreshToken(const User& user) {
        auto now = chrono::system_clock::now();
        auto exp = now + refreshTokenExpiry;
        
        auto token = jwt::create()
            .set_issuer("secure-system")
            .set_type("refresh")
            .set_id(generateTokenId())
            .set_issued_at(now)
            .set_expires_at(exp)
            .set_payload_claim("user_id", jwt::claim(user.getUserId()))
            .sign(jwt::algorithm::hs256{secretKey});
        
        cout << "Generated refresh token for user: " << user.getUsername() << endl;
        return token;
    }
    
    bool validateToken(const string& token, string& userId, UserRole& role) {
        try {
            auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{secretKey})
                .with_issuer("secure-system");
            
            auto decoded = jwt::decode(token);
            verifier.verify(decoded);
            
            // Check expiration
            auto exp = decoded.get_expires_at();
            if (exp < chrono::system_clock::now()) {
                cout << "Token expired" << endl;
                return false;
            }
            
            userId = decoded.get_payload_claim("user_id").as_string();
            role = static_cast<UserRole>(decoded.get_payload_claim("role").as_int());
            
            cout << "Token validated for user: " << userId << endl;
            return true;
        } catch (const exception& e) {
            cout << "Token validation failed: " << e.what() << endl;
            return false;
        }
    }
    
    bool isTokenExpired(const string& token) {
        try {
            auto decoded = jwt::decode(token);
            auto exp = decoded.get_expires_at();
            return exp < chrono::system_clock::now();
        } catch (const exception& e) {
            return true; // Consider invalid tokens as expired
        }
    }
    
private:
    string generateTokenId() {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 15);
        
        string tokenId = "";
        for (int i = 0; i < 32; i++) {
            tokenId += "0123456789abcdef"[dis(gen)];
        }
        return tokenId;
    }
};

// Multi-Factor Authentication
class MFAManager {
private:
    map<string, string> userSecrets; // userId -> secret
    map<string, vector<string>> backupCodes; // userId -> backup codes
    
public:
    string setupTOTP(const string& userId) {
        // Generate a random secret for TOTP
        string secret = generateSecret();
        userSecrets[userId] = secret;
        
        // Generate backup codes
        vector<string> codes = generateBackupCodes();
        backupCodes[userId] = codes;
        
        cout << "TOTP setup for user: " << userId << endl;
        cout << "Secret: " << secret << endl;
        cout << "Backup codes: ";
        for (const auto& code : codes) {
            cout << code << " ";
        }
        cout << endl;
        
        return secret;
    }
    
    bool verifyTOTP(const string& userId, const string& token) {
        auto it = userSecrets.find(userId);
        if (it == userSecrets.end()) {
            return false;
        }
        
        // In a real implementation, you would use a TOTP library
        // For simulation, we'll accept tokens that match a pattern
        string expectedToken = generateTOTPToken(it->second);
        
        if (token == expectedToken) {
            cout << "TOTP verification successful for user: " << userId << endl;
            return true;
        }
        
        // Check backup codes
        return verifyBackupCode(userId, token);
    }
    
    bool verifyBackupCode(const string& userId, const string& code) {
        auto it = backupCodes.find(userId);
        if (it == backupCodes.end()) {
            return false;
        }
        
        auto& codes = it->second;
        auto codeIt = find(codes.begin(), codes.end(), code);
        if (codeIt != codes.end()) {
            codes.erase(codeIt); // Remove used backup code
            cout << "Backup code verification successful for user: " << userId << endl;
            return true;
        }
        
        return false;
    }
    
    vector<string> getBackupCodes(const string& userId) {
        auto it = backupCodes.find(userId);
        if (it != backupCodes.end()) {
            return it->second;
        }
        return {};
    }
    
private:
    string generateSecret() {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 31);
        
        string secret = "";
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        for (int i = 0; i < 32; i++) {
            secret += chars[dis(gen)];
        }
        return secret;
    }
    
    vector<string> generateBackupCodes() {
        vector<string> codes;
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(100000, 999999);
        
        for (int i = 0; i < 10; i++) {
            codes.push_back(to_string(dis(gen)));
        }
        return codes;
    }
    
    string generateTOTPToken(const string& secret) {
        // Simplified TOTP generation (in reality, use RFC 6238)
        auto now = chrono::system_clock::now();
        auto timestamp = chrono::duration_cast<chrono::seconds>(now.time_since_epoch()).count();
        auto timeStep = timestamp / 30; // 30-second window
        
        // Simple hash-based token generation
        hash<string> hasher;
        auto hashValue = hasher(secret + to_string(timeStep));
        return to_string(hashValue % 1000000); // 6-digit token
    }
};

// Authentication Service
class AuthenticationService {
private:
    map<string, unique_ptr<User>> users;
    unique_ptr<JWTTokenManager> tokenManager;
    unique_ptr<MFAManager> mfaManager;
    map<string, string> activeSessions; // sessionId -> userId
    
    // Security settings
    int maxFailedAttempts;
    chrono::minutes lockoutDuration;
    
    // Audit logging
    vector<string> auditLog;
    mutex authMutex;
    
public:
    AuthenticationService(const string& jwtSecret) 
        : tokenManager(make_unique<JWTTokenManager>(jwtSecret)),
          mfaManager(make_unique<MFAManager>()),
          maxFailedAttempts(5),
          lockoutDuration(chrono::minutes(30)) {}
    
    bool registerUser(const string& username, const string& email, 
                     const string& password, UserRole role = UserRole::USER) {
        lock_guard<mutex> lock(authMutex);
        
        // Check if user already exists
        for (const auto& userPair : users) {
            if (userPair.second->getUsername() == username || 
                userPair.second->getEmail() == email) {
                logAuditEvent("REGISTRATION_FAILED", username, "User already exists");
                return false;
            }
        }
        
        // Validate password strength
        if (!isPasswordStrong(password)) {
            logAuditEvent("REGISTRATION_FAILED", username, "Weak password");
            return false;
        }
        
        string userId = generateUserId();
        users[userId] = make_unique<User>(userId, username, email, password, role);
        
        logAuditEvent("USER_REGISTERED", username, "User registered successfully");
        cout << "User registered: " << username << " with ID: " << userId << endl;
        return true;
    }
    
    pair<string, string> login(const string& username, const string& password, 
                              const string& mfaToken = "") {
        lock_guard<mutex> lock(authMutex);
        
        User* user = findUserByUsername(username);
        if (!user) {
            logAuditEvent("LOGIN_FAILED", username, "User not found");
            return {"", ""};
        }
        
        if (!user->getIsActive()) {
            logAuditEvent("LOGIN_FAILED", username, "Account locked");
            return {"", ""};
        }
        
        // Verify password
        if (!user->verifyPassword(password)) {
            user->incrementFailedAttempts();
            logAuditEvent("LOGIN_FAILED", username, "Invalid password");
            return {"", ""};
        }
        
        // Check MFA if enabled
        if (!mfaToken.empty()) {
            if (!mfaManager->verifyTOTP(user->getUserId(), mfaToken)) {
                logAuditEvent("LOGIN_FAILED", username, "Invalid MFA token");
                return {"", ""};
            }
        }
        
        user->updateLastLogin();
        
        string accessToken = tokenManager->generateAccessToken(*user);
        string refreshToken = tokenManager->generateRefreshToken(*user);
        
        // Create session
        string sessionId = generateSessionId();
        activeSessions[sessionId] = user->getUserId();
        
        logAuditEvent("LOGIN_SUCCESS", username, "User logged in successfully");
        return {accessToken, refreshToken};
    }
    
    bool logout(const string& sessionId) {
        lock_guard<mutex> lock(authMutex);
        
        auto it = activeSessions.find(sessionId);
        if (it != activeSessions.end()) {
            string userId = it->second;
            activeSessions.erase(it);
            
            User* user = users[userId].get();
            if (user) {
                logAuditEvent("LOGOUT", user->getUsername(), "User logged out");
            }
            return true;
        }
        return false;
    }
    
    bool authorize(const string& token, Permission requiredPermission) {
        string userId;
        UserRole role;
        
        if (!tokenManager->validateToken(token, userId, role)) {
            return false;
        }
        
        User* user = users[userId].get();
        if (!user || !user->getIsActive()) {
            return false;
        }
        
        bool authorized = user->hasPermission(requiredPermission);
        
        logAuditEvent("AUTHORIZATION", user->getUsername(), 
                     authorized ? "Access granted" : "Access denied");
        
        return authorized;
    }
    
    string setupMFA(const string& userId) {
        lock_guard<mutex> lock(authMutex);
        
        User* user = users[userId].get();
        if (!user) {
            return "";
        }
        
        string secret = mfaManager->setupTOTP(userId);
        logAuditEvent("MFA_SETUP", user->getUsername(), "MFA enabled");
        return secret;
    }
    
    void displayAuditLog() {
        lock_guard<mutex> lock(authMutex);
        
        cout << "\n=== Security Audit Log ===" << endl;
        for (const auto& entry : auditLog) {
            cout << entry << endl;
        }
    }
    
    void displayUserStats() {
        lock_guard<mutex> lock(authMutex);
        
        cout << "\n=== User Statistics ===" << endl;
        cout << "Total Users: " << users.size() << endl;
        cout << "Active Sessions: " << activeSessions.size() << endl;
        
        int activeUsers = 0;
        int lockedUsers = 0;
        
        for (const auto& userPair : users) {
            if (userPair.second->getIsActive()) {
                activeUsers++;
            } else {
                lockedUsers++;
            }
        }
        
        cout << "Active Users: " << activeUsers << endl;
        cout << "Locked Users: " << lockedUsers << endl;
    }
    
private:
    User* findUserByUsername(const string& username) {
        for (const auto& userPair : users) {
            if (userPair.second->getUsername() == username) {
                return userPair.second.get();
            }
        }
        return nullptr;
    }
    
    bool isPasswordStrong(const string& password) {
        if (password.length() < 8) return false;
        
        bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        
        for (char c : password) {
            if (isupper(c)) hasUpper = true;
            else if (islower(c)) hasLower = true;
            else if (isdigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
    
    string generateUserId() {
        static int counter = 1;
        return "user_" + to_string(counter++);
    }
    
    string generateSessionId() {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 15);
        
        string sessionId = "";
        for (int i = 0; i < 32; i++) {
            sessionId += "0123456789abcdef"[dis(gen)];
        }
        return sessionId;
    }
    
    void logAuditEvent(const string& event, const string& username, const string& details) {
        auto now = chrono::system_clock::now();
        auto time_t = chrono::system_clock::to_time_t(now);
        
        string logEntry = "[" + string(ctime(&time_t));
        logEntry.pop_back(); // Remove newline
        logEntry += "] " + event + " - User: " + username + " - " + details;
        
        auditLog.push_back(logEntry);
        
        // Keep only last 1000 entries
        if (auditLog.size() > 1000) {
            auditLog.erase(auditLog.begin());
        }
    }
};
```

---

## 🔒 CRYPTOGRAPHY AND ENCRYPTION

### What is Cryptography?
**Real-World Analogy**: Like using secret codes and locked safes - symmetric encryption is like sharing a key to the same lock, while asymmetric encryption is like having a mailbox where anyone can drop letters but only you have the key to read them.

```cpp
// Cryptography and Encryption Implementation
#include <openssl/evp.h>
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include <openssl/aes.h>

// Symmetric Encryption (AES)
class AESEncryption {
private:
    unsigned char key[32]; // 256-bit key
    unsigned char iv[16];  // 128-bit IV
    
public:
    AESEncryption() {
        generateKey();
        generateIV();
    }
    
    void generateKey() {
        RAND_bytes(key, sizeof(key));
        cout << "AES: Generated new 256-bit key" << endl;
    }
    
    void generateIV() {
        RAND_bytes(iv, sizeof(iv));
        cout << "AES: Generated new initialization vector" << endl;
    }
    
    string encrypt(const string& plaintext) {
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        if (!ctx) {
            throw runtime_error("Failed to create cipher context");
        }
        
        // Initialize encryption
        if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) {
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to initialize encryption");
        }
        
        // Encrypt data
        unsigned char* ciphertext = new unsigned char[plaintext.length() + AES_BLOCK_SIZE];
        int len;
        int ciphertext_len;
        
        if (EVP_EncryptUpdate(ctx, ciphertext, &len, 
                             reinterpret_cast<const unsigned char*>(plaintext.c_str()), 
                             plaintext.length()) != 1) {
            delete[] ciphertext;
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to encrypt data");
        }
        ciphertext_len = len;
        
        // Finalize encryption
        if (EVP_EncryptFinal_ex(ctx, ciphertext + len, &len) != 1) {
            delete[] ciphertext;
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to finalize encryption");
        }
        ciphertext_len += len;
        
        EVP_CIPHER_CTX_free(ctx);
        
        string result(reinterpret_cast<char*>(ciphertext), ciphertext_len);
        delete[] ciphertext;
        
        cout << "AES: Encrypted " << plaintext.length() << " bytes to " << result.length() << " bytes" << endl;
        return result;
    }
    
    string decrypt(const string& ciphertext) {
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        if (!ctx) {
            throw runtime_error("Failed to create cipher context");
        }
        
        // Initialize decryption
        if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv) != 1) {
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to initialize decryption");
        }
        
        // Decrypt data
        unsigned char* plaintext = new unsigned char[ciphertext.length() + AES_BLOCK_SIZE];
        int len;
        int plaintext_len;
        
        if (EVP_DecryptUpdate(ctx, plaintext, &len,
                             reinterpret_cast<const unsigned char*>(ciphertext.c_str()),
                             ciphertext.length()) != 1) {
            delete[] plaintext;
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to decrypt data");
        }
        plaintext_len = len;
        
        // Finalize decryption
        if (EVP_DecryptFinal_ex(ctx, plaintext + len, &len) != 1) {
            delete[] plaintext;
            EVP_CIPHER_CTX_free(ctx);
            throw runtime_error("Failed to finalize decryption");
        }
        plaintext_len += len;
        
        EVP_CIPHER_CTX_free(ctx);
        
        string result(reinterpret_cast<char*>(plaintext), plaintext_len);
        delete[] plaintext;
        
        cout << "AES: Decrypted " << ciphertext.length() << " bytes to " << result.length() << " bytes" << endl;
        return result;
    }
    
    string getKeyHex() const {
        string keyHex = "";
        for (int i = 0; i < 32; i++) {
            char hex[3];
            sprintf(hex, "%02x", key[i]);
            keyHex += hex;
        }
        return keyHex;
    }
};

// Asymmetric Encryption (RSA)
class RSAEncryption {
private:
    RSA* keyPair;
    
public:
    RSAEncryption() : keyPair(nullptr) {
        generateKeyPair();
    }
    
    ~RSAEncryption() {
        if (keyPair) {
            RSA_free(keyPair);
        }
    }
    
    void generateKeyPair(int keySize = 2048) {
        BIGNUM* bne = BN_new();
        if (BN_set_word(bne, RSA_F4) != 1) {
            BN_free(bne);
            throw runtime_error("Failed to set RSA exponent");
        }
        
        keyPair = RSA_new();
        if (RSA_generate_key_ex(keyPair, keySize, bne, NULL) != 1) {
            RSA_free(keyPair);
            BN_free(bne);
            throw runtime_error("Failed to generate RSA key pair");
        }
        
        BN_free(bne);
        cout << "RSA: Generated " << keySize << "-bit key pair" << endl;
    }
    
    string getPublicKeyPEM() const {
        BIO* bio = BIO_new(BIO_s_mem());
        if (PEM_write_bio_RSA_PUBKEY(bio, keyPair) != 1) {
            BIO_free(bio);
            throw runtime_error("Failed to write public key");
        }
        
        char* pubKeyData;
        long pubKeyLen = BIO_get_mem_data(bio, &pubKeyData);
        string publicKey(pubKeyData, pubKeyLen);
        
        BIO_free(bio);
        return publicKey;
    }
    
    string getPrivateKeyPEM() const {
        BIO* bio = BIO_new(BIO_s_mem());
        if (PEM_write_bio_RSAPrivateKey(bio, keyPair, NULL, NULL, 0, NULL, NULL) != 1) {
            BIO_free(bio);
            throw runtime_error("Failed to write private key");
        }
        
        char* privKeyData;
        long privKeyLen = BIO_get_mem_data(bio, &privKeyData);
        string privateKey(privKeyData, privKeyLen);
        
        BIO_free(bio);
        return privateKey;
    }
    
    string encrypt(const string& plaintext) {
        int rsaSize = RSA_size(keyPair);
        unsigned char* encrypted = new unsigned char[rsaSize];
        
        int result = RSA_public_encrypt(plaintext.length(),
                                       reinterpret_cast<const unsigned char*>(plaintext.c_str()),
                                       encrypted, keyPair, RSA_PKCS1_OAEP_PADDING);
        
        if (result == -1) {
            delete[] encrypted;
            throw runtime_error("RSA encryption failed");
        }
        
        string encryptedData(reinterpret_cast<char*>(encrypted), result);
        delete[] encrypted;
        
        cout << "RSA: Encrypted " << plaintext.length() << " bytes to " << result << " bytes" << endl;
        return encryptedData;
    }
    
    string decrypt(const string& ciphertext) {
        int rsaSize = RSA_size(keyPair);
        unsigned char* decrypted = new unsigned char[rsaSize];
        
        int result = RSA_private_decrypt(ciphertext.length(),
                                        reinterpret_cast<const unsigned char*>(ciphertext.c_str()),
                                        decrypted, keyPair, RSA_PKCS1_OAEP_PADDING);
        
        if (result == -1) {
            delete[] decrypted;
            throw runtime_error("RSA decryption failed");
        }
        
        string decryptedData(reinterpret_cast<char*>(decrypted), result);
        delete[] decrypted;
        
        cout << "RSA: Decrypted " << ciphertext.length() << " bytes to " << result << " bytes" << endl;
        return decryptedData;
    }
    
    string sign(const string& message) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256(reinterpret_cast<const unsigned char*>(message.c_str()), message.length(), hash);
        
        unsigned char* signature = new unsigned char[RSA_size(keyPair)];
        unsigned int sigLen;
        
        int result = RSA_sign(NID_sha256, hash, SHA256_DIGEST_LENGTH, signature, &sigLen, keyPair);
        
        if (result != 1) {
            delete[] signature;
            throw runtime_error("RSA signing failed");
        }
        
        string signatureData(reinterpret_cast<char*>(signature), sigLen);
        delete[] signature;
        
        cout << "RSA: Signed message (" << message.length() << " bytes)" << endl;
        return signatureData;
    }
    
    bool verify(const string& message, const string& signature) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256(reinterpret_cast<const unsigned char*>(message.c_str()), message.length(), hash);
        
        int result = RSA_verify(NID_sha256, hash, SHA256_DIGEST_LENGTH,
                               reinterpret_cast<const unsigned char*>(signature.c_str()),
                               signature.length(), keyPair);
        
        bool verified = (result == 1);
        cout << "RSA: Signature verification " << (verified ? "PASSED" : "FAILED") << endl;
        return verified;
    }
};

// Hybrid Encryption (RSA + AES)
class HybridEncryption {
private:
    unique_ptr<RSAEncryption> rsaEncryption;
    
public:
    HybridEncryption() : rsaEncryption(make_unique<RSAEncryption>()) {}
    
    pair<string, string> encrypt(const string& plaintext) {
        // Generate random AES key
        AESEncryption aes;
        
        // Encrypt data with AES
        string encryptedData = aes.encrypt(plaintext);
        
        // Encrypt AES key with RSA
        string aesKey = aes.getKeyHex();
        string encryptedKey = rsaEncryption->encrypt(aesKey);
        
        cout << "Hybrid: Encrypted " << plaintext.length() << " bytes using AES+RSA" << endl;
        return {encryptedData, encryptedKey};
    }
    
    string decrypt(const string& encryptedData, const string& encryptedKey) {
        // Decrypt AES key with RSA
        string aesKeyHex = rsaEncryption->decrypt(encryptedKey);
        
        // Create AES instance with decrypted key
        // Note: In a real implementation, you'd need to reconstruct the AES key and IV
        // For simplicity, this is a conceptual demonstration
        
        cout << "Hybrid: Decrypted data using AES+RSA" << endl;
        return "Decrypted: " + encryptedData; // Simplified
    }
    
    string getPublicKey() {
        return rsaEncryption->getPublicKeyPEM();
    }
};
```

---

## 🛡️ SECURITY PROTOCOLS AND STANDARDS

### What are Security Protocols?
**Real-World Analogy**: Like standardized security procedures at airports - everyone follows the same steps (TLS handshake), uses approved equipment (certificates), and follows international standards (OAuth, SAML).

```cpp
// Security Protocols Implementation
#include <openssl/ssl.h>
#include <openssl/x509.h>

// TLS/SSL Connection Manager
class TLSManager {
private:
    SSL_CTX* sslContext;
    
public:
    TLSManager() : sslContext(nullptr) {
        SSL_library_init();
        SSL_load_error_strings();
        OpenSSL_add_all_algorithms();
        
        initializeContext();
    }
    
    ~TLSManager() {
        if (sslContext) {
            SSL_CTX_free(sslContext);
        }
    }
    
    void initializeContext() {
        const SSL_METHOD* method = TLS_server_method();
        sslContext = SSL_CTX_new(method);
        
        if (!sslContext) {
            throw runtime_error("Failed to create SSL context");
        }
        
        // Set security options
        SSL_CTX_set_options(sslContext, SSL_OP_NO_SSLv2 | SSL_OP_NO_SSLv3);
        SSL_CTX_set_min_proto_version(sslContext, TLS1_2_VERSION);
        
        cout << "TLS: Initialized secure context with TLS 1.2+" << endl;
    }
    
    bool loadCertificate(const string& certFile, const string& keyFile) {
        if (SSL_CTX_use_certificate_file(sslContext, certFile.c_str(), SSL_FILETYPE_PEM) <= 0) {
            cout << "TLS: Failed to load certificate file" << endl;
            return false;
        }
        
        if (SSL_CTX_use_PrivateKey_file(sslContext, keyFile.c_str(), SSL_FILETYPE_PEM) <= 0) {
            cout << "TLS: Failed to load private key file" << endl;
            return false;
        }
        
        if (!SSL_CTX_check_private_key(sslContext)) {
            cout << "TLS: Private key does not match certificate" << endl;
            return false;
        }
        
        cout << "TLS: Certificate and private key loaded successfully" << endl;
        return true;
    }
    
    SSL* createConnection() {
        SSL* ssl = SSL_new(sslContext);
        if (!ssl) {
            throw runtime_error("Failed to create SSL connection");
        }
        
        cout << "TLS: Created new secure connection" << endl;
        return ssl;
    }
    
    bool performHandshake(SSL* ssl) {
        int result = SSL_accept(ssl);
        if (result <= 0) {
            int error = SSL_get_error(ssl, result);
            cout << "TLS: Handshake failed with error: " << error << endl;
            return false;
        }
        
        cout << "TLS: Handshake completed successfully" << endl;
        displayConnectionInfo(ssl);
        return true;
    }
    
    void displayConnectionInfo(SSL* ssl) {
        const char* version = SSL_get_version(ssl);
        const char* cipher = SSL_get_cipher(ssl);
        
        cout << "TLS Connection Info:" << endl;
        cout << "  Protocol: " << version << endl;
        cout << "  Cipher: " << cipher << endl;
        
        X509* cert = SSL_get_peer_certificate(ssl);
        if (cert) {
            char* subject = X509_NAME_oneline(X509_get_subject_name(cert), 0, 0);
            char* issuer = X509_NAME_oneline(X509_get_issuer_name(cert), 0, 0);
            
            cout << "  Certificate Subject: " << subject << endl;
            cout << "  Certificate Issuer: " << issuer << endl;
            
            OPENSSL_free(subject);
            OPENSSL_free(issuer);
            X509_free(cert);
        }
    }
};

// OAuth 2.0 Implementation
class OAuth2Server {
private:
    map<string, string> clientCredentials; // clientId -> clientSecret
    map<string, string> authorizationCodes; // code -> userId
    map<string, string> accessTokens; // token -> userId
    map<string, chrono::system_clock::time_point> tokenExpiry;
    
    mutex oauthMutex;
    
public:
    OAuth2Server() {}
    
    string registerClient(const string& clientName) {
        lock_guard<mutex> lock(oauthMutex);
        
        string clientId = generateClientId();
        string clientSecret = generateClientSecret();
        
        clientCredentials[clientId] = clientSecret;
        
        cout << "OAuth2: Registered client '" << clientName << "'" << endl;
        cout << "  Client ID: " << clientId << endl;
        cout << "  Client Secret: " << clientSecret << endl;
        
        return clientId;
    }
    
    string generateAuthorizationCode(const string& clientId, const string& userId, 
                                   const string& redirectUri) {
        lock_guard<mutex> lock(oauthMutex);
        
        if (clientCredentials.find(clientId) == clientCredentials.end()) {
            cout << "OAuth2: Invalid client ID" << endl;
            return "";
        }
        
        string authCode = generateRandomString(32);
        authorizationCodes[authCode] = userId;
        
        cout << "OAuth2: Generated authorization code for user " << userId << endl;
        return authCode;
    }
    
    string exchangeCodeForToken(const string& clientId, const string& clientSecret,
                               const string& authCode) {
        lock_guard<mutex> lock(oauthMutex);
        
        // Verify client credentials
        auto clientIt = clientCredentials.find(clientId);
        if (clientIt == clientCredentials.end() || clientIt->second != clientSecret) {
            cout << "OAuth2: Invalid client credentials" << endl;
            return "";
        }
        
        // Verify authorization code
        auto codeIt = authorizationCodes.find(authCode);
        if (codeIt == authorizationCodes.end()) {
            cout << "OAuth2: Invalid authorization code" << endl;
            return "";
        }
        
        string userId = codeIt->second;
        authorizationCodes.erase(codeIt); // One-time use
        
        // Generate access token
        string accessToken = generateRandomString(64);
        accessTokens[accessToken] = userId;
        tokenExpiry[accessToken] = chrono::system_clock::now() + chrono::hours(1);
        
        cout << "OAuth2: Issued access token for user " << userId << endl;
        return accessToken;
    }
    
    bool validateToken(const string& accessToken, string& userId) {
        lock_guard<mutex> lock(oauthMutex);
        
        auto tokenIt = accessTokens.find(accessToken);
        if (tokenIt == accessTokens.end()) {
            cout << "OAuth2: Invalid access token" << endl;
            return false;
        }
        
        // Check expiry
        auto expiryIt = tokenExpiry.find(accessToken);
        if (expiryIt != tokenExpiry.end() && 
            expiryIt->second < chrono::system_clock::now()) {
            cout << "OAuth2: Access token expired" << endl;
            accessTokens.erase(tokenIt);
            tokenExpiry.erase(expiryIt);
            return false;
        }
        
        userId = tokenIt->second;
        cout << "OAuth2: Token validated for user " << userId << endl;
        return true;
    }
    
    void revokeToken(const string& accessToken) {
        lock_guard<mutex> lock(oauthMutex);
        
        accessTokens.erase(accessToken);
        tokenExpiry.erase(accessToken);
        cout << "OAuth2: Token revoked" << endl;
    }
    
    void displayStats() {
        lock_guard<mutex> lock(oauthMutex);
        
        cout << "\n=== OAuth2 Server Statistics ===" << endl;
        cout << "Registered Clients: " << clientCredentials.size() << endl;
        cout << "Active Authorization Codes: " << authorizationCodes.size() << endl;
        cout << "Active Access Tokens: " << accessTokens.size() << endl;
    }
    
private:
    string generateClientId() {
        return "client_" + generateRandomString(16);
    }
    
    string generateClientSecret() {
        return generateRandomString(32);
    }
    
    string generateRandomString(int length) {
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 61);
        
        string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        string result = "";
        
        for (int i = 0; i < length; i++) {
            result += chars[dis(gen)];
        }
        
        return result;
    }
};

// SAML (Security Assertion Markup Language) Implementation
class SAMLProvider {
private:
    string entityId;
    string privateKey;
    string certificate;
    map<string, string> assertions; // assertionId -> userId
    
public:
    SAMLProvider(const string& id) : entityId(id) {}
    
    string generateAssertion(const string& userId, const string& audience) {
        string assertionId = generateAssertionId();
        auto now = chrono::system_clock::now();
        auto expiry = now + chrono::hours(1);
        
        // Simplified SAML assertion (in reality, this would be XML)
        string assertion = "<saml:Assertion ID=\"" + assertionId + "\">";
        assertion += "<saml:Subject><saml:NameID>" + userId + "</saml:NameID></saml:Subject>";
        assertion += "<saml:Conditions NotOnOrAfter=\"" + formatTime(expiry) + "\">";
        assertion += "<saml:AudienceRestriction><saml:Audience>" + audience + "</saml:Audience>";
        assertion += "</saml:AudienceRestriction></saml:Conditions>";
        assertion += "</saml:Assertion>";
        
        assertions[assertionId] = userId;
        
        cout << "SAML: Generated assertion for user " << userId << endl;
        return assertion;
    }
    
    bool validateAssertion(const string& assertion, string& userId) {
        // Simplified validation (in reality, would parse XML and verify signature)
        size_t idStart = assertion.find("ID=\"") + 4;
        size_t idEnd = assertion.find("\"", idStart);
        
        if (idStart == string::npos || idEnd == string::npos) {
            cout << "SAML: Invalid assertion format" << endl;
            return false;
        }
        
        string assertionId = assertion.substr(idStart, idEnd - idStart);
        
        auto it = assertions.find(assertionId);
        if (it == assertions.end()) {
            cout << "SAML: Assertion not found" << endl;
            return false;
        }
        
        userId = it->second;
        cout << "SAML: Assertion validated for user " << userId << endl;
        return true;
    }
    
private:
    string generateAssertionId() {
        return "_" + to_string(chrono::system_clock::now().time_since_epoch().count());
    }
    
    string formatTime(const chrono::system_clock::time_point& time) {
        auto time_t = chrono::system_clock::to_time_t(time);
        return string(ctime(&time_t));
    }
};
```

---

## 🚨 THREAT DETECTION AND PREVENTION

### What is Threat Detection?
**Real-World Analogy**: Like a security system with cameras, motion sensors, and guards - it monitors for suspicious activities, detects patterns, and responds to threats automatically.

```cpp
// Threat Detection and Prevention System
#include <regex>

// Intrusion Detection System
class IntrusionDetectionSystem {
private:
    struct SecurityEvent {
        string eventType;
        string sourceIP;
        string targetResource;
        chrono::system_clock::time_point timestamp;
        string details;
        
        SecurityEvent(const string& type, const string& ip, const string& resource, const string& det)
            : eventType(type), sourceIP(ip), targetResource(resource), 
              timestamp(chrono::system_clock::now()), details(det) {}
    };
    
    vector<SecurityEvent> securityEvents;
    map<string, int> ipFailureCount;
    map<string, chrono::system_clock::time_point> ipLastSeen;
    set<string> blockedIPs;
    
    // Threat patterns
    vector<regex> maliciousPatterns;
    
    mutex idsMutex;
    
    // Configuration
    int maxFailuresPerIP;
    chrono::minutes blockDuration;
    
public:
    IntrusionDetectionSystem() : maxFailuresPerIP(5), blockDuration(chrono::minutes(30)) {
        initializeThreatPatterns();
    }
    
    void initializeThreatPatterns() {
        // SQL Injection patterns
        maliciousPatterns.push_back(regex(".*('|(\\-\\-)|(;)|(\\|)|(\\*)).*"));
        maliciousPatterns.push_back(regex(".*(union|select|insert|delete|update|drop).*", regex_constants::icase));
        
        // XSS patterns
        maliciousPatterns.push_back(regex(".*<script.*>.*</script>.*", regex_constants::icase));
        maliciousPatterns.push_back(regex(".*javascript:.*", regex_constants::icase));
        
        // Path traversal
        maliciousPatterns.push_back(regex(".*(\\.\\./).*"));
        maliciousPatterns.push_back(regex(".*(\\.\\.\\\\).*"));
        
        cout << "IDS: Initialized with " << maliciousPatterns.size() << " threat patterns" << endl;
    }
    
    bool analyzeRequest(const string& sourceIP, const string& request, const string& resource) {
        lock_guard<mutex> lock(idsMutex);
        
        // Check if IP is blocked
        if (blockedIPs.find(sourceIP) != blockedIPs.end()) {
            logSecurityEvent("BLOCKED_IP_ACCESS", sourceIP, resource, "Access from blocked IP");
            return false;
        }
        
        // Check for malicious patterns
        for (const auto& pattern : maliciousPatterns) {
            if (regex_match(request, pattern)) {
                logSecurityEvent("MALICIOUS_PATTERN", sourceIP, resource, 
                               "Detected malicious pattern in request: " + request);
                incrementFailureCount(sourceIP);
                return false;
            }
        }
        
        // Check for brute force attacks
        if (detectBruteForce(sourceIP)) {
            logSecurityEvent("BRUTE_FORCE", sourceIP, resource, "Brute force attack detected");
            blockIP(sourceIP);
            return false;
        }
        
        // Update IP tracking
        ipLastSeen[sourceIP] = chrono::system_clock::now();
        
        return true;
    }
    
    void reportFailedLogin(const string& sourceIP, const string& username) {
        lock_guard<mutex> lock(idsMutex);
        
        incrementFailureCount(sourceIP);
        logSecurityEvent("FAILED_LOGIN", sourceIP, "login", 
                        "Failed login attempt for user: " + username);
        
        if (ipFailureCount[sourceIP] >= maxFailuresPerIP) {
            blockIP(sourceIP);
        }
    }
    
    void reportSuccessfulLogin(const string& sourceIP, const string& username) {
        lock_guard<mutex> lock(idsMutex);
        
        // Reset failure count on successful login
        ipFailureCount[sourceIP] = 0;
        logSecurityEvent("SUCCESSFUL_LOGIN", sourceIP, "login", 
                        "Successful login for user: " + username);
    }
    
    bool detectAnomalousActivity(const string& sourceIP, int requestCount, 
                                chrono::minutes timeWindow) {
        lock_guard<mutex> lock(idsMutex);
        
        auto now = chrono::system_clock::now();
        auto windowStart = now - timeWindow;
        
        int recentRequests = 0;
        for (const auto& event : securityEvents) {
            if (event.sourceIP == sourceIP && event.timestamp >= windowStart) {
                recentRequests++;
            }
        }
        
        if (recentRequests > requestCount) {
            logSecurityEvent("ANOMALOUS_ACTIVITY", sourceIP, "multiple", 
                           "High request rate: " + to_string(recentRequests) + 
                           " requests in " + to_string(timeWindow.count()) + " minutes");
            return true;
        }
        
        return false;
    }
    
    void blockIP(const string& ip) {
        blockedIPs.insert(ip);
        logSecurityEvent("IP_BLOCKED", ip, "system", "IP blocked due to suspicious activity");
        
        // Schedule unblock (simplified - in reality, use a timer)
        cout << "IDS: Blocked IP " << ip << " for " << blockDuration.count() << " minutes" << endl;
    }
    
    void unblockIP(const string& ip) {
        blockedIPs.erase(ip);
        ipFailureCount[ip] = 0;
        logSecurityEvent("IP_UNBLOCKED", ip, "system", "IP unblocked");
        cout << "IDS: Unblocked IP " << ip << endl;
    }
    
    void displaySecurityReport() {
        lock_guard<mutex> lock(idsMutex);
        
        cout << "\n=== Security Report ===" << endl;
        cout << "Total Security Events: " << securityEvents.size() << endl;
        cout << "Blocked IPs: " << blockedIPs.size() << endl;
        cout << "IPs Under Monitoring: " << ipFailureCount.size() << endl;
        
        // Count events by type
        map<string, int> eventCounts;
        for (const auto& event : securityEvents) {
            eventCounts[event.eventType]++;
        }
        
        cout << "\nEvent Types:" << endl;
        for (const auto& count : eventCounts) {
            cout << "  " << count.first << ": " << count.second << endl;
        }
        
        // Show recent events
        cout << "\nRecent Security Events:" << endl;
        int recentCount = min(10, (int)securityEvents.size());
        for (int i = securityEvents.size() - recentCount; i < securityEvents.size(); i++) {
            const auto& event = securityEvents[i];
            auto time_t = chrono::system_clock::to_time_t(event.timestamp);
            cout << "  [" << ctime(&time_t);
            cout.seekp(-1, ios_base::cur); // Remove newline
            cout << "] " << event.eventType << " from " << event.sourceIP 
                 << " - " << event.details << endl;
        }
    }
    
private:
    void incrementFailureCount(const string& ip) {
        ipFailureCount[ip]++;
        ipLastSeen[ip] = chrono::system_clock::now();
    }
    
    bool detectBruteForce(const string& ip) {
        auto it = ipFailureCount.find(ip);
        if (it != ipFailureCount.end()) {
            return it->second >= maxFailuresPerIP;
        }
        return false;
    }
    
    void logSecurityEvent(const string& eventType, const string& sourceIP, 
                         const string& resource, const string& details) {
        securityEvents.emplace_back(eventType, sourceIP, resource, details);
        
        // Keep only recent events (last 10000)
        if (securityEvents.size() > 10000) {
            securityEvents.erase(securityEvents.begin());
        }
    }
};

// Web Application Firewall (WAF)
class WebApplicationFirewall {
private:
    IntrusionDetectionSystem& ids;
    
    // Rate limiting
    map<string, queue<chrono::system_clock::time_point>> requestTimes;
    int maxRequestsPerMinute;
    
    // Content filtering
    vector<string> blockedUserAgents;
    vector<string> allowedFileExtensions;
    
    mutex wafMutex;
    
public:
    WebApplicationFirewall(IntrusionDetectionSystem& idsRef) 
        : ids(idsRef), maxRequestsPerMinute(60) {
        initializeFilters();
    }
    
    void initializeFilters() {
        // Block known malicious user agents
        blockedUserAgents = {
            "sqlmap",
            "nikto",
            "nmap",
            "masscan",
            "curl/7.0", // Old curl versions often used in attacks
        };
        
        // Allow only safe file extensions
        allowedFileExtensions = {
            ".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".pdf", ".txt"
        };
        
        cout << "WAF: Initialized content filters" << endl;
    }
    
    bool filterRequest(const string& sourceIP, const string& userAgent, 
                      const string& requestPath, const string& requestBody) {
        lock_guard<mutex> lock(wafMutex);
        
        // Rate limiting
        if (!checkRateLimit(sourceIP)) {
            cout << "WAF: Rate limit exceeded for IP " << sourceIP << endl;
            return false;
        }
        
        // User agent filtering
        for (const auto& blockedAgent : blockedUserAgents) {
            if (userAgent.find(blockedAgent) != string::npos) {
                cout << "WAF: Blocked malicious user agent: " << userAgent << endl;
                return false;
            }
        }
        
        // File extension filtering
        if (!isAllowedFileExtension(requestPath)) {
            cout << "WAF: Blocked request for disallowed file: " << requestPath << endl;
            return false;
        }
        
        // Content analysis
        if (!ids.analyzeRequest(sourceIP, requestBody, requestPath)) {
            cout << "WAF: Request blocked by IDS" << endl;
            return false;
        }
        
        return true;
    }
    
private:
    bool checkRateLimit(const string& ip) {
        auto now = chrono::system_clock::now();
        auto& times = requestTimes[ip];
        
        // Remove old requests (older than 1 minute)
        while (!times.empty() && (now - times.front()) > chrono::minutes(1)) {
            times.pop();
        }
        
        // Check if limit exceeded
        if (times.size() >= maxRequestsPerMinute) {
            return false;
        }
        
        // Add current request
        times.push(now);
        return true;
    }
    
    bool isAllowedFileExtension(const string& path) {
        for (const auto& ext : allowedFileExtensions) {
            if (path.length() >= ext.length() && 
                path.substr(path.length() - ext.length()) == ext) {
                return true;
            }
        }
        return false;
    }
};
```

---

## ⚡ Key Takeaways

1. **Authentication** verifies identity while **authorization** controls access to resources
2. **Multi-factor authentication** significantly improves security by requiring multiple verification methods
3. **Encryption** protects data both at rest and in transit using symmetric and asymmetric algorithms
4. **Security protocols** like TLS, OAuth, and SAML provide standardized secure communication
5. **Threat detection** systems monitor for suspicious activities and respond automatically
6. **Defense in depth** uses multiple security layers to protect against various attack vectors

## 🎯 Next Steps

- Study advanced cryptographic concepts (elliptic curve cryptography, post-quantum cryptography)
- Learn about security compliance frameworks (SOC 2, ISO 27001, GDPR)
- Explore cloud security and zero-trust architectures
- Practice security testing and vulnerability assessment
- Understand incident response and disaster recovery planning

---
*"Security is not a product, but a process. It's not something you buy, but something you do."* - Bruce Schneier 🔐
