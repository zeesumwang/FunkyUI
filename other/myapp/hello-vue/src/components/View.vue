<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script>
import loadStyle from '../mixins/loadStyle'

export default {
  name: "View",
  mixins: [loadStyle],
  props: {
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
