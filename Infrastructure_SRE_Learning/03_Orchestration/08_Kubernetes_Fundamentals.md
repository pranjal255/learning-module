# Kubernetes Fundamentals ⚓

## 🌟 Real-World Story: The Symphony Orchestra

Imagine you're conducting a world-class symphony orchestra with 100 musicians. Without a conductor:
- **Musicians play whenever they want** (chaos and noise)
- **No coordination** between different sections
- **Some instruments too loud, others too quiet** (no balance)
- **When someone makes a mistake**, the whole performance suffers
- **Adding new musicians** disrupts the entire orchestra

With a skilled conductor:
- **Perfect coordination** - everyone plays in harmony
- **Dynamic control** - adjust volume and tempo in real-time
- **Self-healing** - if someone misses a note, others compensate
- **Seamless scaling** - add or remove musicians as needed
- **Consistent performance** - same quality every time

**Kubernetes is exactly like a conductor for your containers!** Instead of managing musicians, it orchestrates Docker containers.

## 🎯 What is Kubernetes?

Kubernetes (K8s) is like a **master conductor** that manages and orchestrates containers across multiple servers. It ensures your applications run smoothly, scale automatically, and recover from failures.

### 🎼 **Manual Container Management vs Kubernetes**

| Manual Container Management | Kubernetes Orchestration |
|----------------------------|--------------------------|
| 🤹 **Manually start/stop containers** | 🎭 **Automatic container management** |
| 😰 **Manual scaling during traffic spikes** | 📈 **Auto-scaling based on demand** |
| 💥 **Manual recovery from failures** | 🔄 **Self-healing and automatic recovery** |
| 🏠 **Containers tied to specific servers** | 🌍 **Containers can run anywhere** |
| 📋 **Complex deployment procedures** | 🚀 **Declarative deployments** |

## 📊 Visual Representation: Kubernetes Architecture

```
🎼 KUBERNETES CLUSTER ARCHITECTURE

👨‍💼 CONTROL PLANE (The Conductor's Podium)
├── 🧠 API Server (Conductor's baton - receives all commands)
├── 📊 etcd (Sheet music - stores cluster state)
├── 🎯 Scheduler (Assigns musicians to seats)
└── 🎮 Controller Manager (Ensures performance quality)

🎵 WORKER NODES (Orchestra Sections)
├── 🎻 Node 1 (String Section)
│   ├── 📦 Pod 1 (Violin container)
│   ├── 📦 Pod 2 (Cello container)
│   └── 🤖 kubelet (Section leader)
│
├── 🎺 Node 2 (Brass Section)
│   ├── 📦 Pod 3 (Trumpet container)
│   ├── 📦 Pod 4 (Trombone container)
│   └── 🤖 kubelet (Section leader)
│
└── 🥁 Node 3 (Percussion Section)
    ├── 📦 Pod 5 (Drums container)
    ├── 📦 Pod 6 (Timpani container)
    └── 🤖 kubelet (Section leader)
```

## 💡 Core Kubernetes Concepts

### **Pods** 📦
Pods are like **individual music stands** that hold one or more musicians:

```yaml
# Simple Pod (like a solo violinist)
apiVersion: v1
kind: Pod
metadata:
  name: web-app-pod
  labels:
    app: web-app
spec:
  containers:
  - name: web-container
    image: nginx:latest
    ports:
    - containerPort: 80
```

**Real-World Analogy:**
- **Pod** = Music stand (holds containers)
- **Container** = Musician (does the actual work)
- **Multiple containers in one pod** = Musicians sharing a music stand (rare, but possible)

### **Deployments** 🚀
Deployments are like **sheet music** that defines how the orchestra should perform:

```yaml
# Deployment (like instructions for the string section)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
spec:
  replicas: 3  # We want 3 violinists
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-container
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

**Key Features:**
- **Desired State** - "I want 3 web servers running"
- **Self-Healing** - If one fails, Kubernetes starts a new one
- **Rolling Updates** - Update containers without downtime
- **Rollback** - Return to previous version if needed

### **Services** 🌐
Services are like the **concert hall's sound system** that routes audio to the audience:

```yaml
# Service (like the sound mixing board)
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer  # Distribute traffic evenly
```

**Service Types:**
- **ClusterIP** - Internal communication only (like backstage intercom)
- **NodePort** - Accessible from outside cluster (like opening specific doors)
- **LoadBalancer** - Cloud load balancer (like professional sound system)

### **ConfigMaps and Secrets** 🗂️
ConfigMaps and Secrets are like **sheet music and personal notes**:

```yaml
# ConfigMap (like sheet music - everyone can see)
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://db:5432/myapp"
  debug_mode: "false"
  max_connections: "100"

---
# Secret (like personal notes - encrypted)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database_password: cGFzc3dvcmQxMjM=  # base64 encoded
  api_key: YWJjZGVmZ2hpams=
```

**Using in Pods:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app-container
    image: my-app:latest
    env:
    - name: DATABASE_URL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_url
    - name: DATABASE_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: database_password
```

## 🔧 Essential Kubernetes Commands

### **Cluster Information** 🔍

```bash
# Check cluster status (like checking if the orchestra is ready)
kubectl cluster-info
kubectl get nodes

# Get detailed node information
kubectl describe nodes

# Check cluster components
kubectl get componentstatuses
```

### **Pod Management** 📦

```bash
# List all pods (like checking all musicians)
kubectl get pods
kubectl get pods -o wide  # More details

# Get pods in specific namespace
kubectl get pods -n kube-system

# Describe a specific pod (like getting musician details)
kubectl describe pod web-app-pod

# Check pod logs (like listening to individual musician)
kubectl logs web-app-pod
kubectl logs -f web-app-pod  # Follow logs in real-time

# Execute commands in pod (like talking to musician)
kubectl exec -it web-app-pod -- /bin/bash
kubectl exec web-app-pod -- ls /app
```

### **Deployment Management** 🚀

```bash
# Create deployment (like starting the performance)
kubectl create deployment nginx-deployment --image=nginx

# Scale deployment (like adding more musicians)
kubectl scale deployment nginx-deployment --replicas=5

# Update deployment (like changing the music)
kubectl set image deployment/nginx-deployment nginx=nginx:1.21

# Check rollout status
kubectl rollout status deployment/nginx-deployment

# Rollback deployment (like returning to previous song)
kubectl rollout undo deployment/nginx-deployment

# Check rollout history
kubectl rollout history deployment/nginx-deployment
```

### **Service Management** 🌐

```bash
# Create service (like setting up sound system)
kubectl expose deployment nginx-deployment --port=80 --type=LoadBalancer

# List services
kubectl get services
kubectl get svc  # Short form

# Describe service
kubectl describe service nginx-deployment

# Port forwarding (like personal headphones)
kubectl port-forward service/nginx-deployment 8080:80
# Now access via http://localhost:8080
```

## 🎮 Practice Exercise: Deploy a Complete Application

Let's deploy a full web application with database and caching!

### Step 1: Set Up Local Kubernetes 🏠

```bash
# Install kubectl (if not already installed)
# macOS
brew install kubectl

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y kubectl

# Install minikube for local development
# macOS
brew install minikube

# Ubuntu/Debian
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start local Kubernetes cluster
minikube start

# Verify cluster is running
kubectl get nodes
```

### Step 2: Create Application Files 📁

```bash
# Create project directory
mkdir k8s-web-app
cd k8s-web-app

# Create namespace for our application
cat > namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: web-app
  labels:
    name: web-app
EOF

# Create ConfigMap for application configuration
cat > configmap.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: web-app
data:
  DATABASE_HOST: "postgres-service"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "webapp"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  APP_ENV: "production"
EOF

# Create Secret for sensitive data
cat > secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: web-app
type: Opaque
data:
  DATABASE_USER: cG9zdGdyZXM=      # postgres (base64)
  DATABASE_PASSWORD: cGFzc3dvcmQ=  # password (base64)
  REDIS_PASSWORD: cmVkaXNwYXNz      # redispass (base64)
EOF
```

### Step 3: Deploy Database (PostgreSQL) 🗄️

```yaml
# Create postgres-deployment.yaml
cat > postgres-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
  namespace: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DATABASE_NAME
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: postgres-storage
        emptyDir: {}

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: web-app
spec:
  selector:
    app: postgres
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
  type: ClusterIP
EOF
```

### Step 4: Deploy Cache (Redis) ⚡

```yaml
# Create redis-deployment.yaml
cat > redis-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-deployment
  namespace: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: REDIS_PASSWORD
        resources:
          requests:
            memory: "128Mi"
            cpu: "125m"
          limits:
            memory: "256Mi"
            cpu: "250m"

---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: web-app
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
  type: ClusterIP
EOF
```

### Step 5: Deploy Web Application 🌐

```yaml
# Create web-app-deployment.yaml
cat > web-app-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
  namespace: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:latest
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "125m"
          limits:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
  namespace: web-app
spec:
  selector:
    app: web-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
EOF
```

### Step 6: Deploy Everything 🚀

```bash
# Apply all configurations
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f web-app-deployment.yaml

# Check deployment status
kubectl get all -n web-app

# Watch pods come online
kubectl get pods -n web-app -w

# Check services
kubectl get services -n web-app

# Get external IP (for minikube)
minikube service web-app-service -n web-app --url
```

### Step 7: Test and Monitor 🔍

```bash
# Check pod logs
kubectl logs -l app=web-app -n web-app

# Describe deployments
kubectl describe deployment web-app-deployment -n web-app

# Scale the application
kubectl scale deployment web-app-deployment --replicas=5 -n web-app

# Check horizontal pod autoscaler (if configured)
kubectl get hpa -n web-app

# Port forward for local testing
kubectl port-forward service/web-app-service 8080:80 -n web-app
# Access via http://localhost:8080
```

## 🚀 Real-World Kubernetes Patterns

### **Rolling Updates** 🔄

```bash
# Update application image
kubectl set image deployment/web-app-deployment web-app=nginx:1.21 -n web-app

# Monitor rollout
kubectl rollout status deployment/web-app-deployment -n web-app

# Rollback if needed
kubectl rollout undo deployment/web-app-deployment -n web-app
```

### **Auto-Scaling** 📈

```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
  namespace: web-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **Health Checks** 🏥

```yaml
# Advanced health checks
spec:
  containers:
  - name: web-app
    image: my-app:latest
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
    startupProbe:
      httpGet:
        path: /startup
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 30
```

## 🔧 Kubernetes Best Practices

### **Resource Management** 💾

```yaml
# Always set resource requests and limits
spec:
  containers:
  - name: app
    image: my-app:latest
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```

### **Security** 🔒

```yaml
# Security context
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    image: my-app:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### **Labels and Annotations** 🏷️

```yaml
metadata:
  name: web-app
  labels:
    app: web-app
    version: v1.0.0
    environment: production
    tier: frontend
  annotations:
    description: "Main web application"
    maintainer: "team@company.com"
    last-updated: "2024-01-01"
```

## 📊 Monitoring Kubernetes

### **Essential Commands** 🔍

```bash
# Cluster overview
kubectl top nodes
kubectl top pods -n web-app

# Resource usage
kubectl describe node minikube

# Events
kubectl get events -n web-app --sort-by='.lastTimestamp'

# Troubleshooting
kubectl get pods -n web-app -o wide
kubectl describe pod <pod-name> -n web-app
kubectl logs <pod-name> -n web-app --previous
```

### **Useful Aliases** ⚡

```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'
alias kex='kubectl exec -it'
```

## 🎯 What's Next?

Now that you understand Kubernetes fundamentals, let's explore more advanced topics:

1. **[Advanced Kubernetes](11_Advanced_Kubernetes.md)** - Ingress, volumes, and advanced patterns
2. **[Monitoring Fundamentals](../07_Monitoring_and_Observability/23_Monitoring_Fundamentals.md)** - Keeping your cluster healthy
3. **[Terraform Basics](../08_Infrastructure_as_Code/27_Terraform_Basics.md)** - Infrastructure as Code

## 💡 Remember

Kubernetes is like conducting a symphony orchestra - it requires practice and understanding of how all the pieces work together. Start with simple applications and gradually build up to complex, multi-service architectures.

**Key Takeaway:** Kubernetes doesn't just run containers - it orchestrates entire applications with automatic scaling, healing, and deployment capabilities!

---

*"Kubernetes is the Linux of the cloud."* - Kelsey Hightower ⚓
