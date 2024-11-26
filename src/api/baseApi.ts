import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {createApi} from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://10.3.0.163:8080/',
        prepareHeaders: (headers) => headers,
    }),
    endpoints: () => ({}),
})
