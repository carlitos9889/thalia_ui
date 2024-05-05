import { usePDF } from "react-to-pdf";
import CustomAppBar from "../components/CustomAppBar";
import { Container } from "@mui/material";
import { useState } from "react";
import FullFeaturedCrudGrid from "../components/FullFeaturedCrudGrid";
import { CustomLinearChart } from "../components/charts/CustomLineChart";
import { CustomPie } from "../components/charts/CustomPie";
import Graph from "../components/charts/Nodes";
import JSON_AUX, { labels } from "../const/contants";
import { GRAFICOS } from "../enums/GRAFICOS";
import React from "react";
import { AxiosConfig } from "../config/axios";

const JustGraficas = () => {
	const [showGrafica, setshowGrafica] = useState<GRAFICOS>(GRAFICOS.TABLE);

	const { toPDF, targetRef } = usePDF({ filename: " graficos.pdf" });
	const generateDataWithConnections = (count: number) => {
		const nodes = [];
		const links = [];

		for (let i = 1; i <= count; i++) {
			const node = {
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				label: "Autor " + Math.round(Math.random() * 100),
			};
			nodes.push(node);

			if (i > 1) {
				// Conecta el nodo actual con los dos nodos anteriores
				links.push([nodes[i - 1], node]);
				links.push([nodes[i - 2], node]);
			}
		}

		return { nodes, links };
	};

	const [dataLinea, setdataLinea] = useState({});

	const getAllRegister = async () => {
		const resp = await AxiosConfig.getAllRegisters();
		setdataLinea(resp);
	};

	React.useEffect(() => {
		getAllRegister();
	}, []);

	return (
		<>
			<CustomAppBar
				toPDF={toPDF}
				tipoGrafica={showGrafica}
				onTap={setshowGrafica}
				isAdmin={false}
				handleClose={() => {}}
			>
				{showGrafica == GRAFICOS.TABLE && (
					<Container>
						<FullFeaturedCrudGrid />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart
							data={{
								labels: labels,
								datasets: [
									{
										label: "Título",
										data: labels.map(
											(_, i) =>
												dataLinea[`${i + 1}`].title
													.length
										),
										borderColor: "rgb(26, 254, 247)",
										backgroundColor:
											"rgba(26, 254, 247, 0.5)",
										yAxisID: "y1",
									},

									{
										label: "Editorial",
										data: labels.map(
											(_, i) =>
												dataLinea[`${i + 1}`].publisher
													.length
										),

										borderColor: "rgb(28, 93, 4)",
										backgroundColor: "rgba(28, 93, 4, 0.5)",
										yAxisID: "y1",
									},
									{
										label: "Autores",
										data: labels.map(
											(_, i) =>
												dataLinea[`${i + 1}`].creator
													.length
										),

										borderColor: "rgb(284, 93, 4)",
										backgroundColor:
											"rgba(284, 93, 4, 0.5)",
										yAxisID: "y1",
									},
								],
							}}
						/>
					</Container>
				)}
				{showGrafica == GRAFICOS.PIE && (
					<Container ref={targetRef} maxWidth="sm">
						<CustomPie />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_AUTHOR && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart data={JSON_AUX.oneLinesAutor} />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_TITTLE && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart data={JSON_AUX.oneLinesTittle} />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_DATE && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart data={JSON_AUX.oneLinesFecha} />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_EDITORIAL && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart data={JSON_AUX.oneLinesEditorial} />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_MATERIA && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart data={JSON_AUX.oneLinesMateria} />
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_ORGANIZATION && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart
							data={JSON_AUX.oneLinesOrganizacion}
						/>
					</Container>
				)}
				{showGrafica == GRAFICOS.LINEAL_PLACE_ORGANIZATION && (
					<Container ref={targetRef} maxWidth="md">
						<CustomLinearChart
							data={JSON_AUX.oneLinesPlaceOrganizacion}
						/>
					</Container>
				)}
				{showGrafica == GRAFICOS.NODES && (
					<Container ref={targetRef} maxWidth="md">
						<Graph data={generateDataWithConnections(20)} />
					</Container>
				)}
				{/* {showGrafica == GRAFICOS.MAPAS_ONLY && (
					<Container ref={targetRef} maxWidth="md">
						<CustomMapMarcador />
					</Container>
				)}
				{showGrafica == GRAFICOS.MAPAS_MANY && (
					<Container ref={targetRef} maxWidth="md">
						<CustomMapMarcadores />
					</Container>
				)} */}
			</CustomAppBar>
		</>
	);
};

export default JustGraficas;
