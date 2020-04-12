class Department {
    constructor(id, name){
        this.id = id;
        this.name = name;
    }

    printInfo() {
        for(key in this){
            console.table(key, this.key);
        }
    }
}

module.exports = Department;