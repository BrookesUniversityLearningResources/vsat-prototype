import React, { useState } from 'react';
import './SceneTitle.css';
import { Button, Icon, Input } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';

export default function SceneTitle({ scene, save }) {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(scene.title);

  const startEditing = () => setEditing(true);

  const saveTitle = () => {
    setEditing(false);
    save({ sceneId: scene.id, title });
  };

  const handleChange = (e) => setTitle(e.target.value);

  const handleCancel = () => setEditing(false);

  const editView = () => {
    return (
      <Input
        name="title"
        defaultValue={scene.title}
        onChange={handleChange}
        size={'small'}
        action
      >
        <input />
        <Button content={t('save')} onClick={saveTitle} primary />
        <Button content={t('cancel')} onClick={handleCancel} />
      </Input>
    );
  };

  const defaultView = () => {
    return (
      <h2 className="inverted">
        {scene.title}
        <Icon name="edit" onClick={startEditing} size="small" color="grey" />
      </h2>
    );
  };

  return (
    <div className="sceneTitle">{editing ? editView() : defaultView()}</div>
  );
}
