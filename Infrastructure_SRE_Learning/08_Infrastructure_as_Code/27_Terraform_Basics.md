# Terraform Basics 🏗️

## 🌟 Real-World Story: The Architect's Blueprint

Imagine you're a master architect tasked with building identical luxury hotels in 50 different cities worldwide. Without blueprints:
- **Each hotel would be different** (inconsistent quality and features)
- **Construction would be slow** (figuring out everything from scratch each time)
- **Mistakes would be repeated** (no learning from previous builds)
- **Changes would be nightmare** (modify 50 hotels individually)
- **No cost control** (unpredictable expenses for each project)

With detailed architectural blueprints:
- **Identical quality everywhere** (same luxury experience globally)
- **Rapid construction** (builders know exactly what to do)
- **Continuous improvement** (update blueprint, improve all future hotels)
- **Easy modifications** (change blueprint once, apply everywhere)
- **Predictable costs** (know exact materials and labor needed)

**Terraform is exactly like architectural blueprints for your infrastructure!** Instead of building hotels, you're building cloud infrastructure.

## 🎯 What is Terraform?

Terraform is like having **detailed blueprints and construction plans** for your infrastructure. It lets you define your entire infrastructure in code, then automatically builds, modifies, and manages it across any cloud provider.

### 🏗️ **Manual Infrastructure vs Infrastructure as Code**

| Manual Infrastructure | Infrastructure as Code (Terraform) |
|----------------------|-----------------------------------|
| 🖱️ **Click through web consoles** | 📝 **Write code to define infrastructure** |
| 😰 **"Did I configure this right?"** | ✅ **"Code review ensures correctness"** |
| 🔥 **Inconsistent environments** | 🎯 **Identical environments every time** |
| 💸 **Expensive mistakes** | 🔄 **Preview changes before applying** |
| 🤷 **"What's currently deployed?"** | 📊 **Complete infrastructure visibility** |

## 📊 Visual Representation: Terraform Workflow

```
🏗️ TERRAFORM INFRASTRUCTURE AS CODE WORKFLOW

📝 WRITE CODE (main.tf)
    |
    | terraform init (Download providers)
    |
📋 PLAN PHASE
    |-- terraform plan (Preview changes)
    |-- Review what will be created/modified/destroyed
    |-- Like reviewing architectural blueprints
    |
🚀 APPLY PHASE
    |-- terraform apply (Build infrastructure)
    |-- Creates actual cloud resources
    |-- Like construction crew building from blueprints
    |
📊 STATE MANAGEMENT
    |-- terraform.tfstate (Current infrastructure state)
    |-- Tracks what exists vs what should exist
    |-- Like building inspector's records
    |
🔄 MODIFY & REPEAT
    |-- Update code
    |-- Plan changes
    |-- Apply updates
    |-- Like renovating buildings from updated blueprints
```

## 💡 Core Terraform Concepts

### **Infrastructure as Code** 📝
Infrastructure as Code means describing your infrastructure using configuration files:

```hcl
# Simple web server infrastructure
resource "aws_instance" "web_server" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.micro"
  
  tags = {
    Name = "MyWebServer"
    Environment = "Production"
  }
}

resource "aws_security_group" "web_sg" {
  name_description = "Allow HTTP traffic"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Real-World Analogy:**
- **Resource** = Building component (server, database, network)
- **Provider** = Construction company (AWS, Google Cloud, Azure)
- **Configuration** = Blueprint specifications
- **State** = Current building status

### **Providers** 🏢
Providers are like **specialized construction companies** for different platforms:

```hcl
# Configure the AWS Provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Configure the Google Cloud Provider
provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}

# Configure the Azure Provider
provider "azurerm" {
  features {}
}
```

### **Resources** 🧱
Resources are the **building blocks** of your infrastructure:

```hcl
# Virtual Machine (like building a server room)
resource "aws_instance" "app_server" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  key_name      = "my-key-pair"
  
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = aws_subnet.public.id
  
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
              EOF
  
  tags = {
    Name = "AppServer"
    Type = "WebServer"
  }
}

# Database (like building a data vault)
resource "aws_db_instance" "app_database" {
  identifier = "app-db"
  
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage = 20
  storage_type      = "gp2"
  
  db_name  = "appdb"
  username = "admin"
  password = "supersecret123"
  
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot = true
  
  tags = {
    Name = "AppDatabase"
  }
}
```

### **Variables** 📋
Variables are like **customizable blueprint parameters**:

```hcl
# variables.tf
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Using variables in resources
resource "aws_instance" "web" {
  ami           = "ami-0abcdef1234567890"
  instance_type = var.instance_type
  
  tags = {
    Name        = "WebServer-${var.environment}"
    Environment = var.environment
  }
}
```

### **Outputs** 📤
Outputs are like **construction completion reports**:

```hcl
# outputs.tf
output "web_server_ip" {
  description = "Public IP address of the web server"
  value       = aws_instance.web.public_ip
}

output "database_endpoint" {
  description = "Database connection endpoint"
  value       = aws_db_instance.app_database.endpoint
  sensitive   = true
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}
```

## 🔧 Essential Terraform Commands

### **Basic Workflow** 🔄

```bash
# Initialize Terraform (like setting up construction site)
terraform init

# Validate configuration (like checking blueprints)
terraform validate

# Format code (like organizing blueprints neatly)
terraform fmt

# Plan changes (like construction estimate)
terraform plan

# Apply changes (like starting construction)
terraform apply

# Show current state (like building inspection)
terraform show

# Destroy infrastructure (like demolition)
terraform destroy
```

### **Advanced Commands** 🛠️

```bash
# Target specific resources (like renovating one room)
terraform plan -target=aws_instance.web
terraform apply -target=aws_instance.web

# Use variable files (like different building specifications)
terraform apply -var-file="production.tfvars"

# Import existing resources (like adding existing building to blueprints)
terraform import aws_instance.web i-1234567890abcdef0

# Refresh state (like updating building records)
terraform refresh

# Output specific values (like getting building address)
terraform output web_server_ip
```

## 🎮 Practice Exercise: Build Complete Infrastructure

Let's build a scalable web application infrastructure from scratch!

### Step 1: Project Setup 📁

```bash
# Create project directory
mkdir terraform-web-app
cd terraform-web-app

# Create main configuration files
touch main.tf variables.tf outputs.tf terraform.tfvars
```

### Step 2: Define Variables 📋

```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "webapp"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "min_size" {
  description = "Minimum number of instances in ASG"
  type        = number
  default     = 2
}

variable "max_size" {
  description = "Maximum number of instances in ASG"
  type        = number
  default     = 6
}

variable "desired_capacity" {
  description = "Desired number of instances in ASG"
  type        = number
  default     = 3
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
```

### Step 3: Create VPC and Networking 🌐

```hcl
# main.tf - VPC and Networking
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count = 2
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-public-${count.index + 1}"
    Type = "Public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count = 2
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "${var.project_name}-${var.environment}-private-${count.index + 1}"
    Type = "Private"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-public-rt"
  }
}

# Associate Public Subnets with Route Table
resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)
  
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
```

### Step 4: Security Groups 🔒

```hcl
# Security Groups
resource "aws_security_group" "web" {
  name_prefix = "${var.project_name}-${var.environment}-web-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-web-sg"
  }
}

resource "aws_security_group" "database" {
  name_prefix = "${var.project_name}-${var.environment}-db-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    description     = "MySQL/Aurora"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db-sg"
  }
}

resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}
```

### Step 5: Application Load Balancer ⚖️

```hcl
# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  
  tags = {
    Name = "${var.project_name}-${var.environment}-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "web" {
  name     = "${var.project_name}-${var.environment}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-tg"
  }
}

# Load Balancer Listener
resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}
```

### Step 6: Auto Scaling Group 📈

```hcl
# Launch Template
resource "aws_launch_template" "web" {
  name_prefix   = "${var.project_name}-${var.environment}-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = base64encode(<<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              
              # Create a simple web page
              cat <<HTML > /var/www/html/index.html
              <!DOCTYPE html>
              <html>
              <head>
                  <title>${var.project_name} - ${var.environment}</title>
                  <style>
                      body { font-family: Arial; text-align: center; margin-top: 50px; }
                      .container { background: #f0f0f0; padding: 20px; border-radius: 10px; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>🚀 Welcome to ${var.project_name}!</h1>
                      <p>Environment: ${var.environment}</p>
                      <p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>
                      <p>Built with Terraform! 🏗️</p>
                  </div>
              </body>
              </html>
HTML
              EOF
  )
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-${var.environment}-web"
    }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web" {
  name                = "${var.project_name}-${var.environment}-asg"
  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  
  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity
  
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}-asg"
    propagate_at_launch = false
  }
}
```

### Step 7: Database 💾

```hcl
# Database Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}-db"
  
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = "webapp"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  deletion_protection = false
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db"
  }
}
```

### Step 8: Outputs 📤

```hcl
# outputs.tf
output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "load_balancer_url" {
  description = "URL of the load balancer"
  value       = "http://${aws_lb.main.dns_name}"
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}
```

### Step 9: Variable Values 📋

```hcl
# terraform.tfvars
aws_region = "us-east-1"
environment = "dev"
project_name = "mywebapp"
instance_type = "t3.micro"
min_size = 2
max_size = 6
desired_capacity = 3
db_username = "admin"
db_password = "MySecurePassword123!"
```

### Step 10: Deploy Infrastructure 🚀

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply

# Check outputs
terraform output

# Test the application
curl $(terraform output -raw load_balancer_url)

# When done, destroy everything
terraform destroy
```

## 🚀 Real-World Terraform Patterns

### **Modules** 📦

```hcl
# modules/vpc/main.tf
variable "cidr_block" {
  description = "CIDR block for VPC"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.environment}-vpc"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

# Using the module
module "vpc" {
  source = "./modules/vpc"
  
  cidr_block  = "10.0.0.0/16"
  environment = "production"
}
```

### **Remote State** 🌐

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "webapp/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### **Workspaces** 🏢

```bash
# Create workspaces for different environments
terraform workspace new dev
terraform workspace new staging
terraform workspace new production

# Switch between workspaces
terraform workspace select dev
terraform apply -var-file="dev.tfvars"

terraform workspace select production
terraform apply -var-file="production.tfvars"
```

## 🎯 What's Next?

Now that you understand Terraform basics, let's explore more infrastructure topics:

1. **[Ansible Configuration](28_Ansible_Configuration.md)** - Configuration management
2. **[Infrastructure Automation](29_Infrastructure_Automation.md)** - Advanced automation patterns
3. **[Security Fundamentals](../09_Security_and_Compliance/30_Security_Fundamentals.md)** - Securing your infrastructure

## 💡 Remember

Terraform is like having a master architect who never forgets details, never makes inconsistent decisions, and can build identical structures anywhere in the world. Start with simple infrastructure and gradually build more complex, multi-environment setups.

**Key Takeaway:** Infrastructure as Code isn't just about automation - it's about consistency, repeatability, and treating infrastructure with the same discipline as application code!

---

*"Infrastructure as code is not about the tools, it's about the practice."* - Kief Morris 🏗️
