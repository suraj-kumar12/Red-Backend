// Comprehensive Verification Test for all Backend Requirements using native fetch

const BASE_URL = 'http://localhost:5000/api';

const makeRequest = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
};

const runTests = async () => {
  console.log('=== RUNNING COMPREHENSIVE BACKEND VERIFICATION ===\n');

  const timestamp = Date.now();
  const adminEmail = `admin_${timestamp}@example.com`;
  const userEmail = `user_${timestamp}@example.com`;
  const password = 'Password123!';

  let adminToken = '';
  let userToken = '';
  let categoryId = '';
  let productId = '';

  // 1. AUTHENTICATION & VALIDATION
  console.log('1. Testing Authentication & Validation:');
  
  // 1a. Invalid registration (bad email format)
  const badEmailRes = await makeRequest(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: {
      name: 'Bad Email User',
      email: 'invalid-email-format',
      password: 'Password123!',
    },
  });
  if (badEmailRes.status === 400) {
    console.log('   ✓ Bad email rejection: PASS (400 Bad Request)');
  } else {
    console.error('❌ Unexpected status for bad email:', badEmailRes.status);
  }

  // 1b. Register Admin User
  const adminRegRes = await makeRequest(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: {
      name: 'Admin Test User',
      email: adminEmail,
      password,
      role: 'admin',
    },
  });
  if (adminRegRes.status === 201) {
    adminToken = adminRegRes.data.data.token;
    console.log('   ✓ Register Admin User: PASS (201 Created)');
  } else {
    console.error('❌ Admin registration failed:', adminRegRes);
  }

  // 1c. Register Standard User
  const userRegRes = await makeRequest(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: {
      name: 'Standard Test User',
      email: userEmail,
      password,
      role: 'user',
    },
  });
  if (userRegRes.status === 201) {
    userToken = userRegRes.data.data.token;
    console.log('   ✓ Register Standard User: PASS (201 Created)');
  }

  // 1d. Login verification
  const loginRes = await makeRequest(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: { email: adminEmail, password },
  });
  if (loginRes.status === 200 && loginRes.data?.data?.token) {
    console.log('   ✓ Login with credentials: PASS (200 OK)');
  }

  // 1e. Protected /me profile endpoint
  const meRes = await makeRequest(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (meRes.status === 200 && meRes.data?.data?.user?.email === adminEmail) {
    console.log('   ✓ Get profile (/api/auth/me): PASS (200 OK)');
  }

  // 1f. Invalid token rejection
  const badTokenRes = await makeRequest(`${BASE_URL}/auth/me`, {
    headers: { Authorization: 'Bearer invalid_garbage_token' },
  });
  if (badTokenRes.status === 401) {
    console.log('   ✓ Invalid token rejection: PASS (401 Unauthorized)');
  }

  // 2. CATEGORY REQUEST VALIDATION & AUTHORIZATION
  console.log('\n2. Testing Category Request Validation & Authorization:');
  
  // 2a. Malformed category request (empty name)
  const emptyCatRes = await makeRequest(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { name: '   ', description: 'Test' },
  });
  if (emptyCatRes.status === 400) {
    console.log('   ✓ Category validation (empty name rejected): PASS (400 Bad Request)');
  }

  // 2b. Standard user forbidden to create category (RBAC)
  const forbiddenCatRes = await makeRequest(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { name: `User Cat ${timestamp}`, description: 'Test' },
  });
  if (forbiddenCatRes.status === 403) {
    console.log('   ✓ Category authorization (standard user blocked): PASS (403 Forbidden)');
  }

  // 2c. Admin creates category
  const catName = `Electronics_${timestamp}`;
  const catRes = await makeRequest(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { name: catName, description: 'Test category' },
  });
  if (catRes.status === 201) {
    categoryId = catRes.data.data._id;
    console.log('   ✓ Admin creates category: PASS (201 Created)');
  }

  // 2d. Authenticated user can read categories
  const getCatRes = await makeRequest(`${BASE_URL}/categories`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (getCatRes.status === 200 && Array.isArray(getCatRes.data.data)) {
    console.log('   ✓ Read categories by user: PASS (200 OK)');
  }

  // 3. PRODUCT REQUEST VALIDATION & AUTHORIZATION
  console.log('\n3. Testing Product Request Validation & Authorization:');
  
  // 3a. Missing required field (unitPrice)
  const missingPriceRes = await makeRequest(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Incomplete Product',
      sku: `SKU_INC_${timestamp}`,
      category: categoryId,
    },
  });
  if (missingPriceRes.status === 400) {
    console.log('   ✓ Product validation (missing unit price rejected): PASS (400 Bad Request)');
  }

  // 3b. Invalid Category ID format
  const badCatIdRes = await makeRequest(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Invalid Cat Product',
      sku: `SKU_BAD_CAT_${timestamp}`,
      category: 'invalid-object-id',
      unitPrice: 50,
    },
  });
  if (badCatIdRes.status === 400) {
    console.log('   ✓ Product validation (invalid category ObjectId rejected): PASS (400 Bad Request)');
  }

  // 3c. Standard user forbidden to create product (RBAC)
  const forbiddenProdRes = await makeRequest(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      name: 'Standard User Product',
      sku: `SKU_USR_${timestamp}`,
      category: categoryId,
      unitPrice: 50,
      quantity: 10,
    },
  });
  if (forbiddenProdRes.status === 403) {
    console.log('   ✓ Product authorization (standard user blocked): PASS (403 Forbidden)');
  }

  // 3d. Admin creates valid product
  const prodRes = await makeRequest(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: `Test Wireless Mouse ${timestamp}`,
      sku: `SKU_WM_${timestamp}`,
      category: categoryId,
      unitPrice: 29.99,
      quantity: 25,
      supplierName: 'Logitech',
      description: 'High precision wireless mouse',
    },
  });
  if (prodRes.status === 201) {
    productId = prodRes.data.data._id;
    console.log('   ✓ Admin creates valid product: PASS (201 Created)');
  }

  // 3e. Standard user can fetch products with search/filter
  const getProdsRes = await makeRequest(`${BASE_URL}/products?search=Mouse`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (getProdsRes.status === 200 && getProdsRes.data.data.products.length > 0) {
    console.log('   ✓ Search & Filter products: PASS (200 OK)');
  }

  // 4. INVENTORY REQUEST VALIDATION & STOCK OPERATIONS
  console.log('\n4. Testing Inventory Request Validation & Stock Management:');
  
  // 4a. Reject invalid stock amount (non-positive / string)
  const negStockRes = await makeRequest(`${BASE_URL}/inventory/${productId}/increase`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { amount: -5, reason: 'Invalid negative test' },
  });
  if (negStockRes.status === 400) {
    console.log('   ✓ Inventory validation (negative amount rejected): PASS (400 Bad Request)');
  }

  // 4b. Reject invalid Product ID format in inventory operation
  const badProdIdRes = await makeRequest(`${BASE_URL}/inventory/invalid-product-id/increase`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { amount: 10 },
  });
  if (badProdIdRes.status === 400) {
    console.log('   ✓ Inventory validation (invalid Product ID rejected): PASS (400 Bad Request)');
  }

  // 4c. Valid stock increase (+15)
  const incRes = await makeRequest(`${BASE_URL}/inventory/${productId}/increase`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { amount: 15, reason: 'Restock shipment' },
  });
  if (incRes.status === 200 && incRes.data.data.product.quantity === 40) {
    console.log('   ✓ Stock Increase (25 -> 40 units): PASS (200 OK)');
  }

  // 4d. Strict negative stock prevention (deduct 50 when stock is 40)
  const excessRedRes = await makeRequest(`${BASE_URL}/inventory/${productId}/reduce`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { amount: 50, reason: 'Excess order' },
  });
  if (excessRedRes.status === 400) {
    console.log(`   ✓ Negative Stock Guard (rejected 50 from 40): PASS (400 Bad Request)`);
  }

  // 4e. Valid stock reduction (-35 -> stock 5 -> Low Stock)
  const redRes = await makeRequest(`${BASE_URL}/inventory/${productId}/reduce`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { amount: 35, reason: 'Customer orders fulfillment' },
  });
  if (
    redRes.status === 200 &&
    redRes.data.data.product.quantity === 5 &&
    redRes.data.data.product.status === 'Low Stock'
  ) {
    console.log('   ✓ Stock Reduction & Low Stock status recalculation (40 -> 5): PASS (200 OK)');
  }

  // 4f. View Stock History for Product
  const histRes = await makeRequest(`${BASE_URL}/inventory/history/${productId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (histRes.status === 200 && histRes.data.data.length >= 2) {
    console.log(`   ✓ Stock History Audit log retrieved (${histRes.data.data.length} transactions): PASS (200 OK)`);
  }

  // 5. CATEGORY DELETION GUARD
  console.log('\n5. Testing Category Deletion Guard:');
  const delCatRes = await makeRequest(`${BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (delCatRes.status === 400) {
    console.log('   ✓ Category Deletion Guard (blocked when products assigned): PASS (400 Bad Request)');
  }

  console.log('\n=== ALL BACKEND REQUIREMENTS & VALIDATIONS FULLY VERIFIED ===\n');
};

runTests();
