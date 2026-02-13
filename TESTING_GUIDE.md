# 🧪 Testing Guide - State Persistence

## Step-by-Step Testing Instructions

Follow these steps to verify that state persistence is working correctly.

---

## 🔧 Prerequisites

1. ✅ Backend is running (`.\mvnw spring-boot:run` in backend folder)
2. ✅ Frontend is running (`npm run dev` in frontend folder)
3. ✅ Browser is open at `http://localhost:5173`

---

## Test 1: User Login Persistence ✅

### Steps:
1. Open the application in your browser
2. Click on **Login** button
3. Enter user credentials:
   - Email: (your user email)
   - Password: (your password)
4. Click **Login**
5. ✅ You should be logged in and see your name in the navbar
6. Navigate to any page (e.g., `/explore`)
7. **Press F5 or Ctrl+R to refresh the page**

### Expected Result:
- ✅ You should STILL be logged in
- ✅ Your name should STILL appear in the navbar
- ✅ You should NOT be redirected to the login page
- ✅ You should stay on the same page you were on

### If it fails:
- Open DevTools (F12) → Console tab
- Look for any errors
- Check Application → Local Storage → verify token exists

---

## Test 2: Admin Login Persistence ✅

### Steps:
1. If logged in, logout first
2. Click on **Login** button
3. Enter admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`
4. Click **Login**
5. ✅ You should be logged in as admin
6. Navigate to `/adminpanel`
7. ✅ Admin panel should be visible
8. **Press F5 or Ctrl+R to refresh the page**

### Expected Result:
- ✅ You should STILL be logged in as admin
- ✅ Admin panel should STILL be accessible
- ✅ You should NOT be redirected to login or home page
- ✅ All admin features should work

### If it fails:
- Check if role is saved in localStorage
- Open DevTools → Application → Local Storage
- Verify `role` = `ADMIN`

---

## Test 3: Cart Persistence ✅

### Steps:
1. Navigate to `/explore` page
2. Click on any artwork to view details
3. Click **Add to Cart** button
4. ✅ Item should be added to cart
5. Add 2-3 more items to the cart
6. Navigate to `/cart` page
7. ✅ Verify all items are visible
8. **Press F5 or Ctrl+R to refresh the page**

### Expected Result:
- ✅ All cart items should STILL be there
- ✅ Quantities should be correct
- ✅ Total price should be accurate
- ✅ No items should be lost

### If it fails:
- Open DevTools → Application → Local Storage
- Check if `cart` key exists
- Verify it contains JSON array of items

---

## Test 4: Route Persistence ✅

### Steps:
1. Navigate to `/explore` page
2. **Press F5 to refresh**
3. ✅ Should stay on `/explore`
4. Navigate to `/userdashboard`
5. **Press F5 to refresh**
6. ✅ Should stay on `/userdashboard`
7. Navigate to `/cart`
8. **Press F5 to refresh**
9. ✅ Should stay on `/cart`

### Expected Result:
- ✅ URL should NOT change after refresh
- ✅ Should stay on the same page
- ✅ No redirect to home page

---

## Test 5: Token Expiration Handling ✅

### Steps:
1. Login successfully
2. Open DevTools (F12)
3. Go to **Application** tab
4. Click **Local Storage** → `http://localhost:5173`
5. Find the `token` key
6. **Delete the token** (right-click → Delete)
7. Try to navigate to a protected page (e.g., `/userdashboard`)

### Expected Result:
- ✅ Should automatically redirect to `/login`
- ✅ Should show "Session expired" message in console
- ✅ All localStorage should be cleared

---

## Test 6: Multiple Browser Tabs ✅

### Steps:
1. Login in Tab 1
2. Open a new tab (Tab 2) with the same URL
3. ✅ Tab 2 should also show you as logged in
4. Add items to cart in Tab 1
5. Refresh Tab 2
6. ✅ Cart items should appear in Tab 2

### Expected Result:
- ✅ State should be shared across tabs
- ✅ Both tabs should show logged-in state
- ✅ Cart should sync across tabs (after refresh)

---

## Test 7: Close and Reopen Browser ✅

### Steps:
1. Login successfully
2. Add items to cart
3. **Close the entire browser** (not just the tab)
4. **Reopen the browser**
5. Navigate to `http://localhost:5173`

### Expected Result:
- ✅ Should STILL be logged in
- ✅ Cart items should STILL be there
- ✅ No need to login again

**Note:** This works because localStorage persists even after browser is closed.

---

## Test 8: Logout Functionality ✅

### Steps:
1. Login successfully
2. Add items to cart
3. Click **Logout** button
4. ✅ Should be logged out
5. Open DevTools → Application → Local Storage
6. ✅ All localStorage should be cleared

### Expected Result:
- ✅ User should be logged out
- ✅ Cart should be empty
- ✅ localStorage should be empty
- ✅ Should be redirected to home or login page

---

## Test 9: Protected Routes ✅

### Steps:
1. **Without logging in**, try to access:
   - `/userdashboard`
   - `/adminpanel`
2. ✅ Should be redirected to `/login`
3. Login as regular user
4. Try to access `/adminpanel`
5. ✅ Should be redirected to home (not authorized)
6. Logout and login as admin
7. Try to access `/adminpanel`
8. ✅ Should be able to access admin panel

### Expected Result:
- ✅ Protected routes should require login
- ✅ Admin routes should require admin role
- ✅ Proper redirects should happen

---

## Test 10: Network Failure Handling ✅

### Steps:
1. Login successfully
2. Open DevTools → Network tab
3. Enable **Offline mode** (or disconnect internet)
4. **Refresh the page**
5. ✅ Should show logged-in state (from localStorage)
6. ✅ Background validation will fail (expected)
7. Re-enable network
8. **Refresh again**
9. ✅ Should validate token and update state

### Expected Result:
- ✅ App should work offline (with cached state)
- ✅ Should gracefully handle network errors
- ✅ Should recover when network is back

---

## 🐛 Debugging Tips

### If something doesn't work:

1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for errors (red text)

2. **Check localStorage**
   - Press F12 → Application tab
   - Local Storage → `http://localhost:5173`
   - Verify these keys exist:
     - `token`
     - `role`
     - `name`
     - `email`
     - `userId`
     - `cart`

3. **Check Network Requests**
   - Press F12 → Network tab
   - Look for `/auth/me` request
   - Check if it returns 200 or 401

4. **Use StateDebugger Component**
   - Add `<StateDebugger />` to any page
   - It will show current state in bottom-right corner

5. **Clear Everything and Start Fresh**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

---

## ✅ Success Checklist

After completing all tests, verify:

- [ ] User login persists after refresh
- [ ] Admin login persists after refresh
- [ ] Cart items persist after refresh
- [ ] Current route persists after refresh
- [ ] Token expiration triggers auto-logout
- [ ] State works across multiple tabs
- [ ] State persists after closing browser
- [ ] Logout clears all data
- [ ] Protected routes work correctly
- [ ] App handles network failures gracefully

---

## 🎉 If All Tests Pass

**Congratulations!** Your application has complete state persistence. Users can:

✅ Refresh the browser without losing their session
✅ Close and reopen the browser (session persists)
✅ Navigate freely without losing data
✅ Access protected routes after refresh
✅ Enjoy a seamless SPA experience

**Your application is production-ready!** 🚀

---

## 📞 Need Help?

If any test fails:
1. Check the console for errors
2. Verify backend is running
3. Check localStorage data
4. Review the code changes
5. Refer to `STATE_PERSISTENCE_GUIDE.md` for detailed explanation

---

**Happy Testing!** 🧪✨
