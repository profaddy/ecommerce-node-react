import React,{useState} from 'react';
import { Button, DatePicker, Popover } from "@shopify/polaris";

const DatePickerComponent = (props) => {
    const {month,year,onChange, onMonthChange, selectedDates} = props;
    // const [{month, year}, setDate] = useState({
    //   month: month,
    //   year: year,
    // });
    const [active,setActive] = useState(false);
    // const [selectedDates, setSelectedDates] = useState({
    //   start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    //   end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    // });
  
    // const handleMonthChange = useCallback(
    //   (month, year) => setDate({month, year}),
    //   [],
    // );

    const activator = (
        <Button fullWidth onClick={() => setActive(!active)}>
          Date picker
        </Button>
      );  
    return (
        <Popover
        active={active}
        activator={activator}
        onClose={() => setActive(!active)}
        sectioned
        // fullWidth
      >
      <DatePicker
        month={month}
        year={year}
        onChange={onChange}
        onMonthChange={onMonthChange}
        selected={selectedDates}
      />
      </Popover>
    );
  }

  export default DatePickerComponent;