# Linux Basics 🐧

## 🌟 Real-World Story: Learning to Drive a Car

Imagine you're learning to drive a car. You need to understand:
- **Basic controls** (steering wheel, pedals, gear shift)
- **Navigation** (reading maps, understanding road signs)
- **Maintenance** (checking oil, tire pressure, fuel)
- **Safety rules** (traffic laws, emergency procedures)

**Learning Linux is exactly like learning to drive!** Linux is the "car" that powers most servers, and you need to know how to "drive" it effectively.

## 🎯 What is Linux?

Linux is like the **engine and controls** of most servers in the world. Just like you don't need to be a mechanic to drive a car, you don't need to be a kernel developer to use Linux effectively.

### 🚗 **Why Linux for Infrastructure?**

| Aspect | Linux | Windows Server |
|--------|-------|----------------|
| 🏠 **Cost** | Free (like public roads) | Expensive licenses (like toll roads) |
| 🔧 **Customization** | Highly customizable (like a custom car) | Limited customization (like a rental car) |
| 🛡️ **Security** | Very secure (like a bank vault) | Good but more targeted by attacks |
| 📊 **Performance** | Lightweight and fast | Heavier resource usage |
| 🌍 **Usage** | 96% of top 1 million servers | Mostly desktop and enterprise |

## 📊 Visual Representation: Linux System

```
🐧 LINUX SYSTEM ARCHITECTURE

👤 USER (You)
    |
    | (Commands like: ls, cd, mkdir)
    |
🖥️ SHELL (Command Interpreter)
    |-- bash (most common)
    |-- zsh (modern alternative)
    |-- fish (user-friendly)
    |
🔧 KERNEL (Linux Core)
    |-- Process management
    |-- Memory management
    |-- File system
    |-- Device drivers
    |
💻 HARDWARE
    |-- CPU, RAM, Storage, Network
```

## 💡 Essential Linux Commands

### **Navigation Commands** 🗺️
Think of these as **GPS commands** for your file system:

```bash
# Where am I? (like checking your current location)
pwd
# Output: /home/username

# What's here? (like looking around)
ls
# Output: Documents  Downloads  Pictures

# Go somewhere (like driving to a destination)
cd Documents
cd /home/username/Documents  # Absolute path (full address)
cd ../Downloads              # Relative path (go up one, then down)

# Go home (like going back to your house)
cd ~
# or just
cd
```

**Real-World Analogy:**
- `pwd` = "Where am I?" (like checking your GPS location)
- `ls` = "What's around me?" (like looking around a neighborhood)
- `cd` = "Go to..." (like driving to a specific address)

### **File Operations** 📁
Think of these as **file cabinet operations**:

```bash
# Create a new folder (like adding a new drawer)
mkdir my_project
mkdir -p projects/web/frontend  # Create nested folders

# Create a new file (like adding a new document)
touch README.md
echo "Hello World" > hello.txt

# Copy files (like photocopying documents)
cp hello.txt hello_backup.txt
cp -r my_project my_project_backup  # Copy folder and contents

# Move/rename files (like moving files between drawers)
mv hello.txt greeting.txt           # Rename
mv greeting.txt Documents/          # Move to Documents folder

# Delete files (like shredding documents)
rm greeting.txt                     # Delete file
rm -r my_project_backup            # Delete folder and contents
```

### **Viewing File Contents** 👀
Think of these as **different ways to read documents**:

```bash
# Quick peek (like reading the first page)
head README.md

# Read the end (like checking the conclusion)
tail README.md
tail -f /var/log/system.log  # Follow live updates (like watching news)

# Read everything (like reading the whole document)
cat README.md

# Read page by page (like flipping through a book)
less README.md
# Use arrow keys to navigate, 'q' to quit

# Search inside files (like using Ctrl+F)
grep "error" /var/log/system.log
grep -r "TODO" .  # Search in all files in current directory
```

### **File Permissions** 🔐
Think of permissions as **access control** for buildings:

```bash
# Check permissions (like checking who can enter a building)
ls -l
# Output: -rw-r--r-- 1 user group 1024 Jan 1 12:00 file.txt

# Permission breakdown:
# -rw-r--r--
# |||||||||
# ||||||||└─ Others can read
# |||||||└── Others cannot write
# ||||||└─── Others cannot execute
# |||||└──── Group can read
# ||||└───── Group cannot write  
# |||└────── Group cannot execute
# ||└─────── Owner can read
# |└──────── Owner can write
# └───────── Owner cannot execute (- means file, d means directory)

# Change permissions (like changing building access)
chmod 755 script.sh    # Owner: read/write/execute, Others: read/execute
chmod +x script.sh     # Add execute permission
chmod -w file.txt      # Remove write permission
```

**Permission Analogy:**
- **Read (r)** = Can look at the document
- **Write (w)** = Can edit the document  
- **Execute (x)** = Can run the program (like starting a car)

### **Process Management** ⚙️
Think of processes as **running programs** in your computer:

```bash
# See what's running (like checking active employees)
ps aux
top          # Live view (like a security monitor)
htop         # Better live view (if installed)

# Find specific processes (like finding a specific employee)
ps aux | grep nginx
pgrep nginx

# Stop a process (like asking someone to stop working)
kill 1234           # Stop process with ID 1234
killall nginx       # Stop all nginx processes
kill -9 1234        # Force stop (like emergency shutdown)

# Run programs in background (like delegating tasks)
./long_running_script.sh &
nohup ./script.sh &  # Keep running even if you log out
```

### **System Information** 📊
Think of these as **health checkups** for your system:

```bash
# Check system resources (like checking vital signs)
df -h          # Disk space (like checking fuel gauge)
free -h        # Memory usage (like checking available seats)
uptime         # How long system has been running
uname -a       # System information

# Check who's logged in (like checking building occupancy)
who
w              # More detailed info

# Check system logs (like reading medical records)
dmesg          # Kernel messages
journalctl     # System logs (on systemd systems)
```

## 🔧 Essential Linux Concepts

### **File System Hierarchy** 🌳
Linux organizes files like a **city with different districts**:

```
🏢 / (Root - like city center)
├── 🏠 home/          (User homes - like residential area)
│   └── username/     (Your personal space)
├── 🏛️ etc/           (Configuration files - like city hall)
├── 📚 var/           (Variable data - like libraries)
│   ├── log/          (Log files - like city records)
│   └── www/          (Web files - like public displays)
├── 🔧 usr/           (User programs - like shopping district)
│   ├── bin/          (User binaries)
│   └── local/        (Locally installed software)
├── ⚙️ bin/           (Essential binaries - like emergency services)
├── 🔧 sbin/          (System binaries - like maintenance)
└── 💾 tmp/           (Temporary files - like parking lots)
```

### **Environment Variables** 🌍
Environment variables are like **global settings** for your system:

```bash
# Check your environment (like checking your personal settings)
env
printenv

# Important variables:
echo $HOME     # Your home directory
echo $PATH     # Where system looks for programs
echo $USER     # Your username
echo $SHELL    # Your default shell

# Set temporary variable (like a sticky note)
export MY_VAR="Hello World"
echo $MY_VAR

# Set permanent variable (add to ~/.bashrc)
echo 'export MY_VAR="Hello World"' >> ~/.bashrc
source ~/.bashrc  # Reload settings
```

### **Package Management** 📦
Package managers are like **app stores** for Linux:

```bash
# Ubuntu/Debian (apt)
sudo apt update                    # Update package list
sudo apt upgrade                   # Upgrade installed packages
sudo apt install nginx            # Install new package
sudo apt remove nginx             # Remove package
sudo apt search web-server        # Search for packages

# CentOS/RHEL (yum/dnf)
sudo yum update                    # Update packages
sudo yum install nginx            # Install package
sudo yum remove nginx             # Remove package

# Check installed packages
apt list --installed              # Ubuntu/Debian
yum list installed               # CentOS/RHEL
```

### **Services and Systemd** 🔄
Services are like **background workers** in your system:

```bash
# Check service status (like checking if workers are active)
sudo systemctl status nginx
sudo systemctl status ssh

# Start/stop services (like hiring/firing workers)
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# Enable/disable services (like permanent hiring/firing)
sudo systemctl enable nginx       # Start automatically on boot
sudo systemctl disable nginx      # Don't start on boot

# Check all services
systemctl list-units --type=service
```

## 🎮 Practice Exercise: Linux File Detective

**Scenario:** You're investigating a web server that's running slowly. Use Linux commands to gather information.

### Mission 1: System Health Check 🏥
```bash
# Check system resources
df -h                    # Is disk space full?
free -h                  # Is memory exhausted?
uptime                   # How long has system been running?
top                      # What processes are using resources?
```

### Mission 2: Find the Web Server 🔍
```bash
# Find web server processes
ps aux | grep nginx      # Is nginx running?
ps aux | grep apache     # Is Apache running?
sudo netstat -tlnp       # What ports are being used?
```

### Mission 3: Check Logs 📋
```bash
# Check web server logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f
```

### Mission 4: Check Configuration 🔧
```bash
# Find configuration files
find /etc -name "*nginx*" -type f
ls -la /etc/nginx/
cat /etc/nginx/nginx.conf
```

## 🚀 Real-World Linux Usage

### **Web Server Management** 🌐
```bash
# Install and configure nginx
sudo apt update
sudo apt install nginx

# Start the service
sudo systemctl start nginx
sudo systemctl enable nginx

# Check if it's working
curl localhost
# or
wget -qO- localhost

# Edit configuration
sudo nano /etc/nginx/sites-available/default

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

### **Log Analysis** 📊
```bash
# Find errors in logs
grep -i error /var/log/nginx/error.log

# Count requests by IP
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr

# Monitor live traffic
tail -f /var/log/nginx/access.log

# Find large files
find /var/log -type f -size +100M
```

### **System Monitoring** 📈
```bash
# Check disk usage by directory
du -sh /var/log/*
du -sh /home/*

# Monitor system performance
iostat 1        # I/O statistics
vmstat 1        # Virtual memory statistics
sar -u 1 10     # CPU usage over time
```

## 📚 Essential Linux Tools

### **Text Editors** ✏️
```bash
# Nano (beginner-friendly)
nano filename.txt
# Ctrl+X to exit, Ctrl+O to save

# Vim (powerful but complex)
vim filename.txt
# Press 'i' to insert, 'Esc' then ':wq' to save and quit

# VS Code (if available)
code filename.txt
```

### **Network Tools** 🌐
```bash
# Check network connectivity
ping google.com
ping -c 4 8.8.8.8

# Check open ports
sudo netstat -tlnp
sudo ss -tlnp

# Download files
wget https://example.com/file.zip
curl -O https://example.com/file.zip

# Check DNS
nslookup google.com
dig google.com
```

### **Archive and Compression** 📦
```bash
# Create archive
tar -czf backup.tar.gz /home/user/documents

# Extract archive
tar -xzf backup.tar.gz

# Zip files
zip -r archive.zip folder/
unzip archive.zip
```

## 🎯 Linux Security Basics

### **User Management** 👥
```bash
# Add new user
sudo adduser newuser

# Add user to group
sudo usermod -aG sudo newuser    # Add to sudo group
sudo usermod -aG docker newuser  # Add to docker group

# Switch user
su - newuser
sudo -u newuser command

# Check user info
id
groups
whoami
```

### **SSH (Secure Shell)** 🔐
```bash
# Connect to remote server
ssh username@server-ip
ssh -i ~/.ssh/private_key username@server-ip

# Generate SSH key pair
ssh-keygen -t rsa -b 4096

# Copy public key to server
ssh-copy-id username@server-ip

# SSH config file (~/.ssh/config)
Host myserver
    HostName 192.168.1.100
    User myuser
    IdentityFile ~/.ssh/my_private_key
```

### **Firewall Basics** 🛡️
```bash
# UFW (Ubuntu Firewall)
sudo ufw status
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow from 192.168.1.0/24

# iptables (more advanced)
sudo iptables -L
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

## 💡 Linux Best Practices

### **Command Line Efficiency** ⚡
```bash
# Use tab completion
cd Doc[TAB]  # Completes to Documents/

# Command history
history
!!           # Run last command
!grep        # Run last command starting with 'grep'
Ctrl+R       # Search command history

# Aliases (shortcuts)
alias ll='ls -la'
alias la='ls -la'
alias ..='cd ..'

# Add to ~/.bashrc to make permanent
echo "alias ll='ls -la'" >> ~/.bashrc
```

### **Safety Tips** ⚠️
```bash
# Always backup before making changes
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Use sudo carefully
sudo rm -rf /    # DON'T DO THIS! (Deletes everything)

# Test commands first
ls -la /path/to/delete  # Check what you're about to delete
rm -i file.txt          # Interactive deletion (asks for confirmation)

# Use version control for configuration
git init /etc/nginx
git add .
git commit -m "Initial nginx config"
```

## 🎯 What's Next?

Now that you have Linux basics down, let's learn about networking:

1. **[Networking Essentials](04_Networking_Essentials.md)** - Understand how systems communicate
2. **[Docker Basics](../02_Containerization/05_Docker_Basics.md)** - Start containerizing applications
3. **[Jenkins Basics](../04_CI_CD/12_Jenkins_Basics.md)** - Automate your workflows

## 💡 Remember

Linux is like learning to drive - it seems overwhelming at first, but once you master the basics, it becomes second nature. Start with simple commands and gradually build up to more complex operations.

**Key Takeaway:** Linux mastery comes from practice. Don't be afraid to experiment in a safe environment!

---

*"Linux is only free if your time has no value."* - Jamie Zawinski (But once you learn it, it saves you tons of time!) 🐧
