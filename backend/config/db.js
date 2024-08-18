const mongoose = require('mongoose')

const db_config = async () => {
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/Tables_sprint')
        if (db) {
            console.log('db connected successfuly');

        }
    } catch (error) {
        console.log(error);

    }
}

module.exports=db_config