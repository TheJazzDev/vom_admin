#!/usr/bin/env node

/**
 * Script to create your first admin user
 *
 * Usage:
 *   node scripts/create-admin.js <email> [role]
 *
 * Examples:
 *   node scripts/create-admin.js admin@example.com admin
 *   node scripts/create-admin.js super@example.com super_admin
 */

const email = process.argv[2];
const role = process.argv[3] || 'admin';

if (!email) {
  console.error('\n❌ Error: Email is required\n');
  console.log('Usage: node scripts/create-admin.js <email> [role]\n');
  console.log('Examples:');
  console.log('  node scripts/create-admin.js admin@example.com admin');
  console.log('  node scripts/create-admin.js super@example.com super_admin\n');
  process.exit(1);
}

if (!['admin', 'super_admin'].includes(role)) {
  console.error('\n❌ Error: Invalid role. Must be "admin" or "super_admin"\n');
  process.exit(1);
}

console.log('\n🔧 Setting up admin user...\n');
console.log(`Email: ${email}`);
console.log(`Role: ${role}\n`);

// Make API request to set admin role
fetch('http://localhost:3000/api/admin/set-admin-role', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, role }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log('✅ Success!\n');
      console.log(`User ${data.user.firstName} ${data.user.lastName} (${data.user.email})`);
      console.log(`has been granted ${data.user.role} role.\n`);
      console.log('You can now log in at http://localhost:3000/login\n');
    } else {
      console.error('❌ Error:', data.error);
      if (data.message) {
        console.error('Details:', data.message);
      }
      console.log('\nTroubleshooting:');
      console.log('1. Make sure the user exists in Firestore (members collection)');
      console.log('2. Verify the email is correct');
      console.log('3. Check that your dev server is running (npm run dev)');
      console.log('4. Ensure Firebase credentials are set in .env.local\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Failed to connect to API\n');
    console.error('Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Your dev server is running: npm run dev');
    console.log('2. The server is accessible at http://localhost:3000\n');
    process.exit(1);
  });
