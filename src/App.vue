<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer :permanent="true">
        <v-list>
          <nav-tree-node v-for="(n, i) of $store.state.navTree.values()" :node="n" :key="i" />
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view :key="$route.fullPath"/>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavTreeNode from "@/components/NavTreeNode.vue";

export default defineComponent({
  name: 'App',

  components: {
    NavTreeNode,
  },

  async beforeMount() {
    await this.$store.dispatch('loadNavTree');
  },

  data () {
    return {
      //
    }
  },
})
</script>
