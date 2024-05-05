export const labels = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

const JSON_AUX = {
	allLinesLinear: {
		labels: labels,
		datasets: [
			{
				label: "Título",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(26, 254, 247)",
				backgroundColor: "rgba(26, 254, 247, 0.5)",
				yAxisID: "y1",
			},

			{
				label: "Editorial",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(28, 93, 4)",
				backgroundColor: "rgba(28, 93, 4, 0.5)",
				yAxisID: "y1",
			},
		],
	},
	oneLinesAutor: {
		labels: labels,
		datasets: [
			{
				label: "Autor",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesTittle: {
		labels: labels,
		datasets: [
			{
				label: "Titulo",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesFecha: {
		labels: labels,
		datasets: [
			{
				label: "Fecha",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesEditorial: {
		labels: labels,
		datasets: [
			{
				label: "Editorial",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesMateria: {
		labels: labels,
		datasets: [
			{
				label: "Materia",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesOrganizacion: {
		labels: labels,
		datasets: [
			{
				label: "Organización",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	oneLinesPlaceOrganizacion: {
		labels: labels,
		datasets: [
			{
				label: "Lugar de Organización",
				data: labels.map(() => Math.random() * 1000),
				borderColor: "rgb(9, 122, 118)",
				backgroundColor: "rgba(9, 122, 118, 0.5)",
				yAxisID: "y",
			},
		],
	},
	nodesAndLinks: {
		nodes: [
			{ x: 10, y: 20 },
			{ x: 30, y: 40 },
			// ... más nodos
		],
		links: [
			[
				{ x: 10, y: 20 },
				{ x: 30, y: 40 },
			],
			// ... más enlaces
		],
	},
};

export default JSON_AUX;
