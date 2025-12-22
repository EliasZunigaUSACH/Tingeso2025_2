import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientService from "../services/client.service";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [clientLoans, setClientLoans] = useState([]);

  const init = () => {
    clientService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los clientes.", response.data);
        setClients(response.data);
      })
      .catch((error) => {
        console.log(
          "Se ha producido un error al intentar mostrar listado de todos los clientes.",
          error
        );
      });
  };

  useEffect(() => {
    init();
  }, []);

  const handleDelete = (id) => {
    console.log("Printing id", id);
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar este cliente?"
    );
    if (confirmDelete) {
      clientService
        .remove(id)
        .then((response) => {
          console.log("cliente ha sido eliminado.", response.data);
          init();
        })
        .catch((error) => {
          console.log(
            "Se ha producido un error al intentar eliminar al cliente",
            error
          );
        });
    }
  };

  // Función para agregar multa
  const handleAddFine = (client) => {
    const input = window.prompt("Ingrese el monto de la multa a agregar:", "0");
    if (input === null) return; // Cancelado
    const amount = parseInt(input, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, ingrese un monto válido mayor a 0.");
      return;
    }
    const newFine = (client.fine || 0) + amount;
    clientService
      .update({ ...client, fine: newFine })
      .then(() => {
        init();
      })
      .catch((error) => {
        alert("Error al agregar multa");
        console.error(error);
      });
  };

  const handleViewLoans = (loans) => {
    setClientLoans(loans);
    setOpen(true);
  };


  // Función para eliminar multa
  const handleRemoveFine = (client) => {
    if (!client.fine || client.fine <= 0) {
      alert("El cliente no tiene multa para eliminar.");
      return;
    }
    const input = window.prompt(
      `Ingrese el monto a cancelar (máx: $${client.fine}):`,
      client.fine
    );
    if (input === null) return; // Cancelado
    const amount = parseInt(input, 10);
    if (
      isNaN(amount) ||
      amount <= 0 ||
      amount > client.fine
    ) {
      alert(
        "Por favor, ingrese un monto válido mayor a 0 y menor o igual a la multa actual."
      );
      return;
    }
    const newFine = client.fine - amount;
    clientService
      .update({ ...client, fine: newFine })
      .then(() => {
        init();
      })
      .catch((error) => {
        alert("Error al eliminar multa");
        console.error(error);
      });
  };

  // Si necesitas mapear el estado, puedes modificar esta función
  const getStatus = (boolean) => {
    if (boolean) return "Restringido";
    return "Activo";
  };

  return (
    <TableContainer component={Paper}>
      <br />
      <Link
        to="/client/add"
        style={{ textDecoration: "none", marginBottom: "1rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
        >
          Añadir Cliente
        </Button>
      </Link>
      <br /> <br />
      <Table sx={{ minWidth: 1500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Nombre
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              RUT
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Teléfono
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Estado
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Préstamos Vigentes
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Multa
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{client.name}</TableCell>
              <TableCell align="right">{client.rut}</TableCell>
              <TableCell align="right">{client.email}</TableCell>
              <TableCell align="right">{client.phone}</TableCell>
              <TableCell align="right">{getStatus(client.restricted)}</TableCell>
              <TableCell align="right">
                {
                  client.loans.length === 0 ? "Sin préstamos" : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick = {() => handleViewLoans(client.loans)}>
                      Ver {client.loans.length > 1 ? `${client.loans.length} Préstamos` : "1 Préstamo"}
                    </Button>
                  )
                }
              </TableCell>
              <TableCell align="right">
                {client.fine ? `$${client.fine}` : "$0"}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => handleAddFine(client)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Agregar multa
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleRemoveFine(client)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Eliminar multa
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(client.id)}
                  style={{ marginLeft: "0.5rem" }}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar cliente
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Préstamos del Cliente</DialogTitle>
      <DialogContent>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID Préstamo</TableCell>
              <TableCell>Herramienta</TableCell>
              <TableCell>Fecha Préstamo</TableCell>
              <TableCell>Fecha Límite</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientLoans.map((loan) => (
              <TableRow key={loan.loanID}>
                <TableCell>{loan.loanID}</TableCell>
                <TableCell>{loan.toolName}</TableCell>
                <TableCell>{loan.loanDate}</TableCell>
                <TableCell>{loan.dueDate}</TableCell>
                <TableCell>{loan.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>

    </TableContainer>
  );
};

export default ClientList;
