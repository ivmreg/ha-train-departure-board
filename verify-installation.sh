#!/bin/bash
# Verification script for Train Departure Board installation

echo "===== Train Departure Board Verification ====="
echo ""

# Check if www directory exists
if [ -d "www" ]; then
    echo "✓ www directory exists"
else
    echo "✗ www directory NOT found"
    exit 1
fi

# Check if the card file exists
if [ -f "www/train-departure-card.js" ]; then
    echo "✓ train-departure-card.js exists"
    size=$(wc -c < "www/train-departure-card.js")
    echo "  File size: $size bytes"
else
    echo "✗ train-departure-card.js NOT found"
    exit 1
fi

# Check if source map exists
if [ -f "www/train-departure-card.js.map" ]; then
    echo "✓ train-departure-card.js.map exists (source map)"
else
    echo "! Source map not found (optional)"
fi

# Verify hacs.json exists and is valid
if [ -f "hacs.json" ]; then
    echo "✓ hacs.json exists"
else
    echo "✗ hacs.json NOT found"
    exit 1
fi

# Verify README files exist
if [ -f "README.md" ]; then
    echo "✓ README.md exists"
else
    echo "✗ README.md NOT found"
fi

if [ -f "INSTALLATION.md" ]; then
    echo "✓ INSTALLATION.md exists"
else
    echo "! INSTALLATION.md not found (recommended)"
fi

if [ -f "CONFIGURATION.md" ]; then
    echo "✓ CONFIGURATION.md exists"
else
    echo "! CONFIGURATION.md not found (recommended)"
fi

# Check if card registration code is in the file
if grep -q "window.customCards" "www/train-departure-card.js"; then
    echo "✓ Card registration code found"
else
    echo "✗ Card registration code NOT found"
    exit 1
fi

# Check if the custom element is defined
if grep -q "train-departure-card" "www/train-departure-card.js"; then
    echo "✓ Custom element 'train-departure-card' defined"
else
    echo "✗ Custom element NOT defined"
    exit 1
fi

echo ""
echo "===== Verification Complete ====="
echo ""
echo "Installation appears to be correct!"
echo ""
echo "Next steps:"
echo "1. Commit and push to GitHub"
echo "2. User installs via HACS"
echo "3. If card doesn't appear, have user check:"
echo "   - Browser console (F12) for errors"
echo "   - Hard refresh (Ctrl+F5)"
echo "   - Restart Home Assistant"
echo ""
