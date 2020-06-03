export default clone;
/**
 * Clone
 *
 * @param {*} - element to be cloned
 * @returns {*} - cloned element
 *
 * @todo It'll work adequately as long as the data in the
 * objects and arrays form a tree structure. That is, there
 * isn't more than one reference to the same data in the
 * object.
 *
 * @see https://stackoverflow.com/q/728360/1815449
 */
declare function clone(obj: any): any;
