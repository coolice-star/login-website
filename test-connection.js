// 测试前端连接后端API
// 用法: node test-connection.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://1fe81f0.r11.cpolar.top';

async function testConnection() {
  console.log('开始测试前端到后端的连接...');
  console.log(`使用API基础URL: ${API_BASE_URL}`);
  
  try {
    // 测试API状态
    console.log('\n测试API状态:');
    const statusUrl = `${API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`}/status`;
    console.log(`请求URL: ${statusUrl}`);
    
    const statusResponse = await fetch(statusUrl);
    
    console.log('响应状态:', statusResponse.status, statusResponse.statusText);
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ API状态测试成功:', statusData);
    } else {
      console.error('❌ API状态测试失败');
    }
    
    // 测试支付宝授权API
    console.log('\n测试支付宝授权API:');
    const alipayUrl = `${API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`}/auth/alipay/authorize`;
    console.log(`请求URL: ${alipayUrl}`);
    
    const alipayResponse = await fetch(alipayUrl, {
      credentials: 'include'
    });
    
    console.log('响应状态:', alipayResponse.status, alipayResponse.statusText);
    
    try {
      const alipayData = await alipayResponse.json();
      console.log('支付宝授权API响应:', alipayData);
      
      if (alipayResponse.ok && alipayData.success) {
        console.log('✅ 支付宝授权API测试成功');
        console.log('二维码URL:', alipayData.data?.qrcode);
      } else {
        console.error('❌ 支付宝授权API测试失败:', alipayData.message);
      }
    } catch (e) {
      console.error('❌ 解析支付宝授权API响应失败:', e);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testConnection(); 