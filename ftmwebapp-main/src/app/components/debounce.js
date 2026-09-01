import {debounce} from "lodash"

const debounceSearchParams = async (apiCall, timing) => {

    try {
        let debouncedFunc = debounce(apiCall, timing);
        let debouncedData = debouncedFunc();

        return debouncedData;
    } catch (error) {
        console.log('error ', error);
        return 0;
    }
};

export default debounceSearchParams;