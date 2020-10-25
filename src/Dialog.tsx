import * as React from 'react'
import DatePicker from 'react-datepicker'
import subDays from 'date-fns/subDays';
import { getNavigatorLanguage } from '../src/range';
import "react-datepicker/dist/react-datepicker.css";
import '../src/ui.css'

export const Dialog = () => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [msg, setMsg] = React.useState('')
    const [frame, setFrame] = React.useState(null)
    const handleChange = date => setStartDate(date);
    const handleSave = () => { 
        console.log(window.innerWidth);
        parent.postMessage({ pluginMessage: { type: 'save', value: JSON.stringify({startDate: startDate, frame: frame})}}, '*')
    }
    React.useEffect(() => {
      onmessage = (event) => {
        setFrame(event.data.pluginMessage);
        setMsg(event.data.pluginMessage.name);
      };
    }, []);

 
    return (
      <div>
        <h1>{msg}</h1>
        <DatePicker
          selected={startDate}
          onChange={handleChange}
          showTimeSelect
          popperPlacement="top-start"
        //   minDate={subDays(new Date(), 0)}
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
        />
        <button id='save-btn' onClick={handleSave}>Save</button>
  
      </div>
    );
  
  }
  