# Taskmanager

**Taskmanager** is a modern Java web application that helps plan, track, and manage work — from simple personal to-dos to full team/project workflows.

This project demonstrates a production-grade, fully automated DevOps pipeline designed to reflect real-world enterprise and cloud-native practices, including:

✨ Continuous Integration (CI)
🎯 Code Quality & Security Enforcement
🚀 Continuous Deployment (CD) to Kubernetes using Helm
🔁 Blue-Green / Progressive Deployments
📊 Monitoring & Observability with Prometheus & Grafana

# 🚀 Architecture Overview

This application is developed in Java (Maven) and packaged as a WAR file, running on Apache Tomcat inside a Docker container.
It is deployed to Kubernetes using Helm charts, enabling consistent, repeatable, and scalable deployments.

The architecture demonstrates:

Java WAR-based application delivery

Containerized runtime using Docker

Kubernetes orchestration

Helm-based release management

GitHub Actions for CI/CD automation

# 🛠️ Features
✅ CI Pipeline (GitHub Actions)

The CI pipeline is fully automated and triggered on every push or merge to the main branch.

Builds the WAR file using Maven

Runs automated unit tests

Performs SonarQube quality gate analysis

Scans dependencies and images using OWASP Dependency Check and Trivy

Builds and pushes Docker images to a container registry

Deploys the application to Kubernetes using Helm

# 📊 Code Quality & Security

Quality and security are enforced early in the pipeline to prevent issues from reaching production.

SonarQube enforces quality gates (test coverage, bugs, code smells)

OWASP Dependency Check identifies vulnerable third-party dependencies

Trivy scans container images for HIGH and CRITICAL CVEs

Deployments are automatically blocked if quality or security thresholds are not met.

# 📦 Deployment Strategy

The project implements a Blue-Green deployment strategy to ensure safe and reliable releases.

Two parallel environments (blue & green)

Zero-downtime traffic switching

Instant rollback using a single Helm command

Reduced production risk during deployments

# 🧭 Kubernetes Deployment (via Helm)

All Kubernetes manifests are managed using Helm charts, located at:

/chart/taskmanager


Helm templates manage Deployments, Services, health probes, and optional Ingress resources.

Install or upgrade
helm install taskmanager chart/taskmanager \
  --set image.tag=COMMIT_SHA

helm upgrade taskmanager chart/taskmanager \
  --set image.tag=COMMIT_SHA


# 📊 Monitoring & Observability

The application is monitored using Prometheus and Grafana, providing visibility into:

JVM memory and garbage collection

Application latency and error rates

Pod health and restarts

Resource utilization

✔ Explicit base-path
✔ Global metric tagging
✔ Prometheus export enabled
✔ Compatible with kube-prometheus-stack
✔ No security misconfigurations

This ensures production-grade observability and faster incident response.

