import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
const SearchResults = lazy(() => import("@/components/pages/SearchResults"));
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const Popular = lazy(() => import("@/components/pages/Popular"));
const Communities = lazy(() => import("@/components/pages/Communities"));
const CommunityDetail = lazy(() => import("@/components/pages/CommunityDetail"));
const UserProfile = lazy(() => import("@/components/pages/UserProfile"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const PostDetail = lazy(() => import("@/components/pages/PostDetail"));
const Saved = lazy(() => import("@/components/pages/Saved"));
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "popular",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Popular />
      </Suspense>
    ),
  },
  {
    path: "communities",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Communities />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <SearchResults />
      </Suspense>
    ),
},
  {
    path: "community/:communityName",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CommunityDetail />
      </Suspense>
    ),
  },
  {
    path: "post/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <PostDetail />
      </Suspense>
    ),
  },
  {
    path: "user/:username",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <UserProfile />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
},
  {
    path: "saved",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Saved />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);