let employeeBtn = document.getElementById('employee-btn');
let enclosureBtn = document.getElementById('enclosure-btn');
let employees = document.getElementById('employees');
let enclosures = document.getElementById('enclosures');

function selectButton(clickedButton) {
  let buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach((btn) => btn.classList.remove('active'));
  clickedButton.classList.add('active');

  if(employeeBtn.classList.contains('active')){
    enclosures.style.display = 'none';
    employees.style.display = 'block';
  } else {
    employees.style.display = 'none';
    enclosures.style.display = 'block';
  }
}

window.selectButton = selectButton;
