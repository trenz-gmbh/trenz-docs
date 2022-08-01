<template>
  <p ref="top">
    <small style="opacity: 0.75" v-html="indexingState"></small>
  </p>
  <p v-if="$store.state.search.message !== null">
    {{ $store.state.search.message }}
  </p>
  <template v-if="$store.state.search.results !== null">
    <v-card v-for="(item, i) of $store.state.search.results.hits" :key="i" :to="'/wiki/' + item.location" class="mb-3">
      <template #title>
        <div style="direction: rtl; text-align: left; overflow: hidden; text-overflow: ellipsis;"
             v-html="item._formatted.location.replaceAll(/(\w)\/(.)/gmi, '$1&nbsp;/&nbsp;$2')"
        ></div>
      </template>
      <template #text>
        <markdown-content class="markdown-content" :content="item._formatted.content"></markdown-content>
      </template>
    </v-card>

    <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
  </template>
</template>

<style lang="scss">
mark {
  background: #c92c2c55;
}

.markdown-content {
  transform: scale(0.75) translateX(-15%);
}
</style>

<script lang="ts">
import {defineComponent} from "vue";
import MarkdownContent from "@/components/MarkdownContent.vue";

export default defineComponent({
  name: "SearchView",

  components: {
    MarkdownContent,
  },

  computed: {
    indexingState() {
      const stats = this.$store.state.stats;
      if (stats === null) {
        return "Stats not loaded. Search for something to load.";
      }

      let message = '';

      if (stats.isIndexing) {
        message += 'Indexing... &bull; ';
      }

      const lastUpdate = new Date(stats.lastUpdate);
      message += `Last index update: ${lastUpdate.toLocaleString()} &bull; `;
      message += `${stats.numberOfDocuments} documents indexed.`;

      const results = this.$store.state.search.results;
      if (results !== null) {
        if (results.hits.length > 0 && this.$store.state.search.query.length > 0) {
          message += ` &bull; <strong>${results.totalHits} results found</strong> in ${results.processingTimeMs}ms.`;
        }
      }

      return message;
    },

    totalPages() {
      const results = this.$store.state.search.results;
      if (results === null) {
        return 1;
      }

      return Math.max(1, Math.ceil(results.totalHits / results.limit));
    },

    currentPage: {
      set(value: number) {
        const results = this.$store.state.search.results;
        if (results === null) {
          return;
        }

        const newOffset = (value - 1) * results.limit;
        if (newOffset > results.totalHits) {
          return;
        }

        this.$store.dispatch('search', {
          query: this.$store.state.search.query,
          offset: newOffset,
          limit: results.limit
        });

        document.body.scrollIntoView({behavior: 'smooth'});
      },
      get() {
        const results = this.$store.state.search.results;
        if (results === null) {
          return 1;
        }

        return Math.ceil(results.offset / results.limit) + 1;
      },
    },
  },
})
</script>
