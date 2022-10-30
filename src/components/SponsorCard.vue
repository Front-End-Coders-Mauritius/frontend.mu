<template>
  <div :class="`card_${cardId}`">
    <div :class="`card__wrapper_${cardId}`">
      <div :class="`card__3d_${cardId}`">
        <div class="card__image">
          <img src="/card-design-4.svg" alt="" />
          <div class="card_text">Mahima</div>
        </div>
        <div :class="`card__layer_1_${cardId}`"></div>
        <div :class="`card__layer_2_${cardId}`"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["cardId"]);
let cardId = props.cardId;
console.log("cardId", cardId);

onMounted(() => {
  console.log("cardId in mount", cardId);
  const el = document.querySelector(`.card_${cardId}`);
  const wrap = document.querySelector(`.card__wrapper_${cardId}`);
  let w = el.clientWidth;
  let h = el.clientHeight;
  let b = el.getBoundingClientRect();
  el.addEventListener("mousemove", (e) => {
    let X = (e.clientX - b.left) / w;
    let Y = (e.clientY - b.top) / h;

    let rX = -(X - 0.5) * 26;
    let rY = (Y - 0.5) * 26;

    let bgX = 40 + 20 * X;
    let bgY = 40 + 20 * Y;

    document.documentElement.style.setProperty("--x", 100 * X + "%");
    document.documentElement.style.setProperty("--y", 100 * Y + "%");

    document.documentElement.style.setProperty("--bg-x", bgX + "%");
    document.documentElement.style.setProperty("--bg-y", bgY + "%");

    document.documentElement.style.setProperty("--r-x", rX + "deg");
    document.documentElement.style.setProperty("--r-y", rY + "deg");
  });
});
</script>

<style>
:root {
  --step: 5%;
  --pattern: url("http://allyourhtml.club/carousel/pattern.webp") center / 75%;

  --rainbow: repeating-linear-gradient(
      0deg,
      rgb(255, 119, 115) calc(var(--step) * 1),
      rgba(255, 237, 95, 1) calc(var(--step) * 2),
      rgba(168, 255, 95, 1) calc(var(--step) * 3),
      rgba(131, 255, 247, 1) calc(var(--step) * 4),
      rgba(120, 148, 255, 1) calc(var(--step) * 5),
      rgb(216, 117, 255) calc(var(--step) * 6),
      rgb(255, 119, 115) calc(var(--step) * 7)
    )
    0% var(--bg-y) / 200% 700%;
  --diagonal: repeating-linear-gradient(
      128deg,
      #0e152e 0%,
      hsl(180, 10%, 60%) 3.8%,
      hsl(180, 10%, 60%) 4.5%,
      hsl(180, 10%, 60%) 5.2%,
      #0e152e 10%,
      #0e152e 12%
    )
    var(--bg-x) var(--bg-y) / 300%;
  --shade: radial-gradient(
      farthest-corner circle at var(--x) var(--y),
      rgba(255, 255, 255, 0.1) 12%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.25) 120%
    )
    var(--bg-x) var(--bg-y) / 300%;
}
.card_1,
.card_2,
.card_3 {
  width: 380px;
  height: 467px;
  box-sizing: border-box;
  position: relative;
}
.card__wrapper_1,
.card__wrapper_2,
.card__wrapper_3 {
  perspective: 600px;
  position: absolute;
  inset: 0;
}
.card__3d {
  transform: rotateY(var(--r-x)) rotateX(var(--r-y));
  position: absolute;
  inset: 0;
  clip-path: inset(0 0 0 0 round 48px);
}
.card__image {
  clip-path: inset(0 0 0 0 round 48px);
  position: relative;
}

.card_text {
  position: absolute;
  z-index: 99;
  color: white;
  font-size: 40px;
  left: 50%;
  margin-left: -50px;
  top: 55%;
  margin-top: -50px;
}

.card__image img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

/* soft light */
.card__layer_1_1,
.card__layer_1_2,
.card__layer_1_3 {
  position: absolute;
  inset: 0;
  z-index: 20;
  mix-blend-mode: soft-light;
  clip-path: inset(0 0 1px 0 round 48px);
  background: radial-gradient(
    farthest-corner circle at var(--x) var(--y),
    rgba(255, 255, 255, 0.8) 10%,
    rgba(255, 255, 255, 0.65) 20%,
    rgba(255, 255, 255, 0) 90%
  );
}
/* first crazy blend  */
.card__layer_2_1,
.card__layer_2_2,
.card__layer_2_3 {
  position: absolute;
  inset: 0;
  z-index: 30;

  mix-blend-mode: color-dodge;
  will-change: background;
  transition-property: opacity;
  clip-path: inset(0 0 1px 0 round 48px);

  background-blend-mode: hue, hue, hard-light, overlay;
  background: var(--pattern), var(--rainbow), var(--diagonal);
}
/* second crazy blend  */
.card__layer_2_1,
.card__layer_2_2,
.card__layer_2_3:after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--pattern), var(--rainbow), var(--diagonal), var(--shade);
  mix-blend-mode: exclusion;
  background-size: 75%, 200% 400%, 800%, 200%;
  background-position: center, 0% var(--bg-y),
    calc(var(--bg-x) * -1) calc(var(--bg-y) * -1), var(--bg-x) var(--bg-y);
  background-blend-mode: soft-light, hue, hard-light;
}
</style>
