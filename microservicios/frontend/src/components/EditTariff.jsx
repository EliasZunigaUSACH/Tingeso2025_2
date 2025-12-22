import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TariffService from "../services/tariff.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const EditTariff = () => {
    const [tariff, setTariff] = useState({ dailyTariff: "", delayTariff: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchTariff = async () => {
            try {
                const response = await TariffService.get(id);
                // Asegurarse de que los valores sean strings para los inputs
                const data = response.data;
                setTariff({
                    dailyTariff: data.dailyTariff !== undefined ? String(data.dailyTariff) : "",
                    delayTariff: data.delayTariff !== undefined ? String(data.delayTariff) : ""
                });
            } catch (error) {
                setError("Error al cargar la tarifa");
            } finally {
                setLoading(false);
            }
        };
        fetchTariff();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTariff((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertir los valores a número antes de enviar si es necesario
            await TariffService.update({
                ...tariff,
                dailyTariff: Number(tariff.dailyTariff),
                delayTariff: Number(tariff.delayTariff)
            });
            navigate("/tariff");
        } catch (error) {
            setError("Error al actualizar la tarifa");
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Tarifa diaria"
                    name="dailyTariff"
                    value={tariff.dailyTariff}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                />
                <TextField
                    label="Tarifa diaria por atraso"
                    name="delayTariff"
                    value={tariff.delayTariff}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                />
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ color: 'white' }}>
                    Guardar
                </Button>
            </Box>
    );
};

export default EditTariff;