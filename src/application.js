const { buyProduct } = require('./buyer');
const { buy_compose } = require('./buyer_compose');
const { create_product } = require('./manufacturer')
const prompt = require('prompt')

prompt.start();

prompt.get([{name: 'mode'}], async function (err, result) {
    if (err) {
        console.log(err);
        return 1;
    } else {
        switch (result.mode) {
            case "buy one":
                await buyProduct();
                break;
            case "buy many":
                await buy_compose();
                break;
            case "create":
                await create_product();
                break;
            default:
                console.log("WRONG MODE")
                break;
        }
    }
});