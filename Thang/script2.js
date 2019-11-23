var selectedRow = null


var inputs = document.querySelectorAll('input');    
var myObject = {};

for (var i = 0; i < inputs.length; i++) {
  myObject[inputs[i].id] = inputs[i].value;
}



function getFormValues(formId) {
    var inputs = document.querySelectorAll('#' + formId + ' input');    
    var formValues = {};

    for (var i = 0; i < inputs.length; i++) {
      formValues[inputs[i].id] = inputs[i].value;
        
    }
  //  console.log(formValues)

    return formValues;
}


function onFormSubmit() {
    getFormValues('registerForm');
    var formData = readFormData('registerForm');
  //  insertNewRecord(formData);
    if (validate()) {
        var formData = readFormData('registerForm');
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }
}

function readFormData(formId) {
    var formData = {};
    var inputs = document.querySelectorAll('#' + formId + ' input');    
    var formData = {};

    for (var i = 0; i < inputs.length; i++) {
        formData[inputs[i].id] = inputs[i].value;
        
    }
    return formData;
}

function insertNewRecord(data) {
    var e=document.getElementById("isActive").checked;
        var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.id;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.name;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.phone;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.address;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = data.email;
    cell6 = newRow.insertCell(5);
    cell6.innerHTML = data.role;
    cell7 = newRow.insertCell(6);
    cell7.innerHTML = e ? '<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>'
    cell7 = newRow.insertCell(7);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;

  
}

function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    document.getElementById("isActive").checked = false;
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("id").value = selectedRow.cells[0].innerHTML;
    document.getElementById("name").value = selectedRow.cells[1].innerHTML;
    document.getElementById("phone").value = selectedRow.cells[2].innerHTML;
    document.getElementById("address").value = selectedRow.cells[3].innerHTML;
    document.getElementById("email").value = selectedRow.cells[4].innerHTML;
    document.getElementById("role").value = selectedRow.cells[5].innerHTML;
    if(selectedRow.cells[6].innerHTML == '<i class="fa fa-check" aria-hidden="true"></i>')
        {
            document.getElementById("isActive").checked=true;
        }
    else 
    {
        document.getElementById("isActive").checked=false;
    }
    
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.id;
    selectedRow.cells[1].innerHTML = formData.name;
    selectedRow.cells[2].innerHTML = formData.phone;
    selectedRow.cells[3].innerHTML = formData.address;
    selectedRow.cells[4].innerHTML = formData.email;
    selectedRow.cells[5].innerHTML = formData.role;
    selectedRow.cells[6].innerHTML = document.getElementById("isActive").checked ? '<i class="fa fa-check" aria-hidden="true"></i>':'<i class="fa fa-times" aria-hidden="true"></i>'
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}
function validate() {
    isValid = true;
    if (document.getElementById("id").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}