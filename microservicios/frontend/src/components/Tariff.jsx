import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TariffService from "../services/tariff.service";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const Tariff = () => {
    const [tariff, setTariff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTariff = async () => {
            try {
                const response = await TariffService.get();
                setTariff(response.data);
            } catch (error) {
                // if no tarifa exists, create a default one
                await handleCreate();
            } finally {
                setLoading(false);
            }
        };
        fetchTariff();
    }, []);

    const handleCreate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const newTariff = { dailyTariff: 0, delayTariff: 0 };
        try {
            const response = await TariffService.create(newTariff);
            setTariff(response.data);
            setError("");
            return response.data;
        } catch (err) {
            setError("Error al crear la tarifa");
            return null;
        }
    };

    const handleEdit = () => {
        navigate("/tariff/edit");
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <Paper sx={{ padding: 10, maxWidth: 420, margin: "auto" }}>
            <h2 style={{ marginTop: 10, fontSize: "2rem" }}>Tarifa</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <TableContainer>
                <Table size="small" aria-label="tariff table" >
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                Tarifa diaria
                                </TableCell>
                            <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                {tariff ? tariff.dailyTariff : "-"}
                                </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Tarifa por atraso</TableCell>
                            <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>{tariff ? tariff.delayTariff : "-"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button onClick={handleEdit} startIcon={<EditIcon />} size="small" variant="contained">
                    Editar
                </Button>
            </div>
        </Paper>
    );
};

export default Tariff;