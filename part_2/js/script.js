window.addEventListener('load', function(){
    const right = document.getElementById('right');
    const left = document.getElementById('left');
    
    displayLoading('left','Loading employee list...');

    const url = 'https://www.mccinfo.net/epsample/employees';

    fetch(url)
    .then(response => response.json())
    .then((employees)=>{
        console.log(employees);

        let para = document.createElement('p');
        para.innerHTML = 'Select an employee from the list below:';

        let employeeList = document.createElement('select');
        employeeList.id = 'employeeList';

        let option = document.createElement('option');
        option.value= '';
        option.innerHTML='-- Select an option --';
        employeeList.appendChild(option);

        for(employee of employees){
            option = document.createElement('option');
            option.value = employee.id;
            option.innerHTML = `${employee.first_name} ${employee.last_name} (${employee.department.name})`
            employeeList.appendChild(option);
        }
        
        clearContainer('left');
        left.appendChild(para);
        left.appendChild(employeeList);

        employeeList.addEventListener('change', onChange);
    })

    //Helper function
    function clearContainer(side){
        switch(side){
            case 'right':
                right.innerHTML='';
                break;
            case 'left':
                left.innerHTML='';
                break;
        }
    }

    function displayLoading(side, loadingText){
        if(loadingText==undefined) loadingText="Loading content...";
        if((side != 'left')&&(side!= 'right')){
            throw new Error('displayLoading accepts "right" or "left"');
        }else{
            const container = document.getElementById(side);

            let loadingTextContainer = document.createElement('p');
            loadingTextContainer.innerHTML=loadingText;
            container.appendChild(loadingTextContainer);

            let loadingImageContainer = document.createElement('div');
            loadingImageContainer.classList.add('loading');
            loadingImageContainer.classList.add('centered');
            container.appendChild(loadingImageContainer);
        }
    }

    function onChange(evt){
        console.log(evt.target.value);
        //Begin step 2
        clearContainer('right');
        if(evt.target.value!=''){//not the first?
            fetch(url)//get employee
            .then(response => response.json())
            .then((employees)=>{
                displayEmployee(employees[evt.target.value-1]);
            });
        }
    }

    function displayEmployee(emp){//helper
        const br=document.createElement('br');
        console.log(emp);
        let div = document.createElement('div');//make div
        let h1 = document.createElement('h1');//make h1
        h1.innerHTML= emp.first_name+' '+emp.last_name;
        div.appendChild(h1);
        div.appendChild(br);
        let h2 = document.createElement('h2');//make h2
        h2.innerHTML=emp.department.name;
        div.appendChild(h2);
        div.appendChild(br);
        let pa=document.createElement('p');//make p
        pa.appendChild(document.createTextNode(
            `Salary: ${emp.annual_salary}
\nHire date: ${emp.hire_date}`));//I have no idea why these new line things aren't working *or* why appending h tags just adds the text and nothing else
        div.appendChild(pa);
        //Begin step 4
        let a=document.createElement('a');//make anchor
        a.appendChild(document.createTextNode('View Department'));
        a.href="#"//click?
        a.id="department"
        div.appendChild(a);
        div.appendChild(br);
    //End step 4

        //Begin step 3
        let img=document.createElement("img");//make image
        img.src=emp.image_filename;
        div.appendChild(img);
        div.appendChild(br);
        //End step 3

        right.innerHTML=div.innerHTML;
        //End step 2

        //Begin step 4
        document.getElementById('department').addEventListener('click',()=>{
            clearContainer('right');
            displayEmployee(emp);
            let h4=document.createElement('h4').appendChild(document.createTextNode('Department: '+emp.department.name));
            let h5=document.createElement('h5').appendChild(document.createTextNode('Employees'));

            right.appendChild(h4);
            right.appendChild(br);
            right.appendChild(h5);
            right.appendChild(br);
            depatrmentEmployees(emp)
        });
        alert(right.innerHTML);
    }
    function depatrmentEmployees(emp){//helper
        fetch(url)//get employees
        .then(response => response.json())
        .then((employees)=>{
            let ul=document.createElement('ul');
            for(employee of employees){//check
                if(emp.department.name==employee.department.name){
                    let li=document.createElement('li');
                    li.appendChild(document.createTextNode(employee.first_name+' '+employee.last_name));
                    ul.appendChild(li);
                }
            }
            right.appendChild(ul);
        });
    }
    //End step 4
});