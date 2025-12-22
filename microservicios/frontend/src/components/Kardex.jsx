import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import kardexService from "../services/kardexRegister.service";
import loanService from "../services/loan.service";
import clientService from "../services/client.service";
import toolService from "../services/tool.service";
import { format } from "date-fns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";

const Kardex = () => {
  const [kardexList, setKardexList] = useState([]);
  const [tools, setTools] = useState({});1
  const [selectedTool, setSelectedTool] = useState("");
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRegisters, setFilteredRegisters] = useState([]);
  const navigate = useNavigate();
			useEffect(() => {
				const fetchData = async () => {
					setLoading(true);
					try {
						const { data: kardexData } = await kardexService.getAll();
						const [{ data: toolsData }, { data: clientsData }] = await Promise.all([
							toolService.getAll(),
							clientService.getAll(),
						]);
						const toolsMap = {};
						toolsData.forEach(t => { toolsMap[t.id] = t; });
						const clientsMap = {};
						clientsData.forEach(c => { clientsMap[c.id] = c; });
						setTools(toolsMap);
						setClients(clientsMap);
						setKardexList(kardexData);
						setFilteredRegisters(kardexData);
						console.log("Kardex data:", kardexData);
					} catch (err) {
						setKardexList([]);
						setFilteredRegisters([]);
					}
					setLoading(false);
				};
				fetchData();
			}, []);


			// Filtrar por rango de fechas en frontend
			const handleFilter1 = async () => {
				if (!startDate && !endDate) {
					setFilteredRegisters(kardexList);
					return;
				}
				setLoading(true);
				try {
					const response = await kardexService.getByDateRange(startDate, endDate);
					setFilteredRegisters(response.data);
				} catch (error) {
					console.error("Error al filtrar por rango de fechas:", error);
					setFilteredRegisters([]);
				}
				setLoading(false);
			};

			const handleFilter2 = async () => {
				if (!selectedTool) {
					setFilteredRegisters(kardexList);
					return;
				}
				setLoading(true);
				try {
					const { data } = await kardexService.getToolRegisters(selectedTool);
					setFilteredRegisters(data);
				} catch (error) {
					console.error("Error al filtrar por herramienta:", error);
					setFilteredRegisters([]);
				}
				setLoading(false);
			};


	const getRelacionLabel = (relacion) => {
		if (relacion === 1) return "Herramienta";
		if (relacion === 2) return "Préstamo";
		return "-";
	};

	const getDateFormatted = (date) => {
    if (!date) return "-";
    const parsedDate = date.toString();
    return parsedDate;
}
	const getToolName = (toolId) => {
		return tools[toolId]?.name || "-";
	};

	const getClientName = (clientId) => {
		return clients[clientId]?.name || "No aplica";
	};

	const handleViewLoan = async (loanId) => {
		try {
			const { data } = await loanService.get(loanId);
			setSelectedLoan(data);
			setLoanDialogOpen(true);
		} catch (e) {
			setSelectedLoan(null);
			setLoanDialogOpen(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("¿Eliminar registro?")) return;
		setDeleting(true);
		try {
			await kardexService.remove(id);
			const { data: kardexData } = await kardexService.getAll();
			setKardexList(kardexData);
		} catch (e) {}
		setDeleting(false);
	};

		return (
			<Box sx={{ p: 2 }}>
				<Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
					<Typography variant="h5" gutterBottom>Kardex - Registros</Typography>
					<Box>
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddIcon />}
							sx={{ mr: 1 }}
							onClick={() => navigate('/loan/add')}
						>
							Agregar préstamo
						</Button>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => navigate('/loan/list')}
						>
							Ver préstamos
						</Button>
					</Box>
				</Box>
				{/* Filtro de rango de fechas */}
				<Box mb={2} display="flex" alignItems="center" gap={2}>
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
					<Button variant="outlined" color="primary" onClick={handleFilter1}>
						Filtrar por fechas
					</Button>
				</Box>

				{/* Filtro por herramienta */}
				<Box mb={2} display="flex" alignItems="center" gap={2}>
					<select
						value={selectedTool || ""}
						onChange={e => setSelectedTool(e.target.value)}
					>
						<option value="">Todas las herramientas</option>
						{Object.entries(tools).map(([id, tool]) => (
							<option key={id} value={id}>{tool.id}.- {tool.name}</option>
						))}
					</select>
					<Button variant="outlined" color="primary" onClick={handleFilter2}>
						Filtrar por herramienta
					</Button>
				</Box>

								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>ID</TableCell>
												<TableCell>Movimiento</TableCell>
												<TableCell>Fecha</TableCell>
												<TableCell>Relación</TableCell>
												<TableCell>Herramienta</TableCell>
												<TableCell>ID Herramienta</TableCell>
												<TableCell>ID Préstamo</TableCell>
												<TableCell>Cliente</TableCell>
												<TableCell>Acciones</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{loading ? (
												<TableRow><TableCell colSpan={8}>Cargando...</TableCell></TableRow>
											) : filteredRegisters.length === 0 ? (
												<TableRow><TableCell colSpan={8}>Sin registros</TableCell></TableRow>
											) : filteredRegisters.map((row) => (
												<TableRow key={row.id}>
													<TableCell>{row.id}</TableCell>
													<TableCell>{row.movement || '-'}</TableCell>
													<TableCell>{getDateFormatted(row.date)}</TableCell>
													<TableCell>{getRelacionLabel(row.typeRelated)}</TableCell>
													<TableCell>{getToolName(row.toolId)}</TableCell>
													<TableCell>{row.toolId || 'No aplica'}</TableCell>
													<TableCell>{row.loanId || 'No aplica'}</TableCell>
													<TableCell>{getClientName(row.clientId)}</TableCell>
													<TableCell>
														{row.typeRelated === 2 ? (
															<>
																<Button
																	size="small"
																	variant="outlined"
																	onClick={() => handleViewLoan(row.loanId)}
																	sx={{ mr: 1 }}
																>
																	Ver detalles
																</Button>
																<Button
																	size="small"
																	color="error"
																	variant="outlined"
																	onClick={() => handleDelete(row.id)}
																	disabled={deleting}
																	startIcon={<DeleteIcon />}
																>
																	Eliminar registro
																</Button>
															</>
														) : row.typeRelated === 1 ? (
															<Button
																size="small"
																variant="outlined"
																onClick={() => navigate('/tool/list')}
															>
																Ir a herramientas
															</Button>
														) : null}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>

				{/* Dialogo de detalles del préstamo */}
				<Dialog open={loanDialogOpen} onClose={() => setLoanDialogOpen(false)} maxWidth="sm" fullWidth>
					<DialogTitle>Detalles del Préstamo</DialogTitle>
					<DialogContent>
						{selectedLoan ? (
							<Box>
								{Object.entries(selectedLoan).map(([key, value]) => (
									<Typography key={key}><b>{key}:</b> {String(value)}</Typography>
								))}
							</Box>
						) : (
							<Typography>No se pudo cargar el préstamo.</Typography>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setLoanDialogOpen(false)}>Cerrar</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
};

export default Kardex;