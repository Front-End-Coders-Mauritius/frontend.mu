<template>
  <div id="tiltMe" ref="tiltRef" :class="parallax ? 'preserve' : ''">
    <slot/>
  </div>
</template>

<script>
import VanillaTilt from "vanilla-tilt";

export default {
  name: "Tilt",
  props: {
    options: Object,
    parallax: Boolean,
  },
  data: function () {
    return {};
  },
  mounted() {
    VanillaTilt.init(this.$refs.tiltRef, this.options);
  },
};
</script>

<style>
.preserve {
  transform-style: preserve-3d;
}
</style>
