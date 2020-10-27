<template>
	
		<!-- #ifndef APP-NVUE -->
		<view class="fk-list" :style="{'height': height + 'px','width': width + 'px'}">
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<list :style="{'height': height + 'px','width': width + 'px'}">
		<!-- #endif -->
		
			<slot></slot>
			
		<!-- #ifdef APP-NVUE -->
		</list>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		</view>
		<!-- #endif -->
	
</template>

<script>
	export default {
		name: "fkList",
		props: {
			height: {
				type: Number,
				default() {
					return 350
				},
			},
			width: {
				type: Number,
				default() {
					return 350
				},
			}
		},
		data() {
			return {
				
			};
		},
		created() {
		}
	}
</script>

<style>
.fk-list {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	position: relative;
	flex-direction: column;
}
</style>
