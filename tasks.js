const tasks = [];
let taskcounter = 1;

function AllTasks(){
  return tasks;
}

function add(task){
  task.id = taskcounter++;
  tasks.push(task);
  return task;
}

function update(id,updatetask){
  const index = tasks.findIndex((task) => task.id === id );
  if (index !== -1){
    tasks[index] = {...tasks[index],...updatetask};
    return tasks[index]
  }else{
    return null;
  }
}

function deleted(id){
  const index = tasks.findIndex((task) => task.id === id );
  if(index !== -1){
    return tasks.splice(index, 1)[0]
  }else{
    return null;
  }
}

function createTask(task, callback) {
  const newTask = add(task);
  callback(null, newTask);
}

function AllTasks(callback) {
  // Return all tasks, no need to pass 'task' here
  callback(null, tasks);
}

module.exports={
  AllTasks,
  add,
  update,
  deleted,
  createTask
}