"use client";
import Editor from "@/components/functional/editor";
import localforage from "localforage";
import { useState } from "react";
const initialContent = `# 美しい日本語

## 草枕

山路を登りながら、こう考えた。

智に働けば角が立つ。情に掉させば流される。意地を通せば窮屈だ。とかくに人の世は住みにくい。

住みにくさが高じると、安いところへ引き越したくなる。どこへ越しても住みにくいと悟ったとき、詩が生れて、絵ができる。

## 東京の坂道

-   乃木坂
-   けやき坂
-   日向坂

## 徒然草

### 折節の移り変るこそ、ものごとにあはれなれ。

さて、冬枯のけしきこそ、秋にはをさをさ劣るまじけれ。汀の草に紅葉の散り止りて、霜いと白うおける朝、遣水より烟の立つこそをかしけれ。年の暮れ果てて、人ごとに急ぎあへるころぞ、またなくあはれなる。すさまじきものにして見る人もなき月の寒けく澄める、廿日余りの空こそ、心ぼそきものなれ。御仏名、荷前の使立つなどぞ、あはれにやんごとなき。公事ども繁く、春の急ぎにとり重ねて催し行はるるさまぞ、いみじきや。追儺より四方拝に続くこそ面白けれ。晦日の夜、いたう闇きに、松どもともして、夜半過ぐるまで、人の、門叩き、走りありきて、何事にかあらん、ことことしくのゝしりて、足を空に惑ふが、暁がたより、さすがに音なくなりぬるこそ、年の名残も心ぼそけれ。亡き人のくる夜とて魂祭るわざは、このごろ都にはなきを、東のかたには、なほする事にてありしこそ、あはれなりしか。

かくて明けゆく空のけしき、昨日に変りたりとは見えねど、ひきかへめづらしき心地ぞする。大路のさま、松立てわたして、はなやかにうれしげなるこそ、またあはれなれ。

`;

export default function Page({
  searchParams: { id, location },
}: {
  searchParams: { id?: string; location?: string };
}) {
  const { content, handle } = fetchData(location, id).read();
  console.log(content, handle);
  const [markdown, setMarkdown] = useState<string>(content || initialContent);
  return <Editor markdown={markdown} setMarkdown={setMarkdown} />;
}
function fetchData(location?: string, id?: string) {
  return wrapPromise(
    new Promise(async (resolve, reject) => {
      try {
        if (location == "local" && id) {
          const handle = await localforage.getItem(id);
          const content = sessionStorage.getItem(id);
          resolve({ content, handle });
        }
        resolve({ content: null, handle: null });
      } catch (e) {
        reject(e);
      }
    })
  );
}
const wrapPromise = (promise: Promise<any>) => {
  let status = "pending";
  let result: any;

  const suspender = promise.then(
    (r: any) => {
      status = "fulfilled";
      result = r;
    },
    (e: any) => {
      status = "rejected";
      result = e;
    }
  );

  const read = () => {
    if (status === "pending") {
      throw suspender;
    } else if (status === "rejected") {
      throw result;
    } else {
      return result;
    }
  };

  return { read };
};
