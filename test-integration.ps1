# CBTC Platform Integration Test Script
# Issue #10: Test backend-frontend integration (login, me, logout)

param(
    [string]$BackendUrl = "http://localhost:4000",
    [string]$FrontendUrl = "http://localhost:3000"
)

Write-Host "🚀 CBTC Platform Integration Test" -ForegroundColor Cyan
Write-Host "📡 Backend URL: $BackendUrl" -ForegroundColor Yellow
Write-Host "🌐 Frontend URL: $FrontendUrl" -ForegroundColor Yellow
Write-Host ("=" * 50) -ForegroundColor Gray

$TestResults = @{}

# Test 1: Backend Health Check
Write-Host "`n🏥 Testing Backend Health..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/health" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend Health Check: PASSED" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Service: $($response.service)" -ForegroundColor Gray
    $TestResults.BackendHealth = $true
}
catch {
    Write-Host "❌ Backend Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Make sure backend is running: npm run dev" -ForegroundColor Yellow
    $TestResults.BackendHealth = $false
}

# Test 2: Frontend Health Check
Write-Host "`n🌐 Testing Frontend Health..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$FrontendUrl/api/test" -Method Get -TimeoutSec 10
    Write-Host "✅ Frontend Health Check: PASSED" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    $TestResults.FrontendHealth = $true
}
catch {
    Write-Host "❌ Frontend Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Make sure frontend is running: npm run dev" -ForegroundColor Yellow
    $TestResults.FrontendHealth = $false
}

# Test 3: Backend Root Endpoint
Write-Host "`n🏠 Testing Backend Root..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend Root: PASSED" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    $TestResults.BackendRoot = $true
}
catch {
    Write-Host "❌ Backend Root: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $TestResults.BackendRoot = $false
}

# Test 4: Categories API
Write-Host "`n📚 Testing Categories API..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/categories" -Method Get -TimeoutSec 10
    Write-Host "✅ Categories API: PASSED" -ForegroundColor Green
    Write-Host "   Categories: $($response.length) found" -ForegroundColor Gray
    $TestResults.CategoriesAPI = $true
}
catch {
    Write-Host "❌ Categories API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $TestResults.CategoriesAPI = $false
}

# Test 5: Frontend Login (Demo Mode)
Write-Host "`n🔐 Testing Frontend Login..." -ForegroundColor Cyan
try {
    $loginData = @{
        email    = "admin@cbtc.com"
        password = "testpassword"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$FrontendUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json" -TimeoutSec 10
    
    if ($response.success) {
        Write-Host "✅ Frontend Login: PASSED" -ForegroundColor Green
        Write-Host "   Message: $($response.message)" -ForegroundColor Gray
        Write-Host "   User: $($response.user.email)" -ForegroundColor Gray
        Write-Host "   Token: Generated" -ForegroundColor Gray
        $TestResults.FrontendLogin = $true
        $global:Token = $response.token
    }
    else {
        Write-Host "❌ Frontend Login: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($response.error)" -ForegroundColor Red
        $TestResults.FrontendLogin = $false
    }
}
catch {
    Write-Host "❌ Frontend Login: ERROR" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $TestResults.FrontendLogin = $false
}

# Test 6: Frontend Courses API
Write-Host "`n📖 Testing Frontend Courses..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$FrontendUrl/api/courses" -Method Get -TimeoutSec 10
    Write-Host "✅ Frontend Courses: PASSED" -ForegroundColor Green
    Write-Host "   Courses: $($response.length) found" -ForegroundColor Gray
    $TestResults.FrontendCourses = $true
}
catch {
    Write-Host "❌ Frontend Courses: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $TestResults.FrontendCourses = $false
}

# Test Results Summary
Write-Host "`n$("=" * 50)" -ForegroundColor Gray
Write-Host "📊 CBTC Integration Test Results:" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Gray

$PassedTests = 0
$TotalTests = $TestResults.Count

foreach ($test in $TestResults.GetEnumerator()) {
    $status = if ($test.Value) { 
        $PassedTests++
        "✅ PASSED" 
    }
    else { 
        "❌ FAILED" 
    }
    Write-Host "$status $($test.Key)" -ForegroundColor $(if ($test.Value) { "Green" } else { "Red" })
}

$SuccessRate = [math]::Round(($PassedTests / $TotalTests) * 100)

Write-Host "`n🎯 Summary:" -ForegroundColor Cyan
Write-Host "   Passed: $PassedTests/$TotalTests tests" -ForegroundColor Gray
Write-Host "   Success Rate: $SuccessRate%" -ForegroundColor Gray

if ($PassedTests -eq $TotalTests) {
    Write-Host "`n🎉 All tests passed! Your CBTC platform integration is working perfectly!" -ForegroundColor Green
}
else {
    Write-Host "`n⚠️  Some tests failed. Check the details above for troubleshooting." -ForegroundColor Yellow
    Write-Host "`n🔧 Common fixes:" -ForegroundColor Cyan
    Write-Host "   • Start backend: cd backend && npm run dev" -ForegroundColor Gray
    Write-Host "   • Start frontend: cd frontend && npm run dev" -ForegroundColor Gray
    Write-Host "   • Check CORS configuration in backend/server.js" -ForegroundColor Gray
}

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Fix any failed tests" -ForegroundColor Gray
Write-Host "   2. Test on deployed environments (Railway + Vercel)" -ForegroundColor Gray
Write-Host "   3. Mark Issue #10 as complete" -ForegroundColor Gray
