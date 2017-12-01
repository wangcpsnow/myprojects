<template>
    <div id="app">
    	<div class="nav">
			<img src="./assets/imgs/logo.png" alt="logo">
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

<style lang="stylus">
#app {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
	/*-webkit-font-smoothing: antialiased;*/
	/*-moz-osx-font-smoothing: grayscale;*/
}
.nav {
	height: 110px;
	background-color: #0b0b0b;
	img {
		margin: 23px;
		width: 226px;
	}
}
.wrap {
	overflow: hidden;
	zoom: 1;
	background: transparent url('./assets/imgs/main-bg.jpg') no-repeat top left;
	background-size: cover;
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
	margin-left: 250px;
}
</style>
