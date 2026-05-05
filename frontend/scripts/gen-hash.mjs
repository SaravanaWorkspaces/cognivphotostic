import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/gen-hash.mjs <your-password>');
  process.exit(1);
}

if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log('\nAdd this to your .env.local:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('');
