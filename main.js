// main.js
fetch("../layout.html")
  .then(res => res.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    // Inject Navbar
    document.getElementById("navbar").innerHTML =
      doc.getElementById("site-navbar").innerHTML;

    // Inject Footer
    document.getElementById("footer").innerHTML =
      doc.getElementById("site-footer").innerHTML;
  });

