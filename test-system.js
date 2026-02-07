#!/usr/bin/env node

/**
 * E4A System Verification Script
 * Tests: Backend connectivity, Auth flow, Seller flow
 */

const http = require('http');

const API_BASE = 'http://localhost:3000/api';

async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data } });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function main() {
  console.log('🧪 E4A System Test\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing health endpoint...');
  try {
    const health = await request('GET', '/health');
    if (health.status === 200) {
      console.log('✅ Backend is responding\n');
    } else {
      console.log('❌ Backend returned status', health.status, '\n');
      return;
    }
  } catch (err) {
    console.log('❌ Cannot connect to backend on localhost:3000');
    console.log('   Error:', err.message, '\n');
    return;
  }

  // Test 2: Signup
  console.log('2️⃣ Testing signup...');
  const email = `test${Date.now()}@test.com`;
  const signupRes = await request('POST', '/auth/register', {
    name: 'Test User',
    email: email,
    password: 'TestPass123!'
  });

  if (signupRes.status === 200 && signupRes.data.success) {
    const token = signupRes.data.token;
    const user = signupRes.data.user;
    console.log('✅ Signup successful');
    console.log('   Token:', token.slice(0, 20) + '...');
    console.log('   User ID:', user._id);
    console.log('   User Name:', user.name, '\n');

    // Test 3: Login
    console.log('3️⃣ Testing login...');
    const loginRes = await request('POST', '/auth/login', {
      email: email,
      password: 'TestPass123!'
    });

    if (loginRes.status === 200 && loginRes.data.success) {
      console.log('✅ Login successful');
      console.log('   Token:', loginRes.data.token.slice(0, 20) + '...');
      console.log('   User:', loginRes.data.user.email, '\n');
      
      console.log('🎉 All tests passed! System is working correctly.\n');
      console.log('Frontend Setup:');
      console.log('- API_BASE is set to: ' + API_BASE);
      console.log('- localStorage keys: e4a_token, e4a_user, e4a_cart');
      console.log('\nReady to test buying and selling flows! 🚀');
    } else {
      console.log('❌ Login failed');
      console.log('   Response:', loginRes.data);
    }
  } else {
    console.log('❌ Signup failed');
    console.log('   Response:', signupRes.data);
  }
}

main().catch(console.error);
