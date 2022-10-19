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

pre > code, code[class*=language-] {
  overflow: initial;
  padding: 0;
}

code .line-number {
  display: inline-block;
  margin-right: 1ch;
  padding-right: 1ch;
  user-select: none;
  text-align: right;
  border-right: solid 1px $code-fence-border;
}

pre {
  border: solid 1px $code-fence-border;
  overflow-x: auto;
  padding: 0 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
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

details.table-of-contents {
  border: rgb(var(--v-theme-primary)) 1px solid;
  border-radius: 8px;
  display: inline-block;

  summary {
    text-align: center;
    font-weight: bold;
    list-style: none;
    padding: 0 0.25rem;
    cursor: pointer;

    &::-webkit-details-marker {
      display: none;
    }

    &:before {
      content: '\25B6'; // right arrow
      float: left;
      margin-right: 0.5rem;
    }
  }

  &[open] {
    summary {
      &:before {
        content: '\25BC'; // down arrow
      }
    }
  }

  & > ol {
    padding: 0.5rem 1rem 0.5rem 0;

    &, ol {
      counter-reset: item
    }

    li {
      display: block;

      a {
        text-decoration: none;
        color: inherit;

        &:hover {
          text-decoration: underline rgb(var(--v-theme-primary)) 1px;
        }
      }

      &:before {
        content: counters(item, ".") " ";
        counter-increment: item;
        margin-right: 0.5rem;
      }
    }
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
import TrenzMarkdownRenderer from "@/TrenzMarkdownRenderer";

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
        mangle: true,
        smartypants: true,
        highlight(code: string, lang: string, callback?: (error: unknown, code?: string) => void): string | void {
          try {
            let html
            if (!lang || !Prism.languages[lang]) {
              html = code
            } else {
              html = Prism.highlight(code, Prism.languages[lang], lang)
            }

            let output = "";
            const lines = html.split(/\n/gm)
            if (lang !== 'mermaid' && lines.length > 1) {
              const digitCount = lines.length.toString().length;
              for (let i = 0; i < lines.length; i++) {
                output += `<span class="line-number token comment" style="width: ${digitCount + 1}ch">${i + 1}</span>${lines[i]}\n`;
              }
            } else {
              output = html;
            }

            if (callback) callback(null, output)
            else return output
          } catch (e) {
            if (callback) callback(e)
            else throw e
          }
        },
      } as marked.MarkedOptions & { renderer: TrenzMarkdownRenderer },
      toc: "",
    };
  },

  mounted() {
    // @ts-expect-error mermaid is globally installed
    window.mermaid.init({}, ".language-mermaid");
  },

  computed: {
    output() {
      const renderer = new TrenzMarkdownRenderer()
      const opts = Object.assign({}, this.options);
      opts.renderer = renderer;

      const output = marked(this.content, opts);

      return renderer.toc() + output;
    },
  },
})
</script>
