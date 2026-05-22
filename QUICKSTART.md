# 🚀 Quick Start - Test the SDK in 3 Minutes

**No provider app needed!** Test the SDK immediately with our built-in demo.

---

## ⚡ Super Fast Method (Recommended)

### Step 1: Generate Test Keys
```bash
npm run generate-keys
```

### Step 2: Start Test Server (Terminal 1)
```bash
npm run test-server
```

This starts a server at `http://localhost:3000` that serves:
- ✅ The example app
- ✅ JWKS endpoint (for JWT validation)
- ✅ All SDK files

### Step 3: Generate a JWT (Terminal 2)
```bash
npm run generate-jwt 5
```

This creates a 5-minute session JWT. Copy the token from the output.

### Step 4: Open in Browser
```
http://localhost:3000/example?gwSession=<PASTE_JWT_HERE>
```

**That's it!** You should see:
- ⏱️ Countdown timer
- 📊 Session details
- ⏸️ Pause/Resume buttons
- 🛑 End Session button

---

## 🎮 What to Try

### Watch the Countdown
The timer updates every second showing time remaining.

### Test Pause/Resume
Click pause, wait a few seconds, then resume. Timer should continue from where it paused.

### Trigger the Warning
Generate a short JWT (1 minute) to see the warning modal:
```bash
npm run generate-jwt 1
```

After ~30 seconds remaining, you'll see a warning modal pop up!

### Test Expiration
Wait for the timer to hit zero. The session will automatically end.

### Check the Console
Open browser DevTools (F12) and check the Console tab. You'll see:
- `[MarketplaceSDK] Session initialized successfully`
- `[TimerManager] Starting timer with X seconds remaining`
- Timer updates every second

---

## 🔍 Alternative Methods

### Method 1: Two Separate Servers

**Terminal 1** - JWKS Server:
```bash
node scripts/mock-jwks-server.js
```

**Terminal 2** - Simple HTTP Server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

**Terminal 3** - Generate JWT:
```bash
npm run generate-jwt 60
```

Then open: `http://localhost:8000/examples/vanilla-js/index.html?gwSession=<JWT>`

### Method 2: Use Browser Dev Tools

If the ES module import fails, you can use the UMD build directly:

```html
<!-- Edit examples/vanilla-js/index.html -->
<!-- Replace the import with: -->
<script src="../../dist/marketplace-sdk.umd.js"></script>
<script>
  const { MarketplaceSDK } = window.MarketplaceSDK;
  // ... rest of code
</script>
```

---

## 🧪 Testing Different Scenarios

### Short Session (1 minute)
```bash
npm run generate-jwt 1
```
Perfect for testing the warning modal and expiration flow.

### Normal Session (60 minutes)
```bash
npm run generate-jwt 60
```
Standard session duration for testing.

### Long Session (24 hours)
```bash
npm run generate-jwt 1440
```
Maximum allowed duration.

### Inspect the JWT
Copy your JWT and paste it at https://jwt.io to see the decoded claims:
```json
{
  "sessionId": "sess_xyz",
  "applicationId": "app_test_123",
  "userId": "user_test_456",
  "orgId": "org_test_789",
  "email": "user_test_456@example.com",
  "startTime": 1730000000,
  "durationMinutes": 60,
  "exp": 1730003600,
  "iat": 1730000000,
  "iss": "generalwisdom.com",
  "sub": "user_test_456"
}
```

> **Note:** `email` is optional and may not be present in all JWTs.

---

## 🎯 What You're Testing

### JWT Validation
- ✅ Signature verification (RS256 with JWKS)
- ✅ Expiration checking
- ✅ Claim extraction

### Session Timer
- ✅ Accurate countdown
- ✅ Formatted display (MM:SS and HH:MM:SS)
- ✅ Pause/resume functionality

### Warning System
- ✅ Warning modal at threshold
- ✅ Countdown in modal
- ✅ Dismiss functionality

### Event System
- ✅ `onSessionStart` callback
- ✅ `onSessionWarning` callback
- ✅ `onSessionEnd` callback
- ✅ `onError` callback (try with invalid JWT)

---

## 🐛 Troubleshooting

### "Public key not found"
```bash
npm run generate-keys
```

### "SDK not built"
```bash
npm run build
```

### CORS Errors
Make sure you're using `npm run test-server` which handles CORS properly.
Don't open the HTML file directly (`file://`) - it won't work with ES modules.

### JWT Expired Immediately
The test JWT generator uses the current time. Make sure your system clock is correct.

### Can't See Console Logs
Make sure debug mode is enabled in the SDK config:
```javascript
const sdk = new MarketplaceSDK({
  // ...
  debug: true,  // ← Enable this
});
```

---

## 📱 Test on Mobile

Want to test on your phone?

1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Update the test server to listen on all interfaces:
   ```javascript
   // scripts/test-server.js
   server.listen(PORT, '0.0.0.0', () => {
     // ...
   });
   ```

3. Open on phone:
   ```
   http://192.168.1.XXX:3000/example?gwSession=<JWT>
   ```

---

## 🎓 Next Steps

Once you've verified the SDK works:

1. **Try the React Example**
   - See `examples/react/` for React integration
   - Copy `useMarketplaceSession.ts` to your app

2. **Integrate with Your App**
   - Follow README.md for full integration guide
   - Customize the warning modal styling
   - Add your own event handlers

3. **Connect to Real Backend**
   - Update `jwksUri` and `marketplaceUrl` to match your environment (dev/demo/prod)
   - For dev: `https://api.dev.generalwisdom.com/.well-known/jwks.json` and `https://dev.generalwisdom.com/`
   - For prod: `https://api.platform.generalwisdom.com/.well-known/jwks.json` and `https://platform.generalwisdom.com/`
   - Use real JWTs from your Go backend
   - Everything else stays the same!

---

## 💡 Pro Tips

**Create Different Test Scenarios:**
```bash
# Short session for testing warnings
alias jwt-short="npm run generate-jwt 1"

# Normal session
alias jwt-normal="npm run generate-jwt 60"

# Long session
alias jwt-long="npm run generate-jwt 480"
```

**Auto-reload the Page:**
Install a browser extension like "Live Server" for auto-reload on file changes.

**Test Multiple Tabs:**
Open the same session URL in multiple browser tabs to test behavior (Phase 2 will add multi-tab sync).

---

**Questions?** Check README.md for full documentation or IMPLEMENTATION_SUMMARY.md for technical details.

**Happy Testing! 🚀**
