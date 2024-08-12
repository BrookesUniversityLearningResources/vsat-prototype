const fs = require('fs');
const path = require('path');
const { uploadAudioViaCloudinary } = require('../../../src/stories/scenes');

/**
 * @group integration
 * @group cloudinary
 */
describe.skip('uploadAudioViaCloudinary', () => {
  const uploadAudio = uploadAudioViaCloudinary();

  test('existing audio (MP3)', async () => {
    const audioBuffer = fs.readFileSync(
      path.join(__dirname, '..', '..', '__fixtures__/audios/moss.mp3')
    );

    const { url } = await uploadAudio('moss', audioBuffer);

    expect(url).toMatch(/moss/);
  });
});
