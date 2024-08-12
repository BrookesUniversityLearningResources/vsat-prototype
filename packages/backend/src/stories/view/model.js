const { indexBy, pipe, is, prop } = require('ramda');

function toModel(sceneId, passageId) {
  return (story) => {
    return {
      title: story.title,
      scenes: indexScenesByName(
        Object.keys(story.scenes).map((sceneId) => {
          const scene = story.scenes[sceneId];
          return {
            name: scene.name,
            image: scene.image,
            audio: scene.audio,
            title: scene.title,
            passages: pipe(
              normalizePassages,
              indexPassagesByName
            )(scene.passages.filter(is(Object))),
            initialPassage: initialPassage(scene, passageId).header.name,
          };
        })
      ),
      initialScene: initialScene(story.scenes, sceneId).name,
    };
  };
}

module.exports = {
  toModel,
};

function normalizePassages(passages) {
  return passages.map(normalizePassage);
}

function normalizePassage(passage) {
  return {
    header: passage.header,
    content: passage.content
      .filter(isNodeOfType('text'))
      .map(prop('text'))
      .join('\n\n'),
    links: passage.content.filter(isNodeOfType('link')).map(toLink),
  };
}

function firstPassage(scene) {
  return scene.passages[0];
}

function firstScene(scenes) {
  return scenes[0];
}

function indexPassagesByName(passages) {
  return indexBy(({ header }) => header.name, passages);
}

function indexScenesByName(scenes) {
  return indexBy(({ name }) => name, scenes);
}

function initialPassage(scene, passageId) {
  if (passageId) {
    const passage = scene.passages.find(
      (passage) => passage.header.name === passageId
    );
    return passage || firstPassage(scene);
  }
  return firstPassage(scene);
}

function openingScene(scenes) {
  return scenes.find((scene) => scene.isOpeningScene);
}

function initialScene(scenesMap, sceneId) {
  const scenes = Object.values(scenesMap);
  if (sceneId) {
    const scene = scenes.find((scene) => scene.id === sceneId);
    return scene || openingScene(scenes) || firstPassage(scenes);
  }
  return openingScene(scenes) || firstScene(scenes);
}

function isNodeOfType(type) {
  return (node) => is(Object, node) && node.type === type;
}

function toLink({ text, target }) {
  return {
    text,
    target,
  };
}
