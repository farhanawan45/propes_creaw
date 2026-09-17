# Deployment Guide — Hostinger Ubuntu VPS

This guide walks through deploying the Props & Crew Next.js site to a
Hostinger Ubuntu VPS with Node.js, PM2, Nginx and free SSL.

---

## 1. Initial server setup

SSH into your VPS:

```bash
ssh root@your-server-ip
```

Create a non-root deploy user (recommended over deploying as root):

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

Update packages and enable the firewall:

```bash
sudo apt update && sudo apt upgrade -y
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 2. Install Node.js LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 3. Get the code onto the server

```bash
sudo mkdir -p /var/www/propsncrew
sudo chown deploy:deploy /var/www/propsncrew
cd /var/www/propsncrew
git clone <your-repo-url> .
# or: scp -r ./props-new deploy@your-server-ip:/var/www/propsncrew
```

Create the production environment file:

```bash
cp .env.example .env
nano .env   # fill in real SMTP credentials, CONTACT_TO_EMAIL, NEXT_PUBLIC_SITE_URL
```

Install dependencies and build:

```bash
npm ci
npm run build
```

---

## 4. Run with PM2

Install PM2 globally:

```bash
sudo npm install -g pm2
```

The repo includes `ecosystem.config.js`-style process management via
PM2 directly (no extra config file needed for a single Next.js app):

```bash
pm2 start npm --name "propsncrew" -- start
pm2 save
pm2 startup systemd
# run the command pm2 startup prints, then:
pm2 save
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs propsncrew
pm2 restart propsncrew
```

By default Next.js listens on port 3000 (`next start`). Confirm:

```bash
curl -I http://localhost:3000
```

---

## 5. Nginx reverse proxy

Install Nginx:

```bash
sudo apt install -y nginx
```

Create the site config:

```bash
sudo nano /etc/nginx/sites-available/propsncrew.co.nz
```

```nginx
server {
    listen 80;
    server_name propsncrew.co.nz www.propsncrew.co.nz;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/propsncrew.co.nz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Point your domain's A record (and www CNAME) at the VPS IP before continuing.

---

## 6. Free SSL with Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d propsncrew.co.nz -d www.propsncrew.co.nz
```

Certbot edits the Nginx config to redirect HTTP → HTTPS and sets up
auto-renewal via a systemd timer. Verify renewal works:

```bash
sudo certbot renew --dry-run
```

---

## 7. fail2ban (brute-force protection)

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
```

The default `sshd` jail is enough for a VPS with only SSH, Nginx and
the app exposed. Add an `nginx-http-auth` / `nginx-botsearch` jail if
you later add basic-auth areas or notice scraping in the Nginx logs.

---

## 8. Optional: Cloudflare in front

1. Add the domain to Cloudflare and update nameservers at your registrar.
2. Set the DNS A record to the VPS IP, proxied (orange cloud).
3. SSL/TLS mode: **Full (strict)** (works with the Let's Encrypt cert from step 6).
4. Enable "Always Use HTTPS" and a WAF ruleset for basic bot/attack filtering.
5. Optionally set page rules to cache `/images/*` and `/videos/*` aggressively.

---

## 9. Redeploying updates

```bash
cd /var/www/propsncrew
git pull
npm ci
npm run build
pm2 restart propsncrew
```

---

## 10. Security checklist (already handled in the app)

- Security headers (CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, HSTS) are set in `next.config.ts`.
- `/api/contact` validates input with Zod, rejects honeypot-filled
  submissions, and rate-limits by IP (see `src/lib/rate-limit.ts`).
- Secrets live only in `.env` on the server (never committed — see
  `.gitignore`).
- Keep the system patched: `sudo apt update && sudo apt upgrade -y`
  on a regular schedule (or enable `unattended-upgrades`).
