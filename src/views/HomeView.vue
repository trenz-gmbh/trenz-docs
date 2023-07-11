<template>
  <v-progress-circular v-if="message === null" :indeterminate="true"></v-progress-circular>
  <p v-else v-html="message"></p>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HomeView',

  data() {
    return {
      message: null as string | null,
    };
  },

  mounted() {
    this.$router.isReady().then(async () => {
      const homeUrl = this.$store.state.settings?.homeUrl ?? null;
      if (homeUrl === null || homeUrl.length === 0) {
        this.message = "No <code>homeUrl</code> was set in the <code>webapp-settings.json</code>.";

        return;
      }

      if (!homeUrl.startsWith('/wiki/')) {
        this.message = `The <code>homeUrl</code> must begin with <code>/wiki/</code>, instead found <code>${homeUrl}</code>.`;

        return;
      }

      await this.$router.push(homeUrl);
    });
  }
});
</script>
