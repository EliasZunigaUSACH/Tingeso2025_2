import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoanService from "../services/loan.service";
import clientService from "../services/client.service";
import toolService from "../services/tool.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();
  // Estado para el modal de daño
  const [openDamageDialog, setOpenDamageDialog] = useState(false);
  const [pendingLoan, setPendingLoan] = useState(null);

  useEffect(() => {
    LoanService.getAll()
      .then((response) => {
        console.log("Préstamos obtenidos:", response.data);
        setLoans(response.data || []);
      })
      .catch((error) => {
        console.error("Error al obtener préstamos:", error);
      });
    clientService.getAll()
      .then((response) => {
        setClients(response.data || []);
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
    toolService.getAll()
      .then((response) => {
        setTools(response.data || []);
      })
      .catch((error) => {
        console.error("Error al obtener herramientas:", error);
      });
  }, []);

  // Helper para obtener nombre cliente/herramienta
  const getClientName = (id) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.name : id;
  };
  // Helper para estado
  const getStatus = (loan) => {
    if (loan.active) {
      if (!loan.delayed) return "Vigente";
      else return "Atrasado";
    }
    else return "Terminado";
  };

  const handleEndLoan = (loan) => {
    if (window.confirm("¿Está seguro de que desea terminar este préstamo?")) {
      setPendingLoan(loan);
      setOpenDamageDialog(true);
    }
  };

  const handleDamageDialogClose = (damaged) => {
    setOpenDamageDialog(false);
    if (!pendingLoan) return;
    const updatedLoan = {
      ...pendingLoan,
      active: false,
      dateReturn: new Date().toISOString().split("T")[0],
      toolGotDamaged: damaged
    };
    LoanService.update(updatedLoan)
      .then(() => {
        console.log("Préstamo terminado:", updatedLoan);
        setLoans((prevLoans) =>
          prevLoans.map((l) => (l.id === updatedLoan.id ? updatedLoan : l))
        );
      })
      .catch((error) => {
        console.error("Error al terminar el préstamo:", error);
      });
    setPendingLoan(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <br />
        <h3 style={{ marginLeft: 16 }}>Listado de Préstamos</h3>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabla préstamos">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Cliente</TableCell>
              <TableCell align="left">Herramienta</TableCell>
              <TableCell align="left">Fecha de inicio</TableCell>
              <TableCell align="left">Fecha límite</TableCell>
              <TableCell align="left">Fecha de término</TableCell>
              <TableCell align="left">Tarifa diaria</TableCell>
              <TableCell align="left">Tarifa total</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell align="left">{loan.id}</TableCell>
                <TableCell align="left">{getClientName(loan.clientId)}</TableCell>
                <TableCell align="left">{loan.toolName}</TableCell>
                <TableCell align="left">{loan.dateStart}</TableCell>
                <TableCell align="left">{loan.dateLimit}</TableCell>
                <TableCell align="left">{loan.dateReturn || "-"}</TableCell>
                <TableCell align="left">${loan.tariffPerDay}</TableCell>
                <TableCell align="left">${loan.totalTariff || "0"}</TableCell>
                <TableCell align="left">{getStatus(loan)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEndLoan(loan)}
                    size="small"
                  >
                    Terminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/kardex")}
            style={{ marginLeft: 16 }}
          >
            Volver a Kardex
          </Button>
      </TableContainer>
      {/* Modal personalizado para daño de herramienta */}
      <Dialog
        open={openDamageDialog}
        onClose={() => handleDamageDialogClose(false)}
      >
        <DialogTitle>¿Herramienta dañada?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿La herramienta fue devuelta dañada?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDamageDialogClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleDamageDialogClose(true)} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoanList;
