const S = require('sanctuary');

function parseSceneContent(content) {
  const lines = content
    .trim()
    .split(`\n`)
    .map((line) => line.trim());

  const scene = { passages: [] };

  let passage = null;

  for (const line of lines) {
    const element = match(line);

    switch (element.kind) {
      case 'No Match':
      case 'Empty Line':
        break;

      case 'Anonymous Header': {
        if (passage !== null) {
          scene.passages.push(passage);
        }

        const text = element.matches[1].trim();
        passage = newPassage(
          text,
          text.toLowerCase().replace(/[^a-z0-9 ]+/gi, '')
        );

        break;
      }

      case 'Named Header': {
        if (passage !== null) {
          scene.passages.push(passage);
        }

        passage = newPassage(
          element.matches[1].trim(),
          element.matches[2].trim().toLowerCase()
        );

        break;
      }

      case 'Exit':
        if (passage === null) {
          return S.Left(
            new Error('You must create a passage before adding an exit')
          );
        }

        passage.content.push({
          type: 'link',
          text: element.matches[1].trim(),
          target: element.matches[2].trim().toLowerCase().replace(/\s+/g, '-'),
        });
        break;

      case 'Paragraph':
        if (passage === null) {
          return S.Left(
            new Error('You must create a passage before adding a paragraph')
          );
        }

        passage.content.push({
          type: 'text',
          text: element.matches[1].trim(),
        });
        break;

      default:
        break;
    }
  }

  if (passage !== null) {
    scene.passages.push(passage);
  }

  return S.Right(scene);
}

const contentElements = Object.freeze([
  {
    kind: 'Empty Line',
    pattern: /^$/,
  },
  {
    kind: 'Named Header',
    pattern: /^#(.+)\|\s*([a-z-]+)/i,
  },
  {
    kind: 'Anonymous Header',
    pattern: /^#(.+)/i,
  },
  {
    kind: 'Exit',
    pattern: /^\s*\[(.+)]\s*\(([a-zA-Z \-]+)\)/i,
  },
  {
    kind: 'Paragraph',
    pattern: /(.+)/,
  },
]);

function match(text) {
  for (const element of contentElements) {
    const matches = element.pattern.exec(text);
    if (matches) {
      return { kind: element.kind, matches };
    }
  }

  return {
    kind: 'No Match',
  };
}

function newPassage(text, name) {
  return {
    header: {
      text,
      name: name.replace(/\s+/g, '-'),
    },
    content: [],
  };
}

module.exports = {
  parseSceneContent,
};
