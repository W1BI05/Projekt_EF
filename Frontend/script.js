console.log("Hello World");

function SearchEnter() {
    /* Validate Search Enters etc... */

    var Input = document.getElementById("myInput").value

    localStorage.setItem('data', JSON.stringify(Input));
    window.location.href = "display.html?name=1";
};