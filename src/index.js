const axios = require("axios");
const cheerio = require("cheerio");

const getSpanDate = (value) => {
  return `span[class='document${value}'] > span[class='value']`;
};

const getData = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const title = $("h1[class='documentFirstHeading']").text();
  const image = $("img").attr("src");
  const date =
    $(getSpanDate("Modified")).text() || $(getSpanDate("Published")).text();
  const text = $("div[property='rnews:articleBody']").text();
  return { title, date, image, text };
};

const getLinks = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $("a[class='summary url']").map((index, element) => {
    return $(element).attr("href");
  });
};

async function main() {
  const links = await getLinks("https://www.gov.br/pt-br/noticias");
  const data = [];
  for (const link of links) {
    data.push(await getData(link));
  }
  console.log(data);
}

main();
