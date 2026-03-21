import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { AppPage } from "../components/application/AppPage";
import { fetchJSON } from "../utils/fetchers";

const Timeline = lazy(() =>
  import("./TimelineContainer").then(m => ({ default: m.TimelineContainer }))
);
const DMList = lazy(() =>
  import("./DirectMessageListContainer").then(m => ({ default: m.DirectMessageListContainer }))
);
const DMChat = lazy(() =>
  import("./DirectMessageContainer").then(m => ({ default: m.DirectMessageContainer }))
);
const Crok = lazy(() =>
  import("./CrokContainer").then(m => ({ default: m.CrokContainer }))
);
const User = lazy(() =>
  import("./UserProfileContainer").then(m => ({ default: m.UserProfileContainer }))
);
const Search = lazy(() =>
  import("./SearchContainer").then(m => ({ default: m.SearchContainer }))
);
const PostDetail = lazy(() =>
  import("./PostContainer").then(m => ({ default: m.PostContainer }))
);

export const AppContainer = () => {
  const [user, setUser] = useState<Models.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJSON<Models.User>("/api/v1/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <AppPage activeUser={user} authModalId="auth" newPostModalId="post" onLogout={() => {}}>
      <Suspense fallback={<div className="p-10 text-center text-teal-700">Loading Page...</div>}>
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/dm" element={<DMList activeUser={user} authModalId="auth" />} />
          <Route path="/dm/:conversationId" element={<DMChat activeUser={user} authModalId="auth" />} />
          <Route path="/crok" element={<Crok activeUser={user} authModalId="auth" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/users/:username" element={<User />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
        </Routes>
      </Suspense>
    </AppPage>
  );
};
