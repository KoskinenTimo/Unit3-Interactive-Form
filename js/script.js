/////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////


// Focus starts from name Input. Name and Email input selectors.
const nameInput = document.getElementById("name");
nameInput.focus();
const emailInput = document.getElementById("email");

// Design and Color selector variables
const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");

// Variables/Selectors for Activities fieldset, Activities inputs
// and Total Cost element/counting.
const activitiesField = document.getElementById("activities");
///////const activitiesInputs = document.querySelectorAll("#activities-box input");
const totalCostElement = document.getElementById("activities-cost");
let totalCost = 0;

// Job Role and Other Job Role Input variables/selectors
const selectJobRole = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");

// Selectors for payment method menu, input fields below menu and default 
// choice, credit card.
const paymentMethod = document.getElementById("payment");
const creditCardDiv = document.getElementById("credit-card");
const paymentOptions = paymentMethod.children;

// Selectors for payment method input fields
const cardNumber = document.getElementById("cc-num");
const zipCode = document.getElementById("zip");
const cvv = document.getElementById("cvv");
const eDate = document.getElementById("exp-month");
const eYear = document.getElementById("exp-year");

// Form element
const form = document.querySelector("form");


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

// Listening submit button inside 'form' element
form.addEventListener('submit', function(e){
  validateName(nameInput.value,e);
  validateEmail(emailInput.value,e);
  validateActivities(e);
  if(paymentMethod.value === "credit-card") {
    validateCreditCardDetails(e);
  }  
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

/**
 * Validates the name input field, if valid, allows the submit continue 
 * @param {string} nameInputValue 
 * @param {event} e 
 */
function validateName(nameInputValue,e) {
  const valid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(nameInputValue);
  if (!valid) {
    e.preventDefault();
  }
}

/**
 * Validates the email input field, if valid, allows submit to continue
 * @param {string} emailInputValue 
 * @param {event} e 
 */
function validateEmail(emailInputValue,e) {
  const valid = /^\S+@\S+\.[a-z0-9]+$/i.test(emailInputValue);
  if (!valid) {
    e.preventDefault();
  }
}

/**
 * Validates that the user has chosen atleast 1 activity.
 * @param {event} e 
 */
function validateActivities(e) {
  if (totalCost === 0) {
    e.preventDefault();
  }
}

/**
 * 
 * @param {event} e 
 */
function validateCreditCardDetails(e) {
  const eDateValue = parseInt(eDate.value);
  const eYearValue = parseInt(eYear.value);
  const cardNumberValue = parseInt(cardNumber.value);
  const zipCodeValue = parseInt(zipCode.value);
  const cvvValue = parseInt(cvv.value);

  expirationDateAfterPresent(eDateValue,eYearValue,e);
  validateCardNumber(cardNumberValue,e)
  validateZipCode(zipCodeValue,e);
  validateCvv(cvvValue,e)
}

/**
 * 
 * @param {number} eDateValue 
 * @param {number} eYearValue 
 * @param {event} e 
 */
function expirationDateAfterPresent(eDateValue,eYearValue,e) {
  const presentDate = new Date();
  if(eYearValue === presentDate.getFullYear() &&
     eDateValue <= presentDate.getMonth() + 1) {
    e.preventDefault;
  }
}

/**
 * 
 * @param {*} cardNumberValue 
 * @param {*} e 
 */
function validateCardNumber(cardNumberValue,e) {
  const valid = /^\d{13,15}$/.test(cardNumberValue);
  if (!valid) {
    e.preventDefault;
  }
}

/**
 * 
 * @param {*} zipCodeValue 
 * @param {*} e 
 */
function validateZipCode(zipCodeValue,e) {
  const valid = /^\d{5}$/.test(zipCodeValue);
  if (!valid) {
    e.preventDefault;
  }
}

/**
 * 
 * @param {*} cvvValue 
 * @param {*} e 
 */
function validateCvv(cvvValue,e) {
  const valid = /^\d{3}$/.test(cvvValue);
  if (!valid) {
    e.preventDefault;
  }
}

// TESTER LISTENER
cvv.addEventListener('keyup', function(e){
  validateCvv(cvv.value,e);
});
