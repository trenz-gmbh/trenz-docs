<template>
  <div>
    <a href="https://trenz.de" target="_blank">TRENZ</a>
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 72.653 93.565605">
      <g transform="matrix(0.13333333,0,0,-0.13333333,0,93.566131)">
        <path d="M 194.023,0.00390625 V 312.672 L 350.363,156.336 194.023,0.00390625" />
        <path d="M 0,194.027 V 506.695 L 156.336,350.363 0,194.027" />
        <path d="M 388.566,194.539 V 507.207 L 544.898,350.871 388.566,194.539" />
        <path d="M 194.023,389.074 V 701.746 L 350.363,545.414 194.023,389.074" />
      </g>
    </svg>
    <a href="https://github.com/trenz-gmbh/trenz-docs" target="_blank">DOCS</a>
  </div>
</template>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  color: #888;
  font-size: 1em;
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

  //&:hover {
  //  g {
  //    path {
  //
  //      transition: all 0.2s;
  //      fill: cornflowerblue;
  //    }
  //  }
  //}

  g {
    path {
      fill: currentColor;
    }
  }
}
</style>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "TrenzDocsLogo",
})
</script>
