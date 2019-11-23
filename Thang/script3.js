
var selectedRow = null



function onFormSubmit() {
  
  //  insertNewRecord(formData);
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }
}
function readFormData() {
    var inputs = document.querySelectorAll('input[type="text"]');
    var myObject = {};
    for (var i = 0; i < inputs.length; i++) {
        myObject[inputs[i].id] = inputs[i].value;
       
      }
      myObject["category"] = document.getElementById("category").value;
      
      return myObject;
}

function insertNewRecord(myObject) {
    var inputs = document.querySelectorAll('input[type="text"]');
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    
    for (var i = 0; i < inputs.length; i++) {
     
      cell1 = newRow.insertCell(i);
        cell1.innerHTML =  myObject[inputs[i].id];
        
    }
    cell7 = newRow.insertCell(inputs.length);
    cell7.innerHTML =  myObject["category"];
    cell7 = newRow.insertCell(inputs.length+1);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}


function resetForm() {
    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }
    selectedRow = null;
}

function onEdit(td) {
    var inputs = document.querySelectorAll('input[type="text"]');
    selectedRow = td.parentElement.parentElement;
    for (var i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i].id).value = selectedRow.cells[i].innerHTML;
    }
    // document.getElementById("id").value = selectedRow.cells[0].innerHTML;
    // document.getElementById("category").value = selectedRow.cells[1].innerHTML;
    // document.getElementById("parentCategory").value = selectedRow.cells[2].innerHTML;
}
function updateRecord(formData) {
    var inputs = document.querySelectorAll('input[type="text"]');
    selectedRow = td.parentElement.parentElement;
    for (var i = 0; i < inputs.length; i++) {
        selectedRow.cells[i].innerHTML = formData[inputs[i].id];
    }
  //  selectedRow.cells[0].innerHTML = formData.id;
  //  selectedRow.cells[1].innerHTML = formData.category;
   // selectedRow.cells[2].innerHTML = formData.parentCategory;
  
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