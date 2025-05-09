import axios from "axios"
import {useMessage} from "naive-ui";
const message = useMessage()

const generateRandomAccount = ()=>{
    const chars =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let account = '';
    for (let i=0; i<12; i++){
        const randomIndex = Math.floor(Math.random()*chars.length);
        account += chars[randomIndex];
    }
    return account;
}

const checkAccountExists  = async(account: string) =>{
    try{
        const response = await axios.get(`http://localhost:5001/spark/api/check_account`,{
            params:{account: account}
        });
        return response.data.exists;
    }catch (error){
        console.error('检查帐号存在性失败:', error);
        return false;
    }
}

const register = async (
    registerForm: { name: string, age: number, gender: string, userType: string, phone: string, email: string, account: string, password: string, work_unit: string }
) => {
    console.log('用户名称：',registerForm.name)
    try {
        const response = await axios.post('http://localhost:5001/spark/api/register', {
            username: registerForm.name,
            account: registerForm.account,
            email: registerForm.email,
            phone: registerForm.phone,
            password: registerForm.password,
            gender: registerForm.gender,
            age: registerForm.age,
            userType: registerForm.userType,
            work_unit: registerForm.userType === 'doctor' ? registerForm.work_unit : null
        });

        // 打印服务器返回的数据，确认结构
        console.log("服务器返回:", response.data);

        // 确保后端返回的数据是结构化的，包含 success 字段
        if (response.data && response.data.success !== undefined) {
            if (response.data.success) {
                // 注册成功
                console.log(`用户注册成功: ${response.data.message}`);
                return true;
            } else {
                // 注册失败
                console.log(`注册失败: ${response.data.message}`);
                return false;
            }
        } else {
            // 如果返回数据没有 success 字段，则返回默认错误
            console.log(`注册请求失败，服务器返回无效响应！`);
            return false;
        }

    } catch (error: any) {
        // 错误处理
        // console.error("请求错误:", error);

        // 如果 error.response 存在，尝试读取错误信息
        if (error.response) {
            console.error("服务器返回的错误:", error.response.data);
            message.error(error.response?.data?.message || "注册请求失败，请检查网络连接或稍后重试！");
        } else {
            // 处理网络错误或其他未知错误
            message.error("注册请求失败，请检查网络连接或稍后重试！");
        }
        return false;
    }
}

export {register,generateRandomAccount,checkAccountExists}