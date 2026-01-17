# Kubernetes (K8s) Deployment Guide - WeStudy

This directory contains the production-grade Kubernetes manifests for the Study Application. These manifests represent a high-leverage architectural transition from local Docker Compose to a scalable, distributed environment.

## 🏗️ Architectural Features
- **Namespace Isolation**: Resources are isolated in the `westudy` namespace.
- **Stateful Management**: MongoDB and Kafka/Zookeeper use `StatefulSets` with `PersistentVolumeClaims` to ensure data persists across pod restarts.
- **Scaling (HPA)**: Automatical Horizontal Pod Autoscaling for the **Gateway** (CPU-based) and **AI Engine** (Memory-based).
- **Self-Healing**: `livenessProbe` and `readinessProbe` ensure traffic is only sent to healthy pods and unhealthy pods are restarted automatically.
- **Security**: Sensitive keys (JWT, OpenAI) are managed via Kubernetes `Secrets`.

## 🚀 How to Deploy

### 1. Prerequisites
- A running Kubernetes cluster (e.g., Minikube, Docker Desktop K8s, or EKS/GKE).
- `kubectl` configured to point to your cluster.

### 2. Apply Base Config & Secrets
```bash
kubectl apply -f k8s/base-config.yaml
```

### 3. Deploy Infrastructure (Database & Messaging)
```bash
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/kafka.yaml
```

### 4. Deploy Application Services
*Note: Ensure your local docker images are tagged as `studyapplication-gateway:latest`, `studyapplication-ai-engine:latest`, and `studyapplication-frontend:latest`.*

```bash
kubectl apply -f k8s/gateway.yaml
kubectl apply -f k8s/ai-engine.yaml
kubectl apply -f k8s/frontend.yaml
```

### 5. Access the Application
- **Frontend**: Accessible at `http://localhost:30001`
- **Gateway (Socket.io)**: Managed at `http://localhost:30040` (Internal port 4000)

## 📊 Monitoring
To check the status of your deployment:
```bash
kubectl get all -n westudy
kubectl get hpa -n westudy
```

## 🛠️ Performance Tuning
Each service has predefined `resources` (requests and limits) based on typical LLM and Node.js workloads. Adjust these in the respective YAML files if you observe `OOMKilled` errors or high latency.
