const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('\n🔍 Testing Login API Endpoint...\n');
    
    const testCredentials = [
      { email: 'admin@company.com', password: 'admin123' },
      { email: 'manideep9877@gmail.com', password: '123456' }
    ];
    
    for (const creds of testCredentials) {
      console.log(`Testing: ${creds.email}`);
      console.log(`Password: ${creds.password}`);
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', creds);
        
        console.log('✅ LOGIN SUCCESS!');
        console.log('Token:', response.data.token.substring(0, 20) + '...');
        console.log('User:', response.data.user.name);
        console.log('Role:', response.data.user.role);
        console.log('');
      } catch (error) {
        if (error.response) {
          console.log('❌ LOGIN FAILED!');
          console.log('Status:', error.response.status);
          console.log('Error:', error.response.data.message || error.response.data);
          console.log('');
        } else {
          console.log('❌ CONNECTION ERROR!');
          console.log('Error:', error.message);
          console.log('');
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLoginAPI();
