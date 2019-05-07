import { MAIN_URL, TOKEN } from './config';

export const api = {
    createTask: async (newTask) => {
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
            body: JSON.stringify(oldTask),
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
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify(oldTasks),
        });
        // TODO: theoretically must be done via Promise.all
        const { data: tasks } = await response.json();

        return tasks;
    },
};
