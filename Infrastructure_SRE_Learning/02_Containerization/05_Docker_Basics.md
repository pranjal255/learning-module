# Docker Basics 🐳

## 🌟 Real-World Story: Shipping Containers

Imagine you're running a global shipping company in the 1950s. Every cargo ship carried different types of goods:
- **Loose cargo** (bags of coffee, barrels of oil, boxes of electronics)
- **Different loading methods** for each type of cargo
- **Different ships** needed different loading equipment
- **Delays and damage** were common during transfers

Then someone invented **standardized shipping containers**:
- **Same size and shape** for all containers
- **Any cargo** can fit inside (properly packaged)
- **Any ship, truck, or crane** can handle them
- **Fast, safe transfers** between different transport methods

**Docker containers work exactly the same way for software!** Instead of shipping physical goods, we're shipping applications.

## 🎯 What is Docker?

Docker is like a **standardized shipping container system** for applications. It packages your application and everything it needs to run into a portable container that can run anywhere.

### 📦 **Traditional Deployment vs Docker**

| Traditional Deployment | Docker Containers |
|----------------------|-------------------|
| 🏠 **"It works on my machine"** | 🚢 **"It works everywhere"** |
| Different environments cause issues | Consistent environment everywhere |
| Complex setup and dependencies | Simple, portable packages |
| Hard to scale and manage | Easy to scale and orchestrate |

## 📊 Visual Representation: Docker Architecture

```
🐳 DOCKER ARCHITECTURE

💻 YOUR COMPUTER
    |
    |-- 🐳 Docker Engine (like shipping port)
    |
    |-- 📦 Container 1 (Web App)
    |   |-- 🌐 Nginx
    |   |-- 📁 App files
    |   |-- 🔧 Dependencies
    |
    |-- 📦 Container 2 (Database)
    |   |-- 💾 PostgreSQL
    |   |-- 📊 Data files
    |   |-- ⚙️ Config files
    |
    |-- 📦 Container 3 (Cache)
        |-- ⚡ Redis
        |-- 🗄️ Memory store
        |-- 📋 Settings
```

## 💡 Core Docker Concepts

### **Images vs Containers** 📸
Think of Docker images and containers like **blueprints and houses**:

**Docker Image** = **Blueprint** 📋
- Like architectural plans for a house
- Template that defines what goes in the container
- Read-only and immutable
- Can be shared and reused

**Docker Container** = **Actual House** 🏠
- Built from the blueprint (image)
- Running instance where your app lives
- Can be started, stopped, and deleted
- Multiple containers can be built from one image

```bash
# Think of it this way:
# Image = Recipe for chocolate cake
# Container = Actual chocolate cake you baked

# List available images (recipes)
docker images

# List running containers (baked cakes)
docker ps

# List all containers (including stopped ones)
docker ps -a
```

### **Dockerfile** 📝
A Dockerfile is like a **recipe** that tells Docker how to build your image:

```dockerfile
# Simple web app Dockerfile
FROM node:16                    # Start with Node.js (like "start with flour")
WORKDIR /app                    # Set working directory (like "use mixing bowl")
COPY package*.json ./           # Copy recipe list (like "add ingredients list")
RUN npm install                 # Install dependencies (like "mix ingredients")
COPY . .                        # Copy app code (like "add main ingredients")
EXPOSE 3000                     # Tell which port to use (like "bake at 350°F")
CMD ["npm", "start"]            # How to start app (like "bake for 30 minutes")
```

**Real-World Analogy:**
- `FROM` = "Start with pre-made cake mix"
- `COPY` = "Add your special ingredients"
- `RUN` = "Mix everything together"
- `CMD` = "Bake in the oven"

### **Docker Hub** 🌐
Docker Hub is like a **global recipe library**:

```bash
# Search for images (like browsing recipes)
docker search nginx
docker search postgres

# Download an image (like downloading a recipe)
docker pull nginx
docker pull postgres:13

# Popular base images:
# - nginx (web server)
# - node (JavaScript runtime)
# - python (Python runtime)
# - postgres (database)
# - redis (cache)
```

## 🔧 Essential Docker Commands

### **Basic Container Operations** 🏃‍♂️

```bash
# Run a container (like baking a cake from recipe)
docker run hello-world          # Simple test
docker run -d nginx             # Run nginx in background (-d = detached)
docker run -it ubuntu bash      # Interactive mode (-it = interactive terminal)

# Run with port mapping (like opening a door to your house)
docker run -d -p 8080:80 nginx  # Map host port 8080 to container port 80
# Now visit http://localhost:8080

# Run with name (like naming your house)
docker run -d --name my-web-server -p 8080:80 nginx

# Run with environment variables (like setting house rules)
docker run -d -e POSTGRES_PASSWORD=secret postgres
```

### **Container Management** 🛠️

```bash
# See running containers (like checking which houses have lights on)
docker ps

# See all containers (including stopped ones)
docker ps -a

# Stop a container (like turning off lights)
docker stop my-web-server
docker stop container-id

# Start a stopped container (like turning lights back on)
docker start my-web-server

# Restart a container (like power cycling)
docker restart my-web-server

# Remove a container (like demolishing a house)
docker rm my-web-server
docker rm container-id

# Remove all stopped containers (spring cleaning)
docker container prune
```

### **Image Management** 📚

```bash
# List images (like checking your recipe collection)
docker images

# Build an image from Dockerfile (like creating a new recipe)
docker build -t my-app .        # Build from current directory
docker build -t my-app:v1.0 .   # Build with specific tag

# Remove an image (like throwing away a recipe)
docker rmi image-name
docker rmi image-id

# Remove unused images (clean up recipe collection)
docker image prune
```

### **Debugging and Inspection** 🔍

```bash
# Look inside a running container (like inspecting a house)
docker exec -it container-name bash
docker exec -it my-web-server sh

# Check container logs (like reading a diary)
docker logs container-name
docker logs -f container-name    # Follow logs in real-time

# Get detailed info about container (like property inspection)
docker inspect container-name

# Check resource usage (like checking utility bills)
docker stats
docker stats container-name
```

## 🎮 Practice Exercise: Your First Docker App

Let's build a simple web application step by step!

### Step 1: Create a Simple Web App 🌐

```bash
# Create project directory
mkdir my-first-docker-app
cd my-first-docker-app

# Create a simple HTML file
cat > index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>My First Docker App</title>
    <style>
        body { font-family: Arial; text-align: center; margin-top: 50px; }
        .container { background: #f0f0f0; padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐳 Hello from Docker!</h1>
        <p>This web app is running inside a Docker container!</p>
        <p>Container ID: <span id="hostname"></span></p>
    </div>
    <script>
        document.getElementById('hostname').textContent = window.location.hostname;
    </script>
</body>
</html>
EOF
```

### Step 2: Create a Dockerfile 📝

```bash
# Create Dockerfile
cat > Dockerfile << EOF
# Use nginx as base image (like starting with a web server recipe)
FROM nginx:alpine

# Copy our HTML file to nginx web directory (like putting cake in display case)
COPY index.html /usr/share/nginx/html/

# Expose port 80 (like putting up an "Open" sign)
EXPOSE 80

# nginx starts automatically, so no CMD needed
EOF
```

### Step 3: Build and Run 🚀

```bash
# Build the image (like preparing the recipe)
docker build -t my-web-app .

# Check if image was created
docker images | grep my-web-app

# Run the container (like opening the restaurant)
docker run -d --name my-website -p 8080:80 my-web-app

# Check if it's running
docker ps

# Test it works
curl http://localhost:8080
# Or open http://localhost:8080 in your browser
```

### Step 4: Experiment and Learn 🔬

```bash
# Look inside the running container
docker exec -it my-website sh

# Inside the container, explore:
ls /usr/share/nginx/html/    # See your HTML file
ps aux                       # See running processes
exit                         # Leave the container

# Check logs
docker logs my-website

# Stop and clean up
docker stop my-website
docker rm my-website
```

## 🚀 Real-World Docker Examples

### **Node.js Application** 🟢

```dockerfile
# Dockerfile for Node.js app
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

```bash
# Build and run Node.js app
docker build -t my-node-app .
docker run -d -p 3000:3000 --name node-server my-node-app
```

### **Python Flask Application** 🐍

```dockerfile
# Dockerfile for Python Flask app
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Expose port
EXPOSE 5000

# Start the application
CMD ["python", "app.py"]
```

### **Multi-Container Application with Docker Compose** 🎼

```yaml
# docker-compose.yml - like a recipe for multiple dishes
version: '3.8'

services:
  # Web application (like the main course)
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - database
      - cache
    environment:
      - DATABASE_URL=postgresql://user:pass@database:5432/myapp
      - REDIS_URL=redis://cache:6379

  # Database (like the side dish)
  database:
    image: postgres:13
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Cache (like the appetizer)
  cache:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```bash
# Run entire application stack
docker-compose up -d

# Check all services
docker-compose ps

# View logs from all services
docker-compose logs

# Stop everything
docker-compose down
```

## 🔒 Docker Security Best Practices

### **Use Official Images** ✅
```bash
# Good: Use official images
FROM node:16-alpine
FROM postgres:13
FROM nginx:alpine

# Avoid: Random images from unknown sources
# FROM someuser/suspicious-image
```

### **Don't Run as Root** 👤
```dockerfile
# Create and use non-root user
RUN addgroup -g 1001 -S appgroup
RUN adduser -S appuser -u 1001 -G appgroup
USER appuser
```

### **Keep Images Small** 📦
```dockerfile
# Use alpine versions (smaller and more secure)
FROM node:16-alpine

# Multi-stage builds to reduce size
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

### **Scan for Vulnerabilities** 🔍
```bash
# Scan images for security issues
docker scan my-app:latest

# Use tools like Trivy
trivy image my-app:latest
```

## 📊 Docker Networking

### **Container Communication** 🌐
```bash
# Create a custom network (like a private neighborhood)
docker network create my-network

# Run containers on the same network
docker run -d --name database --network my-network postgres
docker run -d --name web-app --network my-network -p 8080:80 my-web-app

# Containers can now talk to each other by name
# web-app can connect to "database:5432"
```

### **Volume Management** 💾
```bash
# Create a volume (like a shared storage unit)
docker volume create my-data

# Use volume in container
docker run -d --name database -v my-data:/var/lib/postgresql/data postgres

# Mount host directory (like a direct connection to your house)
docker run -d -v /host/path:/container/path my-app

# List volumes
docker volume ls

# Remove unused volumes
docker volume prune
```

## 🛠️ Docker Troubleshooting

### **Common Issues and Solutions** ⚠️

**Problem 1: Container won't start**
```bash
# Check logs for errors
docker logs container-name

# Run interactively to debug
docker run -it image-name sh

# Check if port is already in use
netstat -tlnp | grep :8080
```

**Problem 2: Can't connect to container**
```bash
# Check if container is running
docker ps

# Check port mapping
docker port container-name

# Test connectivity
curl localhost:8080
telnet localhost 8080
```

**Problem 3: Out of disk space**
```bash
# Clean up unused containers
docker container prune

# Clean up unused images
docker image prune

# Clean up everything unused
docker system prune

# Check disk usage
docker system df
```

## 🎯 What's Next?

Now that you understand Docker basics, let's explore more advanced topics:

1. **[Docker Advanced](06_Docker_Advanced.md)** - Multi-stage builds, optimization, and production practices
2. **[Container Best Practices](07_Container_Best_Practices.md)** - Security, performance, and operational excellence
3. **[Kubernetes Fundamentals](../03_Orchestration/08_Kubernetes_Fundamentals.md)** - Orchestrating containers at scale

## 💡 Remember

Docker is like learning to use shipping containers - once you understand the concept, you can ship anything anywhere reliably. Start with simple applications and gradually work your way up to complex, multi-container systems.

**Key Takeaway:** Docker solves the "it works on my machine" problem by packaging applications with their entire environment!

---

*"Docker containers are like shipping containers for software - standardized, portable, and stackable."* 🐳
