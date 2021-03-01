/////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////

// Focus starts from name Input
const nameInput = document.getElementById("name");
nameInput.focus();

// Design and Color selector variables
const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");

// Variables for Activities fieldset and Total Cost element/counting
const activitiesField = document.getElementById("activities");
const totalCostElement = document.getElementById("activities-cost");
let totalCost = 0;

// Job Role and Other Job Role Input variables
const selectJobRole = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");

// Selectors for menu and default choice, credit card.
const paymentMethod = document.getElementById("payment");
const creditCardDiv = document.getElementById("credit-card");
const paymentOptions = paymentMethod.children;


/////////////////////////////////////////////
// LISTENERS
/////////////////////////////////////////////

// Other Job Role Input visible only when chosen from Job Role
otherJobInput.style.display = "none";
selectJobRole.addEventListener('change', function(e){
  if (e.target.value === 'other') {
    otherJobInput.style.display = "";
  }
});

// Colors dedicated to specific Design visible when Design selected
// Color options disabled until a Design pick made
selectColor.disabled = true;
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

// Summing to 'totalCost' variable the CHECKED items' costs from Activities and 
// UNCHECKED items are reduced. 'totalCostElement' updated after each 'change'.
activitiesField.addEventListener('change', function(e){
  const item = e.target;
  const itemCost = parseInt(item.getAttribute('data-cost'));
  if (item.checked === true) {
    totalCost += itemCost;
  } else {
    totalCost -= itemCost;
  }
  totalCostElement.innerHTML = `Total: $${totalCost}`;
});

// Credit Card chosen as default payment method, other methods' div elements 
// hidden below the payment method menu. 
document.getElementById("paypal").style.display = "none";;
document.getElementById("bitcoin").style.display = "none";;
paymentOptions[1].setAttribute('selected', true);
// Listen to changes in payment method menu and changes required div elements for
// each method.
paymentMethod.addEventListener('change', function(e){
  const paymentOption = e.target.value;
  paymentDivDisplayToggle(paymentOption);
});


/////////////////////////////////////////////
// SUPPORT FUNCTIONS
/////////////////////////////////////////////

/**
 * Changes view of Payment Info area according to the selected METHOD.
 * Takes 1 parameter which is the option chosen from Payment select menu.
 * @param {string} paymentOption 
 */
function paymentDivDisplayToggle(paymentOption) {
  for (let i = 1; i < paymentOptions.length; i++) {
    const listValue = paymentOptions[i].value;
    if (paymentOption === listValue) {
      paymentOptions[i].setAttribute('selected', true);
      document.getElementById(`${listValue}`).style.display = '';
    } else {
      paymentOptions[i].removeAttribute('selected');
      document.getElementById(`${listValue}`).style.display = 'none';
    }
  }
}

