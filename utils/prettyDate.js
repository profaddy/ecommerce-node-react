import moment from 'moment';

const prettyDte = (date,toFormat = "YYYY-MMM-DD hh:mm A") =>
  moment(date).format(toFormat);
export default prettyDte;