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
		/* #endif */
		position: sticky;
		top: var(--window-top);
		z-index: 99;
		margin: 0px;
	}
</style>
