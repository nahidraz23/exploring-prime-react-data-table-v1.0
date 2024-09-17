import axios from "axios";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import "primeicons/primeicons.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

// Interface for the fetched data
interface DataInfo {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
  id: number;
}

// Interface for pagination data
interface PaginationInfo {
  total: number;
}

function App() {
  const [data, setData] = useState<DataInfo[]>([]);
  const [selectedRow, setSelectedRow] = useState<DataInfo[] | null>([]);
  const [selected, setSelected] = useState(0);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const op = useRef<OverlayPanel | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${currentPage + 1}`
      );
      setData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  // Fetch pagination data
  const fetchPaginationData = async () => {
    try {
      const res = await axios.get("https://api.artic.edu/api/v1/artworks");
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching pagination data", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPaginationData();
  }, [currentPage]);

  // Handle row selection
  const handleRowSelection = () => {
    const rowSelect = data.slice(0, selected);
    setSelectedRow(rowSelect);
  };

  // Handle pagination change
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page);
  };

  // Handle form submission for row selection
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inputValue = parseInt((form.elements.namedItem("inputValue") as HTMLInputElement).value, 10);
    setSelected(inputValue);
  };

  // Custom header template with a button that triggers the OverlayPanel
  const headerTemplate = () => {
    return (
      <div className="table-header">
        <Button
          icon="pi pi-angle-down"
          onClick={(e) => op.current?.toggle(e)}
          className="p-button-primary"
        />
        <OverlayPanel ref={op} id="overlayPanel" style={{ width: "300px" }}>
          <form onSubmit={handleOnSubmit}>
            <InputNumber
              onValueChange={(e) => setSelected(e.value || 0)}
              name="inputValue"
              inputClassName="border-2 border-gray-600 p-2"
              placeholder="Select Rows..."
            />
            <input
              onClick={handleRowSelection}
              type="submit"
              value="Submit"
              className="border-2 border-gray-600 mt-2 p-1 rounded-md cursor-pointer"
            />
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
      <div>
        <DataTable
          value={data}
          rows={50}
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
          />
          <Column header={headerTemplate()} />
          <Column field="title" header="Title" style={{ width: "25%" }} />
          <Column
            field="place_of_origin"
            header="Place of Origin"
            style={{ width: "25%" }}
          />
          <Column
            field="artist_display"
            header="Artist Display"
            style={{ width: "25%" }}
          />
          <Column
            field="inscriptions"
            header="Inscriptions"
            style={{ width: "25%" }}
          />
          <Column
            field="date_start"
            header="Date Start"
            style={{ width: "25%" }}
          />
          <Column
            field="date_end"
            header="Date End"
            style={{ width: "25%" }}
          />
        </DataTable>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={pagination?.total || 0}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

export default App;
