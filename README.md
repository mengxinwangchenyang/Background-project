# vue-admin-template

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template


**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Build Setup

```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo

![demo](https://github.com/PanJiaChen/PanJiaChen.github.io/blob/master/images/demo.gif)

## Extra

If you want router permission && generate menu by user roles , you can use this branch [permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

For `typescript` version, you can use [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))

## Related Project

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen






接口地址++++++++++++
权限管理: http://39.98.123.211:8170/swagger-ui.html
商品管理：http://39.98.123.211:8216/swagger-ui.html
活动与优惠券管理：http://39.98.123.211:8200/swagger-ui.html
订单管理：http://39.98.123.211:8204/swagger-ui.html
客户管理：http://39.98.123.211:8208/swagger-ui.html







<template>
  <div class="app-container">
    <el-form inline>
      <!-- 表单元素 -->
      <el-form-item>
         <el-input v-model="tempSearchObj.username" placeholder="用户名" />
      </el-form-item>
      <!-- 查询与情况的按钮 -->
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button type="danger" @click="revomveUsers" :disabled="selectedIds.length===0"
        >批量删除</el-button>
    </div>

    <!-- table表格：展示用户信息的地方 -->
    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="users"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="权限列表" />
      
      <el-table-column prop="gmtCreate" label="创建时间" width="180"/>
      <el-table-column prop="gmtModified" label="更新时间" width="180"/>

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{row}">
          <HintButton type="info" size="mini" icon="el-icon-user-solid" title="分配角色"
            @click="showAssignRole(row)"/>
          <HintButton type="primary" size="mini" icon="el-icon-edit" title="修改用户"
            @click="showUpdateUser(row)"/>
          <el-popconfirm :title="`确定删除 ${row.username} 吗?`" @onConfirm="removeUser(row.id)">
            <HintButton style="margin-left:10px" slot="reference" type="danger" size="mini" icon="el-icon-delete" 
              title="删除用户"/>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
    <!-- 对话框的结构 -->
    <el-dialog :title="user.id ? '修改用户' : '添加用户'" :visible.sync="dialogUserVisible">
      <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"/>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName"/>
        </el-form-item>
        
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole">保存</el-button>
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'AclUserList',

  data () {
    return {
      listLoading: false, // 是否显示列表加载的提示
      searchObj: { // 包含请求搜索条件数据的对象
        username: ''
      },
      tempSearchObj: { // 收集搜索条件输入的对象
        username: ''
      },
      selectedIds: [], // 所有选择的user的id的数组
      users: [], // 当前页的用户列表
      page: 1, // 当前页码
      limit: 3, // 每页数量
      total: 0, // 总数量
      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      userRules: { // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: '用户名必须输入' },
          { min: 4, message: '用户名不能小于4位' }
        ],
        password: [
          { required: true, validator: this.validatePassword }
        ]
      },
      loading: false, // 是否正在提交请求中
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
    }
  },

  //发请求一般情况下，我们都是在mounted去发，但是也可以在created内部去发
  created () {
    this.getUsers()
  },

  methods: {
    /* 
    显示指定角色的界面
    */
    showAssignRole (user) {
      this.user = user
      this.dialogRoleVisible = true
      this.getRoles()
    },

    /* 
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange (value) {// value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /* 
    异步获取用户的角色列表
    */
    async getRoles () {
      const result = await this.$API.user.getRoles(this.user.id)
      const {allRolesList, assignRoles} = result.data
      this.allRoles = allRolesList
      this.userRoleIds = assignRoles.map(item => item.id)
      
      this.checkAll = allRolesList.length===assignRoles.length
      this.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
    },

    /* 
    角色列表选中项发生改变的监听
    */
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },

    /* 
    请求给用户进行角色授权
    */
    async assignRole () {
      const userId = this.user.id
      const roleIds = this.userRoleIds.join(',')
      this.loading = true
      const result = await this.$API.user.assignRoles(userId, roleIds)
      this.loading = false
      this.$message.success(result.message || '分配角色成功')
      this.resetRoleData()

      // console.log(this.$store.getters.name, this.user)
      if (this.$store.getters.name===this.user.username) {
        window.location.reload()
      }
    },

    /* 
    重置用户角色的数据
    */
    resetRoleData () {
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    },

    /* 
    自定义密码校验
    */
    validatePassword (rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
      }
    },
    /* 
    根据输入进行搜索
    */
    search () {
      this.searchObj = {...this.tempSearchObj}
      this.getUsers()
    },

    /* 
    重置输入后搜索
    */
    resetSearch () {
      this.searchObj = {
        username: ''
      }
      this.tempSearchObj = {
        username: ''
      }
      this.getUsers()
    },

    /* 
    显示添加用户的界面
    */
    showAddUser () {
      this.user = {}
      this.dialogUserVisible = true

      this.$nextTick(() => this.$refs.userForm.())
    },

    /* 
    删除所有选中的用户
    */
    revomveUsers () {
      this.$confirm('确定删除吗?').then(async () => {
        await this.$API.user.removeUsers(this.selectedIds)
        this.$message.success('删除成功')
        this.getUsers()
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    /* 
    列表选中状态发生改变的监听回调
    */
    handleSelectionChange (selection) {
      this.selectedIds = selection.map(item => item.id)
    },

    /* 
    显示更新用户的界面
    */
    showUpdateUser (user) {
      this.user = cloneDeep(user)
      this.dialogUserVisible = true
    },

    /* 
    删除某个用户
    */
    async removeUser (id) {
      await this.$API.user.removeById(id)
      this.$message.success('删除成功')
      this.getUsers(this.users.length===1 ? this.page-1 : this.page)
    },

    /* 
    获取分页列表
    */
    async getUsers (page=1) {
      this.page = page
      const {limit, searchObj} = this
      this.listLoading = true
      const result = await this.$API.user.getPageList(page, limit, searchObj)
      this.listLoading = false
      const {items, total} = result.data
      this.users = items.filter(item => item.username!=='admin')
      this.total = total-1
      this.selectedIds = []
    },

    /* 
    处理pageSize发生改变的监听回调
    */
    handleSizeChange (pageSize) {
      this.limit = pageSize
      this.getUsers()
    },

    /* 
    取消用户的保存或更新
    */
    cancel () {
      this.dialogUserVisible = false
      this.user = {}
    },

    /* 
    保存或者更新用户
    */
    addOrUpdate () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const {user} = this
          this.loading = true
          this.$API.user[user.id ? 'update' : 'add'](user).then((result) => {
            this.loading = false
            this.$message.success('保存成功!')
            this.getUsers(user.id ? this.page : 1)
            this.user = {}
            this.dialogUserVisible = false
          })
        }
      })
    }
  }
}
</script>


 </el-form-item>
       </el-form>
        <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfoT">
          <el-form-item label="商品大类">
            <el-input
              placeholder="请输入商品的大类"
              v-model="attrInfoT.name"
            ></el-input>
            
          </el-form-item>
        </el-form>
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfoT">
          <el-form-item label="商品分类">
            <el-input
              placeholder="请输入商品分类"
              v-model="attrInfoT.value"
            ></el-input>
            
          </el-form-item>
          

          export default {
  name: "Attr",
  data() {
    return {

      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的数据
      attrList: [],
      //这个属性控制table表格显示与隐藏的
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          // attrId : 0,
          // valuename :"string",
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
      attrInfoT : {
        formname: "", //属性名
        name: "",
        value: ""
      }
    };
  },
  methods: {
    ...mapActions({homeReqGet:'home/reqGet'}),
    //自定义事件的回调
    // open() {
    //     this.$prompt('请输入邮箱', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //     }).then(({ value }) => {
    //       this.$message({
    //         type: 'success',
    //         message: '你的邮箱是: ' + value
    //       });
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '取消输入'
    //       });       
    //     });
    //   },
    open(){
      this.isShowTable=false;
    },
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id= "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId;
        //发请求获取平台的属性数据
        this.reqGet();
      }
    },
    //获取平台属性的数据
    //当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
    async reqGet() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      //获取属性列表的数据
      let result = await this.homeReqGet(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值回调
    addAttrValue() { 
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      });
    },
    //添加属性按钮的回调
    
    async addAttr() {
      //切换table显示与隐藏
      this.isShowTable = false;
      var qs = require("querystring");
      //清除数据
      //收集三级分类的id
      // this.attrInfo = {
      //   attrName: "", //属性名
      //   attrValueList: [
      //     //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
      //   ],
      //   categoryId: this.category3Id, //三级分类的id
      //   categoryLevel: 3, //因为服务器也需要区分几级id
      // };
      this.attrInfoT = {
        formname: "child1", //属性名
        name: "test-分类",
        value: "test1,test2,test3"
      };
      try {
         //发请求
        await this.$API.attr.reqAddOrUpdateAttr(qs.stringify(this.attrInfoT));
        //展示平台属性的信号量进行切换
        this.isShowTable = true;
        //提示消失
        this.$message({type:'success',message:'保存成功'});
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        // this.$message('保存失败')
      }
    },
    //修改某一个属性
    updateAttr(row) {
      //isShowTable变为false
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    //失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
       if(row.valueName.trim()==''){
         this.$message('请你输入一个正常的属性值');
         return;
       }
       //新增的属性值不能与已有的属性值重复
      let isRepat  = this.attrInfo.attrValueList.some(item=>{
          //需要将row从数组里面判断的时候去除
          //row最新新增的属性值【数组的最后一项元素】
          //判断的时候，需要把已有的数组当中新增的这个属性值去除
          if(row!==item){
            return row.valueName==item.valueName;
          }
       });

       if(isRepat) return;
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框确定按钮的回调
    //最新版本的ElementUI----2.15.6，目前模板中的版本号2.13.x
    deleteAttrValue(index){
      //当前删除属性值的操作是不需要发请求的
       this.attrInfo.attrValueList.splice(index,1);
    },
    //保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttr(){
      var qs = require("querystring");
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
      try {
         //发请求
        await this.$API.attr.reqAddOrUpdateAttr(qs.stringify(this.attrInfoT));
        //展示平台属性的信号量进行切换
        this.isShowTable = true;
        //提示消失
        this.$message({type:'success',message:'保存成功'});
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        // this.$message('保存失败')
      }

    }
  },
};
</script>

<style scoped>
</style>

//滚轮函数
<el-form-item label="商品条目">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.tableName"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>





<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="open">添加属性</el-button>

        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="商品条目" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="商品大类" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="具体分类" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
       <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="商品条目">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.tableName"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
       </el-form>
        <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfoT">
          <el-form-item label="商品大类">
            <el-input
              placeholder="请输入商品的大类"
              v-model="attrInfoT.name"
            ></el-input>
            
          </el-form-item>
        </el-form>
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfoT">
          <el-form-item label="商品分类">
            <el-input
              placeholder="请输入商品分类"
              v-model="attrInfoT.value"
            ></el-input>
            
          </el-form-item>
          
        </el-form>
        <el-button type="primary" @click="addOrUpdateAttr" >保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
import {mapActions} from "vuex"
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  //组件挂载完毕：向服务器发请求，获取相应的一级分类的数据
  mounted() {
    //获取一级分类的数据的方法
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      //获取一级分类的请求：不需要携带参数
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      //解构出一级分类的id
      const { category1Id } = this.cForm;

      
      this.$emit("getCategoryId", {
         categoryId: category1Id, level: 1 });
      console.log(category1Id);
      //通过一级分类的id，获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的select事件回调（当二级分类的option发生变化的时候获取相应三级分类的数据）
    async handler2() {
      //清除数据
      this.list3 = [];
      this.cForm.category3Id = "";
      //结构出数据
      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List( this.cForm.category1Id,category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的事件回调
    handler3() {
      //获取三级分类的id
      const { category3Id } = this.cForm;
      
      // this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
      console.log(category3Id)
    },
  },
};
</script>

<style scoped>
</style>

