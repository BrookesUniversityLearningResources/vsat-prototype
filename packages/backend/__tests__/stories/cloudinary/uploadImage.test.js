const fs = require('fs');
const path = require('path');
const { uploadImageViaCloudinary } = require('../../../src/stories/scenes');

/**
 * @group integration
 * @group cloudinary
 */
describe.skip('uploadImageViaCloudinary', () => {
  const uploadImage = uploadImageViaCloudinary();

  test('existing image', async () => {
    const imageBuffer = fs.readFileSync(
      path.join(__dirname, '..', '..', '__fixtures__/images/moss.png')
    );

    const { url, thumbnailUrl } = await uploadImage('moss', imageBuffer);

    expect(url).toMatch(/moss/);
    expect(thumbnailUrl).toMatch(/moss/);
  });
});
