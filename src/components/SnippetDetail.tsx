import { List } from "@raycast/api";
import { SnippetItemType } from "../types";
import { markdownEscape, timestampToTime } from "../utils/format";

interface SnippetDetailProp {
  snippet: SnippetItemType;
}
export function SnippetDetail({ snippet }: SnippetDetailProp) {
  return (
    <List.Item.Detail
      markdown={markdownEscape(snippet.snippetContent)}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Name" text={snippet.name} />
          <List.Item.Detail.Metadata.Label title="ID" text={snippet.id} />
          {snippet.tags.length > 0 && <List.Item.Detail.Metadata.Label title="Tags" text={snippet.tags.join(" , ")} />}
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Last Accessed" text={timestampToTime(snippet.lastAccessed)} />
          <List.Item.Detail.Metadata.Label title="Last Updated" text={timestampToTime(snippet.lastUpdated)} />
        </List.Item.Detail.Metadata>
      }
    />
  );
}
