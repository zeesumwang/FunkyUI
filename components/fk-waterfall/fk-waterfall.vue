<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		name: "fkWaterfall",
		props: {
			'columnCount': {
				type: Number,
				default: 2
			}
		},
		data() {
			return {
				lastHeightInfo: [],
			};
		}
	}
</script>

<style>

</style>
