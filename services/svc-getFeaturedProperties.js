app.service('getFeaturedProperties', function() {
    this.getFeatured = (scope, tokkoApi) => {
        scope.featured = [];
        scope.featuredPropertiesMapped = [];
        scope.featReady = false;
        
        let data = tokkoSearchArgs.data;
        data.filters.push(["is_starred_on_web", "=", "true"]);
        const args = {data: JSON.stringify(data), order: 'desc'};

        tokkoApi.find('property/search', args, function(result) {
            let props = [];
            result.forEach((p) => {
                props.push({
                    id: p.id,
                    type: p.operations[0].operation_type,
                    currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
                    price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
                    cover_photo: p.photos[0].image,
                    parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
                    area: p.type.id === 1 ? p.surface : p.roofed_surface,
                    prop: p
                })
            });

            scope.featured = props;
            
            scope.featuredPropertiesMapped = props.map(property => {
                return {
                    id: property.id,
                    photo: property.cover_photo,
                    title: property.prop.publication_title,
                    price: property.price,
                    currency: property.currency,
                    area: property.area,
                    suitAmount: property.prop.suite_amount,
                    bathroomAmount: property.prop.suite_amount       
                }
            });                       
            
            scope.featReady = true;         
            
            scope.$apply();
            uiFunctions.buildCarousel();
        });  
    };
      
    this.getSimilar = (scope, tokkoApi) => {
        scope.similar = [];
        scope.simReady = false;
        let data = tokkoSearchArgs.data;
        data.operation_types = scope.p.operation_type == 'Venta' ? [1] : [2];
        data.property_types = [scope.p.prop.type.id];
        data.filters = [];
        if(scope.p.prop.custom_tags.length > 0) {
          data.with_custom_tags = [scope.p.prop.custom_tags.slice(-1)[0].id];
        }
        const args = {data: JSON.stringify(data), order: 'desc'};
        tokkoApi.find('property/search', args, function(result){
          let props = [];
          result.forEach((p) => {
                props.push({
                    id: p.id,
                    type: p.operations[0].operation_type,
                    currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
                    price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
                    cover_photo: p.photos[0] ? p.photos[0].image : '/images/no-image.png',
                    parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
                    area: p.type.id === 1 ? p.surface : p.roofed_surface,
                    prop: p
                })
          });

          scope.similar = props;
          scope.simReady = true;
          scope.$apply();
        });  
    };

    this.getDevProps = (scope, tokkoApi) => {
        scope.devProps = [];
        scope.devPropsReady = false;
        const args = {development: scope.d.id, order: 'desc'};
        tokkoApi.find('property', args, function(result){
            let props = [];
            result.forEach((p) => {
                props.push({
                    id: p.id,
                    type: p.operations[0].operation_type,
                    currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
                    price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
                    cover_photo: p.photos[0].image,
                    parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
                    area: p.type.id === 1 ? p.surface : p.roofed_surface,
                    sell: p.operations.filter(p => p.operation_type == "Venta")[0]?.prices.slice(-1)[0],
                    rent: p.operations.filter(p => p.operation_type == "Alquiler")[0]?.prices.slice(-1)[0],
                    parkings_av: p.parking_lot_amount > 0 ? "Si" : "No",
                    prop: p
                })
            });

            scope.devProps = props;
            scope.devPropsReady = true;
            scope.$apply();
        });  
    };

    this.getFeaturedMobile = (scope, tokkoApi) => {
        scope.featuredPropertiesMapped = [];
        scope.featReadyMobile = false;
        
        let data = tokkoSearchArgs.data;
        data.filters.push(["is_starred_on_web", "=", "true"]);
        const args = {data: JSON.stringify(data), order: 'desc'};

        tokkoApi.find('property/search', args, function(result) {
            let props = [];
            result.forEach((p) => {
                props.push({
                    id: p.id,
                    type: p.operations[0].operation_type,
                    currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
                    price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
                    cover_photo: p.photos[0].image,
                    parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
                    area: p.type.id === 1 ? p.surface : p.roofed_surface,
                    prop: p
                })
            });
            
            scope.featuredPropertiesMapped = props.map(property => {
                return {
                    id: property.id,
                    photo: property.cover_photo,
                    title: property.prop.publication_title,
                    price: property.price,
                    currency: property.currency,
                    area: property.area,
                    suitAmount: property.prop.suite_amount,
                    bathroomAmount: property.prop.suite_amount       
                }
            });                       
            
            scope.featReadyMobile = true;         
            
            scope.$apply();
        });  
    };
});