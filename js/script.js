// Focus starts from name Input
const nameInput = document.getElementById("name");
nameInput.focus();

// Job Role and Other Job Role Input variables
const selectJobRole = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");
otherJobInput.style.display = "none";

// Other Job Role Input visible only when chosen from Job Role
selectJobRole.addEventListener('change', function(e){
  if (e.target.value === 'other') {
    otherJobInput.style.display = "";
  }
});

// Design and Color selector variables
const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");
selectColor.disabled = true;

// Colors dedicated to specific Design visible when Design selected
// Color options disabled until a Design pick made
selectDesign.addEventListener('change', function(e){
  selectColor.disabled = false;
  const designPick = e.target.value;
  Array.from(selectColor.children).forEach(option => {
    const colorTheme = option.getAttribute("data-theme");
    if (!(designPick === colorTheme)) {
      option.hidden = true;
    } else {
      option.hidden = false;
    }
  });
});

// Variables for Activities fieldset and Total Cost element/counting
const activitiesField = document.getElementById("activities");
const totalCostElement = document.getElementById("activities-cost");
let totalCost = 0;

// Summing to 'totalCost' variable the CHECKED items' costs from Activities and 
// UNCHECKED items are reduced. 'totalCostElement' updated after each 'change'.
activitiesField.addEventListener('change', function(e){
  const item = e.target;
  const itemCost = parseInt(item.getAttribute('data-cost'));
  if (item.checked === true) {
    totalCost += itemCost;
  } else {
    totalCost -= itemCost
  }
  totalCostElement.innerHTML = `Total: $${totalCost}`
});

