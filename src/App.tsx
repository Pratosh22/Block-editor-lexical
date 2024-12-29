import {
  Box,
  Flex,
  Editor,
  RichEditor,
  EditorToolbar,
  BoldTool,
  ItalicTool,
  UnderlineTool,
  LinkTool,
  Separator,
  UnorderedListTool,
  OrderedListTool
} from "@sparrowengg/twigs-react";
import {
  BoldIcon,
  ItalicsIcon,
  UnderlineIcon,
  LinkIcon,
  UnorderedListIcon,
  OrderedListIcon
} from "@sparrowengg/twigs-react-icons";
import {
  useState,
  useRef
} from "react";
import AutoFocusPlugin from "./plugins/auto-focus-plugin";
import MarkdownPlugin from "./plugins/markdown-shortcut-plugin";
import {
  TableNode,
  TableCellNode,
  TableRowNode
} from "@lexical/table";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { QuoteNode } from "@lexical/rich-text";
import DraggableBlockPlugin from "./plugins/draggable-block-plugin";
import RedoUndoPlugin from "./plugins/redo-undo-plugin";
import ComponentPickerPlugin from "./plugins/component-picker-plugin";
import PlaceholderPlugin from "./plugins/placeholder-plugin";

const App = () => {
  const [value, setValue] =
    useState<any>("<h1><br></h1>");
  const dataManagementRef =
    useRef<any>(null);
  return (
    <Flex
      css={{
        background: "white",
        width: "100%"
      }}
      grow={1}
    >
      <Box
        id="editorjs"
        css={{
          width: "100%",
          padding: "$6 $6 0 $6"
        }}
      >
        <Editor
          nodes={[
            TableNode,
            TableCellNode,
            TableRowNode,
            HorizontalRuleNode,
            QuoteNode
          ]}
          onChange={() => {
            dataManagementRef.current
              ?.getDataAsync()
              .then(({ html }) => {
                setValue(html);
              });
          }}
          dataManagementRef={
            dataManagementRef
          }
        >
          {dataManagementRef.current &&
            value !== "<p><br></p>" && (
              <DraggableBlockPlugin />
            )}
          <AutoFocusPlugin />
          <MarkdownPlugin />
          <HorizontalRulePlugin />
          <ComponentPickerPlugin />
          <PlaceholderPlugin />
          <EditorToolbar>
            <Flex
              alignItems="center"
              data-testid="toolbar-icons"
              justifyContent="center"
              gap={8}
              css={{
                borderRadius: "$xl",
                padding: "$3 $3 0 $3"
              }}
            >
              <RedoUndoPlugin />
              <BoldTool
                buttonProps={{
                  icon: <BoldIcon />
                }}
              />
              <ItalicTool
                buttonProps={{
                  icon: <ItalicsIcon />
                }}
              />
              <UnderlineTool
                buttonProps={{
                  icon: (
                    <UnderlineIcon />
                  )
                }}
              />
              <LinkTool
                buttonProps={{
                  icon: <LinkIcon />
                }}
              />
              <Separator
                orientation="vertical"
                css={{
                  height:
                    "16px !important"
                }}
              />
              <UnorderedListTool
                buttonProps={{
                  icon: (
                    <UnorderedListIcon />
                  )
                }}
              />
              <OrderedListTool
                buttonProps={{
                  icon: (
                    <OrderedListIcon />
                  )
                }}
              />
              <Separator
                orientation="vertical"
                css={{
                  height:
                    "16px !important"
                }}
              />
            </Flex>
          </EditorToolbar>
          <RichEditor
            editorContainerProps={{
              css: {
                ".editor": {
                  border:
                    "none !important",
                },
                "div[contenteditable]":
                  {
                    height: "100%",
                    position:
                      "absolute",
                    left: "35%",
                    marginRight: "30%",
                    marginTop: "118px"
                  },
                "div[role=textbox]": {
                  minHeight:
                    "300px !important",
                  padding:
                    "0 0 $6 0 !important",
                  lineHeight: "28px",
                  "&:focus-visible": {
                    outline:
                      "none !important"
                  }
                }
              }
            }}
          />
        </Editor>
      </Box>
    </Flex>
  );
};

export default App;
