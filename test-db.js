const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const logFile = path.join(__dirname, 'debug.txt');
const log = (msg) => fs.appendFileSync(logFile, msg + '\n');

fs.writeFileSync(logFile, '--- Debug Start ---\n');

log(`CWD: ${process.cwd()}`);
const envPath = path.join(process.cwd(), '.env.local');
log(`Checking .env.local at: ${envPath}`);

if (fs.existsSync(envPath)) {
  log('.env.local exists');
  const content = fs.readFileSync(envPath, 'utf8');
  log(`File size: ${content.length}`);
  log(`First 20 chars: ${content.substring(0, 20)}`);
} else {
  log('.env.local DOES NOT EXIST');
}

const result = dotenv.config({ path: '.env.local' });
if (result.error) {
  log(`dotenv error: ${result.error.message}`);
}

const uri = process.env.MONGODB_URI;
log(`MONGODB_URI: ${uri ? 'Found' : 'Undefined'}`);

if (uri) {
    const mongoose = require('mongoose');
    log('Attempting connection...');
    mongoose.connect(uri)
      .then(() => {
        log('✅ Connected successfully!');
        process.exit(0);
      })
      .catch(err => {
        log(`❌ Connection failed: ${err.message}`);
        process.exit(1);
      });
} else {
    log('Skipping connection test because URI is missing.');
}
