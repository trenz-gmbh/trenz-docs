<template>
  <v-list-item
      v-if="node.children.size === 0"
      :title="node.name"
      :to="'/wiki/' + node.location"
      :active="$route.params.location === node.location"
  />
  <v-list-item
      v-else-if="node.children.size === 1 && firstChild.name === node.name"
      :title="firstChild.name"
      :to="'/wiki/' + firstChild.location"
      :active="$route.params.location === firstChild.location"
  />
  <v-list-group v-else>
    <template #activator="{ props }">
      <v-list-item
          v-bind="props"
          :title="node.name"
          :value="node.uid"
      />
    </template>

    <NavTreeNode v-for="(n, i) of node.children.values()" :node="n" :key="i"/>
  </v-list-group>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "NavTreeNode",

  props: {
    node: {
      type: Object,
      required: true,
    },
  },

  computed: {
    firstChild() {
      return [...this.node.children.values()][0];
    }
  }
})
</script>

<!--
<style scoped lang="scss">
ul {
  list-style: none;
  margin-left: 1rem;
}
</style>-->
