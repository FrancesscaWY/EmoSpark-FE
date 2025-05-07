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
const isEditingNumber = ref(false)
const isPhoneBindModalVisible = ref(false)
const isWechatBindModalVisible = ref(false)
const isDeviceManagementModalVisible = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const newAccount = ref('')
const newAccountPassword = ref('')

const phoneNumber = ref(user.value.phone)
const wechatNumber = ref(user.value.wechat)

// 操作方法
const openChangePasswordModal = () => {
  isChangePasswordModalVisible.value = true;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalVisible.value = false;
};

const changePassword = ()=>{
  if(newPassword.value === confirmPassword.value){
    message.success(`密码修改成功:${newPassword.value}` );
    closeChangePasswordModal();
  }else{
    message.error('两次密码输入不一致,请重新输入');
  }
}
const openAddAccountModal = () => {
  isAddAccountModalVisible.value = true;
};

const closeAddAccountModal = () => {
  isAddAccountModalVisible.value = false;
};

const addAccount = ()=>{
  message.success(`添加帐号：${newAccount.value}, 密码：${newAccountPassword.value}`)
  closeAddAccountModal();
}
// const openPhoneBindModal = () => {
//   isPhoneBindModalVisible.value = true;
// };

const closePhoneBindModal = () => {
  isPhoneBindModalVisible.value = false;
};
//
// const bindPhone = ()=>{
//   message.success(`绑定手机号:${phoneNumber.value}`);
//   closePhoneBindModal()
// }
// const openWechatBindModal = () => {
//   isWechatBindModalVisible.value = true;
// };

const closeWechatBindModal = () => {
  isWechatBindModalVisible.value = false;
};

// const bindWechat = () => {
//   message.success(`绑定微信号:${wechatNumber.value}`);
//   closeWechatBindModal();
// };
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

const editNumber = ()=>{
  isEditingNumber.value = true
  phoneNumber.value = user.value.phone
  wechatNumber.value = user.value.wechat
}
const cancelNumber = ()=>{
  isEditingNumber.value = false
  phoneNumber.value = user.value.phone
  wechatNumber.value = user.value.wechat
}
const saveNumber = ()=>{
  user.value.phone = phoneNumber.value
  user.value.wechat = wechatNumber.value
  isEditingNumber.value = false
}

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
            <n-card>
              <n-row>
              <n-col :span="6">用户名:</n-col>
              <n-col :span="18">
                <span v-if="!isEditing">{{user.name}}</span>
                <n-input v-if="isEditing" v-model:value="editableUser.name" placeholder="请输入用户名" />
              </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">年龄：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing"> {{user.age}}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.age" placeholder="请输入年龄"/>
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">性别：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.gender }}</span>
                  <n-select
                      v-if="isEditing"
                      v-model:value="editableUser.gender"
                      :options="genderOptions"
                      placeholder="请选择性别"/>
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">帐号：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.account }}</span>
                  <n-input disabled v-if="isEditing" v-model:value="editableUser.account" placeholder="请输入负责儿童数量" />
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">邮箱：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.email }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.email" placeholder="请输入邮箱" />
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">手机号：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.phone }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.phone" placeholder="请输入手机号" />
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">工作机构：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.organization }}</span>
                  <n-input v-if="isEditing" v-model:value="editableUser.organization" placeholder="请输入工作机构" />
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">负责儿童数量：</n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{ user.childrenCount }}</span>
                  <n-input disabled v-if="isEditing" v-model:value="editableUser.childrenCount" placeholder="请输入负责儿童数量" />
                </n-col>
              </n-row>
              <n-divider />
              <n-row>
                <n-col :span="6">
                  简介：
                </n-col>
                <n-col :span="18">
                  <span v-if="!isEditing">{{user.profile}}</span>
                  <n-input v-if="isEditing"  v-model:value="editableUser.profile" placeholder="请输入简介"></n-input>
                </n-col>
              </n-row>
            </n-card>
            <n-card>
              <n-button v-if="!isEditing" type="primary" @click="startEditing" style="margin-right: 20px;margin-top: 10px">编辑</n-button>
              <div style="margin-top: 20px; display:flex;justify-content: space-around" >
                <n-button v-if="isEditing" type="default" @click="cancelEditing">取消</n-button>
                <n-button v-if="isEditing" type="primary" @click="saveChanges">保存</n-button>
              </div>
            </n-card>
          </n-card>
        </n-collapse-item>
        <n-collapse-item name="security" title="帐号安全">
          <n-card title="帐号管理" style="margin-bottom: 20px;">
            <n-row>
              <n-col :span="12">
                <p><strong>当前登录帐号：</strong>{{ user.account }}</p>
              </n-col>
              <n-col :span="12">
                <n-button type="primary" size="small" @click="openAddAccountModal">切换其他帐号</n-button>
              </n-col>
            </n-row>
          </n-card>

          <n-card title="帐号关联" style="margin-bottom: 20px">
            <n-row>
              <n-col :span="8">
                <p><strong>手机号：</strong></p>
              </n-col>
              <n-col :span="16">
                <span v-if="!isEditingNumber">{{user.phone}}</span>
                <n-input  v-if="isEditingNumber" v-model:value="phoneNumber" placeholder="请输入关联手机号"></n-input>
              </n-col>
            </n-row>
            <n-row>
            <n-col :span="8">
              <p><strong>微信号：</strong></p>
            </n-col>
            <n-col :span="16">
              <span v-if="!isEditingNumber">{{user.wechat}}</span>
              <n-input  v-if="isEditingNumber" v-model:value="wechatNumber" placeholder="请输入关联手机号"></n-input>
            </n-col>
            </n-row>
<!--            <n-row>-->
<!--              <n-col :span="8">-->
<!--                <p><strong>手机号：</strong></p>-->
<!--              </n-col>-->
<!--              <n-col :span="16">-->
<!--                <span v-if="!isEditing">{{user.phone}}</span>-->
<!--                <n-input  v-if="isEditing" v-model:value="phoneNumber" placeholder="请输入关联手机号"></n-input>-->
<!--              </n-col>an="12">-->
<!--                <p><strong>微信号：</strong>{{ user.wechat }}</p>-->
<!--              </n-col>-->
<!--              <n-col :span="12">-->
<!--                <n-button type="primary" @click="openWechatBindModal">绑定微信号</n-button>-->
<!--              </n-col>-->
<!--            </n-row>-->
            <n-row>
              <n-col :span="24" class="action-col">
                <n-button
                    v-if="!isEditingNumber"
                    style="cursor: pointer; margin-right: 10px;"
                    type="primary"
                    @click="editNumber"
                    size="small"
                >编辑</n-button>
                <n-button
                    v-if="isEditingNumber"
                    type="default"
                    style="cursor: pointer; margin-right: 10px;"
                    @click="saveNumber"
                    size="small"
                >保存</n-button>
                <n-button
                    v-if="isEditingNumber"
                    type="warning"
                    style="cursor: pointer; margin-right: 10px;"
                    @click="cancelNumber"
                    size="small"
                >取消</n-button>
              </n-col>
            </n-row>
          </n-card>

          <n-card title="安全管理">
            <n-row style="display: flex; justify-content: space-around">
              <n-col :span="8">
                <n-button type="primary" @click="openChangePasswordModal"
                          size="small" >修改密码</n-button>
              </n-col>
              <n-col :span="8">
                <n-button type="default" @click="openDeviceManagementModal"
                          size="small">登录设备管理</n-button>
              </n-col>
              <n-col :span="8">
                <n-button type="error" @click="logoutAccount"
                          size="small">注销帐号</n-button>
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
    <n-card title="修改密码" style="width: 500px">
      <n-form>
        <n-form-item label="用户">
          <n-input disabled :value="user.name"/>
        </n-form-item>
        <n-form-item required label="旧密码">
          <n-input v-model:value="oldPassword" type="password" placeholder="请输入旧密码" style="margin-bottom: 10px"/>
        </n-form-item>
        <n-form-item required label="新密码">
          <n-input v-model:value="newPassword" type="password" placeholder="请输入新密码" style="margin-bottom: 10px"/>
        </n-form-item>
        <n-form-item required label="确认新密码">
          <n-input v-model:value="confirmPassword" type="password" placeholder="确认新密码" />
        </n-form-item>
      </n-form>
      <div style="display: flex; justify-content: space-around">
        <n-button @click="isChangePasswordModalVisible = false">取消</n-button>
        <n-button @click="changePassword">确认</n-button>
      </div>
    </n-card>
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
<!--  <n-modal v-model:show="isPhoneBindModalVisible" title="绑定手机号" @cancel="closePhoneBindModal" @confirm="bindPhone">-->
<!--    <n-input v-model:value="phoneNumber" placeholder="请输入手机号" />-->
<!--  </n-modal>-->


<!--  &lt;!&ndash; 绑定微信号弹窗 &ndash;&gt;-->
<!--  <n-modal v-model:show="isWechatBindModalVisible" title="绑定微信号" @cancel="closeWechatBindModal" @confirm="bindWechat">-->
<!--    <n-input v-model:value="wechatNumber" placeholder="请输入微信号" />-->
<!--  </n-modal>-->


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