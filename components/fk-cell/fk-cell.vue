<template>
	<!-- #ifdef APP-NVUE -->
	<cell>
	<!-- #endif -->
	
		<!-- #ifndef APP-NVUE -->
		<view>
		<!-- #endif -->
		
			<slot></slot>
			
		<!-- #ifndef APP-NVUE -->
		</view>
		<!-- #endif -->
		
	<!-- #ifdef APP-NVUE -->
	</cell>
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
