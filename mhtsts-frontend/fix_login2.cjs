const fs = require('fs');
let content = fs.readFileSync('src/features/authentication/pages/LoginPage.jsx', 'utf8');

// The file currently has:
// return (
//     <AuthLayout>
//       <div className="mc-luxury-card">

content = content.replace(/return \(\s*<AuthLayout>/m, "return (\n    <>\n    <AuthLayout>");

// And at the bottom:
// </AuthLayout>
// 
//       {/* Footer Block */}
content = content.replace(/<\/AuthLayout>\s*\{\/\* Footer Block \*\//m, "</AuthLayout>\n\n      {/* Footer Block */");

// Actually, I can just replace the whole footer block with nothing, and put the modal inside the fragment
content = content.replace(/\{\/\* Footer Block \*\/[\s\S]*?<\/footer>/m, "");

content = content.replace(/\{\/\* Sandbox Drawer Modal overlay \*\//m, "</AuthLayout>\n      {/* Sandbox Drawer Modal overlay */");

// Also add the closing fragment at the very end
content = content.replace(/}\s*<\/div>\s*\);\s*};\s*export default LoginPage;/m, "}\n    </>\n  );\n};\n\nexport default LoginPage;");

fs.writeFileSync('src/features/authentication/pages/LoginPage.jsx', content);
console.log('LoginPage.jsx fixed syntax.');
