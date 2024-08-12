import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment, Icon, Message } from 'semantic-ui-react';
import { selectCurrentAuthor, setCurrentAuthor } from '../../store/authors';
import { authenticateWithServer, magic } from '../../user';
import './LoginPage.css';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const author = useSelector(selectCurrentAuthor);

  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);

  useEffect(() => {
    author && navigate(`/author/stories`);
  }, [author, navigate]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true);
      setIsLoginPending(true);

      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
        showUI: false
      });

      const user = await authenticateWithServer(didToken);
      dispatch(setCurrentAuthor(user));
      navigate(`/author/stories`);
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setDisabled(false);
      setIsLoginPending(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    await handleLoginWithEmail(email);
  };

  if (isLoginPending) {
    return <LoginPending/>;
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" className="page page-login">
      <Grid.Column>
        <Header as="h2" color="teal" textAlign="center">
          {t('page.login.heading')}
        </Header>
        <Form size="large" onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              type="email"
              name="email"
              value={email}
              disabled={disabled}
              required
              iconPosition="left"
              placeholder={t('page.login.enterYourEmail')}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" color="teal" fluid size="large">
              {t('action.login.text')}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default LoginPage;

function LoginPending() {
  const { t } = useTranslation();

  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      className="page page-login-pending"
    >
      <Grid.Column>
        <Message icon color="teal">
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header as="h2">
              {t('page.login.pending.heading')}
            </Message.Header>
            {t('page.login.pending.message')}
          </Message.Content>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
