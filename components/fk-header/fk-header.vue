<template>
	<!-- #ifndef APP-NVUE -->
	<view class="sticky-header">
	<!-- #endif -->
	
	<!-- #ifdef APP-NVUE -->
	<header>
	<!-- #endif -->
	
		<slot></slot>
		
	<!-- #ifdef APP-NVUE -->
	</header>
	<!-- #endif -->
		
	<!-- #ifndef APP-NVUE -->
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		name: 'fkHeader',
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.sticky-header {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: -webkit-sticky;
		top: 0px;
		/* #endif */
		position: sticky;
		/* #ifndef APP-NVUE */
		top: 0px;
		/* #endif */
		z-index: 99;
	}
</style>
