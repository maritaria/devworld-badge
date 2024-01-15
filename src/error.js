/**
 * @param {{message?:string, cause?: Error, data?: any, constructor?: ErrorConstructor}} options
 * @return {Error}
 */
export function createError(options) {
  const instance = new (options.constructor ?? Error)(options.message);
  return Object.assign(instance, options);
}
