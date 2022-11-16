import Community from '@pages/Community';
import DM from '@pages/DM';
import DMRoom from '@pages/DMRoom';
import Friends from '@pages/Friends';
import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />}>
      <Route path="dms" element={<DM />}>
        <Route index element={<Friends />} />
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
