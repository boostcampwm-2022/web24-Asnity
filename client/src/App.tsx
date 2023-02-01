import ChannelLayer from '@layouts/ChannelLayer';
import CommunityLayer from '@layouts/CommunityLayer';
import loadable from '@loadable/component';
import HomeErrorElement from '@routes/HomeErrorElement';
import React from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from 'react-router-dom';

const AccessDenied = loadable(() => import('@pages/AccessDenied'));
const AuthorizedLayer = loadable(() => import('@pages/AuthorizedLayer'));
const Channel = loadable(() => import('@pages/Channel'));
const Community = loadable(() => import('@pages/Community'));
const Error = loadable(() => import('@pages/Error'));
const Friends = loadable(() => import('@pages/Friends'));
const Home = loadable(() => import('@pages/Home'));
const NotFound = loadable(() => import('@pages/NotFound'));
const Root = loadable(() => import('@pages/Root'));
const SignIn = loadable(() => import('@pages/SignIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const UnAuthorizedLayer = loadable(() => import('@pages/UnAuthorizedLayer'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Root />} />
      <Route element={<AuthorizedLayer />}>
        <Route element={<Home />} errorElement={<HomeErrorElement />}>
          <Route path="friends" element={<Friends />} />
          <Route path="communities">
            <Route index element={<Navigate to="/friends" replace />} />
            <Route path=":communityId" element={<CommunityLayer />}>
              <Route index element={<Community />} />
              <Route path="channels">
                <Route index element={<Navigate to="/friends" replace />} />
                <Route path=":roomId" element={<ChannelLayer />}>
                  <Route index element={<Channel />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route element={<UnAuthorizedLayer />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const App = () => <RouterProvider router={router} />;

export default App;
