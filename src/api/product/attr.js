//平台属性管理模块请求文件
import request from '@/utils/request';
import localrequest from '../localRequest';


//获取一级分类数据接口
///admin/product/getCategory1   get
export const reqCategory1List = ()=>localrequest({url:'/get-all-name',method:'get'});


//获取二级分类数据接口
//admin/product/getCategory2/{category1Id} get
export const reqCategory2List = (category1Id)=>localrequest({
  url:`/get-second-name?formname=${category1Id}`,
  method:'get'
  // data : {
  //   "formname" : category1Id
  // }
});

//获取三级分类数据接口
///admin/product/getCategory3/{category2Id}  get
export const reqCategory3List = (category1Id, category2Id)=>localrequest({url:`/get-third-name?formname=${category1Id}&secondId=${category2Id}`,method:'get'});


//获取平台属性接口
///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//添加属性与属性值接口
///admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data1)=>localrequest({url:'/insertUser',method:'post', data: data1});
/*
{
  "attrName": "",      属性名
  "attrValueList": [   属性名中属性值，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,          属性的id
      "valueName": "string"  属性值
    }
  ],
  "categoryId": 0,    category3Id
  "categoryLevel":3,
}
*/


