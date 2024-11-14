import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

function Carlist() {
    const [cars, setCars] = useState([]);
    const [openForm, setOpenForm] = useState(false); // Estado para controlar el formulario
    const [newCar, setNewCar] = useState({ brand: '', model: '', color: '', year: '', price: '' });

    const columns = [
        { field: 'brand', headerName: 'Brand', width: 200 },
        { field: 'model', headerName: 'Model', width: 200 },
        { field: 'color', headerName: 'Color', width: 200 },
        { field: 'year', headerName: 'Year', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        {
            field: 'id',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: row => (
                <button onClick={() => onDelClick(row.id)}>Delete</button>
            ),
        }
    ];

    const onDelClick = (id) => {
        fetch('http://localhost:8080/cars/' + id, { method: 'DELETE' })
            .then(response => fetchCars())
            .catch(err => console.error(err));
    };

    const fetchCars = () => {
        fetch('http://localhost:8080/cars')
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(err => console.error(err));
    };

    const handleAddCar = () => {
        fetch('http://localhost:8080/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        })
        .then(() => {
            setOpenForm(false);
            setNewCar({ brand: '', model: '', color: '', year: '', price: '' });
            fetchCars(); // Actualizar la lista de coches después de agregar uno nuevo
        })
        .catch(err => console.error(err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCar(prevCar => ({ ...prevCar, [name]: value }));
    };

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <div style={{ height: 500, width: '100%' }}>
            <button onClick={() => setOpenForm(true)}>Add Car</button> {}
            <DataGrid rows={cars} columns={columns} getRowId={row => row.id} />

            {/* Formulario para añadir un nuevo coche */}
            {openForm && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Add New Car</h3>
                    <input name="brand" placeholder="Brand" value={newCar.brand} onChange={handleInputChange} />
                    <input name="model" placeholder="Model" value={newCar.model} onChange={handleInputChange} />
                    <input name="color" placeholder="Color" value={newCar.color} onChange={handleInputChange} />
                    <input name="year" placeholder="Year" type="number" value={newCar.year} onChange={handleInputChange} />
                    <input name="price" placeholder="Price" type="number" value={newCar.price} onChange={handleInputChange} />
                    <button onClick={handleAddCar}>Save</button>
                    <button onClick={() => setOpenForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Carlist;
