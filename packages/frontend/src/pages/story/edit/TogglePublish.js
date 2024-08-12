import React from 'react';
import { Radio } from 'semantic-ui-react';

const PublishToggle = () => (
  <button className="ui labeled icon olive button">
    <Radio toggle label="Publish story" />
  </button>
);

export default PublishToggle;
