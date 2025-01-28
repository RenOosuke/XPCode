/**
 * A class for managing subscriptions to events.
 */
declare class Subscriber {
    /**
     * Initializes the Subscriber instance with predefined subscription keys.
     * @param subscriptionKeys - An array of strings representing the keys for subscriptions.
     */
    constructor(subscriptionKeys?: string[]);

    /**
     * Subscribe to a specific key with a callback.
     * @param key - The key in subscriptions to subscribe to.
     * @param callback - The function to call when the event is triggered.
     * @returns A unique ID for the subscription.
     * @throws Error if the key is not defined in subscriptions.
     */
    subscribe(key: string, callback: (...args: any[]) => void): string;

    /**
     * Unsubscribe a specific callback using its key and UUID.
     * @param key - The key of the subscription.
     * @param uuid - The unique ID of the subscription to remove.
     * @throws Error if no subscription is found for the given key and UUID.
     */
    unsubscribe(key: string, uuid: string): void;

    /**
     * Get all subscriptions for a specific key.
     * @param key - The key to fetch subscriptions for.
     * @returns An array of all subscription callbacks for the key.
     */
    getSubscriptions(key: string): ((...args: any[]) => void)[];

    /**
     * Trigger all callbacks for a specific key with provided arguments.
     * @param key - The key of the event to trigger.
     * @param args - Arguments to pass to the callbacks.
     */
    trigger(key: string, ...args: any[]): void;

    /**
     * Generate a UUID for subscriptions.
     * @returns A unique UUID.
     */
    private generateUUID(): string;
}
