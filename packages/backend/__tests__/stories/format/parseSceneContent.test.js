const fs = require('fs');
const path = require('path');
const { either } = require('sanctuary');
const {
  parseSceneContent,
} = require('../../../src/stories/format/parseSceneContent');

/**
 * @group unit
 * @group grammar
 */
describe('parse scene content', () => {
  const failOnError = (err) => {
    throw err;
  };

  const expectedSacklerContent = Object.freeze({
    passages: Object.freeze([
      {
        header: {
          text: 'Introduction: The Opening!',
          name: 'introduction-the-opening',
        },
        content: [
          {
            type: 'text',
            text: 'Mark entered the Sackler.',
          },
          {
            type: 'text',
            text: 'To his right are shelves of books.',
          },
          {
            type: 'text',
            text: 'To his left he sees Lucy, his colleague.',
          },
          {
            type: 'link',
            text: "Mark's ::eye:: is caught by a book",
            target: 'thebookshelves',
          },
          {
            type: 'link',
            text: 'Chat with Lucy',
            target: 'the-erudite-colleague',
          },
        ],
      },
      {
        header: {
          text: "The Book's Story",
          name: 'thebookshelves',
        },
        content: [
          {
            type: 'text',
            text: 'There are many valuable books to borrow.',
          },
        ],
      },
      {
        header: {
          text: 'The Erudite Colleague',
          name: 'the-erudite-colleague',
        },
        content: [
          {
            type: 'text',
            text: "Lucy's knowledge of Akkadian is peerless.",
          },
        ],
      },
    ]),
  });

  describe('sunny day', () => {
    test('Mark in the Sackler', () => {
      const content = loadSceneContent('mark-sackler');

      const assertSceneContent = (sceneContent) =>
        expect(sceneContent).toMatchObject(expectedSacklerContent);

      either(failOnError)(assertSceneContent)(parseSceneContent(content));
    });

    test('Mark in the Sackler but with tons of superfluous whitespace', () => {
      const content = loadSceneContent('whitespace-galore');

      const assertSceneContent = (sceneContent) =>
        expect(sceneContent).toMatchObject(expectedSacklerContent);

      either(failOnError)(assertSceneContent)(parseSceneContent(content));
    });
  });

  describe('rainy day', () => {
    test('content must not start with a paragraph', () => {
      const content = loadSceneContent('starts-with-paragraph');

      const failOnSuccessfulParse = () => {
        throw new Error(
          "A passage that doesn't start with" +
            ' a header must not be parsed successfully'
        );
      };

      const isSyntaxError = (err) =>
        expect(err.message).toMatch(
          /You must create a passage before adding a paragraph/
        );

      either(isSyntaxError)(failOnSuccessfulParse)(parseSceneContent(content));
    });

    test('content must not start with an exit', () => {
      const content = loadSceneContent('starts-with-exit');

      const failOnSuccessfulParse = () => {
        throw new Error(
          "A passage that doesn't start with" +
            ' a header must not be parsed successfully'
        );
      };

      const isSyntaxError = (err) =>
        expect(err.message).toMatch(
          /You must create a passage before adding an exit/
        );

      either(isSyntaxError)(failOnSuccessfulParse)(parseSceneContent(content));
    });
  });
});

function loadSceneContent(name) {
  return fs
    .readFileSync(
      path.join(__dirname, '..', '..', `__fixtures__/scenes/${name}.md`)
    )
    .toString('utf8');
}
