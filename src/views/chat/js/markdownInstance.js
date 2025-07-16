import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

export function highlightBlock(str, lang) {
  return `<pre class="code-block-wrapper"> <div class="code-block-header"> <span class="code-block-header__lang"> ${lang}</span><span class="code-block-header__copy">复制</span> </div> <code class="hljs code-block-body ${lang}">${str}</code> </pre>`
}

export const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: function (code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})

export function getSafeHtml(aiText) {
  const rawHtml = md.render(aiText)
  return DOMPurify.sanitize(rawHtml)
}
