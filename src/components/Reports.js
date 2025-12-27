import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { requestService } from '../services/api';
import '../styles/Reports.css';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await requestService.getStatistics();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Provide safe defaults so the UI doesn't crash when backend is unavailable
      setStats({
        totalRequests: 0,
        openRequests: 0,
        completedRequests: 0,
        scrapRequests: 0,
        requestsPerTeam: [],
        requestsPerCategory: [],
      });
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B9D'];

  const safeStats = stats || {
    totalRequests: 0,
    openRequests: 0,
    completedRequests: 0,
    scrapRequests: 0,
    requestsPerTeam: [],
    requestsPerCategory: [],
  };

  const overviewData = [
    { name: 'Open', value: safeStats.openRequests, color: '#3b82f6' },
    { name: 'Completed', value: safeStats.completedRequests, color: '#10b981' },
    { name: 'Scrapped', value: safeStats.scrapRequests, color: '#ef4444' },
  ];

  return (
    <div className="reports-container">
      <h1>Maintenance Reports</h1>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p className="stat-value">{stats.totalRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Open Requests</h3>
          <p className="stat-value" style={{ color: '#3b82f6' }}>{stats.openRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value" style={{ color: '#10b981' }}>{stats.completedRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Scrapped Equipment</h3>
          <p className="stat-value" style={{ color: '#ef4444' }}>{stats.scrapRequests}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h2>Request Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overviewData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {overviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>Requests per Equipment Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeStats.requestsPerCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>Requests per Team</h2>
          {safeStats.requestsPerTeam && safeStats.requestsPerTeam.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeStats.requestsPerTeam.map((item) => ({
                name: (item.team && item.team[0] && item.team[0].name) || 'Unknown',
                count: item.count,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No team data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
