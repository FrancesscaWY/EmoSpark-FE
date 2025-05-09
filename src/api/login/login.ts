// from axios import "axios"
import axios from "axios"
const login = async (LoginData:{account: string, userType: string, password: string})=>{
    try{
        const response = await axios.post("http://localhost:5001/spark/api/login",{
            userAccount: LoginData.account,
            userType: LoginData.userType,
            password: LoginData.password
        })

        console.log('服务器返回：',response.data)

        if(response.data.success){
            console.log("登录成功:", response.data.message);
            return response.data.user
        }else{
            console.error("登录失败:", response.data.message);
            return false;
        }
    }catch(error:any){
        // 捕获请求错误
        // console.error("请求错误:", error);
        if(error.response){
            console.error("服务器返回的错误:", error.response.data);
            alert(error.response?.data?.message || "登录请求失败，请稍后重试！");
        }else{
            // 网络错误或其他未知错误
            alert("网络错误，请检查网络连接！");
        }
        return false;
    }
}

export {login}