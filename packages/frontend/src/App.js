import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EditStoryPage from './pages/story/edit/EditStoryPage';
import StoriesByAuthorPage from './pages/story/StoriesByAuthorPage';
import NotFoundPage from './pages/NotFoundPage';
import { LoginPage, LoginCallback } from './pages/Login';
import GuardedRoute from './user/GuardedRoute';

export default () => (
  <Router>
    <Routes>
      <Route path="/author/stories" element={<GuardedRoute><StoriesByAuthorPage/></GuardedRoute>}/>
      <Route path="/story/:storyId/edit" element={<GuardedRoute><EditStoryPage/></GuardedRoute>}/>

      <Route path="/callback" element={<LoginCallback/>}/>
      <Route path="/" element={<LoginPage/>}/>

      <Route element={<NotFoundPage/>}/>
    </Routes>
  </Router>
);
