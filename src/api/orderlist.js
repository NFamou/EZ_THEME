import request from './request';

/**
 * 获取订单列表
 * @returns {Promise} 返回Promise，成功时返回订单列表数据
 */
export function fetchOrderList() {
  return request({
    url: '/user/order/fetch',
    method: 'get'
  }).then(response => {
    // 检查响应格式是否正确
    if (typeof response === 'object') {
      return response;
    }
    
    // 如果响应不是对象，则抛出错误
    throw new Error('Invalid response format');
  }).catch(error => {
    console.error('Error fetching order list:', error);
    throw error;
  });
}

/**
 * 取消订单
 * @param {string} tradeNo 订单号
 * @returns {Promise} 返回Promise，成功时返回取消结果
 */
export function cancelOrder(tradeNo) {
  return new Promise((resolve, reject) => {
    if (!tradeNo) {
      reject(new Error('订单号不能为空'));
      return;
    }

    request({
      url: `/user/order/cancel`,
      method: 'post',
      data: {
        trade_no: tradeNo
      }
    })
    .then(response => {
      // 成功处理
      if (response && typeof response === 'object') {
        resolve(response);
      } else {
        reject(new Error('返回数据格式不正确'));
      }
    })
    .catch(error => {
      // 捕获并处理所有类型的错误
      console.error('取消订单失败:', error);
      
      // 创建一个纯消息的错误对象
      let errorMessage = '取消订单失败';
      
      // 尝试从不同可能的错误结构中提取消息
      if (error) {
        if (typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (error.response && error.response.data) {
          const responseData = error.response.data;
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }
      }
      
      reject(new Error(errorMessage));
    });
  });
}