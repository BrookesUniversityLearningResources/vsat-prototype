import React, { useMemo, useState } from 'react';
import './SceneFiction.css';
import { Button } from 'semantic-ui-react';
import { createEditor, Node } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

const serializeEditorState = (nodes) => {
  let fiction = nodes.map((n) => Node.string(n)).join('\n');
  if (!fiction.endsWith('\n')) {
    fiction = fiction + '\n';
  }
  return fiction;
};

export default function SceneFiction({ scene, save, children }) {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [editorState, setEditorState] = useState([
    {
      children: [{ text: scene.content }],
    },
  ]);

  const onFictionChange = (state) => {
    if (passageContentIsDeleted(state)) {
      // when all of the content has been deleted, if we *don't* move the editor
      // selection to the start of the empty content then Slate errors in some
      // browsers
      moveEditorSelectionToStart(editor);
    }

    setEditorState(state);
  };

  const undoChange = () => editor.undo();
  const redoChange = () => editor.redo();

  const saveFiction = () => {
    const fiction = serializeEditorState(editor.children);
    save({
      sceneId: scene.id,
      fiction,
    });
  };

  return (
    <div className="scene-fiction">
      <Slate editor={editor} value={editorState} onChange={onFictionChange}>
        <div className="menu">
          <Button.Group>
            <Button icon="save" onClick={saveFiction} />
            <Button icon="undo" onClick={undoChange} />
            <Button icon="redo" onClick={redoChange} />
            {children}
          </Button.Group>
        </div>

        <Editable />
      </Slate>
    </div>
  );
}

/**
 * Has the entire content of the passage been deleted?
 *
 * It's fairly common for an author to delete all of the content in the passage
 * they're working on:
 *
 * * they're editing a new passage and want to delete all of the boilerplate.
 * * they don't like what they've written and they just want a blank slate.
 *
 * The Slate `state` will look like this if the content has been deleted:
 *
 * ```
 * [
 *   {
 *     "children": [
 *       {
 *         "text": ""
 *       }
 *     ]
 *   }
 * ]
 * ```
 *
 * @param state the content of the passage; this is the Slate `state`.
 * @return {boolean} `true` iff the entire content of the passage has been deleted.
 * @see https://joshtronic.com/2020/04/13/error-cannot-resolve-a-dom-point-from-slate-point/
 */
function passageContentIsDeleted(state) {
  return (
    state.length === 1 &&
    state[0].children &&
    state[0].children.length === 1 &&
    state[0].children[0].text === ''
  );
}

function moveEditorSelectionToStart(editor) {
  const point = { path: [0, 0], offset: 0 };
  editor.selection = { anchor: point, focus: point };
}
