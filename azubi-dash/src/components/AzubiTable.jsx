import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import axios from 'axios';

export default function AzubiTable({ tableData, handleCheckboxChange, error }) {
    const [sortConfig, setSortConfig] = useState({ key: 'id_person', direction: 'asc' });
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        const sorted = [...tableData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle sorting for booleans
            if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortConfig.direction === 'asc'
                    ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
                    : (bValue ? 1 : 0) - (aValue ? 1 : 0);
            }

            // Handle sorting for numbers (including ID)
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            // Handle sorting for strings
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return 0;
        });

        setSortedData(sorted);
    }, [tableData, sortConfig]); // Re-sort when data or sortConfig changes

    const handleSort = (key) => {
        // Toggle sort direction based on the current key and direction
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const renderSortArrow = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleCheckboxToggle = async (id_person, checked) => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];  // Correct token retrieval
        
        try {
            if (checked) {
                // Call createAzubis API to set apprentice to true
                await axios.put(`http://localhost:3002/api/azubis/create/${id_person}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            } else {
                // Call deleteAzubis API to set apprentice to false
                await axios.put(`http://localhost:3002/api/azubis/delete/${id_person}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            }
            // After calling the API, trigger the parent function to update the table
            handleCheckboxChange(id_person, checked);  // This will update the checkbox state in the parent component (Verwaltung)
        } catch (error) {
            console.error("Error updating apprentice status:", error);
        }
    };
    
    

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra">
                {/* Table Header */}
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id_person')} style={{ cursor: 'pointer' }}>
                            Person ID {renderSortArrow('id_person')}
                        </th>
                        <th onClick={() => handleSort('firstname')} style={{ cursor: 'pointer' }}>
                            Vorname {renderSortArrow('firstname')}
                        </th>
                        <th onClick={() => handleSort('lastname')} style={{ cursor: 'pointer' }}>
                            Nachname {renderSortArrow('lastname')}
                        </th>
                        <th onClick={() => handleSort('apprentice')} style={{ cursor: 'pointer' }}>
                            Azubi {renderSortArrow('apprentice')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((azubi) => (
                            <tr key={azubi.id_person}>
                                <td>{azubi.id_person}</td>
                                <td>{azubi.firstname}</td>
                                <td>{azubi.lastname}</td>
                                <td>
                                    <Checkbox
                                        checked={azubi.apprentice}
                                        onChange={(e) =>
                                            handleCheckboxToggle(azubi.id_person, e.target.checked)
                                        }
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                {error ? `Error: ${error}` : 'No Azubis found'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
