import axios from "axios";
import * as cheerio from "cheerio";

namespace GetSpanDate {
  export type Params = { value: string };
  export type Result = string;
}

const getSpanDate = (Params: GetSpanDate.Params): GetSpanDate.Result => {
  return `span[class='document${Params.value}'] > span[class='value']`;
};

namespace GetData {
  export type Params = { url: string };
  export type Result = {
    title: string;
    date: string;
    image?: string;
    text: string;
  };
}

const getData = async (Params: GetData.Params): Promise<GetData.Result> => {
  const { data } = await axios.get(Params.url);
  const $ = cheerio.load(data);
  const title = $("h1[class='documentFirstHeading']").text();
  const image = $("img").attr("src");
  const date =
    $(getSpanDate({ value: "Modified" })).text() ||
    $(getSpanDate({ value: "Published" })).text();
  const text = $("div[property='rnews:articleBody']").text();
  return { title, date, image, text };
};

namespace GetLinks {
  export type Params = { url: string };
  export type Result = string[];
}

const getLinks = async (Params: GetLinks.Params): Promise<GetLinks.Result> => {
  const { data } = await axios.get(Params.url);
  const $ = cheerio.load(data);
  const links = [];
  $("a[class='summary url']").each((index, element) => {
    links.push($(element).attr("href"));
  });

  return links;
};

async function main(): Promise<void> {
  const links = await getLinks({ url: "https://www.gov.br/pt-br/noticias" });
  const data = [];
  for (const link of links) {
    data.push(await getData({ url: link }));
  }
  console.log(data);
}

main();
