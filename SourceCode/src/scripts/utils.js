const utils = {
    clone: (obj) => {
        let objToReturn;

        try {
            objToReturn = JSON.parse(JSON.stringify(obj));
        } catch(e) {
            objToReturn = [];
            console.log('ERROR at utils.clone', obj);
        }

        return objToReturn;
    },
    UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
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

class Subscriber {
    constructor(subscriptionKeys = []) {

        this.subscriptions = subscriptionKeys.reduce((acc, key) => {
            acc[key] = {}; // Each key will hold functions mapped by UUID
            return acc;
        }, {});

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.getSubscriptions = this.getSubscriptions.bind(this);
        this.trigger = this.trigger.bind(this);
        this.generateUUID = this.generateUUID.bind(this);
    }

    /**
     * Subscribe to a specific key with a callback.
     * @param {string} key - The key in subscriptions to subscribe to.
     * @param {function} callback - The function to call when the event is triggered.
     * @returns {string} - A unique ID for the subscription.
     */
    subscribe(key, callback) {
        if (!this.subscriptions[key]) {
            throw new Error(`Key '${key}' is not defined in subscriptions.`);
        }

        const uuid = this.generateUUID();
        this.subscriptions[key][uuid] = callback;
        return uuid;
    }

    /**
     * Unsubscribe a specific callback using its key and UUID.
     * @param {string} key - The key of the subscription.
     * @param {string} uuid - The unique ID of the subscription to remove.
     */
    unsubscribe(key, uuid) {
        if (this.subscriptions[key] && this.subscriptions[key][uuid]) {
            delete this.subscriptions[key][uuid];
        } else {
            throw new Error(`No subscription found for key '${key}' and UUID '${uuid}'.`);
        }
    }

    /**
     * Get all subscriptions for a specific key.
     * @param {string} key - The key to fetch subscriptions for.
     * @returns {Array} - An array of all subscription callbacks for the key.
     */
    getSubscriptions(key) {
        if (!this.subscriptions[key]) {
            return [];
        }
        return Object.values(this.subscriptions[key]);
    }

    /**
     * Trigger all callbacks for a specific key with provided arguments.
     * @param {string} key - The key of the event to trigger.
     * @param {...any} args - Arguments to pass to the callbacks.
     */
    trigger(key, ...args) {
        if (this.subscriptions[key]) {
            Object.values(this.subscriptions[key]).forEach(callback => callback(...args));
        }
    }

    /**
     * Generate a UUID for subscriptions.
     * @returns {string} - A unique UUID.
     */
    generateUUID() {
        return utils.UUID;
    }
}
