import React, { useEffect, useState } from 'react';
import './EditStoryPage.css';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchStory,
  selectStory,
  removeStory,
  removeImage,
  removeAudio,
  saveStoryTitle,
  saveSceneTitle,
  saveSceneContent,
  createNewSceneInStory,
  removeScene,
  unpublishStory,
  publishStory,
} from '../../../store/stories';
import Scene from './Scene/Scene';
import {
  Divider,
  Button,
  Icon,
  Sidebar,
  Segment,
  Ref,
} from 'semantic-ui-react';
import { StoryTitle, PlaceholderTitle } from './StoryTitle';
import ShowTheMessage from './ShowTheMessage';

function EditStoryPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { storyId } = useParams();

  useEffect(() => {
    dispatch(
      fetchStory(storyId, (story) =>
        setButtonText(
          story.published
            ? t('page.story.edit.unpublishStory')
            : t('page.story.edit.publishStory')
        )
      )
    );
  }, [storyId, dispatch, t]);

  const story = useSelector(selectStory(storyId));

  const saveFiction = ({ sceneId, fiction }) =>
    dispatch(
      saveSceneContent({
        storyId,
        sceneId,
        content: fiction,
        onSuccess: () => {
          setMessage(t('page.story.edit.message.saveScene'));
        },
      })
    );

  const saveTitleOfScene = ({ sceneId, title }) =>
    dispatch(saveSceneTitle({ storyId, sceneId, title }));

  const saveTitleOfStory = ({ storyId, title }) =>
    dispatch(saveStoryTitle({ storyId, title }));

  const saveImage = (scene) => {
    // to "save" we just re-fetch the story which will have the new image
    dispatch(fetchStory(scene.storyId));
  };

  const saveAudio = (scene) => {
    // to "save" we just re-fetch the story which will have the new audio
    dispatch(fetchStory(scene.storyId));
  };

  const removeImageFromScene = ({ sceneId, imageId }) => {
    dispatch(removeImage({ storyId, sceneId, imageId }));
  };

  const removeAudioFromScene = ({ sceneId, audioId }) => {
    dispatch(removeAudio({ storyId, sceneId, audioId }));
  };

  const removeSceneFromStory = ({ sceneId }) => {
    dispatch(
      removeScene({
        storyId,
        sceneId,
        onSuccess: () => {
          setMessage(t('page.story.edit.message.removeScene'));
        },
      })
    );
  };

  const onRemoveStory = () => {
    dispatch(removeStory({ storyId }));
    navigate(`/author/stories`);
  };

  const [getMessage, setMessage] = useState('');
  const dismissMessage = () => setMessage(null);
  const [getButtonText, setButtonText] = useState(
    story?.published
      ? t('page.story.edit.unpublishStory')
      : t('page.story.edit.publishStory')
  );

  const onPublishToggle = () => {
    if (story.published) {
      dispatch(
        unpublishStory({
          storyId,
          onSuccess: () => {
            setButtonText(t('page.story.edit.publishStory'));
            setMessage(t('page.story.edit.message.unpublishStory'));
          },
        })
      );
    } else {
      dispatch(
        publishStory({
          storyId,
          onSuccess: () => {
            setButtonText(t('page.story.edit.unpublishStory'));
            setMessage(t('page.story.edit.message.publishStory'));
          },
        })
      );
    }
  };

  const createNewScene = () =>
    dispatch(
      createNewSceneInStory({
        storyId,
        onSuccess: () => {
          setMessage(t('page.story.edit.message.addScene'));
        },
      })
    );

  const sceneComponents = (story?.scenes || []).map((scene) => (
    <React.Fragment key={scene.id}>
      <Scene
        scene={scene}
        saveTitle={saveTitleOfScene}
        saveFiction={saveFiction}
        saveImage={saveImage}
        saveAudio={saveAudio}
        removeScene={removeSceneFromStory}
        removeImage={removeImageFromScene}
        removeAudio={removeAudioFromScene}
      />
      <Divider />
    </React.Fragment>
  ));

  const [isHelpVisible, setHelpVisible] = useState(true);

  const segmentRef = React.useRef();

  return (
    <div className="page page-editStory">
      <Sidebar.Pusher>
        <Ref innerRef={segmentRef}>
          <Segment as="main">
            <div className="backToStories">
              <Icon name="angle left" />
              <Link to={`/author/stories`}>{t('backTo.yourStories.text')}</Link>
            </div>
            <div className="story-header">
              {story ? (
                <StoryTitle story={story} saveTitle={saveTitleOfStory} />
              ) : (
                <PlaceholderTitle />
              )}
              <Button.Group>
                <Button
                  content={t('page.story.edit.addScene')}
                  icon="plus"
                  positive={true}
                  onClick={createNewScene}
                />
                <Button primary>
                  <Icon name="eye" />
                  <a
                    href={`/stories/${storyId}`}
                    className="view"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('page.story.view.linkTo')}
                  </a>
                </Button>
                <Button
                  icon="book"
                  onClick={onPublishToggle}
                  content={getButtonText}
                />
                <Button
                  icon="delete"
                  content={t('page.story.edit.removeStory')}
                  negative={true}
                  labelPosition="left"
                  onClick={() => {
                    if (window.confirm(t('page.story.confirmRemoveStory'))) {
                      onRemoveStory();
                    }
                  }}
                />
                <Button
                  toggle
                  color="grey"
                  content={t('page.story.edit.help.action.label')}
                  floated="right"
                  active={isHelpVisible}
                  onClick={() => setHelpVisible(!isHelpVisible)}
                />
              </Button.Group>
            </div>
            <ShowTheMessage message={getMessage} onDismiss={dismissMessage} />{' '}
            <Divider />
            {sceneComponents}
          </Segment>
        </Ref>
        <Sidebar
          as="aside"
          className="help"
          animation="overlay"
          direction="right"
          target={segmentRef}
          visible={isHelpVisible}
        >
          <h2>{t('page.story.edit.help.title')}</h2>
          <p>
            {t('a')} <strong>{t('story')}</strong> {t('has one or more')}{' '}
            <strong>{t('scenes')}</strong>.
          </p>
          <p>
            {t('a')} <strong>{t('scene')}</strong> {t('has')}:
          </p>
          <ul>
            <li>
              {t('a')} 360° <strong>{t('image')}</strong>.
            </li>
            <li>
              {t('Interactive fiction composed of one or more')}{' '}
              <strong>{t('passages')}</strong>.
            </li>
            <li>
              A <strong>title</strong>. Scenes can be linked by using the scene
              title as an exit link in a passage.
            </li>
          </ul>
          <p>
            {t('a')} <strong>{t('passage')}</strong> {t('has')}:
          </p>
          <ul>
            <li>
              {t('a')} <strong>{t('header')}</strong>:{' '}
              <code>{t('Explore the market')}</code>
            </li>
            <li>{t('Some descriptive text. Write short, punchy passages')}.</li>
            <li>
              {t('Zero or more')} <strong>{t('exits')}</strong>.
            </li>
          </ul>
          <p>
            {t('a')} <strong>{t('exit')}</strong>{' '}
            {t('is a link connecting passages')}.
          </p>
          <pre>
            [{t('Hop on the bus')}]({t('take-the-bus')})
          </pre>
          <ul>
            <li>
              A name that will show in your story as an option for the person
              experiencing it. It should be inside square brackets.{' '}
              <code>[Hop on the bus]</code>.
            </li>
            <li>
              A link that connects the passages. It should be inside parentheses
              (round brackets). Spaces aren't allowed so replace them with
              hyphens if you need.
              <code>(take-the-bus)</code>
            </li>
          </ul>
        </Sidebar>
      </Sidebar.Pusher>
    </div>
  );
}

export default EditStoryPage;
