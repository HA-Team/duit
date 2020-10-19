app.service('sliderMoves', function() {        
    this.moveSliderByIndex = (element, index, arrLength, side, pxToMove) => {           
        pxToMove = pxToMove ? pxToMove : window.innerWidth;        
        
        if (side == 'left') index = index == 1 ? arrLength : index - 1;
        else if (side == 'right') index = index == arrLength ? 1 : index + 1;                                 

        element.scrollLeft = pxToMove * (index - 1);
        
        return index;
    };

    this.moveSliderByScrollLeft = (element, index, arrLength, side, pxToMove) => {           
        if (side == 'left' && index != 1) {
            index --;
            element.scrollLeft = pxToMove;
        }

        if (side == 'right' && index != arrLength) {
            index ++;
            element.scrollLeft = pxToMove;
        }                                
        
        return index;
    };
});