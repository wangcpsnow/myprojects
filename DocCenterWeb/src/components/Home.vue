<template>
	<div class="home">
		<div class="bg"></div>
		<div class="content">
			<h4 class="alltitle">
				重要通知 <img src="../assets/imgs/laba.png" alt="laba"/>
			</h4>
			<ul>
				<li>
					<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
					<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
					<span class="time">2017.10.31 12:20</span>	
				</li>
				<li>
					<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
					<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
					<span class="time">2017.10.31 12:20</span>	
				</li>
				<li>
					<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
					<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
					<span class="time">2017.10.31 12:20</span>	
				</li>
			</ul>
			<h4 class="alltitle">
				热点文档 <img src="../assets/imgs/redian.png" alt="redian"/>
			</h4>
			<ul class="hot">
				<li>
					<div>
						<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
						<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
						<span class="time">2017.10.31 12:20</span>
					</div>
				</li>
				<li>
					<div>
						<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
						<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
						<span class="time">2017.10.31 12:20</span>
					</div>
				</li>
				<li>
					<div>
						<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
						<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
						<span class="time">2017.10.31 12:20</span>
					</div>
				</li>
				<li>
					<div>
						<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
						<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
						<span class="time">2017.10.31 12:20</span>
					</div>
				</li>
				<li>
					<div>
						<h4 class="title">This is title <img src="../assets/imgs/link.png" alt="link"></h4>
						<p class="txt">可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目</p>
						<span class="time">2017.10.31 12:20</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {

		}
	}
}
</script>

<style lang="stylus">
	.home {
		margin: 25px 30px;
		position: relative;
		.bg {
			position: absolute;top: 0;bottom: 0;left: 0;right: 0;
			background-color: #FFF;opacity: 0.7;
			z-index: 1;
			border-radius: 15px;
		}
		.content {
			position: relative;z-index: 2;
			overflow: hidden;
			.alltitle {
				background-color: #00adef;color: #FFF;
				display: inline-block;
				line-height: 50px;
				margin: 20px 0;padding: 0 15px;
				border-top-right-radius: 30px;border-bottom-right-radius: 30px;
				// font-weight: bold;
				img {
					margin-top: -5px;
					margin-left: 15px;
					vertical-align: middle;
				}
			}
			ul {
				overflow: hidden;
			}
			li {
				background-color: #FFF;
				margin: 0 35px 24px;
				border-radius: 15px;
				padding: 15px 30px;
				.title {
					color: #000;
					font-size: 16px;font-weight: bold;
					line-height: 30px;
					img {
						float: right;
					}
				}
				.txt {
					color: #676767;
					line-height: 20px;
					font-size: 14px;
				}
				.time {
					font-size: 12px;color: #c7c7c7;
				}
			}
			ul.hot {
				margin: 0 30px 30px;
				li {
					float: left;width: 20%;
					margin: 0;padding: 0;
					background-color: transparent;
					div {
						background-color: #FFF;
						padding: 15px;
						margin: 10px;
						border-radius: 20px;
						.title {
							line-height: 50px;
							img {
								margin-top: 11px;
							}
						}
						.txt {
							margin-bottom: 30px;
						}
					}
				}
			}	
		}
	}
</style>