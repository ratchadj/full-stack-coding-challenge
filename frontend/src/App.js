import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

export default function SimpleTable() {
  
  const rowPerPageDefault = 10;
  const [githubData, setGithubData] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(rowPerPageDefault);
  const [rows, setRows] = React.useState(0);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  React.useEffect(() => {

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:8000/search?page=${page}`);
            const data = await res.json();
            if (data.items) {
                setGithubData(data.items);
                setRows(data.total_count);
            }else{
                setGithubData({});
                setRows(0);
            }
        } catch (e) {
            console.error(e);
        }
    }

    fetchData().catch(console.error);
  }, [page]);

  return (
    <>
    {githubData && Object.keys(githubData).length !== 0 ? (
        <main>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {githubData
                .map((row) => (
                <TableRow key={row.url}>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
              rowsPerPageOptions={[10]}
              component="div"
              count={rows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          <div>
          </div>
        </main>
      ) : (
        <div></div>
      )}
    </>
  );
}