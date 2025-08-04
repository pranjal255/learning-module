# Redis and Caching 🚀

## 🌟 Real-World Story: The Library System

Imagine you're managing a huge library with millions of books. Every day, thousands of people ask for books:

**Without a Cache (Traditional Library):**
- Every request requires walking to the storage warehouse
- Popular books like "Harry Potter" are requested 100 times daily
- Each time, librarian walks 10 minutes to warehouse and back
- Total time wasted: 100 × 20 minutes = 33 hours daily!

**With a Cache (Smart Library):**
- Keep 100 most popular books at the front desk
- "Harry Potter" requests: grab from front desk (30 seconds)
- Only go to warehouse for rare books
- Total time saved: 32+ hours daily!

**Redis is exactly like that front desk cache for your applications!**

## 🎯 What is Redis?

Redis (Remote Dictionary Server) is like a **super-fast front desk** for your data. It's an in-memory data store that keeps frequently accessed information readily available.

### ⚡ **Database vs Cache vs Redis**

| Traditional Database | Cache | Redis |
|---------------------|-------|-------|
| 🏢 **Warehouse** (slow but permanent) | 📋 **Front desk** (fast but temporary) | 🚀 **Smart front desk** (fast + features) |
| Stores everything permanently | Stores popular items temporarily | In-memory + persistence options |
| Slow disk-based access | Fast memory access | Lightning-fast memory access |
| Complex queries | Simple key-value | Rich data structures |

## 📊 Visual Representation: Caching Architecture

```
🌐 TYPICAL WEB APPLICATION WITH REDIS

👤 USER REQUEST
    |
    | "Get user profile for ID 123"
    |
🌐 WEB SERVER
    |
    | 1. Check cache first
    |
⚡ REDIS CACHE
    |
    |-- 🎯 CACHE HIT (data found)
    |   |-- Return data instantly (1ms)
    |
    |-- ❌ CACHE MISS (data not found)
        |
        | 2. Query database
        |
💾 DATABASE (PostgreSQL/MySQL)
    |
    | 3. Store result in cache for next time
    |
⚡ REDIS CACHE
    |
    | 4. Return data to user
    |
👤 USER RECEIVES DATA
```

## 💡 Core Caching Concepts

### **Cache Hit vs Cache Miss** 🎯

**Cache Hit** = Finding the book at the front desk ✅
```bash
# User requests data
GET user:123

# Redis has it cached
"{"name": "John", "email": "john@example.com"}"

# Response time: 1-2ms (super fast!)
```

**Cache Miss** = Need to go to the warehouse ❌
```bash
# User requests data
GET user:999

# Redis doesn't have it
(nil)

# Must query database (slow)
# Then cache the result for next time
```

### **Cache Strategies** 📋

**1. Cache-Aside (Lazy Loading)** 🦥
```python
# Like checking front desk first, then warehouse if needed
def get_user(user_id):
    # Check cache first
    user = redis.get(f"user:{user_id}")
    
    if user:  # Cache hit
        return json.loads(user)
    
    # Cache miss - get from database
    user = database.get_user(user_id)
    
    # Store in cache for next time
    redis.setex(f"user:{user_id}", 3600, json.dumps(user))
    
    return user
```

**2. Write-Through** ✍️
```python
# Like updating both front desk and warehouse simultaneously
def update_user(user_id, data):
    # Update database first
    database.update_user(user_id, data)
    
    # Update cache immediately
    redis.setex(f"user:{user_id}", 3600, json.dumps(data))
```

**3. Write-Behind (Write-Back)** 📝
```python
# Like updating front desk immediately, warehouse later
def update_user(user_id, data):
    # Update cache immediately
    redis.setex(f"user:{user_id}", 3600, json.dumps(data))
    
    # Mark for database update (async)
    redis.lpush("write_queue", f"user:{user_id}")
```

## 🔧 Essential Redis Commands

### **Basic Key-Value Operations** 🗝️

```bash
# Set a value (like putting a book on front desk)
SET user:123 "John Doe"
SET user:123 "John Doe" EX 3600  # Expires in 1 hour

# Get a value (like checking front desk)
GET user:123
# Output: "John Doe"

# Check if key exists (like asking "do you have this book?")
EXISTS user:123
# Output: 1 (yes) or 0 (no)

# Delete a key (like removing book from front desk)
DEL user:123

# Set expiration (like "remove this book after 1 hour")
EXPIRE user:123 3600
TTL user:123  # Check time remaining
```

### **String Operations** 📝

```bash
# Increment/decrement (like counting visitors)
SET page_views 100
INCR page_views        # Now 101
INCRBY page_views 5    # Now 106
DECR page_views        # Now 105

# Append to string
SET message "Hello"
APPEND message " World"
GET message  # "Hello World"

# Get string length
STRLEN message  # 11
```

### **Hash Operations** 📚
Hashes are like **index cards** with multiple fields:

```bash
# Set hash fields (like filling out a user card)
HSET user:123 name "John Doe"
HSET user:123 email "john@example.com"
HSET user:123 age 30

# Or set multiple fields at once
HMSET user:123 name "John Doe" email "john@example.com" age 30

# Get specific field (like reading one line from card)
HGET user:123 name
# Output: "John Doe"

# Get all fields (like reading entire card)
HGETALL user:123
# Output: 1) "name" 2) "John Doe" 3) "email" 4) "john@example.com" 5) "age" 6) "30"

# Check if field exists
HEXISTS user:123 phone  # 0 (no)

# Delete field
HDEL user:123 age
```

### **List Operations** 📋
Lists are like **to-do lists** or **queues**:

```bash
# Add to list (like adding tasks to to-do list)
LPUSH tasks "Send email"      # Add to beginning
RPUSH tasks "Call client"     # Add to end

# Get from list (like checking tasks)
LRANGE tasks 0 -1  # Get all items
LRANGE tasks 0 2   # Get first 3 items

# Remove from list (like completing tasks)
LPOP tasks   # Remove from beginning
RPOP tasks   # Remove from end

# List length
LLEN tasks

# Use as queue (FIFO - First In, First Out)
RPUSH queue "job1"
RPUSH queue "job2"
LPOP queue  # Gets "job1"

# Use as stack (LIFO - Last In, First Out)
LPUSH stack "item1"
LPUSH stack "item2"
LPOP stack  # Gets "item2"
```

### **Set Operations** 🎯
Sets are like **unique collections** (no duplicates):

```bash
# Add to set (like adding unique visitors)
SADD visitors "user123"
SADD visitors "user456"
SADD visitors "user123"  # Duplicate ignored

# Check membership (like "has this user visited?")
SISMEMBER visitors "user123"  # 1 (yes)

# Get all members
SMEMBERS visitors

# Set operations (like comparing visitor lists)
SADD monday_visitors "user1" "user2" "user3"
SADD tuesday_visitors "user2" "user3" "user4"

SINTER monday_visitors tuesday_visitors    # Common visitors: user2, user3
SUNION monday_visitors tuesday_visitors    # All visitors: user1, user2, user3, user4
SDIFF monday_visitors tuesday_visitors     # Only Monday: user1
```

### **Sorted Set Operations** 🏆
Sorted sets are like **leaderboards**:

```bash
# Add with scores (like game leaderboard)
ZADD leaderboard 1000 "player1"
ZADD leaderboard 1500 "player2"
ZADD leaderboard 800 "player3"

# Get top players (highest scores)
ZREVRANGE leaderboard 0 2 WITHSCORES
# Output: 1) "player2" 2) "1500" 3) "player1" 4) "1000" 5) "player3" 6) "800"

# Get player rank
ZREVRANK leaderboard "player1"  # 1 (second place)

# Get score
ZSCORE leaderboard "player1"    # 1000

# Get players in score range
ZRANGEBYSCORE leaderboard 900 1200  # Players with scores 900-1200
```

## 🎮 Practice Exercise: Building a Web Cache

Let's build a real caching system for a blog application!

### Step 1: Install and Start Redis 🚀

```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Output: PONG

# Or run Redis in Docker
docker run -d --name redis -p 6379:6379 redis:alpine
```

### Step 2: Basic Blog Cache (Python Example) 📝

```python
import redis
import json
import time

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

class BlogCache:
    def __init__(self):
        self.cache_ttl = 3600  # 1 hour
    
    def get_post(self, post_id):
        """Get blog post with caching"""
        cache_key = f"post:{post_id}"
        
        # Check cache first
        cached_post = r.get(cache_key)
        if cached_post:
            print(f"Cache HIT for post {post_id}")
            return json.loads(cached_post)
        
        print(f"Cache MISS for post {post_id}")
        
        # Simulate database query (slow)
        post = self.fetch_from_database(post_id)
        
        # Cache the result
        r.setex(cache_key, self.cache_ttl, json.dumps(post))
        
        return post
    
    def fetch_from_database(self, post_id):
        """Simulate slow database query"""
        time.sleep(0.1)  # Simulate 100ms database query
        return {
            "id": post_id,
            "title": f"Blog Post {post_id}",
            "content": "This is the content of the blog post...",
            "author": "John Doe",
            "created_at": "2024-01-01T10:00:00Z"
        }
    
    def update_post(self, post_id, data):
        """Update post and invalidate cache"""
        # Update database (simulated)
        print(f"Updating post {post_id} in database")
        
        # Invalidate cache
        cache_key = f"post:{post_id}"
        r.delete(cache_key)
        print(f"Cache invalidated for post {post_id}")

# Test the cache
blog = BlogCache()

# First request (cache miss)
start = time.time()
post = blog.get_post(123)
print(f"First request took: {time.time() - start:.3f}s")

# Second request (cache hit)
start = time.time()
post = blog.get_post(123)
print(f"Second request took: {time.time() - start:.3f}s")
```

### Step 3: Session Management 👤

```python
import uuid

class SessionManager:
    def __init__(self):
        self.session_ttl = 1800  # 30 minutes
    
    def create_session(self, user_id):
        """Create new user session"""
        session_id = str(uuid.uuid4())
        session_data = {
            "user_id": user_id,
            "created_at": time.time(),
            "last_activity": time.time()
        }
        
        # Store session in Redis
        r.setex(f"session:{session_id}", self.session_ttl, json.dumps(session_data))
        
        return session_id
    
    def get_session(self, session_id):
        """Get session data"""
        session_data = r.get(f"session:{session_id}")
        if session_data:
            return json.loads(session_data)
        return None
    
    def update_activity(self, session_id):
        """Update last activity time"""
        session_data = self.get_session(session_id)
        if session_data:
            session_data["last_activity"] = time.time()
            r.setex(f"session:{session_id}", self.session_ttl, json.dumps(session_data))
    
    def destroy_session(self, session_id):
        """Logout user"""
        r.delete(f"session:{session_id}")

# Test session management
session_mgr = SessionManager()

# User login
session_id = session_mgr.create_session(user_id=456)
print(f"Created session: {session_id}")

# Check session
session = session_mgr.get_session(session_id)
print(f"Session data: {session}")

# User logout
session_mgr.destroy_session(session_id)
```

### Step 4: Rate Limiting 🚦

```python
class RateLimiter:
    def __init__(self):
        self.window_size = 60  # 1 minute window
        self.max_requests = 100  # 100 requests per minute
    
    def is_allowed(self, user_id):
        """Check if user is within rate limit"""
        key = f"rate_limit:{user_id}"
        current_time = int(time.time())
        
        # Use sliding window with sorted sets
        # Remove old entries
        r.zremrangebyscore(key, 0, current_time - self.window_size)
        
        # Count current requests
        current_requests = r.zcard(key)
        
        if current_requests >= self.max_requests:
            return False
        
        # Add current request
        r.zadd(key, {str(current_time): current_time})
        r.expire(key, self.window_size)
        
        return True

# Test rate limiting
rate_limiter = RateLimiter()

# Simulate requests
for i in range(105):
    if rate_limiter.is_allowed("user123"):
        print(f"Request {i+1}: Allowed")
    else:
        print(f"Request {i+1}: Rate limited!")
        break
```

## 🚀 Real-World Redis Use Cases

### **1. Web Application Caching** 🌐

```python
# Cache expensive database queries
def get_user_dashboard(user_id):
    cache_key = f"dashboard:{user_id}"
    
    # Check cache
    dashboard = r.get(cache_key)
    if dashboard:
        return json.loads(dashboard)
    
    # Build dashboard (expensive operation)
    dashboard = {
        "user": get_user_profile(user_id),
        "recent_orders": get_recent_orders(user_id),
        "recommendations": get_recommendations(user_id),
        "notifications": get_notifications(user_id)
    }
    
    # Cache for 10 minutes
    r.setex(cache_key, 600, json.dumps(dashboard))
    return dashboard
```

### **2. Real-Time Analytics** 📊

```python
# Track page views
def track_page_view(page_url, user_id=None):
    today = time.strftime("%Y-%m-%d")
    
    # Increment total page views
    r.incr(f"page_views:{page_url}:{today}")
    
    # Track unique visitors
    if user_id:
        r.sadd(f"unique_visitors:{page_url}:{today}", user_id)
    
    # Track hourly stats
    hour = time.strftime("%Y-%m-%d:%H")
    r.incr(f"hourly_views:{page_url}:{hour}")

def get_page_stats(page_url):
    today = time.strftime("%Y-%m-%d")
    
    return {
        "total_views": int(r.get(f"page_views:{page_url}:{today}") or 0),
        "unique_visitors": r.scard(f"unique_visitors:{page_url}:{today}"),
        "hourly_breakdown": get_hourly_stats(page_url)
    }
```

### **3. Message Queue** 📨

```python
# Simple job queue
class JobQueue:
    def __init__(self, queue_name):
        self.queue_name = queue_name
    
    def add_job(self, job_data):
        """Add job to queue"""
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "data": job_data,
            "created_at": time.time()
        }
        r.lpush(self.queue_name, json.dumps(job))
        return job_id
    
    def get_job(self, timeout=10):
        """Get job from queue (blocking)"""
        result = r.brpop(self.queue_name, timeout=timeout)
        if result:
            return json.loads(result[1])
        return None

# Email queue example
email_queue = JobQueue("email_queue")

# Producer (web app)
email_queue.add_job({
    "to": "user@example.com",
    "subject": "Welcome!",
    "body": "Thanks for signing up!"
})

# Consumer (background worker)
while True:
    job = email_queue.get_job()
    if job:
        print(f"Sending email: {job}")
        # Process email...
```

### **4. Leaderboards** 🏆

```python
class GameLeaderboard:
    def __init__(self, game_id):
        self.leaderboard_key = f"leaderboard:{game_id}"
    
    def update_score(self, player_id, score):
        """Update player score"""
        r.zadd(self.leaderboard_key, {player_id: score})
    
    def get_top_players(self, count=10):
        """Get top N players"""
        return r.zrevrange(self.leaderboard_key, 0, count-1, withscores=True)
    
    def get_player_rank(self, player_id):
        """Get player's rank (1-based)"""
        rank = r.zrevrank(self.leaderboard_key, player_id)
        return rank + 1 if rank is not None else None
    
    def get_players_around(self, player_id, count=5):
        """Get players around specific player"""
        rank = r.zrevrank(self.leaderboard_key, player_id)
        if rank is None:
            return []
        
        start = max(0, rank - count//2)
        end = start + count - 1
        
        return r.zrevrange(self.leaderboard_key, start, end, withscores=True)

# Game leaderboard example
leaderboard = GameLeaderboard("puzzle_game")

# Update scores
leaderboard.update_score("player1", 1500)
leaderboard.update_score("player2", 2000)
leaderboard.update_score("player3", 1200)

# Get rankings
print("Top 3 players:", leaderboard.get_top_players(3))
print("Player1 rank:", leaderboard.get_player_rank("player1"))
```

## 🔧 Redis Configuration and Optimization

### **Memory Management** 💾

```bash
# Check memory usage
redis-cli info memory

# Set memory limit (in redis.conf)
maxmemory 2gb

# Set eviction policy
maxmemory-policy allkeys-lru  # Remove least recently used keys

# Available policies:
# - noeviction: Don't evict, return errors
# - allkeys-lru: Remove least recently used keys
# - allkeys-lfu: Remove least frequently used keys
# - volatile-lru: Remove LRU keys with expire set
# - volatile-lfu: Remove LFU keys with expire set
# - allkeys-random: Remove random keys
# - volatile-random: Remove random keys with expire set
# - volatile-ttl: Remove keys with shortest TTL
```

### **Persistence Options** 💿

```bash
# RDB Snapshots (redis.conf)
save 900 1      # Save if at least 1 key changed in 900 seconds
save 300 10     # Save if at least 10 keys changed in 300 seconds
save 60 10000   # Save if at least 10000 keys changed in 60 seconds

# AOF (Append Only File)
appendonly yes
appendfsync everysec  # Sync every second (good balance)
# appendfsync always  # Sync every write (slow but safe)
# appendfsync no      # Let OS decide (fast but risky)
```

### **Security** 🔒

```bash
# Set password (redis.conf)
requirepass your_strong_password

# Bind to specific interfaces
bind 127.0.0.1 192.168.1.100

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_abc123"
```

## 📊 Monitoring Redis

### **Key Metrics to Watch** 📈

```bash
# Memory usage
redis-cli info memory | grep used_memory_human

# Connected clients
redis-cli info clients

# Operations per second
redis-cli info stats | grep instantaneous_ops_per_sec

# Hit rate
redis-cli info stats | grep keyspace_hits
redis-cli info stats | grep keyspace_misses

# Slow queries
redis-cli slowlog get 10
```

### **Redis Monitoring Script** 🔍

```python
import redis
import time

def monitor_redis():
    r = redis.Redis(host='localhost', port=6379, db=0)
    
    while True:
        info = r.info()
        
        # Memory usage
        memory_used = info['used_memory_human']
        memory_peak = info['used_memory_peak_human']
        
        # Operations
        ops_per_sec = info['instantaneous_ops_per_sec']
        
        # Hit rate
        hits = info['keyspace_hits']
        misses = info['keyspace_misses']
        hit_rate = hits / (hits + misses) * 100 if (hits + misses) > 0 else 0
        
        # Connected clients
        clients = info['connected_clients']
        
        print(f"Memory: {memory_used} (Peak: {memory_peak})")
        print(f"Ops/sec: {ops_per_sec}")
        print(f"Hit rate: {hit_rate:.2f}%")
        print(f"Clients: {clients}")
        print("-" * 40)
        
        time.sleep(5)

# Run monitoring
monitor_redis()
```

## 🎯 What's Next?

Now that you understand Redis and caching, let's explore more infrastructure topics:

1. **[Database Fundamentals](20_Database_Fundamentals.md)** - Understanding different database types
2. **[Kubernetes Fundamentals](../03_Orchestration/08_Kubernetes_Fundamentals.md)** - Orchestrating containers
3. **[Monitoring Fundamentals](../07_Monitoring_and_Observability/23_Monitoring_Fundamentals.md)** - Keeping systems healthy

## 💡 Remember

Redis is like having a super-smart assistant who remembers everything important and can find it instantly. Use it to speed up your applications, but remember that it's memory-based, so use it wisely for frequently accessed data.

**Key Takeaway:** Caching is not just about speed - it's about reducing load on your databases and improving user experience!

---

*"There are only two hard things in Computer Science: cache invalidation and naming things."* - Phil Karlton 🚀
