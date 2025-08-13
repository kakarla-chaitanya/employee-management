import { useEffect, useState } from 'react';
import Header from '../../components/header';
import DashboardCard from './components/dashboard_card';
import './dashboard.css';
import apiIcon from "../../assets/api-image.jpeg";
import { getDashboardDetails } from '../../services/dashboard_service';
import rateLimitingIcon from "../../assets/rate-limiting-image.png";
import { useLoaderContext } from '../../context/loader_context';
import { useAuthContext } from '../../context/auth_context';

type DashboardCardObject = {
    label: string,
    value: string,
    icon: string,
}

export default function Dashboard() {

    const setLoading=useLoaderContext();
    const {authChecked}=useAuthContext();

    const iconSize = 24;

    const iconMap: Record<string, React.ReactElement<React.SVGProps<SVGSVGElement>>> = {
        users: (
            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="blue" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
            </svg>
        ),
        employees: (
            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="blue" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
        ),
        login: (
            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="blue" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="red" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
        ),
        api: (
            <img height={iconSize} width={iconSize} src={apiIcon} />
        ),
        rateLimiting: (
            <img height={iconSize} width={iconSize} src={rateLimitingIcon} />
        ),
    };


    const [data, setData] = useState<{
        "Users": DashboardCardObject[],
        "Employees": DashboardCardObject[],
        "Rate Limiting": DashboardCardObject[],
        "Authentication": DashboardCardObject[],
        "API Requests": DashboardCardObject[],
    }
    >({
        "Users": [],
        "Employees": [],
        "Rate Limiting": [],
        "Authentication": [],
        "API Requests": [],
    });

    useEffect(() => {
        if (authChecked){
            (async () => {
                setLoading(true);
                const res = await getDashboardDetails();
                if (res){
                    setData(res);
                }
                setLoading(false);
            })();
        }
    }, [authChecked]);


    return <div className="dashboard">
        <Header message='Dashboard' />
        <div className='dashboard-body'>

            <div>
                <div className='bold-text'>Users</div>
                <div className='dashboard-flex-card'>
                    {data["Users"].map((x, i) => <DashboardCard
                        key={i}
                        header={x.label}
                        message={x.value}
                        icon={iconMap[x.icon]}
                    />)}
                </div>
            </div>

            <div>
                <div className='bold-text'>Employees</div>
                <div className='dashboard-flex-card'>
                    {data["Employees"].map((x, i) => <DashboardCard
                        key={i}
                        header={x.label}
                        message={x.value}
                        icon={iconMap[x.icon]}
                    />)}
                </div>
            </div>

            <div>
                <div className='bold-text'>Authentication</div>
                <div className='dashboard-flex-card'>
                    {data["Authentication"].map((x, i) => <DashboardCard
                        key={i}
                        header={x.label}
                        message={x.value}
                        icon={iconMap[x.icon]}
                    />)}
                </div>
            </div>

            <div>
                <div className='bold-text'>Rate Limiting</div>
                <div className='dashboard-flex-card'>
                    {data["Rate Limiting"].map((x, i) => <DashboardCard
                        key={i}
                        header={x.label}
                        message={x.value}
                        icon={iconMap[x.icon]}
                    />)}
                </div>
            </div>

            <div>
                <div className='bold-text'>API Requests</div>
                <div className='dashboard-flex-card'>
                    {data["API Requests"].map((x, i) => <DashboardCard
                        key={i}
                        header={x.label}
                        message={x.value}
                        icon={iconMap[x.icon]}
                    />)}
                </div>
            </div>
        </div>
    </div>;
}