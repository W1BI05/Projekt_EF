var yourdata = JSON.parse(localStorage.getItem('data'));
console.log(yourdata)

var xyValues = [
  {x:50, y:7},
  {x:60, y:8},
  {x:70, y:8},
  {x:80, y:9},
  {x:90, y:9},
  {x:100, y:9},
  {x:110, y:10},
  {x:120, y:11},
  {x:130, y:14},
  {x:140, y:14},
  {x:150, y:45}
];

new Chart("Chart 1", {
  type: "scatter",
  data: {
    datasets: [{
      pointRadius: 8,
      pointBackgroundColor: "rgb(0,0,255)",
      data: xyValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      xAxes: [{ticks: {min: 40, max:160}}],
      yAxes: [{ticks: {min: 6, max:50}}],
    }
  }
});







async function getProducts() {
    let url = 'http://localhost:5000/products';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getProduct(id) {
    let url = 'http://localhost:5000/products/' + id;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderProducts() {
    let products = await getProducts();
    for (let i = 0; i < products.length; i++) {
        var table = document.getElementById("products");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        cell1.innerHTML = products[i][0];
        cell2.innerHTML = products[i][1];
        cell3.innerHTML = products[i][2];
        cell4.innerHTML = products[i][3];
        cell5.innerHTML = products[i][4];
        cell6.innerHTML = "<button onclick='editProduct(this)'><i class=\"fas fa-edit\"></i></button>"
        cell7.innerHTML = "<button onclick='removeProduct(this)'><i class=\"fas fa-trash\"></i></button>"

    }
}

async function createProduct() {
    modal.style.display = "none";
    let url = 'http://localhost:5000/products';
    let id = document.forms["myForm"]["id"].value;
    let description = document.forms["myForm"]["description"].value;
    let e_price = document.forms["myForm"]["e_price"].value;
    let v_price = document.forms["myForm"]["v_price"].value;
    let amount = document.forms["myForm"]["amount"].value;


    let data = {'id': id, 'description': description, 'e_price': e_price, 'v_price': v_price, 'amount': amount};

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    removeAllRows();
    renderProducts();

}

async function removeProduct(r){
    var i = r.parentNode.parentNode.rowIndex;
    let id = document.getElementById("products").rows[i].children[0].innerHTML;
    let url = 'http://localhost:5000/products/' + id;
    let res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
    });

    removeAllRows();
    renderProducts();

}

function removeAllRows(){
    var mytab = document.getElementById("products");
    for (let row of mytab.rows){
        if (row.rowIndex != 0){
            row.remove();
        }
    }
    if (mytab.rows.length > 1){
        removeAllRows();
    }
}

async function editProduct(r){
    var i = r.parentNode.parentNode.rowIndex;
    let id = document.getElementById("products").rows[i].children[0].innerHTML;
    let product = await getProduct(id);

    document.getElementById("id").value = product[0][0];
    document.getElementById("description").value = product[0][1];
    document.getElementById("e_price").value = product[0][2];
    document.getElementById("v_price").value = product[0][3];
    document.getElementById("amount").value = product[0][4];
    document.getElementById("mySubmit").value = "Speichern";

    modal.style.display = "block";
}

renderProducts();


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
