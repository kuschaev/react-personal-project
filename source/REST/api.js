import { MAIN_URL, TOKEN } from './config';
import { BaseTaskModel } from '../instruments/helpers';
import { v4 } from 'uuid';

export const api = {
    createTask: async (newTaskMessage) => {
        const newTask = new BaseTaskModel(
            v4(),
            false,
            false,
            newTaskMessage
        );
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify(newTask),
        });
        const { data: task } = await response.json();

        return task;
    },
    fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        const { data: tasks } = await response.json();

        return tasks;
    },
    updateTask: async (oldTask) => {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([oldTask]),
        });
        const { data: tasks } = await response.json();

        return tasks;
    },
    removeTask: async (id) => {
        const deleteUrl = `${MAIN_URL}/${id}`;

        await fetch(deleteUrl, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },
    completeAllTasks: async (oldTasks) => {
        const requests = oldTasks.map((task) =>
            fetch(MAIN_URL, {
                method:  'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  TOKEN,
                },
                body: JSON.stringify([task]),
            })
        );

        const tasks = await Promise.all(requests)
            .then((responses) => Promise.all(responses.map((r) => r.json())))
            .then((result) => result.map((r) => r.data));

        return tasks.reduce((a1, a2) => [...a1, ...a2]);
    },
};
