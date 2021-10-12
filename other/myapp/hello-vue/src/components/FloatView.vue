<template>
  <div
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    :style="{
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: height + 'px',
      transitionPropery: transitionPropery,
      transitionDuration: transitionDuration,
      transitionDelay: transitionDelay,
      transitionTimingFunction: transitionTimingFunction,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }"
  >
    <div :style="styles">
      <span>{{ text }}</span>
      <slot></slot>
      <float-view v-for="(item, index) in children" :key="index" v-bind="item"></float-view>
    </div>
  </div>
</template>

<script>
// import FloatView from "./FloatView.vue";

export default {
  name: "FloatView",
  components: {
    // FloatView
  },
  props: {
    moveable: {
      default: true
    },
    width: {
      default: 40,
    },
    height: {
      default: 40,
    },
    initPosition: {
      default: {
        x: 0,
        y: 0,
      },
    },
    transitionPropery: {
      default: 'left'
    },
    transitionTimingFunction: {
      default: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    actionDuration: {
      default: 250,
    },
    moveAction: {
      // type: Function,
      type: String,
      default: '',
    },
    children: {
      type: Array,
      default() {
        return [];
      }
    },
    styles: {
      default() {
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
    },
    text: {
      default: '',
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      biasX: 0,
      biasY: 0,
      transitionDuration: null,
      transitionDelay: '0ms',
      isDrag: false,
    };
  },
  created() {
    this.x = this.initPosition.x;
    this.y = this.initPosition.y;
  },
  methods: {
    touchstart(e) {
      if (!this.moveable) {
        return
      }
      this.isDrag = true;
      this.transitionDuration = '0ms';
      this.biasX = e.touches[0].clientX - this.x;
      this.biasY = e.touches[0].clientY - this.y;
    },
    touchmove(e) {
      if (!this.moveable) {
        return
      }
      if (!this.isDrag) {
        return
      }
      this.x = e.touches[0].clientX - this.biasX;
      this.y = e.touches[0].clientY - this.biasY;
    },
    touchend() {
      if (!this.moveable) {
        return
      }
      this.isDrag = false;
      this.transitionDuration = this.actionDuration + 'ms';
      // this.moveAction(this);
      console.log(this.moveAction);
      let action = new Function("e", this.moveAction);
      let e = this;
      action(e);
    },
  }
};
</script>
