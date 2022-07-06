<template>
  <v-container>
    <vue-markdown :source="content"></vue-markdown>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {MeiliSearch} from "meilisearch";
import VueMarkdown from "vue-markdown-render";

export default defineComponent({
  name: "ContentView",

  components: {
    VueMarkdown,
  },

  props: {
    location: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      content: "Loading...",
    };
  },

  async beforeMount() {
    const client = new MeiliSearch({
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
    })

    const docs = await client.index('files').search("", {
      filter: 'location = "' + this.location + '"',
      limit: 1,
      attributesToRetrieve: ["content"],
    });

    if (docs.hits.length != 1) {
      this.content = "#Not found\r\n\r\nThis page does not exist.";

      return;
    }

    const doc = docs.hits[0];
    console.log(doc);
    this.content = doc.content;
  },
})
</script>
