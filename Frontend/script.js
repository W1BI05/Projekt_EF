const Input = document.getElementById("myInput")
const List = document.getElementById("myUL")
var activeElement = document.activeElement;

var Words = []
fetch('./keywords.json')
    .then((message) => message.json())
    .then((data) => SetSearchList(data))




//GetKeywords()
List.style.visibility = "true"

/*async function getArticles() {
    let url = 'http://localhost:5000/articles';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function GetKeywords() {
  let articles = await getArticles();
console.log(articles)

  for (let i = 0; i < articles.length; i++) {
    var words =  articles[i][2].split('_')
      for (let i = 0; i < words.length; i++) {
          if (Keywords.includes(words[i]) === false) {
              Keywords.push(words[i])
          }
      }
  }
  SetSearchList()
}*/


function SetSearchList(Keywords) {

    Words = Keywords

    for (i = 0; i < Keywords.length; i++) {
        var li = document.createElement("li")
        var a = document.createElement("a")
        a.innerHTML = Keywords[i]
        a.setAttribute( "onClick", "ItemPressed(this.innerHTML);" );
        li.appendChild(a)
        List.appendChild(li)
    }

    List.style.visibility = "true"
}

function ItemPressed(Text) {
  Input.value = Text
    List.style.visibility = "true"
}

function SearchChanged() {
    console.log("changed")
    document.getElementById("errorMessage").innerHTML = ""

    if (activeElement === Input && Input.value.length > 3) {
        console.log(Input.value.length)
        List.style.visibility = "false"
        console.log("true")
    } else {
        List.style.visibility = "true"
    }

  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function SearchEnter() {
    if (Words.includes(Input.value)) {

    location.replace("display.html?word="+ Input.value+"");
    } else {
        document.getElementById("errorMessage").innerHTML = "There are no Articles on this topic"
    }
};

