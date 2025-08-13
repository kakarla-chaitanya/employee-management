export default function DashboardCard(props:{
    header:string,
    message:string,
    icon:React.ReactElement<React.SVGProps<SVGSVGElement>>,
}){
    return <div className="dashboard-card">
        <div className="dashboard-card-header">
            {props.header}
            {props.icon}
        </div>
        <div className="bold-text">{props.message}</div>
    </div>;
}