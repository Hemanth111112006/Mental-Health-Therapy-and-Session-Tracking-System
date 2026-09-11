const fs = require('fs');
let content = fs.readFileSync('src/features/authentication/pages/LoginPage.jsx', 'utf8');

// Replace everything from Pink Heartbeat to the start of LoginPage component
content = content.replace(/\/\/ Pink Heartbeat Wave Line Component[\s\S]*?const LoginPage/m, "import AuthLayout from '../../../layouts/AuthLayout';\n\nconst LoginPage");

// Replace the return layout wrapper up to the right panel
content = content.replace(/return \([\s\S]*?\{\/\* Right Side: Glassmorphism Sign-In Card \*\/\}\s*<div className="mc-luxury-right"[\s\S]*?<div className="mc-luxury-card">/m, "return (\n    <AuthLayout>\n      <div className=\"mc-luxury-card\">");

// Replace the closing divs of the wrapper and right panel before the Sandbox Modal
content = content.replace(/<\/div>\s*<\/div>\s*\{\/\* Dev Sandbox Modal \*\//m, "</AuthLayout>\n\n      {/* Dev Sandbox Modal */");

fs.writeFileSync('src/features/authentication/pages/LoginPage.jsx', content);
console.log('LoginPage.jsx refactored successfully.');
