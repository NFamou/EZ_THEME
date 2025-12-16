/**
 * 获取用户详细资料
 * @Board @url GET /user/info
 * @returns {Promise<object>} - 用户信息
 * 包含内容：
 * - 用户基本资料（ID、邮箱、创建时间等）
 * - 账户余额
 * - 账户状态
 * - 套餐使用情况
 * - 权限信息
 */
import request from './request';

/**
 * 获取用户详细资料
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

/**
 * 获取用户IP地理位置信息
 * @Board @url GET https://ipwho.is/
 * @returns {Promise<object>} - IP地理位置信息
 * 包含内容：
 * - 国家/地区
 * - 省份/州
 * - 城市
 * - ISP信息
 * 注意：使用第三方接口，完整URL访问
 */
export function getIpLocationInfo() {
  return request({
    url: 'https://ipwho.is/',
    method: 'get',
    baseURL: '' // 使用完整URL，不使用基础URL
  });
}

/**
 * 兑换礼品卡
 * @Board @url POST /user/redeemgiftcard
 * @param {string} giftcard - 礼品卡兑换码
 * @returns {Promise<object>} - 兑换结果
 * 成功返回：
 * - 兑换金额
 * - 兑换后余额
 * - 礼品卡信息
 */
export function redeemGiftCard(giftcard) {
  return request({
    url: '/user/redeemgiftcard',
    method: 'post',
    data: { giftcard }
  });
}

/**
 * 修改用户密码
 * @Board @url POST /user/changePassword
 * @param {object} data - 密码数据
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 * @returns {Promise<object>} - 修改结果
 * 安全特性：
 * - 需要提供旧密码验证身份
 * - 支持密码强度验证
 */
export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  });
}

/**
 * 重置安全令牌
 * @Board @url GET /user/resetSecurity
 * @returns {Promise<object>} - 重置结果和新令牌
 * 功能：
 * - 重置用户的API访问令牌
 * - 使旧的subscriber token失效
 * - 生成新的订阅链接
 */
export function resetSecurity() {
  return request({
    url: '/user/resetSecurity',
    method: 'get'
  });
}

/**
 * 更新提醒设置
 * @Board @url POST /user/update
 * @param {object} data - 提醒设置
 * @param {number} data.remind_expire - 到期提醒 (0关闭，1开启)
 * @param {number} data.remind_traffic - 流量提醒 (0关闭，1开启)
 * @returns {Promise<object>} - 更新结果
 * 说明：
 * - 控制是否接收账户到期和流量使用提醒
 * - 会影响邮件和站内通知
 */
export function updateRemindSettings(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  });
}

/**
 * 获取用户活跃会话信息
 * @returns {Promise<object>} - 用户活跃会话列表
 * 包含内容：
 * - 登录设备信息
 * - 登录时间
 * - 登录IP
 * - 设备类型
 */
export function getActiveSession() {
  return request({
    url: '/user/getActiveSession',
    method: 'get'
  });
}

/**
 * 获取通信配置信息
 * @Board @url GET /user/comm/config
 * @returns {Promise<object>} - 通信配置信息
 * 包含内容：
 * - Telegram群组链接
 * - 支付相关设置
 * - 货币设置
 * - 佣金分发设置
 */
export function getCommConfig() {
  return request({
    url: '/user/comm/config',
    method: 'get'
  });
}

/**
 * 获取Telegram机器人信息
 * @Board @url GET /user/telegram/getBotInfo
 * @returns {Promise<object>} - Telegram机器人信息
 */
export function getTelegramBotInfo() {
  return request({
    url: '/user/telegram/getBotInfo',
    method: 'get'
  });
}

/**
 * 获取用户订阅信息
 * @Board @url GET /user/getSubscribe
 * @returns {Promise<object>} - 订阅信息
 * 包含内容：
 * - 订阅链接
 * - 套餐信息
 * - 流量使用情况
 * - 到期时间
 */
export function getUserSubscribe() {
  return request({
    url: '/user/getSubscribe',
    method: 'get'
  });
} 