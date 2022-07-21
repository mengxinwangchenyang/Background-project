import mockRequest from '@/utils/mockRequest'
import { reqFind, reqGet as reqGetApi } from '@/api';
const state = {
     list:{},
     findResult:{}
};
const mutations = {
    GETDATA(state,list){
        state.list = list;
    },
    FIND(state,findResult){
        state.findResult=findResult;
    }
};
const actions = {
    //发请求获取首页的mock数据
    async getData({ commit }) {
        let result = await mockRequest.get('/home/list');
        if(result.code==20000){
         commit("GETDATA",result.data);
        }
    },
    async find({commit}){
        let result = await reqFind();
        commit("FIND",result.data)
    },
    async reqGet({commit}){
        let result =await reqGetApi();
        commit("FIND",result.data)
    }
};
const getters = {};
export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}
