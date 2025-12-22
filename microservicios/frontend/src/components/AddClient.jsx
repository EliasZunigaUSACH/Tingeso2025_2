import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientService from "../services/client.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";
import "react-datepicker/dist/react-datepicker.css";

const AddClient = () => {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  // Función para formatear el RUT con puntos y guión
  const formatRut = (value) => {
    // Eliminar todo excepto números y k/K
    let clean = value.replace(/[^0-9kK]/g, "");
    // Separar dígito verificador
    let body = clean.slice(0, -1);
    let dv = clean.slice(-1);
    // Agregar puntos cada 3 dígitos desde la derecha
    let formatted = "";
    while (body.length > 3) {
      formatted = "." + body.slice(-3) + formatted;
      body = body.slice(0, -3);
    }
    formatted = body + formatted;
    if (formatted) {
      formatted += "-" + dv;
    } else if (dv) {
      formatted = dv;
    }
    return formatted;
  };
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(0);
  const [activeLoans, setActiveLoans] = useState([]);
  const [fine, setFine] = useState(0);
  const [titleClientForm] = useState("Nuevo Cliente");
  const navigate = useNavigate();

  const saveClient = (e) => {
    e.preventDefault();
    const client = { name, rut, phone, email, status, activeLoans, fine };
    clientService
      .create(client)
      .then((response) => {
        console.log("Cliente ha sido añadido.", response.data);
        navigate("/client/list");
      })
      .catch((error) => {
        console.log(
          "Ha ocurrido un error al intentar crear nuevo cliente.",
          error
        );
      });
  };

  // No useEffect necesario para edición

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
        sx={{ color: 'white' }}
    >
        <h3 style={{ color: 'white' }}> {titleClientForm} </h3>
      <hr />
      <form>
        <FormControl fullWidth>
            <TextField
              id="name"
              label="Nombre"
              value={name}
              variant="standard"
              onChange={(e) => setName(e.target.value)}
              required
              InputLabelProps={{ style: { color: 'white' } }}
              inputProps={{ style: { color: 'white' } }}
            />
        </FormControl>

        <FormControl fullWidth>
            <TextField
              id="rut"
              label="RUT"
              value={rut}
              variant="standard"
              onChange={(e) => {
                const input = e.target.value;
                const formatted = formatRut(input);
                setRut(formatted);
              }}
              required
              inputProps={{ maxLength: 12, style: { color: 'white' } }}
              InputLabelProps={{ style: { color: 'white' } }}
            />
        </FormControl>

        <FormControl fullWidth>
            <TextField
              id="phone"
              label="Teléfono"
              value={phone}
              variant="standard"
              onChange={(e) => setPhone(e.target.value)}
              required
              InputLabelProps={{ style: { color: 'white' } }}
              inputProps={{ style: { color: 'white' } }}
            />
        </FormControl>

        <FormControl fullWidth>
            <TextField
              id="email"
              label="Correo electrónico"
              value={email}
              variant="standard"
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: 'white' } }}
              inputProps={{ style: { color: 'white' } }}
            />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            onClick={(e) => saveClient(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
              sx={{ color: 'white' }}
          >
            Guardar
          </Button>
        </FormControl>
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/client/list")}
            sx={{ color: 'white' }}
        >
          Back to List
        </Button>
      </form>
      <hr />
    </Box>
  );
};

export default AddClient;