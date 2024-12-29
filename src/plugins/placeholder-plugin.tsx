import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  Flex,
  Heading,
  Text
} from "@sparrowengg/twigs-react";
import {
  useEffect,
  useState
} from "react";

export default function PlaceholderPlugin() {
  const [editor] =
    useLexicalComposerContext();
  const [
    isEditorEmpty,
    setIsEditorEmpty
  ] = useState(true);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const isEmpty =
            root
              ?.getFirstChild()
              ?.isEmpty() &&
            root.getChildrenSize() ===
              1;
          setIsEditorEmpty(isEmpty);
        });
      }
    );
  }, [editor]);

  if (!isEditorEmpty) {
    return null;
  }

  return (
    <Flex
      data-placeholder
      css={{
        color: "$black500",
        position: "absolute",
        marginTop: "138px",
        top: "$6",
        left: "35%",
        cursor: "text"
      }}
      flexDirection="column"
      gap={16}
    >
      <Heading
        as="h1"
        size="h2"
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const headingNode =
              $createHeadingNode("h1");
            root.clear();
            root.append(headingNode);
          });
          editor.focus();
        }}
        css={{
          color: "$black500"
        }}
      >
        Untitled Page
      </Heading>
      <Text
        size="md"
        css={{
          color: "$neutral600"
        }}
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const paragraphNode =
              $createParagraphNode();
            root.clear();
            root.append(paragraphNode);
          });
        }}
      >
        Start typing or try "/" to
        insert.
      </Text>
    </Flex>
  );
}
