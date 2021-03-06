import request from '@/utils/request'

export function register(data){
  return request({
    url: '/login/user/register',
    method: 'post',
    data: data
  })
}

export function login (data){
  return request({
    url: '/login/user/login',
    method: 'post',
    data: data
  })
}

export function getUserInfo (data) {
  return request({
    url: '/login/getUserInfo',
    method:'post',
    data: data
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/user/update',
    method: 'post',
    data: data
  })
}

export function getHadGame(data) {
  return request({
    url: '/user/user/goods',
    method: 'post',
    data: data
  })
}

export function getCommentByUserId(data) {
  return request({
    url: '/user/user/comment',
    method: 'post',
    data: data
  })
}