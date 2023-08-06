<template>
    <div :class="parallax ? 'preserve':''" id="tiltMe" ref="tiltRef">
        <slot></slot>
    </div>
</template>

<script>
import VanillaTilt from 'vanilla-tilt';

export default {
    name: 'Tilt',
    data: function(){
        return {
        }
    },
    mounted(){
        VanillaTilt.init(this.$refs.tiltRef,this.options)
    },
    props: {
        options: Object,
        parallax: Boolean
    }
}
</script>

<style>
.preserve{
    transform-style: preserve-3d;
}
</style>