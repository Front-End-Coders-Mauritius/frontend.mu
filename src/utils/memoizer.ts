export function Memoize(f) {
    let cache = {};
    return async function() {
        let hash;

        switch (arguments.length) {
            case 0:
                hash = null;
                break;
            case 1:
                hash = arguments[0];
                break;
            default:
                hash = Array.from(arguments).join("|");
        }

        if (Object.prototype.hasOwnProperty.call(cache, hash)) {
            return cache[hash];
        }

        try {
            cache[hash] = await f(...arguments);
        } catch(e) {
            console.warn(e);
        }

        return cache[hash];
    }
}