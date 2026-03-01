# Jobs Service (AI HR OS)

This service includes Auth, User, and Jobs APIs.

## 1) Clone the Project + Install Dependencies

```bash
git clone https://github.com/nexadev-io/ai-hr-os-assessment.git
cd ai-hr-os-assessment/jobs-svc
npm install
```

## 2) Environment Setup

This project uses two environment files:

- `src/.env` (app runtime environment) 

### `src/.env` (example)

```env
PORT=3000
NODE_ENV=development

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

JWT_SECRET=your_jwt_secret
EMAIL_SECRET=your_email_secret
RESET_SECRET=your_reset_secret

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_hr_os?schema=public"
``` 
 
## 3) Database + Run the Server

```bash
npm run migrate
npm run dev
```

Health check:

- `GET http://localhost:3001/api/v1/health`

## 4) Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `Jobs-svc.postman_collection.json`
4. Check collection variables:
   - `baseUrl` = `http://localhost:3000/api/v1`
   - `authToken` = empty (set after login)
   - `emailVerificationToken` = empty (set from create-user response)
   - `tenantId` = empty (set from create-user response)
   - `jobId` = empty (set from create-job response)

## 5) API Test Flow (Step by Step)

### Step A: Create User

- Request: `POST {{baseUrl}}/auth/create-user`
- Body (JSON):

```json
{
  "name": "John User",
  "tenantName": "John Tenant",
  "role": "USER",
  "email": "user1@example.com",
  "password": "Password123",
  "status": "ACTIVE"
}
```

From the response, save:

- `data.verificationToken` → `emailVerificationToken`
- `data.tenantId` → `tenantId`

### Step B: Verify Email

- Request: `POST {{baseUrl}}/auth/verify-email`
- Optional header (if you want to keep token in auth header too):
  - `Authorization: Bearer {{emailVerificationToken}}`
- Body:

```json
{
  "token": "{{emailVerificationToken}}"
}
```

### Step C: Login

- Request: `POST {{baseUrl}}/auth/login`
- Body:

```json
{
  "email": "user1@example.com",
  "password": "Password123"
}
```

From the response:

- `data.token` → `authToken`

Then set Postman Authorization (collection/folder/request):

- Type: `Bearer Token`
- Token: `{{authToken}}`

### Step D: Create Job

- Request: `POST {{baseUrl}}/jobs`
- Headers:
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- Body:

```json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Dhaka, Bangladesh",
  "employmentType": "full-time",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "description": "We are looking for an experienced Senior Software Engineer to join our team.",
  "status": "published"
}
```

From the response:

- `data.id` → `jobId`

### Step E: Get Jobs / Get Single Job / Delete Job

- `GET {{baseUrl}}/jobs/tenant/`
- `GET {{baseUrl}}/jobs/tenant/{{jobId}}`
- `DELETE {{baseUrl}}/jobs/tenant/{{jobId}}`

For all these endpoints, use:

- `Authorization: Bearer {{authToken}}`

## 6) Screenshots (SS)

Place your screenshots in these paths so they render in this README:

- `docs/screenshots/01-create-user.png`
- `docs/screenshots/02-verify-email-token.png`
- `docs/screenshots/03-login-token.png`
- `docs/screenshots/04-create-job.png`

### Create User Response (verificationToken + tenantId)

![Create User Response](docs/screenshots/01-create-user.png)

### Email Verification (Authorization + body token)

![Email Verification](docs/screenshots/02-verify-email-token.png)

### Login Response (auth token)

![Login Response](docs/screenshots/03-login-token.png)

### Create Job (Bearer authToken)

![Create Job](docs/screenshots/04-create-job.png)

## 7) Quick Scripts

```bash
npm run dev
npm run build
npm run migrate
npm run database
```