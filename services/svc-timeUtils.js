app.service('timeUtils', function() {        
    this.getDaysDifference = (date) => {
        const today = Date.now();    
        const newDate = new Date(date);
        const diffTime = Math.abs(newDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));   
      
        return diffDays;
    };
});