function startGame() {
    showLoader();
    window.location.href = 'suduko/index.html'; // Replace with your actual game file
  }
  
  function showLoader() {
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('menu').style.display = 'none';
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
  }
  
  window.onload = function () {
    hideLoader();
  };
  
   // Disable right-click globally
   document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

   // Disable text selection
   document.addEventListener('selectstart', function (e) {
    e.preventDefault();
  });