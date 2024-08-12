import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { selectCurrentAuthor } from '../../store/authors';
import { createStory, getStoriesByAuthor, selectStoriesByAuthor } from '../../store/stories';
import Logout from '../../user/Logout';
import './StoriesByAuthorPage.css';

function StoriesByAuthorPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const author = useSelector(selectCurrentAuthor);
  const storiesByAuthor = useSelector(selectStoriesByAuthor);

  useEffect(() => {
    dispatch(getStoriesByAuthor(author.id));
  }, [dispatch, author.id]);

  let allStories = storiesByAuthor
    ? storiesByAuthor
    : {
        author: {
          name: '',
        },
        stories: [],
      };

  return (
    <main className="page page-stories by-author">
      <div className="header">
        <h2>
          {t('page.storiesByAuthor.heading', {
            author: allStories.author.name,
          })}
        </h2>
        <Button
          onClick={() => dispatch(createStory(author.id))}
          icon="plus"
          content={t('action.newStory.text')}
          positive={true}
        />
        <Logout />
      </div>
      <div className="publishedStories">
        <h3>{t('page.stories.story.unpublishedStories')}</h3>
        <p>{t('page.stories.story.unpublishedStories.intro')}</p>
        <ul>{unpublishedStories(t, allStories)}</ul>
      </div>
      <div className="unpublishedStories">
        <h3>{t('page.stories.story.publishedStories')}</h3>
        <p>{t('page.stories.story.publishedStories.intro')}</p>
        <ul>{publishedStories(t, allStories)}</ul>
      </div>
    </main>
  );
}

function unpublishedStories(t, allStories) {
  return allStories.stories
    .filter((story) => !story.published)
    .map((story) => (
      <li key={`story-${story.id}`} className={`story story-${story.id}`}>
        <Link to={`/story/${story.id}/edit`} className="edit">
          <span className="title">{story.title}</span>&nbsp;
          <Icon name="edit" size={'small'} />
        </Link>
      </li>
    ));
}
function publishedStories(t, allStories) {
  return allStories.stories
    .filter((story) => story.published)
    .map((story) => (
      <li key={`story-${story.id}`} className={`story story-${story.id}`}>
        <Link to={`/story/${story.id}/edit`} className="edit">
          <span className="title">{story.title}</span>&nbsp;
          <Icon name="edit" size={'small'} />
        </Link>{' '}
        &nbsp;
        <a href={`/stories/${story.id}`} className="view" title={story.title}>
          <Icon name="eye" size={'small'} />
          &nbsp; &nbsp;{t('page.stories.story.view')}
        </a>
      </li>
    ));
}

export default StoriesByAuthorPage;
