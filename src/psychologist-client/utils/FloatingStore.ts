// stores/floatingStore.ts
import { defineStore } from 'pinia'

export const useFloatingStore = defineStore('floating', {
    state: () => ({
        isFloating: false,  // 浮窗是否显示
        name: '',           // 当前治疗儿童的名字
        avatar: '',         // 当前治疗儿童的头像
        age: 0,             // 当前治疗儿童的年龄
        gender: '',         // 当前治疗儿童的性别
        phone: '',          // 当前治疗儿童的联系电话
        type: '',           // 治疗类型（面对面/远程）
    }),

    actions: {
        // 设置浮窗显示状态
        setFloating(value: boolean) {
            this.isFloating = value
        },

        // 设置当前儿童的基本信息（名字和头像）
        setChildInfo(name: string, avatar: string) {
            this.name = name
            this.avatar = avatar
        },

        // 设置当前儿童的年龄
        setAge(age: number) {
            this.age = age
        },

        // 设置当前儿童的性别
        setGender(gender: string) {
            this.gender = gender
        },

        // 设置当前儿童的联系电话
        setPhone(phone: string) {
            this.phone = phone
        },

        // 设置治疗类型
        setType(type: string) {
            this.type = type
        },

        // 返回当前浮窗的状态和儿童的基本信息
        getCurrentFloatingState() {
            return {
                isFloating: this.isFloating,
                name: this.name,
                avatar: this.avatar,
                age: this.age,
                gender: this.gender,
                phone: this.phone,
                type: this.type,
            }
        },

        // 更新浮窗状态和所有儿童信息
        updateFloatingStore(
            name: string,
            avatar: string,
            age: number,
            gender: string,
            phone: string,
            type: string,
            isFloating: boolean
        ) {
            this.setChildInfo(name, avatar)
            this.setAge(age)
            this.setGender(gender)
            this.setPhone(phone)
            this.setType(type)
            this.setFloating(isFloating)
        }
    }
})
