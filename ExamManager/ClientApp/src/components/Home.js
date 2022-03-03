import React from 'react';
import InputForm from './InputForm/InputForm'

function Home(props) {
    return (
        <InputForm formTitle="Авторизация" inputItems={
            [
                {
                    type: "input",
                    placeholder: "Имя"
                }
            ]} />
    )
}

export default Home;