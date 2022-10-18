<template>
  <v-app>
    <v-navigation-drawer app v-model="drawerOpen" :permanent="true" class="bg-primary">
      <template #prepend>
        <div class="px-2 border-b d-flex align-center" style="height: 65px">
          <v-text-field
            ref="search"
            v-model="searchQuery"
            label="Search Wiki"
            @focusin="handleSearchFieldFocusin"
            @focusout="handleSearchFieldFocusout"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            hide-details
            single-line
            density="compact"
          >
            <template #append-inner v-if="!searchFieldFocussed">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
                <path fill="none" stroke="currentColor" opacity=".6"
                      d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"></path>
                <path fill="currentColor" d="M11.8 6L8 15.1h-.9L10.8 6h1z"></path>
              </svg>
            </template>
          </v-text-field>
        </div>
      </template>

      <v-list density="compact" class="on-primary bg-primary">
        <v-list-item
          title="Home"
          :to="{name: 'home'}"
        />
        <nav-tree-node v-for="(n, i) of sortedNavTree" :node="n" :key="i"/>
        <small class="sign-in-prompt">
          <span v-if="navTreeHasHiddenNodes">Some pages may require additional permissions to view.<br/></span>
          <v-btn size="x-small"
                 variant="outlined"
                 :loading="signInButtonLoading"
                 :href="isSignedIn ? logoutUrl : loginUrl"
          >
            {{ isSignedIn ? 'Sign Out' : 'Sign in' }}
          </v-btn>
        </small>
      </v-list>

      <template #append>
        <v-row>
          <v-col style="flex: 1 0" class="ma-2 d-flex align-center justify-center on-primary">
            <trenz-docs-logo/>
          </v-col>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-app-bar app :elevation="0" class="on-primary acrylic">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
    </v-app-bar>

    <v-app-bar app class="background-toolbar bg-primary border-b" :elevation="0"></v-app-bar>

    <v-main class="bg-transparent negate-second-toolbar">
      <v-breadcrumbs v-if="breadcrumbItems.length > 1" :items="breadcrumbItems" class="ms-0"/>
      <v-container fluid>
        <router-view :key="$route.fullPath" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
::selection {
  background: rgba(var(--v-theme-primary), 0.9);
  color: rgba(var(--v-theme-on-primary), 0.9);
}

.on-primary,
.bg-primary {
  &::selection,
  & *::selection {
    background: rgba(var(--v-theme-on-primary), 0.9);
    color: rgba(var(--v-theme-primary), 0.9);
  }
}

.acrylic {
  backdrop-filter: blur(5px);
  background: rgba(var(--v-theme-primary), 0.66) !important;
}

.background-toolbar {
  z-index: 0 !important;
  margin-top: 0 !important;
}

.negate-second-toolbar {
  padding-top: 64px !important;
}

.sign-in-prompt {
  margin: 0.5rem 0.5rem 0;
  font-size: 0.8rem;
  text-align: center;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  & .v-btn__loader {
    transform: scale(0.75);
  }
}
</style>

<script lang="ts">
import {defineComponent} from 'vue'
import NavTreeNode from "@/components/NavTreeNode.vue";
import {VTextField} from "vuetify/components";
import TrenzDocsLogo from "@/components/TrenzDocsLogo.vue";
import ApiClient from "@/api/ApiClient";
import {mapGetters} from "vuex";
import * as api from "@/api";

export default defineComponent({
  name: 'App',

  components: {
    TrenzDocsLogo,
    NavTreeNode,
  },

  async beforeMount() {
    window.addEventListener('keydown', this.handleKeyDown)

    await this.$store.dispatch('loadNavTree');

    api.auth.state().then(result => {
      this.isSignedIn = result;
      this.signInButtonLoading = false;
    });
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  data() {
    return {
      searchQuery: '',
      drawerOpen: true,
      searchFieldFocussed: false,
      isSignedIn: false,
      signInButtonLoading: true,
    }
  },

  watch: {
    async searchQuery(q) {
      await this.$store.dispatch('search', q);
      await this.maybeNavigateToSearch();
    },
  },

  methods: {
    async handleSearchFieldFocusin() {
      this.searchFieldFocussed = true;

      await this.maybeNavigateToSearch();
    },

    async handleSearchFieldFocusout() {
      this.searchFieldFocussed = false;
    },

    async maybeNavigateToSearch() {
      if (this.$route.name !== 'search' && this.$store.state.searchQuery.length > 0) {
        await this.$router.push({'name': 'search'})
      }
    },

    handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (this.searchFieldFocussed) {
          this.searchQuery = '';
        }
      } else if (e.key === '/') {
        if (!this.drawerOpen) {
          this.drawerOpen = true;
        }

        const searchField = this.$refs.search as VTextField;

        if (!this.searchFieldFocussed) {
          this.searchQuery = '';
          searchField.focus();
          e.preventDefault();
        }
      }
    }
  },

  computed: {
    ...mapGetters(['navTreeHasHiddenNodes']),

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

    sortedNavTree() {
      // do not sort navTree directly, because it would modify the original array
      return [...Object.keys(this.$store.state.navTree.root).map(k => this.$store.state.navTree.root[k]).filter(n => n.order >= 0)].sort((a, b) => {
        return a.order - b.order;
      });
    },

    loginUrl() {
      return ApiClient.getBaseUrl() + "auth/transfer?returnUrl=" + encodeURI(window.location.origin + this.$route.fullPath);
    },

    logoutUrl() {
      return ApiClient.getBaseUrl() + "auth/signout?returnUrl=" + encodeURI(window.location.origin + this.$route.fullPath);
    },
  },
})
</script>
