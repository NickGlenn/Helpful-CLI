import vm from "vm";
import { flatten } from "lodash";

/**
 * Check a when evaluation safely in a node VM.
 *
 * @param  {Object} ctx
 * @param  {Any} val
 * @return {Boolean}
 */
export default function (ctx, val) {
  if ( ! val) return true;
  if (typeof val === "function") return val(ctx.input);
  if (typeof val !== "string") {
    throw new Error("When values must be a function or string that can be evaluated!");
  }

  var sandbox = Object.assign({ __RESULT__: false }, helpers, ctx.input);
  var script = new vm.Script(`__RESULT__ = ${val}`);
  var context = new vm.createContext(sandbox);
  script.runInContext(context);
  return sandbox.__RESULT__;
}

/**
 * Provide an object of utility functions to our when queries.
 */
const helpers = {
  has (arr, ...values) {
    values = flatten(values);
    for (var i = 0; i < values.length; i++) {
      if (arr.indexOf(values[i]) === -1) {
        return false;
      }
    }
    return true;
  }
};