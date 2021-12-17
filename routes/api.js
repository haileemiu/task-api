const express = require('express');
const router = express.Router();
const Task = require('../models/task');

const Ajv = require("ajv");
const ajv = new Ajv()

const ajvSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        date: { type: "string" },
        completed: { type: "boolean" },
    },
    required: ["title", "date", "completed"],
    additionalProperties: false
}

const validate = ajv.compile(ajvSchema);

router.get('/tasks', async (req, res, next) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks.map((task) => ({
            id: task._id,
            title: task.title,
            date: task.date,
            completed: task.completed
        })))
    } catch (e) {
        next(err)
    }

});


router.post('/tasks', async (req, res, next) => {
    const valid = validate(req.body);
    if(!valid){
        res.send("Invalid data.")
        return;
    }

    try {
        const task = await Task.create(req.body);
        res.send({
            id: task._id,
            title: task.title,
            date: task.date,
            completed: task.completed
        });
    } catch (err) {ç
        next(err);
    }

});

router.get('/tasks/:id', async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        res.send({
            id: task._id,
            title: task.title,
            date: task.date,
            completed: task.completed
        })
    } catch (err) {
        next(err);
    }

});

router.put('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { returnOriginal: false });
        res.send({
            id: task._id,
            title: task.title,
            date: task.date,
            completed: task.completed
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/tasks/:id/delete', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id });
        res.send(`Successfully deleted: ${task.title}`)
    } catch (err) {
        next(err);
    }
});

module.exports = router;