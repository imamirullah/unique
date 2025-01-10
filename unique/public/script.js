let counter = 451;

document
  .getElementById("generateButton")
  .addEventListener("click", async function () {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();

    // Clear previous error messages
    document
      .querySelectorAll(".error")
      .forEach((error) => (error.textContent = ""));

    // Validation
    let isValid = true;
    if (!name) {
      document.getElementById("nameError").textContent = "Name is required.";
      isValid = false;
    }
    if (!email) {
      document.getElementById("emailError").textContent = "Email is required.";
      isValid = false;
    }
    if (!phone) {
      document.getElementById("phoneError").textContent =
        "Phone number is required.";
      isValid = false;
    }

    if (!isValid) return;

    // Send data to the server
    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        // alert(`Certificate Generated! Your Unique Key: ${data.data.uniqueKey}`);
        document.getElementById("uniqueKeyInputContainer").style.display =
          "block";
      } else {
        alert(
          data.message ||
            "Certificate already exists. Please enter your unique key to download."
        );
        document.getElementById("uniqueKeyInputContainer").style.display =
          "block";
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("An error occurred while generating the certificate.");
    }
  });

  document
  .getElementById("verifyButton")
  .addEventListener("click", async function () {
    const uniqueKey = document.getElementById("uniqueKeyInput").value.trim();

    // Clear previous error messages
    document.getElementById("uniqueKeyError").textContent = ""; 

    if (!uniqueKey) {
      document.getElementById("uniqueKeyError").textContent =
        "Unique Key is required.";
      return;
    }

    try {
      const response = await fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueKey }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the certificate details
        document.getElementById("userName").textContent = data.data.name;
        document.getElementById("Uc").textContent = data.data.cerficateno;

        // Show the certificate and download button
        document.getElementById("certificate").style.display = "block";
        document.getElementById("downloadButton").style.display =
          "inline-block";

        // Hide the unique key input section
        document.getElementById("uniqueKeyInputContainer").style.display =
          "none";
        document.getElementById("certificateForm").style.display =
          "none";
      } else {
        alert(data.message || "Invalid Unique Key.");
        // Hide elements if verification fails
        resetUI();
      }
    } catch (error) {
      console.error("Error verifying unique key:", error);
      alert("An error occurred while verifying the unique key.");
      resetUI(); // Reset the UI on failure
    }
  });

document
  .getElementById("downloadButton")
  .addEventListener("click", async function () {
    const certificate = document.getElementById("certificate");

    // Use html2pdf.js to download the certificate as a PDF
    html2pdf()
      .from(certificate)
      .save("certificate.pdf")
      .then(() => {
        // Hide elements after the download
        document.getElementById("certificateForm").style.display = "block";
        document.getElementById("certificate").style.display = "none";
        document.getElementById("downloadButton").style.display = "none";
      });
  });

// Reset UI and inputs
function resetUI() {
  document.getElementById("certificateForm").style.display = "block";
  document.getElementById("certificate").style.display = "none";
  document.getElementById("downloadButton").style.display = "none";
  document.getElementById("uniqueKeyInputContainer").style.display = "none";
  document.getElementById("uniqueKeyInput").value = "";
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.textContent = ""));
}


// Reset UI and inputs

