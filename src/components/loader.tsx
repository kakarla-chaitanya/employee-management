import {GridLoader} from "react-spinners";
export default function Loader(){
    return <div className="loader floating">
        <GridLoader size={20} color="var(--loader-color)" />
    </div>;
}