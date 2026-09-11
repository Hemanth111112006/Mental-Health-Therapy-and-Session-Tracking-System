const fs = require('fs');
const path = require('path');

const sidebarsDir = path.join('src', 'components', 'sidebars');
const files = fs.readdirSync(sidebarsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(sidebarsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Logout
  content = content.replace(/^.*label:\s*'Logout'.*$\n?/gm, '');

  fs.writeFileSync(filePath, content);
  console.log('Cleaned ' + file);
});
