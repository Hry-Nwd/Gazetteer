
//! ====== Functions ======

    //* Populates location Select
const popLocation = (element) => {
    $.ajax({
        url:"./libs/php/getAllLocations.php",
        type:"POST",
        dataType: 'json',

        success: function(result){
            $('#location').html(`<option value="all" selected>All Locations</option>`)
            result.data.forEach(datum => {
                element.append(`<option value="${datum.id}">${datum.name}</option>`)
                
            })
        }
    })
}
    //*Populates the Deparmtent select
const popDepartment = (element) => {
  
    $.ajax({
        url: "./libs/php/getAllDepartments.php",
        type:"POST",
        dataType: 'json',

        success: function(result){
           $('#department').html(`<option value="all" selected>All Departments</option>`)
            result.data.forEach(datum => {
                element.append(`<option value="${datum.id}">${datum.name}</option>`)
            })
        }
    })
}
function checkLocation(element, tarElement) {
    if (element.val() === "all") {
        $.ajax({
            url: "./libs/php/getAllDepartments.php",
            type: "POST",
            dataType: 'json',

            success: function (result) {
                result.data.forEach(datum => {
                    tarElement.append(`<option value="${datum.id}">${datum.name}</option>`);
                });
            }
        });
    } else {

        $.ajax({
            url: './libs/php/getDepartmentById.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: element.val()
            },

            success: function (result) {
                
                tarElement.html('');
                tarElement.append('<option value="all">All Departments</option>');
                result.data.forEach(datum => {
                    tarElement.append(`<option value="${datum.id}">${datum.name}</option>`);
                });
            }
        });
    }
}
    //*Checks the location for the selected department
function checkDepartment(element, tarElement) {
    if (element.val() === "all") {
        $.ajax({
            url: "./libs/php/getAllLocations.php",
            type: "POST",
            dataType: 'json',

            success: function (result) {
                tarElement.html('');
                tarElement.append('<option value="all">All Locations</option>');
                result.data.forEach(datum => {
                    tarElement.append(`<option value="${datum.id}">${datum.name}</option>`);
                });
            }
        });
        $.ajax({
            url: "./libs/php/getAllDepartments.php",
            type: "POST",
            dataType: 'json',

            success: function (result) {
                element.html('')
                element.append('<option value="all"> All Departments </option>')
                result.data.forEach(datum => {
                    element.append(`<option value="${datum.id}">${datum.name}</option>`);
                });
            }
        });

    } else {

        $.ajax({
            url: './libs/php/getLocationById.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: element.val()
            },

            success: function (result) {
                tarElement.html('');
                tarElement.append('<option value="all">All Locations </option>')
                result.data.forEach(datum => {
                    tarElement.append(`<option value="${datum.id}" selected> ${datum.name}</option>`);
                });
            }
        });
    }
}
    //* Search Function / Personnel Table Population
function personnelSearch(string) {
    if ($('#department').val() === "all"){
        department = '%'
    }else {
        department = $('#department').val()
    }

    if ($('#location').val() === "all"){
        place = '%'
    }else{
        place = $('#location').val()
    }

    $.ajax({
        url:"./libs/php/getAllBySearch.php",
        type: "POST",
        dataType: 'json',
        data: {
            string: string, 
            location: place,
            department: department
        },


        success: function(result) {
            $('#resultsTable').html('')
            result.data.forEach(function datum(value, i){
                //*Creates the tables
                $('#resultsTable').append(`
                <tr>
                    <td scope="row" class="d-table-cell">${i + 1}</td>
                    <td class="d-table-cell">${value.lastName}</td>
                    <td class="d-table-cell">${value.firstName}</td>
                    <td class="d-none d-lg-table-cell">${value.jobTitle}</td>
                    <td class="d-none d-lg-table-cell">${value.department}</td>
                    <td class=" d-none d-lg-table-cell">${value.location}</td>
                    <td class="d-none d-lg-table-cell">${value.email}</td>
                    <td class="d-none d-lg-table-cell text-center">
                        <button type="button" class="btn btn-outline-success" id="editBtn${i}" data-bs-toggle="modal" data-bs-target="#editModal">
                        Edit
                        </button>
                        <button type="button" class="btn btn-outline-danger" id="deleteBtn${i}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        Delete
                        </button>
                        </td>
                    <td class="text-center d-lg-none"><button class="btn btn-outline-success " id="actionBtn${i}" data-bs-toggle="modal" data-bs-target="#infoModal" >&#8942;</button></td>
                </tr>
                `)

                $(`#editBtn${i}`).on("click", () => {
                    modalFill(value.id)
                })
                $(`#actionBtn${i}`).on("click", () => {
                    modalFill(value.id)
                })

                $(`#deleteBtn${i}`).on("click", () => {
                    modalFill(value.id)
                })
            })
        }
    })
}
function departmentTablePop(){
    $('#departmentTable').html('')
     $.ajax({
         url: "./libs/php/getDepartmentsByLocation.php",
         type: "POST",
         data: "json",
 
         success: function(results){

             results.data.forEach(function (value, i ){
             
                 $.ajax({
                     url: './libs/php/getDepartmentSize.php',
                     type: 'POST',
                     dataType: 'json',
                     data: {
                         id: value.departmentId
                     },
                     
                     success: function (result) {
                      
                         $('#departmentTable').append(`
                         <tr>
                         <td scope="row" class="d-table-cell">${i + 1}</td>
                         <td class="d-table-cell">${value.name}</td>
                         <td class="d-table-cell">${result.data.length}</td>
                         <td class="d-table-cell">${value.locationName}</td>
                         <td class="d-table-cell"><button class="btn depDeleteBtn${i} btn-outline-danger me-2" id="deleteBtn${i}"   data-bs-toggle="modal"
                         data-bs-target="#deleteModal"
                         data-bs-dismiss="modal">Delete</button>
                         </tr>
                         
                         `)
                         
                         $(`#deleteBtn${i}`).on('click', () => {
                             departmentModalFill(value.departmentId, value.name)
                         })
                     }
                 })
             })
         }
     })
 }
function locationTablePop(){
    $('#locationsTable').html('')
    $.ajax({
        url: "./libs/php/getAllLocations.php",
        type: "POST",
        data: "json",

        success: function(result){
            
             result.data.forEach((value, i) => {
                $.ajax({
                    url: "./libs/php/getDepartmentById.php",
                    type: 'POST',
                    dataType: 'json',
                    data:{
                        id: value.id
                  },

                  success: function(result){
                      $('#locationsTable').append(`
                      <tr>
                      <td scope="row" class="d-table-cell">${i + 1}</td>
                      <td class="d-table-cell">${value.name}</td>
                      <td class="d-table-cell">${result.data.length}</td>
                      <td class="d-table-cell"><button class="btn btn-outline-danger me-2 " id="locDeleteBtn${i}" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                      </tr>
                      `)

                      $(`#locDeleteBtn${i}`).click(() => {
                        locationModalFill(value.id)
                      })
                    }
                })
            })
        }
    })
}

    //*Sets the  modals
function modalFill(id){
    $.ajax({
        url: "./libs/php/getPersonnel.php",
        type: "POST",
        dataType:"json",
        data: {
            id: id
        },

        success: (results)=> {
            

            //*Checks over the departments returned and filters against the employees department to ensure no mutiple department select in the dropdown
            let departments = results.data.department
            const employeeDepartment = [{
                id: results.data.personnel[0].departmentID,
                name: results.data.personnel[0].department
            }]

            const employeeDepartmentName = employeeDepartment[0].name;
            const filteredDep = departments.filter(({name}) => name !== employeeDepartmentName)

            //*edit Modal
            $('#editModalDepartment').html('')
            filteredDep.forEach(datum => {
                $('#editModalDepartment').append(`<option value="${datum.id}">${datum.name}</option>`)
            })
            $('#editModalTitle').html(`${results.data.personnel[0].firstName} ${results.data.personnel[0].lastName}`)
            $('#editModalJobTitle').val(`${results.data.personnel[0].jobTitle}`)
            $('#editModalEmail').val(`${results.data.personnel[0].email}`)
            $('#editModalDepartment').append(`<option value="${results.data.personnel[0].departmentID}" selected>${results.data.personnel[0].department}</option>`)
            $('#editModalFooter').html(` 
                <button type="button" class="btn btn-outline-success" id="submitEdit" data-bs-toggle="modal" data-bs-target="#successModal" data-bs-dismiss="modal" >
                    Save changes
                </button>
                <button
                type="button"
                class="btn btn-outline-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>`)

            //*info Modal
            
            $('#infoModalTitle').html(`${results.data.personnel[0].firstName} ${results.data.personnel[0].lastName}`)
            $('#infoModalJobTitle').html(`${results.data.personnel[0].jobTitle}`)
            $('#infoModalEmail').html(`${results.data.personnel[0].email}`)
            $('#infoModalDepartment').html(`${results.data.personnel[0].department}`)
            $('#infoModalLocation').html(`${results.data.personnel[0].location}`)

            //* delete Modal
            $('#deleteModalName').html(`${results.data.personnel[0].firstName} ${results.data.personnel[0].lastName}`)
            $('#deleteModalFooter').html(`
            <button
                type="button"
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#successModal"
                data-bs-dismiss="modal"
                id="confirmDelete"
                >
                Yes
            </button>
            <button
              type="button"
              class="btn btn-outline-success"
              data-bs-dismiss="modal"
            >
              No
            </button>`)

            $('#submitEdit').on('click', () => {
                editEmployee(id, `${results.data.personnel[0].firstName} ${results.data.personnel[0].lastName}`)
            })
            $('#confirmDelete').on('click', () => {
                deleteEmployee(id, `${results.data.personnel[0].firstName} ${results.data.personnel[0].lastName}`)
            })
           
        }
    })
}
function departmentModalFill(id){
    $.ajax({
        url: "./libs/php/searchDepartmentById.php",
        type: "POST",
        dataType:"json",
        data: {
            id: id
        },

        success: (results)=> {
            console.log(results.data)
            //* delete Modal
            $('#deleteModalName').html(`${results.data[0].name}`)
            $('#deleteModalFooter').html(`
            <button
                type="button"
                class="btn btn-outline-danger"
                data-bs-toggle="modal"
                data-bs-target="#successModal"
                data-bs-dismiss="modal"
                id="confirmDelete"
                >
                Yes
            </button>
            <button
              type="button"
              class="btn btn-outline-success"
              data-bs-dismiss="modal"
            >
              No
            </button>`)

            $('#confirmDelete').on('click', () => {
                console.log("x")
                checkDepSize(id, `${results.data[0].name}`)
            })
           
        }
    })
}
function locationModalFill(id){
        $.ajax({
            url: "./libs/php/searchLocationById.php",
            type: "POST",
            dataType:"json",
            data: {
                id: id
            },
    
            success: (results)=> {
                console.log(results.data)
                //* delete Modal
                $('#deleteModalName').html(`${results.data[0].name}`)
                $('#deleteModalFooter').html(`
                <button
                    type="button"
                    class="btn btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#successModal"
                    data-bs-dismiss="modal"
                    id="confirmDelete"
                    >
                    Yes
                </button>
                <button
                  type="button"
                  class="btn btn-outline-success"
                  data-bs-dismiss="modal"
                >
                  No
                </button>`)
    
                $('#confirmDelete').on('click', () => {
                   deleteLocation(results.data[0].id, `${results.data[0].name}`)
                })
               
            }
        })
    }

    //*edit Employee Function
function editEmployee(id, name){
    $.ajax({
        url: "./libs/php/editPersonnelById.php",
        type: "POST",
        dataType: "json",
        data:{
            id: id,
            jobTitle: $('#editModalJobTitle').val(),
            email: $('#editModalEmail').val(),
            departmentID: $('#editModalDepartment').val()
        },
        success: () => {
            personnelSearch("")
            $('#successModalBody').html(`${name}'s record has successfully been updated`)
        }
    })
}
    //*Delete Employee Function
function deleteEmployee(id, name){
    $.ajax({
        url: "./libs/php/deletePersonnelById.php",
        type: "POST",
        dataType: "json",
        data:{
            id: id
        },
        success: () => {
            personnelSearch("")
            $('#successModalBody').html(`${name} was successfully deleted from the database`)
        }
    })
}
    //*function to check if a department has 0 dependencies, and delete the department if it has 0
function checkDepSize(id, name){
        $.ajax({
            url: "./libs/php/getDepartmentSize.php",
            type: "POST",
            dataType: "json",
            data:{
                id: id
            },
    
            success: (results) => {
                
                if(results.data.length >= 1){
                    $('#successModal').modal('toggle')
                    $('#successModalBody').html(`Please remove all dependencies before removing the department`)
                } else {
                    $.ajax({
                        url: "./libs/php/deleteDepartmentByID.php",
                        type: "POST",
                        dataType: "json",
                        data:{
                            id: id
                        },
                
                        success: (results) => {
                            $('#successModal').modal('toggle')
                            $('#successModalBody').html(`${name} was successfully removed from the database`)
                        }
                    })
                }
            }
        })
}

function deleteLocation(id, name){
    $.ajax({
        url: "./libs/php/getLocationSize.php",
        type: "POST",
        dataType: "json",
        data:{
            id: id
        },

        success: (results) => {
            
            if(results.data.length >= 1){
                $('#successModal').modal('toggle')
                $('#successModalBody').html(`Please remove all dependencies before removing the location`)
            } else {
                $.ajax({
                    url: "./libs/php/deleteLocationByID.php",
                    type: "POST",
                    dataType: "json",
                    data:{
                        id: id
                    },
            
                    success: (results) => {
                        $('#successModal').modal('toggle')
                        $('#successModalBody').html(`${name} was successfully removed from the database`)
                    }
                })
            }
        }
    })
}

    //*Change Tab Function
function changeTab(element){
    $('.results').removeClass('show')
    element.addClass('show')
}
//! ====== Event Listeners ======
    //* Change Tab Event Listeners
$('#departments').on('click',() => {
    $('.nav-link').removeClass('active');
    $('#departments').addClass('active');
    changeTab($('#departmentsTable'))
})
$('#locations').on('click',() => {
    $('.nav-link').removeClass('active');
    $('#locations').addClass('active');
    changeTab($('#locationTable'))
})
$('#personnel').on('click',() => {
    $('.nav-link').removeClass('active');
    $('#personnel').addClass('active');
    changeTab($('#personnelTable'))
})
    //*Listens for location change and populates department select
$('#location').on('change', () => {
    checkLocation($('#location'), $('#department'))
    personnelSearch($('#searchInput').val())
})

    //*Listens for Department change and populates location select
$('#department').on('change', () => {
    checkDepartment($('#department'), $('#location'))
    personnelSearch($('#searchInput').val())
})
    //*runs the search function with the value in the search input
$('#searchInput').on('change', () => {
    personnelSearch($('#searchInput').val())
})

    //*Adds an employee after form validation
$('#confirmAddBtn').on("click", () => {
    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                console.log("stopped")
              }else {
                  event.preventDefault()
                $.ajax({
                    url: "./libs/php/insertPersonnel.php",
                    type: "POST",
                    dataType:"json",
                    data:{
                        firstName: $('#firstName').val(),
                        lastName: $('#lastName').val(),
                        jobTitle: $('#jobTitle').val(),
                        email: $('#email').val(),
                        departmentId: $('#personnelDepartmentAdd').val()
                    },
            
                    success: function(results){
                        $('#successModalBody').html(`${$('#firstName').val()} ${$('#lastName').val()} was successfully added to the database`)
                        $('#successModal').modal('toggle')
                        $('#addEmployeeModal').modal('toggle')
                        popAll()

                    }
                })
              }
      
              form.classList.add('was-validated')
                
            }, false)
          })
      })()
  })

$('#confirmAddDepBtn').on("click", () => {
    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                console.log("stopped")
              }else {
                event.preventDefault()
                $.ajax({
                    url: "./libs/php/insertDepartment.php",
                    type: "POST",
                    dataType:"json",
                    data:{
                        name: $('#departmentName').val(),
                        locationID: $('#departmentLocationAdd').val()
                    },
            
                    success: function(results){
                        $('#successModalBody').html(`${$('#departmentName').val()} was successfully added to the database`)
                        $('#successModal').modal('toggle')
                        $('#addDepartmentModal').modal('toggle')
                        popAll()
                    }
                })
              }
      
              form.classList.add('was-validated')
                
            }, false)
          })
      })()
})

$('#confirmAddLocBtn').on("click", () => {
    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                console.log("stopped")
              }else {
                event.preventDefault()
                $.ajax({
                    url: "./libs/php/insertLocation.php",
                    type: "POST",
                    dataType:"json",
                    data:{
                        name: $('#locationName').val(),
                      
                    },
            
                    success: function(results){
                        $('#successModalBody').html(`${$('#locationName').val()} was successfully added to the database`)
                        $('#successModal').modal('toggle')
                        $('#addLocationModal').modal('toggle')
                        popAll()
                    }
                })
              }
      
              form.classList.add('was-validated')
                
            }, false)
          })
      })()
})
$('#successClose').click(function(){
    location.reload()
})


//! ====== $().ready ======
$().ready( () => {
    personnelSearch("")
    departmentTablePop()
    locationTablePop()

    popDepartment($('#personnelDepartmentAdd'))
    popLocation($('#departmentLocationAdd'))
    
    popDepartment($('#department'))
    popLocation($('#location'))
    
   
})