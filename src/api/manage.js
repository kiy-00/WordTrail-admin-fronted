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
  addwordbook: 'http://localhost:8080/api/wordbooks/addWordbook',
  getpostcount: 'http://localhost:8080/api/admin/getpostcount',
  deletepost: 'http://localhost:8080/api/admin/deletepost',
  searchposttitle: 'http://localhost:8080/api/admin/searchposttitle',
  searchpostusername: 'http://localhost:8080/api/admin/searchpostusername',
  searchpostuserid: 'http://localhost:8080/api/admin/searchpostuserId',
  searchpoststate: 'http://localhost:8080/api/admin/searchpoststate',
  getuserscount: 'http://localhost:8080/api/admin/getuserscount'
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

export function getpostcount () {
  return request({
    url: api.getpostcount,
    method: 'get'
  })
}

export function getpost (id) {
  return request({
    url: `http://localhost:8080/api/getpost/${id}`,
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
    data: {
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
    url: api.searchpostuserId,
    method: 'get',
    data: {
      userId
    }
  })
}

export function getsearchpoststate (state) {
  return request({
    url: api.searchpoststate,
    method: 'get',
    data: {
      state
    }
  })
}

export function postsetstate (id, state) {
  return request({
    url: `http://localhost:8080/api/admin/setstate/${id}`,
    method: 'post',
    data: {
      state
    }
  })
}

export function getpostsid (id) {
  return request({
    url: `http://localhost:8080/api/admin/posts/${id}`,
    method: 'post'
  })
}

export function deletepostidcomment (id, commentId, message) {
  return request({
    url: `http://localhost:8080/api/admin/posts/${id}`,
    method: 'post',
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
    url: `http://localhost:8080/api/admin/getuser/${id}`,
    method: 'get'
  })
}

export function postusersetstate (id, state, message) {
  return request({
    url: `http://localhost:8080/api/admin/users/${id}/setstate`,
    method: 'post',
    data: {
      state,
      message
    }
  })
}
