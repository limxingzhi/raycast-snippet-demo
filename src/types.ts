export type SnippetItemType = {
  name: string;
  id: string;
  tags: Array<string>;
  snippetContent: string;
  lastUpdated: number;
  lastAccessed: number;
};

export type SnippetItemInputType = {
  name: string;
  id: string;
  tags: string;
  snippetContent: string;
};

