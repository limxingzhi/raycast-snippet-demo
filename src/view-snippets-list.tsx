import { Action, ActionPanel, Alert, Clipboard, confirmAlert, List, popToRoot } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { SnippetDetail } from "./components/SnippetDetail";

import { SnippetItemType } from "./types";
import { deleteSnippetWithId, getSnippets, orderItems } from "./utils/data";

export default function ViewSnippetList() {
  const [allItems, setAllItems] = useState<Array<SnippetItemType>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // populate all items
  useEffect(() => {
    getSnippets().then(setAllItems);
  }, []);

  const filteredAndOrderedItems: Array<SnippetItemType> = useMemo(() => {
    return orderItems(allItems, searchTerm).filter(({ id, name, tags }) => {
      if (id.includes(searchTerm)) return true;
      if (name.includes(searchTerm)) return true;
      return tags.find((tag) => tag.includes(searchTerm));
    });
  }, [allItems, searchTerm]);

  function handleSelect({ snippetContent }: SnippetItemType) {
    Clipboard.copy(snippetContent);
    Clipboard.paste(snippetContent);
  }

  function handleDelete({ id }: SnippetItemType) {
    confirmAlert({
      title: "Delete snippet?",
      primaryAction: { title: "Confirm Delete", style: Alert.ActionStyle.Destructive },
    }).then((confirmed) => {
      if (confirmed) {
        // delete item
        deleteSnippetWithId(id).then(() =>popToRoot());
      }
    });
  }

  return (
    <List
      isShowingDetail
      filtering={false}
      onSearchTextChange={setSearchTerm}
      navigationTitle="Search snippet snippets"
      searchBarPlaceholder="Filter by snippet ID, name and keywords"
    >
      {filteredAndOrderedItems.map((item) => (
        <List.Item
          keywords={item.tags}
          key={item.id}
          title={item.id}
          accessories={item.tags.length > 0 ? [{ text: { value: item.tags.join(" , ") } }] : undefined}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => handleSelect(item)} />
              <Action title="Delete" onAction={() => handleDelete(item)} shortcut={{ modifiers: ["ctrl"], key: "x" }} />
            </ActionPanel>
          }
          detail={<SnippetDetail snippet={item} />}
        />
      ))}
    </List>
  );
}
