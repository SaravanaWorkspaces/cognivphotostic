# Troubleshooting & FAQ - CognivPhotostic

## Quick Reference

**Having an issue? Search this page (Ctrl+F) for keywords like:**
- Your error message
- What you're trying to do
- The component that's broken

---

## 🚀 Getting Started Issues

### Backend won't start

**Error:** `Cannot find module 'strapi'` or similar

**Solution:**
```bash
cd backend
npm install
npm run develop
```

**If that doesn't work:**
```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install
npm run develop
```

---

### Frontend won't start

**Error:** `Cannot find module 'next'` or `ENOENT` errors

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

**If that doesn't work:**
```bash
# Clear Next.js cache
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

### Port already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::1337` (or 3000)

**Solution:**

Kill the process using the port:

```bash
# macOS/Linux - Kill process on port 1337
lsof -ti:1337 | xargs kill -9

# Windows - Kill process on port 1337
netstat -ano | findstr :1337
taskkill /PID <PID> /F
```

Or use different ports:
```bash
# For backend, edit backend/.env
PORT=1338

# For frontend, run on different port
npm run dev -- -p 3001
```

---

### Cannot connect to database

**Error:** `connect ECONNREFUSED 127.0.0.1:5432` or similar

**Solution:**

Check database service is running:

```bash
# Check if database is running
# For SQLite (dev), it's automatic
# For MySQL (production):
sudo systemctl status mysql

# Start MySQL if stopped
sudo systemctl start mysql
```

---

## 📝 Content & Posts Issues

### Posts not appearing on website

**Symptom:** You created a post in Strapi but it doesn't show on the website

**Diagnosis:**
1. Is the post **Published**? (Check status in Strapi)
2. Is "Published At" date set? (Should be today or earlier)
3. Is the post assigned a category? (Usually optional but good practice)

**Solution:**

In Strapi:
1. Go to `Content Manager > Posts`
2. Click the post
3. Check **Status** - Should say "Published" (not "Draft")
4. Check **Published At** - Should have a date
5. If not published, click the **Publish** button
6. **Save**
7. Wait up to 1 hour for website to update (ISR cache)

---

### Images not loading

**Symptom:** Posts show broken image icons

**Possible causes:**

1. **Image not uploaded**
   - In Strapi, check image field has a file
   - Drag & drop to upload

2. **Image path broken**
   - Check image URL in Strapi starts with `/uploads/`
   - Don't use external URLs in media

3. **Backend not serving images**
   - Check Strapi is running: `pm2 logs strapi` or `npm run develop`
   - Check images folder: `backend/public/uploads/`

4. **Frontend can't reach backend**
   - Check `frontend/.env.local` has correct `NEXT_PUBLIC_STRAPI_URL`
   - Should be `http://localhost:1337` (dev) or your domain (prod)

**Solution:**

```bash
# Re-upload image
# In Strapi, delete old image and upload new one

# Or clear frontend cache
cd frontend
rm -rf .next
npm run build
npm run dev
```

---

### Post not ranking in Google Search

**Symptom:** Write a post but it doesn't appear in Google results

**Important:** This is normal for new sites! Google takes time.

**Timeline:**
- Week 1: Not indexed
- Week 2-4: Indexed but may not rank
- Month 2-3: May start ranking
- Month 6+: Good rankings possible

**Speed it up:**

1. **Submit to Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add your domain
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`
   - Click "Request Indexing" on specific posts

2. **Build backlinks:**
   - Guest post on other blogs (link back to yours)
   - Share on social media
   - Get mentioned in design roundups

3. **Improve SEO:**
   - Check your keyword is realistic (not too competitive)
   - Make sure your title/description have keyword
   - Write longer, more detailed posts (2000+ words)

4. **Be patient:**
   - New sites take 3-6 months to rank well
   - Continue creating quality content
   - Track rankings in Search Console

---

## 💰 Affiliate & Monetization Issues

### Affiliate links redirecting but no tracking

**Symptom:** Click link, goes to merchant site, but click isn't logged in Strapi

**Diagnosis:**
1. Backend `/api/affiliate-clicks` endpoint accessible?
2. Product has affiliate URL?
3. Browser console showing errors?

**Solution:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:1337/api/affiliate-clicks
   # Should get 403 (forbidden) - that's correct
   ```

2. **Check product has URL:**
   - In Strapi, edit product
   - "Affiliate URL" field has value
   - Starts with `https://`

3. **Check frontend route works:**
   ```bash
   # Try manually
   curl "http://localhost:3000/api/affiliate/1"
   # Should redirect
   ```

4. **Check browser console:**
   - Open DevTools (F12)
   - Console tab
   - Any red errors?
   - Network tab - does request to `/api/affiliate/` succeed?

---

### Affiliate link returns 404

**Symptom:** Click affiliate link, get "Product not found" error

**Causes:**
1. Product ID is wrong
2. Product doesn't exist
3. Product not published
4. Affiliate URL field is empty

**Solution:**

1. **Check product exists in Strapi:**
   - `Content Manager > Products`
   - Search for product name
   - Check it's published (Status = Published)
   - Check "Affiliate URL" has a value

2. **Check product ID:**
   - In Strapi, open product
   - Look at URL: `/content-manager/collectionType/api::product.product/12`
   - ID is the number at end (here: 12)

3. **Check product embed in post:**
   - In post's ProductEmbed block
   - Product selected correctly

---

### Commission not being earned

**Symptom:** Visitors click links and buy, but no commission

**This is not a platform issue - affiliate networks control commissions**

**Common reasons:**
1. Product page link is wrong
2. Visitor using ad blocker (some block affiliate links)
3. Visitor clicking link but not buying
4. Commission takes 30-90 days to appear
5. Order was returned/canceled
6. Wrong affiliate program (low commission rate)

**Solution:**

1. **Verify affiliate link:**
   - Log into Amazon Associates, ShareASale, etc
   - Search for product
   - Copy official affiliate link
   - Paste into Strapi product "Affiliate URL"
   - Test by clicking from Strapi preview

2. **Check affiliate dashboard:**
   - Amazon Associates: See clicks/conversions
   - ShareASale: See sales
   - Different for each network

3. **Wait for payout:**
   - Most take 30-90 days to process
   - Check your affiliate account for "pending" earnings

---

## 🎨 Design & Frontend Issues

### Website looks broken on mobile

**Symptom:** Layout weird, text too small, buttons unclickable on phone

**Solution:**

1. **Check viewport meta tag:**
   - Backend should include: `<meta name="viewport" content="width=device-width, initial-scale=1">`
   - Next.js includes this automatically

2. **Test mobile view:**
   - Right-click browser → "Inspect"
   - Click device icon (top-left corner)
   - Select "iPhone" or "Responsive"

3. **Check Tailwind CSS is working:**
   ```bash
   cd frontend
   npm run dev
   # Tailwind should auto-compile
   ```

4. **If still broken:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   npm run dev
   ```

---

### Website loads slowly

**Symptom:** Takes 5+ seconds to load

**Causes & solutions:**

1. **Large images:**
   - Compress images before upload
   - Use image compressor: tinypng.com
   - Optimal size: 1200x600 for cover

2. **Too many requests:**
   - Check Network tab in DevTools
   - Look for slow requests
   - Check backend is running fast

3. **Backend slow:**
   - Database query taking time?
   - Check: `pm2 logs strapi`
   - Check server resources: `top` command

4. **Frontend build issue:**
   ```bash
   npm run build
   # Check "3 seconds" warnings
   # Optimize large components
   ```

---

## 🔧 Admin Panel Issues

### Can't log into Strapi admin

**Error:** "Invalid credentials" or similar

**Solution:**

1. **Forgot password?**
   - There's no built-in reset
   - Contact Hostinger support to reset database
   - Or recreate admin user via code

2. **Email wrong?**
   - Try different email
   - Check keyboard layout (CAPS LOCK?)

3. **Database reset (last resort):**
   ```bash
   # Dev (SQLite)
   rm backend/.tmp/data.db
   npm run develop
   # Create new admin on first login
   ```

---

### Can't upload files to Strapi

**Error:** Upload fails, file doesn't appear

**Causes:**

1. **No `/public/uploads/` directory:**
   ```bash
   mkdir -p backend/public/uploads
   chmod 755 backend/public/uploads
   ```

2. **File size too large:**
   - Strapi limit: 100MB by default
   - Compress image first

3. **Wrong file type:**
   - Allowed: jpg, jpeg, png, gif, svg, webp
   - Not allowed: .exe, .zip, etc

4. **Permissions issue:**
   ```bash
   sudo chown -R $USER backend/public/uploads
   chmod -R 755 backend/public/uploads
   ```

---

## 📊 Data & Database Issues

### Lost content/database reset

**Symptom:** All posts/products disappeared

**Prevention (do this NOW):**

```bash
# Automated backups
# See DEPLOYMENT_GUIDE.md for backup scripts

# Manual backup
sqlite3 backend/.tmp/data.db ".dump" > backup_$(date +%Y%m%d).sql
```

**Recovery:**

If you have backup:
```bash
sqlite3 backend/.tmp/data.db < backup_20260501.sql
```

If no backup:
1. **Recreate content** - Sorry, only option
2. **Learn from this** - Set up automated backups now

---

## 🌐 Deployment Issues

### Website not accessible after deploying

**Can't reach yourdomain.com**

**Checklist:**

1. **DNS set up?**
   ```bash
   nslookup yourdomain.com
   # Should return your server IP
   ```

2. **Server running?**
   ```bash
   ssh root@server
   pm2 list
   # Both "strapi" and "nextjs" should show online
   ```

3. **Firewall blocking?**
   ```bash
   sudo ufw status
   # Should allow ports 80, 443, 22
   ```

4. **Nginx running?**
   ```bash
   sudo systemctl status nginx
   # Should be "active (running)"
   ```

5. **Try with IP:**
   - Visit `http://xxx.xxx.xxx.xxx`
   - If works, DNS is the problem
   - If doesn't work, app is the problem

---

### SSL certificate issues

**Error:** "Not Secure" warning in browser

**Solution:**

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Check Nginx config includes SSL
sudo cat /etc/nginx/sites-enabled/yourdomain
# Should have: listen 443 ssl http2;
```

---

### Backend/API endpoints returning 404

**Symptom:** `https://api.yourdomain.com/api/posts` returns 404

**Solution:**

1. **Check Strapi is running:**
   ```bash
   ssh root@server
   pm2 logs strapi
   # Should show "Strapi started successfully"
   ```

2. **Check Nginx is proxying correctly:**
   ```bash
   sudo cat /etc/nginx/sites-enabled/strapi
   # Should have: proxy_pass http://localhost:1337;
   ```

3. **Test locally on server:**
   ```bash
   curl http://localhost:1337/api/posts
   # Should return data
   ```

4. **Restart services:**
   ```bash
   pm2 restart strapi
   sudo systemctl restart nginx
   ```

---

## 🔐 Security Issues

### Seeing strange activity / potential hack

**What to do:**

1. **Change admin passwords immediately:**
   ```bash
   # In Strapi admin panel:
   - Click profile (top right)
   - Change password
   - Use 16+ character strong password
   ```

2. **Check logs for suspicious activity:**
   ```bash
   tail -f /var/log/nginx/access.log | grep "admin"
   # See who accessed admin
   ```

3. **Enable firewall:**
   ```bash
   sudo ufw enable
   sudo ufw allow 22,80,443/tcp
   ```

4. **Consider:**
   - Change database password
   - Rotate API keys
   - Enable 2FA if available

---

### Can't remember admin password

**Solution:**

Development mode (you'll lose data):
```bash
rm backend/.tmp/data.db
npm run develop
# Create new admin on first login
```

Production mode:
1. Contact your hosting provider
2. They can reset database or admin user
3. Or, use command line to update:
   ```bash
   # More complex - see Strapi docs
   ```

---

## 💬 Getting More Help

### Official Documentation
- **Strapi:** https://strapi.io/documentation
- **Next.js:** https://nextjs.org/docs
- **Node.js:** https://nodejs.org/docs

### Community Help
- **Strapi Forum:** https://forum.strapi.io
- **Next.js Discussions:** https://github.com/vercel/next.js/discussions
- **Stack Overflow:** Tag with `[strapi]` and `[next.js]`

### Debug Mode

When asking for help, include:
1. Error message (exact text)
2. What you were doing
3. Console output (from `pm2 logs` or `npm run dev`)
4. Your environment:
   - OS (Windows/Mac/Linux)
   - Node version: `node --version`
   - npm version: `npm --version`

### Asking for Help Template

```
Title: [Brief problem description]

What I'm trying to do:
[Explain your goal]

What I did:
[Steps you took]

What happened:
[The problem]

Error message:
[Exact error text]

What I expected:
[What should have happened]

My environment:
- OS: 
- Node version:
- npm version:
```

---

## 📚 Additional Resources

### Free Tools
- **Image Compression:** tinypng.com
- **SEO Audit:** ubersuggest.com (free tier)
- **Keyword Research:** Google Keyword Planner
- **Link Checker:** brokenlinkcheck.com

### Learning Resources
- **Learn Node.js:** https://nodejs.org/en/docs/guides/
- **Learn Next.js:** https://nextjs.org/learn
- **Learn Strapi:** https://strapi.io/tutorials

### Performance Monitoring
- **Uptime:** https://uptime.com (free tier)
- **Speed Test:** https://pagespeed.web.dev
- **SSL Check:** https://www.sslshopper.com/ssl-checker.html

---

## ✅ Final Checklist

If something is broken:

- [ ] Tried restarting services?
- [ ] Checked logs?
- [ ] Cleared caches?
- [ ] Reinstalled dependencies?
- [ ] Checked error message carefully?
- [ ] Searched this troubleshooting guide?
- [ ] Googled the error message?
- [ ] Checked official docs?

**80% of issues are fixed by:**
1. Restarting the service
2. Clearing cache
3. Reinstalling dependencies

**Try those three first!**

---

**Still stuck?** Post in Strapi or Next.js forums with your error message. The communities are helpful!

Good luck! You've got this. 💪
