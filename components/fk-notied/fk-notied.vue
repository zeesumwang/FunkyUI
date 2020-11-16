<template>
	<fk-transition :elevation="10" :blurEffect="'dark'" :backgroundColor="backgroundColor" :opacity="opacity" :duration="200" :mode-class="['fade','slide-top']" :styles="transfromClass" :show="isNotied">
		<text>{{msg}}</text>
	</fk-transition>
</template>

<script>
	export default {
		props: {
			isNotied: {
				type: Boolean,
				default: false
			},
			msg: {
				type: String,
				default: ""
			},
			backgroundColor: {
				type: String,
				default: ""
			},
			opacity: {
				type: Number,
				default: 0.98
			}
		}
		data() {
			return {
				transfromClass: {}
			};
		}
	}
</script>

<style>

</style>
