import CommunityLayer from '@layouts/CommunityLayer';
import AccessDenied from '@pages/AccessDenied';
import AuthorizedLayer from '@pages/AuthorizedLayer';
import Channel from '@pages/Channel';
import Community from '@pages/Community';
import DM from '@pages/DM';
import DMRoom from '@pages/DMRoom';
import Friends from '@pages/Friends';
import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import Root from '@pages/Root';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import UnAuthorizedLayer from '@pages/UnAuthorizedLayer';
import UnknownError from '@pages/UnknownError';
import React from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Root />} />
      <Route element={<AuthorizedLayer />}>
        <Route element={<Home />}>
          <Route path="dms" element={<DM />}>
            <Route index element={<Friends />} />
            <Route
              path=":roomId"
              element={
                <>
                  <Outlet />
                  {/* TODO: roomId가 올바른지 검증하기 */}
                </>
              }
            >
              <Route index element={<DMRoom />} />
            </Route>
          </Route>
          {/* TODO: communities/ 로 이동했을 때 리다이렉트할 url 정하기 */}
          <Route path="communities">
            <Route index element={<Navigate to="/dms" replace />} />
            <Route path=":communityId" element={<CommunityLayer />}>
              <Route index element={<Community />} />
              <Route path="channels">
                <Route index element={<Navigate to="/dms" replace />} />
                <Route
                  path=":roomId"
                  element={
                    <>
                      <Outlet />
                      {/* TODO: roomId가 올바른지 검증하기 */}
                    </>
                  }
                >
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
      <Route path="/unknown-error" element={<UnknownError />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const App = () => <RouterProvider router={router} />;

export default App;
