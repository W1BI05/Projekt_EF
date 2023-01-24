const Input = document.getElementById("myInput")
const List = document.getElementById("myUL")

var Keywords = ["Tesla", "StockX"]

GetKeywords()
SetSearchList()

console.log(Keywords)



async function getArticles() {
    let url = 'http://localhost:5000/article';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

function GetKeywords() {
  let articles = getArticles();

  for (let i = 0; i < articles.length; i++) {

    Keywords[i] = articles[i][3];

  }
}

function SetSearchList() {
    for (i = 0; i < Keywords.length; i++) {
        var li = document.createElement("li")
        var a = document.createElement("a")
        a.innerHTML = Keywords[i]
        a.setAttribute( "onClick", "ItemPressed(this.innerHTML);" );
        li.appendChild(a)
        List.appendChild(li)
    }
}

function ItemPressed(Text) {
  Input.value = Text
}

function SearchChanged() {
    document.getElementById("errorMessage").innerHTML = ""

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
    if (Keywords.includes(Input.value)) {
        localStorage.setItem('data', JSON.stringify(Input));
        window.location.href = "display.html?name=1";
    } else {
        document.getElementById("errorMessage").innerHTML = "There are no Articles on this topic"
    }


};

