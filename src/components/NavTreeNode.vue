<template>
  <v-list-item
      v-if="sortedChildren === null"
      :title="node.nodeName.replaceAll('-', ' ')"
      :to="'/wiki/' + node.location"
      :active="$route.params.location === node.location"
  />
  <v-list-group v-else>
    <template #activator="{ props }">
      <v-list-item
          v-bind="props"
          :title="node.nodeName.replaceAll('-', ' ')"
      />
    </template>

    <v-list-item
        title="Overview"
        :to="'/wiki/' + node.location"
        :active="$route.params.location === node.location"
    />

    <nav-tree-node v-for="(childNode, i) of sortedChildren" :node="childNode" :key="i"/>
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
      validator: (n: unknown): boolean => {
        return Object.hasOwnProperty.call(n, 'nodeName') &&
            Object.hasOwnProperty.call(n, 'location') &&
            Object.hasOwnProperty.call(n, 'order');
      },
    },
  },

  computed: {
    sortedChildren() {
      if (typeof this.node.children === 'undefined') {
        return null;
      }

      // do not sort node.children directly, because it would modify the original array
      return [...Object.keys(this.node.children).map(k => this.node.children[k]).filter(n => n.order >= 0)].sort((a, b) => {
        return a.order - b.order;
      });
    }
  },
})
</script>
