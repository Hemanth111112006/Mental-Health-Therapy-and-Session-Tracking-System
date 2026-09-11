const fs = require('fs');
const path = require('path');

const dashboardsDir = path.join(__dirname, 'src', 'pages', 'dashboard');
const files = fs.readdirSync(dashboardsDir).filter(f => f.endsWith('Dashboard.jsx') && f !== 'AdminDashboard.jsx');

for (const file of files) {
  const filePath = path.join(dashboardsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not present
  if (!content.includes('useDashboardData')) {
    content = content.replace(
      /import \{ useAuth \} from '\.\.\/\.\.\/context\/AuthContext';/,
      "import { useAuth } from '../../context/AuthContext';\nimport { useDashboardData } from '../../hooks/useDashboardData';"
    );
  }

  // Add hook call inside component
  const compName = file.replace('.jsx', '');
  const hookInjectRegex = new RegExp(`const ${compName} = \\(\\) => {\\s*const { currentUser } = useAuth\\(\\);`);
  if (content.match(hookInjectRegex) && !content.includes('const { clients, appointments, users, loading } = useDashboardData()')) {
    content = content.replace(
      hookInjectRegex,
      `const ${compName} = () => {\n  const { currentUser } = useAuth();\n  const { clients, appointments, users, loading } = useDashboardData();`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
}
