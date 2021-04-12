import request from '@/utils/request'

export function getGameById(data) {
  return request({
    url: '/user/game/getGameById',
    method: 'post',
    data: data
  })
}