# Barber's Cut — Deployment Guide

## Quick Deploy to Your VPS (5 minutes)

### Step 1: Push to GitHub
```bash
# On your local machine (or wherever you downloaded these files)
mkdir barber-cut && cd barber-cut

# Copy index.html and manifest.json into this folder, then:
git init
git add .
git commit -m "initial deploy"
git remote add origin git@github.com:YOURUSERNAME/barber-cut.git
git push -u origin main
```

### Step 2: Clone on Your VPS
```bash
# SSH into your VPS
ssh your-user@your-server-ip

# Clone the repo to your web directory
sudo git clone https://github.com/YOURUSERNAME/barber-cut.git /var/www/barber-cut
```

### Step 3: Set Up Nginx
```bash
# Copy the nginx config
sudo cp /var/www/barber-cut/nginx-barber-cut.conf /etc/nginx/sites-available/barber-cut

# Edit it — change "yourdomain.com" to your actual domain or server IP
sudo nano /etc/nginx/sites-available/barber-cut

# Enable the site
sudo ln -s /etc/nginx/sites-available/barber-cut /etc/nginx/sites-enabled/

# Test config and restart
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Visit Your Site
Open your phone browser and go to:
```
http://yourdomain.com
```

### Step 5: Add to Home Screen (acts like an app)
- **iPhone**: Open in Safari → tap Share → "Add to Home Screen"
- **Android**: Open in Chrome → tap the 3 dots → "Add to Home Screen"

---

## How to Update the Site

When I give you updated files in our chat:

1. Download the new `index.html`
2. Replace it in your GitHub repo (or edit directly)
3. On your VPS:
```bash
cd /var/www/barber-cut
sudo git pull
```
That's it. Changes are live immediately.

---

## Optional: Add HTTPS (recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

This gives you a free SSL certificate so your site works on `https://`.

---

## Files Included
- `index.html` — The entire app (single file, no build step needed)
- `manifest.json` — Makes it installable as a phone app
- `nginx-barber-cut.conf` — Nginx server config
- `README.md` — This file
