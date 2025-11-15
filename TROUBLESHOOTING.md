# Troubleshooting: Card Not Appearing

If the Train Departure Board card doesn't appear in the card picker after installation, follow these steps:

## Quick Checks

### 1. Hard Refresh Browser
- **Windows/Linux**: Ctrl + F5
- **Mac**: Cmd + Shift + R
- Or clear cache in browser settings

### 2. Restart Home Assistant
- Settings → System → Restart Home Assistant
- Wait for full restart (2-3 minutes)

### 3. Check Browser Console for Errors
- Open browser Developer Tools (F12)
- Go to Console tab
- Look for red errors containing "train-departure-board"
- Check for any JavaScript errors

## Step-by-Step Debugging

### Step 1: Verify File is Loaded
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Filter for "train-departure"
4. Refresh page
5. Check if `train-departure-board.js` appears with status 200
   - **Status 200**: File loaded successfully ✓
   - **Status 404**: File not found ✗
   - **Other**: Network/server error

### Step 2: Check if Card is Registered
1. In browser Console tab, type:
   ```javascript
   window.customCards
   ```
2. Press Enter
3. Look for an array with `train-departure-board` entry:
   ```javascript
   [
     {
       type: "train-departure-board",
       name: "Train Departure Board",
       description: "...",
       ...
     }
   ]
   ```
   - **Found**: Registration successful ✓
   - **Not found**: Registration failed ✗
   - **Empty array**: No custom cards loaded

### Step 3: Check Module Loading
1. In browser Console, type:
   ```javascript
   window.customElements.get('train-departure-board')
   ```
2. Check if it returns a class constructor
   - **Shows constructor**: Element defined ✓
   - **Undefined**: Element not defined ✗

### Step 4: Manually Test the Card
1. Go to Edit Dashboard
2. Add Card (UI mode)
3. Click the 3-dot menu → "Edit as YAML"
4. Paste this config:
   ```yaml
   type: custom:train-departure-board
   title: Test Card
   entity: sensor.my_train_sensor
   ```
5. Click Save
6. If it works here, the issue is with card discovery

## Common Issues and Solutions

### Issue: 404 Error for train-departure-board.js

**Cause**: File not found in www folder

**Solution**:
1. Check that `www/train-departure-board.js` exists
2. Verify file name is correct (case-sensitive on Linux/Mac)
3. Check file permissions: `ls -la www/`
4. File should be readable by Home Assistant user

### Issue: Resource Not Found Error

**Cause**: Lovelace resource not added

**Solution**:
1. Go to Settings → Dashboards → Resources
2. Check if `/local/train-departure-board.js` is listed
3. If not, add it:
   - Click "Add Resource"
   - URL: `/local/train-departure-board.js`
   - Resource type: JavaScript Module
   - Click "Add"

### Issue: "Module not found" in Console

**Cause**: Missing dependencies or build issue

**Solution**:
1. Verify `lit` library is bundled in the card
2. Check Network tab to ensure the file loads completely
3. Try a different browser to rule out cache issues

### Issue: Card appears but shows "Please configure an entity"

**Cause**: No entity selected or wrong entity

**Solution**:
1. Edit the card
2. Select an entity from the dropdown
3. Make sure the entity has `departures` attribute
4. Check entity in Developer Tools → States

## Console Commands for Debugging

```javascript
// Check if card is registered
// Check if the card is registered
window.customCards.filter(c => c.type === 'custom:train-departure-board')

// Check if element is defined
customElements.get('train-departure-board')

// Check if Lit is loaded
window.LitElement

// Check for TypeScript errors
console.error('Check for errors above')
```

## Still Not Working?

### Enable Debug Logging

1. Add to `configuration.yaml`:
   ```yaml
   logger:
     default: info
     logs:
       homeassistant.components.frontend: debug
   ```

2. Restart Home Assistant

3. Check logs in Settings → Developer Tools → Logs

### Reset Lovelace

1. Go to Settings → Lovelace Dashboard
2. Click 3-dot menu → "Edit dashboard"
3. Click 3-dot menu again → "Reset dashboard"
4. Add the card again

### Clear All Caches

1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear Service Worker cache:
   - Developer Tools → Application → Service Workers
   - Click "Unregister"
3. Clear Home Assistant UI cache:
   - Settings → Developer Tools → YAML
   - Check logs for cache clear

## Getting Help

If you still can't get the card to work:

1. **Check the logs** (Settings → System → Logs)
2. **Open an issue** on GitHub with:
   - Home Assistant version
   - Browser type and version
   - Installation method (HACS or manual)
   - Full console error messages
   - Screenshot of the issue
3. **Try the manual installation** as a test

## Quick Reference

| Issue | Fix |
|-------|-----|
| File not loading | Check Network tab for 404 errors |
| Card not in picker | Restart HA, hard refresh browser |
| "No configuration provided" | Select an entity in card config |
| Entity not found | Verify entity exists in States |
| Errors in console | Check browser cache and restart |
