<template>
    <div id="app">
        <Enter></Enter>
        <Query></Query>
    </div>
</template>

<script>
import Enter from './components/Enter.vue'
import Query from './components/Query.vue'

export default {
    name: 'App',
    components: {
        Enter,
        Query
    }
}
</script>

<style>
    html, body {
        margin: 0;padding: 0;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
