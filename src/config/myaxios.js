import axios from "axios"

export default axios.create({
    baseURL: 'http://localhost:3500'
});

// default exports can be imported with any name, are used to export single value 
// export const ... are named exports, can be used to export multiple values, and have to be imported using the same name (alias can be used), have to be destructured 