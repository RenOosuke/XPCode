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