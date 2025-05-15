import {defineStore} from "pinia";
// import {ref} from "vue";

export const useUserStore = defineStore('user',{
    state: ()=>({
        userInfo: null as null|{
            id: number
            account: string
            name: string
            user_type: string
            age: number
            gender: string
            email: string
            phone: string
        }
    }),

    actions:{
        setUser(user:any){
            this.userInfo = user
        },
        clearUser(){
            this.userInfo = null
        }
    }

})