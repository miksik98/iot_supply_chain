class Product {
    constructor(companyName, messageRootID, productType, description, productionLine, productionBatch, productionTime) {
        this.companyName = companyName;
        this.messageRootID = messageRootID;
        this.productType = productType;
        this.description = description;
        this.productionLine = productionLine;
        this.productionBatch = productionBatch;
        this.productionTime = productionTime;
    }

    verify() {
        // TODO
    }

    setSellerInformation(sellerName, sellerRootID) {
        this.companyName = sellerName;
        this.messageRootID = sellerRootID;
    }
}

module.exports = { Product }