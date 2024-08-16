import React, { useState } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
    const [numberId, setNumberId] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/numbers/${numberId}`);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            setData(null);
        }
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <input
                type="text"
                placeholder="Enter number ID (p, f, e, r)"
                value={numberId}
                onChange={(e) => setNumberId(e.target.value)}
            />
            <button onClick={fetchData}>Get Average</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AverageCalculator;
