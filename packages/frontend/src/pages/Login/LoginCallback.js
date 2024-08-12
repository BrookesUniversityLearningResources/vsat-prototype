import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Icon, Message } from 'semantic-ui-react';
import { setCurrentAuthor } from '../../store/authors';
import { authenticateWithServer, magic } from '../../user';
import './LoginCallback.css';

function LoginCallback() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const finishEmailRedirectLogin = () => {
    const magicCredential = new URLSearchParams(location.search).get(
      'magic_credential'
    );

    if (magicCredential) {
      magic.auth
        .loginWithCredential()
        .then(authenticateWithServer)
        .then((user) => dispatch(setCurrentAuthor(user)))
        .then(() => navigate(`/author/stories`))
        .catch(() => navigate('/'));
    }
  };

  useEffect(finishEmailRedirectLogin, [location.search]);

  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      className="page page-login-callback"
    >
      <Grid.Column>
        <Message icon color="teal">
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header as="h2">
              {t('page.login-callback.heading')}
            </Message.Header>
            {t('page.login-callback.message')}
          </Message.Content>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

export default LoginCallback;
