<template>
    <div id="app">
        <!-- <div class="space"></div> -->
        <Enter></Enter>
    </div>
</template>

<script>
import Enter from '@/components/Enter.vue'

export default {
    name: 'App',
    components: {
        Enter
    }
}
</script>

<style lang="stylus">
    html, body {
        margin: 0;padding: 0;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    .space {
        background-color: #ebeeef;
        height: 7px;
    }
    .navtitle {
        border-bottom: 1px solid silver;
        padding: 8px 0;
        padding-left: 15px;
        h3 {
            line-height: 24px;
            font-weight: bold;
            font-size: 18px;
        }
        s {
            border-left: 2px solid red;
            margin: auto;
            margin-right: 10px;
            font-size: 14px;
            position: relative;
            top: -2px;
        }
    }
</style>
