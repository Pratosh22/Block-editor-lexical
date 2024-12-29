import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const AutoFocusPlugin = () => {
  const [editor] =
    useLexicalComposerContext();

  useEffect(() => {
    setTimeout(() => {
      editor.focus();
    }, 100);
  }, [editor.focus]);

  useEffect(() => {
    const handleKeyDown = () => {
      // Focus editor on any keypress
      editor.focus();
    };
    document.addEventListener(
      "keydown",
      handleKeyDown
    );
    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [editor]);

  return null;
};

export default AutoFocusPlugin;
