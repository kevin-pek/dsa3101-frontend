<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import { IconSelect } from "@tabler/icons-react"

function Dropdown({ selected, setSelected }) {
  const [isActive, setIsActive] = useState(false)
  const options = ["Weekly", "Monthly", "Yearly"]

  let dropdownRef = useRef()

  useEffect(() => {
    let handler = (e) => {
      if (!dropdownRef.current.contains(e.target)) {
        setIsActive(false)
      }
    }

    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}>
        Current Selected View: {selected}
        <IconSelect />
      </div>

      {isActive && (
        <div className="dropdown-content">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option)
                setIsActive(false)
              }}
              className="dropdown-item"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
=======
import { Select } from '@mantine/core';
import { IconSelect } from "@tabler/icons-react";

function Dropdown({ selected, setSelected }) {
    const options = [
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' }
    ];

    return (
            <Select
                value={selected}
                onChange={setSelected}
                data={options}
                label="Current Selected View"
                icon={<IconSelect />}
                placeholder="Select option"
                width={200}
            />
    );
}

export default Dropdown;
>>>>>>> e47f55199ee188698d74f7fc52a5258b90d1c807
