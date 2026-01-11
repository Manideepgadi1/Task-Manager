const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('Request error:', error.message, error.code);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n🔍 Testing Login API...\n');
  
  const tests = [
    { email: 'admin@company.com', password: 'admin123' },
    { email: 'manideep9877@gmail.com', password: '123456' }
  ];
  
  for (const test of tests) {
    console.log(`Testing: ${test.email} / ${test.password}`);
    
    try {
      const result = await testLogin(test.email, test.password);
      
      if (result.status === 200) {
        console.log('✅ LOGIN SUCCESS!');
        console.log('Token:', result.data.token?.substring(0, 30) + '...');
        console.log('User:', result.data.user?.name);
        console.log('Role:', result.data.user?.role);
      } else {
        console.log(`❌ LOGIN FAILED! Status: ${result.status}`);
        console.log('Response:', result.data);
      }
    } catch (error) {
      console.log('❌ CONNECTION ERROR:', error.message);
    }
    
    console.log('');
  }
  
  process.exit(0);
}

main();
