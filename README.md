# AI HR OS — Developer Assessment

> Backend Engineer Recruitment Task · Nexadev · Feb 2026

## 🎯 Your Task

Build a **Multi-Tenant Job Posting Service** using:

- **NestJS** (Node.js framework)
- **PostgreSQL** (database)
- **TypeORM** (ORM)
- **Docker + Docker Compose** (local setup)

Full task instructions are in [`/docs/task.pdf`](./docs/task.pdf)

---

## 📁 Repo Structure
```
ai-hr-os-assessment/
├── docs/
│   └── task.pdf              ← Read this first
├── jobs-svc/                 ← Your work goes here
│   ├── src/
│   ├── .env.example
│   ├── docker-compose.yml
│   └── README.md             ← You must write this
└── README.md
```

---

## 🚀 How to Submit

1. **Fork** this repository
2. Create a branch: `feature/jobs-svc-<your-name>`
3. Build your service inside the `jobs-svc/` folder
4. Open a **Pull Request** to `main` with title:
```
   [Assessment] Jobs Service — Your Full Name
```

📅 **Deadline: 1 March 2026**

---

## ✅ Checklist Before Submitting

- [ ] `docker-compose up` starts everything with zero manual steps
- [ ] All 6 endpoints implemented
- [ ] `X-Tenant-ID` header enforced on every request
- [ ] All DB queries scoped by `tenant_id`
- [ ] Input validation with `class-validator`
- [ ] `jobs-svc/README.md` written with run instructions

---

## 📬 Questions?

Email: **hello@nexadev.io**
