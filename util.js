module.exports = {
    vectorResult: (res, numClasses) => {
        let i = 0;
        const vec = [];
        for (i; i < numClasses; i++) {
           vec.push(0);
        }
        vec[res] = 1;
        return vec;
    },

    indexOfMaxArrayVal: (array) => {
        return array.indexOf(Math.max.apply(Math, array));
    },

    /* Transforms:
     * { ABC: [1, 2, 3], DEF: [4, 5, 6] }
     * into
     * [1, 2, 3, 4, 5, 6]
     */
    flattenObject: (obj) => {
        return Array.prototype.concat.apply([], Object.keys(obj).map((key) => obj[key]));
    },

    /*
     * Transforms:
     * { ABC: [1, 2, 3], DEF: [4, 5, 6] }
     * into
     * { 1: ABC, 2: ABC, 3: ABC, 4: DEF, 5: DEF, 6: DEF }
     */
    transformObject: (obj) => {
        return Object.assign.apply(
            null,
            [].concat(
                ...Object
                    .entries(obj)
                    .map((entry) => {
                        const value = entry[0];
                        const keys = entry[1];
                        return keys.map((key) => {
                            return { [key]: value };
                        });
                    })
            )
        );
    },
};