const prioritySelect = document.getElementById('prioritySelect');
const universalSelect = document.getElementById('universalSelect');
const universalSelectDate = document.querySelector('#universalSelectDate');
const universalSelectPriority = document.querySelector('#universalSelectPriority');
const inputField = document.getElementById('taskTextField');
const taskSearchField = document.querySelector('#taskSearch')
const highPriority = document.getElementById('highPriority');
const mediumPriority = document.getElementById('mediumPriority');
const lowPriority = document.getElementById('lowPriority');
const highPriorityField = document.getElementById('highPriorityField');
const mediumPriorityField = document.getElementById('mediumPriorityField');
const lowPriorityField = document.getElementById('lowPriorityField');
const tasks = document.getElementById('tasks');
const checkboxActive = document.getElementById('active');
const checkboxCanceled = document.getElementById('canceled');
const checkboxCompleted = document.getElementById('completed');
const statusCheckboxGroup = document.querySelector('.statusCheckboxGroup');





function renderTask() {
    highPriority.style.display = (highPriorityField.childElementCount == 0) ? 'none' : '';
    mediumPriority.style.display = (mediumPriorityField.childElementCount == 0) ? 'none' : '';
    lowPriority.style.display = (lowPriorityField.childElementCount == 0) ? 'none' : '';
}

function createTaskByPriority(priority, priorityField, priorityObjectValue,
    priorityTextClass, priorityTextName, priorityText, date, divTask, textField,
    divTaskEdit, taskAndDateSpan, crossCheckSpan, dateField, deleteTaskButton, checkSpan, crossSpan) {
    priority.style.display = '';
    priorityText.className = priorityTextClass;
    priorityText.innerHTML = priorityTextName;           
    divTask.prepend(priorityText);
    priorityField.append(divTask);
    let priorityObject = {
        priority: priorityObjectValue,
        status: 'active',
        tasks: '',
        date: ''
    }
    priorityObject.date = date;
    priorityObject.tasks = inputField.value;
    divTask.value = priorityObject;  
    textField.innerHTML = priorityObject.tasks;
    divTaskEdit.style.marginTop = '20px';
    divTaskEdit.style.position = 'relative';
    divTask.append(divTaskEdit);
    taskAndDateSpan.append(textField);
    taskAndDateSpan.append(dateField);
    divTask.append(deleteTaskButton);
    crossCheckSpan.append(checkSpan);
    crossCheckSpan.append(crossSpan);
}

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
        const dateField = document.createElement('p');
        dateField.innerHTML = dateNow.toLocaleDateString() + ' ' + dateNow.getHours() + ':' + minutesNow;
        dateField.className = 'taskDate';

        const textField = document.createElement('p');
        textField.className = 'taskText';
        textField.contentEditable = 'true';
        const priorityText = document.createElement('p');
        const divTask = document.createElement('div');
        divTask.className = 'task';
        const divTaskEdit = document.createElement('div');
        divTaskEdit.className = 'taskEdit';
        const crossSpan = document.createElement('p');
        crossSpan.className = 'crossSpan';
        crossSpan.innerHTML = '&#10006';
        const checkSpan = document.createElement('p');
        checkSpan.className = 'checkSpan';
        checkSpan.innerHTML = '&#10004';
        const deleteTaskButton = document.createElement('div');
        deleteTaskButton.className = 'material-icons';
        deleteTaskButton.innerHTML = 'delete';
        const taskAndDateSpan = document.createElement('span');
        const crossCheckSpan = document.createElement('span');

        divTaskEdit.append(taskAndDateSpan);
        divTaskEdit.append(crossCheckSpan);
        switch(prioritySelect.value) {
            case('1'):
                createTaskByPriority(lowPriority, lowPriorityField, 'low', 
                'lowPriorityText', 'НИЗКИЙ', priorityText, dateNow, divTask, textField,
                divTaskEdit, taskAndDateSpan, crossCheckSpan, dateField, deleteTaskButton, checkSpan, crossSpan);
                break;
            case('2'):
                createTaskByPriority(mediumPriority, mediumPriorityField, 'medium', 
                'mediumPriorityText', 'СРЕДНИЙ', priorityText, dateNow, divTask, textField,
                divTaskEdit, taskAndDateSpan, crossCheckSpan, dateField, deleteTaskButton, checkSpan, crossSpan);
                break;
            case('3'):
                createTaskByPriority(highPriority, highPriorityField, 'high', 
                'highPriorityText', 'ВЫСОКИЙ', priorityText, dateNow, divTask, textField,
                divTaskEdit, taskAndDateSpan, crossCheckSpan, dateField, deleteTaskButton, checkSpan, crossSpan);
                break;
        }
        return inputField.value = '';
    }
}

// Фильтр по приоритету
universalSelect.addEventListener('change', (event) => {
    switch(event.target.value) {
        case ('1'):
            lowPriority.style.display = (lowPriorityField.childElementCount == 0) ? 'none' : '';
            mediumPriority.style.display = 'none';
            highPriority.style.display = 'none';
            break;
        case '2':
            mediumPriority.style.display = (mediumPriorityField.childElementCount == 0) ? 'none' : '';
            lowPriority.style.display = 'none';
            highPriority.style.display = 'none';
            break;
        case '3':
            highPriority.style.display = (highPriorityField.childElementCount == 0) ? 'none' : '';
            mediumPriority.style.display = 'none';
            lowPriority.style.display = 'none';
            break;
        case '4':
            renderTask();
            break;
    }
})

// Изменение статуса
tasks.addEventListener('click', (elem) => {

    if (elem.target.className == 'checkSpan') {
        let parentElement = elem.target.parentElement.parentElement.parentElement;
        let papaIpapa = elem.target.parentElement.parentElement;
        let crossSpan = papaIpapa.querySelector('.crossSpan');
        switch (parentElement.value.status) {
            case ('active'):
                parentElement.value.status = 'completed';
                papaIpapa.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
                elem.target.style.display = 'none';
                break;
            case ('canceled'):
                parentElement.value.status = 'active';
                papaIpapa.style.backgroundColor = 'white';
                crossSpan.style.display = '';
                break;
        }

    } else if (elem.target.className == 'crossSpan') {
        let parentElement = elem.target.parentElement.parentElement.parentElement;
        let papaIpapa = elem.target.parentElement.parentElement;
        let checkSpan = papaIpapa.querySelector('.checkSpan');
        switch (parentElement.value.status) {
            case ('active'):
                parentElement.value.status = 'canceled';
                papaIpapa.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                elem.target.style.display = 'none';
                break;
            case ('completed'):
                parentElement.value.status = 'active';
                papaIpapa.style.backgroundColor = 'white';
                checkSpan.style.display = '';
                break;
        }
    }
})


// Кнопка удаления
tasks.addEventListener('click', (elem) => {
    if (elem.target.className == 'material-icons') {
        let confirmQuestion = confirm('Вы действительно хотите удалить эту задачу?');
        if (confirmQuestion) {
            elem.target.parentElement.remove();
        }
    }
})

// Фильтр по статусу
statusCheckboxGroup.addEventListener('click', (event) => {
    let tasksArray = tasks.getElementsByClassName('task');
    switch (event.target.id) {
        case ('active'):
            if (checkboxActive.checked) {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'active') {
                        elem.style.display = '';
                    } 
                }
            } else {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'active') {
                        elem.style.display = 'none';
                    } 
                }
            }
            break;
        case ('canceled'):
            if (checkboxCanceled.checked === true) {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'canceled') {
                        elem.style.display = '';
                    } 
                }
            } else {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'canceled') {
                        elem.style.display = 'none';
                    } 
                }
            }
            break;
        case ('completed'):
            if (checkboxCompleted.checked === true) {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'completed') {
                        elem.style.display = '';
                    } 
                }
            } else {
                for (let elem of tasksArray) {
                    if (elem.value.status == 'completed') {
                        elem.style.display = 'none';
                    } 
                }
            }
            break;
    }
})

// Сортировка по дате
universalSelectDate.addEventListener('change', (event) => {
    let taskEdit = document.getElementsByClassName('task');
    let tasksForSortArray = Array.from(taskEdit);
    switch (universalSelectDate.value) {
        case ('1'):
            tasksForSortArray.sort((a, b) => a.value.date - b.value.date);
            break;
        case('2'):
            tasksForSortArray.sort((a, b) => b.value.date - a.value.date);
            break;
    }
    for (let elem of [...taskEdit]) {
        elem.remove();
    }
    tasksForSortArray.forEach(task => {
        switch (task.value.priority) {
            case ('low'):
                lowPriorityField.append(task);
                break;
            case ('medium'):
                mediumPriorityField.append(task);
                break;
            case ('high'):
                highPriorityField.append(task);
                break;
        }
    })
})

// Сортировка по приоритету
universalSelectPriority.addEventListener('change', (event) => {
    switch(event.target.value) {
        case ('1'):
            tasks.insertBefore(lowPriority, null);
            tasks.insertBefore(mediumPriority, lowPriority);
            tasks.insertBefore(highPriority, mediumPriority);
            break;
        case ('2'):
            tasks.insertBefore(highPriority, null);
            tasks.insertBefore(mediumPriority, highPriority);
            tasks.insertBefore(lowPriority, mediumPriority);
            break;
    }
})

// Поиск задачи по тексту
taskSearchField.addEventListener('change', () => {
    let tasksElems = document.querySelectorAll('.task');
    if (taskSearchField.value.length >= 2) {
        for (let elem of tasksElems) {
            if (elem.value.tasks.toLowerCase().includes(taskSearchField.value.toLowerCase())) {
                elem.style.display = '';
            } else {
                elem.style.display = 'none';
            }
        }
    } else {
        for (let elem of tasksElems) {
            elem.style.display = '';
        }
    }
})