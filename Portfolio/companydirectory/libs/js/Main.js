//! ------- Globals ------
let department = "";
let place = "";
    //*------DOM------
personnelTable = $('#resultsTable')
deleteEmployee = $('#deleteEmployee')
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
    //*Closes buttons
function closeAll(){

}
    //* Populates personnel table
function personnelTablePop(file){
    personnelTable.html('')
    $.ajax({
        url: `./libs/php/${file}.php`,
        type: "POST",
        dataType: 'json',
            
        success: function(result) {
            result.data.forEach(function datum(value, i){
            //*Creates the tables
                personnelTable.append(`
                    <tr>
                      <td scope="row" class="d-table-cell">${i + 1}</td>
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
                        $('#emplop')
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
                            <div class="card-body container">
                            <button type="button" class="btn-close" id="closeBtn${i}" aria-label="Close" style="float: right"></button>
                            <h5 class="card-title text-center">${value.firstName} ${value.lastName}</h5>
                            
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
                       
                            </ul>
                            <div class="card-body row justify-content-center">
                                <button role="button" id="confirmEditBtn${i}" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                            </div>
                        </div>
                        </div>
                    `)
                    $(`#confirmEditBtn${i}`).on('click', () => {
                      
                      editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId, `${value.firstName} ${value.lastName}`)
                      
                  })
                            //*populates the edit location and department selects
                     
                      popDepartment($('#departmentEdit'))
          
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
                       
                                        $('#deleteEmployee').html(`
                                        <div class="card" style="width: 18rem;">
                                            <div class="card-body container text-center">
                                                ${value.firstName} ${value.lastName} has successfully been removed from the database.<br>
                                                <div class="justify-content-center">
                                                    <button role="button" class="btn-close"></button>
                                                </div>
                                            </div>
                                        </div>`)
                                        $('#resultsTable').html('')
                                        personnelTablePop("getAll")
                                    }
                                })
                            })
                        }) 
                })
                
                $(`.deleteBtn${i}`).on('click', () => {
                    deleteEmployee.addClass('show')
                    $('#moreInfo').addClass('show')
                    $('#deleteEmployeeCard').html(`
                       <p>Are you sure you want to remove ${value.firstName} ${value.lastName} from the database?</p>
                       <button role="button" id="confirmDeleteBtn${i}" class="col-5 me-1 btn btn-outline-success"> Yes </button>
                       <button role="button" id="" class="col-5 me-1 abort btn btn-outline-danger"> No </button>
                    `)

                    $('.abort').on('click', () => {
                        closeAll()
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
                                $('#deleteEmployeeCard').html(`${value.firstName} ${value.lastName} has successfully been removed from the database.`)
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
                    $('#editEmployeeTitle').html(`${value.firstName} ${value.lastName}`)
                    $('#editEmployeeEmail').val(`${value.email}`)
                    $('#editEmployeeJobTitle').val(`${value.jobTitle}`)                         
                    $('#confirmEdit').html(`
                        <button role="button" id="confirmEditBtn" class="col-5  me-1 refresh btn btn-outline-success">Ok</button>
                    `)
                  
                  $(`#confirmEditBtn${i}`).on('click', () => {
                    editPersonnel(value.id, $(`#jobTitle${i}`).val(), $(`#email${i}`).val(), $('#departmentEdit').val(), value.depId, `${value.firstName} ${value.lastName}`)
               
                })
                  popDepartment($('#departmentEdit'))
                  
               
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

function closeAll(){
    $(`#card${i}`).removeClass('show')
    $('#moreInfo').removeClass('show')
    $('#deleteEmployee').removeClass('show')
    $('#deleteEmployee').removeClass('show')
    $('#moreInfo').removeClass('show')
}
    

    $('.btn-close').on('click', () => {
        closeAll()
    })