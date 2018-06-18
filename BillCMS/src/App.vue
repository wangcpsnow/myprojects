<template>
    <el-container id='app'>
        <el-aside width="200px" v-show='showSide'>
            <el-menu :default-active='active' @select='menuSelect'
                background-color='#545c64' text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index='1'>
                    <i class="el-icon-menu"></i>
                    <span slot="title">发票查询统计</span>
                </el-menu-item>
                <el-menu-item index='2'>
                    <i class="el-icon-document"></i>
                    <span slot="title">发票抽奖</span>
                </el-menu-item>
                <el-menu-item index='3'>
                    <i class="el-icon-setting"></i>
                    <span slot="title">广告管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>发票星摇奖系统</el-header>
            <el-main>
                <router-view class='wrap'/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            showSide: false,
            active: '1'
        }
    },
    beforeCreate() {
        this.$http.get('/ild/admin/manage/islogin')
            .then(res => {
                var data = res.data;
                if (!data.ret || !data.data) {
                    this.$router.push('/login');
                }
            });
    },
    created() {
        if (location.hash.indexOf('#/login') < 0) {
            this.showSide = true;
        }
        switch(location.hash) {
            case '#/draw':
                this.active = '2';
                break;
            case '#/ads':
                this.active = '3';
                break;
            default:
                this.active = '1';
        }
    },
    watch: {
        '$route' (to, from) {
            if (to.name !== 'Login') {
                this.showSide = true;
            }
            else {
                this.showSide = false;
            }
        }
    },
    methods: {
        menuSelect(index) {
            this.active = index;
            switch(index) {
                case '1':
                    this.$router.push('/');
                    break;
                case '2':
                    this.$router.push('/draw');
                    break;
                case '3':
                    this.$router.push('/ads');
                    break;
            }
        }
    }
}
</script>

<style lang='stylus'>
html, body {
    height: 100%;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.el-container {
    min-height: 100%;
    .el-header {
        background-color: #B3C0D1;
        line-height: 60px;
    }
    .el-main {
        background-color: #f5f5f5;
        > .wrap {
            background-color: #FFF;
            padding: 20px 0px;
            flex: 1;
        }
    }
    .el-aside {
        background-color: #545c64;
        .el-menu {
            border-right: none;
        }
    }
}
</style>
