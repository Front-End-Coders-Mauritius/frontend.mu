<script>
import VanillaTilt from 'vanilla-tilt'

export default {
  name: 'Tilt',
  props: {
    options: Object,
    parallax: Boolean,
  },
  data() {
    return {}
  },
  mounted() {
    VanillaTilt.init(this.$refs.tiltRef, this.options)
  },
}
</script>

<template>
  <div id="tiltMe" ref="tiltRef" :class="parallax ? 'preserve' : ''">
    <slot />
  </div>
</template>

<style>
.preserve {
  transform-style: preserve-3d;
}
</style>
