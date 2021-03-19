//! ------- Globals ------
let department = "";
let place = "";

//!------ Functions ------
    //*Populates the location select
const popLocation = (element) => {
    $.ajax({
        url:"./libs/php/getAllLocations.php",
        type:"POST",
        dataType: 'json',

        success: function(result){
            result.data.forEach(datum => {
                element.append(`<option value="${datum.id}">${datum.name}</option>`)
            })
        }
    })
}
    //*Populates the Deparmtent select
const popDepartment = (element) => {
    $.ajax({
        url:"./libs/php/getAllDepartments.php",
        type:"POST",
        dataType: 'json',

        success: function(result){
           
            result.data.forEach(datum => {
                element.append(`<option value="${datum.id}">${datum.name}</option>`)
            })
        }
    })
}
    //*Populates all the tables and select values
function popAll(file){
    $('#resultsTable').html('')
    $('#locationsTable').html('')
    $('#departmentTable').html('')
    personnelTablePop(file)
    locationTablePop()
    departmentTablePop()
    popDepartment($('#department'))
    popLocation($('#location'))
}
    //* Populates personnel table
function personnelTablePop(file){
    $('#resultsTable').html('')
    $.ajax({
        url: `./libs/php/${file}.php`,
        type: "POST",
        dataType: 'json',
        
        success: function(result) {
            result.data.forEach(function datum(value, i){
                //*Creates the tables
                $('#resultsTable').append(`
                <tr>
                  <th scope="row" class="d-table-cell">${i + 1}</th>
                  <td class="d-table-cell">${value.lastName}</td>
                  <td class="d-table-cell">${value.firstName}</td>
                  <td class="d-none d-lg-table-cell">${value.jobTitle}</td>
                  <td class="d-none d-lg-table-cell">${value.department}</td>
                  <td class=" d-none d-lg-table-cell">${value.location}</td>
                  <td class="d-none d-lg-table-cell">${value.email}</td>
                  <td class="d-none d-lg-table-cell"><button class="btn me-2 btn-outline-success editBtn${i}" id="">Edit</button><button class="btn btn-outline-danger me-2 deleteBtn${i}" id="">Delete</button></td>
                  <td class="text-center d-lg-none"><button class="btn btn-outline-success" id="btn${i}">&#8942;</button></td>
                  </tr>
                `)
                //* Adds the more information tab
                $(`#btn${i}`).on('click', () => {
                    $('#moreInfo').html(`
                    <div id="editEmployee"></div>
                    <div id="deleteEmployee"></div>
                    <div id="deleteDepartment"></div>
                    <div id="deleteLocation"></div>
                    <div id="addEmployee"></div>
                    <div id="addDepartment"></div>
                    <div id="addLocation"></div>
                    <div class="card collapse" style="width: 18rem;" id="card${i}">
                        <div class="card-body">
                        <button type="button" class="btn-close" aria-label="Close" style="float: right"></button>
                        <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Job Title</strong>: ${value.jobTitle}</li>
                        <li class="list-group-item"><strong>Department</strong>: ${value.department}</li>
                        <li class="list-group-item"><strong>Location</strong>: ${value.location}</li>
                        <li class="list-group-item"><strong>Email</strong>: ${value.email}</li>
                        </ul>
                        <div class="card-body row justify-content-center">
                            <button role="button" id="" class="col-5 editBtn${i} me-1 btn btn-outline-success">Edit Employee</button>
                            <button role="button" id="deleteBtn${i}" class="col-5 me-1 btn btn-outline-danger deleteBtn${i}">Delete Employee</button>    
                        </div>
                    </div>
                    `)
                    $(`#card${i}`).addClass('show')
                    $('#moreInfo').addClass('show')
                    $('.btn-close').on('click', () => {
                        $(`#card${i}`).removeClass('show')
                        $('#moreInfo').removeClass('show')
                    })
                    //*Adds the edit tab
                    $(`.editBtn${i}`).on('click', () => {
                    $('#editEmployee').addClass('show')
                    $('#moreInfo').addClass('show')
                    $('#deleteEmployee').removeClass('show')
                    $(`#card${i}`).removeClass('show')
                    $('#editEmployee').html(`
                    <div class="card" style="width: 18rem;" id="editCard${i}">
                        <div class="card-body">
                        <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                        <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                        <div class="input-group me-2 mb-3">
                        <span class="input-group-text">Email</span>
                          <input type="text" id="email${i}" class="form-control" value="${value.email}" aria-label="Email" aria-described-by="basic-addon${i+1}">
                        </div>
                        <div class="input-group me-2 mb-3">
                        <span class="input-group-text">Job Title</span>
                          <input type="text" class="form-control" id="jobTitle${i}" value="${value.jobTitle}" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                        </div>
                        <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                        <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                        </ul>
                        <div class="card-body row justify-content-center">
                            <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                        </div>
                    </div>
                `)
                $(`#confirmEditBtn${i}`).on('click', () => {
                  
                  editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId, `${value.firstName} ${value.lastName}`)
                  
              })
                        //*populates the edit location and department selects
                  popLocation($('#locationEdit'))
                  popDepartment($('#departmentEdit'))
                  
                  $('#departmentEdit').on('change', () => {
                      checkDepartment($('#departmentEdit'), $('#locationEdit'))
                    })
                    $('#locationEdit').on('change', () => {
                        checkLocation($('#locationEdit'), $('#departmentEdit'))
                    })
                    
                    $(`.btn-close`).on('click', () => {
                      $(`#editCard${i}`).removeClass('show')
                      $('#editEmployee').removeClass('show')
                      $('#deleteEmployee').removeClass('show')
                      $('#moreInfo').removeClass('show')
                    })
    
                    }) 
                    $(`.deleteBtn${i}`).on('click', () => {
                        $('#deleteEmployee').addClass('show')
                        $(`#card${i}`).removeClass('show')
                        $('#moreInfo').addClass('show')
                        $('#deleteEmployee').html(`
                            <div class="card" style="width: 18rem;" id="editCard${i}">
                            <div class="card-body">
                            <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                            <p>Are you sure you want to remove ${value.firstName} ${value.lastName} from the database?</p>
                            <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                            <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 abort btn btn-outline-danger"> No </button>
                            </div>
                        `)
                        $('.btn-close').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                        })

                        $('.abort').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                        })

                        $(`#confirmDeleteBtn${i}`).on('click', () => {
                            $.ajax({
                                url: "./libs/php/deletePersonnelById.php",
                                type: "POST",
                                dataType: "json",
                                data:{
                                    id: value.id
                                },

                                success: function(result){
                                    alert(`${value.firstName} ${value.lastName} has been removed from the database`)
                                    $('#deleteEmployee').removeClass('show')
                                    $('#moreInfo').removeClass('show')
                                    $('#resultsTable').html('')
                                    personnelTablePop("getAll")
                                   
                                }
                            })
                        })
                    }) 
                })


                $('.btn-close').on('click', () => {
                    $(`#card${i}`).removeClass('show')
                    $('#moreInfo').removeClass('show')
                    $('#deleteEmployee').removeClass('show')
                })

               $(`.deleteBtn${i}`).on('click', () => {
                   $('#deleteEmployee').addClass('show')
                   $('#moreInfo').addClass('show')
                   $('#deleteEmployee').html(`
                    <div class="card" style="width: 18rem;" id="editCard${i}">
                   <div class="card-body">
                   <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                   <p>Are you sure you want to remove ${value.firstName} ${value.lastName} from the database?</p>
                   <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                   <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 abort btn btn-outline-danger"> No </button>
                   </div>
                   `)
                   $('.btn-close').on('click', () => {
                    $('#deleteEmployee').removeClass('show')
                    $('#moreInfo').removeClass('show')
                    })

                    $('.abort').on('click', () => {
                        $('#deleteEmployee').removeClass('show')
                        $('#moreInfo').removeClass('show')
                        })

                $(`#confirmDeleteBtn${i}`).on('click', () => {
                    $.ajax({
                        url: "./libs/php/deletePersonnelById.php",
                        type: "POST",
                        dataType: "json",
                        data:{
                            id: value.id
                        },

                        success: function(result){
                            alert(`${value.firstName} ${value.lastName} has been removed from the database`)
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                            $('#resultsTable').html('')
                            personnelTablePop("getAll")
                           
                        }
                    })
                })
               }) 
                
              $(`.editBtn${i}`).on('click', () => {
                  $('#editEmployee').addClass('show')
                  $('#moreInfo').addClass('show')
                  $('#deleteEmployee').removeClass('show')
                  $(`#card${i}`).removeClass('show')
                  $('#editEmployee').html(`
                  <div class="card" style="width: 18rem;" id="editCard${i}">
                      <div class="card-body">
                      <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                      <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                      </div>
                      <ul class="list-group list-group-flush">
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Email</span>
                        <input type="text" id="email${i}" class="form-control" value="${value.email}" aria-label="Email" aria-described-by="basic-addon${i+1}">
                      </div>
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Job Title</span>
                        <input type="text" class="form-control" id="jobTitle${i}" value="${value.jobTitle}" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                      </div>
                      <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                      <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                      </ul>
                      <div class="card-body row justify-content-center">
                          <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                      </div>
                  </div>
              `)
              $(`#confirmEditBtn${i}`).on('click', () => {
                editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId, `${value.firstName} ${value.lastName}`)
           
            })
              popLocation($('#locationEdit'))
              popDepartment($('#departmentEdit'))
              
              $('#departmentEdit').on('change', () => {
                  checkDepartment($('#departmentEdit'), $('#locationEdit'))
                })
                $('#locationEdit').on('change', () => {
                    checkLocation($('#locationEdit'), $('#departmentEdit'))
                })
                $(`.btn-close`).on('click', () => {
                  $(`#editCard${i}`).removeClass('show')
                  $('#editEmployee').removeClass('show')
                  $('#moreInfo').removeClass('show')
                })

         
                
              }) 
            })  
        }
    })
}

    //*Populates locaitons table
function locationTablePop(){
    $('#locationsTable').html('')
    $.ajax({
        url: "./libs/php/getAllLocations.php",
        type: "POST",
        data: "json",

        success: function(results){
            results.data.forEach(function (value, i ){
                $.ajax({
                    url: './libs/php/getDepartmentById.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: value.id
                    },
        
                    success: function (result) {
                    
                        
                        $('#locationsTable').append(`
                        <tr>
                        <th scope="row" class="d-table-cell">${i + 1}</th>
                        <td class="d-table-cell">${value.name}</td>
                        <td class="d-table-cell">${result.data.length}</td>
                        <td class="d-table-cell"><button class="btn btn-outline-danger me-2 locDeleteBtn${i}" id="">Delete</button>
                        </tr>
                        
                        `)
                        $(`.locDeleteBtn${i}`).on('click', () => {
                            $('#deleteLocation').addClass('show')
                            $('#moreInfo').addClass('show')
                            $('#deleteLocation').html(`
                                <div class="card" style="width: 18rem;" id="editCard${i}">
                                <div class="card-body">
                                <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                                <p>Are you sure you want to remove ${value.name} from the database?</p>
                                <button role="button" id="locationDeleteConfirm${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                                <button role="button" id="abortDeleteBtn${i}" class="col-5 abort me-1 btn btn-outline-danger"> No </button>
                                </div>
                            `)

                            $(`#locationDeleteConfirm${i}`).on('click', () => {
                                console.log("x")
                                if(!result.data.length < 1){
                                    alert('Please remove all dependencies before deleting a location')
                                } else {

                                    
                                    $.ajax({
                                        url: "./libs/php/deleteLocationById.php",
                                        type: "POST",
                                        dataType: 'json',
                                        data: {
                                            id: value.id
                                        },
                                        
                                        success: function(results){
                                            $('#deleteLocation').removeClass('show')
                                            $('#deleteLocation').html('')
                                            $('#locationsTable').html('')
                                            $('#moreInfo').removeClass('show')
                                            alert(`${value.name} was succesfully from the database`)

                                            locationTablePop()
                                        }
                                    })
                                }
                            })
                            $('.btn-close').on('click', () => {
                                $('#deleteLocation').removeClass('show')
                                $('#deleteLocation').html('')
                                $('#moreInfo').removeClass('show')
                            })

                            $('.abort').on('click', () => {
                                $('#deleteLocation').removeClass('show')
                                $('#deleteLocation').html('')
                                $('#moreInfo').removeClass('show')
                            })
                        })
                    }
                })
            })
        }
    })
}

    //*Popluates department table
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
                        <th scope="row" class="d-table-cell">${i + 1}</th>
                        <td class="d-table-cell">${value.name}</td>
                        <td class="d-table-cell">${result.data.length}</td>
                        <td class="d-table-cell">${value.locationName}</td>
                        <td class="d-table-cell"><button class="btn depDeleteBtn${i} btn-outline-danger me-2" id="deleteBtn${i}">Delete</button>
                        </tr>
                        
                        `)
                        $(`.depDeleteBtn${i}`).on('click', () => {
                            $('#deleteDepartment').addClass('show')
                            $('#moreInfo').addClass('show')
                            $('#deleteDepartment').html(`
                                <div class="card" style="width: 18rem;" id="editCard${i}">
                                <div class="card-body">
                                <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                                <p>Are you sure you want to remove ${value.name} from the database?</p>
                                <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                                <button role="button" id="abortDeleteBtn${i}" class="col-5 abort me-1 btn btn-outline-danger"> No </button>
                                </div>
                            `)
                            $('.btn-close').on('click', () => {
                                $('#deleteDepartment').removeClass('show')
                                $('#deleteDepartment').html('')
                                $('#moreInfo').removeClass('show')
                            })

                            $('.abort').on('click', () => {
                                $('#deleteDepartment').removeClass('show')
                                $('#deleteDepartment').html('')
                                $('#moreInfo').removeClass('show')
                            })

                            $(`#confirmDeleteBtn${i}`).on('click', () => {

                                if(result.data.length < 1){

                                    $.ajax({
                                        url: "./libs/php/deleteDepartmentByID.php",
                                        type: "POST",
                                    
                                        dataType: "json",
                                        data:{
                                            id: value.departmentId
                                        },

                                        success:function(success){
                                            $('#departmentTable').html('')
                                            departmentTablePop()
                                            $('#deleteDepartment').removeClass('show')
                                            $('#deleteDepartment').html('')
                                            $('#moreInfo').removeClass('show')
                                            alert(`${value.name} was successfully deleted from the database `)
                                        }
                                    
                                    })
                                } else{
                                    alert('Please remove all employees from the department before deleting the department')
                                }
                            })
                        }) 
                    }
                });
            })
        }
    })
}
    //* takes in arguments and calls the edit personnel routine 
function editPersonnel(id, jobTitle,email, depId, defaultDepID, name){

    if(depId === "all"){
        depId = defaultDepID
    }



    $.ajax({
        url: "./libs/php/editPersonnelById.php",
        type: "POST",
        dataType:"json",
        data:{
            id: id,
            jobTitle: jobTitle,
            email: email,
            departmentID: depId
        },

        success: function(result){
            console.log("success")
            alert(`${name}'s records have been updated`)
            $('#editEmployee').removeClass('show')
            $('#deleteEmployee').removeClass('show')
            $('#moreInfo').removeClass('show')
            popAll("getAll")
        }
    })
}

    //*Checkes the location for departments at the location
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
            url: "http://localhost/companydirectory/libs/php/getAllDepartments.php",
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

    //*changes the selected tab
function changeTab(element){
    $('.results').removeClass('show')
    element.addClass('show')
}
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

//! ------ Event Listeners ------
    //*--- Listens for location change and populates department select by location id
$('#location').on('change', () => {
    checkLocation($('#location'), $('#department'))
})

    //*Listens for Department change and populates location select
$('#department').on('change', () => {
    checkDepartment($('#department'), $('#location'))
})



 //* Creating new entrees into the databse
$('#newPersonnel').on('click', () => {
    $('#addEmployee').html('')
    $('#moreInfo').addClass('show')
    $('#addEmployee').addClass('show')
    $('#addEmployee').append(`
        <div class="card text-center" style="width: 28rem;" id="">
        <button class="btn btn-close"></button>
        <h5 class="card-title">New Employee</h5>
            <div class="card-body">
            <form class="row g-3 needs-validation justify-content-center" novalidate>
                <div class="col-md-4">
                    <label for="firstName" class="form-label">First name</label>
                    <input type="text" class="form-control" id="firstName" value="" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="lastName" class="form-label">Last name</label>
                    <input type="text" class="form-control" id="lastName" value="" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                <div class="col-md-5">
                    <label for="jobTitle" id="jobTitlePrepend" class="form-label">Job Title</label>
                    <div class="input-group has-validation">
                        <input type="text" class="form-control" id="jobTitle" aria-describedby="jobTitlePrepend" required>
                        <div class="invalid-feedback">
                            Please enter a Job Title.
                        </div>
                    </div>
                </div>
                <div class="col-md-10">
                    <label for="Email" class="form-label">Email</label>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="emailPrepend">@</span>
                        <input type="text" class="form-control" id="email" aria-describedby="emailPrepend" required>
                        <div class="invalid-feedback">
                            Please enter an email.
                        </div>
                    </div>
                </div>
                <div class="col-md-5">
                    <label for="personnelDepartmentAdd" class="form-label">Department</label>
                    <select class="form-control" id="personnelDepartmentAdd"></select>
                    <div class="invalid-feedback">
                        Please Select a department.
                    </div>
                </div>
                <div class="col-md-5">
                    <label for="personnelLocationAdd" class="form-label">Location</label>
                    <select class="form-select" id="personnelLocationAdd" required>
                    </select>
                    <div class="invalid-feedback">
                        Please select a valid location.
                    </div>
                </div>
                <div class="col-12 text-center">
                    <button class="btn btn-outline-success" id="confirmAddBtn" type="submit">Submit form</button>
                </div>
            </form>
        </div>
    </div>


`)

popLocation($('#personnelLocationAdd'))
popDepartment($('#personnelDepartmentAdd'))

$('#personnelDepartmentAdd').on('change', () => {
    checkDepartment($('#personnelDepartmentAdd'), $('#personnelLocationAdd'))
  })
  $('#personnelLocationAdd').on('change', () => {
      checkLocation($('#personnelLocationAdd'), $('#personnelDepartmentAdd'))

  })
  //*bootstrap form validation
  $('#confirmAddBtn').on("click", () => {
    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('click', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                console.log("stopped")
              }else {
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
                        alert(`${$('#firstName').val()} ${$('#lastName').val()} was successfully added into the database`)
                        $(`#addEmployee`).removeClass('show')
                        $('#moreInfo').removeClass('show')
                        $('#resultsTable').html('')
                        personnelTablePop("getAll");
                    }
                })
              }
      
              form.classList.add('was-validated')
                
            }, true)
          })
      })()
  })
    $('.btn-close').on('click', () => {
        $(`#addEmployee`).removeClass('show')
        $('#moreInfo').removeClass('show')
    })

})
$('#newDepartment').on('click', () => {
    $('#addDepartment').html('')
    $('#moreInfo').addClass('show')
    $('#addDepartment').addClass('show')
    $('#addDepartment').append(`
    <div class="card text-center" style="width: 28rem;" id="">
    <button class="btn btn-close"></button>
    <h5 class="card-title">New Department</h5>
        <div class="card-body">
        <form class="row g-3 needs-validation justify-content-center" novalidate>
            <div class="col-md-6">
                <label for="departmentName" class="form-label">Department Name</label>
                <input type="text" class="form-control" id="departmentName" value="" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="col-md-8">
                <label for="deapartmentLocationAdd" class="form-label">Location</label>
                <select class="form-select" id="departmentLocationAdd" required>
                </select>
                <div class="invalid-feedback">
                    Please select a valid location.
                </div>
            </div>
            <div class="col-12 text-center">
                <button class="btn btn-outline-success" id="confirmAddDepartment" type="submit">Submit form</button>
            </div>
        </form>
    </div>
</div>
    `)
    //*Populates the location select when adding a new department
    popLocation($('#departmentLocationAdd'))

    //*bootstrap form validation
    $('#confirmAddDepartment').on('click', () => {
        (function () {
            'use strict'
          
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.needs-validation')
          
            // Loop over them and prevent submission
            Array.prototype.slice.call(forms)
              .forEach(function (form) {
                form.addEventListener('click', function (event) {
                  if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log("stopped")
                  }else {
                    $.ajax({
                        url: "./libs/php/insertDepartment.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            name: $('#departmentName').val(),
                            locationId: $('#departmentLocationAdd').val()
                        },
                
                        success: function(result){
                            departmentTablePop()
                            $(`#addDepartment`).removeClass('show')
                            $('#moreInfo').removeClass('show')
                            alert(`${$('#departmentName').val()} was successfully added to the database `)
                            $('#departmentTable').html('')
                            popDepartment()
                            locationTablePop()
                        }
                
                    })
                  }
          
                  form.classList.add('was-validated')
                    
                }, true)
              })
          })()
 
    })
    
    $('.btn-close').on('click', () => {
        $(`#addDepartment`).removeClass('show')
        $('#moreInfo').removeClass('show')
    })

})

$('#newLocation').on('click', () => {
    $('#addLocation').html('')
    $('#moreInfo').addClass('show')
    $('#addLocation').addClass('show')
    $('#addLocation').append(`
    <div class="card text-center" style="width: 28rem;" id="">
    <button class="btn btn-close"></button>
    <h5 class="card-title">New Location</h5>
        <div class="card-body">
        <form class="row g-3 needs-validation justify-content-center" novalidate>
            <div class="col-md-6">
                <label for="locationName" class="form-label">Location Name</label>
                <input type="text" class="form-control" id="locationName" value="" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="col-12 text-center">
                <button class="btn btn-outline-success" id="confirmAddLocation" type="submit">Submit form</button>
            </div>
        </form>
    </div>
</div>
    `)
    $('#confirmAddLocation').on('click', () => {
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
                    $.ajax({
                        url: "./libs/php/insertLocation.php",
                        type: "POST",
                        dataType: "json",
                        data:{
                            name: $('#locationName').val()
                        },
                
                        success: function(){
                            $(`#addLocation`).removeClass('show')
                            $('#moreInfo').removeClass('show')
                            alert(`${$('#locationName').val()} was successfully added to the database`)
                            $('#locationsTable').html('')
                            popLocation("#locations")
                            locationTablePop()
                        }
                    })
                  }
          
                  form.classList.add('was-validated')
                    
                }, true)
              })
          })()
 
    })

    
    $('.btn-close').on('click', () => {
        $(`#addLocation`).removeClass('show')
        $('#moreInfo').removeClass('show')
    })

})
//* search function
$('#search').on('click', () => {
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
            string: $('#searchInput').val(), 
            location: place,
            department: department
        },


        success: function(result) {
        console.log(result.data)
        $('#resultsTable').html('')
            if(result.data.length === 0){
                $('#resultsTable').append(`
            <tr>
              <td colspan="9" class="text-center">Sorry, No results found</td>
              </tr>
            `)
            }
            result.data.forEach(function datum(value, i){
                //*Creates the tables
                $('#resultsTable').append(`
                <tr>
                  <th scope="row" class="d-table-cell">${i + 1}</th>
                  <td class="d-table-cell">${value.lastName}</td>
                  <td class="d-table-cell">${value.firstName}</td>
                  <td class="d-none d-lg-table-cell">${value.jobTitle}</td>
                  <td class="d-none d-lg-table-cell">${value.department}</td>
                  <td class=" d-none d-lg-table-cell">${value.location}</td>
                  <td class="d-none d-lg-table-cell">${value.email}</td>
                  <td class="d-none d-lg-table-cell"><button class="btn me-2 btn-outline-success editBtn${i}" id="">Edit</button><button class="btn btn-outline-danger me-2 deleteBtn${i}" id="">Delete</button></td>
                  <td class="text-center d-lg-none"><button class="btn btn-outline-success" id="btn${i}">&#8942;</button></td>
                  </tr>
                `)
                //* Adds the more information tab
                $(`#btn${i}`).on('click', () => {
                    $('#moreInfo').html(`
                    <div id="editEmployee"></div>
                    <div id="deleteEmployee"></div>
                    <div id="deleteDepartment"></div>
                    <div id="deleteLocation"></div>
                    <div id="addEmployee"></div>
                    <div id="addDepartment"></div>
                    <div id="addLocation"></div>
                    <div class="card collapse" style="width: 18rem;" id="card${i}">
                        <div class="card-body">
                        <button type="button" class="btn-close" aria-label="Close" style="float: right"></button>
                        <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Job Title</strong>: ${value.jobTitle}</li>
                        <li class="list-group-item"><strong>Department</strong>: ${value.department}</li>
                        <li class="list-group-item"><strong>Location</strong>: ${value.location}</li>
                        <li class="list-group-item"><strong>Email</strong>: ${value.email}</li>
                        </ul>
                        <div class="card-body row justify-content-center">
                            <button role="button" id="" class="col-5 editBtn${i} me-1 btn btn-outline-success">Edit Employee</button>
                            <button role="button" id="deleteBtn${i}" class="col-5 me-1 btn btn-outline-danger deleteBtn${i}">Delete Employee</button>    
                        </div>
                    </div>
                    `)
                    $(`#card${i}`).addClass('show')
                    $('#moreInfo').addClass('show')
                    $('.btn-close').on('click', () => {
                        $(`#card${i}`).removeClass('show')
                        $('#moreInfo').removeClass('show')
                    })
                    //*Adds the edit tab
                    $(`.editBtn${i}`).on('click', () => {
                    $('#editEmployee').addClass('show')
                    $('#moreInfo').addClass('show')
                    $('#deleteEmployee').removeClass('show')
                    $(`#card${i}`).removeClass('show')
                    $('#editEmployee').html(`
                  <div class="card" style="width: 18rem;" id="editCard${i}">
                      <div class="card-body">
                      <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                      <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                      </div>
                      <ul class="list-group list-group-flush">
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Email</span>
                        <input type="text" id="email${i}" class="form-control" value="${value.email}" aria-label="Email" aria-described-by="basic-addon${i+1}">
                      </div>
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Job Title</span>
                        <input type="text" class="form-control" id="jobTitle${i}" value="${value.jobTitle}" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                      </div>
                      <li class="list-group-item"><select class="form-control" id="departmentEdit">< selected value="all">Department</select></li>
                      <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                      </ul>
                      <div class="card-body row justify-content-center">
                          <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                      </div>
                  </div>
              `)
              $(`#confirmEditBtn${i}`).on('click', () => {
                editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId, `${value.firstName} ${value.lastName}`)
               
            })
                    
                  popLocation($('#locationEdit'))
                  popDepartment($('#departmentEdit'))
                  
                  $('#departmentEdit').on('change', () => {
                      checkDepartment($('#departmentEdit'), $('#locationEdit'))
                    })
                    $('#locationEdit').on('change', () => {
                        checkLocation($('#locationEdit'), $('#departmentEdit'))
                    })

                    //*calls the edit department function
                    $(`#confirmEditBtn${i}`).on('click', () => {
                        editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val())
                        popAll("getAll");
                    })
                    
                    $(`.btn-close`).on('click', () => {
                      $(`#editCard${i}`).removeClass('show')
                      $('#editEmployee').removeClass('show')
                      $('#deleteEmployee').removeClass('show')
                      $('#moreInfo').removeClass('show')
                    })
    
                    }) 
                    $(`.deleteBtn${i}`).on('click', () => {
                        $('#deleteEmployee').addClass('show')
                        $(`#card${i}`).removeClass('show')
                        $('#moreInfo').addClass('show')
                        $('#deleteEmployee').html(`
                            <div class="card" style="width: 18rem;" id="editCard${i}">
                            <div class="card-body">
                            <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                            <p>Are you sure you want to remove ${value.firstName} ${value.lastName} from the database?</p>
                            <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                            <button role="button" id="abortDeleteBtn${i}" class="col-5 abort me-1 btn btn-outline-danger"> No </button>
                            </div>
                        `)
                        $('.btn-close').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                        })
                        $('.abort').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                        })


                        $(`#confirmDeleteBtn${i}`).on('click', () => {
                            $.ajax({
                                url: "./libs/php/deletePersonnelById.php",
                                type: "POST",
                                dataType: "json",
                                data:{
                                    id: value.id
                                },

                                success: function(result){
                                    alert(`${value.firstName} ${value.lastName} has been removed from the database`)
                                    $('#deleteEmployee').removeClass('show')
                                    $('#moreInfo').removeClass('show')
                                    $('#resultsTable').html('')
                                    personnelTablePop("getAll")
                                   
                                }
                            })
                        })
                    }) 
                })


                $('.btn-close').on('click', () => {
                    $(`#card${i}`).removeClass('show')
                    $('#moreInfo').removeClass('show')
                    $('#deleteEmployee').removeClass('show')
                })

               $(`.deleteBtn${i}`).on('click', () => {
                   $('#deleteEmployee').addClass('show')
                   $('#moreInfo').addClass('show')
                   $('#deleteEmployee').html(`
                    <div class="card" style="width: 18rem;" id="editCard${i}">
                   <div class="card-body">
                   <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                   <p>Are you sure you want to remove ${value.firstName} ${value.lastName} from the database?</p>
                   <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                   <button role="button" id="abortDeleteBtn${i}" class="col-5 abort me-1 btn btn-outline-danger"> No </button>
                   </div>
                   `)
                   $('.btn-close').on('click', () => {
                    $('#deleteEmployee').removeClass('show')
                    $('#moreInfo').removeClass('show')
                    })

                    $('.abort').on('click', () => {
                        $('#deleteEmployee').removeClass('show')
                        $('#moreInfo').removeClass('show')
                    })
                

                $(`#confirmDeleteBtn${i}`).on('click', () => {
                    $.ajax({
                        url: "./libs/php/deletePersonnelById.php",
                        type: "POST",
                        dataType: "json",
                        data:{
                            id: value.id
                        },

                        success: function(result){
                            alert(`${value.firstName} ${value.lastName} has been removed from the database`)
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
                            $('#resultsTable').html('')
                            personnelTablePop("getAll")
                           
                        }
                    })
                })
               }) 
                
              $(`.editBtn${i}`).on('click', () => {
                  $('#editEmployee').addClass('show')
                  $('#moreInfo').addClass('show')
                  $('#deleteEmployee').removeClass('show')
                  $(`#card${i}`).removeClass('show')
                  $('#editEmployee').html(`
                  <div class="card" style="width: 18rem;" id="editCard${i}">
                      <div class="card-body">
                      <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                      <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                      </div>
                      <ul class="list-group list-group-flush">
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Email</span>
                        <input type="text" id="email${i}" class="form-control" value="${value.email}" aria-label="Email" aria-described-by="basic-addon${i+1}">
                      </div>
                      <div class="input-group me-2 mb-3">
                      <span class="input-group-text">Job Title</span>
                        <input type="text" class="form-control" id="jobTitle${i}" value="${value.jobTitle}" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                      </div>
                      <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                      <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                      </ul>
                      <div class="card-body row justify-content-center">
                          <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                      </div>
                  </div>
              `)
              popLocation($('#locationEdit'))
              popDepartment($('#departmentEdit'))
              
              $(`#confirmEditBtn${i}`).on('click', () => {
                editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId,`${value.firstName} ${value.lastName}`)
            })
              $('#departmentEdit').on('change', () => {
                  checkDepartment($('#departmentEdit'), $('#locationEdit'))
                })
                $('#locationEdit').on('change', () => {
                    checkLocation($('#locationEdit'), $('#departmentEdit'))
                })
                $(`.btn-close`).on('click', () => {
                  $(`#editCard${i}`).removeClass('show')
                  $('#editEmployee').removeClass('show')
                  $('#moreInfo').removeClass('show')
                })

         
                
              }) 
            })  

        }
    })
})
    
//! ------ Document Ready ------
$(document).ready(function(){
    //* ---- Populates all tables and selects----
  popAll("getAll")
})
