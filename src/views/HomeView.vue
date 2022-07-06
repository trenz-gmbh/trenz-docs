<template>
  <div class="home">
    <ais-instant-search :search-client="client" index-name="files">
      <ais-search-box />
      <ais-hits>
        <template v-slot:item="{ item }">
          <h2>{{ item.name }}</h2>
        </template>
      </ais-hits>
    </ais-instant-search>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

@Options({
})
export default class HomeView extends Vue {
  client = instantMeiliSearch(
      "http://localhost:7700/",
      "masterKey"
  );
}
</script>
