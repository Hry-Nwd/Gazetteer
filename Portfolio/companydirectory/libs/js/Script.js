//! ------- Globals ------
let department = "";
let place = "";

//!------ Functions ------
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
            url: './libs/php/getDepartmentByID.php',
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
                result.data.forEach(datum => {
                    tarElement.append(`<option value="${datum.id}"> ${datum.name}</option>`);
                });
            }
        });
    }
}

function changeTab(element){
    $('.results').removeClass('show')
    element.addClass('show')
}

function createEditDisplay(){
}

//! ------ Event Listeners ------
    //*--- Listens for location change and populates department select by location id
$('#location').on('change', () => {
    
    checkLocation($('#location'), $('#department'))
})

    //*Listens for Department change and populates location select
$('#department').on('change', () => {
    checkDepartment($('#department'), $('#location'))
})


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

$('#newPersonnel').on('click', () => {
    $('#addEmployee').html('')
    $('#moreInfo').addClass('show')
    $('#addEmployee').addClass('show')
    $('#addEmployee').append(`
        <div class="card " style="width: 28rem;" id="">
            <div class="card-body">
        <button type="button" class="btn-close" aria-label="Close" style="float: right"></button>
        <h5 class="card-title text-center">New Employee</h5>
        </div>
        <ul class="list-group list-group-flush">
        <div class="input-group mb-3 ">
            <span class="input-group-text">Name</span>
            <input type="text" aria-label="First name" class="form-control" placeholder="First Name">
            <input type="text" aria-label="Last name" class="form-control" placeholder="Last Name">
        </div>
        <div class="input-group mb-3 me-2">
            <span class="input-group-text">Job Title</span>
            <input type="text" aria-label="Job Title" class="form-control">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Email</span>
            <input type="text" aria-label="Email" class="form-control">
        </div>
        <li class="list-group-item"><select class="form-control" id="personnelDepartmentAdd"><option selected value="all">Department</option></select></li>
        <li class="list-group-item"><select class="form-control" id="personnelLocationAdd"><option selected value="all">Location</option></select></li>
           
        </ul>
        <div class="card-body row justify-content-center">
            <button role="button" id="confirmAddBtn" class="col-5  me-1 btn btn-outline-success">Ok</button>
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
    <div class="card " style="width: 28rem;" id="">
        <div class="card-body">
            <button type="button" class="btn-close" aria-label="Close" style="float: right"></button>
            <h5 class="card-title text-center">New Department</h5>
        </div>
        <ul class="list-group list-group-flush">
            <div class="input-group mb-3 ">
                <span class="input-group-text">Department Name</span>
                <input type="text" aria-label="Department Name" class="form-control" placeholder="">
            </div>
            <li class="list-group-item"><select class="form-control" id="departmentLocationAdd"><option selected value="all">Location</option></select></li>
        </ul>
        <div class="card-body row justify-content-center">
            <button role="button" id="confirmAddDepartment" class="col-5  me-1 btn btn-outline-success">Ok</button>
        </div>
    </div>
    `)
    popLocation($('#departmentLocationAdd'))

    $('#confirmAddDepartment').on('click', () => {
      
  
        $.ajax({
            url: "./libs/php/insertDepartment.php",
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            data: {
                name: $('#departmentName').val(),
                locationId: $('departmentLocationAdd').val()
            },

            success: function(result){
                console.log("success")
            }

        })
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
        <div class="card " style="width: 28rem;" id="">
            <div class="card-body">
        <button type="button" class="btn-close" aria-label="Close" style="float: right"></button>
        <h5 class="card-title text-center">New Employee</h5>
        </div>
        <ul class="list-group list-group-flush">
        <div class="input-group mb-3 ">
        <span class="input-group-text">Location</span>
        <input type="text" aria-label="First name" class="form-control" placeholder="Location Name">
    </div>
        </ul>
        <div class="card-body row justify-content-center">
            <button role="button" id="" class="col-5 me-1 btn btn-outline-success">Add Location</button>
        </div>
    </div>
    `)
    
    $('.btn-close').on('click', () => {
        $(`#addLocation`).removeClass('show')
        $('#moreInfo').removeClass('show')
    })

})




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
              <td colspan="4" class="text-center">Sorry, No results found</td>
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
                    $('#moreInfo').append(`
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
                          <li class="input-group me-2 mb-3">
                            <input type="text" class="form-control" placeholder="Employees Email" aria-label="Email" aria-described-by="basic-addon${i+1}">
                          </li>
                          <li class="input-group me-2 mb-3">
                            <input type="text" class="form-control" placeholder="Employees Job Title" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                          </li>
                          <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                          <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                             
                          </ul>
                          <div class="card-body row justify-content-center">
                              <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 btn btn-outline-success">Ok</button>
                          </div>
                      </div>
                  `)
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
                            <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                            </div>
                        `)
                        $('.btn-close').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
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
                   <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                   </div>
                   `)
                   $('.btn-close').on('click', () => {
                    $('#deleteEmployee').removeClass('show')
                    $('#moreInfo').removeClass('show')
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
                      <li class="input-group me-2 mb-3">
                        <input type="text" class="form-control" placeholder="Employees Email" aria-label="Email" aria-described-by="basic-addon${i+1}">
                      </li>
                      <li class="input-group me-2 mb-3">
                        <input type="text" class="form-control" placeholder="Employees Job Title" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                      </li>
                      <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                      <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                         
                      </ul>
                      <div class="card-body row justify-content-center">
                          <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 btn btn-outline-success">Ok</button>
                      </div>
                  </div>
              `)
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
})
    
//! ------ Document Ready ------
$(document).ready(function(){
    //* ---- Populates personnel table----
    $.ajax({
        url: "./libs/php/getAll.php",
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
                    $('#moreInfo').append(`
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
                          <li class="input-group me-2 mb-3">
                            <input type="text" class="form-control" placeholder="Employees Email" aria-label="Email" aria-described-by="basic-addon${i+1}">
                          </li>
                          <li class="input-group me-2 mb-3">
                            <input type="text" class="form-control" placeholder="Employees Job Title" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                          </li>
                          <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                          <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                             
                          </ul>
                          <div class="card-body row justify-content-center">
                              <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 btn btn-outline-success">Ok</button>
                          </div>
                      </div>
                  `)
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
                            <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                            </div>
                        `)
                        $('.btn-close').on('click', () => {
                            $('#deleteEmployee').removeClass('show')
                            $('#moreInfo').removeClass('show')
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
                   <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                   </div>
                   `)
                   $('.btn-close').on('click', () => {
                    $('#deleteEmployee').removeClass('show')
                    $('#moreInfo').removeClass('show')
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
                      <li class="input-group me-2 mb-3">
                        <input type="text" class="form-control" placeholder="Employees Email" aria-label="Email" aria-described-by="basic-addon${i+1}">
                      </li>
                      <li class="input-group me-2 mb-3">
                        <input type="text" class="form-control" placeholder="Employees Job Title" aria-label="Job Title" aria-described-by="basic-addon${i+2}">
                      </li>
                      <li class="list-group-item"><select class="form-control" id="departmentEdit"><option selected value="all">Department</option></select></li>
                      <li class="list-group-item"><select class="form-control" id="locationEdit"><option selected value="all">Location</option></select></li>
                         
                      </ul>
                      <div class="card-body row justify-content-center">
                          <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 btn btn-outline-success">Ok</button>
                      </div>
                  </div>
              `)
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

    //* ---- Populates Department table ----
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
                                <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                                </div>
                            `)
                            $('.btn-close').on('click', () => {
                                $('#deleteDepartment').removeClass('show')
                                $('#deleteDepartment').html('')
                                $('#moreInfo').removeClass('show')
                            })
                        }) 
                    }
                });
            })
        }
    })
    //* ---- Populates Location table----
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
                                <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                                <button role="button" id="abortDeleteBtn${i}" class="col-5 me-1 btn btn-outline-danger"> No </button>
                                </div>
                            `)
                            $('.btn-close').on('click', () => {
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
    //* ---- Populates location select ----
    popLocation($('#location'))

    //* ---- Populates Department select ----
    popDepartment($('#department'))
})
