import {Database} from './database.js'
import {randomUUID} from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method:'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => { 

            const { search } = req.query;

            const tasks = database.select('tasks', {
                title: search,
                description: search,
            })

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method:'POST',
        path: buildRoutePath('/tasks'),
        handler:(req, res) => {
            const {title, description} = req.body

            if(!title || !description){
                return res.writeHead(404).end()
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at : null,
                created_at : new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
            
        }
    },
    {
        method:'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: ( req, res)=> {
            const { title, description} = req.body
            const { id}  = req.params

            const message = database.check('tasks', id)
            
            if(!title || !description){
                return res.writeHead(404).end()
            }

            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date(),
                completed_at: null,
            })

            return res.writeHead(200).end(message)
            
        }
    },
    {
        method:'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            const message = database.check('tasks', id)
            
            database.delete('tasks', id)

            return res.writeHead(204).end(message)

        }
    },
    {
        method:'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const message = database.check('tasks', id)

            database.update('tasks', id, {
                completed_at: new Date(),
            })

            return res.writeHead(202).end(message)
        }
    }
]