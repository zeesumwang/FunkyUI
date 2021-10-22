<template>
  <div
    :ref="name"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @click="click"
    :style="[{
      left: x + 'px',
      top: y + 'px',
      width: width ? width + 'px' : null,
      height: height ? height + 'px' :null,
      transitionPropery: transitionPropery,
      transitionDuration: transitionDuration,
      transitionDelay: transitionDelay,
      transitionTimingFunction: transitionTimingFunction,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },styles]"
  >
    <span v-if="value !== '' && type === 'text'">{{ value }}</span>
    <img v-else-if="value !== '' && type ==='img'" :src="value">
    <float-view v-for="(item, index) in children" :key="index" v-bind="item"></float-view>
  </div>
</template>

<script>

export default {
  name: "FloatView",
  props: {
    name: {
      default: 'Floatview'
    },
    moveable: {
      default: false
    },
    type: {
      default: '',
    },
    width: {
      default: 0,
    },
    height: {
      default: 0,
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
      default: 500,
    },
    styles: {
      default: {}
    },
    action: {
      type: Object,
      default() {
        return {
          moveAction: "",
          clickAction: "",
        }
      },
    },
    children: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      default: '',
    },
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
    this.transitionDuration = this.actionDuration + 'ms';
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
      const fn = new Function("e", this.action.moveAction);
      const e = this;
      fn(e);
    },
    click() {
      const fn = new Function("e", this.action.clickAction);
      const e = this;
      fn(e);
    }
  }
};
</script>
