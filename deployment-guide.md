# ContractGuard Deployment Guide

## 🗄️ Database Setup (phpMyAdmin/MySQL)

### Step 1: Create Database
1. Open phpMyAdmin in your hosting control panel
2. Click "New" to create a new database
3. Name it `contractguard`
4. Set collation to `utf8mb4_unicode_ci`

### Step 2: Import Schema
1. Select your `contractguard` database
2. Click "Import" tab
3. Upload the `database/schema.sql` file
4. Click "Go" to execute

### Step 3: Configure Database Connection
Update your `.env` file with your database credentials:
```env
DB_HOST=your-mysql-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=contractguard
```

## 🚀 Backend Deployment Options

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend folder
4. Add environment variables in Railway dashboard
5. Get your deployed URL (e.g., `https://your-app.railway.app`)

### Option 2: Heroku
1. Install Heroku CLI
2. Create new Heroku app: `heroku create contractguard-api`
3. Set environment variables: `heroku config:set OPENAI_API_KEY=your_key`
4. Deploy: `git push heroku main`

### Option 3: DigitalOcean App Platform
1. Go to DigitalOcean Apps
2. Create new app from GitHub
3. Set build command: `npm install`
4. Set run command: `node src/backend/server.js`
5. Add environment variables

### Option 4: Shared Hosting (cPanel)
1. Upload backend files to your hosting
2. Install Node.js in cPanel
3. Create `.env` file with your settings
4. Start the application

## 🔧 Environment Variables Required

```env
# API Keys
OPENAI_API_KEY=sk-your-openai-key
ETHERSCAN_API_KEY=your-etherscan-key

# Database (from your hosting provider)
DB_HOST=your-mysql-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=contractguard

# Server
PORT=3001
NODE_ENV=production

# CORS (your frontend URL)
ALLOWED_ORIGINS=https://papaya-seahorse-ebcc5a.netlify.app
```

## 🌐 Frontend Configuration

After deploying your backend, update the API URL:

1. Edit `src/services/api.ts`
2. Replace `https://your-deployed-backend-url.com/api` with your actual backend URL
3. Redeploy frontend to Netlify

## ✅ Testing Deployment

1. **Database Test**: Visit `https://your-backend-url.com/api/health`
2. **API Test**: Try creating a project submission
3. **Full Test**: Run a complete audit workflow

## 🔒 Security Checklist

- [ ] Database credentials are secure
- [ ] API keys are in environment variables (not code)
- [ ] CORS is configured for your frontend domain only
- [ ] Rate limiting is enabled
- [ ] File upload restrictions are in place

## 📊 Monitoring

- Check server logs for errors
- Monitor database connections
- Track API usage and rate limits
- Set up uptime monitoring

## 🆘 Troubleshooting

### Database Connection Issues
- Verify credentials in `.env`
- Check if MySQL service is running
- Ensure database exists and schema is imported

### API Errors
- Check OpenAI API key is valid
- Verify Etherscan API key works
- Ensure CORS allows your frontend domain

### File Upload Issues
- Check `uploads/` directory exists and is writable
- Verify file size limits
- Ensure proper file permissions

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Redeploy backend (automatic with Railway/Heroku)
3. Update frontend if API changes
4. Run database migrations if needed

Your ContractGuard application will be fully production-ready once these steps are completed!