# AWS Fundamentals ☁️

## 🌟 Real-World Story: Building a Global Business Empire

Imagine you're starting a small business from your garage. As you grow, you need:
- **Office space** (but buying buildings is expensive)
- **Phone systems** (but setting up telecom infrastructure is complex)
- **Security guards** (but hiring and training takes time)
- **IT equipment** (but maintaining servers is costly)
- **Global expansion** (but opening offices worldwide is risky)

Then you discover **business centers and shared services**:
- **Rent office space** as needed (pay only for what you use)
- **Use shared phone systems** (professional setup, no maintenance)
- **Leverage shared security** (expert guards, 24/7 monitoring)
- **Access shared IT infrastructure** (enterprise-grade, always updated)
- **Expand globally instantly** (offices available worldwide)

**Amazon Web Services (AWS) is exactly like a global business center for technology!**

## 🎯 What is AWS?

AWS is like a **massive global business center** that provides technology services on-demand. Instead of buying and maintaining your own servers, you rent computing power, storage, and services from Amazon.

### 🏢 **Traditional IT vs AWS Cloud**

| Traditional IT | AWS Cloud |
|---------------|-----------|
| 🏗️ **Buy servers** (expensive upfront) | 💳 **Rent computing power** (pay as you go) |
| 🔧 **Maintain hardware** (time-consuming) | ☁️ **Amazon maintains everything** (focus on your app) |
| 📍 **Limited to one location** | 🌍 **Global presence instantly** |
| 📈 **Hard to scale** (buy more servers) | ⚡ **Scale instantly** (click a button) |
| 💸 **High fixed costs** | 📊 **Variable costs** (scale up/down) |

## 📊 Visual Representation: AWS Global Infrastructure

```
🌍 AWS GLOBAL INFRASTRUCTURE

🌎 REGIONS (Geographic Areas)
├── 🇺🇸 US East (N. Virginia)
├── 🇺🇸 US West (Oregon)
├── 🇪🇺 Europe (Ireland)
├── 🇯🇵 Asia Pacific (Tokyo)
└── 🇧🇷 South America (São Paulo)

🏢 AVAILABILITY ZONES (Data Centers in Each Region)
├── AZ-1a (Data Center 1)
├── AZ-1b (Data Center 2)
└── AZ-1c (Data Center 3)

🌐 EDGE LOCATIONS (Content Delivery)
├── 📍 200+ locations worldwide
└── 🚀 Faster content delivery to users
```

## 💡 Core AWS Services

### **Compute Services** 💻

**EC2 (Elastic Compute Cloud)** = **Virtual Computers** 🖥️
```bash
# Like renting computers in the cloud
# You get full control over the operating system

# Launch an EC2 instance
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-group-ids sg-903004f8

# Connect to your instance
ssh -i my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```

**Lambda** = **Serverless Functions** ⚡
```python
# Like hiring someone to do a specific task
# You don't manage servers, just write code

import json

def lambda_handler(event, context):
    # This function runs when triggered
    name = event.get('name', 'World')
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello {name}!')
    }

# AWS automatically:
# - Runs your code when needed
# - Scales to handle any load
# - Charges only for execution time
```

**ECS (Elastic Container Service)** = **Container Management** 🐳
```yaml
# Like having a container shipping manager
# Runs and manages your Docker containers

version: '3'
services:
  web:
    image: my-web-app:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3  # Run 3 copies for high availability
```

### **Storage Services** 💾

**S3 (Simple Storage Service)** = **Unlimited File Cabinet** 📁
```bash
# Like having infinite storage space
# Store any type of file, any amount

# Create a bucket (like creating a folder)
aws s3 mb s3://my-company-files

# Upload files
aws s3 cp my-document.pdf s3://my-company-files/
aws s3 cp ./website/ s3://my-website-bucket/ --recursive

# Make files public (for websites)
aws s3 website s3://my-website-bucket --index-document index.html

# Access your files
# https://my-company-files.s3.amazonaws.com/my-document.pdf
```

**EBS (Elastic Block Store)** = **Hard Drives for EC2** 💿
```bash
# Like attaching external hard drives to your computers

# Create a volume (hard drive)
aws ec2 create-volume \
    --size 100 \
    --volume-type gp3 \
    --availability-zone us-east-1a

# Attach to EC2 instance
aws ec2 attach-volume \
    --volume-id vol-1234567890abcdef0 \
    --instance-id i-1234567890abcdef0 \
    --device /dev/sdf
```

**EFS (Elastic File System)** = **Shared Network Drive** 🗂️
```bash
# Like having a shared drive that multiple computers can access

# Create file system
aws efs create-file-system --creation-token my-shared-drive

# Mount on multiple EC2 instances
sudo mount -t efs fs-12345678:/ /mnt/shared
```

### **Database Services** 🗄️

**RDS (Relational Database Service)** = **Managed Databases** 🏪
```bash
# Like hiring a database administrator
# AWS manages backups, updates, scaling

# Create MySQL database
aws rds create-db-instance \
    --db-instance-identifier my-database \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password mypassword \
    --allocated-storage 20

# Connect to your database
mysql -h my-database.abcdefg.us-east-1.rds.amazonaws.com -u admin -p
```

**DynamoDB** = **NoSQL Database** 📊
```python
# Like having a super-fast filing system
# No SQL required, just store JSON documents

import boto3

# Create DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Create table
table = dynamodb.create_table(
    TableName='Users',
    KeySchema=[
        {'AttributeName': 'user_id', 'KeyType': 'HASH'}
    ],
    AttributeDefinitions=[
        {'AttributeName': 'user_id', 'AttributeType': 'S'}
    ],
    BillingMode='PAY_PER_REQUEST'
)

# Store data
table.put_item(
    Item={
        'user_id': '123',
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30
    }
)

# Retrieve data
response = table.get_item(Key={'user_id': '123'})
user = response['Item']
```

### **Networking Services** 🌐

**VPC (Virtual Private Cloud)** = **Private Network** 🏠
```bash
# Like creating your own private neighborhood in the cloud

# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets (like streets in your neighborhood)
aws ec2 create-subnet \
    --vpc-id vpc-12345678 \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-east-1a

# Create internet gateway (like the main entrance)
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway \
    --internet-gateway-id igw-12345678 \
    --vpc-id vpc-12345678
```

**Route 53** = **DNS Service** 📞
```bash
# Like a phone book for the internet
# Translates domain names to IP addresses

# Create hosted zone
aws route53 create-hosted-zone \
    --name example.com \
    --caller-reference $(date +%s)

# Add DNS record
aws route53 change-resource-record-sets \
    --hosted-zone-id Z123456789 \
    --change-batch '{
        "Changes": [{
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "www.example.com",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [{"Value": "192.0.2.1"}]
            }
        }]
    }'
```

**CloudFront** = **Content Delivery Network** 🚀
```bash
# Like having local stores worldwide
# Delivers content from locations close to users

# Create distribution
aws cloudfront create-distribution \
    --distribution-config '{
        "CallerReference": "my-distribution-2024",
        "Origins": {
            "Quantity": 1,
            "Items": [{
                "Id": "my-s3-origin",
                "DomainName": "my-bucket.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "my-s3-origin",
            "ViewerProtocolPolicy": "redirect-to-https"
        },
        "Enabled": true
    }'
```

## 🎮 Practice Exercise: Deploy a Complete Web Application

Let's build and deploy a full-stack application on AWS!

### Step 1: Create a Simple Web Application 🌐

```bash
# Create project directory
mkdir aws-web-app
cd aws-web-app

# Create simple HTML website
mkdir website
cat > website/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>My AWS Web App</title>
    <style>
        body { font-family: Arial; text-align: center; margin-top: 50px; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .feature { background: #f0f0f0; margin: 20px; padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to My AWS Web App!</h1>
        <p>This website is hosted on AWS using multiple services:</p>
        
        <div class="feature">
            <h3>📁 S3 Static Hosting</h3>
            <p>This HTML is served from Amazon S3</p>
        </div>
        
        <div class="feature">
            <h3>🌍 CloudFront CDN</h3>
            <p>Fast global delivery via CloudFront</p>
        </div>
        
        <div class="feature">
            <h3>📞 Route 53 DNS</h3>
            <p>Custom domain via Route 53</p>
        </div>
        
        <div class="feature">
            <h3>⚡ Lambda API</h3>
            <p><button onclick="callAPI()">Call Lambda Function</button></p>
            <p id="api-result"></p>
        </div>
    </div>
    
    <script>
        async function callAPI() {
            try {
                const response = await fetch('https://your-api-gateway-url/hello');
                const data = await response.json();
                document.getElementById('api-result').textContent = data.message;
            } catch (error) {
                document.getElementById('api-result').textContent = 'Error calling API';
            }
        }
    </script>
</body>
</html>
EOF

# Create Lambda function
cat > lambda-function.py << EOF
import json
import datetime

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        'body': json.dumps({
            'message': f'Hello from AWS Lambda! Time: {datetime.datetime.now().isoformat()}',
            'event': event
        })
    }
EOF
```

### Step 2: Deploy Static Website to S3 📁

```bash
# Install AWS CLI (if not already installed)
# pip install awscli

# Configure AWS credentials
aws configure
# Enter your Access Key ID, Secret Access Key, Region, and Output format

# Create S3 bucket for website
BUCKET_NAME="my-aws-web-app-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME

# Upload website files
aws s3 sync website/ s3://$BUCKET_NAME/

# Configure bucket for static website hosting
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document error.html

# Make bucket publicly readable
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file://bucket-policy.json

# Your website is now available at:
echo "Website URL: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

### Step 3: Create Lambda Function ⚡

```bash
# Create deployment package
zip lambda-function.zip lambda-function.py

# Create IAM role for Lambda
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role \
    --role-name lambda-execution-role \
    --assume-role-policy-document file://trust-policy.json

# Attach basic execution policy
aws iam attach-role-policy \
    --role-name lambda-execution-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create Lambda function
aws lambda create-function \
    --function-name my-hello-function \
    --runtime python3.9 \
    --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-execution-role \
    --handler lambda-function.lambda_handler \
    --zip-file fileb://lambda-function.zip

# Test the function
aws lambda invoke \
    --function-name my-hello-function \
    --payload '{"name": "World"}' \
    response.json

cat response.json
```

### Step 4: Set Up API Gateway 🌐

```bash
# Create REST API
API_ID=$(aws apigateway create-rest-api \
    --name my-web-app-api \
    --query 'id' --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[0].id' --output text)

# Create 'hello' resource
RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part hello \
    --query 'id' --output text)

# Create GET method
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE

# Integrate with Lambda
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:YOUR-ACCOUNT-ID:function:my-hello-function/invocations

# Deploy API
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod

# Your API is now available at:
echo "API URL: https://$API_ID.execute-api.us-east-1.amazonaws.com/prod/hello"
```

### Step 5: Set Up CloudFront Distribution 🚀

```bash
# Create CloudFront distribution
cat > cloudfront-config.json << EOF
{
    "CallerReference": "my-distribution-$(date +%s)",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0
    },
    "Comment": "My web app distribution",
    "Enabled": true
}
EOF

DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    --query 'Distribution.Id' --output text)

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id $DISTRIBUTION_ID \
    --query 'Distribution.DomainName' --output text)

echo "CloudFront URL: https://$CLOUDFRONT_DOMAIN"
```

## 🚀 Real-World AWS Architectures

### **Three-Tier Web Application** 🏗️

```
🌐 THREE-TIER ARCHITECTURE

👥 USERS
    |
    | (HTTPS)
    |
🚀 CLOUDFRONT (CDN)
    |
    | (Load balancing)
    |
⚖️ APPLICATION LOAD BALANCER
    |
    |-- 🖥️ EC2 Instance 1 (Web Server)
    |-- 🖥️ EC2 Instance 2 (Web Server)
    |-- 🖥️ EC2 Instance 3 (Web Server)
    |
    | (Database connections)
    |
🗄️ RDS DATABASE
    |-- 📊 Primary Database
    |-- 📊 Read Replica 1
    |-- 📊 Read Replica 2
```

### **Serverless Architecture** ⚡

```
🌐 SERVERLESS ARCHITECTURE

👥 USERS
    |
    | (HTTPS)
    |
🚀 CLOUDFRONT + S3 (Static Website)
    |
    | (API calls)
    |
🌐 API GATEWAY
    |
    |-- ⚡ Lambda Function 1 (User Management)
    |-- ⚡ Lambda Function 2 (Order Processing)
    |-- ⚡ Lambda Function 3 (Payment Processing)
    |
    | (Data storage)
    |
📊 DYNAMODB (NoSQL Database)
```

### **Microservices on ECS** 🐳

```
🌐 MICROSERVICES ARCHITECTURE

👥 USERS
    |
    | (HTTPS)
    |
⚖️ APPLICATION LOAD BALANCER
    |
🐳 ECS CLUSTER
    |-- 📦 User Service (3 containers)
    |-- 📦 Order Service (3 containers)
    |-- 📦 Payment Service (2 containers)
    |-- 📦 Notification Service (2 containers)
    |
    | (Service discovery)
    |
🔍 SERVICE DISCOVERY
    |
    | (Data storage)
    |
🗄️ RDS + 📊 DynamoDB + ⚡ ElastiCache
```

## 🔧 AWS Best Practices

### **Security** 🔒

```bash
# Use IAM roles instead of access keys
# Create role for EC2 instances
aws iam create-role \
    --role-name EC2-S3-Access-Role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "ec2.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }'

# Attach policy to role
aws iam attach-role-policy \
    --role-name EC2-S3-Access-Role \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Use security groups as firewalls
aws ec2 create-security-group \
    --group-name web-server-sg \
    --description "Security group for web servers"

# Allow only necessary ports
aws ec2 authorize-security-group-ingress \
    --group-name web-server-sg \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name web-server-sg \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0
```

### **Cost Optimization** 💰

```bash
# Use appropriate instance types
# t3.micro for development
# m5.large for production web servers
# r5.xlarge for memory-intensive applications

# Set up auto-scaling
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name my-asg \
    --launch-template LaunchTemplateName=my-template \
    --min-size 1 \
    --max-size 10 \
    --desired-capacity 2 \
    --vpc-zone-identifier subnet-12345,subnet-67890

# Use spot instances for non-critical workloads
aws ec2 request-spot-instances \
    --spot-price "0.05" \
    --instance-count 2 \
    --type "one-time" \
    --launch-specification '{
        "ImageId": "ami-12345678",
        "InstanceType": "t3.medium",
        "KeyName": "my-key-pair"
    }'
```

### **High Availability** 🏥

```bash
# Deploy across multiple Availability Zones
# Use Auto Scaling Groups
# Set up health checks
# Implement database backups

# Create RDS with Multi-AZ
aws rds create-db-instance \
    --db-instance-identifier my-database \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --multi-az \
    --backup-retention-period 7 \
    --storage-encrypted
```

## 📊 AWS Monitoring and Management

### **CloudWatch** 📈

```bash
# Monitor EC2 instances
aws cloudwatch get-metric-statistics \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \
    --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-01T23:59:59Z \
    --period 3600 \
    --statistics Average

# Create custom alarm
aws cloudwatch put-metric-alarm \
    --alarm-name cpu-high \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

### **AWS CLI Tips** 💡

```bash
# Use profiles for different environments
aws configure --profile production
aws configure --profile development

# Use specific profile
aws s3 ls --profile production

# Output formats
aws ec2 describe-instances --output table
aws ec2 describe-instances --output json
aws ec2 describe-instances --output text

# Filter results
aws ec2 describe-instances \
    --filters "Name=instance-state-name,Values=running" \
    --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name]'
```

## 🎯 What's Next?

Now that you understand AWS fundamentals, let's explore more advanced topics:

1. **[GCP Fundamentals](18_GCP_Fundamentals.md)** - Google Cloud Platform basics
2. **[Kubernetes Fundamentals](../03_Orchestration/08_Kubernetes_Fundamentals.md)** - Container orchestration
3. **[Terraform Basics](../08_Infrastructure_as_Code/27_Terraform_Basics.md)** - Infrastructure as Code

## 💡 Remember

AWS is like having access to a massive technology mall where you can rent any service you need. Start small with basic services and gradually explore more advanced features as your applications grow.

**Key Takeaway:** Cloud computing is not just about cost savings - it's about agility, scalability, and focusing on your core business instead of managing infrastructure!

---

*"The cloud is about how you do computing, not where you do computing."* - Paul Maritz ☁️
