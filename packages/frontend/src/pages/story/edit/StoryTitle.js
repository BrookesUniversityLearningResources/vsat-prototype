import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from 'semantic-ui-react';
import './StoryTitle.css';

export const StoryTitle = function ({ story, saveTitle }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(story.title);

  const startEditing = () => {
    setEditing(true);
  };

  const onSaveTitle = () => {
    setEditing(false);
    saveTitle({
      storyId: story.id,
      title: newTitle,
    });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewTitle(value);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const editView = () => {
    return (
      <div className="storyTitle">
        <Input
          name="title"
          defaultValue={story.title}
          onChange={handleChange}
          action
        >
          <input />
          <Button content={t('save')} onClick={onSaveTitle} primary />
          <Button content={t('cancel')} onClick={handleCancel} />
        </Input>
      </div>
    );
  };

  const defaultView = () => {
    return (
      <h1 title={`${story.title} | ${story.id}`} className="storyTitle">
        {t('page.story.edit.heading', {
          title: story.title,
          author: story.author,
        })}
        <Icon name="edit" onClick={startEditing} size="small" color="grey" />
      </h1>
    );
  };

  return editing ? editView() : defaultView();
};

export function PlaceholderTitle() {
  return (
    <div className="storyTitle">
      <h1>&hellip;</h1>
    </div>
  );
}
