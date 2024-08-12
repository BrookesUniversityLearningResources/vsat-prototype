const { Authors, Stories } = require('../../__fixtures__');

const { Just, either } = require('sanctuary');

const { getStoryForView } = require('../../../src/stories/view/getStory');

const {
  parseSceneContent,
} = require('../../../src/stories/format/parseSceneContent');

/**
 * @group unit
 * @group view
 */
describe('getStoryForView', () => {
  const storyId = Stories.TheNameOfTheRose.id;

  const getStory = getStoryForView(getStoryStub, parseSceneContent());

  test(
    'with no explicit scene ID yields the scene' +
      ' explicitly tagged as the opening scene',
    async () => {
      const assertStory = (story) => {
        return expect(story).toMatchObject({
          id: storyId,
          title: 'The Name Of The Rose',
          scenes: {
            introduction: {
              title: 'Introduction',
              image: {
                url: 'https://images.com/10.jpg',
                thumbnailUrl: 'https://images.com/thumbnail/10.jpg',
              },
              passages: [
                {
                  header: {
                    text: 'Introduction',
                    name: 'introduction',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'I was handed a book',
                    },
                  ],
                },
              ],
            },
            'the-abbey': {
              title: 'The Abbey',
              image: {
                url: 'https://images.com/11.jpg',
                thumbnailUrl: 'https://images.com/thumbnail/11.jpg',
              },
              passages: [
                {
                  header: {
                    text: 'The Abbey',
                    name: 'the-abbey',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'The abbey loomed in the distance',
                    },
                  ],
                },
              ],
            },
          },
        });
      };

      const story = await getStory({ storyId });

      either(failOnError)(assertStory)(story);
    }
  );
});

function getStoryStub(storyId) {
  return Promise.resolve(
    Just({
      id: storyId,
      authors: [Authors.UmbertoEco],
      title: 'The Name Of The Rose',
      scenes: [
        {
          id: 1,
          storyId: storyId,
          title: 'Introduction',
          content: `# Introduction

I was handed a book
`,
          image: {
            id: 10,
            url: 'https://images.com/10.jpg',
            thumbnailUrl: 'https://images.com/thumbnail/10.jpg',
          },
        },
        {
          id: 2,
          storyId: storyId,
          title: 'The Abbey',
          content: `# The Abbey

The abbey loomed in the distance
`,
          image: {
            id: 11,
            url: 'https://images.com/11.jpg',
            thumbnailUrl: 'https://images.com/thumbnail/11.jpg',
          },
          isOpeningScene: true,
        },
      ],
    })
  );
}

function failOnError(err) {
  throw err;
}
