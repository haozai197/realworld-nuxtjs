import { request } from '@/plugins/request'

// 获取文章标签列表
export const createdComment = slug => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}`
  })
}

export const getComment = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`
  })
}
