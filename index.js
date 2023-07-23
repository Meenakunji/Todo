let todolistarray = [];

function addtask(task) {
  task.subtasks = [];
  todolistarray.push(task);
}

function deletetask(id) {
  const index = todolistarray.findIndex((task) => task.id === id);
  if (index !== -1) {
    todolistarray.splice(index, 1);
  }
}

function markAsDone(id) {
  const task = todolistarray.find((task) => task.id === id);
  if (task) {
    task.isDone = true;
  }
}

function markAsUndone(id) {
  const task = todolistarray.find((task) => task.id === id);
  if (task) {
    task.isDone = false;
  }
}

function addCategory(id, category) {
  const task = todolistarray.find((task) => task.id === id);
  if (task) {
    task.category = category;
  }
}

function savetask(id, newval) {
  const taskIndex = todolistarray.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    todolistarray[taskIndex].taskDetails = newval;
  }
}

function addSubtask(mainTaskID, subtask) {
  const mainTask = todolistarray.find((task) => task.id === mainTaskID);
  if (mainTask && !mainTask.isDone) {
    if (
      !mainTask.hasOwnProperty("subtasks") ||
      !Array.isArray(mainTask.subtasks)
    ) {
      mainTask.subtasks = [];
    }
    mainTask.subtasks.push(subtask);
  }
}

function renderSubtasks(mainTask) {
  const subtaskList = document.createElement("ul");
  subtaskList.classList.add("subtask");

  console.log(mainTask.subtasks);

  for (let i = 0; i < mainTask.subtasks.length; i++) {
    const subtaskItem = document.createElement("li");
    const subtaskText = document.createElement("span");
    subtaskText.innerHTML = mainTask.subtasks[i].taskDetails;

    const subid = mainTask.subtasks[i].id;

    const deletebtn = document.createElement("img");
    deletebtn.src = "https://cdn-icons-png.flaticon.com/512/3405/3405244.png";
    deletebtn.alt = "delete";

   
    // const deletebtn = document.createElement('button');
    //   deletebtn.innerText = "Delete"

    deletebtn.addEventListener("click", () => {
      // deletetask(taskID);
      

      const subarry = mainTask.subtasks.filter((subtask) => subtask.id !=subid);
      console.log(subarry);
      mainTask.subtasks = subarry;

      window.location.reload();
        
      
      renderSubtasks(mainTask.subtasks);
    });

    // Add class to completed subtasks
    if (mainTask.subtasks[i].isDone) {
      subtaskItem.classList.add("completed");
    }

    subtaskItem.appendChild(subtaskText);
    
    subtaskItem.appendChild(deletebtn);
    subtaskList.appendChild(subtaskItem);
  }

  return subtaskList;
}

// sort function basis on criteria pass

function sortTasks(criteria) {
  switch (criteria) {
    case "dueDate":
      todolistarray.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.dueDate) {
          return -1;
        } else if (b.dueDate) {
          return 0;
        } else {
          return 1;
        }
      });
      break;
    case "priority":
      todolistarray.sort((obj1, obj2) => {
        const a = obj1.priorityIndicator,
          b = obj2.priorityIndicator;

        return b - a;
      });
      break;
    default:
     
      todolistarray.sort((obj1, obj2) => {
        const a = obj1.id,
          b = obj2.id;

        return a- b;
      });
      
      break;
  }
}


// Check if the task is missed (backlog)
function isBacklog(task) {
  
  const dueDatex = new Date(task.dueDate);

  const duedatetime = dueDatex.getTime();
  const currentTime = new Date();

  const todaytime = currentTime.getTime();

  return todaytime >= duedatetime && !task.isDone;
}



function setReminder(task) {
  if (task.dueDate && !task.isDone) {

    //missing Task
    const dueDate = new Date(task.dueDate);

    const x = dueDate.getTime();
    const currentTime = new Date();

    const y = currentTime.getTime();

    if (y >= x) {
      const timeDifference = y - x;
      setTimeout(() => {
        alert(`Reminder: ${task.taskDetails}`);
      }, timeDifference);
    }


  }



}



function renderlist(todolistarray) {
  const listcontainer = document.getElementById("listitems");
  listcontainer.innerHTML = "";
  const filterDueDate = document.getElementById("filterDueDate").value;
  const filterCategory = document.getElementById("filterCategory").value;
  const filterPriority = document.getElementById("filterPriority").value;

  for (let i = 0; i < todolistarray.length; i++) {
    const task = todolistarray[i];
    if (todolistarray[i].taskDetails === "") {
      continue;
      
    }

    if (
      (filterDueDate && todolistarray[i].dueDate !== filterDueDate) ||
      (filterCategory && todolistarray[i].category !== filterCategory) ||
      (filterPriority && todolistarray[i].priority !== filterPriority)
    ) {
      continue;
    }

    const listItem = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.innerHTML = todolistarray[i].taskDetails;

    // Add class to completed tasks
    if (todolistarray[i].isDone) {
      listItem.classList.add("completed");
    }

    //display tags
    const tagsContainer = document.createElement("div");
    if (task.tags && task.tags.length > 0) {
      tagsContainer.classList.add("tags-container");

      const tagcontname = document.createElement("span");
      tagcontname.textContent = "Tags: ";

      tagsContainer.appendChild(tagcontname);

      task.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("tag");
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }

    const buttonsbox = document.createElement("div");
    buttonsbox.classList.add("btncontainer");

    const editicon = document.createElement("img");
    editicon.src = "https://cdn-icons-png.flaticon.com/512/3597/3597088.png";
    editicon.alt = "Edit";

    const deletebtn = document.createElement("img");
    deletebtn.src = "https://cdn-icons-png.flaticon.com/512/3405/3405244.png";
    deletebtn.alt = "delete";

    const donebtn = document.createElement("button");
    donebtn.innerHTML = "Mark as Done";
    donebtn.addEventListener("click", () => {
      markAsDone(todolistarray[i].id);
      renderlist(todolistarray);
    });

    const undonebtn = document.createElement("button");
    undonebtn.innerHTML = "Mark as Undone";
    undonebtn.addEventListener("click", () => {
      markAsUndone(todolistarray[i].id);
      renderlist(todolistarray);
    });

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Category";

    const categorybtn = document.createElement("button");
    categorybtn.innerHTML = "Add Category";
    categorybtn.addEventListener("click", () => {
      addCategory(todolistarray[i].id, categoryInput.value);
      renderlist(todolistarray);
    });

    const dueDateText = document.createElement("span");
    dueDateText.innerHTML = `Due Date: ${todolistarray[i].dueDate}`;

    const priorityText = document.createElement("span");
    priorityText.innerHTML = `Priority: ${todolistarray[i].priority}`;

    const categoryText = document.createElement("span");
    categoryText.innerHTML = `Category: ${todolistarray[i].category}`;

    const taskID = todolistarray[i].id;

    editicon.addEventListener("click", () => {
      const editinput = document.createElement("input");
      editinput.type = "text";
      editinput.value = todolistarray[i].taskDetails;

      const savebtn = document.createElement("button");
      savebtn.innerHTML = "Save";
      savebtn.classList.add("save-button");

      savebtn.addEventListener("click", () => {
        savetask(taskID, editinput.value);
        renderlist(todolistarray);
      });

      listItem.innerHTML = "";
      listItem.appendChild(editinput);
      listItem.appendChild(savebtn);
    });

    deletebtn.addEventListener("click", () => {
      deletetask(taskID);
      renderlist(todolistarray);
    });

    buttonsbox.appendChild(editicon);
    buttonsbox.appendChild(deletebtn);

    listItem.appendChild(taskText);
    listItem.appendChild(dueDateText);
    listItem.appendChild(priorityText);
    listItem.appendChild(categoryText);
    listItem.appendChild(tagsContainer);
    listItem.appendChild(buttonsbox);

    
      // Input for adding subtasks
      const subtaskInput = document.createElement("input");
      subtaskInput.type = "text";
      subtaskInput.placeholder = "Enter subtask";
      listItem.appendChild(subtaskInput);

      // Button to add subtasks
      const addSubtaskBtn = document.createElement("button");
      addSubtaskBtn.innerHTML = "Add Subtask";
      addSubtaskBtn.addEventListener("click", () => {
        const subtaskText = document.createElement("span");
        const subtask = {
          id: task.subtasks.length + 1,
          taskDetails: subtaskInput.value,
          isDone: false,
        };
        addSubtask(task.id, subtask);
        subtaskInput.value = "";
        subtaskText.innerHTML = subtask.taskDetails; // Set the subtask text to the new span
        listItem.appendChild(subtaskText);
       

        // Render subtasks
        const subtaskList = renderSubtasks(task);
        listItem.appendChild(subtaskList);

        renderlist(todolistarray);
      });
      listItem.appendChild(addSubtaskBtn);

     

      // Render subtasks, if any
      if (task.subtasks && task.subtasks.length > 0) {
        const subtaskList = renderSubtasks(task);
        listItem.appendChild(subtaskList);
      }
   

    const boxoffli = document.createElement("div");
    boxoffli.classList.add("boxoffli");

    boxoffli.appendChild(categoryInput);
    boxoffli.appendChild(categorybtn);

    if (!todolistarray[i].isDone) {
      boxoffli.appendChild(donebtn);
    } else {
      boxoffli.appendChild(undonebtn);
    }

    listItem.appendChild(boxoffli);

    listcontainer.appendChild(listItem);
  }
}

function calprioindicator(priority) {
  if (priority == "low") {
    return 0;
  }
  if (priority == "medium") {
    return 1;
  }
  if (priority == "high") {
    return 2;
  }
}

const savebtn = document.getElementById("savebtn");

savebtn.addEventListener("click", () => {
  const taskinput = document.getElementById("taskinput");
  const dueDateInput = document.getElementById("dueDateInput");
  const priorityInput = document.getElementById("priorityInput");
  const taginput = document.getElementById("taginput");
   
  // console.log(taskinput.value);

  if(taskinput.value==''){
    alert("enter a Task");
    return;
  }

  if(dueDateInput.value==''){
      alert("enter a date :");
      return;
  }




  const task = {
    // id: todolistarray.length + 1,
    id: Date.now(),
    taskDetails: taskinput.value,
    isDone: false,
    category: "",
    tags: taginput.value.split(",").map((tag) => tag.trim()),
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
    priorityIndicator: calprioindicator(priorityInput.value),
    subtasks: [],
  };
  // debugger;
  addtask(task);
  taskinput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "low";
  taginput.value = "";
  renderlist(todolistarray);
  setReminder(task);
  // window.location.reload();
});

// Load data from local storage and render the list
function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("todolist"));
  if (storedData) {
    todolistarray = storedData;
    renderlist(todolistarray);
  }
}



const filterBtn = document.getElementById("filterBtn");

filterBtn.addEventListener("click", () => {
  renderlist(todolistarray);
});

const sortbtn = document.getElementById("sortbtn");
sortbtn.addEventListener("click", () => {
  const sortSelect = document.getElementById("sortSelect");
  const sortCriteria = sortSelect.value;

  // Sort the tasks based on the selected sorting criteria
  sortTasks(sortCriteria);

  // Re-render the list after sorting
  renderlist(todolistarray);
});

const backlogBtn = document.getElementById("backlogBtn");
backlogBtn.addEventListener("click", () => {
  const listcontainer = document.getElementById("listitems");
  // listcontainer.innerHTML = "";

  // Filter and show only backlogs Tasks
  const backlogs = todolistarray.filter(isBacklog);

  renderlist(backlogs);
  


});

const viewall = document.getElementById('viewall');

viewall.addEventListener("click", () => {
     
  window.location.reload();


});

const searchbtn = document.getElementById("searchbtn");
searchbtn.addEventListener("click", () => {
  const searchinput = document.getElementById("searchinput").value.toLowerCase();
  const filteredTasks = todolistarray.filter((task) => {
    const taskName = task.taskDetails.toLowerCase();
    const subtaskNames = task.subtasks
      ? task.subtasks.map((subtask) => subtask?.taskDetails?.toLowerCase())
      : [];
    const tagNames = task.tags ? task.tags.map((tag) => tag.toLowerCase()) : [];
    // debugger;
    return (
      taskName.includes(searchinput) ||
      subtaskNames.includes(searchinput) ||
      tagNames.includes(searchinput)
    );
  });
  renderlist(filteredTasks);
  
});

// renderlist(todolistarray);

function saveToLocalStorage() {
  localStorage.setItem("todolist", JSON.stringify(todolistarray));
}

// Call this function to load data from local storage
loadFromLocalStorage();

// Save data to local storage whenever the list changes
window.addEventListener("beforeunload", saveToLocalStorage);
renderlist(todolistarray);
