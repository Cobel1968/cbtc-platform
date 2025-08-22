# 🧪 CBTC Platform Integration Testing Guide
## Issue #10: Test backend-frontend integration (login, me, logout)

## 🎯 **Testing Overview**

We need to verify that your frontend and backend work together properly for:
1. **Login Flow** - User authentication
2. **Me Endpoint** - User profile retrieval  
3. **Logout Flow** - Session termination
4. **API Integration** - Data communication

## 🚀 **Step 1: Start Both Services**

### **Start Backend** (Terminal 1)
```bash
cd backend
npm run dev
```
*Should start on http://localhost:4000*

### **Start Frontend** (Terminal 2)  
```bash
cd frontend
npm run dev
```
*Should start on http://localhost:3000*

## 🧪 **Step 2: Run Automated Tests**

### **Option A: PowerShell Test Script**
```powershell
# Run the comprehensive test script
.\test-integration.ps1

# Or with custom URLs
.\test-integration.ps1 -BackendUrl "http://localhost:4000" -FrontendUrl "http://localhost:3000"
```

### **Option B: Manual Browser Testing**

1. **Test Frontend Health**:
   - Visit: http://localhost:3000/api/test
   - Should see: `{"message": "🚀 CBTC API fonctionne parfaitement !"}`

2. **Test Backend Health**:
   - Visit: http://localhost:4000/api/health
   - Should see: Service status and uptime

3. **Test Login Page**:
   - Visit: http://localhost:3000/login
   - Try logging in with any email/password
   - Should see success message

## 🔍 **Step 3: Manual API Testing**

### **Test Login Flow**
```bash
# Test frontend login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cbtc.com", "password": "test123"}'
```

Expected Response:
```json
{
  "success": true,
  "message": "🚀 Connexion CBTC réussie ! Redirection...",
  "user": {"email": "admin@cbtc.com", "role": "admin"},
  "token": "cbtc-demo-xxxxx"
}
```

### **Test Backend Categories**
```bash
# Test backend API
curl http://localhost:4000/api/categories
```

### **Test CORS Integration**
```bash
# Test cross-origin request
curl -H "Origin: http://localhost:3000" http://localhost:4000/api/health
```

## ✅ **Step 4: Verify Results**

### **✅ Success Indicators**
- Backend responds on port 4000
- Frontend responds on port 3000  
- Login returns success + token
- No CORS errors in browser console
- API calls work between services

### **❌ Common Issues & Fixes**

1. **CORS Errors**:
   ```javascript
   // In backend/server.js, verify CORS origins include:
   // 'http://localhost:3000'
   ```

2. **Port Conflicts**:
   ```bash
   # Check what's running on ports
   netstat -ano | findstr :3000
   netstat -ano | findstr :4000
   ```

3. **Environment Variables**:
   ```bash
   # Create .env.local in frontend
   echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > frontend/.env.local
   ```

## 🎯 **Step 5: Mark as Complete**

Once all tests pass:
- ✅ Login works (returns token)
- ✅ Me endpoint responds (or gracefully handles missing endpoint)
- ✅ Logout works (or gracefully handles client-side logout)
- ✅ Frontend-backend communication is successful
- ✅ No CORS issues

**Then you can mark Issue #10 as DONE!** 🎉

## 🚀 **Production Testing**

After local testing works, test on deployed environments:
- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL

Update the test script URLs to point to production:
```powershell
.\test-integration.ps1 -BackendUrl "https://your-app.railway.app" -FrontendUrl "https://your-app.vercel.app"
```

---

**Ready to test? Let's start with Step 1!** 🚀
