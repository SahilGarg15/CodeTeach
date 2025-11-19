import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Calendar, Trophy, ExternalLink, Loader2, Search } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const MyCertificates = () => {
  const navigate = useNavigate();
  
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/certificates/my-certificates');
      if (response.success) {
        setCertificates(response.data);
      }
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'expired': return 'bg-yellow-600';
      case 'revoked': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-gray-100">My Certificates</h1>
          </div>
          <p className="text-gray-400">View and manage all your earned certificates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total Certificates</span>
            </div>
            <p className="text-3xl font-bold text-gray-100">{certificates.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {certificates.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-400">Expired</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {certificates.filter(c => c.status === 'expired').length}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">Avg. Score</span>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {certificates.length > 0
                ? (certificates.reduce((acc, c) => acc + c.finalScore, 0) / certificates.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No certificates found' : 'No Certificates Yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Complete courses to earn certificates'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600 transition-all cursor-pointer group"
                onClick={() => navigate(`/certificate/${certificate._id}`)}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getStatusColor(certificate.status)} text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
                    {certificate.status}
                  </span>
                  {certificate.grade && (
                    <span className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                      Grade: {certificate.grade}
                    </span>
                  )}
                </div>

                {/* Certificate Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-semibold text-gray-100 text-center mb-2 group-hover:text-blue-400 transition-colors">
                  {certificate.course.title}
                </h3>

                {/* Score */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400 mb-1">Final Score</p>
                  <p className={`text-2xl font-bold ${getGradeColor(certificate.finalScore)}`}>
                    {certificate.finalScore.toFixed(1)}%
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Certificate ID</span>
                    <span className="text-gray-200 font-mono text-xs">{certificate.certificateId.slice(0, 12)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Issue Date</span>
                    <span className="text-gray-200">{new Date(certificate.issueDate).toLocaleDateString()}</span>
                  </div>
                  {certificate.expiryDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Expires</span>
                      <span className="text-gray-200">{new Date(certificate.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold group-hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/certificate/${certificate._id}`);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
