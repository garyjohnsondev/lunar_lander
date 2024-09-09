// Provides local storage access for storing and retrieving persistent game data

LunarLander.utilities.StorageUtils = (function() {
    "use strict";

    const STORAGE_PREFIX = "LunarLander";

    function store(item, name) {
        localStorage[STORAGE_PREFIX + "." + name] = JSON.stringify(item);
    }

    function retrieve(name) {
        let storedItem = localStorage.getItem(STORAGE_PREFIX + "." + name);
        if (storedItem !== null) {
            return JSON.parse(storedItem);
        } else {
            return null;
        }
    }

    return {
        store,
        retrieve
    }
}());