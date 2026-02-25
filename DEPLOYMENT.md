# Stroud Technical Solutions — Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma db push
npx prisma generate

# 3. Start dev server
npm run dev
```

Visit `http://localhost:3000`  
Admin dashboard: `http://localhost:3000/admin` (password: `admin123`)

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub** — create a repo and push your code
2. **Import in Vercel** — go to [vercel.com/new](https://vercel.com/new) and import the repo
3. **Set environment variables** in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@yourdomain.com
   NOTIFICATION_EMAIL=Shane@stroudtechnicalsolutions.com
   ```
4. **Deploy** — Vercel auto-builds using `vercel.json`

#### Custom Domain on Vercel
1. Go to **Project → Settings → Domains**
2. Add `stroudtechnicalsolutions.com`
3. Update DNS at your registrar:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com` (for `www`)
4. Vercel auto-provisions SSL

### Option 2: DigitalOcean App Platform

1. Create a **DigitalOcean App** from your GitHub repo
2. Set build command: `npx prisma generate && npm run build`
3. Set run command: `npm start`
4. Add a **managed PostgreSQL database**
5. Set environment variables (same as above)
6. Custom domain: add in App → Settings → Domains

### Option 3: AWS (EC2 + RDS)

1. Launch an EC2 instance (Ubuntu 22.04+)
2. Install Node.js 18+, npm, nginx
3. Create an RDS PostgreSQL instance
4. Clone repo, install deps, build:
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```
5. Run with PM2: `pm2 start npm --name "sts" -- start`
6. Configure nginx as reverse proxy:
   ```nginx
   server {
     listen 80;
     server_name stroudtechnicalsolutions.com;
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```
7. SSL via Certbot: `sudo certbot --nginx -d stroudtechnicalsolutions.com`

---

## Database Setup (Production)

Switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. Update `prisma.config.ts` — the `DATABASE_URL` env var handles the rest
3. Set `DATABASE_URL` to your PostgreSQL connection string
4. Run `npx prisma db push` to create tables

---

## Email (SMTP) Setup

For Gmail:
1. Enable 2-Factor Authentication
2. Create an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password as `SMTP_PASS`

For production, consider: SendGrid, Postmark, or AWS SES

---

## Resume Storage (Production)

By default, resumes are stored in `./uploads/resumes/`. For production:
- **Vercel**: Use Vercel Blob or S3 (serverless has no persistent disk)
- **AWS**: Use S3 with the AWS SDK
- **Supabase**: Use Supabase Storage

---

## Security Checklist

- [x] Security headers (X-Frame, HSTS, CSP)
- [x] Honeypot spam protection
- [x] Input validation (Zod)
- [x] File type & size validation
- [x] Admin password protection
- [x] robots.txt blocks /admin and /api
- [ ] Set a strong `ADMIN_PASSWORD`
- [ ] Enable HTTPS (auto with Vercel/Certbot)
- [ ] Consider adding rate limiting for production
- [ ] Consider adding NextAuth.js for enterprise auth
