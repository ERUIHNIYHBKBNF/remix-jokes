import { Links, LiveReload, Outlet } from "remix";
import type { LinksFunction } from "remix";

import globalStyles from "~/styles/global.css";
import globalMediumStyles from "~/styles/global-medium.css";
import globalLargeStyles from "~/styles/global-large.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStyles,
    },
    {
      rel: "stylesheet",
      href: globalMediumStyles,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStyles,
      media: "screen and (min-width: 1024px)",
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's chino!</title>
        {/* Links放其它组件export的LinksFunction返回的links */}
        <Links/>
      </head>
      <body>
        Hello Chino (Root)
        {/* Outlet 显示子路由内容 */}
        <Outlet/>
        {/* 
          LiveReload: 在开发模式下，对源码做出修改后自动刷新浏览器
          The <LiveReload /> component is useful during development
          to auto-refresh our browser whenever we make a change.
          Because our build server is so fast, 
          the reload will often happen before you even notice ⚡
        */}
        <LiveReload />
      </body>
    </html>
  );
}