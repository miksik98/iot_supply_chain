const { createProducerTable } = require('./db/dbConnection');

async function createProducer(){
    var prompt = require('prompt');

    var prompt_attributes = [
        {name: 'companyName'}
    ];
    prompt.start();

    prompt.get(prompt_attributes, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        } else {
            const companyName = result.companyName;
            await createProducerTable(companyName)
        }
    });
}

module.exports = {
    createProducer
};

