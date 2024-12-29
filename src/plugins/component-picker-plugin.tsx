/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createCodeNode } from "@lexical/code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode
} from "lexical";
import {
  useCallback,
  useState
} from "react";
import { JSX } from "react";
import { EditorLookupDropdownBase } from "@sparrowengg/twigs-react";

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (
    queryString: string
  ) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (
        queryString: string
      ) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords =
      options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut =
      options.keyboardShortcut;
    this.onSelect =
      options.onSelect.bind(this);
  }
}

function getDynamicOptions(
  editor: LexicalEditor,
  queryString: string
) {
  const options: Array<ComponentPickerOption> =
    [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(
    /^([1-9]\d?)(?:x([1-9]\d?)?)?$/
  );

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(
            `${rows}x${columns} Table`,
            {
              icon: (
                <i className="icon table" />
              ),
              keywords: ["table"],
              onSelect: () =>
                editor.dispatchCommand(
                  INSERT_TABLE_COMMAND,
                  { columns, rows }
                )
            }
          )
      )
    );
  }

  return options;
}

// type ShowModal = ReturnType<
//   typeof useModal
// >[1];

function getBaseOptions(
  editor: LexicalEditor
  // showModal: ShowModal
) {
  return [
    new ComponentPickerOption(
      "Paragraph",
      {
        icon: (
          <i className="icon paragraph" />
        ),
        keywords: [
          "normal",
          "paragraph",
          "p",
          "text"
        ],
        onSelect: () =>
          editor.update(() => {
            const selection =
              $getSelection();
            if (
              $isRangeSelection(
                selection
              )
            ) {
              $setBlocksType(
                selection,
                () =>
                  $createParagraphNode()
              );
            }
          })
      }
    ),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(
          `Heading ${n}`,
          {
            icon: (
              <i
                className={`icon h${n}`}
              />
            ),
            keywords: [
              "heading",
              "header",
              `h${n}`
            ],
            onSelect: () =>
              editor.update(() => {
                const selection =
                  $getSelection();
                if (
                  $isRangeSelection(
                    selection
                  )
                ) {
                  $setBlocksType(
                    selection,
                    () =>
                      $createHeadingNode(
                        `h${n}`
                      )
                  );
                }
              })
          }
        )
    ),
    new ComponentPickerOption(
      "Numbered List",
      {
        icon: (
          <i className="icon number" />
        ),
        keywords: [
          "numbered list",
          "ordered list",
          "ol"
        ],
        onSelect: () =>
          editor.dispatchCommand(
            INSERT_ORDERED_LIST_COMMAND,
            undefined
          )
      }
    ),
    new ComponentPickerOption(
      "Bulleted List",
      {
        icon: (
          <i className="icon bullet" />
        ),
        keywords: [
          "bulleted list",
          "unordered list",
          "ul"
        ],
        onSelect: () =>
          editor.dispatchCommand(
            INSERT_UNORDERED_LIST_COMMAND,
            undefined
          )
      }
    ),
    new ComponentPickerOption("Code", {
      icon: <i className="icon code" />,
      keywords: [
        "javascript",
        "python",
        "js",
        "codeblock"
      ],
      onSelect: () =>
        editor.update(() => {
          const selection =
            $getSelection();

          if (
            $isRangeSelection(selection)
          ) {
            if (
              selection.isCollapsed()
            ) {
              $setBlocksType(
                selection,
                () => $createCodeNode()
              );
            } else {
              // Will this ever happen?
              const textContent =
                selection.getTextContent();
              const codeNode =
                $createCodeNode();
              selection.insertNodes([
                codeNode
              ]);
              selection.insertRawText(
                textContent
              );
            }
          }
        })
    }),
    new ComponentPickerOption(
      "Divider",
      {
        icon: (
          <i className="icon horizontal-rule" />
        ),
        keywords: [
          "horizontal rule",
          "divider",
          "hr"
        ],
        onSelect: () =>
          editor.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined
          )
      }
    )
    // new ComponentPickerOption("GIF", {
    //   icon: <i className="icon gif" />,
    //   keywords: [
    //     "gif",
    //     "animate",
    //     "image",
    //     "file"
    //   ],
    //   onSelect: () =>
    //     editor.dispatchCommand(
    //       INSERT_IMAGE_COMMAND,
    //       {
    //         altText:
    //           "Cat typing on a laptop",
    //         src: catTypingGif
    //       }
    //     )
    // }),
    // new ComponentPickerOption("Image", {
    //   icon: (
    //     <i className="icon image" />
    //   ),
    //   keywords: [
    //     "image",
    //     "photo",
    //     "picture",
    //     "file"
    //   ],
    //   onSelect: () =>
    //     showModal(
    //       "Insert Image",
    //       (onClose) => (
    //         <InsertImageDialog
    //           activeEditor={editor}
    //           onClose={onClose}
    //         />
    //       )
    //     )
    // }),
  ];
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] =
    useLexicalComposerContext();
  const checkForTriggerMatch =
    useBasicTypeaheadTriggerMatch("/", {
      minLength: 0
    });
  // Convert options to TypeaheadMenuData format
  const getResults = useCallback(
    (query: string | null) => {
      const baseOptions =
        getBaseOptions(editor);
      const dynamicOptions = query
        ? getDynamicOptions(
            editor,
            query
          )
        : [];

      if (!query) {
        return baseOptions.map(
          (option) => ({
            value: option.title,
            label: option.title,
            icon: option.icon,
            onSelect: option.onSelect
          })
        );
      }

      const regex = new RegExp(
        query,
        "i"
      );
      const filteredOptions = [
        ...dynamicOptions,
        ...baseOptions
      ].filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some(
            (keyword) =>
              regex.test(keyword)
          )
      );

      return filteredOptions.map(
        (option) => ({
          value: option.title,
          label: option.title,
          icon: option.icon,
          onSelect: option.onSelect
        })
      );
    },
    [editor]
  );

  // Custom render function for menu items
  const renderMenuItemContent =
    useCallback(({ option }: any) => {
      const { icon, label } =
        option.data;
      return (
        <>
          {icon}
          <span>{label}</span>
        </>
      );
    }, []);

  // Handle option selection
  const onMenuItemSelect = useCallback(
    (
      selectedOption: any,
      closeMenu?: () => void
    ) => {
      if (
        selectedOption.data.onSelect
      ) {
        editor.update(() => {
          // Remove the slash and any query text
          const selection =
            $getSelection();
          if (
            $isRangeSelection(selection)
          ) {
            const nodes =
              selection.getNodes();
            const firstNode = nodes[0];
            if (
              firstNode instanceof
              TextNode
            ) {
              const textContent =
                firstNode.getTextContent();
              const slashIndex =
                textContent.lastIndexOf(
                  "/"
                );
              if (slashIndex !== -1) {
                firstNode.setTextContent(
                  textContent.slice(
                    0,
                    slashIndex
                  )
                );
              }
            }
          }

          // Execute the selected option's action
          selectedOption.data.onSelect(
            ""
          );
        });

        closeMenu?.();
        return true;
      }
      return false;
    },
    [editor]
  );

  return (
    <EditorLookupDropdownBase
      triggerFunction={
        checkForTriggerMatch
      }
      getResults={getResults}
      renderMenuItemContent={
        renderMenuItemContent
      }
      onMenuItemSelect={
        onMenuItemSelect
      }
      suggestionsListLength={20}
      css={{
        minWidth: "180px"
      }}
    />
  );
}
