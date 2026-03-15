# 🚀 Node + Express — Learning Guide

> A practical command & package reference for this repository, extracted from `guide.txt`.  
> Keep this open while you code. ✨

---

## ⚡ Quick Start

Run these commands to bootstrap a new project from scratch:

```bash
# 1️⃣  Initialize the project
npm init

# 2️⃣  Dev tools — auto-restart & parallel scripts
npm install --save-dev nodemon concurrently

# 3️⃣  Templating engine
npm install --save-dev ejs

# 4️⃣  MySQL client
npm install --save-dev mysql2

# 5️⃣  Flash messages + email utility
npm install connect-flash nodemailer
```

> **Tip:** `--save-dev` saves packages under `devDependencies` in `package.json` — meaning they won't be included in production builds.

---

## 📦 Package Reference

| Package | Category | Purpose |
| --- | --- | --- |
| `express` | 🌐 Core | Main web framework — routes, middleware, APIs |
| `body-parser` | 🌐 Core | Parses JSON/form request bodies *(Express now has built-in alternatives)* |
| `nodemon` | 🛠️ Dev Tool | Auto-restarts server on file changes |
| `concurrently` | 🛠️ Dev Tool | Runs multiple `npm` scripts in parallel |
| `ejs` | 🎨 Templating | Renders dynamic HTML from server-side data |
| `mysql2` | 🗄️ Database | MySQL driver for Node.js |
| `mongodb` | 🗄️ Database | Official MongoDB Node.js driver |
| `mongoose` | 🗄️ Database | ODM for MongoDB — schemas, models, hooks, validation |
| `multer` | 📁 Uploads | Handles multipart/form-data for file uploads (images, docs, etc.) |
| `express-session` | 🔐 Auth | Adds server-side session support |
| `connect-mongodb-session` | 🔐 Auth | Stores sessions in MongoDB *(older approach)* |
| `connect-mongo` | 🔐 Auth | Recommended MongoDB session store |
| `express-validator` | 🛡️ Security | Validates & sanitizes incoming request data |
| `bcrypt` | 🛡️ Security | Securely hashes & verifies passwords |
| `resend` | 📧 Email | SDK for sending transactional emails |
| `nodemailer` | 📧 Email | Sends emails via SMTP/transport providers |
| `connect-flash` | 💬 UX | One-time flash messages in session (success/error after redirects) |
| `dotenv` | ⚙️ Config | Loads environment variables from a `.env` file into `process.env` |
| `crypto` | 🔒 Built-in | Node.js module for tokens, random bytes & hashing |

---

## 🎨 Tailwind CSS v4 Setup (No Vite / No Webpack)

> Ideal for Express-style backend projects where you want a **simple static CSS output** — no bundler needed.

### Step 1 — Install Tailwind CLI

```bash
npm install tailwindcss @tailwindcss/cli
```

### Step 2 — Create the Input File

Create `public/styles/input.css` with:

```css
@import "tailwindcss";
```

### Step 3 — Add Watch Script to `package.json`

```json
{
  "scripts": {
    "css:watch": "npx @tailwindcss/cli -i ./public/styles/input.css -o ./public/styles/tailwind.css --watch"
  }
}
```

### Step 4 — Link the Generated CSS in HTML / EJS

```html
<link href="/styles/tailwind.css" rel="stylesheet" />
```

### Step 5 — Start the Watcher

```bash
npm run css:watch
```

---

## 🔄 Run Server + Tailwind Together (with `concurrently`)

Want **one terminal** to rule them all? Here's how.

### Step 1 — Install `concurrently`

```bash
npm install --save-dev concurrently
```

### Step 2 — Wire Up All Scripts in `package.json`

```json
{
  "scripts": {
    "css:watch":    "npx @tailwindcss/cli -i ./public/styles/input.css -o ./public/styles/tailwind.css --watch",
    "server:watch": "nodemon App.js",
    "start":        "concurrently \"npm run css:watch\" \"npm run server:watch\""
  }
}
```

### Step 3 — Launch Everything

```bash
npm run start
```

Both the **Tailwind CSS watcher** and **Nodemon server** will start simultaneously in a single terminal. 🎉

---

## 🍃 Important Things to Remember While Using MongoDB

### 🔐 Always Encode Credentials Before Using Them in the Connection String

When building a MongoDB connection URI (e.g., for Mongoose or the native driver), **never paste the raw username or password directly into the string.**

Instead, always wrap them with **`encodeURIComponent()`**.

---

#### 🤔 Why?

MongoDB connection strings follow the URI format:

```text
mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
```

If your username or password contains **special characters** like `@`, `:`, `/`, `#`, `?`, or `%`, they will **break the URI parser** — causing confusing connection errors that are hard to debug.

`encodeURIComponent()` safely converts those characters into their percent-encoded equivalents so the URI remains valid.

| Raw Character | Encoded |
|---|---|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `?` | `%3F` |

---

#### ✅ Example

```js
import mongoose from "mongoose";

const username = encodeURIComponent(process.env.DB_USER);   // e.g., "my@user"  → "my%40user"
const password = encodeURIComponent(process.env.DB_PASS);   // e.g., "p@ss:word" → "p%40ss%3Aword"

const uri = `mongodb+srv://${username}:${password}@cluster0.mongodb.net/myDatabase`;

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Connection failed:", err));
```

> **Without `encodeURIComponent()`**, a password like `p@ss:word` would corrupt the URI and Mongoose would throw a confusing parse error instead of a clear auth failure.

---

<div align="center">
  <sub>Part of the <strong>Learning-Node-Express-MongoDB</strong> series · Chapter 00</sub>
</div>
