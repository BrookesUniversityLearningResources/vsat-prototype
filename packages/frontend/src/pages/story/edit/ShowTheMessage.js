import React from 'react';
import { Message } from 'semantic-ui-react';
export default function ShowTheMessage(props) {
  return (
    <Message
      style={{ display: props.message ? 'block' : 'none' }}
      positive
      size="mini"
      onDismiss={props.onDismiss}
    >
      <Message.Header content={props.message} />
    </Message>
  );
}
