import request from '@/utils/request'

export function getTypes() {
  return request({
    url: '/user/getType',
    method: 'get',
  })
}
export function getRecommend() {
  return request({
    url: '/user/recommend/get',
    method: 'post',
  })
}
export function getSpecSale() {
  return request({
    url: '/user/specsale/get',
    method: 'post',
  })
}