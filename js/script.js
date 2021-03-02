/////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////

// BASIC INFO SELECTORS
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const selectJobRole = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");

// T-SHIRT SELECTORS
const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");

// ACTIVITIES SELECTORS & Total Cost for counting.
const activitiesField = document.getElementById("activities");
const activitiesBox = document.getElementById("activities-box");
const activitiesInputs = document.querySelectorAll("#activities-box input");
const totalCostElement = document.getElementById("activities-cost");
let totalCost = 0;

// PAYMENT INFO SELECTORS
const paymentMethod = document.getElementById("payment");
const creditCardDiv = document.getElementById("credit-card");
const paymentOptions = paymentMethod.children;
const cardNumber = document.getElementById("cc-num");
const zipCode = document.getElementById("zip");
const cvv = document.getElementById("cvv");
const eDate = document.getElementById("exp-month");
const eYear = document.getElementById("exp-year");

// FORM SELECTOR
const form = document.querySelector("form");


/////////////////////////////////////////////
// SETTINGS
/////////////////////////////////////////////

// Form initial focus on name input
nameInput.focus(); 

// Other Job Role Input visible only when chosen from Job Role
otherJobInput.style.display = "none";

// Color options disabled until a Design pick made
selectColor.disabled = true;

// Credit Card chosen as default payment method, other methods' div elements 
// hidden below the payment method menu. 
document.getElementById("paypal").style.display = "none";;
document.getElementById("bitcoin").style.display = "none";;
paymentOptions[1].setAttribute('selected', true);


/////////////////////////////////////////////
// LISTENERS
/////////////////////////////////////////////

//_________________________________________________________________________________
// Validates name input real-time
nameInput.addEventListener('keyup', function(e){
  validateName(nameInput.value,e);
});

//_________________________________________________________________________________
// Validates email input real-time
emailInput.addEventListener('keyup', function(e){
  validateEmail(e.target.value,e);
});

//_________________________________________________________________________________
// Listens for 'other' choice pick to display the input field
selectJobRole.addEventListener('change', function(e){
  if (e.target.value === 'other') {
    otherJobInput.style.display = "";
  } else {
    otherJobInput.style.display = "none";
  }
});

//_________________________________________________________________________________
// Colors dedicated to specific Design visible when Design selected
selectDesign.addEventListener('change', function(e){
  selectColor.disabled = false;
  selectColor.options[0].selected = true;
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

//_________________________________________________________________________________
// The CHECKED items' costs from Activities summed up to 'totalCost' variable  and 
// UNCHECKED items are reduced. 'totalCostElement' updated after each 'change'.
activitiesField.addEventListener('change', function(e){
  const item = e.target;
  const itemCost = parseInt(item.getAttribute('data-cost'));  
  if (item.checked === true) {
    totalCost += itemCost;
    toggleDisableEnable(item,true);
  } else {
    totalCost -= itemCost;
    toggleDisableEnable(item,false);
  }
  validateActivities(e);
  totalCostElement.innerHTML = `Total: $${totalCost}`;  
});

//_________________________________________________________________________________
// adds listeners for checkbox parent elements, to focus/blur
addFocusAndBlurListeners(activitiesInputs);

//_________________________________________________________________________________
// Listen to changes in payment method menu and changes required div elements for
// each method.
paymentMethod.addEventListener('change', function(e){
  const paymentOption = e.target.value;  
  paymentDivDisplayToggle(paymentOption);
});

//_________________________________________________________________________________
// Listens to card month/year validation, when month changed.
eDate.addEventListener('change', function(e){
  expirationDateAfterPresent(e);
})

//_________________________________________________________________________________
// Listens to card month/year validation, when year changed.
eYear.addEventListener('change', function(e){
  expirationDateAfterPresent(e);
})
//_________________________________________________________________________________
// Listens to Card Number input real-time
cardNumber.addEventListener('keyup', function(e){
  validateCardNumber(e.target.value,e);
});

//_________________________________________________________________________________
// Listens to Zip Code Number input real-time
zipCode.addEventListener('keyup', function(e){
  validateZipCode(e.target.value,e);
});

//_________________________________________________________________________________
// Listens to CVV Number input real-time
cvv.addEventListener('keyup', function(e){
  validateCvv(e.target.value,e);
});

//_________________________________________________________________________________
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
 * Changes view of 'Payment Info' area according to the selected 'Payment Method'.
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
 * Validates the name input field, if valid, allows the submit continue .
 * @param {string} nameInputValue 
 * @param {event} e 
 */
function validateName(nameInputValue,e) {
  const valid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(nameInputValue);
  if (!valid) {
    e.preventDefault();
    notValid(nameInput);
  } else {
    isValid(nameInput);
  }
}

/**
 * Validates the email input field, if valid, allows submit to continue.
 * @param {string} emailInputValue 
 * @param {event} e 
 */
function validateEmail(emailInputValue,e) {
  const valid = /^\S+@\S+\.[a-z0-9]+$/i.test(emailInputValue);
  if (!valid) {
    e.preventDefault();
    notValid(emailInput);
  } else {
    isValid(emailInput);
  }
}

/**
 * Validates that the user has chosen atleast 1 activity.
 * @param {event} e 
 */
function validateActivities(e) {
  if (totalCost === 0) {
    e.preventDefault();
    notValid(activitiesBox);
  } else {
    isValid(activitiesBox);
  }
}

/**
 * All credit card detail validations are grouped with this function.
 * @param {event} e 
 */
function validateCreditCardDetails(e) {
  const cardNumberValue = parseInt(cardNumber.value);
  const zipCodeValue = parseInt(zipCode.value);
  const cvvValue = parseInt(cvv.value);

  expirationDateAfterPresent(e);
  validateCardNumber(cardNumberValue,e);
  validateZipCode(zipCodeValue,e);
  validateCvv(cvvValue,e);  
}

/**
 * Checks that month/year is not equal or earlier than the current date
 * or either month or year unselected.
 * @param {number} eDateValue 
 * @param {number} eYearValue 
 * @param {event} e 
 */
function expirationDateAfterPresent(e) {
  const presentDate = new Date();
  if (parseInt(eYear.value) === presentDate.getFullYear() &&
      parseInt(eDate.value) <= presentDate.getMonth() + 1) {
    notValid(eDate);
    notValid(eYear); 
    e.preventDefault();
  } else if (eDate.value === "Select Date" &&
             eYear.value === "Select Year") {
    notValid(eDate);
    notValid(eYear);
    e.preventDefault();
  } else if (eDate.value === "Select Date") {
    notValid(eDate);
    isValid(eYear); 
    e.preventDefault();  
  } else if (eYear.value === "Select Year") {
    isValid(eDate);
    notValid(eYear); 
    e.preventDefault();
  } else {
    isValid(eDate);
    isValid(eYear);
  }
}

/**
 * Checks if the card number input value is 13-16 digits.
 * @param {number} cardNumberValue 
 * @param {event} e 
 */
function validateCardNumber(cardNumberValue,e) {
  const valid = /^\d{13,16}$/.test(cardNumberValue);
  if (!valid) {
    notValid(cardNumber);
    e.preventDefault();
  } else {
    isValid(cardNumber);
  }
}

/**
 * Checks if zip number value is 5 digits.
 * @param {number} zipCodeValue 
 * @param {event} e 
 */
function validateZipCode(zipCodeValue,e) {
  const valid = /^\d{5}$/.test(zipCodeValue);
  if (!valid) {
    notValid(zipCode);
    e.preventDefault();
  } else {
    isValid(zipCode);
  }
}

/**
 * Checks if cvv number value is 3 digits.
 * @param {number} cvvValue 
 * @param {event} e 
 */
function validateCvv(cvvValue,e) {
  const valid = /^\d{3}$/.test(cvvValue);
  if (!valid) {
    notValid(cvv);
    e.preventDefault();
  } else {
    isValid(cvv);
  }
}

/**
 * Prevents selecting activities that happen at the same time.
 * @param {element} item 
 * @param {boolean} checked 
 */
function toggleDisableEnable(item,checked) {
  const itemTime = item.getAttribute("data-day-and-time");
  activitiesInputs.forEach(element => {
    const elementTime = element.getAttribute("data-day-and-time");
    if (checked && elementTime === itemTime && item !== element) {
      element.disabled = true;
      element.parentElement.classList.add("disabled")
    } else if (!checked && elementTime === itemTime && item !== element) {
      element.disabled = false;
      element.parentElement.classList.remove("disabled")
    }
  });
}

/**
 * Adds listeners for all activities, focus and blur to highlight, 
 * what item is focused.
 * @param {array} elementsArray 
 */
function addFocusAndBlurListeners(elementsArray) {
  elementsArray.forEach(element => {
    element.addEventListener('focus', function(e){
      element.parentElement.classList.add("focus");
    });
    element.addEventListener('blur', function(e){
      element.parentElement.classList.remove("focus");
    });
  });
};

/**
 * Validates the element that is given as the parameter. Adds and removes 
 * classes for visual effect.
 * @param {element} element 
 */
function isValid(element) {  
  const parent = element.parentElement;
  parent.classList.remove("not-valid");
  parent.classList.add("valid");  
  if (parent.lastElementChild.tagName === "SPAN" ||
      parent.lastElementChild.tagName === "P") {
    parent.lastElementChild.style.display = 'none';
  }  
}

/**
 * Invalidates the element that is given as the parameter. Adds and removes 
 * classes for visual effect.
 * @param {element} element 
 */
function notValid(element) {
  const parent = element.parentElement;
  parent.classList.remove("valid");
  parent.classList.add("not-valid"); 
  if (parent.lastElementChild.tagName === "SPAN" ||
      parent.lastElementChild.tagName === "P") {
    parent.lastElementChild.style.display = 'block';
  }
}