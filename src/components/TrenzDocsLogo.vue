<template>
  <div class="logo-wrapper">
    <a href="https://trenz.de" target="_blank">TRENZ</a>
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 72.653 93.565605">
      <g transform="matrix(0.13333333,0,0,-0.13333333,0,93.566131)">
        <path class="swarm-blue" d="M 194.023,0.00390625 V 312.672 L 350.363,156.336 194.023,0.00390625" />
        <path class="swarm-red" d="M 0,194.027 V 506.695 L 156.336,350.363 0,194.027" />
        <path class="swarm-green" d="M 388.566,194.539 V 507.207 L 544.898,350.871 388.566,194.539" />
        <path class="swarm-yellow" d="M 194.023,389.074 V 701.746 L 350.363,545.414 194.023,389.074" />
      </g>
    </svg>
    <a href="https://github.com/trenz-gmbh/trenz-docs" target="_blank">DOCS</a>
  </div>
</template>

<style scoped lang="scss">
.logo-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  color: #888;
  font-size: 0.8em;

  &:hover {
    .swarm-blue {
      fill: #50b4cf;
    }

    .swarm-green {
      fill: #73c82c;
    }

    .swarm-red {
      fill: #e31544;
    }

    .swarm-yellow {
      fill: #fbc707;
    }
  }
}

a {
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

svg {
  height: 1.33em;
  margin-right: 0.33em;
  margin-left: 0.33em;
}

path {
  fill: currentColor;
  transition: all 0.2s ease-out;
}
</style>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "TrenzDocsLogo",
})
</script>
