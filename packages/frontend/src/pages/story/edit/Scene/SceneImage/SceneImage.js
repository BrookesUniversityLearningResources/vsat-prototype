import React, { useEffect } from 'react';
import './SceneImage.css';
import { Button } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';

import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Dashboard from '@uppy/react/lib/Dashboard';

export default function SceneImage({ scene, save, remove }) {
  const { t } = useTranslation();

  const uppy = new Uppy({
    id: `scene-image-${scene.id}`,
    restrictions: {
      maxNumberOfFiles: 1,
      maxFileSize: 15_728_640 /* in bytes, so 15MB */,
    },
    autoProceed: true,
  })
    .use(XHRUpload, {
      formData: true,
      fieldName: 'scene-image',
      endpoint: `/api/story/${scene.storyId}/scene/${scene.id}/image`,
    })
    .on('file-added', (file) => {
      uppy.setFileMeta(file.id, {
        id: scene.image?.id,
      });
    })
    .on('complete', (result) => {
      save(scene, result.successful[0].uploadURL);
    });

  useEffect(() => () => uppy.close(), [uppy]);

  let content;
  if (scene.image) {
    content = (
      <React.Fragment>
        {scene.image.thumbnailUrl ? (
          <img
            src={scene.image.thumbnailUrl}
            alt={t('page.story.edit.sceneImage.textAlt', {
              title: scene.title,
            })}
          />
        ) : null}
        <Button
          icon="delete"
          content={t('sceneImage.remove')}
          labelPosition="left"
          negative={true}
          onClick={remove}
        />
      </React.Fragment>
    );
  } else {
    content = (
      <Dashboard
        uppy={uppy}
        width={192}
        height={192}
        disableInformer={true}
        proudlyDisplayPoweredByUppy={false}
        locale={{
          strings: {
            browseFiles: t('page.story.edit.sceneImage.upload.1'),
            dropPasteFiles: t('page.story.edit.sceneImage.upload.0'),
          },
        }}
      />
    );
  }

  return <div className="scene-image">{content}</div>;
}
