app.service('getFeaturedProperties', ['tokkoApi', 'sharedData', '$filter', function(tokkoApi, sharedData, $filter) {
    var service = this;
 
    this.getSimilarProps = (operationType, typeId, price, customTags, callback) => {

        let data = sharedData.tokkoSearchArgs.data;
        
        data.operation_types = [operationType];
        data.property_types = [typeId];
        data.price_from = Math.round(price * 0.8);
        data.price_to = Math.round(price * 1.2);
        data.filters = [];

        if (customTags > 0) data.with_custom_tags = [customTags.slice(-1)[0].id];

        const args = {data: JSON.stringify(data), order: 'desc'};

        tokkoApi.find('property/search', args, callback);  
    };

    this.getDevelopmentProps = (id, callback) => {
        const args = {development: id, order: 'desc'};
        tokkoApi.find('property', args, callback);
    };
        
    this.getFeaturedProps = (callback) => {
        let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};
        
        tokkoApi.find('property/search', args, callback);
    };

    this.getFeatured360Props = (callback) => {
        let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};

        args.limit = 100;
        
        tokkoApi.find('property/search', args, callback);
    };

    this.getDevs = () => {
        let args = {order: 'desc', limit: 100};

        tokkoApi.find('development', args, function(results) {
            results.forEach((dev, index, array) => {
                service.getDevelopmentProps(dev.id, result => {
                    if (result.length > 0) {          
                        const minPriceProp = result.reduce((min, prop) => {
                            const price = prop.operations[prop.operations.length - 1].prices.slice(-1)[0].price;
                    
                            return price < min.operations[min.operations.length - 1].prices.slice(-1)[0].price ? prop : min;
                        }, result[0]);
            
                        const price = minPriceProp.operations[minPriceProp.operations.length - 1].prices.slice(-1)[0];
                        
                        dev.minPrice = $filter('currency')(price.price, `${price.currency} `, 0);
                    }
                    
                    if (index === array.length -1) sharedData.setDevs(results);
                });
            });
        });
    };
}]);