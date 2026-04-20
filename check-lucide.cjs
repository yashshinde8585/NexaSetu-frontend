const fs = require('fs');
const path = require('path');

try {
    const lucidePath = path.join(process.cwd(), 'node_modules', 'lucide-react', 'dist', 'lucide-react.d.ts');
    if (fs.existsSync(lucidePath)) {
        const content = fs.readFileSync(lucidePath, 'utf8');
        // Search for specific icons
        const icons = ['Twitter', 'Linkedin', 'LinkedIn', 'GitHub', 'Github', 'X'];
        icons.forEach(icon => {
            const regex = new RegExp(`export.*declare.*const ${icon}`, 'g');
            if (content.match(regex)) {
                console.log(`Found: ${icon}`);
            }
        });
    } else {
        console.log('Lucide types not found at expected path');
    }
} catch (e) {
    console.log('Error checking lucide exports:', e.message);
}
