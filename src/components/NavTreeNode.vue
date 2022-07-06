<template>
  <v-list-item
      v-if="node.children.size === 0"
      :title="node.name"
      :href="'/wiki/' + node.location"
  />
  <v-list-group v-else>
    <template #activator="{ props }">
      <v-list-item v-bind="props" :title="node.name" :value="node.uid" />
    </template>

    <NavTreeNode v-for="(n, i) of node.children.values()" :node="n" :key="i" />
  </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "NavTreeNode",

  props: {
    node: {
      type: Object,
      required: true,
    },
  },
})
</script>
