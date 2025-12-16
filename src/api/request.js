/**
 * API请求工具
 */
import axios from 'axios';
import { API_BASE_URL, getApiBaseUrl, isXiaoV2board, isXboard, CUSTOM_HEADERS_CONFIG } from '@/utils/baseConfig';
import { mapApiPath } from './utils/pathMapper';
import { getAvailableApiUrl } from '@/utils/apiAvailabilityChecker';

// 创建axios实例
const request = axios.create({
  // 初始配置使用静态API_BASE_URL
  baseURL: API_BASE_URL,
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 设置基础URL
      config.baseURL = getApiBaseUrl();
    
    // 如果启用了中间件，则映射API路径（中间件和多静态地址二选一）
    if (window.EZ_CONFIG && window.EZ_CONFIG.API_MIDDLEWARE_ENABLED) {
      // 保存原始URL，用于日志和调试
      const originalUrl = config.url;
      
      // 映射URL路径
      config.url = mapApiPath(config.url);
      
      // 开发环境下记录路径映射日志
      if (process.env.NODE_ENV === 'development') {
        console.log(`API路径映射: ${originalUrl} -> ${config.url}`);
      }
    } 
    // 如果未启用中间件，且有多个静态地址时，才检查可用的API地址
    else if (window.EZ_CONFIG && window.EZ_CONFIG.API_BASE_URLS && 
             Array.isArray(window.EZ_CONFIG.API_BASE_URLS) && 
             window.EZ_CONFIG.API_BASE_URLS.length > 1) {
      const availableApiUrl = getAvailableApiUrl();
      if (availableApiUrl) {
        config.baseURL = availableApiUrl;
      }
    }
    
    // 检查是否是Xiao-V2board面板或Xboard面板，如果是则修改请求格式
    if ((isXiaoV2board() || isXboard()) && config.method === 'post' && config.data) {
      // 将JSON请求转换为表单URL编码格式
      const formData = new URLSearchParams();
      for (const key in config.data) {
        if (Object.prototype.hasOwnProperty.call(config.data, key)) {
          formData.append(key, config.data[key]);
        }
      }
      
      // 替换原始数据并设置正确的Content-Type
      config.data = formData;
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    
    // 优先从 localStorage 获取 auth_data（原始值）
    let authData = localStorage.getItem('auth_data');
    
    // 如果 localStorage 中没有，尝试从 cookie 获取
    if (!authData) {
      try {
        // 使用 auth.js 中的 getCookie 函数获取 cookie
        const { getCookie } = require('./auth');
        authData = getCookie('auth_data');
      } catch (err) {
        // 如果导入失败或者获取失败，使用备用方式继续尝试
        // 尝试从 cookie 获取
        const cookieAuthData = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_data='));
        
        if (cookieAuthData) {
          try {
            // 尝试解析新格式的 cookie
            const encodedValue = cookieAuthData.split('=')[1];
            const decodedValue = decodeURIComponent(encodedValue);
            const parsedValue = JSON.parse(decodedValue);
            
            // 验证网站名称 (需要导入配置)
            const { SITE_CONFIG } = require('../utils/baseConfig');
            if (parsedValue && parsedValue.site === SITE_CONFIG.siteName) {
              authData = parsedValue.value;
            }
          } catch (e) {
            // 如果解析失败，可能是旧格式，直接使用值
            authData = cookieAuthData.split('=')[1];
          }
        }
      }
    }
    
    // 如果 cookie 中没有，尝试从全局变量获取
    if (!authData && window.authDataInStorage) {
      authData = window.authDataInStorage;
    }
    
    // 后备方案：尝试从 localStorage 的备份获取
    if (!authData) {
      const backupData = localStorage.getItem('cookie_auth_data');
      if (backupData) {
        try {
          // 尝试解析 JSON 格式
          const parsedValue = JSON.parse(backupData);
          
          // 验证网站名称
          const { SITE_CONFIG } = require('../utils/baseConfig');
          if (parsedValue && parsedValue.site === SITE_CONFIG.siteName) {
            authData = parsedValue.value;
          } else {
            // 可能是旧格式，直接使用
            authData = backupData;
          }
        } catch (e) {
          // 如果解析失败，可能是旧格式，直接使用
          authData = backupData;
        }
      }
    }
    
    // 设置 Authorization 头
    if (authData) {
      config.headers['Authorization'] = authData;
    }
    
    // 应用自定义标头
    try {
      // 检查是否启用了自定义标头
      if (CUSTOM_HEADERS_CONFIG && CUSTOM_HEADERS_CONFIG.enabled && CUSTOM_HEADERS_CONFIG.headers) {
        // 遍历所有自定义标头并添加到请求中
        const customHeaders = CUSTOM_HEADERS_CONFIG.headers;
        for (const headerName in customHeaders) {
          if (Object.prototype.hasOwnProperty.call(customHeaders, headerName)) {
            const headerValue = customHeaders[headerName];
            config.headers[headerName] = headerValue;
          }
        }
      }
    } catch (error) {
      console.error('应用自定义标头失败:', error);
    }
    
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(new Error('请求配置错误'));
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    try {
      // 获取响应数据
      const res = response.data;
      
      // 检查响应是否包含登录过期信息
      if (res && res.message === '未登录或登陆已过期') {
        console.log('检测到登录已过期，执行登出操作');
        // 导入 forceLogout 函数
        const { forceLogout } = require('./auth');
        // 清除用户登录状态
        forceLogout();
        // 跳转到登录页
        window.location.href = '/#/login';
        return Promise.reject(new Error(res.message));
      }
      
      // 直接返回原始响应数据，让具体的业务代码处理
      return res;
    } catch (err) {
      console.error('响应数据处理错误:', err);
      return Promise.reject(new Error('响应数据处理错误'));
    }
  },
  error => {
    // 增强错误处理，转换各种类型的错误为标准格式
    console.error('请求错误:', error);
    
    // 确保error.response.message存在，便于页面使用
    if (error.response && error.response.data && error.response.data.message) {
      // 将API返回的错误消息添加到error.response.message
      error.response.message = error.response.data.message;
    } else if (error.response) {
      // 根据HTTP状态码设置通用错误信息
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400: error.response.message = '请求参数错误'; break;
        case 401: error.response.message = '未授权，请重新登录'; break;
        case 403: error.response.message = '拒绝访问'; break;
        case 404: error.response.message = '请求的资源不存在'; break;
        default: error.response.message = `请求失败 (${statusCode})`;
      }
    } else if (error.message) {
      if (error.message.includes('timeout')) {
        error.message = '请求超时';
      } else if (error.message.includes('Network Error')) {
        error.message = '网络错误，请检查您的网络连接';
      }
    }
    
    // 返回处理后的原始错误对象
    return Promise.reject(error);
  }
);

export default request; 