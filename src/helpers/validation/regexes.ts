// regexes

// the most basic just for development purposes
export const regexBasicAlphabet = new RegExp(/^[a-zA-Z]{2,128}$/);

// minimum 8 characters, maximum 128, at least one uppercase letter, one lowercase letter, one number and one special character
export const regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/);

// regex for alphabet in all languages and
// accepting for instance 你好我是帕維爾, Man könnte sagen
export const regexAlphabetAllLanguages = new RegExp(/[^\p{L}]+/gu);

export const regexEmail = new RegExp(/\S+@\S+\.\S+/);

// const regexExcludeLetters = new RegExp(/[\p{L}]+/gu);

// regex for matching latitude values
export const regexLatitude = new RegExp(/^(-?[1-8]?\d(?:\.\d{1,8})?|90(?:\.0{1,8})?)$/);

// regex for matching longitude values
export const regexLongitude = new RegExp(/^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,8})?|180(?:\.0{1,8})?)$/);
