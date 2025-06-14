import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  uploadavatar: 'http://60.204.222.125:8082/account/UploadAvatar',
  getwordbook: 'http://60.204.222.125:8082/api/wordbooks',
  addwordbook: 'http://60.204.222.125:8082/api/wordbooks/addWordbook',
  getpostcount: 'http://60.204.222.125:8082/admin/getpostcount',
  deletepost: 'http://60.204.222.125:8082/admin/deletepost',
  searchposttitle: 'http://60.204.222.125:8082/admin/searchposttitle',
  searchpostusername: 'http://60.204.222.125:8082/admin/searchpostusername',
  searchpostuserid: 'http://60.204.222.125:8082/admin/searchpostuserId',
  searchpoststate: 'http://60.204.222.125:8082/admin/searchpoststate',
  getuserscount: 'http://60.204.222.125:8082/admin/getuserscount',
  check: 'http://60.204.222.125:8082/api/v1/ai/check-user-content'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function postAIcheck (content) {
  return request({
    url: api.check,
    method: 'get',
    params: {
      content
    }
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
    url: `http://60.204.222.125:8082/api/wordbooks/${wordbook}`,
    method: 'get'
  })
}
export function deletecurrentwordbook (wordbook) {
  return request({
    url: `http://60.204.222.125:8082/api/wordbooks/${wordbook}`,
    method: 'delete'
  })
}
export function deletevocabularies (wordbook, wordIds) {
  return request({
    url: `http://60.204.222.125:8082/api/wordbooks/${wordbook}/vocabularies`,
    method: 'delete',
    data: {
      wordIds // 这里就是关键，把第二个参数赋值给 wordIds 字段！
    }
  })
}
export function addvocabularies (wordbook, parameter) {
  return request({
    url: `http://60.204.222.125:8082/api/wordbooks/${wordbook}/vocabularies`,
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

export function getpostcount () {
  return request({
    url: api.getpostcount,
    method: 'get'
  })
}

export function getpost (id) {
  return request({
    url: `http://60.204.222.125:8082/admin/getpost/${id}`,
    method: 'get'
  })
}

export function deletepost (id, message) {
  return request({
    url: api.deletepost,
    method: 'post',
    data: {
      id,
      message
    }
  })
}

export function getsearchposttitle (keyword) {
  return request({
    url: api.searchposttitle,
    method: 'get',
    params: {
      keyword
    }
  })
}

export function getsearchpostusername (username) {
  return request({
    url: api.searchpostusername,
    method: 'get',
    data: {
      username
    }
  })
}

export function getsearchpostuserId (userId) {
  return request({
    url: api.searchpostuserid,
    method: 'get',
    params: {
      userId
    }
  })
}

export function getsearchpoststate (state) {
  return request({
    url: api.searchpoststate,
    method: 'get',
    params: {
      state
    }
  })
}

export function postsetstate (id, state) {
  return request({
    url: `http://60.204.222.125:8082/admin/setstate/${id}`,
    method: 'post',
    data: {
      state
    }
  })
}

export function getpostsid (id) {
  return request({
    url: `http://60.204.222.125:8082/admin/posts/${id}`,
    method: 'get'
  })
}

export function deletepostidcomment (commentId, message) {
  return request({
    url: `http://60.204.222.125:8082/admin/posts/comsearchpoststatement`,
    method: 'delete',
    data: {
      commentId,
      message
    }
  })
}

export function getuserscount () {
  return request({
    url: api.getuserscount,
    method: 'get'
  })
}

export function getuser (id) {
  return request({
    url: `http://60.204.222.125:8082/admin/getuser/${id}`,
    method: 'get'
  })
}

export function postusersetstate (id, state, message) {
  return request({
    url: `http://60.204.222.125:8082/admin/users/${id}/setstate`,
    method: 'post',
    data: {
      state,
      message
    }
  })
}
