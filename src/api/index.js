//将四个模块请求的接口函数统一暴露
import * as trademark from './product/tradeMark';
import * as attr from './product/attr';
import * as spu from './product/spu';
import * as sku from './product/sku';
import localrequest from './localRequest';

//引入权限相关的接口文件
import * as user from './acl/user';
import role from './acl/role';
import permission from './acl/permission'
//对外暴露
// export const reqFind=()=>localrequest({url:"/child1/findByName?fathername=学年",method: 'get'});
export const reqGet=(child)=>localrequest({url:"/initvalue?formname=${child}",method:'get'});
export const reqMoni=(child)=>localrequest({url:"/${child}/initvalue",method:'get'});
export const reqMenu=()=>localrequest({url:"/init1",method:'get'});

export default {
     trademark,
     attr,
     sku,
     spu,
     user,
     role,
     permission
}