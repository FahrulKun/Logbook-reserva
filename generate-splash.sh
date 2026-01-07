#!/bin/bash

# Splash Screen Generator for Komisi Treatment App
# Creates splash screens for different device sizes

echo "🌊 Generating PWA Splash Screens..."

# Define splash screen sizes
declare -a splash_screens=(
    "640x1136:portrait"
    "750x1334:portrait" 
    "1242x2208:landscape"
    "1125x2436:landscape"
)

# Create splash screens
for splash in "${splash_screens[@]}"; do
    IFS=' ' read -r -d ':' <<< "$splash"
    WIDTH="${IFS[0]}"
    HEIGHT="${IFS[1]}"
    ORIENTATION="${IFS[2]}"
    
    # Create splash screen SVG
    cat > "/home/z/my-project/public/icons/splash-${WIDTH}x${HEIGHT}.svg" << EOF
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#splashGradient)"/>
  
  <!-- Center content -->
  <g transform="translate(${WIDTH//2}, ${HEIGHT//2})">
    <!-- Icon background circle -->
    <circle cx="0" cy="0" r="${WIDTH//8}" fill="url(#centerGradient)" opacity="0.2"/>
    
    <!-- App icon (simplified) -->
    <g transform="scale(${WIDTH//16})">
      <!-- Body outline -->
      <rect x="-60" y="-30" width="120" height="60" rx="30" fill="white" opacity="0.9"/>
      
      <!-- Hands -->
      <rect x="-30" y="-60" width="60" height="120" rx="30" fill="white" opacity="0.9"/>
      <rect x="-85" y="-40" width="50" height="80" rx="25" fill="white" opacity="0.9"/>
      
      <!-- Center circle -->
      <circle cx="0" cy="0" r="8" fill="white" opacity="0.3"/>
    </g>
    
    <!-- App name -->
    <text x="0" y="${WIDTH//6}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${WIDTH//32}" font-weight="bold">
      Komisi Treatment
    </text>
    
    <!-- Tagline -->
    <text x="0" y="${WIDTH//6 + WIDTH//16}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${WIDTH//48}" opacity="0.8">
      Catatan Harian
    </text>
  </g>
</svg>
EOF

    echo "✓ Created splash-${WIDTH}x${HEIGHT}.svg (${ORIENTATION})"
done

echo "🎯 Splash screen generation complete!"
echo "📁 Files created in /home/z/my-project/public/icons/"
echo ""
echo "📱 For PWA submission, convert these SVG files to PNG format"
echo "🌐 Recommended tools:"
echo "   - Online: https://convertio.co/"
echo "   - CLI: npm install -g svg2png"
echo "   - Design: Figma, Sketch, Adobe XD"