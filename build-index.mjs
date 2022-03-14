// @ts-check

import * as fs from "fs/promises";
import * as path from "path";

const EXCLUDE_FILENAMES = [
  "index.json",
  "package.json",
  //
];

/** @param {string[]} list */
function makeTemplate(list = []) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>json.surabayajs.org</title>
  </head>
  <body>
    <ul>
      ${list.map((name) => `<li><a href="/${name}">${name}</a></li>`).join("")}
    </ul>
  </body>
</html>
`;
}

async function buildIndex() {
  const list = await fs
    .readdir(path.resolve(process.cwd(), "public"))
    .then((list) => list.filter((name) => name.endsWith(".json")))
    .then((list) =>
      list.filter((name) => {
        return EXCLUDE_FILENAMES.findIndex((match) => name == match) < 0;
      })
    );

  fs.writeFile(
    path.resolve(process.cwd(), "public/index.html"),
    makeTemplate(list),
    { encoding: "utf-8" }
  );
  fs.writeFile(
    path.resolve(process.cwd(), "public/index.json"),
    JSON.stringify(list, null, 2),
    { encoding: "utf-8" }
  );
}

buildIndex();
