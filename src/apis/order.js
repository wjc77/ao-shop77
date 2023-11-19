import request from '@/utils/http'

/*
params: {
  orderState:0, tab切换时的状态
  page:1,  当前的页数
  pageSize:2 每页的条数
}
*/


export const getUserOrder = (params) => {
  return request({
    url: '/member/order',
    method: 'GET',
    params
  })
}