import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NotFoundPage({ location }) {
  const { t } = useTranslation();
  return (
    <div className="page page-notFound">
      <h1>{t('page.notFound.heading')}</h1>
      <p>
        <Trans t={t} i18nKey="page.notFound.text">
          <code>{{ path: location.pathname }}</code>
        </Trans>
      </p>
      <ul>
        <li>
          <Link to="/">{t('linkTo.homePage.text')}</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
