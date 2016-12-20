const fs = require('fs')

/**
 * check file/dir whether exist
 *
 * @param {string} path check path
 * @param {string} type [file, dir]
 *
 * @return boolean
 */
exports.isExist = function (path, type) {
  let ok = false
  try {
    const stat = fs.statSync(path)
    if (type === 'file' && stat.isFile()) ok = true
    if (type === 'dir' && stat.isDirectory()) ok = true
  } catch (e) {
    ok = false
  }
  return ok
}
