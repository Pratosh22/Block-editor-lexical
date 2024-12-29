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
  OrderedListTool,
  TextAlignTool,
  IconButton,
  CodeTool
} from "@sparrowengg/twigs-react";
import {
  BoldIcon,
  ItalicsIcon,
  UnderlineIcon,
  LinkIcon,
  UnorderedListIcon,
  OrderedListIcon,
  TextAlignLeftIcon,
  AttachmentIcon,
  CodeIcon
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
import ComponentIcon from "./icons/component-icon";

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
                  icon: (
                    <BoldIcon
                      size={20}
                      color="#64748B"
                    />
                  )
                }}
              />
              <ItalicTool
                buttonProps={{
                  icon: (
                    <ItalicsIcon
                      size={20}
                      color="#64748B"
                    />
                  )
                }}
              />
              <UnderlineTool
                buttonProps={{
                  icon: (
                    <UnderlineIcon
                      size={20}
                      color="#64748B"
                    />
                  )
                }}
              />
              <TextAlignTool
                buttonProps={{
                  icon: (
                    <TextAlignLeftIcon
                      size={20}
                      color="#64748B"
                    />
                  )
                }}
              />
              <UnorderedListTool
                buttonProps={{
                  icon: (
                    <UnorderedListIcon
                      size={20}
                      strokeWidth={1.5}
                      color="#64748B"
                    />
                  )
                }}
              />
              <OrderedListTool
                buttonProps={{
                  icon: (
                    <OrderedListIcon
                      size={20}
                      color="#64748B"
                    />
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
              <IconButton
                icon={
                  <AttachmentIcon />
                }
                variant="ghost"
                color="default"
              />
              <LinkTool
                buttonProps={{
                  icon: (
                    <LinkIcon
                      size={20}
                      color="#64748B"
                    />
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
              <CodeTool
                buttonProps={{
                  icon: (
                    <CodeIcon
                      size={20}
                      color="#64748B"
                    />
                  )
                }}
              />
              <IconButton
                icon={<ComponentIcon />}
                variant="ghost"
                color="default"
              />
            </Flex>
          </EditorToolbar>
          <RichEditor
            editorContainerProps={{
              css: {
                ".editor": {
                  border:
                    "none !important"
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
                  maxWidth: "640px",
                  width: "640px",
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
