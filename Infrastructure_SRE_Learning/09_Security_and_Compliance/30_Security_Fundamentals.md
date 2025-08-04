# Security Fundamentals 🔒

## 🌟 Real-World Story: The Medieval Castle Defense System

Imagine you're the chief security officer of a medieval castle protecting the kingdom's most valuable treasures. You need multiple layers of defense:

**Outer Perimeter** (like network security):
- **Moat and walls** to keep invaders out
- **Watchtowers** to monitor approaching threats
- **Drawbridge controls** to manage who enters

**Inner Defenses** (like application security):
- **Guard checkpoints** at every gate
- **Identity verification** for all visitors
- **Escort protocols** for sensitive areas

**Treasure Vault** (like data security):
- **Multiple locks** with different keys
- **Encrypted storage** for the most valuable items
- **Access logs** tracking who touched what

**Personnel Security** (like user management):
- **Background checks** for all guards
- **Regular training** on security protocols
- **Principle of least privilege** (guards only access what they need)

**Incident Response** (like security monitoring):
- **Alarm systems** for immediate threats
- **Emergency procedures** for different scenarios
- **Regular drills** to test readiness

**Modern infrastructure security works exactly the same way!** Multiple layers of defense protecting your digital kingdom.

## 🎯 What is Infrastructure Security?

Infrastructure security is like building a **comprehensive defense system** for your digital assets. It involves multiple layers of protection, from network perimeters to application code, ensuring that your systems remain secure against various threats.

### 🏰 **No Security vs Comprehensive Security**

| No Security | Comprehensive Security |
|------------|----------------------|
| 🚪 **Open doors everywhere** | 🔒 **Multiple layers of protection** |
| 🤷 **"Security through obscurity"** | 🛡️ **Defense in depth strategy** |
| 😱 **React after breaches** | 🚨 **Proactive threat detection** |
| 💸 **Expensive incident recovery** | 💰 **Prevention costs less than cure** |
| 🔥 **Single point of failure** | 🌐 **Redundant security controls** |

## 📊 Visual Representation: Security Architecture

```
🏰 COMPREHENSIVE SECURITY ARCHITECTURE

🌐 PERIMETER SECURITY (Castle Walls)
├── 🔥 Firewall (Main gate)
├── 🛡️ WAF - Web Application Firewall (Specialized guards)
├── 🚨 DDoS Protection (Siege defense)
└── 🕵️ Intrusion Detection (Watchtowers)

🔐 IDENTITY & ACCESS MANAGEMENT (Guard System)
├── 👤 Authentication (Who are you?)
├── 🎫 Authorization (What can you do?)
├── 🔑 Multi-Factor Authentication (Multiple keys)
└── 📋 Single Sign-On (Master key system)

🛡️ APPLICATION SECURITY (Inner Defenses)
├── 🔒 HTTPS/TLS (Encrypted communications)
├── 🧪 Input Validation (Check all packages)
├── 🔐 API Security (Secure messengers)
└── 🏷️ Security Headers (Safety protocols)

💾 DATA SECURITY (Treasure Vault)
├── 🔐 Encryption at Rest (Locked chests)
├── 🚀 Encryption in Transit (Secure transport)
├── 🗝️ Key Management (Master locksmith)
└── 🗄️ Database Security (Vault protection)

📊 MONITORING & COMPLIANCE (Security Operations)
├── 📈 SIEM - Security Information Event Management
├── 🔍 Vulnerability Scanning (Regular inspections)
├── 📋 Compliance Audits (Royal inspections)
└── 🚨 Incident Response (Emergency procedures)
```

## 💡 Core Security Principles

### **CIA Triad** 🔺
The foundation of information security, like the three pillars of castle defense:

**Confidentiality** = **Keep Secrets Safe** 🤫
```bash
# Like ensuring only authorized people read sensitive documents
# Encryption, access controls, data classification

# Example: Encrypt sensitive data
echo "sensitive data" | openssl enc -aes-256-cbc -a -salt -pass pass:mypassword

# Example: File permissions
chmod 600 sensitive_file.txt  # Only owner can read/write
chmod 700 private_directory/  # Only owner can access
```

**Integrity** = **Prevent Tampering** ✅
```bash
# Like ensuring documents haven't been altered
# Checksums, digital signatures, version control

# Example: Create checksum to verify file integrity
sha256sum important_file.txt > important_file.sha256
# Later, verify integrity:
sha256sum -c important_file.sha256

# Example: Git for code integrity
git commit -S -m "Signed commit for integrity"  # GPG signed commit
```

**Availability** = **Keep Services Running** ⚡
```bash
# Like ensuring the castle gates are always operational
# Redundancy, backups, disaster recovery

# Example: High availability setup
# Load balancer + multiple servers + health checks
# Backup systems + monitoring + auto-failover
```

### **Defense in Depth** 🛡️
Multiple security layers, like concentric castle walls:

```bash
# Layer 1: Network Security (Outer walls)
# Firewalls, VPNs, network segmentation

# Layer 2: Host Security (Inner walls)
# OS hardening, antivirus, host-based firewalls

# Layer 3: Application Security (Guard posts)
# Input validation, authentication, authorization

# Layer 4: Data Security (Treasure vault)
# Encryption, access controls, data loss prevention

# Layer 5: Physical Security (Castle grounds)
# Secure data centers, access controls, surveillance
```

### **Principle of Least Privilege** 👤
Give minimum necessary access, like castle guards only accessing their assigned areas:

```bash
# Bad: Give admin access to everyone
sudo usermod -aG sudo everyone  # DON'T DO THIS!

# Good: Give specific permissions for specific tasks
# Create role-based access
sudo groupadd developers
sudo groupadd database_admins
sudo groupadd web_admins

# Grant specific permissions
# developers: can deploy code
# database_admins: can manage databases
# web_admins: can manage web servers

# Example: Database permissions
GRANT SELECT, INSERT, UPDATE ON app_db.users TO 'app_user'@'localhost';
# Don't grant DELETE or DROP unless necessary
```

## 🔧 Network Security

### **Firewalls** 🔥
Firewalls are like castle gates with guards checking everyone:

```bash
# iptables (Linux firewall)
# Allow SSH (port 22) only from specific IP
iptables -A INPUT -p tcp -s 192.168.1.100 --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP

# Allow HTTP (port 80) and HTTPS (port 443) from anywhere
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Block all other incoming traffic
iptables -A INPUT -j DROP

# UFW (Uncomplicated Firewall) - easier syntax
ufw allow from 192.168.1.100 to any port 22
ufw allow 80
ufw allow 443
ufw deny incoming
ufw enable
```

### **VPN (Virtual Private Network)** 🔐
VPNs are like secret tunnels between castles:

```bash
# OpenVPN server setup
# Install OpenVPN
sudo apt install openvpn easy-rsa

# Generate certificates
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
source vars
./clean-all
./build-ca
./build-key-server server
./build-dh

# OpenVPN client configuration
client
dev tun
proto udp
remote your-server-ip 1194
resolv-retry infinite
nobind
user nobody
group nogroup
persist-key
persist-tun
ca ca.crt
cert client.crt
key client.key
remote-cert-tls server
cipher AES-256-CBC
verb 3
```

### **Network Segmentation** 🏗️
Divide network into zones, like different castle districts:

```bash
# VLAN configuration (network segmentation)
# DMZ (Demilitarized Zone) - public-facing services
# Internal network - private services
# Management network - admin access only

# Example network design:
# DMZ: 10.0.1.0/24 (web servers, load balancers)
# Internal: 10.0.2.0/24 (application servers, databases)
# Management: 10.0.3.0/24 (monitoring, backup systems)

# Firewall rules between segments
# DMZ can access Internal on specific ports only
# Internal cannot access DMZ
# Management can access all for monitoring
```

## 🔐 Identity and Access Management (IAM)

### **Authentication** 👤
Proving who you are, like showing your ID at the castle gate:

```bash
# Password-based authentication
# Strong password requirements
# - Minimum 12 characters
# - Mix of uppercase, lowercase, numbers, symbols
# - No dictionary words
# - Regular rotation

# SSH key-based authentication (more secure)
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id user@server

# Disable password authentication
# In /etc/ssh/sshd_config:
PasswordAuthentication no
PubkeyAuthentication yes
```

### **Multi-Factor Authentication (MFA)** 🔑
Multiple forms of proof, like requiring both ID and secret password:

```bash
# Google Authenticator setup for SSH
# Install Google Authenticator
sudo apt install libpam-google-authenticator

# Configure for user
google-authenticator

# Configure SSH to use MFA
# In /etc/pam.d/sshd:
auth required pam_google_authenticator.so

# In /etc/ssh/sshd_config:
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

### **Role-Based Access Control (RBAC)** 🎭
Assign permissions based on roles, like different types of castle guards:

```yaml
# Kubernetes RBAC example
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: developer
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "patch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: production
subjects:
- kind: User
  name: john.doe
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

## 🛡️ Application Security

### **HTTPS/TLS** 🔒
Encrypted communication, like secret codes between messengers:

```bash
# Generate SSL certificate with Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Get certificate for your domain
sudo certbot --nginx -d yourdomain.com

# Nginx HTTPS configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### **Input Validation** 🧪
Check all inputs, like guards inspecting packages:

```python
# Python input validation example
import re
from flask import Flask, request, jsonify

app = Flask(__name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    # At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True

def sanitize_input(user_input):
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '|', '`']
    for char in dangerous_chars:
        user_input = user_input.replace(char, '')
    return user_input.strip()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate email
    if not validate_email(data.get('email', '')):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password
    if not validate_password(data.get('password', '')):
        return jsonify({'error': 'Password does not meet requirements'}), 400
    
    # Sanitize name input
    name = sanitize_input(data.get('name', ''))
    
    # Process registration...
    return jsonify({'message': 'Registration successful'})
```

### **SQL Injection Prevention** 💉
Prevent malicious database queries, like checking for hidden weapons:

```python
# Bad: Vulnerable to SQL injection
def get_user_bad(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    # If user_id = "1; DROP TABLE users; --", this deletes the table!
    return execute_query(query)

# Good: Use parameterized queries
def get_user_good(user_id):
    query = "SELECT * FROM users WHERE id = %s"
    return execute_query(query, (user_id,))

# Python with SQLAlchemy (ORM)
from sqlalchemy import text

def get_user_safe(user_id):
    query = text("SELECT * FROM users WHERE id = :user_id")
    return session.execute(query, {"user_id": user_id})

# Example of SQL injection attack and prevention
# Malicious input: "1' OR '1'='1"
# Vulnerable query: SELECT * FROM users WHERE id = '1' OR '1'='1'
# This returns ALL users instead of just one!

# With parameterized queries, the input is treated as data, not code
```

### **API Security** 🔗
Secure your APIs, like controlling messenger access:

```python
# API authentication with JWT tokens
import jwt
from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Remove 'Bearer ' prefix
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = get_user_by_id(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/sensitive-data')
@limiter.limit("5 per minute")
@token_required
def get_sensitive_data(current_user):
    return jsonify({'data': 'sensitive information'})

# CORS (Cross-Origin Resource Sharing) configuration
from flask_cors import CORS

CORS(app, origins=['https://yourdomain.com'])  # Only allow specific origins
```

## 💾 Data Security

### **Encryption at Rest** 🔐
Encrypt stored data, like locking treasure chests:

```bash
# File system encryption with LUKS
# Encrypt a partition
sudo cryptsetup luksFormat /dev/sdb1

# Open encrypted partition
sudo cryptsetup luksOpen /dev/sdb1 encrypted_drive

# Mount encrypted drive
sudo mount /dev/mapper/encrypted_drive /mnt/secure

# Database encryption (MySQL)
# Enable encryption in my.cnf
[mysqld]
innodb_encrypt_tables=ON
innodb_encrypt_log=ON
innodb_encryption_threads=4

# Application-level encryption (Python)
from cryptography.fernet import Fernet

# Generate encryption key
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Encrypt data
sensitive_data = "Social Security Number: 123-45-6789"
encrypted_data = cipher_suite.encrypt(sensitive_data.encode())

# Decrypt data
decrypted_data = cipher_suite.decrypt(encrypted_data).decode()
```

### **Encryption in Transit** 🚀
Encrypt data movement, like secret courier routes:

```bash
# TLS for web traffic (already covered in HTTPS section)

# SSH for secure remote access
ssh -i ~/.ssh/id_rsa user@server

# VPN for network traffic
# OpenVPN, WireGuard, IPSec

# Database connections with TLS
# MySQL with SSL
mysql --ssl-ca=ca.pem --ssl-cert=client-cert.pem --ssl-key=client-key.pem -h hostname -u username -p

# Redis with TLS
redis-cli --tls --cert ./redis.crt --key ./redis.key --cacert ./ca.crt
```

### **Key Management** 🗝️
Manage encryption keys, like a master locksmith:

```bash
# HashiCorp Vault for key management
# Install Vault
wget https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip
unzip vault_1.15.0_linux_amd64.zip
sudo mv vault /usr/local/bin/

# Start Vault server
vault server -dev

# Store secrets
vault kv put secret/myapp/db password="supersecret123"

# Retrieve secrets
vault kv get secret/myapp/db

# AWS KMS (Key Management Service)
aws kms create-key --description "My application key"

# Encrypt data with KMS
aws kms encrypt --key-id alias/my-key --plaintext "sensitive data"

# Decrypt data
aws kms decrypt --ciphertext-blob fileb://encrypted-data
```

## 🎮 Practice Exercise: Secure a Web Application

Let's implement comprehensive security for a web application!

### Step 1: Secure Infrastructure Setup 🏗️

```bash
# Create secure server setup script
cat > secure_server_setup.sh << 'EOF'
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install security tools
sudo apt install -y ufw fail2ban unattended-upgrades

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Configure fail2ban (intrusion prevention)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# SSH hardening
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Enable automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Install and configure ClamAV (antivirus)
sudo apt install -y clamav clamav-daemon
sudo freshclam
sudo systemctl enable clamav-daemon

echo "Server security hardening complete!"
EOF

chmod +x secure_server_setup.sh
```

### Step 2: Secure Web Application 🌐

```python
# secure_app.py - Flask application with security features
from flask import Flask, request, jsonify, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
import bcrypt
import jwt
import re
import logging
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'your-super-secret-key-change-this'

# Security headers with Talisman
Talisman(app, force_https=True)

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per day", "100 per hour"]
)

# Logging configuration
logging.basicConfig(
    filename='security.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

# Input validation functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain digit"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain special character"
    return True, "Valid password"

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, app.secret_key, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Security middleware
@app.before_request
def security_headers():
    # Log all requests
    logging.info(f"Request: {request.method} {request.path} from {request.remote_addr}")
    
    # Check for suspicious patterns
    suspicious_patterns = ['<script', 'javascript:', 'onload=', 'onerror=']
    for param in request.args.values():
        for pattern in suspicious_patterns:
            if pattern.lower() in param.lower():
                logging.warning(f"Suspicious request detected: {param} from {request.remote_addr}")
                return jsonify({'error': 'Suspicious request detected'}), 400

@app.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    try:
        data = request.get_json()
        
        # Input validation
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Store user (in real app, use database)
        # user_id = store_user(email, hashed_password)
        
        logging.info(f"User registered: {email}")
        return jsonify({'message': 'Registration successful'}), 201
        
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Check credentials (in real app, check against database)
        # user = get_user_by_email(email)
        # if user and check_password(password, user.password_hash):
        #     token = generate_token(user.id)
        #     return jsonify({'token': token})
        
        # Simulate successful login
        token = generate_token(1)
        logging.info(f"User logged in: {email}")
        return jsonify({'token': token})
        
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/protected', methods=['GET'])
@limiter.limit("100 per minute")
def protected():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({'error': 'Token required'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401
        
        return jsonify({'message': 'Access granted', 'user_id': user_id})
        
    except Exception as e:
        logging.error(f"Token verification error: {str(e)}")
        return jsonify({'error': 'Invalid token'}), 401

@app.errorhandler(429)
def ratelimit_handler(e):
    logging.warning(f"Rate limit exceeded: {request.remote_addr}")
    return jsonify({'error': 'Rate limit exceeded'}), 429

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

### Step 3: Database Security 🗄️

```sql
-- Database security configuration
-- Create application user with limited privileges
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_random_password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE ON myapp.users TO 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON myapp.sessions TO 'app_user'@'localhost';

-- Enable SSL for database connections
-- In my.cnf:
[mysqld]
ssl-ca=/path/to/ca.pem
ssl-cert=/path/to/server-cert.pem
ssl-key=/path/to/server-key.pem
require_secure_transport=ON

-- Enable audit logging
INSTALL PLUGIN audit_log SONAME 'audit_log.so';
SET GLOBAL audit_log_policy=ALL;

-- Create security views (hide sensitive data)
CREATE VIEW user_public AS
SELECT id, username, email, created_at
FROM users;

-- Don't expose password hashes in views
```

### Step 4: Monitoring and Alerting 🚨

```bash
# Security monitoring script
cat > security_monitor.sh << 'EOF'
#!/bin/bash

LOG_FILE="/var/log/security_monitor.log"
ALERT_EMAIL="admin@yourcompany.com"

# Function to send alerts
send_alert() {
    local message="$1"
    echo "$(date): SECURITY ALERT - $message" >> $LOG_FILE
    echo "$message" | mail -s "Security Alert" $ALERT_EMAIL
}

# Monitor failed login attempts
failed_logins=$(grep "Failed password" /var/log/auth.log | tail -n 100 | wc -l)
if [ $failed_logins -gt 10 ]; then
    send_alert "High number of failed login attempts: $failed_logins"
fi

# Monitor disk usage (potential DoS)
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 90 ]; then
    send_alert "Disk usage critical: ${disk_usage}%"
fi

# Monitor suspicious network connections
suspicious_connections=$(netstat -an | grep ":22" | grep "ESTABLISHED" | wc -l)
if [ $suspicious_connections -gt 20 ]; then
    send_alert "High number of SSH connections: $suspicious_connections"
fi

# Check for rootkits
if command -v rkhunter &> /dev/null; then
    rkhunter --check --sk | grep "Warning" && send_alert "Rootkit scanner found warnings"
fi

# Monitor file integrity
if command -v aide &> /dev/null; then
    aide --check | grep "changed" && send_alert "File integrity check found changes"
fi

echo "$(date): Security monitoring completed" >> $LOG_FILE
EOF

chmod +x security_monitor.sh

# Add to crontab for regular execution
echo "0 */6 * * * /path/to/security_monitor.sh" | crontab -
```

### Step 5: Incident Response Plan 🚨

```bash
# Incident response script
cat > incident_response.sh << 'EOF'
#!/bin/bash

INCIDENT_TYPE="$1"
SEVERITY="$2"

case $INCIDENT_TYPE in
    "breach")
        echo "SECURITY BREACH DETECTED"
        # Isolate affected systems
        # Block suspicious IPs
        # Preserve evidence
        # Notify stakeholders
        ;;
    "malware")
        echo "MALWARE DETECTED"
        # Quarantine infected systems
        # Run full system scan
        # Update antivirus definitions
        ;;
    "ddos")
        echo "DDoS ATTACK DETECTED"
        # Enable DDoS protection
        # Scale infrastructure
        # Block attack sources
        ;;
    *)
        echo "Unknown incident type"
