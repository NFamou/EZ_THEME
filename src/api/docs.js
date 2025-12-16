import request from './request';

/**
 * fetchKnowledgeList - 获取知识库文档列表
 * @Board @url GET /user/knowledge/fetch?language={language}
 * @param {string} language - 语言代码，例如'zh-CN'或'en-US'
 * @returns {Promise<object>} - 文档列表
 * 返回数据：
 * - 文档分类
 * - 每个分类下的文档列表
 * - 文档ID、标题和描述
 * 特点：
 * - 支持多语言，根据language参数返回对应语言的文档
 * - 包含错误处理和格式验证
 */
export function fetchKnowledgeList(language) {
  return request({
    url: `/user/knowledge/fetch?language=${language}`,
    method: 'get'
  }).then(response => {
    // 检查响应格式是否正确
    if (typeof response === 'object') {
      return response;
    }
    
    // 如果响应不是对象，则抛出错误
    throw new Error('Invalid response format');
  }).catch(error => {
    console.error('Error fetching knowledge list:', error);
    throw error;
  });
}

/**
 * fetchKnowledgeDetail - 获取知识库文档详情
 * @Board @url GET /user/knowledge/fetch?id={id}&language={language}
 * @param {number|string} id - 文档ID
 * @param {string} language - 语言代码，例如'zh-CN'或'en-US'
 * @returns {Promise<object>} - 文档详情
 * 返回数据：
 * - 文档标题
 * - 文档内容 (HTML格式)
 * - 文档更新时间
 * - 相关文档推荐
 * 特点：
 * - 支持多语言内容
 * - 包含错误处理和格式验证
 */
export function fetchKnowledgeDetail(id, language) {
  return request({
    url: `/user/knowledge/fetch?id=${id}&language=${language}`,
    method: 'get'
  }).then(response => {
    // 检查响应格式是否正确
    if (typeof response === 'object') {
      return response;
    }
    
    // 如果响应不是对象，则抛出错误
    throw new Error('Invalid response format');
  }).catch(error => {
    console.error('Error fetching knowledge detail:', error);
    throw error;
  });
}
