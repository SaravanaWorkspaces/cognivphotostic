# Deployment Guide - Going Live to Production

## Overview

This guide walks you through deploying CognivPhotostic to a production server so your website is accessible 24/7 to the public.

**Architecture:**
- **Backend (Strapi):** Hostinger VPS (your own server)
- **Frontend (Next.js):** Vercel (recommended) or self-hosted
- **Database:** MySQL (production) / SQLite (development)

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] At least 10-20 blog posts published
- [ ] 20+ products created with affiliate links
- [ ] All posts have categories and tags
- [ ] All posts have SEO metadata filled
- [ ] Website tested locally and works
- [ ] No broken images or links
- [ ] Mobile version looks good
- [ ] Privacy policy written (mention affiliates)
- [ ] Contact information added
- [ ] Domain name registered
- [ ] Hosting account created

---

## Part 1: Deploy Backend (Strapi) to Hostinger VPS

### Step 1: Get Hostinger VPS Details

When you sign up for Hostinger:
1. You receive: **Server IP**, **Username**, **Password**
2. You get SSH access to manage the server
3. You can install Node.js and databases

**Required:**
- Server IP: `xxx.xxx.xxx.xxx`
- SSH Username: Usually `root`
- SSH Password: Your chosen password
- Root domain: `yourdomain.com`

### Step 2: Connect to Your Server

Using Mac/Linux terminal:
```bash
ssh root@xxx.xxx.xxx.xxx
# Enter your password
```

Using Windows, download PuTTY or use Windows Terminal.

### Step 3: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2 (keeps app running)
sudo npm install -g pm2

# Install Nginx (web server)
sudo apt install -y nginx

# Verify installations
node --version
npm --version
mysql --version
```

### Step 4: Set Up MySQL Database

```bash
# Log into MySQL
sudo mysql

# Create database
CREATE DATABASE cognivphotostic;

# Create user
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'strong_password_here';

# Grant permissions
GRANT ALL PRIVILEGES ON cognivphotostic.* TO 'strapi_user'@'localhost';

# Apply changes
FLUSH PRIVILEGES;

# Exit
EXIT;
```

**Save these credentials:**
- Database: `cognivphotostic`
- Username: `strapi_user`
- Password: `strong_password_here`

### Step 5: Deploy Strapi Code

```bash
# Create app directory
mkdir -p /var/www/strapi
cd /var/www/strapi

# Clone or upload your backend code
# Option A: From GitHub
git clone https://github.com/yourusername/cognivphotostic.git backend
cd backend

# Option B: Upload via SFTP (if using FTP client)
# Upload the backend folder contents

# Install dependencies
npm install

# Create production environment file
sudo nano .env.production
```

**Paste this into .env.production:**
```env
HOST=0.0.0.0
PORT=1337
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=strong_password_here
DATABASE_SSL=false
JWT_SECRET=your-random-jwt-secret-here-min-32-chars
ADMIN_JWT_SECRET=another-random-secret-here-min-32-chars
```

**Generate secrets:**
```bash
# Use this command to create random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Run it twice and copy the output
```

### Step 6: Build and Start Strapi

```bash
# Build production version
npm run build

# Test it works
npm run start
# You should see "Strapi started successfully"
# Stop with Ctrl+C

# Use PM2 to keep it running
pm2 start npm --name "strapi" -- start

# Save PM2 so it restarts on server reboot
pm2 startup
pm2 save
```

### Step 7: Set Up Nginx Reverse Proxy

Nginx acts as a gateway to your Strapi app:

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/strapi
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Replace `api.yourdomain.com` with your actual domain**

```bash
# Enable the config
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (free)
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts
# Choose to redirect HTTP to HTTPS

# Auto-renewal
sudo systemctl enable certbot.timer
```

✓ **Backend is now live at:** `https://api.yourdomain.com`

---

## Part 2: Deploy Frontend (Next.js) to Vercel

### Recommended: Use Vercel (Easiest)

Vercel is made by the Next.js creators and deploys in minutes.

#### Step 1: Prepare Repository

Push your code to GitHub:

```bash
# In your frontend folder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cognivphotostic-frontend.git
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your repositories
4. Click "New Project"
5. Select your `cognivphotostic-frontend` repository
6. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `frontend`
   - **Environment Variables:** Add these:
     ```
     NEXT_PUBLIC_STRAPI_URL = https://api.yourdomain.com
     ```
7. Click "Deploy"

✓ **Frontend is now live!** Vercel gives you a URL like `cognivphotostic.vercel.app`

#### Step 3: Set Custom Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain: `yourdomain.com`
3. Update DNS records (Vercel shows exact records to add)
4. Wait 24 hours for DNS to propagate

✓ **Your site is now at:** `https://yourdomain.com`

---

## Part 3: Alternative - Self-Host Frontend

If you prefer to run everything on Hostinger:

### Step 1: Build Production Frontend

```bash
# On your local machine, in frontend folder
npm run build

# This creates .next folder (ready for production)
```

### Step 2: Upload to Server

```bash
# Copy frontend folder to server
scp -r frontend/ root@xxx.xxx.xxx.xxx:/var/www/

# SSH into server
ssh root@xxx.xxx.xxx.xxx
cd /var/www/frontend

# Install dependencies
npm install --production

# Create .env.production
nano .env.production
```

**Paste:**
```env
NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com
```

### Step 3: Start Frontend with PM2

```bash
# Start Next.js app
pm2 start "npm start" --name "nextjs"

# Save
pm2 save
```

### Step 4: Set Up Nginx for Frontend

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/nextjs
```

**Paste:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable and test
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

✓ **Frontend is now live at:** `https://yourdomain.com`

---

## Part 4: Database Migration (Development to Production)

### Migrate Your Content

Your local SQLite database needs to move to the production MySQL database.

#### Option A: Export and Import (Simple)

**On your local machine:**

```bash
# Export from local Strapi
# Use Strapi's data export (if available in your version)
# Or manually create content in production admin panel
```

**In production Strapi:**

1. Go to `https://api.yourdomain.com/admin`
2. Create your admin account (first time only)
3. Recreate categories, tags, products
4. Create blog posts (or use content management tools)

#### Option B: Direct Database Dump (Advanced)

```bash
# On local machine, export SQLite
sqlite3 backend/.tmp/data.db ".dump" > backup.sql

# Upload to server
scp backup.sql root@xxx.xxx.xxx.xxx:/tmp/

# On server, import into MySQL
ssh root@xxx.xxx.xxx.xxx
mysql cognivphotostic < /tmp/backup.sql

# Verify
mysql cognivphotostic -e "SHOW TABLES;"
```

---

## Part 5: Verification & Testing

### Test Backend

```bash
curl -s https://api.yourdomain.com/api/posts | jq .
```

Should return JSON with your posts.

### Test Frontend

1. Open `https://yourdomain.com` in browser
2. Check pages load:
   - [ ] Homepage
   - [ ] /blog (blog listing)
   - /blog/post-slug (individual post)
   - /category/category-name (category archive)
   - /products (products page)
3. Test affiliate links work
4. Check on mobile
5. Verify images load

### Test Affiliate Tracking

1. Click an affiliate link
2. You should be redirected to merchant site
3. Check Strapi admin → Affiliate Clicks (should show the click)

### Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `yourdomain.com`
3. Verify domain ownership
4. Submit sitemap (auto-generated at `/sitemap.xml`)
5. Monitor search performance

---

## Ongoing Maintenance

### Daily
- [ ] Monitor uptime (no errors in logs)
- [ ] Check affiliate clicks (in Strapi admin)

### Weekly
- [ ] Check server resources (CPU, memory, disk)
- [ ] Review logs for errors

### Monthly
- [ ] Update dependencies
- [ ] Backup database
- [ ] Monitor analytics
- [ ] Check SSL certificate expiration

### Quarterly
- [ ] Update Node.js (if needed)
- [ ] Security audit
- [ ] Performance review

### Automated Backups

```bash
# Create backup script
nano /home/backup.sh
```

**Paste:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/strapi"

mkdir -p $BACKUP_DIR

# Backup MySQL
mysqldump -u strapi_user -pstrong_password_here cognivphotostic > $BACKUP_DIR/db_$DATE.sql

# Backup Strapi uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/strapi/public/uploads

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

```bash
# Make executable
chmod +x /home/backup.sh

# Schedule daily at 2 AM
crontab -e
# Add line: 0 2 * * * /home/backup.sh
```

---

## Monitoring & Logs

### Check Strapi Status

```bash
pm2 logs strapi
# Shows real-time logs
```

### Check Frontend Status

```bash
pm2 logs nextjs
```

### Check Nginx

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## Common Production Issues

### Issue: Posts not appearing

**Solution:**
1. Check posts are published (not draft)
2. Check "Published At" date is set
3. Clear Next.js cache: `npm run build`
4. Restart frontend: `pm2 restart nextjs`

### Issue: Images not loading

**Solution:**
1. Check Strapi is running: `pm2 logs strapi`
2. Check image files exist: `/var/www/strapi/public/uploads`
3. Check Nginx config is correct
4. Clear browser cache

### Issue: Affiliate links not working

**Solution:**
1. Check product has affiliate URL filled in
2. Check product is published
3. Check link is correct (starts with `https://`)
4. Test link directly

### Issue: Database connection error

**Solution:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env.production
cat .env.production

# Test connection
mysql -h localhost -u strapi_user -p cognivphotostic
# Enter password
```

---

## Security Best Practices

✓ **Strong Passwords**
- Admin account: 16+ characters, mixed case, numbers, symbols
- Database user: Same

✓ **Firewall**
```bash
sudo ufw enable
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
```

✓ **SSL/HTTPS**
- All connections should be HTTPS
- Update environment variables to use HTTPS URLs

✓ **Regular Updates**
```bash
sudo apt update && sudo apt upgrade
npm update
```

✓ **Backups**
- Automated daily backups
- Store backups off-site
- Test restore process monthly

✓ **Access Control**
- Don't share admin passwords
- Use strong email for Strapi admin
- Only open necessary ports

---

## Post-Launch Checklist

- [ ] Backend accessible and returning data
- [ ] Frontend accessible and loading correctly
- [ ] All pages render properly
- [ ] Affiliate links working
- [ ] Images loading
- [ ] Mobile version working
- [ ] SSL certificates valid
- [ ] Database backed up
- [ ] PM2 processes set to auto-start
- [ ] Nginx configured
- [ ] DNS pointing to correct IPs
- [ ] Google Search Console set up
- [ ] Analytics installed
- [ ] Monitor uptime for 48 hours
- [ ] Team trained on admin panel

---

## Getting Help

### Common Resources

- **Strapi Docs:** https://strapi.io/documentation
- **Next.js Docs:** https://nextjs.org/docs
- **Hostinger Support:** Your control panel
- **Vercel Support:** https://vercel.com/support

### Debugging

Before asking for help:
1. Check logs: `pm2 logs`
2. Check error messages
3. Test with curl: `curl -v https://api.yourdomain.com`
4. Verify DNS: `nslookup yourdomain.com`
5. Check firewall: `sudo ufw status`

---

**Congratulations on going live! 🎉**

Your affiliate marketing blog is now live and ready for traffic. Monitor performance, create quality content, and watch your revenue grow!
