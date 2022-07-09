<template>
  <v-app>
    <v-navigation-drawer app v-model="drawerOpen" :permanent="drawerFixed">
      <template #prepend>
        <div class="pa-2">
          <v-text-field
              v-model="searchQuery"
              label="Search Wiki"
              @focusin="maybeNavigateToSearch"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              single-line
          ></v-text-field>
        </div>
      </template>

      <v-list>
        <v-list-item
            title="Home"
            :to="{name: 'home'}"
        />
        <v-list-item
            title="About"
            :to="{name: 'about'}"
        />
        <nav-tree-node v-for="(n, i) of $store.state.navTree" :node="n" :key="i"/>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn :icon="true" :flat="true" :color="drawerFixed ? 'primary' : null" @click.stop="drawerFixed = drawerOpen = !drawerFixed">
            <v-icon>mdi-pin</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-breadcrumbs v-if="breadcrumbItems.length > 1" :items="breadcrumbItems" class="ms-0" />
      <v-container fluid>
        <router-view :key="$route.fullPath" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import NavTreeNode from "@/components/NavTreeNode.vue";

export default defineComponent({
  name: 'App',

  components: {
    NavTreeNode,
  },

  async beforeMount() {
    await this.$store.dispatch('loadNavTree');

    this.drawerFixed = window.localStorage.getItem('drawerFixed') !== 'false';
  },

  data() {
    return {
      searchQuery: '',
      drawerOpen: true,
      drawerFixed: true,
    }
  },

  watch: {
    async searchQuery(q) {
      await this.$store.dispatch('search', q);
      await this.maybeNavigateToSearch();
    },

    drawerFixed(v) {
      window.localStorage.setItem('drawerFixed', v);
    },
  },

  methods: {
    async maybeNavigateToSearch() {
      if (this.$route.name !== 'search' && this.$store.state.searchQuery.length > 0) {
        await this.$router.push({'name': 'search'})
      }
    }
  },

  computed: {
    breadcrumbItems() {
      if (!this.$route.params.location) {
        return [
          {
            text: this.$route.meta.title,
            to: this.$route.fullPath,
            disabled: false,
          }
        ];
      }

      let parts = (this.$route.params.location as string).split('/');
      let path = [] as string[];

      return parts.map(part => {
        path.push(part);

        return {
          text: part,
          to: '/wiki/' + path.join('/'),
          disabled: false,
        }
      })
    },

    title() {
      if (!this.$route.params.location) {
        return this.$route.meta.title;
      }

      let parts = (this.$route.params.location as string).split('/');
      return parts[parts.length - 1];
    },
  },
})
</script>
