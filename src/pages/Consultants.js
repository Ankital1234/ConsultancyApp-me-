import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Consultants(){
  // Static demo consultants
  const staticData = [
    {
      name: 'Aarav Mehta',
      role: 'Strategy Consultant',
      summary: '10+ years helping SMBs scale through market entry and pricing strategies.',
      tags: ['Growth', 'Pricing', 'Go-to-Market'],
      specialty: 'Strategy',
      type: 'demo'
    },
    {
      name: 'Riya Sharma',
      role: 'Technology Consultant',
      summary: 'Cloud modernization and AI adoption for faster, reliable delivery.',
      tags: ['Cloud', 'AI/ML', 'DevOps'],
      specialty: 'Technology',
      type: 'demo'
    },
    {
      name: 'Kabir Singh',
      role: 'Financial Advisory',
      summary: 'Budget planning, valuations, and fundraising support for startups.',
      tags: ['Valuation', 'Fundraising', 'FP&A'],
      specialty: 'Finance',
      type: 'demo'
    }
  ];

  const [data, setData] = useState(staticData);
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Load completed consultant profiles from localStorage
    const loadConsultantProfiles = () => {
      const savedProfiles = [];
      
      // Check for completed profiles in localStorage
      const profileStatus = localStorage.getItem('profileStatus');
      const isApproved = localStorage.getItem('profileApproved');
      const savedProfile = localStorage.getItem('consultantCompleteProfile');
      
      if (profileStatus === 'approved' && savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          
          // Transform profile data to match consultant card format
          const consultantProfile = {
            id: profileData.id || 'profile-' + Date.now(),
            name: profileData.displayName || 'Consultant',
            role: profileData.domain || 'Professional Consultant',
            summary: profileData.bio || 'Experienced professional offering expert consulting services.',
            tags: generateTagsFromProfile(profileData),
            specialty: mapDomainToSpecialty(profileData.domain),
            type: 'live',
            profileData: profileData,
            hourlyRate: profileData.hourlyRate || '$100/hour',
            experience: profileData.experience || '5+ years',
            linkedinProfile: profileData.linkedinProfile || '',
            availableDays: profileData.availableDays || [],
            timeSlots: profileData.timeSlots || []
          };
          
          savedProfiles.push(consultantProfile);
        } catch (error) {
          console.error('Error parsing consultant profile:', error);
        }
      }
      
      // Combine static data with live profiles
      setData([...savedProfiles, ...staticData]);
    };

    loadConsultantProfiles();
  }, []);

  // Helper function to generate tags from profile data
  const generateTagsFromProfile = (profileData) => {
    const tags = [];
    
    // Add domain-specific tags
    if (profileData.domain) {
      if (profileData.domain.toLowerCase().includes('business')) tags.push('Business Strategy');
      if (profileData.domain.toLowerCase().includes('technology')) tags.push('Technology');
      if (profileData.domain.toLowerCase().includes('marketing')) tags.push('Marketing');
      if (profileData.domain.toLowerCase().includes('finance')) tags.push('Finance');
      if (profileData.domain.toLowerCase().includes('hr')) tags.push('HR');
    }
    
    // Add experience-based tags
    if (profileData.experience) {
      if (profileData.experience.includes('5+')) tags.push('Experienced');
      if (profileData.experience.includes('10+')) tags.push('Senior Expert');
    }
    
    // Add default tags if none generated
    if (tags.length === 0) {
      tags.push('Consulting', 'Expert Advice');
    }
    
    return tags.slice(0, 4); // Limit to 4 tags
  };

  // Helper function to map domain to specialty
  const mapDomainToSpecialty = (domain) => {
    if (!domain) return 'Strategy';
    
    const domainLower = domain.toLowerCase();
    if (domainLower.includes('business') || domainLower.includes('strategy')) return 'Strategy';
    if (domainLower.includes('technology') || domainLower.includes('it')) return 'Technology';
    if (domainLower.includes('finance') || domainLower.includes('financial')) return 'Finance';
    if (domainLower.includes('marketing') || domainLower.includes('sales')) return 'Operations';
    if (domainLower.includes('hr') || domainLower.includes('human')) return 'Operations';
    
    return 'Strategy';
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const list = useMemo(() => {
    let items = data.filter(c => {
      const q = query.trim().toLowerCase();
      const matchesQuery = q === '' || [c.name, c.role, c.summary, ...c.tags].join(' ').toLowerCase().includes(q);
      const matchesSpec = specialty === 'All' || c.specialty === specialty;
      return matchesQuery && matchesSpec;
    });
    if (sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    return items;
  }, [data, query, specialty, sort]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-4">Consultants</h2>
      <p className="text-gray-600 mb-8">Discover experienced professionals across strategy, technology, finance, and operations. Browse featured profiles below and reach out to book a consultation.</p>

      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, skill, or industry"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={specialty}
          onChange={(e)=> setSpecialty(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">All Specialties</option>
          <option value="Strategy">Strategy</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
        <select
          value={sort}
          onChange={(e)=> setSort(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="name">Sort: Name (A–Z)</option>
        </select>
        <button onClick={()=>{ setQuery(''); setSpecialty('All'); setSort('name'); }} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Reset</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c, i) => (
          <div key={i} className={`group border rounded-lg p-5 hover:shadow-lg transition bg-white hover:-translate-y-0.5 transform ${
            c.type === 'live' ? 'border-blue-200 bg-blue-50/30' : ''
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {c.type === 'live' && c.profileData?.profilePhoto ? (
                    (() => {
                      try {
                        return (
                          <img 
                            src={typeof c.profileData.profilePhoto === 'string' 
                              ? c.profileData.profilePhoto 
                              : URL.createObjectURL(c.profileData.profilePhoto)} 
                            alt={c.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
                          />
                        );
                      } catch (error) {
                        console.error('Error displaying profile photo:', error);
                        return (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    {c.type === 'live' && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Live Profile</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{c.role}</p>
                  {c.type === 'live' && c.experience && (
                    <p className="text-xs text-blue-600 mt-1">💼 {c.experience}</p>
                  )}
                </div>
              </div>
              {c.type === 'demo' && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">Featured</span>
              )}
            </div>
            
            <p className="mt-3 text-gray-700 text-sm">{c.summary}</p>
            
            {/* Additional info for live profiles */}
            {c.type === 'live' && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-blue-600 font-medium">💰 {c.hourlyRate}</span>
                {c.availableDays && c.availableDays.length > 0 && (
                  <span className="text-green-600">✓ Available</span>
                )}
              </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-2">
              {c.tags.map(t => (
                <button
                  key={t}
                  onClick={()=> setQuery(t)}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => { setSelected(c); setShowModal(true); }}
                className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                View Profile
              </button>
              <button
                onClick={() => { 
                  if (c.type === 'live') {
                    setToast('Redirecting to booking page...');
                    setTimeout(() => {
                      window.location.href = '/user-signup';
                    }, 1000);
                  } else {
                    setSelected(c); setShowModal(true);
                  }
                }}
                className={`flex-1 px-3 py-2 rounded-lg hover:opacity-90 ${
                  c.type === 'live' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {c.type === 'live' ? 'Book Now' : 'Book Call'}
              </button>
            </div>
          </div>
        ))}
      </div>
    
      <div className="mt-10 text-center">
        <p className="text-gray-700">Are you a consultant? <a href="/consultant-register" className="text-blue-700 hover:underline">Join the network</a>.</p>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setShowModal(false)}></div>
          <div className="absolute inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-24 md:w-[560px] bg-white rounded-lg shadow-lg border animate-fade-in-up max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {/* Profile Photo in Modal */}
                  <div className="flex-shrink-0">
                    {selected.type === 'live' && selected.profileData?.profilePhoto ? (
                      (() => {
                        try {
                          return (
                            <img 
                              src={typeof selected.profileData.profilePhoto === 'string' 
                                ? selected.profileData.profilePhoto 
                                : URL.createObjectURL(selected.profileData.profilePhoto)} 
                              alt={selected.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
                            />
                          );
                        } catch (error) {
                          console.error('Error displaying profile photo in modal:', error);
                          return (
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-xl">
                                {selected.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-xl">
                          {selected.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{selected.name}</h3>
                      {selected.type === 'live' && (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Live Profile</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{selected.role}</p>
                    {selected.type === 'live' && selected.experience && (
                      <p className="text-xs text-blue-600 mt-1">💼 {selected.experience}</p>
                    )}
                  </div>
                </div>
                <button
                  aria-label="Close"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <p className="mt-4 text-gray-700">{selected.summary}</p>
              
              {/* Additional details for live profiles */}
              {selected.type === 'live' && (
                <div className="mt-4 space-y-3 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Hourly Rate:</span>
                    <span className="text-sm font-semibold text-blue-600">{selected.hourlyRate}</span>
                  </div>
                  {selected.availableDays && selected.availableDays.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Available Days:</span>
                      <span className="text-sm text-green-600">{selected.availableDays.join(', ')}</span>
                    </div>
                  )}
                  {selected.linkedinProfile && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                      <a 
                        href={selected.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{t}</span>
                ))}
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { 
                    setToast('Profile shared to your email.'); 
                    setTimeout(()=> setToast(''), 2500); 
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Share Profile
                </button>
                <button
                  onClick={() => { 
                    if (selected.type === 'live') {
                      setToast('Redirecting to booking page...');
                      setTimeout(() => {
                        window.location.href = '/user-signup';
                      }, 1000);
                    } else {
                      setToast('Call request sent. We will contact you shortly.'); 
                      setTimeout(()=> setToast(''), 2500); 
                      setShowModal(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg hover:opacity-90 ${
                    selected.type === 'live'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
                >
                  {selected.type === 'live' ? 'Book Session Now' : 'Request a Call'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
