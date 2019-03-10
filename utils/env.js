exports.isDev = isDev;
function isDev() {
    return !isProd();
}

exports.isProd = isProd;
function isProd() {
    return process.env.NODE_ENV === 'production';
}
