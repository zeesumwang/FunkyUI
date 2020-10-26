<template>
	<view>
		<!-- #ifndef APP-NVUE -->
		<scroll-view scroll-y="true" :style="{'height': height + 'px','width': width + 'px'}">
			<slot></slot>
		</scroll-view>
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<list :style="{'height': height + 'px','width': width + 'px'}">
			<slot></slot>
		</list>
		<!-- #endif -->
	</view>
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

</style>
