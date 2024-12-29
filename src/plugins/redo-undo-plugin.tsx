import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  IconButton,
  Flex,
  Separator
} from "@sparrowengg/twigs-react";
import {
  RedoIcon,
  UndoIcon
} from "@sparrowengg/twigs-react-icons";
import {
  UNDO_COMMAND,
  REDO_COMMAND
} from "lexical";

const RedoUndoPlugin = () => {
  const [editor] =
    useLexicalComposerContext();

  return (
    <Flex alignItems="center" gap={8}>
      <IconButton
        icon={<UndoIcon />}
        onClick={() => {
          editor.dispatchCommand(
            UNDO_COMMAND,
            undefined
          );
        }}
        color="secondary"
        variant="ghost"
      />
      <IconButton
        icon={<RedoIcon />}
        onClick={() => {
          editor.dispatchCommand(
            REDO_COMMAND,
            undefined
          );
        }}
        color="secondary"
        variant="ghost"
      />
      <Separator
        orientation="vertical"
        css={{
          background: "#64748B26",
          height: "16px !important",
        }}
      />
    </Flex>
  );
};

export default RedoUndoPlugin;
