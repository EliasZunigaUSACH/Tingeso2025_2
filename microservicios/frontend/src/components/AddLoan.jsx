import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import LoanService from "../services/loan.service";
import clientService from "../services/client.service";
import toolService from "../services/tool.service";
import kardexRegisterService from "../services/kardexRegister.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const AddLoan = () => {
  const { id } = useParams(); 
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [toolId, setToolId] = useState("");
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [toolName, setToolName] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateLimit, setDateLimit] = useState(null);
  const [dateReturn, setDateReturn] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Cargar clientes activos y herramientas disponibles
  useEffect(() => {
    // Obtener clientes activos
    clientService.getAll()
      .then((response) => {
        // Filtrar clientes activos si tienen una propiedad 'active' o similar
        const activos = response.data.filter(c => c.active !== false);
        setClients(activos);
      })
      .catch((error) => {
        console.error("Error al obtener clientes", error);
      });

    // Obtener herramientas
    toolService.getAll()
      .then((response) => {
        setTools(response.data);
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(response.data.map(tool => tool.category))];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error al obtener herramientas", error);
      });
  }, []);

  // Filtrar herramientas por categoría seleccionada
  useEffect(() => {
    if (category) {
      setFilteredTools(
        tools.filter(
          tool => tool.category === category && tool.status === 3
        )
      );
    } else {
      setFilteredTools([]);
    }
  }, [category, tools]);

  // Actualizar nombre de cliente y herramienta seleccionados
  useEffect(() => {
    const selectedClient = clients.find(c => c.id === clientId);
    setClientName(selectedClient ? selectedClient.name : "");
    const selectedTool = tools.find(t => t.id === toolId);
    setToolName(selectedTool ? selectedTool.name : "");
  }, [clientId, toolId, clients, tools]);

  const saveLoan = (e) => {
    e.preventDefault();
    // Validación previa
    if (!clientId || !toolId || !dateStart || !dateLimit) {
      setErrorMessage("Por favor, complete todos los campos obligatorios.");
      return;
    }
    let formattedDateStart, formattedDateLimit, formattedDateReturn;
    try {
      formattedDateStart = format(dateStart, "yyyy-MM-dd");
      formattedDateLimit = format(dateLimit, "yyyy-MM-dd");
      formattedDateReturn = dateReturn ? format(dateReturn, "yyyy-MM-dd") : null;
    } catch (err) {
      setErrorMessage("Las fechas seleccionadas no son válidas.");
      return;
    }
    const loan = { 
      toolId, 
      clientId, 
      clientName, 
      dateStart: formattedDateStart,
      dateLimit: formattedDateLimit,
      dateReturn: formattedDateReturn,
      active: true,
    };
    LoanService.create(loan)
      .then((response) => {
        console.log("Préstamo ha sido añadido.", response.data);
        navigate("/kardex");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response?.data?.message || "Error al guardar el préstamo.");
      });
};

return (
    <Box
      component="form"
      onSubmit={saveLoan}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: "4px",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "#222"
      }}
    >
      <h3 style={{ color: "#fff" }}>Nuevo Préstamo</h3>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          select
          label="Seleccionar Cliente Activo"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          variant="standard"
          required
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
          SelectProps={{ MenuProps: { PaperProps: { style: { backgroundColor: '#333', color: '#fff' } } } }}
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id} style={{ color: '#fff', backgroundColor: '#333' }}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      {/* Selección de fecha de inicio */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <label htmlFor="dateStart" style={{ color: '#fff' }}>Fecha de Préstamo / Inicio</label>
        <DatePicker
          id="dateStart"
          selected={dateStart}
          onChange={(newDate) => setDateStart(newDate)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          placeholderText="Selecciona la fecha de inicio"
          customInput={<TextField variant="standard" InputProps={{ style: { color: '#fff' } }} InputLabelProps={{ style: { color: '#fff' } }} />}
        />
      </FormControl>
      {/* Selección de fecha límite */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <label htmlFor="dateLimit" style={{ color: '#fff' }}>Fecha Límite</label>
        <DatePicker
          id="dateLimit"
          selected={dateLimit}
          onChange={(newDate) => setDateLimit(newDate)}
          dateFormat="yyyy-MM-dd"
          minDate={dateStart || new Date()}
          placeholderText="Selecciona la fecha límite"
          customInput={<TextField variant="standard" InputProps={{ style: { color: '#fff' } }} InputLabelProps={{ style: { color: '#fff' } }} />}
        />
      </FormControl>
  {/* Selección de categoría de herramienta */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          select
          label="Seleccionar Categoría"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setToolId("");
          }}
          variant="standard"
          required
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
          SelectProps={{ MenuProps: { PaperProps: { style: { backgroundColor: '#333', color: '#fff' } } } }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} style={{ color: '#fff', backgroundColor: '#333' }}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
  {/* Selección de herramienta por nombre */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          select
          label="Seleccionar Herramienta"
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
          variant="standard"
          disabled={!category}
          required
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
          SelectProps={{ MenuProps: { PaperProps: { style: { backgroundColor: '#333', color: '#fff' } } } }}
        >
          {filteredTools.map((tool) => (
            <MenuItem key={tool.id} value={tool.id} style={{ color: '#fff', backgroundColor: '#333' }}>
              {tool.name} (ID: {tool.id})
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      <FormControl>
        <Button
          variant="contained"
          color="info"
          type="submit"
          onClick={(e) => saveLoan(e)}
          startIcon={<SaveIcon />}
          sx={{ color: '#fff' }}
        >
          Guardar
        </Button>
      </FormControl>
      {errorMessage && (
        <div style={{ color: "#fff", backgroundColor: "#b71c1c", marginTop: "10px", padding: "8px", borderRadius: "4px" }}>{errorMessage}</div>
      )}
      <br />
      <Button
        variant="outlined"
        color= "secondary"
        onClick={() => navigate("/kardex")}
        sx={{ color: '#fff', borderColor: '#fff' }}
      >
        Cancelar
      </Button>
    </Box>
);

};

export default AddLoan;