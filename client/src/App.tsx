import Community from '@pages/Community';
import DM from '@pages/DM';
import DMRoom from '@pages/DMRoom';
import Followers from '@pages/Followers';
import Followings from '@pages/Followings';
import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import UserSearch from '@pages/UserSearch';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />}>
      <Route path="dms" element={<DM />}>
        <Route path="followings" element={<Followings />} />
        <Route path="followers" element={<Followers />} />
        <Route path="user-search" element={<UserSearch />} />
        <Route path=":roomId" element={<DMRoom />} />
      </Route>
      <Route
        path="communities/:communityId/channels/:roomId"
        element={<Community />}
      />
    </Route>
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
