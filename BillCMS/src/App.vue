<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App',
    beforeCreate() {
        this.$http.get('/ild/admin/manage/islogin')
            .then(res => {
                var data = res.data;
                if (!data.ret || !data.data) {
                    this.$router.push('/login');
                }
            });
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
