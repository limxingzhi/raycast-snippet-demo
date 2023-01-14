import { LocalStorage } from "@raycast/api";

import { SnippetItemType } from "../types";

const SNIPPET_LIST_KEY = "SNIPPET_LIST_KEY";

// LIST snippets
export async function getSnippets(): Promise<Array<SnippetItemType>> {
  return JSON.parse((await LocalStorage.getItem(SNIPPET_LIST_KEY)) ?? "[]");
}

// CREATE snippet and return newly created snippet
export async function saveSnippet(newSnippet: SnippetItemType): Promise<SnippetItemType> {
  const newList = [...(await getSnippets()), { ...newSnippet }];
  await LocalStorage.setItem(SNIPPET_LIST_KEY, JSON.stringify(newList));
  return { ...newSnippet };
}

// READ one snippet
export async function getSnippetWithId(id: string): Promise<SnippetItemType | undefined> {
  return (await getSnippets()).find((item) => item.id === id);
}

// DELETE one snippet and return the deleted snippet
export async function deleteSnippetWithId(id: string): Promise<SnippetItemType | undefined> {
  const snippets = await getSnippets();
  const target = snippets.find((item) => item.id === id);
  const newList = snippets.filter((item) => item.id !== id);
  LocalStorage.setItem(SNIPPET_LIST_KEY, JSON.stringify(newList));

  if (target) return { ...target };
}

// UPDATE one snippet and return updated snippet
export async function updateSnippet(patchSnippet: Partial<SnippetItemType>, id: string): Promise<SnippetItemType> {
  // delete snippet
  const item = await deleteSnippetWithId(id);
  if (!item) throw new Error("Item not found");

  // update deleted snippet + save it
  const newItem: SnippetItemType = { ...item, ...patchSnippet };
  saveSnippet(newItem);

  return { ...newItem };
}

export function orderItems(allItems: Array<SnippetItemType>, searchTerm: string) {
  return [...allItems].sort((item1, item2) => {
    // check if any of the ids matches the search term exactly
    if (item1.id === searchTerm) return -1;
    if (item2.id === searchTerm) return +1;

    // check if any of the ids includes the search term
    if (item1.id.includes(searchTerm)) return -1;
    if (item2.id.includes(searchTerm)) return +1;

    // check if any of the names matches the search term exactly
    if (item1.name === searchTerm) return -1;
    if (item2.name === searchTerm) return +1;

    // check if any of the names includes the search term
    if (item1.id.includes(searchTerm)) return -1;
    if (item2.id.includes(searchTerm)) return +1;

    // return the last accessed item
    return item2.lastAccessed - item1.lastAccessed;
  });
}
