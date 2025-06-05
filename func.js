

//calendar

const calendarTd = document.getElementsByTagName('td');
console.log(calendarTd)
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

const firstDay = (new Date(2025, d.getMonth(), 1).getDay() + 6) % 7;
const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
console.log(firstDay)
clearCal();

let dan = 1;

for( let i = firstDay; i < daysInMonth + firstDay; i++){

    if( firstDay == 6){
        const newR = document.getElementById('newR');
       newR.style.visibility = 'visible';
       const cal = document.getElementById('calendar');
       cal.style.height = "280px";

    }
   calendarTd[i].textContent = dan;
   console.log(dan)
  
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
            if( value <=  d.getDate()){
                calendarTd[i].classList.add('past');
            }else{
                calendarTd[i].classList.add('hoveredTd');
            }
            
  
        }
      })
}

for( let i = 0; i < calendarTd.length; i++){
    calendarTd[i].addEventListener('mouseout', () => {
        if( calendarTd[i].textContent != " "){
            calendarTd[i].classList.remove( Array.from(calendarTd[i].classList).includes('hoveredTd') ?  'hoveredTd' : 'past');
  
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

console.log(calendarTd)

for( let i = 0; i < calendarTd.length; i++){
    calendarTd[i].addEventListener('click', () => {
        const day = calendarTd[i].textContent.trim();
        if (day !== "" && !isNaN(day) && day >= d.getDate()) {
            openGoogleCalendar(day);
        }
    })
}

//lista
const procent = document.getElementById('progressBar');
const num = document.getElementById('procenat');
const div = document.getElementById('innerDiv');
let tasks = [];
let fin = 0;

const getDate = () => {
    const today = d.getDate();
    if( today == localStorage.getItem('today')){
         fin = parseInt(localStorage.getItem('finished'));
    }else{
        localStorage.clear();
        localStorage.setItem('today', today);
        localStorage.setItem('finished', 0);
    }
}





const getElements =  (task) => {
        if( tasks.length < 8 && Array.from(div.classList).includes('scroll')){
           div.classList.remove('scroll');
        }
    num.innerText = fin!=0  ? Math.ceil(fin / (tasks.length+fin) * 100) : 0;
    procent.value = fin!=0  ? Math.ceil(fin / (tasks.length+fin) * 100) : 0;
    div.appendChild(new taskDiv(task).fullDiv());
}


const addBtn = document.getElementById('new');
const input = document.getElementById('inpl');

const addingTask  = () => {
        if(Array.from(div.classList).includes('scroll') &&  tasks.length < 8){
            div.classList.remove('scroll');
        }
          else{
          div.classList.add('scroll');
          
        }

        const value = input.value;
        tasks.push(value);
       getElements(value);
       setProgress();
       input.value = '';
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

     if( tasks.length < 8){
            div.classList.remove('scroll');
         }else{
            div.classList.add('scroll');
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
        fullDiv.addEventListener('dblclick', () => {
             const taskKey = `task ${this.element.innerText}`; 
            localStorage.removeItem(taskKey);
            this.element.setAttribute('contenteditable', 'true');
            this.element.focus();

        const onBlur = () => {
        const newValue = this.element.innerText.trim();
        const newKey = `task ${newValue}`;
        localStorage.setItem(newKey, newValue);
        this.element.removeAttribute('contenteditable');

        this.element.removeEventListener('blur', onBlur);
    };

    this.element.addEventListener('blur', onBlur);

        })
       
        icon.addEventListener('click', () => {
            icon.src = './assets/done.png';
            fullDiv.classList.add('removed');
            setTimeout(() => {
                const index = tasks.findIndex(task => this.element.innerText === task);
                localStorage.removeItem(`task ${this.element.innerText}`);  
               fullDiv.remove();
               tasks.splice(index,1);
                if( tasks.length < 8 && Array.from(div.classList).includes('scroll')){
            div.classList.remove('scroll');
         }
               fin++;
               localStorage.setItem('finished', fin);
              setProgress();
              

             
               
            }, 3000)
        });

        return fullDiv;
    }
}

const getProgress = () => {
    const prog = localStorage.getItem('progress');
    fin = localStorage.getItem('finished');
    num.innerText = prog;
    procent.value = prog;
    if( prog == null){
        num.innerText = '0';
    }
}

const setProgress = () => {
    const prog = fin !=0 ? Math.ceil(fin / (tasks.length+fin) * 100) : 0;
    num.innerText = prog;
    procent.value = prog;
    localStorage.setItem('progress', prog);
}

document.addEventListener('DOMContentLoaded', () => {
         getDate();
      exsTasks();
      getProgress();
})











