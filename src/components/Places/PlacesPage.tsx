import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {bgColors} from "../../constants";
import {useState} from "react";
import {BaseModal} from "../common/BaseModal.tsx";

const places = [
    {place: 1, x: 1100, y: 1.3, name: "Ivan Ivanov"},
    {place: 2, x: 2300, y: 1.3, name: "Dmitry Petrov"},
    {place: 3, x: 3.700, y: 1.3, name: "Alexei Sokolov"},
    {place: 4, x: 5.200, y: 1.3, name: "Nikolai Smirnov"},
    {place: 5, x: 1.100, y: 4.6, name: "Sergei Volkov"},
    {place: 6, x: 2.300, y: 4.6, name: "Andrei Kuznetsov"},
    {place: 7, x: 3.700, y: 4.6, name: "Vladimir Popov"},
    {place: 8, x: 5.200, y: 4.6, name: "Yuri Lebedev"},
    {place: 9, x: 1.100, y: 7.6, name: "Pavel Ivanov"},
    {place: 10, x: 2.3, y: 7.6, name: "Boris Mikhailov"},
    {place: 11, x: 3.7, y: 7.6, name: "Vadim Romanov"},
    {place: 12, x: 5.2, y: 7.6, name: "Konstantin Fedorov"},
    {place: 13, x: 1.1, y: 10.6, name: "Oleg Morozov"},
    {place: 14, x: 2.3, y: 10.6, name: "Anton Pavlov"},
    {place: 15, x: 3.7, y: 10.6, name: "Maksim Tarasov"},
    {place: 16, x: 5.2, y: 10.6, name: "Igor Ivanov"},
    {place: 17, x: 1.1, y: 13.9, name: "Artem Korolev"},
    {place: 18, x: 2.3, y: 13.9, name: "Vitaly Sokolov"},
    {place: 19, x: 3.7, y: 13.9, name: "Ruslan Novikov"},
    {place: 20, x: 5.2, y: 13.9, name: "Evgeny Petrov"},
    {place: 21, x: 1.1, y: 17.1, name: "Roman Lebedev"},
    {place: 22, x: 2.3, y: 17.1, name: "Georgy Ivanov"},
    {place: 23, x: 3.7, y: 17.1, name: "Nikita Sidorov"},
    {place: 24, x: 5.2, y: 17.1, name: "Kirill Zaitsev"},
    {place: 25, x: 0.3, y: 20.3, name: "Alexey Markov"},
    {place: 26, x: 1.1, y: 20.3, name: "Mikhail Filatov"},
    {place: 27, x: 2.3, y: 20.3, name: "Fyodor Solovyov"},
    {place: 28, x: 3.7, y: 20.3, name: "Viktor Pavlov"},
    {place: 29, x: 5.2, y: 20.3, name: "Leonid Zakharov"},
    {place: 30, x: 0.3, y: 23.2, name: "Igor Nikitin"},
    {place: 31, x: 1.1, y: 23.2, name: "Gennady Kozlov"},
    {place: 32, x: 2.3, y: 23.2, name: "Valery Zubkov"},
    {place: 33, x: 3.7, y: 23.2, name: "Stanislav Medvedev"},
    {place: 34, x: 5.2, y: 23.2, name: "Andrey Vinogradov"},
    {place: 35, x: 8.5, y: 20.3, name: "Yaroslav Vasiliev"},
    {place: 36, x: 14, y: 0.3, name: "Oleg Bogdanov"}
];

export const PlacesPage = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Paper sx={{height: '100vh', mr: 2, pt: 0, overflow: 'auto'}}>
                <Stack sx={{width: '100%', p: 2}} alignItems={'flex-end'}>
                    <Button sx={{width: '200px'}} onClick={() => setIsOpen(prev => !prev)}>Добавить место</Button>
                </Stack>
                <Box>
                    <Stack alignItems={'center'} sx={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr',
                        height: '48px',
                        border: `1px solid ${bgColors['100']}`,
                        p: 2,
                        position: 'sticky',
                        top: 0,
                        backgroundColor: bgColors['200'],
                        borderRadiusTopLeft: 4,
                        borderRadiusTopRight: 4
                    }}>
                        <Typography variant={'h3'}>Номер места</Typography>
                        <Typography variant={'h3'}>ФИО сотрудника</Typography>
                    </Stack>

                    {places.map(place => (
                        <Stack sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr',
                            height: '48px',
                            p: 2,
                            backgroundColor: bgColors['400'],
                            border: `1px solid ${bgColors['100']}`
                        }}>
                            <Typography>{place.place}</Typography>
                            <Typography>{place.name}</Typography>
                        </Stack>
                    ))}
                </Box>
            </Paper>

            <BaseModal open={isOpen}
                       title={'Добввить новое место'}
                       onClose={() => setIsOpen(false)}
                       onCancel={() => setIsOpen(false)}
                       onSubmit={() => setIsOpen(true)}
                       submitText={'Добавить'}
            >
                <Stack sx={{width: '350px', p: 2}} gap={2}>
                    <TextField label={'Номер места'} required={true} placeholder={'Введите номер места'}
                               type={'number'}/>
                    <TextField label={'Кордината X'} required={true} placeholder={'Введите координату X'}/>
                    <TextField label={'Кордината Y'} required={true} placeholder={'Введите координату Y'}/>
                    <TextField label={'Фио сотрудника'} required={true} placeholder={'Введите ФИО'}/>
                </Stack>
            </BaseModal>
        </>
    );
};
