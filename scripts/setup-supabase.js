#!/usr/bin/env node

/**
 * Supabase Setup Script for VitaPulse
 * This script helps set up Supabase locally or connect to a remote instance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_FILE = path.join(__dirname, '..', '.env');
const MIGRATION_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function installSupabaseCLI() {
  log('Installing Supabase CLI...', 'info');
  try {
    // Try npm install first
    execSync('npm install -g supabase', { stdio: 'inherit' });
    log('Supabase CLI installed successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to install Supabase CLI via npm. Please install manually:', 'error');
    log('Visit: https://supabase.com/docs/guides/cli/getting-started', 'info');
    return false;
  }
}

function initializeSupabase() {
  log('Initializing Supabase project...', 'info');
  try {
    // Initialize Supabase project
    execSync('supabase init', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    log('Supabase project initialized!', 'success');
    return true;
  } catch (error) {
    log('Failed to initialize Supabase project', 'error');
    return false;
  }
}

function startSupabase() {
  log('Starting Supabase local development...', 'info');
  try {
    // Start Supabase locally
    execSync('supabase start', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    log('Supabase started successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to start Supabase. Make sure Docker is running.', 'error');
    return false;
  }
}

function applyMigration() {
  log('Applying database migration...', 'info');
  try {
    // Apply the migration
    execSync(`supabase db reset`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    log('Database migration applied successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to apply migration', 'error');
    return false;
  }
}

function getSupabaseStatus() {
  try {
    const output = execSync('supabase status', { encoding: 'utf8', cwd: path.join(__dirname, '..') });
    return output;
  } catch (error) {
    return null;
  }
}

function updateEnvFile() {
  const status = getSupabaseStatus();
  if (!status) {
    log('Could not get Supabase status', 'error');
    return false;
  }

  // Parse the status output to extract URLs and keys
  const lines = status.split('\n');
  let apiUrl = '';
  let anonKey = '';
  let serviceKey = '';

  lines.forEach(line => {
    if (line.includes('API URL')) {
      apiUrl = line.split(':').slice(1).join(':').trim();
    }
    if (line.includes('anon key')) {
      anonKey = line.split(':').slice(1).join(':').trim();
    }
    if (line.includes('service_role key')) {
      serviceKey = line.split(':').slice(1).join(':').trim();
    }
  });

  if (apiUrl && anonKey && serviceKey) {
    // Read current .env file
    let envContent = fs.readFileSync(ENV_FILE, 'utf8');
    
    // Update Supabase configuration
    envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_URL=.*/g, `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}`);
    envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/g, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`);
    envContent = envContent.replace(/SUPABASE_SERVICE_ROLE_KEY=.*/g, `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`);
    
    // Write back to .env file
    fs.writeFileSync(ENV_FILE, envContent);
    
    log('Environment file updated with Supabase configuration!', 'success');
    log(`API URL: ${apiUrl}`, 'info');
    log('Keys have been configured automatically.', 'info');
    return true;
  } else {
    log('Could not parse Supabase configuration from status', 'error');
    return false;
  }
}

function main() {
  log('🚀 VitaPulse Supabase Setup', 'info');
  log('==============================', 'info');

  // Check if Supabase CLI is installed
  if (!checkSupabaseCLI()) {
    log('Supabase CLI not found. Installing...', 'warning');
    if (!installSupabaseCLI()) {
      process.exit(1);
    }
  } else {
    log('Supabase CLI found!', 'success');
  }

  // Check if supabase is already initialized
  const supabaseConfigExists = fs.existsSync(path.join(__dirname, '..', 'supabase', 'config.toml'));
  
  if (!supabaseConfigExists) {
    if (!initializeSupabase()) {
      process.exit(1);
    }
  } else {
    log('Supabase project already initialized!', 'success');
  }

  // Start Supabase
  if (!startSupabase()) {
    log('Please make sure Docker is installed and running, then try again.', 'error');
    process.exit(1);
  }

  // Apply migration
  if (!applyMigration()) {
    log('Migration failed, but you can try running it manually later.', 'warning');
  }

  // Update environment file
  if (!updateEnvFile()) {
    log('Please update your .env file manually with Supabase configuration.', 'warning');
  }

  log('\n🎉 Setup complete!', 'success');
  log('Your VitaPulse application is now configured with Supabase.', 'info');
  log('\nNext steps:', 'info');
  log('1. Restart your development server: npm run dev', 'info');
  log('2. Visit http://localhost:3000 to see your application', 'info');
  log('3. Visit http://localhost:54323 to access Supabase Studio', 'info');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
VitaPulse Supabase Setup Script

Usage: node setup-supabase.js [options]

Options:
  --help, -h     Show this help message
  --status       Show current Supabase status
  --reset        Reset and restart Supabase

`);
  process.exit(0);
}

if (args.includes('--status')) {
  const status = getSupabaseStatus();
  if (status) {
    console.log(status);
  } else {
    log('Supabase is not running or not configured', 'error');
  }
  process.exit(0);
}

if (args.includes('--reset')) {
  log('Resetting Supabase...', 'info');
  try {
    execSync('supabase stop', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    execSync('supabase start', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    updateEnvFile();
    log('Supabase reset complete!', 'success');
  } catch (error) {
    log('Failed to reset Supabase', 'error');
  }
  process.exit(0);
}

// Run main setup
main();