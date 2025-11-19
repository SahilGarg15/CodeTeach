import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Download, ExternalLink, CheckCircle, Calendar, Shield, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const CertificateDisplay = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/certificates/${certificateId}`);
      if (response.success) {
        setCertificate(response.data);
      }
    } catch (error) {
      toast.error('Failed to load certificate');
      navigate('/my-certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.info('Generating PDF...');
      const response = await apiRequest(`/api/certificates/${certificateId}/download`, {
        method: 'GET',
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded!');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleVerify = () => {
    window.open(`${window.location.origin}/verify-certificate/${certificate.certificateId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!certificate) return null;

  const isExpired = certificate.expiryDate && new Date(certificate.expiryDate) < new Date();
  const isRevoked = certificate.status === 'revoked';

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Status Alerts */}
        {isRevoked && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-semibold">Certificate Revoked</p>
                <p className="text-sm text-gray-400">This certificate has been revoked and is no longer valid.</p>
              </div>
            </div>
          </div>
        )}
        
        {isExpired && !isRevoked && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Certificate Expired</p>
                <p className="text-sm text-gray-400">This certificate expired on {new Date(certificate.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Display */}
        <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-purple-900 rounded-lg p-8 md:p-12 border-4 border-yellow-500/20 shadow-2xl mb-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-gray-300 text-lg">This certifies that</p>
            </div>

            {/* Recipient Name */}
            <div className="text-center mb-8 py-6 border-y-2 border-yellow-500/30">
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                {certificate.user.name}
              </h2>
              <p className="text-gray-300 text-lg">has successfully completed</p>
            </div>

            {/* Course Name */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-4">
                {certificate.course.title}
              </h3>
              {certificate.metadata?.description && (
                <p className="text-gray-300 max-w-2xl mx-auto">
                  {certificate.metadata.description}
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Certificate ID</p>
                <p className="text-lg font-mono text-gray-200">{certificate.certificateId}</p>
              </div>
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Issue Date</p>
                <p className="text-lg text-gray-200">
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Final Score</p>
                <p className="text-lg font-semibold text-green-400">
                  {certificate.finalScore.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Grade Badge */}
            {certificate.grade && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full px-6 py-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-400">Grade: {certificate.grade}</span>
                </div>
              </div>
            )}

            {/* Completion Details */}
            {certificate.metadata && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                {certificate.metadata.courseDuration && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Course Duration</p>
                    <p className="text-lg text-gray-200">{certificate.metadata.courseDuration}</p>
                  </div>
                )}
                {certificate.metadata.totalLessons && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Lessons Completed</p>
                    <p className="text-lg text-gray-200">{certificate.metadata.totalLessons}</p>
                  </div>
                )}
                {certificate.metadata.skillsAcquired && certificate.metadata.skillsAcquired.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Skills Acquired</p>
                    <p className="text-lg text-gray-200">{certificate.metadata.skillsAcquired.length}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-700/50">
              <p className="text-sm text-gray-400">
                Issued by <span className="text-gray-200 font-semibold">CodeTeach Learning Platform</span>
              </p>
              {certificate.expiryDate && !isExpired && (
                <p className="text-sm text-gray-400 mt-2">
                  Valid until {new Date(certificate.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {certificate.metadata?.skillsAcquired && certificate.metadata.skillsAcquired.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Skills Acquired</h3>
            <div className="flex flex-wrap gap-2">
              {certificate.metadata.skillsAcquired.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isRevoked && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={handleVerify}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              Verify Certificate
            </button>
            <button
              onClick={() => navigate('/my-certificates')}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
            >
              Back to Certificates
            </button>
          </div>
        )}

        {/* Verification Info */}
        <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-300 mb-2">
                This certificate can be verified at any time using the certificate ID. 
                The verification link above will show the authenticity and current status of this certificate.
              </p>
              <p className="text-xs text-gray-500">
                Certificate ID: <span className="font-mono">{certificate.certificateId}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDisplay;
