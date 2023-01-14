import markdownEscapeLibrary from "markdown-escape";

export function timestampToTime(timestampMs: number) {
  return new Date(timestampMs).toLocaleString();
}

export function markdownEscape (input:string) {
  return markdownEscapeLibrary(input).replaceAll('---', '\\-\\-\\-')
}
