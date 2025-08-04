# Jenkins Basics 🏭

## 🌟 Real-World Story: The Assembly Line Revolution

Imagine you're running a car manufacturing company in the early 1900s. Building each car requires:
- **Manual assembly** by skilled craftsmen (slow and error-prone)
- **Quality checks** done randomly (inconsistent quality)
- **Different processes** for each worker (no standardization)
- **Long delays** between steps (inefficient workflow)

Then Henry Ford introduced the **assembly line**:
- **Standardized steps** that anyone can follow
- **Automated quality checks** at each stage
- **Continuous flow** from raw materials to finished product
- **Consistent, high-quality output** at scale

**Jenkins is exactly like an assembly line for software!** Instead of building cars, we're building and deploying applications.

## 🎯 What is Jenkins?

Jenkins is like an **automated assembly line** for your code. It takes your source code and automatically builds, tests, and deploys it through a series of standardized steps.

### 🏭 **Manual Deployment vs Jenkins**

| Manual Deployment | Jenkins Automation |
|------------------|-------------------|
| 👨‍💻 **Developer manually builds** | 🤖 **Automated builds** |
| 🐛 **Inconsistent testing** | ✅ **Standardized testing** |
| 😰 **Error-prone deployments** | 🎯 **Reliable deployments** |
| ⏰ **Hours of manual work** | ⚡ **Minutes of automation** |
| 🔥 **"Works on my machine"** | 🌍 **"Works everywhere"** |

## 📊 Visual Representation: Jenkins Pipeline

```
🏭 JENKINS CI/CD PIPELINE

📝 DEVELOPER COMMITS CODE
    |
    | (Git webhook triggers Jenkins)
    |
🔄 JENKINS PIPELINE STARTS
    |
    |-- 📦 STAGE 1: BUILD
    |   |-- Download source code
    |   |-- Compile/package application
    |   |-- Create artifacts
    |
    |-- 🧪 STAGE 2: TEST
    |   |-- Unit tests
    |   |-- Integration tests
    |   |-- Code quality checks
    |
    |-- 🔒 STAGE 3: SECURITY SCAN
    |   |-- Vulnerability scanning
    |   |-- Dependency checks
    |   |-- Code analysis
    |
    |-- 🚀 STAGE 4: DEPLOY
        |-- Deploy to staging
        |-- Run smoke tests
        |-- Deploy to production (if approved)
```

## 💡 Core Jenkins Concepts

### **Jobs vs Pipelines** 🔧

**Jenkins Job** = **Single Assembly Station** 🔨
- Performs one specific task
- Like "paint the car door"
- Simple but limited

**Jenkins Pipeline** = **Complete Assembly Line** 🏭
- Multiple connected stages
- Like "build entire car from start to finish"
- Powerful and flexible

```groovy
// Simple Jenkins Pipeline (Jenkinsfile)
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'docker build -t my-app .'
                sh 'docker run -d -p 8080:80 my-app'
            }
        }
    }
}
```

### **Agents and Nodes** 🤖

**Jenkins Master** = **Factory Supervisor** 👨‍💼
- Coordinates all work
- Schedules jobs
- Manages the web interface

**Jenkins Agent/Node** = **Assembly Worker** 👷‍♂️
- Does the actual work
- Can be on different machines
- Specialized for different tasks

```bash
# Master coordinates, agents execute
Master: "Agent-1, build the Java app"
Agent-1: "Building Java app on Linux machine..."

Master: "Agent-2, run iOS tests"
Agent-2: "Running tests on macOS machine..."
```

### **Triggers** ⚡

**Manual Trigger** = **Starting assembly line by hand** 👋
```bash
# Someone clicks "Build Now" button
```

**SCM Polling** = **Checking for new orders every few minutes** 🔍
```bash
# Jenkins checks Git every 5 minutes for changes
H/5 * * * *  # Cron expression
```

**Webhook Trigger** = **Automatic notification system** 📞
```bash
# Git automatically tells Jenkins when code changes
# Much faster and more efficient
```

**Scheduled Trigger** = **Running at specific times** ⏰
```bash
# Run nightly builds at 2 AM
0 2 * * *  # Cron expression
```

## 🔧 Essential Jenkins Setup

### **Installing Jenkins** 📦

**Option 1: Docker (Easiest)** 🐳
```bash
# Run Jenkins in Docker
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Option 2: Ubuntu/Debian** 🐧
```bash
# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt update
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

**Option 3: CentOS/RHEL** 🎩
```bash
# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

# Install Jenkins
sudo yum install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### **Initial Setup** ⚙️

1. **Access Jenkins** 🌐
   ```bash
   # Open browser to http://localhost:8080
   # Enter the initial admin password
   ```

2. **Install Suggested Plugins** 🔌
   - Git plugin
   - Pipeline plugin
   - Build tools (Maven, Gradle, npm)
   - Docker plugin

3. **Create Admin User** 👤
   ```bash
   Username: admin
   Password: your_secure_password
   Email: admin@yourcompany.com
   ```

## 🎮 Practice Exercise: Your First Jenkins Pipeline

Let's create a complete CI/CD pipeline for a simple web application!

### Step 1: Create a Simple Web App 🌐

```bash
# Create project directory
mkdir my-jenkins-app
cd my-jenkins-app

# Create package.json
cat > package.json << EOF
{
  "name": "my-jenkins-app",
  "version": "1.0.0",
  "description": "Simple app for Jenkins demo",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "node test.js",
    "build": "echo 'Building application...'"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Create simple Express server
cat > server.js << EOF
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Jenkins Demo App</h1>
    <p>This app was built and deployed by Jenkins!</p>
    <p>Build time: ${new Date().toISOString()}</p>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(\`App running at http://localhost:\${port}\`);
});
EOF

# Create simple test
cat > test.js << EOF
const http = require('http');

console.log('Running tests...');

// Simple test function
function test(name, fn) {
  try {
    fn();
    console.log(\`✅ \${name}\`);
  } catch (error) {
    console.log(\`❌ \${name}: \${error.message}\`);
    process.exit(1);
  }
}

// Run tests
test('Math test', () => {
  if (2 + 2 !== 4) throw new Error('Math is broken!');
});

test('String test', () => {
  if ('hello'.toUpperCase() !== 'HELLO') throw new Error('String methods broken!');
});

console.log('All tests passed! 🎉');
EOF

# Create Dockerfile
cat > Dockerfile << EOF
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
EOF
```

### Step 2: Create Jenkinsfile 📝

```groovy
# Create Jenkinsfile
cat > Jenkinsfile << EOF
pipeline {
    agent any
    
    environment {
        APP_NAME = 'my-jenkins-app'
        DOCKER_IMAGE = "\${APP_NAME}:\${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                // Code is automatically checked out in pipeline
                sh 'ls -la'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    docker.build("\${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                echo '🚀 Deploying to staging...'
                script {
                    // Stop existing container if running
                    sh 'docker stop \${APP_NAME}-staging || true'
                    sh 'docker rm \${APP_NAME}-staging || true'
                    
                    // Run new container
                    sh 'docker run -d --name \${APP_NAME}-staging -p 3001:3000 \${DOCKER_IMAGE}'
                }
            }
        }
        
        stage('Smoke Test') {
            steps {
                echo '💨 Running smoke tests...'
                script {
                    // Wait for app to start
                    sleep(time: 10, unit: 'SECONDS')
                    
                    // Test health endpoint
                    sh 'curl -f http://localhost:3001/health || exit 1'
                    echo '✅ Smoke tests passed!'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                echo '🌟 Deploying to production...'
                script {
                    // Stop existing production container
                    sh 'docker stop \${APP_NAME}-prod || true'
                    sh 'docker rm \${APP_NAME}-prod || true'
                    
                    // Run production container
                    sh 'docker run -d --name \${APP_NAME}-prod -p 3000:3000 \${DOCKER_IMAGE}'
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            // Clean up old Docker images
            sh 'docker image prune -f'
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        
        failure {
            echo '💥 Pipeline failed!'
            // In real world, send notifications here
        }
    }
}
EOF
```

### Step 3: Set Up Git Repository 📚

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit: Jenkins demo app"

# Create .gitignore
cat > .gitignore << EOF
node_modules/
npm-debug.log*
.env
EOF

git add .gitignore
git commit -m "Add .gitignore"

# Push to your Git repository (GitHub, GitLab, etc.)
# git remote add origin https://github.com/yourusername/my-jenkins-app.git
# git push -u origin main
```

### Step 4: Create Jenkins Pipeline Job 🏗️

1. **Create New Pipeline Job** 📋
   ```bash
   # In Jenkins web interface:
   # 1. Click "New Item"
   # 2. Enter name: "my-jenkins-app"
   # 3. Select "Pipeline"
   # 4. Click "OK"
   ```

2. **Configure Pipeline** ⚙️
   ```bash
   # In job configuration:
   # 1. Under "Pipeline" section
   # 2. Definition: "Pipeline script from SCM"
   # 3. SCM: "Git"
   # 4. Repository URL: your Git repository URL
   # 5. Branch: "*/main"
   # 6. Script Path: "Jenkinsfile"
   # 7. Save
   ```

3. **Run the Pipeline** 🚀
   ```bash
   # Click "Build Now"
   # Watch the pipeline execute through each stage
   ```

## 🚀 Real-World Jenkins Examples

### **Multi-Branch Pipeline** 🌳

```groovy
// Jenkinsfile for multi-branch pipeline
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'echo "Building branch: ${BRANCH_NAME}"'
                sh 'npm install && npm run build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('Linting') {
                    steps {
                        sh 'npm run lint'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        echo 'Deploying to production...'
                        sh 'kubectl apply -f k8s/production/'
                    } else if (env.BRANCH_NAME == 'develop') {
                        echo 'Deploying to staging...'
                        sh 'kubectl apply -f k8s/staging/'
                    }
                }
            }
        }
    }
}
```

### **Microservices Pipeline** 🔧

```groovy
// Pipeline for multiple microservices
pipeline {
    agent any
    
    environment {
        REGISTRY = 'your-docker-registry.com'
        NAMESPACE = 'your-namespace'
    }
    
    stages {
        stage('Build Services') {
            parallel {
                stage('User Service') {
                    steps {
                        dir('user-service') {
                            sh 'docker build -t ${REGISTRY}/user-service:${BUILD_NUMBER} .'
                            sh 'docker push ${REGISTRY}/user-service:${BUILD_NUMBER}'
                        }
                    }
                }
                stage('Order Service') {
                    steps {
                        dir('order-service') {
                            sh 'docker build -t ${REGISTRY}/order-service:${BUILD_NUMBER} .'
                            sh 'docker push ${REGISTRY}/order-service:${BUILD_NUMBER}'
                        }
                    }
                }
                stage('Payment Service') {
                    steps {
                        dir('payment-service') {
                            sh 'docker build -t ${REGISTRY}/payment-service:${BUILD_NUMBER} .'
                            sh 'docker push ${REGISTRY}/payment-service:${BUILD_NUMBER}'
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        sed -i 's/{{BUILD_NUMBER}}/${BUILD_NUMBER}/g' k8s/*.yaml
                        kubectl apply -f k8s/ -n ${NAMESPACE}
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }
    }
}
```

### **Blue-Green Deployment** 🔵🟢

```groovy
// Blue-Green deployment pipeline
pipeline {
    agent any
    
    environment {
        BLUE_PORT = '3000'
        GREEN_PORT = '3001'
        PROD_PORT = '80'
    }
    
    stages {
        stage('Determine Deployment Color') {
            steps {
                script {
                    // Check which color is currently live
                    def currentColor = sh(
                        script: 'docker ps --format "table {{.Names}}" | grep -E "(blue|green)" | head -1',
                        returnStdout: true
                    ).trim()
                    
                    if (currentColor.contains('blue')) {
                        env.DEPLOY_COLOR = 'green'
                        env.DEPLOY_PORT = GREEN_PORT
                        env.OLD_COLOR = 'blue'
                    } else {
                        env.DEPLOY_COLOR = 'blue'
                        env.DEPLOY_PORT = BLUE_PORT
                        env.OLD_COLOR = 'green'
                    }
                    
                    echo "Deploying to: ${env.DEPLOY_COLOR}"
                }
            }
        }
        
        stage('Deploy New Version') {
            steps {
                script {
                    sh """
                        docker stop my-app-${env.DEPLOY_COLOR} || true
                        docker rm my-app-${env.DEPLOY_COLOR} || true
                        docker run -d --name my-app-${env.DEPLOY_COLOR} -p ${env.DEPLOY_PORT}:3000 my-app:${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Wait for app to start
                    sleep(time: 30, unit: 'SECONDS')
                    
                    // Health check
                    sh "curl -f http://localhost:${env.DEPLOY_PORT}/health"
                }
            }
        }
        
        stage('Switch Traffic') {
            input {
                message "Switch traffic to ${env.DEPLOY_COLOR}?"
                ok "Switch"
            }
            steps {
                script {
                    // Update load balancer or reverse proxy
                    sh """
                        # Update nginx config to point to new color
                        sed -i 's/proxy_pass http://localhost:.*/proxy_pass http://localhost:${env.DEPLOY_PORT};/' /etc/nginx/sites-available/default
                        nginx -s reload
                    """
                }
            }
        }
        
        stage('Cleanup Old Version') {
            steps {
                script {
                    sh """
                        docker stop my-app-${env.OLD_COLOR} || true
                        docker rm my-app-${env.OLD_COLOR} || true
                    """
                }
            }
        }
    }
}
```

## 🔧 Jenkins Plugins and Integrations

### **Essential Plugins** 🔌

```bash
# Install via Jenkins Plugin Manager or CLI

# Source Control
- Git Plugin
- GitHub Plugin
- GitLab Plugin

# Build Tools
- Maven Integration Plugin
- Gradle Plugin
- NodeJS Plugin

# Containerization
- Docker Plugin
- Kubernetes Plugin

# Testing
- JUnit Plugin
- Test Results Analyzer

# Notifications
- Email Extension Plugin
- Slack Notification Plugin
- Microsoft Teams Plugin

# Security
- OWASP Dependency-Check Plugin
- SonarQube Scanner

# Deployment
- Deploy to Container Plugin
- SSH Plugin
- Ansible Plugin
```

### **Slack Integration** 💬

```groovy
// Add Slack notifications to pipeline
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        success {
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Build #${BUILD_NUMBER} succeeded! 🎉"
            )
        }
        
        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Build #${BUILD_NUMBER} failed! 💥"
            )
        }
    }
}
```

### **SonarQube Integration** 📊

```groovy
// Code quality analysis with SonarQube
stage('Code Quality') {
    steps {
        script {
            def scannerHome = tool 'SonarQubeScanner'
            withSonarQubeEnv('SonarQube') {
                sh """
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=my-project \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_AUTH_TOKEN}
                """
            }
        }
    }
}

stage('Quality Gate') {
    steps {
        timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
        }
    }
}
```

## 🛠️ Jenkins Administration

### **Backup and Restore** 💾

```bash
# Backup Jenkins home directory
sudo tar -czf jenkins-backup-$(date +%Y%m%d).tar.gz /var/lib/jenkins/

# Backup specific configurations
sudo cp -r /var/lib/jenkins/jobs/ ~/jenkins-jobs-backup/
sudo cp -r /var/lib/jenkins/users/ ~/jenkins-users-backup/
sudo cp /var/lib/jenkins/config.xml ~/jenkins-config-backup/

# Restore from backup
sudo systemctl stop jenkins
sudo tar -xzf jenkins-backup-20240101.tar.gz -C /
sudo chown -R jenkins:jenkins /var/lib/jenkins/
sudo systemctl start jenkins
```

### **Security Configuration** 🔒

```bash
# Enable security in Jenkins
# 1. Manage Jenkins > Configure Global Security
# 2. Enable security: ✓
# 3. Security Realm: Jenkins' own user database
# 4. Authorization: Matrix-based security

# User permissions matrix:
# admin: Administer
# developers: Read, Build, Cancel
# viewers: Read only
```

### **Performance Tuning** ⚡

```bash
# Increase Java heap size (in /etc/default/jenkins)
JAVA_ARGS="-Xmx2048m -XX:MaxPermSize=512m"

# Configure executors
# Manage Jenkins > Manage Nodes > Built-In Node > Configure
# Number of executors: 4 (adjust based on CPU cores)

# Clean up old builds
# Job Configuration > Discard old builds
# Keep builds for: 30 days
# Max # of builds to keep: 50
```

## 🎯 What's Next?

Now that you understand Jenkins basics, let's explore more advanced topics:

1. **[Jenkins Pipelines](13_Jenkins_Pipelines.md)** - Advanced pipeline techniques and best practices
2. **[GitOps and Automation](14_GitOps_and_Automation.md)** - Git-driven deployments
3. **[Kubernetes Fundamentals](../03_Orchestration/08_Kubernetes_Fundamentals.md)** - Container orchestration

## 💡 Remember

Jenkins is like having a tireless factory worker who never makes mistakes and works 24/7. Start with simple pipelines and gradually add more sophisticated features as your needs grow.

**Key Takeaway:** Automation is not just about speed - it's about consistency, reliability, and freeing humans to focus on creative problem-solving!

---

*"The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency."* - Bill Gates 🏭
