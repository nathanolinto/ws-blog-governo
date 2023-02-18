const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://www.gov.br/pt-br/propriedade-intelectual/noticias/2023/fevereiro/brasil-adere-ao-sistema-de-haia-para-a-protecao-internacional-de-desenhos-industriais";

axios.get(url).then((res) => {
  const { data } = res;
  const $ = cheerio.load(data);
  const title = $("h1[class='documentFirstHeading']").text();
  const image = $("img").attr("src");
  const date = $("span[class='value']").text();
  const text = $("div[property='rnews:articleBody']").text();
  const links = [];
  $("a[class='summary url']").each((index, element) => {
    links.push($(element).attr("href"));
  });

  const item = { title, date, image, text, links };
  console.log(item);
});
