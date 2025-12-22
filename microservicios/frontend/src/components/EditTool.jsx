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
import DeleteIcon from "@mui/icons-material/Delete";

const EditTool = () => {
	const { id } = useParams();
	const [tool, setTool] = useState(null);
	const [status, setStatus] = useState(3);
	const [price, setPrice] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		toolService.get(id)
			.then((response) => {
				setTool(response.data);
				setStatus(response.data.status);
				setPrice(response.data.price);
				setLoading(false);
			})
			.catch((err) => {
				setError("No se pudo cargar la herramienta");
				setLoading(false);
			});
	}, [id]);

	const handleSave = (e) => {
		e.preventDefault();
		if (!tool) return;
		// Solo permitir cambios en status y price
		const hasChanges = (status !== tool.status) || (Number(price) !== Number(tool.price));
		if (!hasChanges) {
			navigate("/tool/list");
			return;
		}
		const updatedTool = { ...tool, status, price: Number(price) };
		toolService.update(updatedTool)
			.then(() => navigate("/tool/list"))
			.catch(() => setError("Error al actualizar herramienta"));
	};

	const handleDown = (e) => {
		e.preventDefault();
		if (!tool) return;
		const toolDown = { ...tool, status: 0 };
		toolService.update(toolDown)
			.then(() => navigate("/tool/list"))
			.catch(() => setError("Error al dar de baja la herramienta"));
	};

	if (loading) return <div>Cargando...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;
	if (!tool) return <div>No se encontró la herramienta.</div>;

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			component="form"
			sx={{ mt: 4, color: 'white', backgroundColor: 'transparent' }}
		>
			<h3 style={{ color: 'white' }}>Editar Herramienta</h3>
			<hr style={{ borderColor: 'white', width: '100%' }} />
			<FormControl fullWidth sx={{ mb: 2 }}>
				<TextField
					id="name"
					label="Nombre"
					value={tool.name}
					variant="standard"
					InputProps={{ readOnly: true, style: { color: 'white' } }}
					InputLabelProps={{ style: { color: 'white' } }}
				/>
			</FormControl>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<InputLabel shrink htmlFor="status" style={{ color: 'white' }}>Estado</InputLabel>
				<Select
					id="status"
					value={status}
					label="Estado"
					onChange={(e) => setStatus(Number(e.target.value))}
					required
					style={{ color: 'white' }}
				>
					<MenuItem value={1}>En reparación</MenuItem>
					<MenuItem value={3}>Disponible</MenuItem>
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
					inputProps={{ min: 0, style: { color: 'white' } }}
					InputLabelProps={{ style: { color: 'white' } }}
					InputProps={{ style: { color: 'white' } }}
				/>
			</FormControl>
			<FormControl>
				<Button
					variant="contained"
					color="info"
					type="submit"
					onClick={handleSave}
					startIcon={<SaveIcon />}
				>
					Guardar
				</Button>
				<Button
					variant="contained"
					color="error"
					type="submit"
					onClick={handleDown}
					startIcon={<DeleteIcon />}
				>
					Dar de baja
				</Button>
			</FormControl>
			<br />
			<Button
				variant="contained"
				color="secondary"
				onClick={() => navigate("/tool/list")}
			>
				Volver a la lista
			</Button>
			<hr style={{ borderColor: 'white', width: '100%' }} />
		</Box>
	);
};

export default EditTool;
