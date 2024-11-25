import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {createApi} from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8888/',
        prepareHeaders: (headers) => headers,
    }),
    endpoints: () => ({}),
})
