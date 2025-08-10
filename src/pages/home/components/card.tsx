interface CardProps{
    name:string,
    email:string,
    department:string,
    onEdit:()=>void,
    onDelete:()=>void,
}
export default function Card({ name, email, department, onEdit, onDelete }:CardProps) {
    return (
        <div className="card">
            <div className="bold">{name}</div>
            <div>Department :- <div className="italic">{department}</div></div>
            <div>Email :- <div className="italic">{email}</div></div>
            <div className="card-buttons">
                <button className="edit" onClick={onEdit}>Edit</button>
                <button className="delete" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
