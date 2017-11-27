<template>
    <div id="app">
    	<div class="nav">
			nav
		</div>
		<div class="wrap">
			<sidebar></sidebar>
			<div class="main">
				<router-view/>
			</div>
		</div>
    </div>
</template>

<script>
import sidebar from './components/sidebar'

export default {
	name: 'app',
	components: {
		sidebar
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.nav {
	height: 110px;
	background-color: #0b0b0b;
}
.wrap {
	overflow: hidden;
	zoom: 1;
}
.sidebar, .main {
	margin-bottom: -999px;
	padding-bottom: 999px;
}
.sidebar{
	float: left;
	width: 220px;
}
.main {
	margin-left: 220px;
}
</style>
