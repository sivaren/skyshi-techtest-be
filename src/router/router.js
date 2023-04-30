// import section
const express = require('express');

const {
    getAllActivities,
    getOneActivity,
    createActivity,
    updateActivity,
    deleteActivity,
} = require('../controller/ActivityController');

const {
    getAllTodos,
    getOneTodo,
    createTodo,
    updateTodo,
    deleteTodo,
} = require('../controller/TodoController');

// create router from express
const router = express.Router();

// routing
router.get('/', async (_, res) => {
    console.log('Welcome to the app!');
    res.status(200).json({
        msg: "devcode updated"
    });
});

// activity routes
router.get('/activity-groups', getAllActivities);
router.get('/activity-groups/:id', getOneActivity);
router.post('/activity-groups', createActivity);
router.patch('/activity-groups/:id', updateActivity);
router.delete('/activity-groups/:id', deleteActivity);

// todo routes
router.get('/todo-items', getAllTodos);
router.get('/todo-items/:id', getOneTodo);
router.post('/todo-items', createTodo);
router.patch('/todo-items/:id', updateTodo);
router.delete('/todo-items/:id', deleteTodo);

module.exports = { router };
