# Installation Guide - Train Departure Board

## Prerequisites

- Home Assistant instance with Lovelace frontend
- A sensor or custom integration that provides train departure data

## Installation via HACS

1. **Add the repository to HACS:**
   - Open HACS in Home Assistant
   - Go to Frontend → Custom Repositories
   - Add URL: `https://github.com/ivmreg/ha-train-departure-board`
   - Select category: `Lovelace`
   - Click "Add"

2. **Install the card:**
   - Find "Train Departure Board" in the HACS list
   - Click "Download"
   - Restart Home Assistant

3. **Add to your dashboard:**
   - Edit your Lovelace dashboard
   - Click "Add Card"
   - Search for "Train Departure Board"
   - Select it and configure

## Manual Installation

1. **Download the card:**
   - Get `train-departure-board.js` from the latest release

2. **Copy to Home Assistant:**
   - Place the file in `<config>/www/train-departure-board.js`
   - Create the `www` folder if it doesn't exist

3. **Add resource:**
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/train-departure-board.js`
   - Resource type: JavaScript Module
   - Click "Add"

4. **Restart Home Assistant**

5. **Add to dashboard:**
   - Edit your Lovelace dashboard
   - Click "Add Card"
   - Search for "Train Departure Board"

## Troubleshooting

### Card doesn't appear in card picker

1. **Clear browser cache:**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear Home Assistant frontend cache: Settings → Developer Tools → YAML → Check Logs

2. **Check browser console:**
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Look for any errors related to `train-departure-board`

3. **Verify file is loaded:**
   - In browser DevTools Network tab, filter for `train-departure-board.js`
   - Confirm it loads successfully (200 status)

4. **Restart Home Assistant:**
   - Settings → System → Restart Home Assistant

### Card appears but shows no data

1. **Verify entity configuration:**
   - Make sure you've selected a valid entity in the card config
   - Check that the entity provides `departures` attribute

2. **Check entity data format:**
   - Go to Settings → Developer Tools → States
   - Find your sensor
   - Verify it has an `attributes.departures` array

3. **Expected data structure:**
   ```yaml
   attributes:
     departures:
       - origin_name: "Dartford"
         destination_name: "London Charing Cross"
         scheduled: "13-11-2025 22:51"
         estimated: "13-11-2025 22:51"
         platform: "1"
         operator_name: "Southeastern"
   ```

## Browser Console Verification

If the card still doesn't appear, check the browser console:

```javascript
// Check if card is registered
console.log(window.customCards);

// Should show:
// [{type: "train-departure-board", name: "Train Departure Board", ...}]
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/ivmreg/ha-train-departure-board/issues
- Check existing issues for solutions
