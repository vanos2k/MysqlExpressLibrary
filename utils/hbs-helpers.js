/**
 * @type {{loop(, *): void}}
 */

module.exports ={
    loopR(length, options) {
        let ret = '';

        for (let i = 0; i < 5; i++) {
            if (i < Math.round(length))
                ret = ret + `<span class=\"active\"></span>`;
            else {
                ret = ret + '<span></span>';
            }
        }
        return ret
    }
};