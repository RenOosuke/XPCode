const ElementUtils = {
    getRemSize: () => {
        return parseFloat(getComputedStyle(document.documentElement).fontSize)
    },
    getSizeInRems: (size) => {
        return size / ElementUtils.getRemSize();
    },
    parseRems (el, prop){
        let pixelHeight = getComputedStyle(el, '')[prop];
        let intHeight = parseInt(pixelHeight);
        let rems = (intHeight/16);
        
        return rems;
    },

    getCalculatedHeightRems(elSelector, include = {}) {
        let parseRems = ElementUtils.parseRems;
        /**@type {HTMLElement} */
        let el = jQuery(elSelector)[0];


        let remHeight = parseRems(el, 'height');
        let topPadding = parseRems(el, 'padding-top');
        let bottomPadding = parseRems(el, 'padding-bottom');
        let topMargin = parseRems(el, 'margin-top');
        let bottomMargin = parseRems(el, 'margin-bottom');
        let elRect = el.getBoundingClientRect();
        let _top = (include.top || false) && elRect.top;
        let additionalSizes = _top;
        return remHeight + topPadding + bottomPadding + topMargin + bottomMargin + (additionalSizes/16);
    },

    getCalculatedWidthRems(elSelector, include = {}) {
        let parseRems = ElementUtils.parseRems;
        let el = jQuery(elSelector)[0];


        let remHeight = parseRems(el, 'width');
        let topPadding = parseRems(el, 'padding-left');
        let bottomPadding = parseRems(el, 'padding-right');
        let topMargin = parseRems(el, 'margin-left');
        let bottomMargin = parseRems(el, 'margin-right');
        
        let elRect = el.getBoundingClientRect();
        let _left = (include.left || 0) && elRect.left;
        let additionalSizes = _left;

        return remHeight + topPadding + bottomPadding + topMargin + bottomMargin + (additionalSizes/16);
    },
    getBoundingSize(elSelector, /** @type {DOMRect}*/properties, rems = false) {
        let boundingRect = jQuery(elSelector)[0].getBoundingClientRect();
        let calculatedSizes = {};

        Object.keys(properties).forEach((property) => {
            let size = boundingRect[property];
            calculatedSizes[property] = rems ? ElementUtils.getSizeInRems(size) : size; 
        })
        
        return calculatedSizes
    },
    dotIsInside(/** @type {elementCorners}*/parentCoords, /** @type {[x: number, y: number]}*/dotCoords, addProps) {
        // let [topLeft, topRight, bottomRight, bottomLeft] = parentCoords;
        let {onlyBorder = false, offset= 0} = (addProps || {})
        let [x, y] = dotCoords;
        
        let passing = parentCoords.filter((parentCorner, i) => {
            let x1 = parentCorner[0];
            let y1 = parentCorner[1];

            let xPassess = [0, 3].includes(i) ? x1 <= x + offset : x1 >= x - offset;
            let yPasses = [0, 1].includes(i) ? y1 <= y + offset : y1 >= y - offset;

            return xPassess && yPasses;
        })

        let requiredCorners = 4;

        return passing.length >= requiredCorners;
    },

    isInsideOf(/** @type {HTMLElement}*/parentEl, /** @type {HTMLElement} */childEl, addProps) {
        let {offset = 0, onlyBorder = false} = (addProps || {});

        let parentRect = parentEl.getBoundingClientRect();
        let childRect = childEl.getBoundingClientRect();
        
        let parentCorners = []
        {
            let x = parentRect.x;
            let y = parentRect.y;

            let x1 = x, y1 = y;
            let x2 = x + parentRect.width, y2 = y + parentRect.height;

            parentCorners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
        }
        
        let childCorners = []
        {
            let x = childRect.x;
            let y = childRect.y;

            let x1 = x, y1 = y;
            let x2 = x + childRect.width, y2 = y + childRect.height;

            childCorners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
        }

        let diagonalsInside = childCorners.map(_corner => ElementUtils.dotIsInside(parentCorners, _corner, spreader(addProps, childEl)));

        return  onlyBorder ? diagonalsInside.reduce((acc, diag) => {
            acc += diag;
            return acc;
        }, 0) > 1 : (((diagonalsInside[0] * diagonalsInside[2]) || (diagonalsInside[1] * diagonalsInside[3])));
    },
    
    areOverlapping(el1, el2) {
        if(!el1) {
            return false;
        }

        let rect1 = (el1.getBoundingClientRect());
        let rect2 = el2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        )
    },
    eventCleanUpUtil: () => {
        let cleanUpFunctions = [];
        let elementsMemoization = [];

        let clean = () => {
            cleanUpFunctions.forEach(a => a());
        }

        let _addEventListener = (element, eventName, func, additionalOptions) => {
            element.addEventListener(eventName, func, additionalOptions);

            cleanUpFunctions.push(() => element.removeEventListener(eventName, func, false));
        }

        return {
            customEventListener: _addEventListener,
            clean
        }
    },

    generateId: (stringValue = 'popup') => {
        let popupId = `_${Math.random(0, 1)*10000000}_${stringValue}_${+(new Date())}`.replace(".", '_');
        return popupId;
    },

    getClassList: (element) => {
        if(!element.parentElement) {
            return [];
        }

        return [...ElementUtils.getClassList(element.parentElement), element.className];
    },
    
    // areOverlappingByComputed(el1, el2) {
    //     if(!el1) {
    //         return false;
    //     }

    //     let rect1 = ;
    //     let rect2 = el2.getBoundingClientRect();

    //     return !(
    //         rect1.top > rect2.bottom ||
    //         rect1.right < rect2.left ||
    //         rect1.bottom < rect2.top ||
    //         rect1.left > rect2.right
    //     )
    // },
};