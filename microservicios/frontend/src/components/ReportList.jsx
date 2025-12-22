
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import reportService from "../services/report.service";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  // Fetch all reports
  const fetchReports = () => {
    setLoading(true);
    reportService
      .getAll()
      .then((response) => {
        console.log("Reportes obtenidos:", response.data);
        setReports(response.data);
        setFilteredReports(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error al obtener reportes:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // View report details
  const handleView = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
  };

  // Delete report
  const handleDelete = async (id) => {
    try {
      await reportService.remove(id);
      fetchReports();
    } catch (error) {
      console.log("Error al eliminar reporte:", error);
    }
  };

  // Create new report
  const handleCreate = async () => {
    const creationDate = new Date().toISOString().split('T')[0];
    const report = {
      creationDate,
      activeLoans: [],
      delayedLoans: [],
      clientsWithDelayedLoans: [],
      topTools: []
    };
    reportService
      .create(report)
      .then((response) => {
        fetchReports();
      })
      .catch((error) => {
        console.log("Ha ocurrido un error al intentar crear nuevo reporte.", error);
      });
  };

  // Filtro por rango de fechas
  const handleFilter = async () => {
    if (!startDate && !endDate) {
      setFilteredReports(reports);
      return;
    }
    setLoading(true);
    try {
      const response = await reportService.getByDateRange(startDate, endDate);
      setFilteredReports(response.data);
    } catch (error) {
      console.log("Error al filtrar reportes por rango de fechas:", error);
      setFilteredReports([]);
    }
    setLoading(false);
  };

  return (
    <TableContainer component={Paper}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Box mb={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Crear Reporte
          </Button>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <span>a</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <Button variant="outlined" color="primary" onClick={handleFilter}>
            Filtrar por fechas
          </Button>
        </Box>
        <Box width={"100%"} maxWidth={600}>
          {loading ? (
            <div>Cargando...</div>
          ) : filteredReports.length === 0 ? (
            <div>No hay reportes disponibles.</div>
          ) : (
            <Table sx={{ minWidth: 400 }} size="small" aria-label="tabla reportes">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="center">Fecha</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell align="left">{report.id}</TableCell>
                    <TableCell align="center">{report.creationDate}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleView(report)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(report.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>

      {/* Modal de detalles del reporte */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedReport ? `Reporte del ${selectedReport.creationDate}` : "Reporte"}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <>
              <h3>Préstamos vigentes</h3>
              {selectedReport.activeLoans && selectedReport.activeLoans.length > 0 ? (
                <Table size="small" sx={{ mb: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Herramienta</TableCell>
                      <TableCell>Fecha Préstamo</TableCell>
                      <TableCell>Fecha Límite</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedReport.activeLoans.map((loan, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{loan.clientName}</TableCell>
                        <TableCell>{loan.toolName}</TableCell>
                        <TableCell>{loan.loanDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div>No hay préstamos activos.</div>
              )}

              <h3>Préstamos con atraso</h3>
              {selectedReport.delayedLoans && selectedReport.delayedLoans.length > 0 ? (
                <Table size="small" sx={{ mb: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Herramienta</TableCell>
                      <TableCell>Fecha Préstamo</TableCell>
                      <TableCell>Fecha Límite</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedReport.delayedLoans.map((loan, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{loan.clientName}</TableCell>
                        <TableCell>{loan.toolName}</TableCell>
                        <TableCell>{loan.loanDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div>No hay préstamos atrasados.</div>
              )}

              <h3>Clientes con préstamos atrasados</h3>
              {selectedReport.clientsWithDelayedLoans && selectedReport.clientsWithDelayedLoans.length > 0 ? (
                <ul>
                  {selectedReport.clientsWithDelayedLoans.map((client, idx) => (
                    <li key={idx}>{client}</li>
                  ))}
                </ul>
              ) : (
                <div>No hay clientes con préstamos atrasados.</div>
              )}

              <h3>Herramientas más prestadas</h3>
              {selectedReport.topTools && selectedReport.topTools.length > 0 ? (
                <ul>
                  {selectedReport.topTools.map((tool, idx) => (
                    <li key={idx}>{tool}</li>
                  ))}
                </ul>
              ) : (
                <div>No hay herramientas registradas.</div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ReportList;