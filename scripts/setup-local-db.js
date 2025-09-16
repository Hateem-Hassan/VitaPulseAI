#!/usr/bin/env node

/**
 * Local Database Setup Script for VitaPulse
 * Creates a local SQLite database with the same schema as Supabase
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, '..', 'data', 'vitapulse.db');
const DATA_DIR = path.join(__dirname, '..', 'data');
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

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    log('Created data directory', 'success');
  }
}

function convertSupabaseToSQLite(sql) {
  // Convert Supabase-specific SQL to SQLite-compatible SQL
  let converted = sql;
  
  // Remove Supabase extensions
  converted = converted.replace(/CREATE EXTENSION IF NOT EXISTS "[^"]+";/g, '');
  
  // Convert UUID to TEXT (SQLite doesn't have native UUID)
  converted = converted.replace(/\bUUID\b/g, 'TEXT');
  
  // Convert TIMESTAMPTZ to DATETIME
  converted = converted.replace(/\bTIMESTAMPTZ\b/g, 'DATETIME');
  
  // Remove RLS policies (not supported in SQLite)
  converted = converted.replace(/ALTER TABLE .+ ENABLE ROW LEVEL SECURITY;/g, '');
  converted = converted.replace(/CREATE POLICY .+;/g, '');
  
  // Remove storage bucket creation
  converted = converted.replace(/INSERT INTO storage\.buckets .+;/g, '');
  converted = converted.replace(/CREATE POLICY .+ ON storage\..+;/g, '');
  
  // Convert gen_random_uuid() to a simple function
  converted = converted.replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))")
  
  // Remove auth schema references
  converted = converted.replace(/auth\./g, '');
  
  // Convert trigger functions to SQLite syntax
  converted = converted.replace(/CREATE OR REPLACE FUNCTION ([^(]+)\(\)\s*RETURNS TRIGGER AS \$\$\s*BEGIN\s*NEW\.updated_at = CURRENT_TIMESTAMP;\s*RETURN NEW;\s*END;\s*\$\$ LANGUAGE plpgsql;/g, 
    'CREATE TRIGGER IF NOT EXISTS update_$1_updated_at AFTER UPDATE ON $1 BEGIN UPDATE $1 SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; END;');
  
  // Remove CREATE TRIGGER statements that reference functions
  converted = converted.replace(/CREATE TRIGGER .+ BEFORE UPDATE ON .+ FOR EACH ROW EXECUTE FUNCTION .+;/g, '');
  
  return converted;
}

function createDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      log('Connected to SQLite database', 'success');
      
      // Read and convert migration file
      if (!fs.existsSync(MIGRATION_FILE)) {
        reject(new Error('Migration file not found'));
        return;
      }
      
      const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf8');
      const sqliteSQL = convertSupabaseToSQLite(migrationSQL);
      
      // Split SQL into individual statements
      const statements = sqliteSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      // Execute statements one by one
      let completed = 0;
      const total = statements.length;
      
      function executeNext() {
        if (completed >= total) {
          db.close((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          return;
        }
        
        const statement = statements[completed];
        if (statement.trim()) {
          db.run(statement, (err) => {
            if (err && !err.message.includes('already exists')) {
              log(`Warning: ${err.message}`, 'warning');
              log(`Statement: ${statement.substring(0, 100)}...`, 'warning');
            }
            completed++;
            executeNext();
          });
        } else {
          completed++;
          executeNext();
        }
      }
      
      executeNext();
    });
  });
}

function updateEnvForLocalDB() {
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update database configuration for local SQLite
  envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL=sqlite:${DB_PATH}`);
  envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_URL=.*/g, 'NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000/api');
  envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/g, 'NEXT_PUBLIC_SUPABASE_ANON_KEY=local-development-key');
  
  fs.writeFileSync(envPath, envContent);
  log('Updated .env file for local database', 'success');
}

function createLocalSupabaseClient() {
  const clientPath = path.join(__dirname, '..', 'src', 'lib', 'local-supabase.ts');
  const clientContent = `import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'vitapulse.db');

class LocalSupabaseClient {
  private db: Database.Database;
  
  constructor() {
    this.db = new Database(DB_PATH);
  }
  
  // Auth methods (mock)
  auth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    signUp: async (credentials: any) => ({ data: null, error: null }),
    signIn: async (credentials: any) => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
  };
  
  // Database methods
  from(table: string) {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            try {
              const stmt = this.db.prepare(\`SELECT \${columns} FROM \${table} WHERE \${column} = ?\`);
              const data = stmt.get(value);
              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
          limit: (count: number) => ({
            async: async () => {
              try {
                const stmt = this.db.prepare(\`SELECT \${columns} FROM \${table} WHERE \${column} = ? LIMIT ?\`);
                const data = stmt.all(value, count);
                return { data, error: null };
              } catch (error) {
                return { data: null, error };
              }
            }
          })
        }),
        async: async () => {
          try {
            const stmt = this.db.prepare(\`SELECT \${columns} FROM \${table}\`);
            const data = stmt.all();
            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      insert: (values: any) => ({
        async: async () => {
          try {
            const keys = Object.keys(values);
            const placeholders = keys.map(() => '?').join(', ');
            const stmt = this.db.prepare(\`INSERT INTO \${table} (\${keys.join(', ')}) VALUES (\${placeholders})\`);
            const result = stmt.run(...Object.values(values));
            return { data: { id: result.lastInsertRowid }, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          async: async () => {
            try {
              const keys = Object.keys(values);
              const setClause = keys.map(key => \`\${key} = ?\`).join(', ');
              const stmt = this.db.prepare(\`UPDATE \${table} SET \${setClause} WHERE \${column} = ?\`);
              const result = stmt.run(...Object.values(values), value);
              return { data: result, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async: async () => {
            try {
              const stmt = this.db.prepare(\`DELETE FROM \${table} WHERE \${column} = ?\`);
              const result = stmt.run(value);
              return { data: result, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        })
      })
    };
  }
  
  // Storage methods (mock)
  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({ data: null, error: null }),
      download: async (path: string) => ({ data: null, error: null }),
      remove: async (paths: string[]) => ({ data: null, error: null })
    })
  };
}

export const supabase = new LocalSupabaseClient();
export default supabase;
`;
  
  fs.writeFileSync(clientPath, clientContent);
  log('Created local Supabase client', 'success');
}

async function main() {
  try {
    log('🚀 Setting up local database for VitaPulse', 'info');
    log('==========================================', 'info');
    
    // Ensure data directory exists
    ensureDataDirectory();
    
    // Create and populate database
    await createDatabase();
    log('Database created and migrated successfully!', 'success');
    
    // Update environment file
    updateEnvForLocalDB();
    
    // Create local Supabase client
    createLocalSupabaseClient();
    
    log('\n🎉 Local database setup complete!', 'success');
    log('Your VitaPulse application is now configured with a local SQLite database.', 'info');
    log('\nNext steps:', 'info');
    log('1. Install better-sqlite3: npm install better-sqlite3', 'info');
    log('2. Restart your development server: npm run dev', 'info');
    log('3. Visit http://localhost:3000 to see your application', 'info');
    
  } catch (error) {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();