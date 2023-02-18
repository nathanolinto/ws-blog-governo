const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.gov.br/pt-br/noticias";

axios.get(url).then((res) => {
  const { data } = res;
  const $ = cheerio.load(data);
  const links = [];
  $("a[class='summary url']").each((index, element) => {
    links.push($(element).attr("href"));
  });
});
