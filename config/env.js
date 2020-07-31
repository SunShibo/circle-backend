//根据不同的环境更改不同的baseUrl
let baseUrl = '';

//开发环境下
if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://123.56.71.194:8081';

} else if (process.env.NODE_ENV == 'production') {
    baseUrl =  'http://123.56.71.194:8081';
}

export {
    baseUrl,//导出baseUrl
}