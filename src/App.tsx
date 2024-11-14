import { useState } from 'react';

function App() {
    const [xValue, setXValue] = useState('');
    const [yValue, setYValue] = useState('');
    const [response, setResponse] = useState<string | null>('');
    const [error, setError] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSend = () => {
        setIsLoading(true);
        fetch('http://10.20.0.15:8888/tasks/create_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                x: xValue,
                y: yValue
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                setResponse(JSON.stringify(response));
                return response.json();
            })
            .then(data => console.log('Response data:', data))
            .catch((error) => {
                console.error('Fetch error:', error)
                setError(JSON.stringify(error ?? 'some error'));
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div>
            <div>
                {isLoading && <span>ОТПРАВКА ЗАПРОСА...</span>}
            </div>
            <input
                placeholder="X"
                type="text"
                value={xValue}
                onChange={(e) => setXValue(e.target.value)}
            />
            <input
                placeholder="Y"
                type="text"
                value={yValue}
                onChange={(e) => setYValue(e.target.value)}
            />
            <br/>
            <button onClick={handleSend}>Отправить</button>
            <hr/>
                <div>
                    <span><b>JSON ответ:</b></span>
                    {response && <p>{response}</p>}
                </div>
                <hr/>
                <div>
                    <span><b>JSON ошибки:</b></span>
                    {error && <p>{error}</p>}
                </div>
        </div>
    );
}

export default App;

