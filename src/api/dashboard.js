/**
 * Dashboard相关API接口
 */
import request from './request';

/**
 * getUserInfo - 获取用户信息
 * @Board @url GET /user/info
 * @returns {Promise<object>} - 用户信息
 * 返回数据：
 * - 用户基本资料
 * - 账户余额
 * - 套餐信息
 * - 使用统计
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

/**
 * getSubscribe - 获取用户订阅信息
 * @Board @url GET /user/getSubscribe
 * @returns {Promise<object>} - 订阅信息
 * 返回数据：
 * - 订阅链接
 * - 二维码
 * - 套餐详情
 * - 到期时间
 * - 流量使用情况
 */
export function getSubscribe() {
  return request({
    url: '/user/getSubscribe',
    method: 'get'
  });
}

/**
 * getNotices - 获取用户通知
 * @Board @url GET /user/notice/fetch
 * @returns {Promise<Array>} - 通知列表
 * 返回数据：
 * - 通知ID、标题、内容
 * - 发布时间
 * - 已读状态
 * - 通知类型（系统通知、个人通知等）
 */
export function getNotices() {
  return request({
    url: '/user/notice/fetch',
    method: 'get'
  });
}

/**
 * getUserStats - 获取用户统计数据
 * @Board @url GET /user/getStat
 * @returns {Promise<object>} - 用户统计
 * 返回数据：
 * - 流量使用统计（今日、本月、总计）
 * - 在线设备数
 * - 最近登录记录
 * - 账户活跃度
 */
export function getUserStats() {
  return request({
    url: '/user/getStat',
    method: 'get'
  });
}

/**
 * getUserConfig - 获取用户通用配置
 * @Board @url GET /user/comm/config
 * @returns {Promise<object>} - 通用配置
 * 返回数据：
 * - 货币符号
 * - 货币代码
 * - 时区设置
 * - 语言偏好
 * - 系统功能开关状态
 */
export function getUserConfig() {
  return request({
    url: '/user/comm/config',
    method: 'get'
  });
}
