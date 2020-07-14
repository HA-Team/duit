app.service('sliderMoves', function() {        
    this.moveSlider = (element, index, arrLength, side, pxToMove) => {           
        pxToMove = pxToMove ?? window.innerWidth;        
        
        if (side == 'left') index = index == 1 ? arrLength : index - 1;
        else if (side == 'right') index = index == arrLength ? 1 : index + 1;                                 

        element.scrollLeft = pxToMove * (index - 1);
        
        return index;
    };
});