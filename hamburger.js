document.querySelector(".hamburger").addEventListener("click", function() {
    this.classList.toggle("active");
    document.querySelector(".nav-links").classList.toggle("active");
});

// Selectează toate link-urile din nav
document.querySelectorAll(".nav-links li a").forEach(link => {
    link.addEventListener("click", function() {
        // Închide meniul hamburger după ce se face click pe un link
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector(".nav-links").classList.remove("active");
    });
});
