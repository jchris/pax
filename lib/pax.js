/*
 * pax
 * https://github.com/jchris/pax
 *
 * Copyright (c) 2013 Chris Anderson
 * Licensed under the APL license.
 */

 var qs = require('querystring');

// if there is an object in the new path,
// pluck it out and put it on the pax instance;

function processPath(path) {
  var query;
  if (path.push) {
    if (typeof path[path.length-1] === 'object') {
      path.query = path.pop();
    }
    return path;
  } else { // string
    return [path];
  }
}

function mergePaths(path, newPath) {
  var merged = path.concat(newPath);
  merged.query = path.query;
  if (newPath.query) {
    merged.query = merged.query || {};
    for (var key in newPath.query) {
      if (newPath.query.hasOwnProperty(key)) {
        merged.query[key] = newPath.query[key];
      }
    }
  }
  return merged;
}

function makeToString(path) {
  var first = true,
  encoded = path.map(function(p) {
    if (first) {
      first = false;
      if (/^http/.test(p)) {
        if (/\/$/.test(p)) {
          return p.substring(0,p.length-1);
        } else {
          return p;
        }
      }
    }
    return encodeURIComponent(p);
  });

  return function() {
    if (path.query) {
      return encoded.join('/') + '?' + qs.stringify(path.query);
    } else {
      return encoded.join('/');
    }
  };
}

var growPax;

function makeNextPathFun(path) {
  var nextPax = function(nextPath) {
    if (arguments.length > 1) {
      return growPax(path, [].map.call(arguments,function(arg){return arg;}));
    } else {
      return growPax(path, nextPath);
    }
  };
  nextPax.toString = makeToString(path);
  return nextPax;
}

function growPax(path, newPath) {
  newPath = processPath(newPath);
  path = mergePaths(path, newPath);
  return makeNextPathFun(path);
}

module.exports = function() {
  return makeNextPathFun([]).apply(this, arguments);
};

