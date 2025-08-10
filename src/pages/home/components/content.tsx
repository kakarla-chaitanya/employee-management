import Card from './card';
import type { Employee } from '../../../models/employee';

interface ContentProps{
    data:Employee[],
    onEdit: (index: number) => void,
    onDelete: (index: number) => Promise<void>,
}

export default function Content({ data, onEdit, onDelete }:ContentProps) {
    return (
        <div className="content">
            {data.length === 0 ? (
                <div className="content-no-body">
                    No Data. Please add a new one.
                </div>
            ) : (
                data.map((x, i) => (
                    <Card
                        key={i}
                        name={x.name}
                        email={x.email}
                        department={x.department}
                        onEdit={() => onEdit(i)}
                        onDelete={() => onDelete(i)}
                    />
                ))
            )}
        </div>
    );
}
