import {baseApi} from "./baseApi.ts";


export const carApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCarTask: builder.mutation<any, {x: string, y: string}>({
            query: (args) => ({
                url: 'order/send_coords_from_web',
                method: 'POST',
                body: args
            })
        }),
        getCarPosition: builder.query<{x: string, y: string}, any >({
            query: () => ({url: 'car/get_car_coords'})
        }),
    })
})

export const {useCreateCarTaskMutation, useGetCarPositionQuery} = carApi



