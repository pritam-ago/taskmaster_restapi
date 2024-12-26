const express = require('express');
const app = express();
const Joi = require('joi');
app.use(express.json());

const tasks = [
    { id : 1, taskName : 'task 1'},
    { id : 2, taskName : 'task 2'},
    { id : 3, taskName : 'task 3'},
    { id : 4, taskName : 'task 4'},
    { id : 5, taskName : 'task 5'}
];
let lastId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;

app.get('/', (req, res) =>{
    res.send('Hey! This is the home page');
});

app.get('/api/tasks' ,(req, res) =>{
    res.write('This is the tasks list');
    res.write('\n');
    res.write(JSON.stringify(tasks));
    res.end();
});

app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) res.status(404).send('The task with the given ID not found!');
    else res.send(task);
});

app.post('/api/tasks', (req, res)=> {
    const { error } = validateTask(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        lastId++;
        
        const newTask = {
            id : lastId,
            taskName : req.body.taskName
        }
        tasks.push(newTask);
        res.send(newTask);
    }
});

app.put('/api/tasks/:id', (req, res) =>{
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) res.status(404).send('The task with the given ID not found!');
    else{
        const { error } = validateTask(req.body);
        if(error){
        res.status(400).send(error.details[0].message);
        }else{
            task.taskName = req.body.taskName;
            res.send(task);
        }
    }
});

app.delete('/api/tasks/:id', (req, res) =>{
    const task = tasks.find(c => c.id === parseInt(req.params.id));
    if(!task) res.status(404).send('The task with the given ID not found!');
    else{
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        res.send(tasks);
    }
})

function validateTask(task){
    const schema = Joi.object({
        taskName : Joi.string().min(5).required()
    });

    return schema.validate(task);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`This mf is good and running on port: ${port}`));