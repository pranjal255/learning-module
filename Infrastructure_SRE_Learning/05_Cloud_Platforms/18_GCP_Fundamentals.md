# GCP Fundamentals 🌤️

## 🌟 Real-World Story: The Global Tech Campus

Imagine you're building a worldwide technology campus for your company. You need different specialized facilities:
- **Research labs** with cutting-edge AI and machine learning equipment
- **Data centers** with massive computing power and storage
- **Global offices** connected with high-speed networks
- **Security systems** protecting intellectual property
- **Collaboration tools** enabling teams to work together seamlessly

Traditional approach: Build everything yourself (expensive, time-consuming, limited expertise)

**Google's approach:** "We've already built the world's most advanced tech infrastructure for our own products (Search, Gmail, YouTube). Why don't you use ours?"

**Google Cloud Platform (GCP) is like renting space in Google's global tech campus!** You get access to the same infrastructure that powers Google's billion-user services.

## 🎯 What is Google Cloud Platform (GCP)?

GCP is like having **access to Google's internal infrastructure** - the same systems that power Search, Gmail, YouTube, and Maps. Instead of building your own data centers, you rent Google's world-class infrastructure.

### 🏢 **Traditional IT vs Google Cloud**

| Traditional IT | Google Cloud Platform |
|---------------|----------------------|
| 🏗️ **Build your own data centers** | 🌍 **Use Google's global infrastructure** |
| 🔧 **Hire infrastructure experts** | 🧠 **Leverage Google's expertise** |
| 📊 **Limited AI/ML capabilities** | 🤖 **World-class AI/ML services** |
| 🌐 **Regional presence** | 🌍 **Global network (200+ countries)** |
| 💸 **High upfront costs** | 💳 **Pay-as-you-go pricing** |

## 📊 Visual Representation: GCP Global Infrastructure

```
🌍 GOOGLE CLOUD GLOBAL INFRASTRUCTURE

🌎 REGIONS (Geographic Areas)
├── 🇺🇸 us-central1 (Iowa)
├── 🇺🇸 us-east1 (South Carolina)
├── 🇪🇺 europe-west1 (Belgium)
├── 🇯🇵 asia-northeast1 (Tokyo)
└── 🇦🇺 australia-southeast1 (Sydney)

🏢 ZONES (Data Centers in Each Region)
├── Zone A (Primary data center)
├── Zone B (Secondary data center)
└── Zone C (Tertiary data center)

🌐 GOOGLE'S PRIVATE NETWORK
├── 📡 Submarine cables
├── 🛰️ Edge locations (150+ worldwide)
└── ⚡ Premium network tier
```

## 💡 Core GCP Services

### **Compute Services** 💻

**Compute Engine** = **Virtual Machines** 🖥️
```bash
# Like renting computers in Google's data centers
# Full control over the operating system

# Create a VM instance
gcloud compute instances create my-vm \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud

# SSH into your instance
gcloud compute ssh my-vm --zone=us-central1-a
```

**Cloud Functions** = **Serverless Functions** ⚡
```python
# Like hiring someone to do a specific task
# No server management, just write code

import functions_framework

@functions_framework.http
def hello_gcp(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`.
    """
    name = request.args.get('name', 'World')
    return f'Hello {name} from Google Cloud Functions!'

# Deploy function
gcloud functions deploy hello-gcp \
    --runtime python39 \
    --trigger-http \
    --allow-unauthenticated
```

**Google Kubernetes Engine (GKE)** = **Managed Kubernetes** ⚓
```bash
# Like having Google manage your container orchestra

# Create a GKE cluster
gcloud container clusters create my-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10

# Get credentials for kubectl
gcloud container clusters get-credentials my-cluster --zone=us-central1-a

# Deploy an application
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:1.0
kubectl expose deployment hello-app --type=LoadBalancer --port=80 --target-port=8080
```

### **Storage Services** 💾

**Cloud Storage** = **Unlimited Object Storage** 📁
```bash
# Like having infinite storage space with global access

# Create a bucket
gsutil mb gs://my-unique-bucket-name-12345

# Upload files
gsutil cp my-file.txt gs://my-unique-bucket-name-12345/
gsutil cp -r ./my-folder gs://my-unique-bucket-name-12345/

# Make files public
gsutil acl ch -u AllUsers:R gs://my-unique-bucket-name-12345/my-file.txt

# Sync directories
gsutil rsync -r ./local-folder gs://my-unique-bucket-name-12345/remote-folder
```

**Persistent Disk** = **Block Storage for VMs** 💿
```bash
# Like attaching external hard drives to your VMs

# Create a persistent disk
gcloud compute disks create my-disk \
    --size=100GB \
    --zone=us-central1-a \
    --type=pd-standard

# Attach to VM
gcloud compute instances attach-disk my-vm \
    --disk=my-disk \
    --zone=us-central1-a
```

**Filestore** = **Managed NFS** 🗂️
```bash
# Like having a shared network drive

# Create Filestore instance
gcloud filestore instances create my-filestore \
    --zone=us-central1-a \
    --tier=BASIC_HDD \
    --file-share=name="share1",capacity=1TB \
    --network=name="default"
```

### **Database Services** 🗄️

**Cloud SQL** = **Managed Relational Databases** 🏪
```bash
# Like hiring a database administrator from Google

# Create MySQL instance
gcloud sql instances create my-mysql-instance \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1

# Create database
gcloud sql databases create my-app-db --instance=my-mysql-instance

# Create user
gcloud sql users create my-user \
    --instance=my-mysql-instance \
    --password=my-secure-password

# Connect to database
gcloud sql connect my-mysql-instance --user=my-user
```

**Firestore** = **NoSQL Document Database** 📊
```python
# Like having a super-fast, globally distributed filing system

from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

# Add document
doc_ref = db.collection('users').document('user123')
doc_ref.set({
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30,
    'created_at': firestore.SERVER_TIMESTAMP
})

# Get document
doc = doc_ref.get()
if doc.exists:
    print(f'Document data: {doc.to_dict()}')

# Query collection
users = db.collection('users').where('age', '>=', 18).stream()
for user in users:
    print(f'{user.id} => {user.to_dict()}')
```

**BigQuery** = **Data Warehouse** 📈
```sql
-- Like having a super-powered data analysis engine

-- Create dataset
CREATE SCHEMA my_dataset;

-- Create table
CREATE TABLE my_dataset.sales (
    id INT64,
    product STRING,
    amount FLOAT64,
    sale_date DATE
);

-- Insert data
INSERT INTO my_dataset.sales VALUES
(1, 'Laptop', 999.99, '2024-01-01'),
(2, 'Phone', 599.99, '2024-01-02'),
(3, 'Tablet', 399.99, '2024-01-03');

-- Query data
SELECT 
    product,
    SUM(amount) as total_sales,
    COUNT(*) as num_sales
FROM my_dataset.sales
WHERE sale_date >= '2024-01-01'
GROUP BY product
ORDER BY total_sales DESC;
```

### **AI/ML Services** 🤖

**Vertex AI** = **Machine Learning Platform** 🧠
```python
# Like having Google's AI experts on your team

from google.cloud import aiplatform

# Initialize Vertex AI
aiplatform.init(project='my-project', location='us-central1')

# Train a custom model
job = aiplatform.CustomTrainingJob(
    display_name='my-training-job',
    script_path='train.py',
    container_uri='gcr.io/cloud-aiplatform/training/tf-cpu.2-8:latest',
    requirements=['pandas', 'scikit-learn'],
    model_serving_container_image_uri='gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-8:latest'
)

model = job.run(
    dataset=my_dataset,
    replica_count=1,
    machine_type='n1-standard-4'
)
```

**Vision AI** = **Image Analysis** 👁️
```python
# Like having computer vision experts analyze your images

from google.cloud import vision

# Initialize Vision client
client = vision.ImageAnnotatorClient()

# Analyze image
with open('image.jpg', 'rb') as image_file:
    content = image_file.read()

image = vision.Image(content=content)

# Detect text
response = client.text_detection(image=image)
texts = response.text_annotations
for text in texts:
    print(f'Detected text: {text.description}')

# Detect objects
response = client.object_localization(image=image)
objects = response.localized_object_annotations
for obj in objects:
    print(f'Object: {obj.name} (confidence: {obj.score})')
```

## 🎮 Practice Exercise: Deploy Full-Stack Application

Let's build and deploy a complete application using multiple GCP services!

### Step 1: Set Up GCP Environment 🏗️

```bash
# Install Google Cloud SDK
# macOS
brew install google-cloud-sdk

# Ubuntu/Debian
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize gcloud
gcloud init

# Set default project and region
gcloud config set project my-project-id
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable cloudsql.googleapis.com
gcloud services enable storage.googleapis.com
```

### Step 2: Create Backend API 🔧

```python
# Create app.py - Flask API
from flask import Flask, request, jsonify
from google.cloud import firestore
from google.cloud import storage
import os

app = Flask(__name__)

# Initialize Firestore
db = firestore.Client()

# Initialize Cloud Storage
storage_client = storage.Client()
bucket_name = os.environ.get('BUCKET_NAME', 'my-app-bucket')

@app.route('/')
def hello():
    return jsonify({
        'message': 'Hello from Google Cloud!',
        'service': 'Cloud Run',
        'version': '1.0'
    })

@app.route('/users', methods=['GET'])
def get_users():
    users = []
    docs = db.collection('users').stream()
    for doc in docs:
        user_data = doc.to_dict()
        user_data['id'] = doc.id
        users.append(user_data)
    return jsonify(users)

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Add user to Firestore
    doc_ref = db.collection('users').add({
        'name': data.get('name'),
        'email': data.get('email'),
        'created_at': firestore.SERVER_TIMESTAMP
    })
    
    return jsonify({
        'id': doc_ref[1].id,
        'message': 'User created successfully'
    }), 201

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Upload to Cloud Storage
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)
    
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': file.filename,
        'url': f'gs://{bucket_name}/{file.filename}'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
```

```python
# Create requirements.txt
cat > requirements.txt << EOF
Flask==2.3.3
google-cloud-firestore==2.11.1
google-cloud-storage==2.10.0
gunicorn==21.2.0
EOF
```

### Step 3: Create Dockerfile 🐳

```dockerfile
# Create Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

### Step 4: Deploy to Cloud Run 🚀

```bash
# Build and deploy to Cloud Run
gcloud run deploy my-api \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars BUCKET_NAME=my-app-bucket-12345

# Get the service URL
gcloud run services describe my-api \
    --platform managed \
    --region us-central1 \
    --format 'value(status.url)'
```

### Step 5: Create Cloud Storage Bucket 📁

```bash
# Create bucket for file uploads
gsutil mb gs://my-app-bucket-12345

# Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://my-app-bucket-12345

# Enable CORS for web access
cat > cors.json << EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://my-app-bucket-12345
```

### Step 6: Set Up Firestore Database 🗄️

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Add sample data using gcloud
gcloud firestore documents create \
    --collection=users \
    --data='{"name":"John Doe","email":"john@example.com"}' \
    --document-id=user1
```

### Step 7: Create Frontend 🌐

```html
<!-- Create index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>GCP Full-Stack App</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; }
        button { background: #4285f4; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #3367d6; }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
        .user { background: white; padding: 10px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🌤️ GCP Full-Stack Application</h1>
    
    <div class="container">
        <h2>Add New User</h2>
        <input type="text" id="userName" placeholder="Name">
        <input type="email" id="userEmail" placeholder="Email">
        <button onclick="addUser()">Add User</button>
    </div>
    
    <div class="container">
        <h2>Upload File</h2>
        <input type="file" id="fileInput">
        <button onclick="uploadFile()">Upload to Cloud Storage</button>
    </div>
    
    <div class="container">
        <h2>Users</h2>
        <button onclick="loadUsers()">Load Users</button>
        <div id="usersList"></div>
    </div>

    <script>
        const API_URL = 'YOUR_CLOUD_RUN_URL'; // Replace with your Cloud Run URL

        async function addUser() {
            const name = document.getElementById('userName').value;
            const email = document.getElementById('userEmail').value;
            
            if (!name || !email) {
                alert('Please fill in all fields');
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email })
                });
                
                const result = await response.json();
                alert('User added successfully!');
                document.getElementById('userName').value = '';
                document.getElementById('userEmail').value = '';
                loadUsers();
            } catch (error) {
                alert('Error adding user: ' + error.message);
            }
        }

        async function loadUsers() {
            try {
                const response = await fetch(`${API_URL}/users`);
                const users = await response.json();
                
                const usersList = document.getElementById('usersList');
                usersList.innerHTML = '';
                
                users.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.className = 'user';
                    userDiv.innerHTML = `
                        <strong>${user.name}</strong><br>
                        Email: ${user.email}<br>
                        ID: ${user.id}
                    `;
                    usersList.appendChild(userDiv);
                });
            } catch (error) {
                alert('Error loading users: ' + error.message);
            }
        }

        async function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                alert('File uploaded successfully!');
                fileInput.value = '';
            } catch (error) {
                alert('Error uploading file: ' + error.message);
            }
        }

        // Load users on page load
        window.onload = loadUsers;
    </script>
</body>
</html>
```

### Step 8: Deploy Frontend to Cloud Storage 🌐

```bash
# Create bucket for static website
gsutil mb gs://my-app-frontend-12345

# Upload HTML file
gsutil cp index.html gs://my-app-frontend-12345/

# Make bucket public for website hosting
gsutil iam ch allUsers:objectViewer gs://my-app-frontend-12345

# Set up website configuration
gsutil web set -m index.html -e 404.html gs://my-app-frontend-12345

# Your website is now available at:
echo "Website URL: https://storage.googleapis.com/my-app-frontend-12345/index.html"
```

### Step 9: Set Up Load Balancer (Optional) ⚖️

```bash
# Create global load balancer for custom domain
gcloud compute backend-buckets create my-app-backend \
    --gcs-bucket-name=my-app-frontend-12345

gcloud compute url-maps create my-app-map \
    --default-backend-bucket=my-app-backend

gcloud compute target-http-proxies create my-app-proxy \
    --url-map=my-app-map

gcloud compute forwarding-rules create my-app-rule \
    --global \
    --target-http-proxy=my-app-proxy \
    --ports=80
```

## 🚀 Real-World GCP Architectures

### **Serverless Architecture** ⚡

```
🌤️ SERVERLESS ARCHITECTURE ON GCP

👥 USERS
    |
    | (HTTPS)
    |
🌐 CLOUD CDN + CLOUD STORAGE (Static Website)
    |
    | (API calls)
    |
🔗 CLOUD ENDPOINTS (API Gateway)
    |
    |-- ⚡ Cloud Functions (User Management)
    |-- ⚡ Cloud Functions (File Processing)
    |-- ⚡ Cloud Functions (Notifications)
    |
    | (Data storage)
    |
📊 FIRESTORE (NoSQL) + 📈 BIGQUERY (Analytics)
```

### **Microservices on GKE** 🐳

```
🌤️ MICROSERVICES ON GOOGLE KUBERNETES ENGINE

👥 USERS
    |
    | (HTTPS)
    |
⚖️ CLOUD LOAD BALANCER
    |
🐳 GKE CLUSTER
    |-- 📦 User Service (3 pods)
    |-- 📦 Order Service (3 pods)
    |-- 📦 Payment Service (2 pods)
    |-- 📦 Notification Service (2 pods)
    |
    | (Service mesh)
    |
🕸️ ISTIO SERVICE MESH
    |
    | (Data layer)
    |
🗄️ CLOUD SQL + 📊 FIRESTORE + ⚡ MEMORYSTORE
```

### **Data Pipeline Architecture** 📊

```
🌤️ DATA PIPELINE ON GCP

📱 DATA SOURCES
    |-- 🌐 Web Apps
    |-- 📱 Mobile Apps
    |-- 🔗 APIs
    |
    | (Real-time streaming)
    |
🌊 CLOUD PUB/SUB (Message Queue)
    |
    | (Stream processing)
    |
⚡ CLOUD DATAFLOW (Apache Beam)
    |
    | (Data storage)
    |
📈 BIGQUERY (Data Warehouse)
    |
    | (Analytics & ML)
    |
🤖 VERTEX AI + 📊 LOOKER STUDIO
```

## 🔧 GCP Best Practices

### **Security** 🔒

```bash
# Use IAM roles instead of service account keys
gcloud projects add-iam-policy-binding my-project \
    --member="serviceAccount:my-service@my-project.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"

# Enable audit logging
gcloud logging sinks create my-audit-sink \
    bigquery.googleapis.com/projects/my-project/datasets/audit_logs \
    --log-filter='protoPayload.serviceName="compute.googleapis.com"'

# Use VPC firewall rules
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server
```

### **Cost Optimization** 💰

```bash
# Use preemptible instances for batch workloads
gcloud compute instances create my-batch-vm \
    --preemptible \
    --machine-type=n1-standard-1 \
    --zone=us-central1-a

# Set up budget alerts
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Monthly Budget" \
    --budget-amount=100USD \
    --threshold-rule=percent=90,basis=CURRENT_SPEND

# Use committed use discounts
gcloud compute commitments create my-commitment \
    --plan=12-month \
    --region=us-central1 \
    --resources=type=VCPU,amount=10
```

### **Monitoring** 📊

```bash
# Set up monitoring and alerting
gcloud alpha monitoring policies create \
    --policy-from-file=alert-policy.yaml

# Create custom metrics
gcloud logging metrics create my_custom_metric \
    --description="Custom application metric" \
    --log-filter='resource.type="cloud_run_revision"'
```

## 🎯 GCP vs AWS Comparison

| Service Category | GCP | AWS |
|-----------------|-----|-----|
| **Compute** | Compute Engine, Cloud Functions, GKE | EC2, Lambda, EKS |
| **Storage** | Cloud Storage, Persistent Disk | S3, EBS |
| **Database** | Cloud SQL, Firestore, BigQuery | RDS, DynamoDB, Redshift |
| **AI/ML** | Vertex AI, AutoML | SageMaker, Rekognition |
| **Networking** | VPC, Cloud CDN | VPC, CloudFront |
| **Serverless** | Cloud Functions, Cloud Run | Lambda, Fargate |

## 🎯 What's Next?

Now that you understand GCP fundamentals, let's explore more advanced topics:

1. **[Multi-Cloud Strategies](19_Multi_Cloud_Strategies.md)** - Working across cloud platforms
2. **[Kubernetes Fundamentals](../03_Orchestration/08_Kubernetes_Fundamentals.md)** - Container orchestration
3. **[Terraform Basics](../08_Infrastructure_as_Code/27_Terraform_Basics.md)** - Infrastructure as Code

## 💡 Remember

GCP is like having access to Google's internal infrastructure and AI capabilities. It excels in data analytics, machine learning, and Kubernetes. Start with simple services and gradually explore Google's advanced AI/ML offerings.

**Key Takeaway:** GCP's strength lies in its data and AI services, global network infrastructure, and seamless integration with Google's ecosystem!

---

*"Google Cloud is built on the same infrastructure that Google uses internally for its end-user products."* - Sundar Pichai 🌤️
