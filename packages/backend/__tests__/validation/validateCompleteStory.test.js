const deepFreeze = require('deep-freeze');

const { Authors } = require('../__fixtures__');
const { validateCompleteStory } = require('../../src/stories/validation/story');

function completeStory() {
  const storyId = 18;
  return {
    id: storyId,
    authors: [Authors.UmbertoEco, Authors.AdsoOfMelk],
    title: 'The Name Of The Rose',
    scenes: [
      {
        id: 1,
        storyId: storyId,
        title: 'Introduction',
        content: '# Introduction\n\nI was handed a book\n',
        isOpeningScene: true,
        image: {
          id: 1,
          url: 's3://images/i-0001.png',
          thumbnailUrl: 's3://images/i-0001-thumb.png',
        },
      },
      {
        id: 2,
        storyId: storyId,
        title: 'The Abbey',
        content: '# The Abbey\n\nThe abbey loomed in the distance\n',
        image: {
          id: 2,
          url: 's3://images/i-0002.png',
          thumbnailUrl: 's3://images/i-0002-thumb.png',
        },
      },
    ],
  };
}

/**
 * @group unit
 */
describe('validateCompleteStory', () => {
  test('a complete story is valid', () => {
    const story = completeStory();

    const validate = validateCompleteStory(({ story }) => story);

    expect(() => validate(deepFreeze({ story }))).not.toThrow();
  });

  test('a story with no scene images is valid', () => {
    const story = completeStory();
    story.scenes.forEach((scene) => delete scene.image);

    const validate = validateCompleteStory(({ story }) => story);

    expect(() => validate(deepFreeze({ story }))).not.toThrow();
  });

  test('a story with negative scene IDs is invalid', () => {
    const story = completeStory();
    story.scenes.forEach((scene, index) => (scene.id = -index));

    const validate = validateCompleteStory(({ story }) => story);

    expect(() => validate(deepFreeze({ story }))).toThrow(/scenes.+id/);
  });
});
