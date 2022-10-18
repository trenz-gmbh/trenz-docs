import {marked} from "marked";

export default class TrenzMarkdownRenderer extends marked.Renderer {
    headings: {text: string, level: 1 | 2 | 3 | 4 | 5 | 6, id: string}[] = [];

    toc(): string {
        if (this.headings.length < 4) return "";

        return this.renderTocLevel(0, 1).html;
    }

    private renderTocLevel(offset: number, level: number): {html: string, newOffset: number} {
        let html: string
        if (offset == 0) {
            html = `<ol class="table-of-contents">`
        } else {
            html = `<ol>`
        }
        for (let h = this.headings[offset]; offset < this.headings.length && h.level === level; h = this.headings[++offset]) {
            html += `<li><a href="#${h.id}">${h.text}</a>`

            if (this.headings[offset + 1] && this.headings[offset + 1].level > level) {
                const result = this.renderTocLevel(offset + 1, this.headings[offset + 1].level)
                html += result.html
                offset = result.newOffset - 1 // offset gets increased one last time before the recursive call ends, this removes this last increment.
            }

            html += `</li>`
        }

        return {html: html + `</ol>`, newOffset: offset};
    }

    heading(
        text: string,
        level: 1 | 2 | 3 | 4 | 5 | 6,
        raw: string,
        slugger: marked.Slugger
    ): string {
        if (this.options.headerIds) {
            const id = this.options.headerPrefix + slugger.slug(raw)
            this.headings.push({text, level, id})
            return `<h${level} id="${id}">${text}</h${level}>\n`;
        }

        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
    }
}
