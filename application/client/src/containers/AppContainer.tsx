import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { AppPage } from "@web-speed-hackathon-2026/client/src/components/application/AppPage";
import { fetchJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

// 各ページの遅延読み込み
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
const Search = lazy(() =>
  import("./SearchContainer").then(m => ({ default: m.SearchContainer }))
);
const UserProfile = lazy(() =>
  import("./UserProfileContainer").then(m => ({ default: m.UserProfileContainer }))
);
const Post = lazy(() =>
  import("./PostContainer").then(m => ({ default: m.PostContainer }))
);

export const AppContainer = () => {
  const [user, setUser] = useState<Models.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 通信エラーを完全に無視して起動するようにする
    fetchJSON<Models.User>("/api/v1/me")
      .then(setUser)
      .catch(() => setUser(null)) // 401エラー等でもクラッシュさせない
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <AppPage activeUser={user} authModalId="auth" newPostModalId="post" onLogout={() => {}}>
      <Suspense fallback={<div className="p-10 text-center">Loading Component...</div>}>
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/dm" element={<DMList activeUser={user} authModalId="auth" />} />
          <Route path="/dm/:conversationId" element={<DMChat activeUser={user} authModalId="auth" />} />
          <Route path="/crok" element={<Crok activeUser={user} authModalId="auth" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/users/:username" element={<UserProfile />} />
          <Route path="/posts/:postId" element={<Post />} />
        </Routes>
      </Suspense>
    </AppPage>
  );
};
