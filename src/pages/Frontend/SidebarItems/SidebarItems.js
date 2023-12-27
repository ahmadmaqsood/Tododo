import { StarFilled, CalendarFilled } from '@ant-design/icons';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import InboxIcon from '@mui/icons-material/Inbox';
import { Link } from 'react-router-dom';
const getRandomId = () => Math.random().toString(36).slice(2)
export const items = [
  {
    key: getRandomId(),
    icon: <InboxIcon />,
    label: 'Inbox',
  },
  {
    key: getRandomId(),
    icon: <StarFilled />,
    label: <Link to='/today' className='text-decoration-none'>Today</Link>,
  },
  {
    key: getRandomId(),
    icon: <CalendarFilled />,
    label: <Link to='/upcoming' className='text-decoration-none'>Upcoming</Link>,
  },
  {
    key: getRandomId(),
    icon: <AutoAwesomeMotionIcon />,
    label:  <Link to='/anytime' className='text-decoration-none'>Anytime</Link>,
  },
  {
    key: getRandomId(),

    icon: <InventoryIcon />,
    label:  <Link to='/someday' className='text-decoration-none'>Someday</Link>,
  },
  {
    key: getRandomId(),
    icon: <DeleteIcon />,
    label: <Link to='/trash' className='text-decoration-none'>Trash</Link>,
  },
];