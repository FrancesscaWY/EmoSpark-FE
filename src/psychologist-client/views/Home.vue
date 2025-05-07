<script setup lang="ts">
import {ref} from 'vue'
import { useMessage,NCard, NAvatar, NButton, NCollapse, NCollapseItem} from 'naive-ui';
const message = useMessage()
const user = ref({
  name: '张医生',
  account: 'qefdsads1234',
  age:25,
  gender:'男',
  email: 'zhangsan@example.com',
  phone: '1234567890',
  organization: '某某机构',
  childrenCount: 5,
  profile: '这是用户的简介',
  wechat: 'wechat_example',
});
const genderOptions = [
  {label:'男',value:'男'},
  {label:'女',value:'女'},
]
const isModalVisible = ref(false);
const profileText = ref(user.value.profile);

const editProfile = ()=>{
  isModalVisible.value = true;
  // 在这里可以弹出编辑简介的窗口，或跳转到编辑页面
}
const closeModal = ()=>{
  isModalVisible.value = false;
}
const saveProfile = ()=>{
  user.value.profile = profileText.value;
  closeModal();
}

const isEditing = ref(false)
const editableUser = ref<any>()
editableUser.value = user.value

const startEditing = ()=>{
  isEditing.value = true;
}
const cancelEditing = ()=>{
  editableUser.value = {...user.value};
  isEditing.value = false
}
const saveChanges = ()=>{
  user.value = {...editableUser.value};
  isEditing.value = false
}

const isChangePasswordModalVisible = ref(false);
const isAddAccountModalVisible = ref(false)
const isPhoneBindModalVisible = ref(false)
const isWechatBindModalVisible = ref(false)
const isDeviceManagementModalVisible = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const newAccount = ref('')
const newAccountPassword = ref('')

const phoneNumber = ref('')
const wechatNumber = ref('')
// 操作方法
const openChangePasswordModal = () => {
  isChangePasswordModalVisible.value = true;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalVisible.value = false;
};

const changePassword = ()=>{
  if(newPassword.value === confirmPassword.value){
    message.success('密码修改成功:', newPassword.value);
    closeChangePasswordModal();
  }else{
    console.log('两次密码输入不一致');
  }
}
const openAddAccountModal = () => {
  isAddAccountModalVisible.value = true;
};

const closeAddAccountModal = () => {
  isAddAccountModalVisible.value = false;
};

const addAccount = ()=>{
  message.success(`添加帐号：`,newAccount.value,'密码:',newAccountPassword.value)
  closeAddAccountModal();
}
const openPhoneBindModal = () => {
  isPhoneBindModalVisible.value = true;
};

const closePhoneBindModal = () => {
  isPhoneBindModalVisible.value = false;
};

const bindPhone = ()=>{
  message.success(`绑定手机号:`,phoneNumber.value);
  closePhoneBindModal()
}
const openWechatBindModal = () => {
  isWechatBindModalVisible.value = true;
};

const closeWechatBindModal = () => {
  isWechatBindModalVisible.value = false;
};

const bindWechat = () => {
  message.success('绑定微信号:', wechatNumber.value);
  closeWechatBindModal();
};
const openDeviceManagementModal = () => {
  isDeviceManagementModalVisible.value = true;
};

const closeDeviceManagementModal = () => {
  isDeviceManagementModalVisible.value = false;
};

const confirmDeviceManagement = () => {
  message.success('设备管理确认');
  closeDeviceManagementModal();
};
const removeDevice = () => {
  message.success('移除设备');
};

// 注销帐号
const logoutAccount = () => {
  message.success('注销帐号');
};

</script>

<template>
  <n-card>
    <div class="user-info">
      <div class="avatar">
        <n-avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=doctor" size="large"/>
      </div>
    <div class="info">
     <n-card>
       <n-card>
       <n-text strong style="font-size: 16px">{{user.name}}</n-text>
        <br/>
         <n-text style="font-size: 16px">帐号：{{user.account}}</n-text>
         <br/>
       <n-text style="font-size: 16px">年龄：{{user.age}} | 性别：{{user.gender}} | 工作机构：{{user.organization}}</n-text>
       </n-card>
       <n-card>
         <n-text>{{user.profile}}</n-text>
       </n-card>
     </n-card>
      <n-button size="small" type="tertiary" @click="editProfile">编辑简介</n-button>
    </div>
    </div>
    <template #footer>
      <n-collapse :default-expanded-keys="['personal']">
        <n-collapse-item name="personal" title="个人资料">
          <n-card>
            <div>
              <n-row>
              <n-col :span="8"><strong>用户名:</strong></n-col>
              <n-col :span="16">
                <span v-if="!isEditing">{{user.name}}</span>
                <n-input v-if="isEditing" v-model:value="editableUser.name" placeholder="请输入用户名" />
              </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>年龄：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing"> {{user.age}}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.age" placeholder="请输入年龄"/>
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>性别：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.gender }}</span>
                  <n-select
                      v-if="isEditing"
                      v-model:value="editableUser.gender"
                      :options="genderOptions"
                      placeholder="请选择性别"/>
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>帐号：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.account }}</span>
                  <n-input disabled v-if="isEditing" v-model:value="editableUser.account" placeholder="请输入负责儿童数量" />
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>邮箱：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.email }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.email" placeholder="请输入邮箱" />
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>手机号：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.phone }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.phone" placeholder="请输入手机号" />
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8"><strong>工作机构：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.organization }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.organization" placeholder="请输入工作机构" />
                </n-col>6
              </n-row>
              <n-row>
                <n-col :span="8"><strong>负责儿童数量：</strong></n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{ user.childrenCount }}</span>
                  <n-input disabled v-if="isEditing" v-model:value="editableUser.childrenCount" placeholder="请输入负责儿童数量" />
                </n-col>
              </n-row>
              <n-row>
                <n-col :span="8">
                  <strong>简介：</strong>
                </n-col>
                <n-col :span="16">
                  <span v-if="!isEditing">{{user.profile}}</span>
                  <n-input v-if="isEditing"  v-model:value="editableUser.profile" placeholder="请输入简介"></n-input>
                </n-col>
              </n-row>
            </div>
          </n-card>
          <div style="margin-top: 20px; display:flex;justify-content: space-around" >
            <n-button v-if="!isEditing" type="primary" @click="startEditing">编辑</n-button>
            <n-button v-if="isEditing" type="default" @click="cancelEditing">取消</n-button>
            <n-button v-if="isEditing" type="primary" @click="saveChanges">保存</n-button>
          </div>
        </n-collapse-item>
        <n-collapse-item name="security" title="帐号安全">
          <n-card title="帐号管理" style="margin-bottom: 20px;">
            <n-row>
              <n-col :span="12">
                <p><strong>当前登录帐号：</strong>{{ user.account }}</p>
              </n-col>
              <n-col :span="12">
                <n-button type="primary" @click="openAddAccountModal">切换其他帐号</n-button>
              </n-col>
            </n-row>
          </n-card>

          <n-card title="帐号关联" style="margin-bottom: 20px">
            <n-row>
              <n-col :span="12">
                <p><strong>手机号：</strong>{{ user.phone }}</p>
              </n-col>
              <n-col :span="12">
                <n-button type="primary" @click="openPhoneBindModal">绑定手机号</n-button>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <p><strong>微信号：</strong>{{ user.wechat }}</p>
              </n-col>
              <n-col :span="12">
                <n-button type="primary" @click="openWechatBindModal">绑定微信号</n-button>
              </n-col>
            </n-row>
          </n-card>

          <n-card title="安全管理">
            <n-row style="display: flex; justify-content: space-around">
              <n-col :span="8">
                <n-button type="primary" @click="openChangePasswordModal">修改密码</n-button>
              </n-col>
              <n-col :span="8">
                <n-button type="default" @click="openDeviceManagementModal">登录设备管理</n-button>
              </n-col>
              <n-col :span="8">
                <n-button type="error" @click="logoutAccount">注销帐号</n-button>
              </n-col>
            </n-row>
          </n-card>
        </n-collapse-item>
        <n-collapse-item name="about" title="关于EmoSpark">

        </n-collapse-item>
        <n-collapse-item name="help" title="帮助与反馈">

        </n-collapse-item>
      </n-collapse>
    </template>
  </n-card>

  <n-modal v-model:show="isModalVisible"
           title="编辑简介"
           preset="card"
           :mask-closable="false"
           style="width:400px"
  >
    <n-card>
    <n-input v-model:value="profileText" type="textarea" rows="4" placeholder="请输入新的简介"></n-input>
    </n-card>
    <div style="margin-top:10px; display: flex; justify-content: space-around; width: 100%;">
      <n-button @click="closeModal">取消</n-button>
      <n-button type="primary" @click="saveProfile">确认</n-button>
    </div>
  </n-modal>

  <n-modal v-model:show="isChangePasswordModalVisible" title="修改密码" @cancel="closeChangePasswordModal" @confirm="changePassword">
    <n-input v-model:value="oldPassword" type="password" placeholder="请输入旧密码" style="margin-bottom: 10px"/>
    <n-input v-model:value="newPassword" type="password" placeholder="请输入新密码" style="margin-bottom: 10px"/>
    <n-input v-model:value="confirmPassword" type="password" placeholder="确认新密码" />
  </n-modal>

  <!-- 添加帐号弹窗（假设用户可以输入新的帐号） -->
  <n-modal v-model:show="isAddAccountModalVisible" title="添加或注册帐号" @cancel="closeAddAccountModal" @confirm="addAccount">
    <n-card style="width: 400px" title="添加或注册帐号">
    <n-input v-model:value="newAccount" placeholder="请输入帐号" style="margin-bottom: 10px;" />
    <n-input v-model:value="newAccountPassword" type="password" placeholder="设置密码" />
      <a style="margin-top: 5px">注册新的帐号</a>
      <div style="display: flex; justify-content: space-around; margin-top: 10px">
        <n-button @click="closeAddAccountModal">取消</n-button>
        <n-button @click="addAccount">登录</n-button>
      </div>
    </n-card>
  </n-modal>


  <!-- 绑定手机号弹窗 -->
  <n-modal v-model:show="isPhoneBindModalVisible" title="绑定手机号" @cancel="closePhoneBindModal" @confirm="bindPhone">
    <n-input v-model:value="phoneNumber" placeholder="请输入手机号" />
  </n-modal>


  <!-- 绑定微信号弹窗 -->
  <n-modal v-model:show="isWechatBindModalVisible" title="绑定微信号" @cancel="closeWechatBindModal" @confirm="bindWechat">
    <n-input v-model:value="wechatNumber" placeholder="请输入微信号" />
  </n-modal>


  <!-- 设备管理弹窗（假设用户查看或删除登录设备） -->
  <n-modal v-model:show="isDeviceManagementModalVisible" title="登录设备管理" @cancel="closeDeviceManagementModal" @confirm="confirmDeviceManagement">
    <p>这里展示用户的登录设备信息，您可以管理已登录的设备。</p>
    <n-button @click="removeDevice" type="error">移除设备</n-button>
  </n-modal>

</template>

<style scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.avatar {
  flex: 0 0 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.info p {
  margin: 5px 0;
  font-size: 14px;
  color: #888;
}
</style>