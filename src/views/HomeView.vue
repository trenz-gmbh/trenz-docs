<template>
  <div class="home">
    <ul>
      <li v-for="(node, uid) in tree.children" :key="uid">
        {{ node.location }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { MeiliSearch } from 'meilisearch';

@Options({
})
export default class HomeView extends Vue {
  tree: any = {children: {}};

  async mounted() {
    await this.getTree();
  }

  async getTree() {
    const client = new MeiliSearch({
      apiKey: "masterKey",
      host: "http://localhost:7700/",
    });
    let results = await client.index('files').search();
    let hits = results.hits;

    this.tree = {children: hits};
  }
}
</script>
