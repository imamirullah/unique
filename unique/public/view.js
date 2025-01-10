document.getElementById("showCertificateButton").addEventListener("click", function () {
    const enteredKey = document.getElementById("uniqueKeyInput").value.trim();
  
    // Clear previous error messages
    document.getElementById("keyError").textContent = "";
  
    if (!enteredKey) {
      document.getElementById("keyError").textContent = "Unique key is required.";
      return;
    }
  
    const certificateData = localStorage.getItem(enteredKey);
    if (!certificateData) {
      document.getElementById("keyError").textContent = "Invalid unique key.";
      return;
    }
  
    const { name, counter } = JSON.parse(certificateData);
  
    // Display the certificate
    document.getElementById("userName").textContent = name;
    document.getElementById("Uc").textContent = `UC / 2025 / 01 / ${counter}`;
    document.getElementById("certificateContainer").style.display = "block";
  });
  