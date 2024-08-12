import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { selectCurrentAuthor, setCurrentAuthor } from '../store/authors';
import { logoutUser } from './index';

const Logout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentAuthor = useSelector(selectCurrentAuthor);

  const logout = async () => {
    try {
      dispatch(setCurrentAuthor(null));
      await logoutUser();
    } finally {
      navigate('/');
    }
  };

  if (currentAuthor) {
    return (
      <Button
        onClick={logout}
        icon="plus"
        content={t('action.logout.text')}
        negative={true}
      />
    );
  } else {
    return null;
  }
};

export default Logout;
