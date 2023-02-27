var url_string = window.location;
var url = new URL(url_string);
var Keyword = url.searchParams.get("word");



const NYTimesApiKey = 'ivOAVvz7llyR8AeOKo23e4sCxCGmkMOQ';
const OpenAIApiKey = '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';

async function fetchArticles(startDate, endDate) {
  try {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;

    const apiUrl = `https://api.nytimes.com/svc/archive/v1/${startYear}/${startMonth}.json?api-key=${NYTimesApiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    let docs = [];

    if (data && data.response && data.response.docs) {
      docs = data.response.docs;
    }

    // Fetch articles for each month within the specified range
    for (let year = startYear; year <= endYear; year++) {
      const startMonth = year === startYear ? startDate.getMonth() + 1 : 1;
      const endMonth = year === endYear ? endDate.getMonth() + 1 : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        const apiUrl = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${NYTimesApiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.response && data.response.docs) {
          docs = docs.concat(data.response.docs);
        }
      }
    }

    return docs;
  } catch (error) {
    console.error(error);
  }
}

async function davinciRequest(subject, news) {
  const url = 'https://api.openai.com/v1/completions';
  const openai_key = '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';

  const data = {
    model: 'text-davinci-003',
    prompt: `Determine how positive or negative the following news is for ${subject}. Then, evaluate how strongly this news article is related to ${subject} compared to other news concerning ${subject}. Here is the news headline: "${news}" Only return 2 values without explanation in this format: [Very Negative / Negative / Slightly Negative / Neutral / Slightly Positive / Positive / Very Positive], [Not Related At All / Few Relations / Slightly Related / Many Relations / Fully Related]`,
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai_key}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if(json.choices != undefined) {
    const result = json.choices[0].text.split(",");
    const positivity = result[0].trim();
    const relation = result[1].trim();
    return [positivity, relation];
  }
  return [null, null]
}

async function test(startDate, endDate, subject) {
  const _docs = await fetchArticles(startDate, endDate);
  const docs = removeDuplicates(_docs);
  const filteredArticles = getArticlesWithKeyword(subject, docs);
  console.log(filteredArticles.length);

  for (let i = 0; i < filteredArticles.length; i++) {
    const answer = await davinciRequest(subject,filteredArticles[i].abstract);
    filteredArticles[i]["OpenAI_evaluation"] = answer;
    console.log(i);
  }

  return filteredArticles
}

function getAllKeywords(docs) {
  let keywords = [];
  for (let i = 0; i < docs.length; i++) {
    const articleKeywords = docs[i].keywords;
    for (let j = 0; j < articleKeywords.length; j++) {
      const keyword = articleKeywords[j].value;
      if (!keywords.includes(keyword)) {
        keywords.push(keyword);
      }
    }
  }
  return keywords;
}

function formatArticles(docs) {
  const articles = docs.map(article => {
    return {
      abstract: article.abstract,
      keywords: article.keywords.map(keyword => keyword.value),
      web_url: article.web_url,
      pub_date: article.pub_date
    };
  });
  return articles;
}

function getArticlesWithKeyword(keyword, docs) {
  const articles = docs.filter(article => {
    return article.keywords.some(kw => kw.value.toLowerCase() === keyword.toLowerCase());
  }).map(article => {
    return {
      abstract: article.abstract,
      keywords: article.keywords.map(keyword => keyword.value),
      web_url: article.web_url,
      pub_date: article.pub_date
    };
  });
  return articles;
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => {
    // Find the first index of the current item
    const firstIndex = arr.findIndex(
      (t) => t.web_url === item.web_url && t.pub_date === item.pub_date
    );
    // Return true only if the current index is the first index
    return index === firstIndex;
  });
}

async function init() {
  const results = await test(new Date("04-01-22"), new Date("04-01-22"), "Apple Inc")
  console.log(results)
}

init();