# ⛓️ LANDCHAIN — Secure Blockchain-Based Land Record Management

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** SIH26125  
> **Problem Statement:** "Blockchain Secure Platform for Identity, Access Control, and Digital Asset Management"  
> **Theme:** Blockchain & Cybersecurity  
> **Category:** Software  
> **Target Domain:** Tamper-Evident Land Registry & Title Mutation Management  

---

## 📌 Executive Summary

Traditional centralized land registries are vulnerable to insider modifications, unrecorded fraudulent mutations, and unauthorized ownership transfers. When disputes reach citizens, auditors, or courts, verifying the authentic chronological history of a title is slow, disputed, and expensive.

**LANDCHAIN** resolves this by pairing relational application state with a **cryptographic hash-linked blockchain ledger**. Every land parcel registration, ownership transfer, and title deed document is permanently anchored to a SHA-256 block. If an insider or attacker modifies the centralized database directly, LANDCHAIN’s real-time verification engine catches the cryptographic mismatch within milliseconds, flagging **`TAMPERING DETECTED ⚠`** and logging an immutable security audit record.

---

## 🏗️ System Architecture

### 1. Prototype Architecture (Current Review MVP)

The current review prototype implements the core blockchain mechanisms locally for lightning-fast, zero-dependency laptop demonstration:

$$\text{User Login (JWT)} \longrightarrow \text{Role Authorization (RBAC)} \longrightarrow \text{Land Record + Doc Hash} \longrightarrow \text{SHA-256 Blockchain Block} \longrightarrow \text{Tamper Verification} \longrightarrow \text{Audit Trail}$$

| Layer | Implementation in Review Prototype | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + Tailwind CSS + Lucide Icons | Responsive enterprise cybersecurity dashboard |
| **Backend** | Node.js + Express REST API | Cryptographic hashing, RBAC, and controller layer |
| **Database** | Native SQLite (`node:sqlite` DatabaseSync) | High-speed relational storage for application state |
| **Blockchain** | Custom Local Blockchain Engine | Hash-linked blocks, Genesis Block #0, and chain validation |
| **Document Storage**| Local Filesystem + SHA-256 Anchoring | Title deeds stored locally with hashes anchored on-chain |
| **Audit Engine** | SQLite Forensic Table (`AUDIT_LOGS`) | Immutable record of logins, transactions, and denials |

### 2. Future Production Migration Architecture

The codebase is deliberately architected with clean modular boundaries so that production enterprise components can be swapped in without redesigning business logic:

```
[ Current Review Prototype ]                 [ Planned Production Enterprise Stack ]
React Frontend                          ──>  React / Next.js Enterprise Web Portal
Node.js Express API                     ──>  Node.js Microservices / Go Gateway
SQLite Database                         ──>  MongoDB Enterprise / PostgreSQL
Local Blockchain Engine (SHA-256)       ──>  Hyperledger Fabric (Permissioned Consortium)
Local Filesystem Document Storage       ──>  IPFS (InterPlanetary File System)
```

> [!NOTE]
> **Technical Credibility & Presentation Language:**
> - *"The current review prototype implements the core blockchain mechanisms locally. The production architecture will migrate this layer to Hyperledger Fabric."*
> - *"The prototype uses local document storage with cryptographic hash anchoring. IPFS is the planned production storage layer."*

---

## 🔐 Core Features

1. **Role-Based Access Control (RBAC):**
   - **ADMIN:** Full dashboard visibility, tampering simulation tool, blockchain inspection, user identity management, and system-wide audit trail.
   - **REGISTRAR:** Register new land records, upload title deeds, authorize mutations/ownership transfers, and view transaction history.
   - **CITIZEN:** Public search by Survey Number or Owner, view permitted parcel data, and verify record integrity against the blockchain. Cannot modify, mutate, or access administrative tools.
2. **Access Denial Interception:**
   - Any unauthorized attempt (e.g. Citizen attempting to modify a record) is immediately rejected with HTTP `403 Forbidden` and automatically recorded in the audit trail under `ACCESS_DENIED`.
3. **Deterministic Canonical Hashing:**
   - Record SHA-256 hashes are computed over canonicalized fields: `Survey Number + Owner Name + Village + District + State + Land Area + Document Hash`.
4. **Document Integrity Verification:**
   - When a deed is uploaded, a SHA-256 cryptographic fingerprint is generated and sealed into both the record and the blockchain block.
5. **Tamper Detection Engine:**
   - Compares the recalculated hash of live SQLite database records against the immutable transaction hash anchored in the blockchain block.
   - Green Shield **`RECORD VERIFIED ✓`** if hashes match.
   - Red Alert **`TAMPERING DETECTED ⚠`** if any field has been modified in the database without a blockchain transaction.
6. **Controlled Demo Tamper Simulation (Admin Only):**
   - Enables the presenter to modify an SQLite record directly during the jury presentation, demonstrating how the system catches fraud in real time.
   - Includes a **"Restore Record"** tool to cleanly reset the record back to blockchain truth.
7. **Interactive Blockchain Explorer:**
   - Visual block-by-block representation showing Genesis Block #0 through Block #N linked by cryptographic arrows.
   - Includes a **"Validate Blockchain"** action that recalculates all block hashes and verifies the validity of all previous-hash links.
8. **Comprehensive Forensic Audit Trail:**
   - Captures `LOGIN_SUCCESS`, `LOGIN_FAILED`, `ADD_LAND_RECORD`, `UPDATE_LAND_RECORD`, `VERIFY_RECORD`, `ACCESS_DENIED`, `TAMPER_DETECTED`, and `TAMPER_SIMULATION_EXECUTED`.

---

## 🔑 Demo Login Accounts

All demo accounts are pre-seeded with secure `bcrypt` password hashes:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@landchain.com` | `admin123` | Full Access + Demo Tamper Simulator |
| **REGISTRAR** | `registrar@landchain.com` | `reg123` | Register Land, Upload Deeds, Mutate Titles |
| **CITIZEN** | `citizen@landchain.com` | `citizen123` | Search Records & Verify Blockchain Integrity |

*(Tip: In the login window, click any role card to automatically autofill credentials!)*

---

## 🚀 Quick Setup & Running Locally

### Prerequisites
- **Node.js**: v18+ (Node.js v24.x recommended, built-in SQLite engine supported)
- **NPM**: v9+

### Option A: One-Click Startup (Windows)
Double-click `start-demo.bat` in the project root. It will launch both the Backend (port 5000) and Frontend (port 5173) in separate command windows.

### Option B: Manual Terminal Startup

1. **Start Backend Server:**
   ```bash
   cd backend
   npm install       # (if not already installed)
   node src/database/seed.js   # Seeds 10 realistic Tamil Nadu records & blocks
   npm start         # Starts on http://localhost:5000
   ```

2. **Start Frontend Client (In a second terminal):**
   ```bash
   cd frontend
   npm install       # (if not already installed)
   npm run dev       # Starts on http://localhost:5173
   ```

3. **Open Application:**
   Visit **`http://localhost:5173`** in your browser.

---

## 🎬 12-Step Monday Review Demo Scenario

Follow this exact walkthrough to demonstrate all required SIH capabilities to the jury:

| Step | Persona | Action | What to Explain to Evaluators |
| :---: | :---: | :--- | :--- |
| **1** | **Registrar** | Sign in as `registrar@landchain.com` / `reg123`. | "Registrars are authorized government officials capable of issuing title registrations." |
| **2** | **Registrar** | Review the **Dashboard**. | "Dashboard displays real-time metrics: 10 preloaded Tamil Nadu records, 11 blocks, and zero tampering." |
| **3** | **Registrar** | Navigate to **Land Records**. | "Shows existing seeded parcels (`TN-ERD-1001` through `1010`) in Erode district." |
| **4** | **Registrar** | Click **Add Land Record**. Enter: `TN-ERD-1024`, Owner: `Ravi Kumar`, Village: `Perundurai`, District: `Erode`, Area: `2.50 Acres`, and upload deed. | "Generates SHA-256 fingerprint of the deed and record payload." |
| **5** | **Registrar** | Click **REGISTER LAND**. | "A new transaction `ADD_LAND_RECORD` is created and mined into Block #11. Shows receipt with hashes." |
| **6** | **Registrar** | Open **Blockchain Explorer**. | "Block #11 is cryptographically linked to Block #10 via `previousHash`. The chain is immutable." |
| **7** | **Citizen** | Logout, then sign in as `citizen@landchain.com` / `citizen123`. | "Citizens have transparent, read-only verification rights." |
| **8** | **Citizen** | Search `TN-ERD-1024` and click **Verify Record**. | "Displays **`RECORD VERIFIED ✓`** (Green Shield, Hash Match: YES, Blockchain: VALID)." |
| **9** | **Admin** | Logout, then sign in as `admin@landchain.com` / `admin123`. Open `TN-ERD-1024` and click **Demo Tamper Simulation**. Alter owner to `Fake Owner`. | "Simulates a rogue insider editing the centralized SQLite database directly WITHOUT blockchain authorization." |
| **10** | **Admin/Citizen** | Click **Verify Integrity** on `TN-ERD-1024`. | "Verification engine flags **`TAMPERING DETECTED ⚠`**! Displays Original Hash vs Altered Hash side-by-side." |
| **11** | **Admin** | Open **Audit Trail**. | "The `TAMPER_DETECTED` event is permanently recorded in the system audit log with forensic details." |
| **12** | **Admin** | Open **Blockchain Explorer** and click **Validate Blockchain**. | "Displays **`✓ Blockchain integrity verified`**, proving the blockchain ledger remained untampered despite the database modification." |

*(Optional bonus: In Admin view, click **"Restore to Blockchain Truth"** to show how the system can restore the corrupted database row back to its authentic blockchain state!)*

---

## 🧪 Automated Test Verification

Run the built-in automated test suites to verify backend integrity:

```bash
# Run unit & cryptographic verification tests:
cd backend
node test-flow.js

# Run full end-to-end API & RBAC HTTP test suite:
node test-server-e2e.js
```

**Results:**
- ✅ Genesis Block #0 & Hash-linking verified
- ✅ Authentication & bcrypt passwords verified
- ✅ Citizen mutation attempt blocked with `403 Forbidden`
- ✅ `ACCESS_DENIED` logged in audit table
- ✅ Clean record verified with `RECORD VERIFIED`
- ✅ Tamper simulation caught with `TAMPERING DETECTED`
- ✅ Blockchain ledger verified 100% resilient

---

## 📂 Project Repository Structure

```
d:/BlockChain/
├── backend/
│   ├── src/
│   │   ├── blockchain/
│   │   │   ├── Block.js             # Block model & SHA-256 calculation
│   │   │   └── Blockchain.js        # Chain management, genesis, append, validation
│   │   ├── database/
│   │   │   ├── db.js                # SQLite DatabaseSync connection & schema
│   │   │   └── seed.js              # 10 realistic Tamil Nadu demo records + demo accounts
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification middleware
│   │   │   ├── roles.js             # RBAC middleware (with auto ACCESS_DENIED logging)
│   │   │   └── upload.js            # Multer document upload middleware
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, current user
│   │   │   ├── recordController.js  # Land records CRUD & blockchain anchoring
│   │   │   ├── verifyController.js  # Cryptographic verification & tamper detection
│   │   │   ├── blockchainController.js # Chain retrieval & validation
│   │   │   ├── auditController.js   # Filterable audit trail queries
│   │   │   ├── userController.js    # Admin user identity management
│   │   │   ├── demoController.js    # Controlled tamper simulation & restore
│   │   │   └── statsController.js   # Live dashboard statistics
│   │   ├── routes/
│   │   │   └── api.js               # Express route bindings
│   │   ├── utils/
│   │   │   ├── cryptoUtils.js       # SHA-256 and canonical hash functions
│   │   │   └── auditLogger.js       # Centralized audit logger
│   │   └── server.js                # Express app & API server
│   ├── data/
│   │   └── landchain.db             # SQLite database file
│   ├── uploads/                     # Uploaded deeds & title documents
│   ├── test-flow.js                 # Unit & cryptographic test suite
│   ├── test-server-e2e.js           # Full HTTP API & RBAC test suite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top header with blockchain health & user role
│   │   │   ├── Sidebar.jsx          # Role-based sidebar navigation
│   │   │   ├── StatCard.jsx         # Metric card
│   │   │   ├── StatusBadge.jsx      # Status & role indicators
│   │   │   ├── VerifyModal.jsx      # High-impact verification modal (Shield / Alert)
│   │   │   ├── TamperModal.jsx      # Admin demo tamper simulator modal
│   │   │   └── DemoGuideModal.jsx   # 12-step jury presentation cheat sheet
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public SIH landing page with quick verify
│   │   │   ├── LoginPage.jsx        # Login with 1-click persona quick fill
│   │   │   ├── DashboardPage.jsx    # Metrics, charts, recent blocks, security alerts
│   │   │   ├── LandRecordsPage.jsx  # Searchable & filterable records table
│   │   │   ├── AddRecordPage.jsx    # Land registration + deed upload + block minting
│   │   │   ├── RecordDetailsPage.jsx# Details, audit history, doc hash, verify button
│   │   │   ├── BlockchainExplorerPage.jsx # Visual hash-linked block explorer
│   │   │   ├── AuditLogsPage.jsx    # Filterable audit trail table
│   │   │   └── UsersPage.jsx        # Admin user management
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication & user state management
│   │   ├── services/
│   │   │   └── api.js               # API client wrapper
│   │   ├── App.jsx                  # Main application router & layout
│   │   ├── index.css                # Cybersecurity styling & animations
│   │   └── main.jsx                 # React root
│   ├── index.html                   # HTML entry
│   ├── vite.config.js               # Vite config with backend proxying
│   ├── tailwind.config.js           # Tailwind theme configuration
│   └── package.json
├── start-demo.bat                   # 1-click Windows launcher
├── package.json                     # Workspace root scripts
└── README.md                        # Documentation
```

---

## 🏆 Smart India Hackathon 2026 Evaluation Highlights

- **Completeness:** Fully implemented end-to-end prototype runnable on any laptop without heavy infrastructure requirements.
- **Security Demonstration:** Clear, tangible demonstration of cryptographic tamper detection and hash-linked blocks.
- **Enterprise Look:** Clean, authoritative government cybersecurity design language.
- **Integrity & Honesty:** Transparent architecture distinction between review prototype and planned production migration (Hyperledger Fabric / IPFS).

---
*Developed for Smart India Hackathon 2026 • Problem Statement SIH26125*
