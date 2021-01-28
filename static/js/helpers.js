
export function isValidTitle(title) {
    const NUM = '1234567890'
    const ENG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    const char = title.trim()[0]
    return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}


export const getIDNum = (strWithID) => +(strWithID.match(/\d+/)[0])
