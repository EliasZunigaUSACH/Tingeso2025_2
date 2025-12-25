import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toolService from "../services/tool.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const AddTool = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState(3); // 3: Disponible
    const [history, setHistory] = useState([]);
    const [titleForm, setTitleForm] = useState("Nueva Herramienta");
    const navigate = useNavigate();

    const saveTool = (e) => {
        e.preventDefault();
        // Crear el objeto herramienta
        const tool = { name, category, price, status, history };
        toolService
            .create(tool)
            .then((response) => {
                console.log("Herramienta ha sido añadida.", response.data);
                navigate("/tool/list");
            })
            .catch((error) => {
                console.log("Ha ocurrido un error al intentar crear nueva herramienta.", error);
            });
    };
    
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            sx={{ mt: 4 }}
        >
                <h3 style={{ color: 'white' }}>{titleForm}</h3>
            <hr />
            <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        id="name"
                        label="Nombre"
                        value={name}
                        variant="standard"
                        onChange={(e) => setName(e.target.value)}
                        required
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                    />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel shrink htmlFor="categoria" style={{ color: 'white' }}>Categoría</InputLabel>
                    <Select
                        id="category"
                        value={category}
                        label="Categoría"
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        sx={{ color: 'white' }}
                    >
                        <MenuItem value="Manual">Manual</MenuItem>
                        <MenuItem value="Electrica">Eléctrica</MenuItem>
                        <MenuItem value="Medicion">Medición</MenuItem>
                        <MenuItem value="Aire">Aire</MenuItem>
                        <MenuItem value="Jardin">Jardín</MenuItem>
                        {/* Agrega más categorías según sea necesario */}
                    </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        id="price"
                        label="Precio de Reposición"
                        type="number"
                        value={price}
                        variant="standard"
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                    />
            </FormControl>
            <FormControl>
                <Button
                    variant="contained"
                    color="info"
                    type="submit"
                    onClick={(e) => saveTool(e)}
                    startIcon={<SaveIcon />}
                >
                        <span style={{ color: 'white' }}>Guardar</span>
                </Button>
            </FormControl>
            <br />
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/tool/list")}
                >
                    <span style={{ color: 'white' }}>Volver a la lista</span>
                </Button>
            <hr />
        </Box>
    );
};

export default AddTool;