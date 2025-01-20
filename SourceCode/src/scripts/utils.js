window.utils = {
    clone: (obj) => {
        let objToReturn;

        try {
            objToReturn = JSON.parse(JSON.stringify(obj));
        } catch(e) {
            objToReturn = [];
            console.log('ERROR at utils.clone', obj);
        }

        return objToReturn;
    }
}

window.elementUtils = {
    getClassList: (element) => {
        if(!element.parentElement) {
            return [];
        }

        return [...elementUtils.getClassList(element.parentElement), element.className];
    },
    blurElement: () => {
        let shadowElement = document.createElement('div');
        
        shadowElement.nodeType = 'div';
        shadowElement.style.width = '100%';
        shadowElement.style.height = '100%';
        shadowElement.style.background = 'blue';
        shadowElement.style.position = 'absolute';
        shadowElement.style.top = '0';
        shadowElement.style.left = '0';
        document.body.appendChild(shadowElement);

        shadowElement.addEventListener('click', (ev) => {
            // console.log()
            document.body.removeChild(shadowElement);
            let clickedElement = document.elementFromPoint(ev.x, ev.y);
            console.log(clickedElement);
        })

        return shadowElement
    }
}

window.fsUtils = {
    copyToClipboard: (textToCopy) => {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.insertBefore(textArea, document.body.firstChild);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    },
}