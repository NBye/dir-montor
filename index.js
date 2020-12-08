const fs = require("fs");
const path = require('path');
const watchDir = function (event, dir, callback) {
    if (event == 'rename' && fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        fs.watch(dir, (event, filename) => {
            watchDir(event, dir + '/' + filename, callback);
        });
    }
    clearTimeout(watchDir.timer);
    watchDir.timer = setTimeout(() => {
        callback();
    }, 600)
};

module.exports = function (dir, callback) {
    let dirs = dir instanceof Array ? dir : [dir];
    while (dirs.length) {
        let dir = dirs.shift();
        try {
            fs.watch(dir, (event, filename) => {
                watchDir(event, dir + '/' + filename, callback);
            });
            fs.readdirSync(dir).forEach((item) => {
                let fpath = path.join(dir, item);
                if (fs.statSync(fpath).isDirectory()) {
                    dirs.push(fpath);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
}