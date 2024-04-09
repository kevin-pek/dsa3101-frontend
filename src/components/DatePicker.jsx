import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DatePicker = () => {

    //date state
    const [calendar, setCalendar] = useState('')

    // store date in state upon date change
    const handleSelect = (date) => {
        setCalendar(format(date, 'MM/dd/yyyy'))
    }

    return (
        <div className="calendarWrap">

            <Calendar
                date = { new Date() }
                onChange = { handleSelect }
                className = "calendarElement"
            />

        </div>
    )
}

export default DatePicker