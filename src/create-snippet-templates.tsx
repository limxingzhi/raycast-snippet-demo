import { Action, ActionPanel, Form, Toast, showToast, popToRoot } from "@raycast/api";
import { SnippetItemInputType } from "./types";
import { saveSnippet } from "./utils/data";
import { validateNewSnippet } from "./utils/validation";

const placeHolderText = `// state for {{args.0}}\nconst [{{args.0}}, set{{args.1}}] = useState();\n\n`;

export default function CreateSnippetTemplate() {
  async function submitHandler(formValues: SnippetItemInputType) {
    try {
      const newSnippet = await validateNewSnippet(formValues);
      await saveSnippet(newSnippet);
      showToast({ style: Toast.Style.Success, title: `${newSnippet.name} is saved` });
      popToRoot();
    } catch (exception: any) {
      showToast({ style: Toast.Style.Failure, title: "Invalid inputs", message: exception.message });
    }
  }
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={submitHandler} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" placeholder="Name of your snippet" />
      <Form.TextField id="id" title="ID" placeholder={`Unique ID to open your snippet, e.g. "rus"`} />
      <Form.TextArea id="snippetContent" title="Snippet" placeholder={placeHolderText} />
      <Form.TextField id="tags" title="Tags" placeholder={`For easy searching, e.g. "react,useState" `} />
    </Form>
  );
}
