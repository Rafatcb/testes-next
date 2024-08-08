import styles from './Table.module.css';

type TableProps<Column extends string> = {
  className?: string;
  columns: { displayName: string; property: Column }[];
  data: { [k in Column]: string | number }[];
  dataKey: Column;
};

export function Table<Column extends string>({ className, columns, data, dataKey }: TableProps<Column>) {
  return (
    <table className={`${styles.table} ${className ?? ''}`}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={`header-${column.property}`}>{column.displayName}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map(rowValues => (
          <tr key={`row-${rowValues[dataKey]}`}>
            {columns.map(column => (
              <td key={`row-${rowValues[dataKey]}-${column.property}`}>{rowValues[column.property]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
