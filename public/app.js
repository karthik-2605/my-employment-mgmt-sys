document.getElementById("js_btn_save").addEventListener("click",function(event){

    event.preventDefault();

    const employeeData = {
        search_id: document.querySelector("input[name='search_id']").value,
        emp_name: document.querySelector("input[name='emp_name']").value,
        gender: document.querySelector("select[name='gender']").value,
        email: document.querySelector("input[name='email']").value,
        dept: document.querySelector("select[name='dept']").value,
        address: document.querySelector("textarea[name='address']").value
    };

    if(!employeeData.search_id || !employeeData.emp_name || !employeeData.gender || !employeeData.email || !employeeData.dept || !employeeData.address){
        alert("All fields are required!");
        return;
    }

    fetch("http://localhost:3000/employees",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(employeeData)
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.error){
            alert("Error: " + data.error);
        }else{
            alert("Employee added successfully!");
            document.getElementById("employeeForm").reset();
        }
    })

    .catch(error=> console.error("Error: ",error));
})









async function searchEmployee(){
    try{
        const searchId = document.querySelector("input[name='search_id']").value;

        if(!searchId){
            alert("Re-enter the ID");
            return;
        }

        const response = await fetch(`http://localhost:3000/employees/${searchId}`);
        const data = await response.json();

        if(data.error){
            alert("Error: "+ data.error);
        }else{
            
            document.querySelector("input[name='emp_name']").value = data.emp_name;
            document.querySelector("select[name='gender']").value = data.gender;
            document.querySelector("input[name='email']").value = data.email;
            document.querySelector("select[name='dept']").value = data.dept;
            document.querySelector("textarea[name='address']").value = data.address;
        }

    }catch(error){
        console.error("Error: ",error)
    }
}

document.getElementById("js_btn_search").addEventListener("click",searchEmployee);









async function deleteEmployee(){
    try{
        const searchId = document.querySelector("input[name='search_id']").value;

        if(!searchId){
            alert("Please enter an valid ID to delete.");
            return;
        }

        const response = await fetch(`http://localhost:3000/employees/${searchId}`,{
            method:"DELETE"
        })

        const data = await response.json();

        if(data.error){
            alert("Error: "+ data.error);
        }else{
            alert("Employee deleted successfully!");
            document.getElementById("employeeForm").reset();
        }


    }catch(error){
        console.error("Error: ",error);
    }
}

document.getElementById("js_btn_delete").addEventListener("click",deleteEmployee);










async function updateEmployee(){
    try{
        const searchId = document.querySelector("input[name='search_id']").value;
        const emp_name = document.querySelector("input[name='emp_name']").value;
        const gender = document.querySelector("select[name='gender']").value;
        const email = document.querySelector("input[name='email']").value;
        const dept = document.querySelector("select[name='dept']").value;
        const address = document.querySelector("textarea[name='address']").value;

        if(!searchId || !emp_name || !gender || !email || !dept || !address){
            alert("All fields are required to update employee details");
            return;
        }

        const response = await fetch(`http://localhost:3000/employees/${searchId}`,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({emp_name,gender,email,dept,address})
        });

        const data = await response.json();
        if(data.error){
            alert("Error: "+ data.error);
        }else{
            alert("Employee updated successfully!");
            document.getElementById("employeeForm").reset();
        }


    }catch(error){
        console.error("Error: ",error);
    }
}

document.getElementById("js_btn_update").addEventListener("click",updateEmployee);








function clearForm(){
    document.getElementById("employeeForm").reset();
}


document.getElementById("js_btn_clear").addEventListener("click",clearForm);