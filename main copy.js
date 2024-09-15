const prioritySelect = document.getElementById('prioritySelect');
const universalSelect = document.getElementById('universalSelect');
const universalSelectDate = document.querySelector('#universalSelectDate');
const universalSelectPriority = document.querySelector('#universalSelectPriority');
const inputField = document.getElementById('taskTextField');
const taskSearchField = document.querySelector('#taskSearch')
const tasks = document.getElementById('tasks');
const checkboxActive = document.getElementById('active');
const checkboxCanceled = document.getElementById('canceled');
const checkboxCompleted = document.getElementById('completed');
const statusCheckboxGroup = document.querySelector('.statusCheckboxGroup');

// npm install и node to-do.js

let id = 0;
let tasksObjectArray = [];
let tasksObjectArrayCopy = [];


let responseFromBack = fetch('http://127.0.0.1:3000/items', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
.then(response => response.json()) 
.then(json => json.forEach(elem => {
    elem.date = new Date(elem.date)
    tasksObjectArray.push(elem)
}))

setTimeout(() => {
    renderTask(tasksObjectArray)
    sortByPriority()
}, 3000);


function renderTask(arrayForRender) {
    tasks.innerHTML = '';
    arrayForRender.forEach(elem => {
        let priorityText, taskEditClassname;
        let crossSpanStyle = '';
        let checkSpanStyle = '';
        const task = document.createElement('div');
        task.className = 'task';
        switch (elem.priority) {
            case('НИЗКИЙ'):
                priorityText = 'lowPriorityText';
                break;
            case('СРЕДНИЙ'):
                priorityText = 'mediumPriorityText';
                break;
            case('ВЫСОКИЙ'):
                priorityText = 'highPriorityText';
                break;
        };
        switch(elem.status) {
            case('active'):
                taskEditClassname = 'taskEdit';
                break;
            case('canceled'):
                taskEditClassname = 'taskEditCanceled';
                crossSpanStyle = 'none';
                break;
            case('completed'):
                taskEditClassname = 'taskEditCompleted';
                checkSpanStyle = 'none';
                break;
        };
        task.innerHTML = `
        <p class=${priorityText}>${elem.priority}</p>
        <div class=${taskEditClassname} style="margin-top: 20px; position: relative;">
            <span>
                <p class="taskText" contenteditable="true">${elem.text}</p>
                <p class="taskDate">${elem.dateToShow}</p>
            </span>
            <span>
                <p class="checkSpan" style="display: ${checkSpanStyle};">&#10004</p>
                <p class="crossSpan" style="display: ${crossSpanStyle};">&#10006</p>
            </span>
        </div>
        <div class="material-icons">delete</div>`;
        task.value = elem;
        tasks.append(task);
    });
}

// Функции
function filters() {
    let tasksObjectArrayCopy = [];
    
    for (let elem of tasksObjectArray) {
        tasksObjectArrayCopy.push(elem);
    }
    if (!checkboxActive.checked) {
        tasksObjectArrayCopy = tasksObjectArrayCopy.filter(elem => elem.status != 'active');
    }
    if (!checkboxCanceled.checked) {
        tasksObjectArrayCopy = tasksObjectArrayCopy.filter(elem => elem.status != 'canceled');
    }
    if (!checkboxCompleted.checked) {
        tasksObjectArrayCopy = tasksObjectArrayCopy.filter(elem => elem.status != 'completed');
    }

    switch(universalSelect.value) {
        case ('1'):
            tasksObjectArrayCopy = tasksObjectArrayCopy.filter((elem) => elem.priorityValue === 1);
            break;
        case '2':
            tasksObjectArrayCopy = tasksObjectArrayCopy.filter((elem) => elem.priorityValue === 2);
            break;
        case '3':
            tasksObjectArrayCopy = tasksObjectArrayCopy.filter((elem) => elem.priorityValue === 3);
            break;
        case '4':
            break;
    };

    if (taskSearchField.value.length >= 2) {
        tasksObjectArrayCopy = tasksObjectArrayCopy.filter(
            target => target.text.toLowerCase().includes(taskSearchField.value.toLowerCase()))
    }
    renderTask(tasksObjectArrayCopy);
}

function sortByDate() {
    switch (universalSelectDate.value) {
        case ('1'):
            tasksObjectArray.sort((a, b) => a.date - b.date);
            renderTask(tasksObjectArray);
            break;
        case('2'):
            tasksObjectArray.sort((a, b) => b.date - a.date);
            renderTask(tasksObjectArray);
            break;
    }
}


function sortByPriority() {
    switch(universalSelectPriority.value) {
        case ('1'):
            tasksObjectArray.sort((a, b) => b.priorityValue - a.priorityValue)
            renderTask(tasksObjectArray)
            break;
        case ('2'):
            tasksObjectArray.sort((a, b) => a.priorityValue - b.priorityValue)
            renderTask(tasksObjectArray)
            break;
    }
}


// Изменение задачи
tasks.addEventListener('input', (elem) => {
    if (elem.target.className == 'taskText') {
        for (let target of tasksObjectArray) {
            if (elem.target.parentElement.parentElement.parentElement.value.id == target.id) {
                target.text = elem.target.innerHTML;
                let putResponse = fetch(`http://127.0.0.1:3000/items/${target.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(target)
                });
            }
        }
    }
})



// Создание задачи
function addTask() {
    if (inputField.value === '') {
        alert('Вы должны ввести текст задачи!');
    } else {
        let dateNow = new Date();
        let monthNow = '0' + dateNow.getMonth();
        monthNow = monthNow.slice(-2);
        let minutesNow = '0' + dateNow.getMinutes();
        minutesNow = minutesNow.slice(-2);
        id += 1;
        let priorityObject = {
            id: id,
            status: 'active',
            text: inputField.value,
            date: dateNow,
            dateToShow: dateNow.toLocaleDateString() + ' ' + dateNow.getHours() + ':' + minutesNow,
        }; 

        switch(prioritySelect.value) {
            case('1'):
                priorityObject.priority = 'НИЗКИЙ';
                priorityObject.priorityValue = 1;
                tasksObjectArray.push(priorityObject);
                break;
            case('2'):
                priorityObject.priority = 'СРЕДНИЙ';
                priorityObject.priorityValue = 2;
                tasksObjectArray.push(priorityObject);
                break;
            case('3'):
                priorityObject.priority = 'ВЫСОКИЙ';
                priorityObject.priorityValue = 3;
                tasksObjectArray.push(priorityObject);
                break;
        };
        let postResponse = fetch('http://127.0.0.1:3000/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(priorityObject)
        });  
        sortByPriority();
        filters();
        return inputField.value = '';
    };
};



// Изменение статуса
tasks.addEventListener('click', (elem) => {
    if (elem.target.className == 'checkSpan') {
        for (let item of tasksObjectArray) {
            if (item.id === elem.target.parentElement.parentElement.parentElement.value.id) {
                switch (item.status) {
                    case ('active'):
                        item.status = 'completed';
                        break;
                    case ('canceled'):
                        item.status = 'active';
                        break;
                }
                let putResponse = fetch(`http://127.0.0.1:3000/items/${item.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(item)
                }); 
            }
        }
        filters();
    } else if (elem.target.className == 'crossSpan') {
        for (let item of tasksObjectArray) {
            if (item.id === elem.target.parentElement.parentElement.parentElement.value.id) {
                switch (item.status) {
                    case ('active'):
                        item.status = 'canceled';
                        break;
                    case ('completed'):
                        item.status = 'active';
                        break;
                }
                let putResponse = fetch(`http://127.0.0.1:3000/items/${item.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(item)
                }); 
            }
        }
        filters();
    }
})



// Кнопка удаления
tasks.addEventListener('click', (elem) => {
    if (elem.target.className == 'material-icons') {
        let confirmQuestion = confirm('Вы действительно хотите удалить эту задачу?');
        if (confirmQuestion) {
            tasksObjectArray.forEach((deleteTarget, index) => {
                if (deleteTarget.id == elem.target.parentElement.value.id) {
                    tasksObjectArray.splice(index, 1);
                    renderTask(tasksObjectArray);
                    let deleteResponse = fetch(`http://127.0.0.1:3000/items/${deleteTarget.id}`, {
                        method: 'DELETE',
                    })
                }
            })
        }
    }
})

// Фильтр по приоритету
universalSelect.addEventListener('change', () => {
    filters();
});

// Фильтр по статусу
statusCheckboxGroup.addEventListener('click', () => {
    filters();
})

// Сортировка по дате
universalSelectDate.addEventListener('change', () => {
    sortByDate();
    filters();
})

// Сортировка по приоритету
universalSelectPriority.addEventListener('change', () => {
    sortByPriority();
    filters();
})

// Поиск задачи по тексту
taskSearchField.addEventListener('input', () => {
    filters();
})