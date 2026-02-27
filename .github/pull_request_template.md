## Candidate Name
<!-- Your full name -->

## What I Built
<!-- Brief description of your implementation -->

## How to Run
```bash
docker-compose up
```

## Test Tenant Isolation
```bash
# Create a job for Tenant A
curl -X POST http://localhost:3000/jobs \
  -H 'X-Tenant-ID: aaaaaaaa-0000-0000-0000-000000000001' \
  -H 'Content-Type: application/json' \
  -d '{"title": "Backend Engineer", "status": "published"}'

# List jobs for Tenant B — should return empty []
curl http://localhost:3000/jobs \
  -H 'X-Tenant-ID: bbbbbbbb-0000-0000-0000-000000000002'
```

## Design Decisions
<!-- Any trade-offs or choices you made -->

## Checklist
- [ ] `docker-compose up` works
- [ ] All 6 endpoints implemented
- [ ] `tenant_id` scoped on all queries
- [ ] Input validation added
- [ ] `jobs-svc/README.md` written
```

---

## 🔗 Final Repo URL
Once created, your repo will be at:
```
https://github.com/nexadev-io/ai-hr-os-assessment