import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Property, PropertyCategory, PropertyType } from '../types';
import { Icon } from '../components/common/Icon';
import { formatCurrency } from '../utils/helpers';
import { KOLKATA_LOCATIONS, PROPERTY_TYPE_OPTIONS } from '../constants';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const { setModalView } = useAppContext();
    return (
        <div onClick={() => setModalView({ type: 'view-property', property })} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <img src={property.mediaUri} alt={property.projectName} className="w-full h-40 object-cover" />
            <div className="p-4">
                <p className="font-bold text-lg text-gray-800">{property.projectName}</p>
                <p className="text-sm text-gray-500">{property.subLocation}, {property.mainLocation}</p>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {property.bhk}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const PropertiesScreen: React.FC = () => {
    const { properties } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<PropertyCategory | 'All'>('All');
    
    // State for new filters
    const [showFilters, setShowFilters] = useState(false);
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<'All' | PropertyType>('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bhkFilter, setBhkFilter] = useState('All');
    const [mainLocationFilter, setMainLocationFilter] = useState('All');
    const [subLocationFilter, setSubLocationFilter] = useState('All');

    // Dynamically generate BHK/Configuration options based on selected property type
    const bhkOptions = useMemo(() => {
        let relevantProperties = properties;
        if (propertyTypeFilter !== 'All') {
            relevantProperties = properties.filter(p => p.propertyType === propertyTypeFilter);
        }
        const uniqueBhks = new Set(relevantProperties.map(p => p.bhk));
        return ['All', ...Array.from(uniqueBhks).sort()];
    }, [properties, propertyTypeFilter]);

    // Reset sub-location filter when main location changes
    useEffect(() => {
        setSubLocationFilter('All');
    }, [mainLocationFilter]);

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesSearch = prop.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.mainLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prop.subLocation.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === 'All' || prop.category === activeTab;

            // New filter logic
            const matchesPropertyType = propertyTypeFilter === 'All' || prop.propertyType === propertyTypeFilter;
            
            const minPriceNum = parseFloat(minPrice);
            const maxPriceNum = parseFloat(maxPrice);
            const matchesMinPrice = !minPrice || isNaN(minPriceNum) || prop.price >= minPriceNum;
            const matchesMaxPrice = !maxPrice || isNaN(maxPriceNum) || prop.price <= maxPriceNum;
            
            const matchesBhk = bhkFilter === 'All' || prop.bhk === bhkFilter;
            
            const matchesMainLocation = mainLocationFilter === 'All' || prop.mainLocation === mainLocationFilter;
            const matchesSubLocation = subLocationFilter === 'All' || prop.subLocation === subLocationFilter;

            return matchesSearch && matchesTab && matchesPropertyType && matchesMinPrice && matchesMaxPrice && matchesBhk && matchesMainLocation && matchesSubLocation;
        });
    }, [properties, searchTerm, activeTab, propertyTypeFilter, minPrice, maxPrice, bhkFilter, mainLocationFilter, subLocationFilter]);
    
    const TabButton:React.FC<{tab: PropertyCategory | 'All', label: string}> = ({tab, label}) => (
         <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
        >
            {label}
        </button>
    );

    const configLabel = propertyTypeFilter === PropertyType.Commercial ? 'Configuration' : 'BHK';

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
            <div className="sticky top-0 bg-gray-50 py-2 z-10">
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder="Search by project or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                 <div className="flex space-x-2">
                    <TabButton tab="All" label="All" />
                    <TabButton tab={PropertyCategory.Resale} label="Resale" />
                    <TabButton tab={PropertyCategory.NewProject} label="New Projects" />
                </div>
                
                <div className="mt-2">
                    <button onClick={() => setShowFilters(!showFilters)} className="w-full flex justify-between items-center p-2 border rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition">
                        <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                        <Icon path={showFilters ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"} className="w-5 h-5"/>
                    </button>
                </div>

                {showFilters && (
                    <div className="p-4 bg-white rounded-lg border mt-2 space-y-4 animate-fade-in-down">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                                <select value={propertyTypeFilter} onChange={e => setPropertyTypeFilter(e.target.value as any)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                                    <option value="All">All Types</option>
                                    {PROPERTY_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{configLabel}</label>
                                <select value={bhkFilter} onChange={e => setBhkFilter(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                                    {bhkOptions.map(bhk => <option key={bhk} value={bhk}>{bhk}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price Range</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full p-2 border rounded-md border-gray-300" />
                                <span className="text-gray-500">-</span>
                                <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full p-2 border rounded-md border-gray-300" />
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Main Location</label>
                                <select value={mainLocationFilter} onChange={e => setMainLocationFilter(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                                    <option value="All">All Main Locations</option>
                                    {Object.keys(KOLKATA_LOCATIONS).sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Sub Location</label>
                                <select value={subLocationFilter} onChange={e => setSubLocationFilter(e.target.value)} disabled={mainLocationFilter === 'All'} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100">
                                    <option value="All">All Sub Locations</option>
                                    {mainLocationFilter !== 'All' && KOLKATA_LOCATIONS[mainLocationFilter as keyof typeof KOLKATA_LOCATIONS].sort().map(subLoc => <option key={subLoc} value={subLoc}>{subLoc}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)
                ) : (
                    <p className="text-center text-gray-500 pt-8 col-span-2">No properties found with the selected filters.</p>
                )}
            </div>
        </div>
    );
};
