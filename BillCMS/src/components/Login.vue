<template>
    <div class="login">
        <h3 class="center title">发票星后台摇奖登录系统</h3>
        <el-form ref="form" :model="loginForm" label-width="80px">
            <el-form-item label="账号">
                <el-input v-model="loginForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="loginForm.pwd" type='password'></el-input>
            </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="click_login">登录</el-button>
            </el-form-item>
            <p class="center tips">联系我们：15210831061</p>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    userName: '',
                    pwd: ''
                }
            }
        },
        created() {

        },
        methods: {
            click_login() {
                if (!this.loginForm.userName || !this.loginForm.pwd) {
                    this.$toast('请输入账号密码');
                    return;
                }
                this.$http.post('/ild/admin/manage/login', this.loginForm)
                    .then(res => {

                    });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .login {
        width: 400px;
        margin: auto;
        margin-top: 100px;
        top: 50%
        .title {
            margin-bottom: 30px;
        }
        .tips {
            margin-top: 100px;
        }
    }
</style>