<template>
  <v-row>
    <v-col cols="12">
      <small style="opacity: 0.7" v-html="indexingState"></small>
    </v-col>
  </v-row>
  <v-row :dense="true">
    <v-col v-for="(item, i) of $store.state.searchResults" :key="i" :cols="12" :md="6" :lg="4">
      <v-card :to="'/wiki/' + item.location">
        <template #title>
          <div style="direction: rtl; text-align: left; overflow: hidden; text-overflow: ellipsis;"
               v-html="item._formatted.location.replaceAll(/(\w)\/(\w)/gmi, '$1 / $2')">
          </div>
        </template>
        <template #text>
          <markdown-content class="markdown-content" :content="item._formatted.content"></markdown-content>
        </template>
      </v-card>
    </v-col>
    <v-col cols="12" v-if="$store.state.searchResultMessage !== null">
      {{ $store.state.searchResultMessage }}
    </v-col>
  </v-row>
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
      message += `Last update: ${lastUpdate.toLocaleString()} &bull; `;
      message += `${stats.numberOfDocuments} documents indexed.`;

      return message;
    }
  },
})
</script>
