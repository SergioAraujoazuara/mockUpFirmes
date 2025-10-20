document.addEventListener('DOMContentLoaded', function () {

    // --- GRÁFICO 1: BARRAS APILADAS (IMPACTO POR FASE) ---
    const ctxBar = document.getElementById('acvBarChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Alternativa A: Tradicional', 'Alternativa B: Hormigón', 'Alternativa C: Mezcla Reciclada'],
            datasets: [
                {
                    label: 'Extracción y Fabricación',
                    data: [120, 150, 80],
                    backgroundColor: '#38bdf8', // Azul claro
                },
                {
                    label: 'Construcción',
                    data: [50, 40, 60],
                    backgroundColor: '#fbbf24', // Ambar
                },
                 {
                    label: 'Uso y Mantenimiento',
                    data: [200, 150, 180],
                    backgroundColor: '#f87171', // Rojo claro
                },
                {
                    label: 'Fin de Vida',
                    data: [30, 25, 50],
                    backgroundColor: '#a78bfa', // Violeta
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // <-- ESTA OPCIÓN ES CLAVE
			aspectRatio: 5, 
            plugins: {
                title: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Impacto (kg CO₂-eq)'
                    }
                }
            }
        }
    });

    // --- GRÁFICO 2: RADAR DE SOSTENIBILIDAD ---
    const ctxRadar = document.getElementById('sustainabilityRadarChart').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Huella Carbono', 'Coste (€)', 'Durabilidad (Años)', 'Circularidad (%)', 'Uso de Agua'],
            datasets: [{
                label: 'Alternativa A: Tradicional',
                data: [4, 6, 7, 5, 6],
                fill: true,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgb(239, 68, 68)',
                pointBackgroundColor: 'rgb(239, 68, 68)',
			}, {
                label: 'Alternativa B: Hormigón',
                data: [6, 7, 8, 1, 9],
                fill: true,
                backgroundColor: 'rgba(90, 37, 194, 0.2)',
                borderColor: 'rgb(90, 37, 194)',
                pointBackgroundColor: 'rgb(90, 37, 194)',
            }, {
                label: 'Alternativa C: Mezcla Reciclada',
                data: [8, 5, 6, 9, 7],
                fill: true,
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgb(34, 197, 94)',
                pointBackgroundColor: 'rgb(34, 197, 94)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
			aspectRatio: 3,
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        backdropColor: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });

    // --- GRÁFICO 3: DONA (DESGLOSE DE MATERIALES) ---
     const ctxDoughnut = document.getElementById('materialsDoughnutChart').getContext('2d');
     new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Áridos', 'Ligante Asfáltico', 'Cemento', 'Aditivos', 'Acero'],
            datasets: [{
                label: 'Contribución a la Huella de Carbono',
                data: [45, 30, 15, 5, 5],
                backgroundColor: [
                    '#64748b',
                    '#1e293b',
                    '#94a3b8',
                    '#a78bfa',
                    '#e2e8f0'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
			aspectRatio: 2.5, 
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
});