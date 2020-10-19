app.service('getFeaturedProperties', ['tokkoApi', 'sharedData', '$filter', '$q', function(tokkoApi, sharedData, $filter, $q) {
    var service = this;
 
    this.getSimilarProps = (operationType, typeId, price, customTags) => {

        let data = sharedData.tokkoSearchArgs.data;
        
        data.operation_types = [operationType];
        data.property_types = [typeId];
        data.price_from = Math.round(price * 0.8);
        data.price_to = Math.round(price * 1.2);
        data.filters = [];

        if (customTags > 0) data.with_custom_tags = [customTags.slice(-1)[0].id];

        const args = {data: JSON.stringify(data), order: 'desc'};

        return tokkoApi.find('property/search', args, $q.defer());  
    };

    this.getDevelopmentProps = (id) => {
        const args = {development: id, order: 'desc'};
        return tokkoApi.find('property', args, $q.defer());
    };
        
    this.getFeaturedProps = () => {
        let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};
        
        return tokkoApi.find('property/search', args, $q.defer());
    };

    this.getFeatured360Props = () => {
        let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};

        args.limit = 100;
        
        return tokkoApi.find('property/search', args, $q.defer());
    };

    this.getDevs = () => {
        let args = {order: 'desc', limit: 100};

        tokkoApi.find('development', args, $q.defer()).then(results => {
            results = results.data.objects;

            results.forEach((dev, index, array) => {
                service.getDevelopmentProps(dev.id).then(result => {
                    result = result.data.objects;

                    if (result.length > 0) {          
                        const minPriceProp = result.reduce((min, prop) => {
                            const price = prop.operations[prop.operations.length - 1].prices.slice(-1)[0].price;
                    
                            return price < min.operations[min.operations.length - 1].prices.slice(-1)[0].price ? prop : min;
                        }, result[0]);
            
                        const price = minPriceProp.operations[minPriceProp.operations.length - 1].prices.slice(-1)[0];
                        
                        dev.minPrice = $filter('currency')(price.price, `${price.currency} `, 0);
                    }
                    
                    if (index === array.length -1) sharedData.setDevs(results);
                }, reject => null);
            });
        }, reject => null);
    };

    this.getProperties = (url, args) => {
        var deferredAbort = $q.defer();

        var request = tokkoApi.find(url, args, deferredAbort);

        var promise = request.then(
            response => response.data,
            reject => $q.reject('Something went wrong!')
        );

        promise.abort = () => deferredAbort.resolve();

        promise.finally = () => {
            promise.abort = angular.noop;
            deferredAbort = request = promise = null;
        };

        return promise;
    };
}]);