import React, { useEffect } from 'react';
import './SceneAudio.css';
import { Button, Header } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';

import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import FileInput from '@uppy/react/lib/FileInput';

export default function SceneAudio({ scene, save, remove }) {
  const uppy = new Uppy({
    id: `scene-audio-${scene.id}`,
    restrictions: {
      allowedFileTypes: ['.mp3', '.mp4'],
      maxNumberOfFiles: 1,
      maxFileSize: 15_728_640 /* in bytes, so 15MB */,
    },
    autoProceed: true,
  })
    .use(XHRUpload, {
      formData: true,
      fieldName: 'scene-audio',
      endpoint: `/api/story/${scene.storyId}/scene/${scene.id}/audio`,
    })
    .on('file-added', (file) => {
      uppy.setFileMeta(file.id, {
        id: scene.audio?.id,
      });
    })
    .on('complete', (result) => {
      save(scene, result.successful[0].uploadURL);
    });

  useEffect(() => () => uppy.close(), [uppy]);

  return (
    <div className="scene-audio">
      {scene.audio ? (
        <SceneAudioPresent url={scene.audio.url} remove={remove} />
      ) : (
        <NoSceneAudio uppy={uppy} />
      )}
    </div>
  );
}

function NoSceneAudio({ uppy }) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header color="grey" textAlign="left" inverted>
        <Header.Content>
          {t('page.story.edit.sceneAudio.upload')}
        </Header.Content>
      </Header>
      <FileInput uppy={uppy} pretty={false} />
    </React.Fragment>
  );
}

function SceneAudioPresent({ url, remove }) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <audio controls={true} src={url}>
        {t('sceneAudio.unsupported')}
      </audio>
      <Button
        icon="delete"
        content={t('sceneAudio.remove')}
        labelPosition="left"
        negative={true}
        onClick={remove}
      />
    </React.Fragment>
  );
}
