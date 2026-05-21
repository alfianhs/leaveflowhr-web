# LeaveFlowHR — Frontend

The frontend web application for LeaveFlowHR, built with Next.js and TypeScript. Provides a UI for employees, managers, and HR to manage leave requests and approvals.

---

## Features

- JWT-based authentication with protected routes
- Submit and track leave requests
- Leave approval for managers and HR
- Leave history with status tracking
- Role-based UI (Employee / Manager / HR)

---

## Tech Stack

- **Next.js 16** — React framework (App Router)
- **TypeScript** — Type safety
- **shadcn/ui** — Component library
- **Tailwind CSS** — Utility-first styling

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [LeaveFlowHR API](https://github.com/alfianhs/leaveflowhr-service-api) running locally or on a server

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/alfianhs/leaveflowhr-web.git
cd leaveflowhr-web
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```properties
NEXT_PUBLIC_API_URL=http://localhost:5218/api
```

### 4. Run the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Default Accounts

Use the seeded accounts from the API to log in:

| Name | Email | Password | Role |
|---|---|---|---|
| Admin | admin@mail.com | `securepassword` | Admin |
| HR | hr@mail.com | `securepassword` | HR |
| Manager | manager@mail.com | `securepassword` | Manager |
| Employee | employee@mail.com | `securepassword` | Employee |

> These are for development only. See the [API repository](https://github.com/alfianhs/leaveflowhr-service-api) for setup instructions.

---

## Project Structure

```
.
├── app
│   ├── _models         # TypeScript interfaces and types
│   ├── _services       # API call functions (fetch wrappers per module)
│   └── login           # Login page route
├── components
│   ├── approval        # Approval list and action components
│   ├── dashboard       # Dashboard overview and summary cards
│   ├── layout          # Header, navigation tabs, and page shell
│   ├── leave-history   # Leave request history table and filters
│   ├── new-request     # Leave request form
│   ├── shared          # Reusable cross-feature components
│   └── ui              # shadcn/ui base components
├── hooks               # Custom React hooks
├── lib                 # Utilities and helper functions
├── public              # Static assets
└── styles              # Global CSS
```