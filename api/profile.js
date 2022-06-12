import { request } from '@/plugins/request'

// 获取文章标签列表
export const getProfile = (userName) => {
  console.log(userName);
  return request({
    method: 'GET',
    url: `/api/profiles/${userName}`
  })
}
