// Only Python and one theme are loaded, and only when the full viewer is opened.
async function createPythonHighlighter() {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, python, theme] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/python.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ]);
  return createHighlighterCore({
    langs: [python.default],
    themes: [theme.default],
    engine: createJavaScriptRegexEngine(),
  });
}
let highlighter: ReturnType<typeof createPythonHighlighter> | undefined;
export async function highlightPython(text: string) {
  highlighter ??= createPythonHighlighter();
  return (await highlighter).codeToTokens(text, { lang: 'python', theme: 'github-dark' }).tokens;
}
