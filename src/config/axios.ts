import axios from "axios";
import { FuenteDB } from "../interfaces/fuente.interface";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	timeout: 5000,
	headers: {
		// Authorization: "JWT " + localStorage.getItem("access_token"),
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

export const getAllFuentes = async () => {
	try {
		const { data } = await axiosInstance.get<FuenteDB[]>(
			"/v1/fuentes/get-all-fuentes"
		);
		return data;
	} catch (e) {
		throw new Error("Error al mostrar las fuentes");
	}
};

export class AxiosConfig {
	constructor() {}
	static async getAllFuentes() {
		try {
			const { data } = await axiosInstance.get<FuenteDB[]>(
				"/v1/fuentes/get-all-fuentes"
			);
			return data;
		} catch (e) {
			throw new Error("Error al mostrar las fuentes");
		}
	}
	static async updateFuenteById(id: string, fuente: FuenteDB) {
		const { data } = await axiosInstance.patch(`/v1/fuentes/${id}`, fuente);
		return data;
	}

	static async deleteFuenteById(id: string) {
		const { data } = await axiosInstance.delete(`/v1/fuentes/${id}`);
		return data;
	}
	static async getAllRegisters() {
		const { data } = await axiosInstance.get(
			"/v1/fuentes/get-all-registers"
		);
		return data;
	}
}
