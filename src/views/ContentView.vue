<template>
  <markdown-content :content="content" />
</template>

<script lang="ts">
import {defineComponent} from "vue";
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
    this.content = await this.$store.dispatch('findDocumentByLocation', this.location);
  },
})
</script>
