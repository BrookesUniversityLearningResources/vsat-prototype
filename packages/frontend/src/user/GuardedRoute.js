import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentAuthor } from '../store/authors';

const GuardedRoute = ({children}) => {
  const author = useSelector(selectCurrentAuthor);

  if (author) {
    return children;
  } else {
    return <Navigate to="/" />
  }
};

export default GuardedRoute;
