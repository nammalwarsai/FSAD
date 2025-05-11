import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsChart = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            size: 14,
            family: 'Inter, sans-serif'
          },
          padding: 20,
          usePointStyle: true,
          boxWidth: 8
        }
      },
      title: {
        display: true,
        text: 'Financial Overview',
        color: '#1f2937',
        font: {
          size: 20,
          weight: '600',
          family: 'Inter, sans-serif'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR'
            });
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          callback: (value) => {
            return value.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            });
          }
        }
      }
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Transactions',
        data: [28000, 48000, 40000, 19000, 86000, 27000, 42000, 38000, 45000, 50000, 62000, 70000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointHoverBorderWidth: 3,
        fill: true,
      }
    ]
  };

  return (
    <Box sx={{
      p: 4,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3,
      height: { xs: '400px', md: '500px' },
      position: 'relative',
      '&:hover': {
        boxShadow: 6,
        transition: 'box-shadow 0.3s ease-in-out'
      }
    }}>
      <Line options={chartOptions} data={chartData} />
    </Box>
  );
};

export default AnalyticsChart;