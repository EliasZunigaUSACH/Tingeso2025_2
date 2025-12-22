
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoanService from "../services/loan.service";
import kardexRegisterService from "../services/kardexRegister.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import ToolService from "../services/tool.service";
import { format } from "date-fns";

const EditLoan = () => {
	const { id } = useParams();
	const [loan, setLoan] = useState(null);
	const [status, setStatus] = useState(1); // 0: Terminado, 2: Atrasado
	const [toolReturnStatus, setToolReturnStatus] = useState(2); // 0: Irreparable, 1: Dañado, 2: Buen estado
	const [price, setPrice] = useState(0);
	const [dateReturn, setDateReturn] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		LoanService.get(id)
			.then((response) => {
				setLoan(response.data);
				setStatus(response.data.status);
				setPrice(response.data.price || 0);
				setLoading(false);
			})
			.catch(() => {
				setError("No se pudo cargar el préstamo");
				setLoading(false);
			});
	}, [id]);

	const handleSave = (e) => {
		e.preventDefault();
		if (!loan) return;
		// Solo permitir cambios en status (0,2) y precio
		const hasChanges = (status !== loan.status) || (Number(price) !== Number(loan.price));
		if (!hasChanges) {
			navigate("/kardex");
			return;
		}
		// Si el préstamo se termina, agregar fecha de devolución
		let updatedLoan = { ...loan, status, price: Number(price) };
		if (status === 0) {
			updatedLoan.dateReturn = format(new Date(), "yyyy-MM-dd");
			updatedLoan.toolReturnStatus = toolReturnStatus;
		}
		LoanService.update(updatedLoan)
			.then(() => {
				console.log("Préstamo actualizado: ", updatedLoan);
				navigate("/kardex");
			})
			.catch(() => setError("Error al actualizar préstamo"));
	};

	if (loading) return <div>Cargando...</div>;
	if (error) return <div style={{ color: "red" }}>{error}</div>;
	if (!loan) return <div>No se encontró el préstamo.</div>;

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			component="form"
			sx={{ mt: 4, color: 'white' }}
		>
			<h3 style={{ color: 'white' }}>Editar Préstamo</h3>
	 		<hr style={{ borderColor: 'white', width: '100%' }} />
			{/* Datos solo visualización */}
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="ID Préstamo"
	 				value={loan.id}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="ID Cliente"
	 				value={loan.clientId}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="ID Herramienta"
	 				value={loan.toolId}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="Categoría"
	 				value={loan.category}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="Fecha Inicio"
	 				value={loan.dateStart}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				label="Fecha Límite"
	 				value={loan.dateLimit}
	 				variant="standard"
	 				InputProps={{ readOnly: true }}
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 			/>
	 		</FormControl>
			{/* Solo editar status y precio */}
	 		<FormControl fullWidth sx={{ mb: 2 }}>
	 			<TextField
	 				select
	 				label="Estado"
	 				value={status}
	 				onChange={e => setStatus(Number(e.target.value))}
	 				variant="standard"
	 				InputLabelProps={{ style: { color: 'white' } }}
	 				inputProps={{ style: { color: 'white' } }}
	 				SelectProps={{ MenuProps: { PaperProps: { style: { backgroundColor: '#222', color: 'white' } } } }}
	 			>
	 				<MenuItem value={0} style={{ color: 'white', backgroundColor: '#222' }}>Terminado</MenuItem>
	 				<MenuItem value={2} style={{ color: 'white', backgroundColor: '#222' }}>Atrasado</MenuItem>
	 			</TextField>
	 		</FormControl>
			{/* Selección de estado de herramienta devuelta, solo si Terminado */}
			{status === 0 && (
				<FormControl fullWidth sx={{ mb: 2 }}>
					<TextField
						select
						label="Estado de herramienta devuelta"
						value={toolReturnStatus}
						onChange={e => setToolReturnStatus(Number(e.target.value))}
						variant="standard"
						InputLabelProps={{ style: { color: 'white' } }}
						inputProps={{ style: { color: 'white' } }}
						SelectProps={{ MenuProps: { PaperProps: { style: { backgroundColor: '#222', color: 'white' } } } }}
					>
						<MenuItem value={1} style={{ color: 'white', backgroundColor: '#222' }}>Dañado</MenuItem>
						<MenuItem value={2} style={{ color: 'white', backgroundColor: '#222' }}>Buen estado</MenuItem>
					</TextField>
				</FormControl>
			)}
	 		<FormControl>
	 			<Button
	 				variant="contained"
	 				color="info"
	 				type="submit"
	 				onClick={handleSave}
	 				startIcon={<SaveIcon />}
	 				style={{ color: 'white' }}
	 			>
	 				Guardar
	 			</Button>
	 		</FormControl>
	 		<br />
	 		<Button
	 			variant="contained"
	 			color="secondary"
	 			onClick={() => navigate("/kardex")}
	 			style={{ color: 'white' }}
	 		>
	 			Volver a la lista
	 		</Button>
	 		<hr style={{ borderColor: 'white', width: '100%' }} />
		</Box>
	);
};

export default EditLoan;
