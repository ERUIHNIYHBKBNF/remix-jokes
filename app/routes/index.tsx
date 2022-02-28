/*
export一个linksFunction来动态使用css（或者其它links）
remix使用传统的link方式来添加css，如果一个路由是active的，那么这个组件的links就会被添加到网页中
When the route is active, the link is on the page and the CSS applies.
When the route is not active (the user navigates away),
the link tag is removed and the CSS no longer applies.
```
import type { LinksFunction } from "remix";
import loginStyles from "~/styles/login.css";
export function links() {
  return [
    {
      rel: "stylesheet",
      href: loginStyles,
    }
  ]
}
```
关于引入sass,想办法转换成原生的css(浏览器能看懂)就好了唔qwq
We need to find a way to compile our SASS files and
provide the generated css for Remix to process. 
With Remix, we need to manually process the sass files.
We need a simple package to make it work.
```
yarn add sass
// add scripts to package.json
// that will process the files in `styles/` and write them to `/app/styles/`
// where Remix modules can import them.
"scripts": {
  "sass": "sass --watch --no-source-map styles:app/styles"
},
// 然后再开个控制台跑这个就好了
yarn sass
```
--watch: This is simply telling the Sass compiler to continue watching the
  files/folder we give it and to re-run the compiler when it notices changes
  (essentially, this is just hot reload for Sass).
--no-source-map: This is personal preference, so feel free to leave this out - this
  tells the Sass compiler to not generate source maps for the CSS (i.e. global.map.css)
styles:app/styles: Here, we're telling the compiler to take SCSS files it finds 
  in styles/ and send them to app/styles
*/
import type { LinksFunction } from "remix";
import { Link } from "remix";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}