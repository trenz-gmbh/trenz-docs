<template>
  <v-row :dense="true">
    <v-col v-for="(item, i) of $store.state.searchResults" :key="i" :cols="12" :md="6" :lg="4">
      <v-card :to="'/wiki/' + item.location">
        <template #title>
          <h3 v-html="item._formatted.location.replaceAll(/(\w)\/(\w)/gmi, '$1 / $2')"></h3>
        </template>
        <template #text>
          <markdown-content class="markdown-content" :content="item._formatted.content"></markdown-content>
        </template>
      </v-card>
    </v-col>
    <v-col :cols="4" v-if="$store.state.searchResults.length === 0">
      {{ $store.state.searchQuery.length === 0 ? 'Search for something. Your results will be shown here.' : 'No results found' }}
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
import {Options, Vue} from 'vue-class-component';
import {instantMeiliSearch} from '@meilisearch/instant-meilisearch';
import WordHighlighter from "vue-word-highlighter";
import MarkdownContent from "@/components/MarkdownContent.vue";

@Options({
  components: {
    MarkdownContent,
    WordHighlighter,
  },
})
export default class HomeView extends Vue {
	client = instantMeiliSearch(
		"http://localhost:7700/",
		"masterKey"
	);


  breadcrumbItems(location: string): object[] {
    let parts = location.split('/');
    let path = [] as string[];

    return parts.map(part => {
      path.push(part);

      return {
        text: part,
        to: '/wiki/' + path.join('/'),
        disabled: true,
      }
    })
  }
}
</script>
