# Monitoring Fundamentals 📊

## 🌟 Real-World Story: The Hospital Patient Monitoring System

Imagine you're running a busy hospital with hundreds of patients. Without proper monitoring:
- **Patients could be in distress** without anyone knowing
- **Critical conditions** might go unnoticed until it's too late
- **Staff would be overwhelmed** checking on everyone manually
- **No early warning system** for potential problems
- **Reactive treatment** instead of preventive care

With a comprehensive monitoring system:
- **Continuous vital signs monitoring** (heart rate, blood pressure, temperature)
- **Automated alerts** when something goes wrong
- **Historical data** to track patient progress
- **Predictive analytics** to prevent problems before they occur
- **Centralized dashboard** for medical staff to monitor all patients

**Infrastructure monitoring works exactly the same way!** Instead of monitoring patients, we monitor servers, applications, and services.

## 🎯 What is Infrastructure Monitoring?

Infrastructure monitoring is like having a **comprehensive health monitoring system** for your digital infrastructure. It continuously watches your systems, collects vital signs, and alerts you when something needs attention.

### 🏥 **No Monitoring vs Comprehensive Monitoring**

| No Monitoring | Comprehensive Monitoring |
|--------------|-------------------------|
| 😱 **"Why is the website down?"** | 📊 **"CPU is at 95%, scaling up automatically"** |
| 🔥 **Find problems after users complain** | 🚨 **Detect issues before users notice** |
| 🤷 **"It was working yesterday..."** | 📈 **Historical data shows trends** |
| 💸 **Expensive downtime** | 💰 **Prevent costly outages** |
| 😰 **Reactive firefighting** | 🎯 **Proactive problem prevention** |

## 📊 Visual Representation: Monitoring Architecture

```
🏥 COMPREHENSIVE MONITORING SYSTEM

👥 USERS
    |
    | (User experience monitoring)
    |
🌐 APPLICATION LAYER
    |-- 📱 Frontend (React/Vue)
    |-- 🔗 API Gateway
    |-- 🖥️ Backend Services
    |
    | (Application metrics)
    |
📊 MONITORING STACK
    |-- 📈 Metrics Collection (Prometheus)
    |-- 📝 Log Aggregation (ELK Stack)
    |-- 🔍 Distributed Tracing (Jaeger)
    |-- 🚨 Alerting (AlertManager)
    |-- 📋 Dashboards (Grafana)
    |
🏗️ INFRASTRUCTURE LAYER
    |-- ☁️ Cloud Resources (AWS/GCP)
    |-- 🐳 Containers (Docker/K8s)
    |-- 🖥️ Virtual Machines
    |-- 💾 Databases
    |-- 🌐 Networks
```

## 💡 Core Monitoring Concepts

### **The Four Golden Signals** 🏆

Just like doctors monitor vital signs, SREs monitor four key metrics:

**1. Latency** ⚡ - How fast?
```bash
# Like measuring patient response time
# How long does it take to serve requests?

# Examples:
# - API response time: 200ms
# - Database query time: 50ms
# - Page load time: 2.5s
```

**2. Traffic** 🚗 - How much load?
```bash
# Like measuring patient heart rate
# How many requests per second?

# Examples:
# - HTTP requests: 1000 req/sec
# - Database connections: 50 concurrent
# - Network throughput: 100 Mbps
```

**3. Errors** ❌ - How many failures?
```bash
# Like measuring patient symptoms
# What percentage of requests fail?

# Examples:
# - HTTP 5xx errors: 0.1%
# - Failed database queries: 0.05%
# - Application exceptions: 2 per hour
```

**4. Saturation** 📊 - How full?
```bash
# Like measuring patient vital capacity
# How close to maximum capacity?

# Examples:
# - CPU usage: 75%
# - Memory usage: 80%
# - Disk space: 60%
# - Network bandwidth: 40%
```

### **Metrics, Logs, and Traces** 📋

**Metrics** = **Vital Signs** 📈
```bash
# Numerical measurements over time
# Like temperature, blood pressure, heart rate

# Examples:
cpu_usage_percent{instance="web-01"} 75.2
memory_usage_bytes{instance="web-01"} 2147483648
http_requests_total{method="GET", status="200"} 1500
```

**Logs** = **Medical Records** 📝
```bash
# Detailed event records
# Like doctor's notes and patient history

# Examples:
2024-01-01 10:30:15 INFO  User login successful: user_id=123
2024-01-01 10:30:16 ERROR Database connection failed: timeout after 30s
2024-01-01 10:30:17 WARN  High memory usage detected: 85%
```

**Traces** = **Patient Journey** 🔍
```bash
# Request flow through system
# Like tracking patient through hospital departments

# Example trace:
Request ID: abc123
├── Frontend (50ms)
├── API Gateway (10ms)
├── User Service (100ms)
│   └── Database Query (80ms)
├── Order Service (200ms)
│   └── Payment API (150ms)
└── Total: 360ms
```

## 🔧 Essential Monitoring Tools

### **Prometheus** 📊
Prometheus is like a **digital nurse** that continuously checks vital signs:

```yaml
# prometheus.yml configuration
global:
  scrape_interval: 15s  # Check every 15 seconds

scrape_configs:
  - job_name: 'web-servers'
    static_configs:
      - targets: ['web-01:9090', 'web-02:9090']
  
  - job_name: 'databases'
    static_configs:
      - targets: ['db-01:9100', 'db-02:9100']
```

**Basic Prometheus Queries (PromQL):**
```bash
# CPU usage
cpu_usage_percent

# Memory usage over 80%
memory_usage_percent > 80

# HTTP request rate
rate(http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, http_request_duration_seconds_bucket)
```

### **Grafana** 📋
Grafana is like the **central monitoring dashboard** in a hospital:

```json
{
  "dashboard": {
    "title": "Infrastructure Overview",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "cpu_usage_percent",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "singlestat",
        "targets": [
          {
            "expr": "avg(memory_usage_percent)"
          }
        ]
      }
    ]
  }
}
```

### **ELK Stack** 📝
ELK (Elasticsearch, Logstash, Kibana) is like the **hospital records system**:

```yaml
# Logstash configuration
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][log_type] == "nginx" {
    grok {
      match => { "message" => "%{NGINXACCESS}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

## 🎮 Practice Exercise: Set Up Complete Monitoring

Let's build a comprehensive monitoring system for a web application!

### Step 1: Set Up Prometheus 📊

```bash
# Create monitoring directory
mkdir monitoring-stack
cd monitoring-stack

# Create Prometheus configuration
cat > prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'web-app'
    static_configs:
      - targets: ['web-app:8080']
    metrics_path: /metrics
    scrape_interval: 5s
EOF

# Create alert rules
cat > alert_rules.yml << EOF
groups:
- name: infrastructure_alerts
  rules:
  - alert: HighCPUUsage
    expr: cpu_usage_percent > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage detected"
      description: "CPU usage is above 80% for more than 5 minutes"

  - alert: HighMemoryUsage
    expr: memory_usage_percent > 85
    for: 3m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage detected"
      description: "Memory usage is above 85% for more than 3 minutes"

  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service is down"
      description: "Service {{ $labels.instance }} has been down for more than 1 minute"
EOF
```

### Step 2: Set Up Grafana Dashboard 📋

```bash
# Create Grafana dashboard configuration
cat > grafana-dashboard.json << EOF
{
  "dashboard": {
    "id": null,
    "title": "Infrastructure Monitoring",
    "tags": ["infrastructure"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "CPU Usage",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "cpu_usage_percent",
            "legendFormat": "{{instance}} CPU"
          }
        ],
        "yAxes": [
          {
            "min": 0,
            "max": 100,
            "unit": "percent"
          }
        ]
      },
      {
        "id": 2,
        "title": "Memory Usage",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "memory_usage_percent",
            "legendFormat": "{{instance}} Memory"
          }
        ]
      },
      {
        "id": 3,
        "title": "HTTP Request Rate",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8},
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "id": 4,
        "title": "Response Time",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8},
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "5s"
  }
}
EOF
```

### Step 3: Docker Compose Setup 🐳

```yaml
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alert_rules.yml:/etc/prometheus/alert_rules.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-storage:/var/lib/grafana

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

  web-app:
    image: nginx:latest
    container_name: web-app
    ports:
      - "8080:80"

volumes:
  grafana-storage:
EOF
```

### Step 4: Set Up Alerting 🚨

```yaml
# Create alertmanager.yml
cat > alertmanager.yml << EOF
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@company.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
- name: 'web.hook'
  email_configs:
  - to: 'admin@company.com'
    subject: 'Alert: {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}
  
  slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#alerts'
    title: 'Infrastructure Alert'
    text: |
      {{ range .Alerts }}
      *Alert:* {{ .Annotations.summary }}
      *Description:* {{ .Annotations.description }}
      *Severity:* {{ .Labels.severity }}
      {{ end }}

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
EOF
```

### Step 5: Start the Monitoring Stack 🚀

```bash
# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# Access the services:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin123)
# AlertManager: http://localhost:9093

# Import Grafana dashboard
curl -X POST \
  http://admin:admin123@localhost:3000/api/dashboards/db \
  -H 'Content-Type: application/json' \
  -d @grafana-dashboard.json
```

### Step 6: Application Metrics 📱

```python
# Example Python Flask app with metrics
from flask import Flask, request
from prometheus_client import Counter, Histogram, generate_latest
import time
import random

app = Flask(__name__)

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    request_latency = time.time() - request.start_time
    REQUEST_LATENCY.observe(request_latency)
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.endpoint,
        status=response.status_code
    ).inc()
    return response

@app.route('/')
def hello():
    # Simulate some processing time
    time.sleep(random.uniform(0.1, 0.5))
    return "Hello, World!"

@app.route('/slow')
def slow():
    # Simulate slow endpoint
    time.sleep(random.uniform(1, 3))
    return "This is a slow endpoint"

@app.route('/error')
def error():
    # Simulate errors
    if random.random() < 0.3:
        return "Internal Server Error", 500
    return "Success"

@app.route('/metrics')
def metrics():
    return generate_latest()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

## 🚀 Real-World Monitoring Scenarios

### **Database Monitoring** 💾

```yaml
# PostgreSQL monitoring
- job_name: 'postgres'
  static_configs:
    - targets: ['postgres-exporter:9187']
  
# Key metrics to monitor:
# - pg_up (database availability)
# - pg_stat_database_tup_returned_total (query performance)
# - pg_stat_database_tup_inserted_total (write performance)
# - pg_locks_count (lock contention)
```

### **Kubernetes Monitoring** ⚓

```yaml
# Kubernetes cluster monitoring
- job_name: 'kubernetes-pods'
  kubernetes_sd_configs:
  - role: pod
  relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
    action: keep
    regex: true

# Key metrics:
# - kube_pod_status_phase (pod health)
# - kube_deployment_status_replicas (deployment status)
# - kube_node_status_condition (node health)
```

### **Application Performance Monitoring** 📱

```python
# Custom business metrics
from prometheus_client import Counter, Gauge

# Business metrics
USER_REGISTRATIONS = Counter('user_registrations_total', 'Total user registrations')
ACTIVE_USERS = Gauge('active_users_current', 'Currently active users')
ORDER_VALUE = Histogram('order_value_dollars', 'Order value in dollars')

# Track business events
@app.route('/register')
def register():
    # ... registration logic ...
    USER_REGISTRATIONS.inc()
    return "Registration successful"
```

## 📊 Monitoring Best Practices

### **Alert Fatigue Prevention** 🚨

```yaml
# Good alerting rules
groups:
- name: smart_alerts
  rules:
  # Alert on trends, not spikes
  - alert: CPUHighTrend
    expr: avg_over_time(cpu_usage_percent[10m]) > 80
    for: 5m
    
  # Use multiple severity levels
  - alert: DiskSpaceWarning
    expr: disk_usage_percent > 80
    labels:
      severity: warning
      
  - alert: DiskSpaceCritical
    expr: disk_usage_percent > 95
    labels:
      severity: critical
    
  # Alert on business impact
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 2m
```

### **SLI/SLO Monitoring** 🎯

```yaml
# Service Level Indicators (SLIs)
# What you measure

# Availability SLI
availability_sli = (
  sum(rate(http_requests_total{status!~"5.."}[5m])) /
  sum(rate(http_requests_total[5m]))
)

# Latency SLI
latency_sli = (
  histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
)

# Service Level Objectives (SLOs)
# What you promise

# 99.9% availability
availability_slo = 0.999

# 95% of requests under 200ms
latency_slo = 0.2
```

### **Monitoring as Code** 📝

```yaml
# Terraform for monitoring infrastructure
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "infrastructure-overview"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", "InstanceId", "i-1234567890abcdef0"],
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "mydb"]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "CPU Utilization"
        }
      }
    ]
  })
}
```

## 🎯 What's Next?

Now that you understand monitoring fundamentals, let's explore more advanced topics:

1. **[Logging and Metrics](24_Logging_and_Metrics.md)** - Deep dive into log management
2. **[Alerting and Incident Response](25_Alerting_and_Incident_Response.md)** - Handling emergencies
3. **[Performance Tuning](26_Performance_Tuning.md)** - Optimizing system performance

## 💡 Remember

Monitoring is like being a doctor for your infrastructure - you need to understand normal vital signs, recognize symptoms of problems, and know how to respond to emergencies. Good monitoring prevents small issues from becoming big disasters.

**Key Takeaway:** Monitor what matters to your users, not just what's easy to measure. Focus on business impact, not just technical metrics!

---

*"You can't improve what you don't measure."* - Peter Drucker 📊
