export function isObjectEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  // If we reach this point, every property in obj1 has a matching property in obj2
  return true
}
