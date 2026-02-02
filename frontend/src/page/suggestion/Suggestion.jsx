import React, { useEffect, useState, useMemo, useCallback } from 'react';
import authService from '../../service/auth.service';
import * as Icons from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

// Map common icon names to available exports with safe fallbacks (emoji) so build doesn't fail
const Search = Icons.Search || (() => <span aria-hidden>🔍</span>);
const Filter = Icons.Filter || (() => <span aria-hidden>⚙️</span>);
const Download = Icons.Download || (() => <span aria-hidden>⬇️</span>);
const Eye = Icons.Eye || (() => <span aria-hidden>👁️</span>);
const Edit2 = Icons.Edit2 || Icons.Pencil || Icons.PencilSquare || (() => <span aria-hidden>✏️</span>);
const Trash2 = Icons.Trash2 || Icons.Trash || (() => <span aria-hidden>🗑️</span>);
const CheckCircle = Icons.CheckCircle || (() => <span aria-hidden>✔️</span>);
const XCircle = Icons.XCircle || (() => <span aria-hidden>❌</span>);
const Clock = Icons.Clock || (() => <span aria-hidden>🕒</span>);
const ChevronDown = Icons.ChevronDown || (() => <span aria-hidden>▾</span>);
const ChevronUp = Icons.ChevronUp || (() => <span aria-hidden>▴</span>);
const Mail = Icons.Envelope || Icons.Mail || (() => <span aria-hidden>✉️</span>);
const Phone = Icons.Phone || (() => <span aria-hidden>📞</span>);
const MapPin = Icons.MapPin || (() => <span aria-hidden>📍</span>);
const User = Icons.Person || Icons.User || (() => <span aria-hidden>👤</span>);
const Calendar = Icons.Calendar || (() => <span aria-hidden>📅</span>);
const BarChart = Icons.BarChart || (() => <span aria-hidden>📊</span>);
const MoreVertical = Icons.MoreVertical || (() => <span aria-hidden>⋮</span>);
const FileText = Icons.FileText || (() => <span aria-hidden>📄</span>);
import './Suggestions.css';

const BASE = import.meta.env.VITE_API_URL || '';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getAllSuggestions = async () => {
      try {
        const url = BASE ? `${BASE}/api/suggestions` : '/api/suggestions';
        const { token } = authService.getAuth() || {};
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('Fetched suggestions:', data);
        if (mounted) {
          const items = Array.isArray(data) ? data : (data && data.items ? data.items : []);
          setSuggestions(items);
          setFilteredSuggestions(items);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
        if (mounted) setError(err.message || 'Fetch error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getAllSuggestions();

    return () => { mounted = false; };
  }, []);

  // Optimized filtering and sorting with useMemo
  const filteredAndSortedSuggestions = useMemo(() => {
    let results = [...suggestions];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(suggestion =>
        suggestion.name?.toLowerCase().includes(lowerSearch) ||
        suggestion.email?.toLowerCase().includes(lowerSearch) ||
        suggestion.mobile?.includes(searchTerm) ||
        suggestion.problem?.toLowerCase().includes(lowerSearch) ||
        suggestion.solution?.toLowerCase().includes(lowerSearch) ||
        false
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      results.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle dates
        if (sortConfig.key === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        // Handle null/undefined
        if (!aVal) return 1;
        if (!bVal) return -1;

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return results;
  }, [suggestions, searchTerm, sortConfig]);

  // Update filteredSuggestions when the memoized value changes
  useEffect(() => {
    setFilteredSuggestions(filteredAndSortedSuggestions);
    setCurrentPage(1);
  }, [filteredAndSortedSuggestions]);

  const formatDate = useCallback((iso) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso || '-';
    }
  }, []);

  // status removed - UI simplified

  // Pagination - Memoized for performance (defined before handlers that use it)
  const { currentItems, indexOfFirstItem, indexOfLastItem, totalPages } = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const items = filteredSuggestions.slice(indexOfFirst, indexOfLast);
    const total = Math.ceil(filteredSuggestions.length / itemsPerPage);

    return {
      currentItems: items,
      indexOfFirstItem: indexOfFirst,
      indexOfLastItem: indexOfLast,
      totalPages: total
    };
  }, [currentPage, itemsPerPage, filteredSuggestions]);

  const handleSort = useCallback((key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleExport = useCallback(() => {
    setExporting(true);

    try {
      // Export filtered suggestions to Excel
      const dataToExport = filteredSuggestions.map((suggestion, index) => ({
        'S.No': index + 1,
        'Name': suggestion.name || 'Anonymous',
        'Email': suggestion.email || '-',
        'Mobile': suggestion.mobile || '-',
        'Local Level': suggestion.localLevel || '-',
        'Ward': suggestion.ward || '-',
        'Street': suggestion.street || '-',
        'Problem': suggestion.problem || '-',
        'Solution': suggestion.solution || '-',
        'Priorities': Array.isArray(suggestion.priorities) ? suggestion.priorities.join(', ') : '-',
        'Policy Suggestion': suggestion.policySuggestion || '-',
        'Youth Program': suggestion.youthProgram || '-',
        'Expectation': suggestion.expectation || '-',
        'Five Year Plan': suggestion.fiveYearPlan || '-',
        'Extra Suggestion': suggestion.extraSuggestion || '-',
        'Submitted Date': formatDate(suggestion.createdAt)
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 6 },  // S.No
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Mobile
        { wch: 20 }, // Local Level
        { wch: 8 },  // Ward
        { wch: 20 }, // Street
        { wch: 40 }, // Problem
        { wch: 40 }, // Solution
        { wch: 30 }, // Priorities
        { wch: 40 }, // Policy Suggestion
        { wch: 30 }, // Youth Program
        { wch: 30 }, // Expectation
        { wch: 40 }, // Five Year Plan
        { wch: 30 }, // Extra Suggestion
        { wch: 20 }  // Submitted Date
      ];
      ws['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Suggestions');

      // Generate filename with current date
      const filename = `suggestions-export-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [filteredSuggestions, formatDate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Suggestions</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="suggestions-container">
      {/* Header */}
      <div className="suggestions-header mb-4">
        <div className="header-content">
          <div>
            <h1 className="h2 mb-1">Suggestions Management</h1>
            <p className="text-muted mb-0">
              {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, problem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <button
                className="btn export-excel-btn w-100"
                onClick={handleExport}
                disabled={exporting || filteredSuggestions.length === 0}
                title="Export to Excel"
              >
                {exporting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="me-2" size={16} />
                    <span>Export to Excel</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="row mt-4 g-3">
            <div className="col-6 col-md-4 col-lg-3">
              <div className="stat-card">
                <div className="stat-content">
                  <div>
                    <h6 className="stat-label">Total</h6>
                    <h3 className="stat-value">{suggestions.length}</h3>
                  </div>
                  <BarChart className="stat-icon text-primary" size={28} />
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-3">
              <div className="stat-card">
                <div className="stat-content">
                  <div>
                    <h6 className="stat-label">Filtered</h6>
                    <h3 className="stat-value">{filteredSuggestions.length}</h3>
                  </div>
                  <Filter className="stat-icon text-info" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Table View */}
      <div className="card border-0 shadow-sm table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>
                  <button
                    className="btn btn-link p-0 border-0 text-decoration-none d-flex align-items-center sort-btn"
                    onClick={() => handleSort('name')}
                  >
                    Submitter
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="contact-col">Contact</th>
                <th className="date-col">
                  <button
                    className="btn btn-link p-0 border-0 text-decoration-none d-flex align-items-center sort-btn"
                    onClick={() => handleSort('createdAt')}
                  >
                    Submitted
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="problem-col">Problem</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((suggestion) => (
                <React.Fragment key={suggestion._id}>
                  <tr
                    className={expandedRow === suggestion._id ? 'table-active expanded-row' : ''}
                    onClick={() => setExpandedRow(expandedRow === suggestion._id ? null : suggestion._id)}
                  >
                    <td>
                      <div className="user-info">
                        <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle">
                          <User size={14} />
                        </div>
                        <div className="user-details">
                          <strong className="user-name">{suggestion.name || 'Anonymous'}</strong>
                          <div className="user-email">{suggestion.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="contact-col">
                      <div className="contact-info">
                        {suggestion.mobile && (
                          <div className="contact-item">
                            <Phone size={12} />
                            <span>{suggestion.mobile}</span>
                          </div>
                        )}
                        {suggestion.localLevel && (
                          <div className="contact-item">
                            <MapPin size={12} />
                            <span>{suggestion.localLevel}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="date-col">
                      <div className="date-info">
                        {formatDate(suggestion.createdAt)}
                      </div>
                    </td>
                    <td className="problem-col">
                      <div className="problem-text">
                        {suggestion.problem || '-'}
                      </div>
                    </td>
                    <td className="actions-col" onClick={e => e.stopPropagation()}>
                      <button
                        className="btn btn-sm btn-primary"
                        title="View Details"
                        onClick={() => setExpandedRow(expandedRow === suggestion._id ? null : suggestion._id)}
                      >
                        <Eye size={14} className="me-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                  {expandedRow === suggestion._id && (
                    <tr className="expanded-details">
                      <td colSpan="5" className="bg-light">
                        <div className="details-content">
                          <div className="row g-3">
                            <div className="col-12 col-lg-8">
                              <div className="detail-section">
                                <h6 className="detail-title">Problem Details</h6>
                                <p className="detail-text">{suggestion.problem || '-'}</p>
                              </div>

                              <div className="detail-section">
                                <h6 className="detail-title">Suggested Solution</h6>
                                <p className="detail-text">{suggestion.solution || '-'}</p>
                              </div>

                              {suggestion.policySuggestion && (
                                <div className="detail-section">
                                  <h6 className="detail-title">Policy Suggestion</h6>
                                  <p className="detail-text">{suggestion.policySuggestion}</p>
                                </div>
                              )}
                            </div>
                            <div className="col-12 col-lg-4">
                              <div className="info-card">
                                <h6 className="info-title">Additional Information</h6>
                                <dl className="info-list">
                                  <dt>Local Level</dt>
                                  <dd>{suggestion.localLevel || '-'}</dd>

                                  <dt>Street/Ward</dt>
                                  <dd>{suggestion.street || '-'} {suggestion.ward ? `Ward ${suggestion.ward}` : ''}</dd>

                                  <dt>Expectation</dt>
                                  <dd>{suggestion.expectation || '-'}</dd>

                                  <dt>5-Year Plan</dt>
                                  <dd>{suggestion.fiveYearPlan || '-'}</dd>

                                  <dt>Youth Program</dt>
                                  <dd>{suggestion.youthProgram || '-'}</dd>

                                  {suggestion.priorities && suggestion.priorities.length > 0 && (
                                    <>
                                      <dt>Priorities</dt>
                                      <dd>
                                        <div className="priorities-list">
                                          {suggestion.priorities.map((priority, idx) => (
                                            <span key={idx} className="badge bg-info">
                                              {priority}
                                            </span>
                                          ))}
                                        </div>
                                      </dd>
                                    </>
                                  )}
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-3">📝</div>
            <h4>No suggestions found</h4>
            <p className="text-muted">
              {searchTerm
                ? 'Try adjusting your search or filter criteria'
                : 'No suggestions have been submitted yet'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredSuggestions.length > 0 && (
          <div className="card-footer border-top d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSuggestions.length)} of {filteredSuggestions.length} entries
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm w-auto"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(1)}>«</button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
                  </li>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(totalPages)}>»</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestion;