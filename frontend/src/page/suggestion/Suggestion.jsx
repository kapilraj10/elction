import React, { useEffect, useState } from 'react';
import authService from '../../service/auth.service';
import * as Icons from 'react-bootstrap-icons';

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
import './Suggestions.css';

const BASE = import.meta.env.VITE_API_URL || '';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [expandedRow, setExpandedRow] = useState(null);

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

  useEffect(() => {
    let results = suggestions;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(suggestion =>
        suggestion.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.mobile?.includes(searchTerm) ||
        suggestion.problem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredSuggestions(results);
    setCurrentPage(1);
  }, [searchTerm, sortConfig, suggestions]);

  const formatDate = (iso) => {
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
  };

  // status removed - UI simplified

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSuggestions(currentItems.map(item => item._id));
    } else {
      setSelectedSuggestions([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedSuggestions(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`${action} selected items:`, selectedSuggestions);
    // Implement bulk actions here
    alert(`${action} action triggered for ${selectedSuggestions.length} items`);
  };

  const handleExport = () => {
    // Implement export functionality
    const dataStr = JSON.stringify(filteredSuggestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suggestions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // status update removed - backend no longer stores status

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuggestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Suggestions Management</h1>
          <p className="text-muted mb-0">
            {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleExport}>
            <Download className="me-2" size={16} />
            Export
          </button>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Bulk Actions
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => handleBulkAction('approve')}>Approve Selected</button></li>
              <li><button className="dropdown-item" onClick={() => handleBulkAction('reject')}>Reject Selected</button></li>
              <li><button className="dropdown-item" onClick={() => handleBulkAction('delete')}>Delete Selected</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search suggestions by name, email, problem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* status filter removed */}
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </button>
                <button
                  className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('card')}
                >
                  Card View
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="row mt-4 g-3">
            <div className="col-md-3">
              <div className="card border-0 bg-primary bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total</h6>
                      <h3 className="mb-0">{suggestions.length}</h3>
                    </div>
                    <BarChart className="text-primary" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Table View */}
      {viewMode === 'table' ? (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedSuggestions.length === currentItems.length && currentItems.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>
                    <button
                      className="btn btn-link p-0 border-0 text-decoration-none d-flex align-items-center"
                      onClick={() => handleSort('name')}
                    >
                      Submitter
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th>Contact</th>
                  <th>
                    <button
                      className="btn btn-link p-0 border-0 text-decoration-none d-flex align-items-center"
                      onClick={() => handleSort('createdAt')}
                    >
                      Submitted
                      {sortConfig.key === 'createdAt' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th>Problem</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((suggestion) => (
                  <React.Fragment key={suggestion._id}>
                    <tr
                      className={expandedRow === suggestion._id ? 'table-active' : ''}
                      onClick={() => setExpandedRow(expandedRow === suggestion._id ? null : suggestion._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedSuggestions.includes(suggestion._id)}
                          onChange={() => handleSelect(suggestion._id)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <User size={14} />
                          </div>
                          <div>
                            <strong>{suggestion.name || 'Anonymous'}</strong>
                            <div className="small text-muted">{suggestion.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {suggestion.mobile && (
                            <div className="d-flex align-items-center gap-1">
                              <Phone size={12} />
                              {suggestion.mobile}
                            </div>
                          )}
                          {suggestion.localLevel && (
                            <div className="d-flex align-items-center gap-1 mt-1">
                              <MapPin size={12} />
                              {suggestion.localLevel}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {formatDate(suggestion.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {suggestion.problem || '-'}
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="d-flex gap-2">
                          <div className="dropdown">
                            <button
                              className="btn btn-link p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.currentTarget.nextElementSibling?.classList.toggle('show');
                              }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            <div className="dropdown-menu">
                              <button className="dropdown-item text-danger">
                                <Trash2 size={14} className="me-2" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View Details"
                            onClick={() => setExpandedRow(expandedRow === suggestion._id ? null : suggestion._id)}
                          >
                            <Eye size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-warning" title="Edit">
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === suggestion._id && (
                      <tr>
                        <td colSpan="6" className="bg-light">
                          <div className="p-3">
                            <div className="row">
                              <div className="col-md-8">
                                <h6>Problem Details</h6>
                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                  {suggestion.problem || '-'}
                                </p>

                                <h6 className="mt-3">Suggested Solution</h6>
                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                  {suggestion.solution || '-'}
                                </p>

                                {suggestion.policySuggestion && (
                                  <>
                                    <h6 className="mt-3">Policy Suggestion</h6>
                                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                      {suggestion.policySuggestion}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="col-md-4">
                                <div className="card">
                                  <div className="card-body">
                                    <h6>Additional Information</h6>
                                    <dl className="mb-0">
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
                                            <div className="d-flex flex-wrap gap-1 mt-1">
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
      ) : (
        /* Card View */
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {currentItems.map((suggestion) => (
            <div key={suggestion._id} className="col">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{suggestion.name || 'Anonymous'}</h5>
                      <div className="small text-muted d-flex align-items-center">
                        <Mail size={12} className="me-1" />
                        {suggestion.email || 'No email'}
                      </div>
                    </div>
                    {/* status removed */}
                  </div>

                  <p className="card-text text-truncate" title={suggestion.problem}>
                    {suggestion.problem || 'No problem description'}
                  </p>

                  <div className="mt-3">
                    <div className="small text-muted mb-2">
                      <Calendar size={12} className="me-1" />
                      {formatDate(suggestion.createdAt)}
                    </div>
                    <div className="small text-muted">
                      <Phone size={12} className="me-1" />
                      {suggestion.mobile || 'No phone'}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                      <Eye size={14} className="me-1" /> View
                    </button>
                    <button className="btn btn-sm btn-outline-warning">
                      <Edit2 size={14} className="me-1" /> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <Trash2 size={14} className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestion;