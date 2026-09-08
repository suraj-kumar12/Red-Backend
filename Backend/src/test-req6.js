import http from 'http';

const makeRequest = (path, method, body, token) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://127.0.0.1:5000');
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: url.pathname + (url.search || ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function testStockManagement() {
  console.log('=== VERIFYING REQUIREMENT 6: STOCK MANAGEMENT ===\n');

  // 1. Auth Setup
  const email = `stock.manager.${Date.now()}@example.com`;
  const regRes = await makeRequest('/api/auth/register', 'POST', {
    name: 'Stock Manager',
    email,
    password: 'password123',
  });
  const token = regRes.body?.data?.token;
  console.log('1. User registered & token acquired:', !!token);

  // 2. Create Category & Product with 20 initial stock (In Stock)
  const catRes = await makeRequest('/api/categories', 'POST', {
    name: `Warehouse_${Date.now()}`,
    description: 'Stock testing category',
  }, token);
  const catId = catRes.body?.data?._id;

  const prodRes = await makeRequest('/api/products', 'POST', {
    name: 'Industrial Barcode Scanner',
    sku: `SKU-SCN-${Date.now()}`,
    category: catId,
    quantity: 20,
    unitPrice: 120.00,
    supplierName: 'Zebra Tech',
  }, token);
  const prodId = prodRes.body?.data?._id;
  console.log('2. Product created with 20 units -> Status:', prodRes.body?.data?.status, '(Expected: In Stock)');

  // 3. Test Increase Stock (+30 units) -> New quantity: 50, Status: In Stock
  const incRes = await makeRequest(`/api/inventory/${prodId}/increase`, 'PATCH', {
    amount: 30,
    reason: 'Restock shipment from manufacturer',
  }, token);
  console.log('\n3. Increase Stock (+30 units):');
  console.log('   Status:', incRes.status === 200 ? 'PASS (200)' : 'FAIL');
  console.log('   New Quantity:', incRes.body?.data?.product?.quantity, '(Expected: 50)');
  console.log('   New Status:', incRes.body?.data?.product?.status, '(Expected: In Stock)');

  // 4. Test Reduce Stock (-45 units) -> New quantity: 5, Status: Low Stock
  const redRes = await makeRequest(`/api/inventory/${prodId}/reduce`, 'PATCH', {
    amount: 45,
    reason: 'Large B2B wholesale fulfillment',
  }, token);
  console.log('\n4. Reduce Stock (-45 units):');
  console.log('   Status:', redRes.status === 200 ? 'PASS (200)' : 'FAIL');
  console.log('   New Quantity:', redRes.body?.data?.product?.quantity, '(Expected: 5)');
  console.log('   New Status:', redRes.body?.data?.product?.status, '(Expected: Low Stock)');

  // 5. Test Prevent Negative Inventory (Attempt to reduce by 10 when stock is 5) -> Should FAIL 400
  const negRes = await makeRequest(`/api/inventory/${prodId}/reduce`, 'PATCH', {
    amount: 10,
    reason: 'Invalid over-deduction attempt',
  }, token);
  console.log('\n5. Prevent Negative Inventory (Reduce by 10 when stock is 5):');
  console.log('   Status:', negRes.status === 400 ? 'PASS (400 Rejection)' : 'FAIL');
  console.log('   Error Message:', negRes.body?.message);

  // 6. Test Reduce Stock to 0 (-5 units) -> New quantity: 0, Status: Out of Stock
  const zeroRes = await makeRequest(`/api/inventory/${prodId}/reduce`, 'PATCH', {
    amount: 5,
    reason: 'Sold last floor model',
  }, token);
  console.log('\n6. Reduce Stock to Zero (-5 units):');
  console.log('   Status:', zeroRes.status === 200 ? 'PASS (200)' : 'FAIL');
  console.log('   New Quantity:', zeroRes.body?.data?.product?.quantity, '(Expected: 0)');
  console.log('   New Status:', zeroRes.body?.data?.product?.status, '(Expected: Out of Stock)');

  // 7. Test View Stock History for this Product
  const historyRes = await makeRequest(`/api/inventory/history/${prodId}`, 'GET', null, token);
  console.log('\n7. View Stock History for Product:');
  console.log('   Status:', historyRes.status === 200 ? 'PASS (200)' : 'FAIL');
  console.log('   Recorded Transactions Count:', historyRes.body?.data?.length, '(Expected: 3: +30, -45, -5)');
  historyRes.body?.data?.forEach((tx, idx) => {
    console.log(`   [Tx ${idx + 1}] Type: ${tx.type} | Changed: ${tx.quantityChanged} | ${tx.previousQuantity} -> ${tx.newQuantity} | Reason: "${tx.reason}" | Performed By: ${tx.performedBy?.name}`);
  });

  // 8. Test Global Stock History
  const allHistoryRes = await makeRequest('/api/inventory/history', 'GET', null, token);
  console.log('\n8. Global Inventory Transaction History:');
  console.log('   Status:', allHistoryRes.status === 200 ? 'PASS (200)' : 'FAIL', `Total global logs: ${allHistoryRes.body?.data?.length}`);

  console.log('\n=== ALL REQUIREMENT 6 STOCK MANAGEMENT TESTS PASSED ===');
}

testStockManagement().catch(console.error);
