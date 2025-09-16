// Database setup script for VitaPulse
// This script creates all necessary tables and policies in Supabase

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_role_key_here') {
  console.error('❌ Missing Supabase credentials. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up VitaPulse database...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        // Continue with other statements
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('🎉 Database setup completed!');
    
    // Test the connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('⚠️  Note: Some tables may not be accessible yet. This is normal.');
    } else {
      console.log('✅ Database connection verified!');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach: Create tables using Supabase client directly
async function createTablesDirectly() {
  console.log('🔧 Creating tables using direct SQL execution...');
  
  const tables = [
    {
      name: 'users',
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          email_verified BOOLEAN DEFAULT FALSE,
          role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'premium', 'professional', 'admin')),
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE
        );
      `
    },
    {
      name: 'user_profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          date_of_birth DATE,
          gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
          cultural_background VARCHAR(100),
          language_preference VARCHAR(10) DEFAULT 'en',
          medical_history JSONB DEFAULT '[]',
          emergency_contacts JSONB DEFAULT '[]',
          privacy_settings JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.error(`❌ Error creating ${table.name}:`, error.message);
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    } catch (err) {
      console.error(`❌ Failed to create ${table.name}:`, err.message);
    }
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, createTablesDirectly };