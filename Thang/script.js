var selectedRow = null
var parentCatList = [{id:0,name:"None",isParent:true}];
var select = document.getElementById("parentCategory");
var option =document.createElement("option");
option.value=parentCatList[0].id;
option.innerHTML=parentCatList[0].name;
parentCatList[0].isParent ? option.disabled=false:option.disabled=true;
select.add(option);


function onFormSubmit() {
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
    var formData = {};
    formData["id"] = document.getElementById("id").value;
    formData["category"] = document.getElementById("category").value;
   
    formData["parentCategory"] = document.getElementById("parentCategory").value;
    if(formData.parentCategory == 0) 
    {   
        var temp = {id:formData.id,name:formData.category,isParent:true}
        parentCatList.push(temp);
        
    }
    else{
        var temp = {id:formData.id,name:formData.category,isParent:false}
        parentCatList.push(temp);
    }
    select.innerHTML='<option selected="selected" disabled="disabled">Choose Parent Category</option>';
    parentCatList.forEach(element => {
       
        var option =document.createElement("option");
        option.value=element.id;
        element.isParent ? option.innerHTML="--"+element.name:option.innerHTML=element.name;
        element.isParent ? option.disabled=false:option.disabled=true;

        select.add(option);
    });
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.id;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.category;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.parentCategory;
   
    cell3 = newRow.insertCell(3);
    cell3.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}
function findParent(id){
    console.log(id);
    parentCatList.forEach(element => {
       if(element.id == id)
        {
           
            if(element.isParent)
            {
               var string1 ="parent";
                return string1;
            }
           
               
            else
            {console.log(id);return element.name;}
            
        }
     
    });
}
function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("category").value = "";
    document.getElementById("parentCategory").value = "";
  
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("id").value = selectedRow.cells[0].innerHTML;
    document.getElementById("category").value = selectedRow.cells[1].innerHTML;
    document.getElementById("parentCategory").value = selectedRow.cells[2].innerHTML;
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.id;
    selectedRow.cells[1].innerHTML = formData.category;
    selectedRow.cells[2].innerHTML = formData.parentCategory;
  
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