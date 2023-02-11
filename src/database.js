import fs from 'node:fs/promises'


const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8')
        .then((data) => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table , search){
        let data = this.#database[table] ?? []

        if(search) {

            const { title, description} = search

            if(title!==undefined || description!==undefined){
                data = data.filter(row => {
                    return Object.entries(search).some(([key, value]) => {
                        return row[key].includes(value)
                    })
                })
            }
            
        }

        return data
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else{
            this.#database[table] = [data]
        }

        this.#persist();

        return data
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)


        if(rowIndex > -1){ 
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data){
        const rowFind = this.#database[table].find(row => row.id === id)
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(!rowFind){
            return 
        }

        this.#database[table][rowIndex] = { id, ...rowFind, ...data}
            
        this.#persist()
    }

    check(table, id){
        const rowFind = this.#database[table].find(row => row.id === id)

        if(!rowFind){
            return 'Task Not Found'
        }

        
    }
}
