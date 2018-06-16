<template>
    <div class="login" style="padding: 20px;">
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
                var self = this;
                var params = Object.assign({}, this.loginForm);
                this.$http.get('/ild/admin/manage/login', {
                        params: params
                    })
                    .then(res => {
                        var data = res.data;
                        if (data.data && data.ret) {
                            self.$toast('登录成功');
                            self.$router.push('/');
                        }
                        else {
                            self.$toast('用户名或密码错误,请重新登录', '', 'warning');
                        }
                    });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .login {
        width: 400px;
        margin: auto;
        // margin-top: 100px;
        // top: 50%;
        .tips {
            margin-top: 100px;
        }
    }
</style>