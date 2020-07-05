app.service('getFeaturedProperties', function(tokkoApi) {     
    this.getSimilarProps = (operationType, typeId, customTags, callback) => {

        let data = tokkoSearchArgs.data;

        data.operation_types = [operationType];
        data.property_types = [typeId];
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
        let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};
        
        tokkoApi.find('property/search', args, callback);
    };

    this.getFeatured360Props = (callback => {
        let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
        data.filters.push(["is_starred_on_web", "=", "true"]);
        let args = {data: JSON.stringify(data), order: 'desc'};

        args.limit = 100;
        
        tokkoApi.find('property/search', args, callback);
    });
});