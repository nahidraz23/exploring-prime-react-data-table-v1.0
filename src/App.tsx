import axios from "axios";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import "primeicons/primeicons.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface DataInfo {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
  id: number;
  total: number;
  currentPage: number;
}

function App() {
  const [data, setData] = useState<DataInfo[]>([]);
  // const [rowClick, setRowClick] = useState(true);
  const [selectedRow, setSelectedRow] = useState<DataInfo[] | null>([]);
  const [selected, setSelected] = useState(0);
  const [pagination, setPagination] = useState<DataInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const pageNo: number = currentPage + 1;
  const totalRecords: number = pagination?.total;
  const op = useRef(null);

  console.log(selectedRow)

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.artic.edu/api/v1/artworks?page=${currentPage + 1}`
    );
    setData(res.data.data);

    return setLoading(false);
  };

  const paginationData = async () => {
    const res = await axios.get("https://api.artic.edu/api/v1/artworks");
    return setPagination(res?.data?.pagination);
  };

  useEffect(() => {
    fetchData();
    paginationData();
  }, [pageNo]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page);
  };

  const handleOnsubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const inputValue: number = parseInt(form.inputValue.value);
    setSelected(inputValue)
  }

  // Custom header template with a button that triggers the OverlayPanel
  const headerTemplate = () => {
    return (
      <div className="table-header">
        <Button
          icon="pi pi-angle-down"
          onClick={(e) => op.current.toggle(e)}
          className="p-button-primary"
        />
        <OverlayPanel
          ref={op}
          id="overlayPanel"
          style={{ width: "300px" }}
          className=""
        >
          <form onSubmit={handleOnsubmit}>
            <InputText type="number" name="inputValue" className="border-2 border-gray-500 p-2" placeholder="Select Rows...."></InputText>
            <input type="submit" value="Submit" className="border-2 border-gray-600 mt-2 p-1 rounded-md cursor-pointer"/>
          </form>
        </OverlayPanel>
      </div>
    );
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center py-4 border-b-2">
          Exploring PRIME<span className="text-cyan-600">REACT</span> Data-table
        </h1>
      </div>
      <div className="">
        <DataTable
          value={data}
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          selection={selectedRow}
          onSelectionChange={(e) => setSelectedRow(e.value)}
          dataKey="id"
          selectionPageOnly
          loading={loading}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>

          <Column header={headerTemplate()}></Column>

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
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

export default App;
