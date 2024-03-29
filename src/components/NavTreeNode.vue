<template>
  <v-list-item
    v-if="sortedChildren === null"
    :title="displayName"
    :to="link"
    :active="active"
  />
  <v-list-group v-else>
    <template #activator="{ props }">
      <v-list-item
        :title="displayName"
        :active="active"
        style="flex-grow: 1"
        @click="onClick(props.active, props.onClick)"
      >
        <v-btn
          @click.stop="onExpand(props.active, props.onClick)"
          :icon="props.appendIcon"
          color="transparent"
          :class="props.class"
          :flat="true"
          density="compact"
        />
      </v-list-item>
    </template>

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
      validator: (n: unknown): boolean =>
        Object.hasOwnProperty.call(n, 'nodeName') &&
        Object.hasOwnProperty.call(n, 'location') &&
        Object.hasOwnProperty.call(n, 'hasContent') &&
        Object.hasOwnProperty.call(n, 'order'),
    },
  },

  data() {
    return {
      expanded: false,
    }
  },

  methods: {
    onClick(expanded: boolean, cb: () => void) {
      let toggle = false
      let navigate = false

      const active = this.active || !this.node.hasContent;

      if (expanded && active) {
        toggle = true
        this.expanded = false
      } else if (expanded && !active) {
        navigate = true
      } else if (!expanded && active) {
        toggle = true
        this.expanded = true
      } else {
        navigate = true
        toggle = true
        this.expanded = true
      }

      if (toggle) {
        cb()
      }

      if (this.node.hasContent && navigate) {
        this.$router.push(this.link)
      }
    },

    onExpand(expanded: boolean, cb: () => void) {
      this.expanded = !expanded
      cb()
    }
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
    },

    displayName() {
      return this.node.nodeName;
    },

    link() {
      return '/wiki/' + this.node.location;
    },

    active() {
      return this.$route.params.location === this.node.location;
    },
  },
})
</script>
