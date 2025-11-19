import React, { useState, useEffect } from 'react';
import { Award, Search, Eye, XCircle, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { apiRequest } from '../../../../config/config';
import { toast } from 'react-toastify';

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/admin/certificates');
      if (response.success) {
        setCertificates(response.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (certificateId, reason) => {
    if (!reason) {
      reason = prompt('Please provide a reason for revoking this certificate:');
      if (!reason) return;
    }

    try {
      const response = await apiRequest(`/api/certificates/${certificateId}/revoke`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });

      if (response.success) {
        toast.success('Certificate revoked successfully');
        fetchCertificates();
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
    }
  };

  const handleViewDetails = async (certificate) => {
    setSelectedCertificate(certificate);
    setShowDetails(true);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && !cert.isRevoked) ||
      (filterStatus === 'revoked' && cert.isRevoked);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Certificate Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, course, or certificate ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Certificates</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">{certificates.length}</p>
                <p className="text-sm text-gray-400">Total Certificates</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">
                  {certificates.filter(c => !c.isRevoked).length}
                </p>
                <p className="text-sm text-gray-400">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">
                  {certificates.filter(c => c.isRevoked).length}
                </p>
                <p className="text-sm text-gray-400">Revoked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'No certificates found matching your criteria' 
                : 'No certificates issued yet'}
            </p>
          </div>
        ) : (
          filteredCertificates.map(cert => (
            <div 
              key={cert._id} 
              className={`bg-gray-800 border rounded-lg p-6 ${
                cert.isRevoked ? 'border-red-500/50' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className={`w-6 h-6 ${cert.isRevoked ? 'text-red-400' : 'text-yellow-400'}`} />
                    <h3 className="text-xl font-semibold text-gray-100">
                      {cert.user?.firstName} {cert.user?.lastName}
                    </h3>
                    {cert.isRevoked && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                        REVOKED
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 mb-2">{cert.course?.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">Email:</span> {cert.user?.email}
                    </div>
                    <div>
                      <span className="text-gray-500">Certificate ID:</span> {cert.certificateId}
                    </div>
                    <div>
                      <span className="text-gray-500">Score:</span> {cert.finalScore}%
                    </div>
                    <div>
                      <span className="text-gray-500">Issued:</span>{' '}
                      {new Date(cert.issuedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {cert.isRevoked && cert.revokedReason && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-sm text-red-400">
                        <span className="font-semibold">Revoked:</span> {cert.revokedReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(cert)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={`/certificate/${cert._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                    title="View Certificate"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  {!cert.isRevoked && (
                    <button
                      onClick={() => handleRevoke(cert._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Revoke Certificate"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-100">Certificate Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Student Name</p>
                  <p className="text-gray-100 font-semibold">
                    {selectedCertificate.user?.firstName} {selectedCertificate.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-gray-100">{selectedCertificate.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Course</p>
                  <p className="text-gray-100 font-semibold">{selectedCertificate.course?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Certificate ID</p>
                  <p className="text-gray-100 font-mono">{selectedCertificate.certificateId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Final Score</p>
                  <p className="text-gray-100 font-semibold">{selectedCertificate.finalScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issued Date</p>
                  <p className="text-gray-100">
                    {new Date(selectedCertificate.issuedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedCertificate.metadata && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-gray-100 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Modules Completed</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.completedModules}/{selectedCertificate.metadata.totalModules}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Quiz Average</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.averageQuizScore}%
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Assignment Average</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.averageAssignmentScore}%
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Total Quizzes</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.totalQuizzes}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Total Assignments</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.totalAssignments}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Time Spent</p>
                      <p className="text-xl font-bold text-gray-100">
                        {selectedCertificate.metadata.totalHours}h
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCertificate.isRevoked && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-1">Certificate Revoked</p>
                    <p className="text-sm text-red-400">{selectedCertificate.revokedReason}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Revoked on: {new Date(selectedCertificate.revokedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <a
                  href={`/api/certificates/verify/${selectedCertificate.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Verify Certificate
                </a>
                {!selectedCertificate.isRevoked && (
                  <button
                    onClick={() => handleRevoke(selectedCertificate._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Revoke Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;
