import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '游客',
        token: '' as string | null,
        isLogin: false,
        permissions: [] as string[]
    }),
    getters: {
        welcomeMessage: (state) => {
            return state.isLogin ? `欢迎，${state.username}` : '请先登录'
        },
        hasPermission():boolean{
            return this.permissions.includes('admin')
        }
    }   
})