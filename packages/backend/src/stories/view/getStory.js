const S = require('sanctuary');
const { indexBy } = require('ramda');
const { toSceneName } = require('../scenes');

function getStoryForView(getStory, toSceneContent) {
  return ({ storyId }) =>
    getStory(storyId).then(
      S.pipe([
        S.maybeToEither(`Can't find story [${storyId}]`),
        S.map(toStoryForView(toSceneContent)),
      ])
    );
}

function toStoryForView(toSceneContent) {
  return (story) => {
    const scenes = story.scenes.map((scene) => {
      const image = scene.image ? toSceneImage(scene.image) : null;
      const audio = scene.audio ? toSceneAudio(scene.audio) : null;

      return S.map(({ passages }) => ({
        id: scene.id,
        name: toSceneName(scene),
        title: scene.title,
        image,
        audio,
        isOpeningScene: scene.isOpeningScene,
        passages,
      }))(toSceneContent(scene.content));
    });

    return {
      id: story.id,
      title: story.title,
      scenes: indexBy(({ name }) => name, S.rights(scenes)),
    };
  };
}

function toSceneImage({ url, thumbnailUrl }) {
  return {
    url,
    thumbnailUrl,
  };
}

function toSceneAudio({ url }) {
  return {
    url,
  };
}

module.exports = {
  getStoryForView,
};
