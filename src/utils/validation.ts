import { SnippetItemType, SnippetItemInputType } from "../types";
import { getSnippets } from "./data";

export async function checkSnippetIdExist<T>(value: T, snippetsInput?: Array<SnippetItemType>): Promise<boolean> {
  // compare against local storage if there's nothing to compare against
  const snippets = snippetsInput ?? (await getSnippets());
  return snippets.some((snippetItem) => snippetItem.id === value);
}

export async function checkSnippetNameExist<T>(value: T, snippetsInput?: Array<SnippetItemType>): Promise<boolean> {
  // compare against local storage if there's nothing to compare against
  const snippets = snippetsInput ?? (await getSnippets());
  return snippets.some((snippetItem) => snippetItem.name === value);
}

function validateNotJustSpace(input: string) {
  return typeof input === "string" && input.replace(" ", "").length > 0;
}

export async function validateNewSnippet(newSnippet: SnippetItemInputType): Promise<SnippetItemType> {
  // validate id
  if (!validateNotJustSpace(newSnippet.id)) throw new Error("Snippet id invalid, please use another id");
  const snippetIdExist = await checkSnippetIdExist(newSnippet.id);
  if (snippetIdExist) throw new Error(`The id "${newSnippet.id}" is taken, please use another id`);

  // valid name
  const snippetNameExist = await checkSnippetNameExist(newSnippet.name);
  if (!validateNotJustSpace(newSnippet.name)) throw new Error("Snippet name invalid, please use another name");
  if (snippetNameExist) throw new Error(`The name "${newSnippet.name}" is taken, please use another name`);

  // valid content
  if (!validateNotJustSpace(newSnippet.snippetContent)) throw new Error("Snippet content invalid");

  // check if keywords repeat
  const tags = newSnippet.tags
    .toString()
    .split(",")
    .filter((tag) => tag !== "");
  if (new Set(tags).size !== tags.length) throw new Error("Tags cannot repeat");

  const now = Date.now();

  return {
    ...newSnippet,
    tags,
    lastUpdated: now,
    lastAccessed: now,
  };
}
