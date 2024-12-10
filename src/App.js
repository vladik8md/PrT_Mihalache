import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
    const [file, setFile] = useState(null);
    const [emailData, setEmailData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
    };    

    const handleUpload = async () => {
        if (!file) {
            alert('Selectați un fișier .eml!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setEmailData(response.data);
        } catch (error) {
            console.error('Eroare la încărcarea fișierului:', error.message);
            alert('Eroare la încărcarea fișierului.');
        }
    };

    return (
        <div className="App">
            <h1>Email Analyzer</h1>
            <input type="file" accept=".eml" onChange={handleFileChange} />
            <button onClick={handleUpload}>Încarcă și analizează</button>

            {emailData && (
                <div>
                    <h2>Rezultate:</h2>
                    <p><b>De la:</b> {emailData.from}</p>
                    <p><b>Către:</b> {emailData.to}</p>
                    <p><b>Subiect:</b> {emailData.subject}</p>
                    <p><b>Dată:</b> {formatDate(emailData.date)}</p>
                    <p><b>Conținut:</b></p>
                    <pre>{emailData.body}</pre>

                    <h3>Adrese de email:</h3>
                    <ul>{emailData.emails.map((email, index) => <li key={index}>{email}</li>)}</ul>

                    <h3>Numere de telefon:</h3>
                    <ul>{emailData.phones.map((phone, index) => <li key={index}>{phone}</li>)}</ul>

                    <h3>URL-uri:</h3>
                    <ul>{emailData.urls.map((url, index) => <li key={index}>{url}</li>)}</ul>

                    <h3>Adrese IP:</h3>
                    <ul>{emailData.ips.map((ip, index) => <li key={index}>{ip}</li>)}</ul>
                </div>
            )}
        </div>
    );
}

export default App;
