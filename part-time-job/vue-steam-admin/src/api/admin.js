import request from '@/utils/request'

export function addAdmin(data) {
  return request({
    url: '/admin/admin/add',
    method: 'post',
    data:data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/admin/update',
    method: 'post',
    data: data
  })
}