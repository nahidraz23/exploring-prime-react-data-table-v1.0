import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';

interface DataInfo {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
  id: number;
}

function App() {
  const [data, setData] = useState<DataInfo[]>([]);
  // const [rowClick, setRowClick] = useState(true);
  const [selectedRow, setSelectedRow] = useState<DataInfo[] | null >(null)
  // console.log(data);

  const fetchData = async () => {
    const res = await axios.get("https://api.artic.edu/api/v1/artworks?page=1");
    return setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center py-4 border-b-2">
          Exploring PRIME<span className="text-cyan-600">REACT</span> Data-table
        </h1>
      </div>
      <div>
        <DataTable
          value={data}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          // selectionMode={rowClick ? undefined : 'multiple'}
          selection={selectedRow!}
          onSelectionChange={(e) => setSelectedRow(e.value)}
          dataKey="id"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column
            field="title"
            header="Title"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="place_of_origin"
            header="place_of_origin"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="artist_display"
            header="artist_display"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="inscriptions"
            header="inscriptions"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="date_start"
            header="date_start"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="date_end"
            header="date_end"
            style={{ width: "25%" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default App;
