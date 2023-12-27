import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Layout, Menu } from 'antd';
import { useState, useContext } from 'react';
import Routes from './Routes'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Config/firebase';
import { AuthContext } from '../../context/AuthContext';
import {items} from './SidebarItems/SidebarItems'
const { Header, Sider, Footer } = Layout;

export default function Index() {
    const [collapsed, setCollapsed] = useState(false);

    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch({ type: 'LOGOUT' })
                navigate('/auth/login')
                window.toastify('Logout Successfully', 'success')
            })
            .catch((err) => {
                console.error(err)
                window.toastify('Something error', 'error')
            })
    }
    return (
        <>
            <Layout style={{ minHeight: '110vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#1D1D1D', color: '#fff' }} >
                    <div className="demo-logo-vertical" />
                    <Menu theme='dark' style={{ backgroundColor: '#1D1D1D', color: '#fff' }} mode="inline" defaultSelectedKeys={['2']} items={items} />
                </Sider>
                <Layout >
                    <Header style={{ padding: 0, background: '#252525', }} className='d-flex align-items-center' >
                        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px', width: 64, height: 64, color: 'white' }} />
                        <h2 className='text-white fs-3'>Todo List</h2>
                        <button onClick={handleLogout} className='bg-transparent border-0'>
                            <PowerSettingsNewIcon className='text-white' />
                        </button>
                    </Header>
                    <Routes />
                    <Footer style={{ textAlign: 'center', background: '#252525' }} >
                        <div className="container ">
                            <div className="row gx-0 " style={{ margin: 0, padding: 0 }} >
                                <hr />
                                <div className="col">
                                    <a href='/'>
                                        <AddIcon className='text-white' />
                                    </a>
                                </div>
                                <div className="col">
                                    <a href="/someday">
                                        <CalendarMonthIcon style={{ color: '#757575' }} />
                                    </a>
                                </div>
                                <div className="col">
                                    <ArrowForwardIcon style={{ color: '#757575' }} />
                                </div>
                                <div className="col">
                                    <SearchIcon className='text-white' />
                                </div>
                            </div>
                        </div>
                    </Footer>
                </Layout>
            </Layout >

        </>
    );
};
