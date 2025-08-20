const bcrypt = require('bcryptjs');

async function testPassword() {
  const storedHash = '$2a$12$YrZM4oCb0MiPtFnFCyLw9e3ktuZjaUaAxHm.V5p.d/xRYyYUykvli';
  const password = 'Password1';
  
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('Password comparison result:', isValid);
  
  // Also test creating a new hash
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash for Password1:', newHash);
  
  const isValidNew = await bcrypt.compare(password, newHash);
  console.log('New hash comparison result:', isValidNew);
}

testPassword();
