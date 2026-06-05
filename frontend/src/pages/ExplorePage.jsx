import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipService } from '../services/api';
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
  HiOutlineFilter,
  HiOutlineSortDescending,
  HiOutlineSortAscending,
  HiOutlineChevronRight
} from 'react-icons/hi';

const DEPARTMENTS = ['All', 'CSE', 'ECE', 'ME', 'EE', 'BioTech', 'MBA', 'CE'];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'high', 'low'
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await internshipService.getAll();
      setInternships(res.data);
      // Extract unique locations
      const locs = [...new Set(res.data.map(i => i.location))].sort();
      setLocations(locs);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...internships];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.requiredSkills?.some(s => s.toLowerCase().includes(q))
      );
    }

    // Department filter
    if (department !== 'All') {
      result = result.filter(i => i.department === department);
    }

    // Location filter
    if (location !== 'All') {
      result = result.filter(i => i.location === location);
    }

    // Stipend sort
    if (sortOrder !== 'none') {
      result.sort((a, b) => {
        const getAmount = (s) => {
          const match = s?.match(/[\d,]+/);
          return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
        };
        const aAmt = getAmount(a.stipend);
        const bAmt = getAmount(b.stipend);
        return sortOrder === 'high' ? bAmt - aAmt : aAmt - bAmt;
      });
    }

    setFiltered(result);
  }, [internships, search, department, location, sortOrder]);

  const stats = {
    total: internships.length,
    departments: new Set(internships.map(i => i.department)).size,
    companies: new Set(internships.map(i => i.company)).size,
    locations: new Set(internships.map(i => i.location)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-dark-400">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Explore <span className="gradient-text">Internships</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Browse {stats.total} opportunities across {stats.departments} departments and {stats.locations} cities
          </p>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Internships', value: stats.total, icon: <HiOutlineBriefcase /> },
            { label: 'Companies', value: stats.companies, icon: <HiOutlineOfficeBuilding /> },
            { label: 'Departments', value: stats.departments, icon: <HiOutlineFilter /> },
            { label: 'Locations', value: stats.locations, icon: <HiOutlineLocationMarker /> }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center explore-stat-card">
              <div className="text-primary-400 text-xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-dark-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-5 mb-6">
          {/* Search Bar */}
          <div className="explore-search-wrapper mb-4">
            <HiOutlineSearch className="explore-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, or skill..."
              className="explore-search-input"
            />
            {search && (
              <button onClick={() => setSearch('')} className="explore-search-clear">✕</button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Department Tabs */}
            <div className="flex flex-wrap gap-2 flex-1">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  onClick={() => setDepartment(dept)}
                  className={`explore-tab ${department === dept ? 'explore-tab-active' : ''}`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Location Filter */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="explore-select"
              >
                <option value="All">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {/* Sort Toggle */}
              <button
                onClick={() => {
                  setSortOrder(prev => prev === 'none' ? 'high' : prev === 'high' ? 'low' : 'none');
                }}
                className={`explore-sort-btn ${sortOrder !== 'none' ? 'explore-sort-active' : ''}`}
                title={sortOrder === 'high' ? 'Highest stipend first' : sortOrder === 'low' ? 'Lowest stipend first' : 'Sort by stipend'}
              >
                {sortOrder === 'low' ? <HiOutlineSortAscending className="text-lg" /> : <HiOutlineSortDescending className="text-lg" />}
                <span className="text-xs">Stipend</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-dark-400 text-sm">
            Showing <span className="text-dark-200 font-semibold">{filtered.length}</span> internship{filtered.length !== 1 ? 's' : ''}
            {department !== 'All' && <span> in <span className="text-primary-400">{department}</span></span>}
            {location !== 'All' && <span> at <span className="text-primary-400">{location}</span></span>}
          </p>
          {(search || department !== 'All' || location !== 'All') && (
            <button
              onClick={() => { setSearch(''); setDepartment('All'); setLocation('All'); setSortOrder('none'); }}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((internship, index) => (
              <div
                key={internship._id}
                className="explore-card glass-card p-5 cursor-pointer"
                onClick={() => navigate(`/internship/${internship._id}`)}
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-dark-100 leading-snug">{internship.title}</h3>
                      <p className="text-primary-400 font-medium text-sm mt-0.5">{internship.company}</p>
                    </div>
                    <div className="explore-card-arrow">
                      <HiOutlineChevronRight className="text-lg" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-dark-400 text-sm mb-4 line-clamp-2">{internship.description}</p>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-dark-400">
                  <span className="flex items-center gap-1">
                    <HiOutlineLocationMarker className="text-primary-400" /> {internship.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineOfficeBuilding className="text-primary-400" /> {internship.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="text-primary-400" /> {internship.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineCurrencyRupee className="text-primary-400" /> {internship.stipend}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {internship.requiredSkills?.slice(0, 4).map((skill, i) => (
                    <span key={i} className="skill-badge text-xs">{skill}</span>
                  ))}
                  {internship.requiredSkills?.length > 4 && (
                    <span className="skill-badge text-xs" style={{ opacity: 0.6 }}>
                      +{internship.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <HiOutlineSearch className="text-5xl text-dark-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-300 mb-2">No Internships Found</h2>
            <p className="text-dark-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
