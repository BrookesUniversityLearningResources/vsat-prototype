import React from 'react';
import './Scene.css';
import SceneImage from './SceneImage/SceneImage';
import SceneAudio from './SceneAudio/SceneAudio';
import SceneFiction from './SceneFiction/SceneFiction';
import SceneTitle from './SceneTitle';
import { Button, Divider } from 'semantic-ui-react';

export default function Scene({
  scene,
  saveFiction,
  saveTitle,
  saveImage,
  saveAudio,
  removeScene,
  removeImage,
  removeAudio,
}) {
  const onRemoveImage = () =>
    removeImage({ sceneId: scene.id, imageId: scene.image?.id });

  const onRemoveAudio = () =>
    removeAudio({ sceneId: scene.id, audioId: scene.audio?.id });

  const onRemoveScene = () => removeScene({ sceneId: scene.id });

  return (
    <div className="scene">
      <SceneTitle scene={scene} save={saveTitle} />

      <div className="main">
        <div className="content">
          <SceneFiction scene={scene} save={saveFiction}>
            <Button icon="delete" onClick={onRemoveScene} />
          </SceneFiction>
        </div>

        <div className="sidebar">
          <SceneImage scene={scene} save={saveImage} remove={onRemoveImage} />
          <Divider />
          <SceneAudio scene={scene} save={saveAudio} remove={onRemoveAudio} />
        </div>
      </div>
    </div>
  );
}
