import { useState } from 'react';

function Dropdown({ selected, setSelected }) {
    const [isActive, setIsActive] = useState(false);
    const options = ['Weekly', 'Monthly', 'Yearly'];

    return (
        <div className="dropdown">
            <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}> 
                Current Selected View: {selected}
                <span className="fas fa-caret-down"></span>
            </div>
            
            {isActive && (
                <div className="dropdown-content">
                    {options.map(option => (
                        <div key={option} onClick={() => { 
                            setSelected(option); 
                            setIsActive(false);
                        }} className="dropdown-item">
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;