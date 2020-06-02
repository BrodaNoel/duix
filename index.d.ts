declare var _default: {
    /**
     * Store data into the storage
     * @param {*} key: the key under wich the value will be stored
     * @param {*} newValue: the associated data
     */
    set(key: any, newValue: any): void;
    /**
     * Return the data associated to the key
     * @param {*} key
     */
    get(key: any): any;
    /**
     *
     * @param {*} key - the key of the data
     * @param {function(any, any):void} callback - called when the data chagne
     * @param {object} options
     * @param {boolean} [options.fireImmediately=false] - if true, the callback is immediately fired with the last stored value
     * @returns {function(void):void} - Unregister the listener
     */
    subscribe(key: any, callback: (arg0: any, arg1: any) => void, options?: {
        fireImmediately: boolean;
    }): (arg0: void) => void;
};
export default _default;
