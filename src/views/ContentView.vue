<template>
  <v-container>
    <markdown-content :content="content" />
  </v-container>
</template>

<style lang="scss">
@import "prismjs/themes/prism-coy.min.css";

ol, ul {
  margin-left: 1rem;
}

$code-color: #c92c2c;
$code-background-color: #eeeeee;

code:not(pre > code) {
  background: $code-background-color;
  color: $code-color;
  border-radius: 0.25rem;
  padding: 0 0.25rem;
}

code[class*=language-] {
  overflow: initial;
}

pre {
  border: solid 1px #00000044;
  overflow-x: auto;
  padding: 0.5rem;
}
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {MeiliSearch} from "meilisearch";
import MarkdownContent from "@/components/MarkdownContent.vue";

export default defineComponent({
  name: "ContentView",

  components: {
    MarkdownContent,
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
      this.content = "# Not found\r\n\r\nThis page does not exist.";

      return;
    }

    const doc = docs.hits[0];
    this.content = doc.content;
  },
})
</script>
