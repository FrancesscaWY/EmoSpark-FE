// src/api/parents/addChild.ts
import axios from 'axios'

export interface AddChildPayload {
    parent_id: number
    name: string
    nickname: string
    gender: number
    birthday: number | null
    account: string
    password: string
    note?: string
    relation?: string
}

export interface AddChildResponse {
    success: boolean
    message: string
    child_id?: number
    guardian_id?: number
    relation?:string
}

export const addChild = async (
    payload: AddChildPayload
): Promise<AddChildResponse> => {
    try {
        const res = await axios.post<AddChildResponse>(
            'http://localhost:5001/spark/api/parents/add_child',
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        console.log(res.data)
        return res.data
    } catch (err: any) {
        console.error('添加儿童请求失败（addChild.ts）原始错误:', err)
        // 提取 detail 或 message
        const detail =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            '添加儿童失败'
        throw new Error(Array.isArray(detail) ? detail.join('；') : detail)
    }
}
