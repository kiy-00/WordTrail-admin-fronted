import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  uploadavatar: 'http://localhost:8080/account/UploadAvatar',
  getwordbook: 'http://localhost:8080/api/wordbooks',
  addwordbook: 'http://localhost:8080/api/wordbooks/addWordbook'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getwordbook () {
  return request({
    url: api.getwordbook,
    method: 'get'
  })
}

export function getcurrentwordbook (wordbook) {
  return request({
    url: `http://localhost:8080/api/wordbooks/${wordbook}`,
    method: 'get'
  })
}
export function deletecurrentwordbook (wordbook) {
  return request({
    url: `http://localhost:8080/api/wordbooks/${wordbook}`,
    method: 'delete'
  })
}
export function deletevocabularies (wordbook, wordIds) {
  return request({
    url: `http://localhost:8080/api/wordbooks/${wordbook}/vocabularies`,
    method: 'delete',
    data: {
      wordIds // 这里就是关键，把第二个参数赋值给 wordIds 字段！
    }
  })
}
export function addvocabularies (wordbook, parameter) {
  return request({
    url: `http://localhost:8080/api/wordbooks/${wordbook}/vocabularies`,
    method: 'post',
    data: parameter
  })
}
export function addwordbook (parameter) {
  return request({
    url: api.addwordbook,
    method: 'post',
    data: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function uploadavatar (parameter) {
  return request({
    url: api.uploadavatar,
    method: 'post',
    data: parameter,
    Headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
