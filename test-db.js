const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
  if (data && data.length > 0) {
    const bcrypt = require('bcrypt');
    const isValid = await bcrypt.compare('admin123', data[0].password);
    console.log('Password valid:', isValid);
  } else {
    console.log('No user data returned. This usually means Row Level Security (RLS) is blocking read access via the anon key.');
  }
}

test();
