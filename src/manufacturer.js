const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter')
const { createChannel, createMessage, parseMessage, mamAttach } = require('@iota/mam.js');
const crypto = require('crypto');
const product = require('./product')
const Product = product.Product
const { createProduct } = require('./db/query')

function generateSeed(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
}

function create_product()
{
    var prompt = require('prompt');

    var prompt_attributes = [
        {name: 'type',},
        {name: 'ID',},
        {name: 'description',},
        {name: 'productionLine',},
        {name: 'productionBatch',},
        {name: 'productionTime',},
        {name: 'seed'},
        {name: 'sideKey'}
    ];

    prompt.start();

    prompt.get(prompt_attributes, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        } else {
            const productType = result.type;
            const ID = result.ID;
            const description = result.description;
            const productionLine = result.productionLine;
            const productionBatch = result.productionBatch;
            var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            const productionTime = new Date(result.productionBatch.replace(pattern,'$3-$2-$1'));
            const sideKey = asciiToTrytes(result.sideKey);
            const seed = 'EHDULKVCMQRKKCMOARNHQTNWIXMZQOZMXWEIBSDHIGFUXAKMVRDKTQAJJVEXJTT9YSUVGQCVIZFWNGGGZ'//generateSeed(81);
            const product = new Product(null, null, productType, ID, description, productionLine, productionBatch, productionTime)

            const mode = 'restricted';
            console.log("seed "+seed)
            let channelState = createChannel(seed, 2, mode, sideKey)
            console.log(channelState)
            const mamMessage = createMessage(channelState, asciiToTrytes(JSON.stringify(product)));

            console.log('Seed:', channelState.seed);
            console.log('Address:', mamMessage.address);
            console.log('Root:', mamMessage.root);
            console.log('NextRoot:', channelState.nextRoot);

            product.messageRootID = mamMessage.root
            createProduct(product)

            const decodedMessage = parseMessage(mamMessage.payload, mamMessage.root, sideKey);

            console.log('Decoded NextRoot', decodedMessage.nextRoot);
            console.log('Decoded Message', decodedMessage.message);

            const api = composeAPI({provider: "http://bare01.devnet.iota.cafe:14265"});

            console.log('Attaching to tangle, please wait...')
            await mamAttach(api, mamMessage, 3, 9, "MY9MAM");
            console.log(`You can view the mam channel here https://utils.iota.org/mam/${mamMessage.root}/${mode}/${sideKey}/devnet`);
        }
    });
}
create_product();