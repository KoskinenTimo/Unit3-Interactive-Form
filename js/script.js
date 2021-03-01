const nameInput = document.getElementById("name");
nameInput.focus();

const selectJobRole = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");
otherJobInput.style.display = "none";

selectJobRole.addEventListener('change', function(e) {
  if (e.target.value === 'other') {
    otherJobInput.style.display = "";
  }
});

const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");
selectColor.disabled = true;
console.log(selectColor.children);

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