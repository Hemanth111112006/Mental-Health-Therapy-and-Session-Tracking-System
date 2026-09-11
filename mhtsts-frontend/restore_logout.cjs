const fs = require('fs');
const path = require('path');

const sidebarsDir = path.join('src', 'components', 'sidebars');
const files = fs.readdirSync(sidebarsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(sidebarsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const icon = (file === 'AdminSidebar.jsx' || file === 'ClientSidebar.jsx') 
    ? '<LogOut size={18} />' 
    : '<DoorOpen size={18} />';
    
  const logoutString = '    { to: \'/logout\', icon: ' + icon + ', label: \'Logout\' },\n  ];';
  
  content = content.replace(/\s*\];/g, '\n' + logoutString);

  fs.writeFileSync(filePath, content);
  console.log('Restored Logout in ' + file);
});
