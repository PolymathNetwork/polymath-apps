/**
 * This middleware can be used to translate state data from Legacy to
 * modern
 */
export default store => next => action => {
  return next(action);
};
