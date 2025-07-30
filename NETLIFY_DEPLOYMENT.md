# 🚀 Netlify Deployment Guide

## **Your Hotel Management App is Ready for Netlify!**

### **📋 Prerequisites:**
✅ GitHub repository created  
✅ Code pushed to GitHub  
✅ Netlify account (free)  

---

## **Step 1: Create Netlify Account**

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" (use GitHub, Google, or email)
3. Complete registration

---

## **Step 2: Connect Your Repository**

1. **In Netlify Dashboard:**
   - Click "New site from Git"
   - Choose "GitHub"
   - Authorize Netlify to access your GitHub

2. **Select Your Repository:**
   - Find and select `nurdinfx/hudi-managment12`
   - Click "Deploy site"

---

## **Step 3: Configure Build Settings**

Netlify will auto-detect Next.js, but verify these settings:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18 (auto-set)

---

## **Step 4: Add Environment Variables**

**Go to:** Site settings → Environment variables

**Add these variables:**

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-site-name.netlify.app
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## **Step 5: Deploy**

1. Click "Deploy site"
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://your-site-name.netlify.app`

---

## **🎯 What You'll Get:**

- 🌐 **Live hotel management website**
- 📱 **Mobile responsive design**
- 💳 **Payment processing ready**
- 🏨 **Online booking system**
- 🔐 **User authentication**
- 📊 **Admin dashboard**

---

## **🔧 Troubleshooting:**

### **If Build Fails:**
1. Check build logs in Netlify dashboard
2. Verify environment variables are set
3. Make sure all dependencies are in package.json

### **If Site Shows 404:**
1. Check redirects in netlify.toml
2. Verify publish directory is `.next`

### **If Authentication Doesn't Work:**
1. Update NEXTAUTH_URL to your actual Netlify URL
2. Regenerate NEXTAUTH_SECRET

---

## **🚀 Your App Will Be Live At:**
`https://your-site-name.netlify.app`

**Ready to deploy? Follow the steps above and your hotel management app will be live in minutes!** 