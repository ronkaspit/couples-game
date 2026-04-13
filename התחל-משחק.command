#!/bin/bash
# לחצו פעמיים על הקובץ הזה כדי להתחיל את המשחק
cd "$(dirname "$0")"
echo ""
echo "🚀 מפעיל את משחק אנחנו..."
echo ""

# Install if needed
if [ ! -d "node_modules" ]; then
  echo "📦 מתקין חבילות (פעם ראשונה בלבד)..."
  npm install
fi

# Get local IP
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "╔══════════════════════════════════════╗"
echo "║   💑  אנחנו — משחק זוגי בלייב       ║"
echo "╠══════════════════════════════════════╣"
echo "║  📱  פתחו בטלפון:                    ║"
echo "║      http://${IP}:3000          ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "  שניכם צריכים להיות על אותה רשת WiFi"
echo "  לעצירה: Ctrl+C"
echo ""

node server.js
