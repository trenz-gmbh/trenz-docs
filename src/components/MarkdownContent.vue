<template>
  <div v-html="output"></div>
</template>

<style lang="scss">
@import "prismjs/themes/prism-coy.min.css";

$code-color: #c92c2c;
$code-background-color: #eeeeee;
$code-fence-border: #00000044;

ol, ul {
  margin-left: 1rem;
}

code:not(pre > code) {
  background: $code-background-color;
  color: $code-color;
  border-radius: 0.25rem;
  padding: 0 0.25rem;
  word-break: break-all;
}

code[class*=language-] {
  overflow: initial;
}

pre {
  border: solid 1px $code-fence-border;
  overflow-x: auto;
  padding: 0.5rem;
}

img {
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

p {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

h1, h2, h3 {
  &:not(:first-child) {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
}

h4, h5, h6 {
  &:not(:first-child) {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {marked} from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike.min.js'
import 'prismjs/components/prism-yaml.min.js'
import 'prismjs/components/prism-aspnet.min.js'
import 'prismjs/components/prism-bash.min.js'
import 'prismjs/components/prism-sql.min.js'
import 'prismjs/components/prism-csharp.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-toml.min.js'
import 'prismjs/components/prism-ini.min.js'

export default defineComponent({
  name: "MarkdownContent",

  props: {
    content: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      options: {
        gfm: true,
        breaks: true, // requires gfm to be true
        mangle: true,
        smartypants: true,
        highlight(code: string, lang: string, callback?: (error: unknown, code?: string) => void): string | void {
          try {
            let html;
            if (!lang) {
              html = code;
            } else {
              html = Prism.highlight(code, Prism.languages[lang], lang);
            }

            if (callback) callback(null, html);
            else return html;
          } catch (e) {
            if (callback) callback(e);
            else throw e;
          }
        },
      } as marked.MarkedOptions,
    };
  },

  computed: {
    output() {
      return marked(this.content, this.options);
    }
  },
})
</script>
