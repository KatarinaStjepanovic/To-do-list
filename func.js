document.addEventListener('DOMContentLoaded', () => {
      exsTasks();
      getDate();
      getProgress();
})

//calendar

const calendarTd = document.getElementsByTagName('td');

const clearCal = () => {
    for( let i = 0; i < calendarTd.length; i++){
        calendarTd[i].textContent = "";
    }
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];



const d = new Date();
const currentMonth = months[d.getMonth()];

const monthDiv = document.getElementById('month');
monthDiv.innerText = currentMonth;

const firstDay = new Date(2025, d.getMonth(), 1).getDay()-1; 
const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
clearCal();
let dan = 1;

for( let i = firstDay; i <= daysInMonth; i++){
   calendarTd[i].textContent = dan;
  
   if( dan == d.getDate()){
    const circleDiv = document.createElement('div');
    calendarTd[i].appendChild(circleDiv);
    calendarTd[i].classList.add('dateTd');
    circleDiv.classList.add('currentDate');

   }

   dan++;
}

//calendar hover

for( let i = 0; i < calendarTd.length; i++){
    calendarTd[i].addEventListener('mouseover', () => {
        const value = calendarTd[i].textContent.trim();

        if( value !== "" && !isNaN(value) && Number(value) !== d.getDate()){
            calendarTd[i].classList.add('hoveredTd');
  
        }
      })
}

for( let i = 0; i < calendarTd.length; i++){
    calendarTd[i].addEventListener('mouseout', () => {
        if( calendarTd[i].textContent != " "){
            calendarTd[i].classList.remove('hoveredTd');
  
        }
      })
}

//calendar open

const openGoogleCalendar = (day) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = `${year}${month.toString().padStart(2, '0')}${day.padStart(2, '0')}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${date}T090000Z/${date}T100000Z&text=New+Task`;

    window.open(url, '_blank');
};

for( let i = 0; i < calendarTd.length; i++){
    calendarTd[i].addEventListener('click', () => {
        const day = calendarTd[i].textContent.trim();
        if (day !== "" && !isNaN(day)) {
            openGoogleCalendar(day);
        }
    })
}

//lista
const procent = document.getElementById('progressBar');
const num = document.getElementById('procenat');
let tasks = [];
let fin = 0;

const getDate = () => {
    const today = new Date().getDay();
    if( today == localStorage.getItem('today')){
         fin = localStorage.getItem('finished');

    }else{
        localStorage.setItem('today', today);
        localStorage.setItem('finished', 0);
    }
}





const getElements =  (task) => {
    num.innerText = fin!=0 ? Math.ceil(fin / tasks.length * 100) : 0;
    procent.value = fin!=0 ? Math.ceil(fin / tasks.length * 100) : 0;
    
    const div = document.getElementById('innerDiv');
    div.appendChild(new taskDiv(task).fullDiv());
}


const addBtn = document.getElementById('new');
const input = document.getElementById('inpl');

const addingTask  = () => {
    if( tasks.length < 8){
        const value = input.value;
        tasks.push(value);
       getElements(value);
       setProgress();
       input.value = '';
    
        }
}

input.addEventListener('keypress', (e) => {
    if( e.key == "Enter"){
        addingTask();
    }
})


addBtn.addEventListener('click', () => {
    addingTask();
  
})



const exsTasks = () => {
    for( let i = 0; i < localStorage.length; i++){
        if( localStorage.key(i).includes('task')){
            const task = localStorage.getItem(localStorage.key(i));
            tasks.push(task);
            getElements(task);

        }
       
    }
}


class taskDiv{
    constructor(value){
        this.element = document.createElement('div');
        this.element.innerText = value;
        this.element.classList.add('taskDiv');
        localStorage.setItem(`task ${value}`, value);

    }

    fullDiv(){
        const fullDiv = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = './assets/do.png';
        icon.classList.add('icon');
        this.element.appendChild(icon);
        fullDiv.appendChild(icon);
        fullDiv.appendChild(this.element);
        fullDiv.classList.add('fullDiv');
        icon.addEventListener('click', () => {
            icon.src = './assets/done.png';
            fullDiv.classList.add('removed');
            setTimeout(() => {
                localStorage.removeItem(`task ${this.element.innerText}`);  
               fullDiv.remove();
               fin++;
               console.log(tasks.length)
              setProgress();
              

             
               
            }, 3000)
        });

        return fullDiv;
    }
}

const getProgress = () => {
    const prog = localStorage.getItem('progress');
    num.innerText = prog;
    procent.value = prog;
}

const setProgress = () => {
    const prog = fin!=0 ? Math.ceil(fin / tasks.length * 100) : 0;
    num.innerText = prog;
    procent.value = prog;
    localStorage.setItem('progress', prog);
}










