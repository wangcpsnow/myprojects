<template>
	<div class="hello">
		<h1>Hello World</h1>
	</div>
</template>
<style scoped>

.hello {
	color: #2c3e50;
	max-width: 600px;
	font-family: Source Sans Pro, Helvetica, sans-serif;
	text-align: center;
}

.hello a {
	color: #42b983;
	text-decoration: none;
}

.logo {
	width: 100px;
	height: 100px
}
</style>
<script>
export default {
	name: 'Hello',
	methods: {
		click_btn() {
			alert("click");
		}
	}
};
</script>
