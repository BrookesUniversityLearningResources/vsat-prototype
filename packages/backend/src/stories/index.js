function initialSceneContent() {
  return {
    title: 'My Scene',
    content: `# Passage Header

Write a short passage here.

[Walk into town](walk)
[Hop on the bus](take-the-bus)

# Strolling Into Town|walk

This is another passage.

# Take The Bus

And yet another passage.
`,
    isOpeningScene: false,
  };
}

function initialOpeningSceneContent() {
  return {
    ...initialSceneContent(),
    title: 'Opening Scene',
    isOpeningScene: true,
  };
}

module.exports = {
  initialSceneContent,
  initialOpeningSceneContent,
};
