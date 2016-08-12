<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<style>
html,body{
	height: 100%;
	background-color: #f5f5f5;
	font-family: "Helvetica Neue",Helvetica,STHeiTi,Arial,sans-serif;
	font-size:100px; 
}
*{margin:0;padding:0;}
ul,li{
	list-style:none;
}
h1,h2,h3,h4,h5{
	font-weight:normal;
}
.fleft{
	float:left;
}
.fright{
	float:right;
}
.clearfix{
	overflow:hidden;zoom:1;
}
</style>

<script>
import store from 'store';

export default {
	name: 'App',
	store: store
};
</script>
