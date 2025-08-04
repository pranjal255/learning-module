# Database Fundamentals 🗄️

## 🌟 Real-World Story: The Great Library of Alexandria

Imagine you're the head librarian of the modern Library of Alexandria, managing millions of books, scrolls, and documents. You need different storage systems:

**Ancient Scrolls** (like relational data):
- **Organized in strict categories** (History, Science, Literature)
- **Cross-referenced** (Author → Books → Subjects)
- **Structured format** (Title, Author, Date, Subject)
- **ACID properties** (Accurate, Consistent, Isolated, Durable)

**Modern Documents** (like NoSQL data):
- **Flexible organization** (JSON documents, key-value pairs)
- **Rapid scaling** (add new wings instantly)
- **Various formats** (text, images, videos, audio)
- **Distributed storage** (copies in multiple locations)

**Quick Reference Cards** (like caching):
- **Instant access** to most popular information
- **Temporary storage** (updated regularly)
- **High-speed retrieval** (no searching required)

**Data Warehouse** (like analytics):
- **Historical archives** for research and analysis
- **Aggregated information** (trends, patterns, insights)
- **Complex queries** across vast datasets

**Databases work exactly the same way!** Different types of data need different storage and retrieval systems.

## 🎯 What are Databases?

Databases are like **specialized storage and retrieval systems** for digital information. Just like a library needs different systems for different types of materials, applications need different database types for different data requirements.

### 📚 **File Storage vs Database Systems**

| File Storage | Database Systems |
|-------------|------------------|
| 📁 **Files scattered everywhere** | 🗄️ **Organized, structured storage** |
| 🔍 **Manual searching** | ⚡ **Instant queries and indexing** |
| 😰 **No data integrity** | ✅ **ACID properties and constraints** |
| 🤷 **No relationships** | 🔗 **Complex relationships and joins** |
| 💥 **Concurrent access issues** | 🔒 **Transaction management** |

## 📊 Visual Representation: Database Ecosystem

```
🗄️ DATABASE ECOSYSTEM

📊 RELATIONAL DATABASES (SQL)
├── 🏢 PostgreSQL (Enterprise-grade)
├── 🐬 MySQL (Web applications)
├── 🔷 SQLite (Embedded/mobile)
└── 🏛️ Oracle (Enterprise systems)

📄 DOCUMENT DATABASES (NoSQL)
├── 🍃 MongoDB (JSON documents)
├── 🔥 CouchDB (Distributed documents)
└── 📋 Amazon DocumentDB (Managed)

🔑 KEY-VALUE STORES
├── ⚡ Redis (In-memory cache)
├── 🚀 DynamoDB (Serverless)
└── 📦 Riak (Distributed)

📈 COLUMN-FAMILY
├── 📊 Cassandra (Big data)
├── 🏗️ HBase (Hadoop ecosystem)
└── ☁️ BigTable (Google Cloud)

🕸️ GRAPH DATABASES
├── 🔗 Neo4j (Social networks)
├── 🌐 Amazon Neptune (Managed)
└── 📊 ArangoDB (Multi-model)

🏭 DATA WAREHOUSES
├── ❄️ Snowflake (Cloud-native)
├── 📊 BigQuery (Google)
└── 🔺 Redshift (Amazon)
```

## 💡 Core Database Concepts

### **ACID Properties** 🧪
ACID ensures database reliability, like library rules ensuring book integrity:

**Atomicity** = **All or Nothing** ⚛️
```sql
-- Like checking out multiple books together
-- Either all books are checked out, or none are

BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Both updates succeed, or both fail
```

**Consistency** = **Rules Always Followed** ⚖️
```sql
-- Like library rules: "Books must have valid ISBN"
-- Database rules: "Account balance cannot be negative"

ALTER TABLE accounts ADD CONSTRAINT positive_balance 
CHECK (balance >= 0);

-- This will fail if it violates the rule
UPDATE accounts SET balance = -50 WHERE id = 1; -- ERROR!
```

**Isolation** = **No Interference** 🔒
```sql
-- Like private study rooms
-- Multiple people can work simultaneously without interfering

-- Transaction 1 (reading account balance)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1; -- Sees consistent data
-- ... other operations ...
COMMIT;

-- Transaction 2 (updating same account) runs separately
-- No interference between transactions
```

**Durability** = **Permanent Storage** 💾
```sql
-- Like books being permanently catalogued
-- Once committed, data survives system crashes

COMMIT; -- Data is now permanently saved
-- Even if power goes out, this data is safe
```

### **Database Normalization** 📐
Normalization is like organizing library efficiently to avoid duplication:

**Unnormalized (Bad)** ❌
```sql
-- Like writing author info on every book
CREATE TABLE books_bad (
    id INT,
    title VARCHAR(100),
    author_name VARCHAR(50),
    author_email VARCHAR(50),
    author_birth_date DATE,
    genre VARCHAR(30)
);

-- Problems:
-- 1. Author info repeated for each book
-- 2. Update author email = update multiple rows
-- 3. Waste of storage space
```

**Normalized (Good)** ✅
```sql
-- Like having separate author catalog
CREATE TABLE authors (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    birth_date DATE
);

CREATE TABLE books (
    id INT PRIMARY KEY,
    title VARCHAR(100),
    author_id INT,
    genre VARCHAR(30),
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- Benefits:
-- 1. Author info stored once
-- 2. Update author email = update one row
-- 3. Efficient storage
```

### **Indexes** 📇
Indexes are like library card catalogs for fast searching:

```sql
-- Without index: like searching every book manually
SELECT * FROM books WHERE title = 'Harry Potter';
-- Database scans ALL books (slow)

-- Create index: like creating a title catalog
CREATE INDEX idx_books_title ON books(title);

-- With index: like using card catalog
SELECT * FROM books WHERE title = 'Harry Potter';
-- Database uses index (fast!)

-- Composite index: like multi-field catalog
CREATE INDEX idx_books_author_genre ON books(author_id, genre);

-- Perfect for queries like:
SELECT * FROM books WHERE author_id = 5 AND genre = 'Fantasy';
```

## 🔧 SQL Database Deep Dive

### **Essential SQL Commands** 📝

**Data Definition Language (DDL)** 🏗️
```sql
-- Create database (like building new library wing)
CREATE DATABASE bookstore;

-- Create table (like setting up new section)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modify table (like renovating section)
ALTER TABLE customers ADD COLUMN phone VARCHAR(20);
ALTER TABLE customers DROP COLUMN phone;

-- Delete table (like removing section)
DROP TABLE customers;
```

**Data Manipulation Language (DML)** 📊
```sql
-- Insert data (like adding new books)
INSERT INTO customers (name, email) 
VALUES ('John Doe', 'john@example.com');

-- Insert multiple records
INSERT INTO customers (name, email) VALUES 
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

-- Update data (like updating book information)
UPDATE customers 
SET email = 'newemail@example.com' 
WHERE id = 1;

-- Delete data (like removing books)
DELETE FROM customers WHERE id = 1;
```

**Data Query Language (DQL)** 🔍
```sql
-- Basic queries (like searching catalog)
SELECT * FROM customers;
SELECT name, email FROM customers;
SELECT * FROM customers WHERE name LIKE 'John%';

-- Sorting and limiting
SELECT * FROM customers ORDER BY name ASC;
SELECT * FROM customers LIMIT 10;

-- Aggregation (like counting books by genre)
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) as total_customers FROM customers;

-- Grouping
SELECT genre, COUNT(*) as book_count 
FROM books 
GROUP BY genre;
```

**Advanced Queries** 🎓
```sql
-- Joins (like connecting author and book catalogs)
SELECT b.title, a.name as author_name
FROM books b
JOIN authors a ON b.author_id = a.id;

-- Left join (include books without authors)
SELECT b.title, a.name as author_name
FROM books b
LEFT JOIN authors a ON b.author_id = a.id;

-- Subqueries (like nested searches)
SELECT * FROM books 
WHERE author_id IN (
    SELECT id FROM authors 
    WHERE birth_date > '1950-01-01'
);

-- Window functions (like running totals)
SELECT 
    title,
    price,
    SUM(price) OVER (ORDER BY id) as running_total
FROM books;
```

## 🎮 Practice Exercise: Build Complete Database System

Let's create a comprehensive e-commerce database!

### Step 1: Database Design 📐

```sql
-- Create database
CREATE DATABASE ecommerce;
USE ecommerce;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    sku VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_sku (sku),
    INDEX idx_products_price (price)
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_date (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
);

-- Shopping cart table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Step 2: Sample Data 📊

```sql
-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Books', 'Physical and digital books'),
('Clothing', 'Apparel and accessories'),
('Home & Garden', 'Home improvement and gardening supplies');

INSERT INTO categories (name, description, parent_id) VALUES
('Smartphones', 'Mobile phones and accessories', 1),
('Laptops', 'Portable computers', 1),
('Fiction', 'Fiction books', 2),
('Non-Fiction', 'Educational and reference books', 2);

-- Insert users
INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
('john_doe', 'john@example.com', 'hashed_password_1', 'John', 'Doe'),
('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane', 'Smith'),
('bob_wilson', 'bob@example.com', 'hashed_password_3', 'Bob', 'Wilson');

-- Insert products
INSERT INTO products (name, description, price, stock_quantity, category_id, sku) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone', 999.99, 50, 5, 'IPHONE15PRO'),
('MacBook Air M2', 'Apple laptop with M2 chip', 1199.99, 25, 6, 'MACBOOKAIRM2'),
('The Great Gatsby', 'Classic American novel', 12.99, 100, 7, 'GATSBY001'),
('Clean Code', 'Programming best practices', 45.99, 75, 8, 'CLEANCODE001'),
('Wireless Headphones', 'Bluetooth noise-cancelling headphones', 199.99, 30, 1, 'HEADPHONES001');

-- Insert orders
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(1, 1012.98, 'delivered', '123 Main St, City, State 12345'),
(2, 245.98, 'shipped', '456 Oak Ave, Town, State 67890'),
(3, 999.99, 'processing', '789 Pine Rd, Village, State 54321');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 3, 1, 12.99),    -- The Great Gatsby
(1, 1, 1, 999.99),   -- iPhone 15 Pro
(2, 4, 1, 45.99),    -- Clean Code
(2, 5, 1, 199.99),   -- Wireless Headphones
(3, 1, 1, 999.99);   -- iPhone 15 Pro

-- Insert cart items
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(1, 2, 1),  -- MacBook Air in John's cart
(2, 3, 2),  -- 2 copies of The Great Gatsby in Jane's cart
(3, 5, 1);  -- Wireless Headphones in Bob's cart
```

### Step 3: Complex Queries 🔍

```sql
-- 1. Get user's order history with product details
SELECT 
    u.username,
    o.id as order_id,
    o.total_amount,
    o.status,
    o.created_at as order_date,
    p.name as product_name,
    oi.quantity,
    oi.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE u.username = 'john_doe'
ORDER BY o.created_at DESC;

-- 2. Get top-selling products
SELECT 
    p.name,
    p.price,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.price) as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('shipped', 'delivered')
GROUP BY p.id, p.name, p.price
ORDER BY total_sold DESC
LIMIT 5;

-- 3. Get category sales report
SELECT 
    c.name as category,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.quantity) as items_sold,
    SUM(oi.quantity * oi.price) as revenue
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('shipped', 'delivered')
GROUP BY c.id, c.name
ORDER BY revenue DESC;

-- 4. Get users with items in cart but no recent orders
SELECT 
    u.username,
    u.email,
    COUNT(ci.id) as cart_items,
    MAX(ci.updated_at) as last_cart_activity
FROM users u
JOIN cart_items ci ON u.id = ci.user_id
LEFT JOIN orders o ON u.id = o.user_id AND o.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE o.id IS NULL
GROUP BY u.id, u.username, u.email
HAVING cart_items > 0;

-- 5. Get low stock products
SELECT 
    p.name,
    p.sku,
    p.stock_quantity,
    c.name as category,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        WHEN p.stock_quantity < 10 THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity < 20 AND p.is_active = TRUE
ORDER BY p.stock_quantity ASC;
```

### Step 4: Database Optimization 🚀

```sql
-- Create additional indexes for performance
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
CREATE INDEX idx_products_category_price ON products(category_id, price);
CREATE INDEX idx_order_items_product_order ON order_items(product_id, order_id);

-- Create view for order summaries
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.username,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id, u.username, o.total_amount, o.status, o.created_at;

-- Create stored procedure for placing orders
DELIMITER //
CREATE PROCEDURE PlaceOrder(
    IN p_user_id INT,
    IN p_shipping_address TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_total_amount DECIMAL(10,2) DEFAULT 0;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Calculate total amount from cart
    SELECT SUM(ci.quantity * p.price) INTO v_total_amount
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id;
    
    -- Create order
    INSERT INTO orders (user_id, total_amount, shipping_address)
    VALUES (p_user_id, v_total_amount, p_shipping_address);
    
    SET v_order_id = LAST_INSERT_ID();
    
    -- Move cart items to order items
    INSERT INTO order_items (order_id, product_id, quantity, price)
    SELECT v_order_id, ci.product_id, ci.quantity, p.price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id;
    
    -- Update product stock
    UPDATE products p
    JOIN cart_items ci ON p.id = ci.product_id
    SET p.stock_quantity = p.stock_quantity - ci.quantity
    WHERE ci.user_id = p_user_id;
    
    -- Clear cart
    DELETE FROM cart_items WHERE user_id = p_user_id;
    
    -- Commit transaction
    COMMIT;
    
    SELECT v_order_id as order_id;
END //
DELIMITER ;
```

## 🚀 NoSQL Database Overview

### **Document Databases (MongoDB)** 📄

```javascript
// MongoDB - like flexible filing system
// Store complex, nested data as documents

// Insert user document
db.users.insertOne({
    _id: ObjectId(),
    username: "john_doe",
    email: "john@example.com",
    profile: {
        firstName: "John",
        lastName: "Doe",
        age: 30,
        address: {
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345"
        }
    },
    preferences: {
        notifications: true,
        theme: "dark",
        language: "en"
    },
    orders: [
        {
            orderId: "ORD001",
            date: new Date(),
            total: 99.99,
            items: [
                { product: "Widget", quantity: 2, price: 49.99 }
            ]
        }
    ],
    createdAt: new Date()
});

// Query documents
db.users.find({ "profile.age": { $gte: 25 } });
db.users.find({ "preferences.theme": "dark" });

// Update nested fields
db.users.updateOne(
    { username: "john_doe" },
    { $set: { "preferences.theme": "light" } }
);

// Add to array
db.users.updateOne(
    { username: "john_doe" },
    { $push: { 
        orders: {
            orderId: "ORD002",
            date: new Date(),
            total: 149.99
        }
    }}
);
```

### **Key-Value Stores (Redis)** 🔑

```bash
# Redis - like super-fast lookup table
# Perfect for caching and session storage

# Simple key-value
SET user:1001:name "John Doe"
GET user:1001:name

# Hash for structured data
HSET user:1001 name "John Doe" email "john@example.com" age 30
HGET user:1001 name
HGETALL user:1001

# Lists for queues
LPUSH task_queue "process_order_123"
LPUSH task_queue "send_email_456"
RPOP task_queue  # Get oldest task

# Sets for unique collections
SADD user:1001:interests "programming" "music" "travel"
SISMEMBER user:1001:interests "programming"  # Check membership

# Sorted sets for rankings
ZADD leaderboard 1500 "player1"
ZADD leaderboard 2000 "player2"
ZREVRANGE leaderboard 0 9  # Top 10 players
```

### **Graph Databases (Neo4j)** 🕸️

```cypher
// Neo4j - like social network mapping
// Perfect for relationships and connections

// Create nodes
CREATE (john:Person {name: 'John Doe', age: 30})
CREATE (jane:Person {name: 'Jane Smith', age: 28})
CREATE (company:Company {name: 'Tech Corp'})
CREATE (skill:Skill {name: 'Python'})

// Create relationships
CREATE (john)-[:WORKS_FOR {since: '2020-01-01'}]->(company)
CREATE (jane)-[:WORKS_FOR {since: '2019-06-15'}]->(company)
CREATE (john)-[:KNOWS {since: '2018-03-10'}]->(jane)
CREATE (john)-[:HAS_SKILL {level: 'Expert'}]->(skill)

// Query relationships
MATCH (p:Person)-[:WORKS_FOR]->(c:Company)
WHERE c.name = 'Tech Corp'
RETURN p.name, p.age

// Find friends of friends
MATCH (john:Person {name: 'John Doe'})-[:KNOWS]->(friend)-[:KNOWS]->(fof)
WHERE fof <> john
RETURN DISTINCT fof.name

// Shortest path between people
MATCH path = shortestPath((john:Person {name: 'John Doe'})-[*]-(target:Person {name: 'Target Person'}))
RETURN path
```

## 🔧 Database Best Practices

### **Performance Optimization** ⚡

```sql
-- 1. Use appropriate indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- 2. Optimize queries
-- Bad: SELECT * (retrieves unnecessary data)
SELECT * FROM products WHERE category_id = 1;

-- Good: SELECT specific columns
SELECT id, name, price FROM products WHERE category_id = 1;

-- 3. Use LIMIT for large datasets
SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;

-- 4. Use EXISTS instead of IN for subqueries
-- Bad:
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- Good:
SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### **Security Best Practices** 🔒

```sql
-- 1. Use parameterized queries (prevent SQL injection)
-- Bad (vulnerable to SQL injection):
-- query = "SELECT * FROM users WHERE email = '" + userInput + "'"

-- Good (parameterized):
-- query = "SELECT * FROM users WHERE email = ?"
-- execute(query, [userInput])

-- 2. Principle of least privilege
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON ecommerce.* TO 'app_user'@'localhost';
-- Don't grant DELETE or DROP unless necessary

-- 3. Encrypt sensitive data
ALTER TABLE users ADD COLUMN encrypted_ssn VARBINARY(255);
-- Store encrypted values, not plain text

-- 4. Regular backups
-- Automated daily backups
mysqldump --single-transaction --routines --triggers ecommerce > backup_$(date +%Y%m%d).sql
```

### **Backup and Recovery** 💾

```bash
# MySQL backup strategies
# 1. Full backup (daily)
mysqldump --single-transaction --routines --triggers --all-databases > full_backup.sql

# 2. Incremental backup (hourly)
mysqlbinlog --start-datetime="2024-01-01 12:00:00" mysql-bin.000001 > incremental.sql

# 3. Point-in-time recovery
mysql < full_backup.sql
mysql < incremental.sql

# PostgreSQL backup
pg_dump -h localhost -U postgres ecommerce > ecommerce_backup.sql

# MongoDB backup
mongodump --db ecommerce --out /backup/mongodb/

# Redis backup
redis-cli BGSAVE  # Creates dump.rdb file
```

## 🎯 Choosing the Right Database

### **Decision Matrix** 📊

| Use Case | Best Database Type | Examples |
|----------|-------------------|----------|
| **E-commerce, Banking** | Relational (SQL) | PostgreSQL, MySQL |
| **Content Management** | Document (NoSQL) | MongoDB, CouchDB |
| **Caching, Sessions** | Key-Value | Redis, Memcached |
| **Social Networks** | Graph | Neo4j, Amazon Neptune |
| **Analytics, Reporting** | Column-Family | Cassandra, BigQuery |
| **Time Series Data** | Specialized | InfluxDB, TimescaleDB |

### **Scalability Patterns** 📈

```sql
-- Vertical Scaling (Scale Up)
-- Upgrade hardware: more CPU, RAM, faster disks
-- Pros: Simple, no code changes
-- Cons: Limited, expensive, single point of failure

-- Horizontal Scaling (Scale Out)
-- 1. Read Replicas
CREATE REPLICA read_replica_1 FROM master_db;
-- Route read queries to replicas, writes to master

-- 2. Sharding (partition data)
-- Shard by user ID
-- Users 1-1000: Shard 1
-- Users 1001-2000: Shard 2
-- Users 2001-3000: Shard 3

-- 3. Federation (split by feature)
-- User database: user profiles, authentication
-- Order database: orders, payments
-- Product database: catalog, inventory
```

## 🎯 What's Next?

Now that you understand database fundamentals, let's explore more advanced topics:

1. **[Advanced Database Topics](22_Advanced_Database_Topics.md)** - Replication, sharding, and optimization
2. **[Data Modeling](23_Data_Modeling.md)** - Designing efficient database schemas
3. **[Monitoring Fundamentals](../07_Monitoring_and_Observability/23_Monitoring_Fundamentals.md)** - Database monitoring and performance

## 💡 Remember

Databases are like specialized libraries - each type excels at different tasks. SQL databases are perfect for structured, relational data with ACID requirements. NoSQL databases excel at flexibility, scalability, and specific use cases. Choose based on your data patterns, consistency requirements, and scalability needs.

**Key Takeaway:** There's no "one size fits all" database solution. Modern applications often use multiple database types (polyglot persistence) to optimize for different data patterns and requirements!

---

*"Data is the new oil, but databases are the refineries that make it useful."* - Anonymous 🗄️
