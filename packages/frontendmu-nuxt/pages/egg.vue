<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="egg-basket">
    <div class="egg">
      <div class="white">
        <div class="yolk" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .egg-basket {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .egg, .white, .yolk {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .egg {
    background: #FFFFFF;
    border: 2px solid black;
    width: 11rem;
    height: 15rem;
    border-radius: 50% / 60% 60% 40% 40%;
    animation: self-rotate 2s infinite;
  }

  @keyframes self-rotate {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(360deg)
    }
  }

  .yolk {
    background: #ffcc00;
    width: 6.5rem;
    height: 7rem;
    border-radius: 55% / 60%;
    border: 2px solid black;
  }
</style>
