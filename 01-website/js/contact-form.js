emailjs.init("service_dfgbyxn");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkout-form");
    const messageDisplay = document.getElementById("checkout-message");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("checkout-name").value,
            email: document.getElementById("checkout-email").value,
            phone: document.getElementById("checkout-phone").value,
            address: document.getElementById("checkout-address").value,
            city: document.getElementById("checkout-city").value,
            postal: document.getElementById("checkout-postal").value,
            country: document.getElementById("checkout-country").value,
            notes: document.getElementById("checkout-notes").value,
            newsletter: document.getElementById("checkout-newsletter").checked ? "Yes" : "No"
        };

        emailjs.send("service_dfgbyxn", "template_gcsmdsb", data)
            .then(() => {
                messageDisplay.textContent = "Order placed and confirmation sent!";
                messageDisplay.style.color = "green";
                form.reset();
            })
            .catch((error) => {
                messageDisplay.textContent = "Error sending order. Please try again.";
                messageDisplay.style.color = "red";
                console.error("EmailJS error:", error);
            });
    });
});