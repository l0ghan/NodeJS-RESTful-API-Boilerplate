// remove undefined field (property) from one-level object
const removeUndefined = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(
    (key) => newObj[key] === undefined && delete newObj[key]
  );
  return newObj;
};

// remove undefined field (property) from nested objects
const cleanedObject = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = cleanedObject(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

// Module exports
module.exports = { removeUndefined, cleanedObject };
