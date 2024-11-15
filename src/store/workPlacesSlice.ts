import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    workPlaces: [
        { place: 1, x: 1100, y: 1300, name: "Иван Иванов" },
        { place: 2, x: 2300, y: 1300, name: "Алексей Петров" },
        { place: 3, x: 3700, y: 1300, name: "Сергей Сидоров" },
        { place: 4, x: 5200, y: 1300, name: "Дмитрий Кузнецов" },
        { place: 5, x: 1100, y: 4600, name: "Николай Попов" },
        { place: 6, x: 2300, y: 4600, name: "Владимир Смирнов" },
        { place: 7, x: 3700, y: 4600, name: "Андрей Волков" },
        { place: 8, x: 5200, y: 4600, name: "Евгений Зайцев" },
        { place: 9, x: 1100, y: 7600, name: "Александр Борисов" },
        { place: 10, x: 2300, y: 7600, name: "Максим Григорьев" },
        { place: 11, x: 3700, y: 7600, name: "Константин Соловьёв" },
        { place: 12, x: 5200, y: 7600, name: "Юрий Васильев" },
        { place: 13, x: 1100, y: 10600, name: "Анатолий Морозов" },
        { place: 14, x: 2300, y: 10600, name: "Павел Медведев" },
        { place: 15, x: 3700, y: 10600, name: "Игорь Егоров" },
        { place: 16, x: 5200, y: 10600, name: "Вячеслав Фёдоров" },
        { place: 17, x: 1100, y: 13900, name: "Роман Михайлов" },
        { place: 18, x: 2300, y: 13900, name: "Олег Тихонов" },
        { place: 19, x: 3700, y: 13900, name: "Виктор Орлов" },
        { place: 20, x: 5200, y: 13900, name: "Станислав Ковалёв" },
        { place: 21, x: 1100, y: 17100, name: "Егор Абрамов" },
        { place: 22, x: 2300, y: 17100, name: "Артём Гусев" },
        { place: 23, x: 3700, y: 17100, name: "Виталий Козлов" },
        { place: 24, x: 5200, y: 17100, name: "Георгий Тарасов" },
        { place: 25, x: 300, y: 20300, name: "Денис Беляев" },
        { place: 26, x: 1100, y: 20300, name: "Тимофей Соболев" },
        { place: 27, x: 2300, y: 20300, name: "Григорий Лебедев" },
        { place: 28, x: 3700, y: 20300, name: "Леонид Скворцов" },
        { place: 29, x: 5200, y: 20300, name: "Кирилл Симонов" },
        { place: 30, x: 300, y: 23200, name: "Антон Чернов" },
        { place: 31, x: 1100, y: 23200, name: "Фёдор Захаров" },
        { place: 32, x: 2300, y: 23200, name: "Василий Зуев" },
        { place: 33, x: 3700, y: 23200, name: "Аркадий Князев" },
        { place: 34, x: 5200, y: 23200, name: "Геннадий Мартынов" },
        { place: 35, x: 8500, y: 20300, name: "Михаил Панов" },
        { place: 36, x: 14000, y: 300, name: "Илья Титов" },
    ],
};

export const workPlaceSlice = createSlice({
    name: 'workPlaces',
    initialState,
    reducers: {
        addWorkPlace: (state, action) => {
            const { place, x, y, name } = action.payload;
            state.workPlaces.push({ place, x, y, name });
        },
        deleteWorkPlace: (state, action) => {
            const placeToDelete = action.payload;
            state.workPlaces = state.workPlaces.filter(wp => wp.place !== placeToDelete);
        },
    },
});

export const { addWorkPlace, deleteWorkPlace } = workPlaceSlice.actions;

