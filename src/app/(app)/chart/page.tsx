'use client'
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const hoverPlugin = {
    id: 'hoverPoint',
    afterEvent: (chart, args) => {
        const { event } = args;
        if (event.type === 'mousemove') {
            const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            if (elements.length > 0) {
                const index = elements[0].index;
                chart.tooltip.setActiveElements([{datasetIndex: 0, index}], event);
            }
        }
    },
    beforeTooltipDraw: (chart) => {
        const tooltip = chart.tooltip;
        const activeElements = tooltip.getActiveElements();
        if (activeElements.length > 0) {
            const ctx = chart.ctx;
            ctx.save();
        
            activeElements.forEach(activeElement => {
                const element = activeElement.element;
                const datasetIndex = activeElement.datasetIndex;
        
                if (datasetIndex === 0) { 
                    ctx.fillStyle = 'red'; 
                } else {
                    ctx.fillStyle = 'blue'; 
                }
        
                ctx.beginPath();
                ctx.arc(element.x, element.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        
            ctx.restore();
        }        
    }
};

const Page = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        Chart.register(hoverPlugin);

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T1 2015', 'T1 2016', 'T1 2017', 'T1 2018', 'T1 2019', 'T1 2020', 'T1 2021', 'T1 2022', 'T1 2023', 'T1 2024'],
                datasets: [{
                    label: 'Data',
                    data: [12000, 15000, 13000, 16000, 18000, 17000, 20000, 21000, 23000, 22000],
                    borderColor: 'red',
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'rgba(255, 0, 0, 1)',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 2
                }, {
                    label: 'Index',
                    data: [10000, 12000, 10000, 13000, 15000, 14000, 16000, 17000, 20000, 19000],
                    borderColor: 'blue',
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'blue',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            },
            plugins: [hoverPlugin]
        });

        return () => {
            Chart.unregister(hoverPlugin);
            myChart.destroy();
        };
    }, []);

    return (
        <div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default Page;
