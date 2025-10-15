import React, { useState, useEffect } from 'react';
import { useAppContext } from './contexts/AppContext';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { PropertiesScreen } from './screens/PropertiesScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ClientDetailScreen } from './screens/ClientDetailScreen';
import { PropertyDetailScreen } from './screens/PropertyDetailScreen';
import { Icon } from './components/common/Icon';
import { Client, ClientStatus, PropertyType, Intent, Property, PropertyCategory, Furnishing, ClientRequirement, ClientLocationPreference, FollowUp } from './types';
import { CLIENT_STATUS_OPTIONS, CANCEL_REASONS, KOLKATA_LOCATIONS, PROPERTY_CATEGORY_OPTIONS, PROPERTY_TYPE_OPTIONS, FURNISHING_OPTIONS, INTENT_OPTIONS, CONFIGURATION_OPTIONS } from './constants';
import { LoginScreen } from './screens/LoginScreen';

// --- Reusable Form Components ---
const FormField: React.FC<{label: string, error?: string, required?: boolean, children: React.ReactNode, className?: string}> = ({ label, error, required, children, className}) => (
    <div className={className}>
       <label className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
       {children}
       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
   </div>
);

const TextInput: React.FC<{value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, error?: boolean}> = 
({value, onChange, placeholder, type = 'text', error}) => (
   <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`} />
);

const SelectInput: React.FC<{value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error?: boolean, disabled?: boolean, children: React.ReactNode}> = 
({value, onChange, error, disabled, children}) => (
    <select value={value} onChange={onChange} disabled={disabled} className={`mt-1 block w-full p-2 border rounded-md shadow-sm bg-white ${error ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}>
       {children}
    </select>
);


// --- Add Client Form Component ---
interface ClientFormProps {
    onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onClose }) => {
    const { addClient, agent } = useAppContext();
    const [step, setStep] = useState(1);
    
    // Step 1 State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [source, setSource] = useState('');
    const [status, setStatus] = useState<ClientStatus>(ClientStatus.New);
    const [cancelReason, setCancelReason] = useState('');
    
    // Step 2 State
    const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.Residential);
    const [intent, setIntent] = useState<Intent>(Intent.Buy);
    const [configurations, setConfigurations] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [minSize, setMinSize] = useState('');
    const [maxSize, setMaxSize] = useState('');
    const [locationPreferences, setLocationPreferences] = useState<ClientLocationPreference[]>([]);
    const [otherLocationTexts, setOtherLocationTexts] = useState<{[key: string]: string}>({});

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateStep1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!phone.trim()) newErrors.phone = 'Phone number is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    }

    const handleConfigurationChange = (config: string) => {
        setConfigurations(prev => 
            prev.includes(config) 
                ? prev.filter(c => c !== config) 
                : [...prev, config]
        );
    };

    const addLocationPreference = () => {
        setLocationPreferences(prev => [...prev, {id: `loc_${Date.now()}`, mainLocation: '', subLocations: []}]);
    };

    const removeLocationPreference = (id: string) => {
        setLocationPreferences(prev => prev.filter(p => p.id !== id));
        setOtherLocationTexts(prev => {
            const newTexts = {...prev};
            delete newTexts[id];
            return newTexts;
        })
    };

    const handleMainLocationChange = (id: string, newMainLocation: string) => {
        setLocationPreferences(prev => prev.map(p => p.id === id ? {...p, mainLocation: newMainLocation, subLocations: []} : p));
    };

    const handleSubLocationChange = (id: string, subLocation: string) => {
        setLocationPreferences(prev => prev.map(p => {
            if (p.id === id) {
                const newSubLocations = p.subLocations.includes(subLocation)
                    ? p.subLocations.filter(s => s !== subLocation)
                    : [...p.subLocations, subLocation];
                return {...p, subLocations: newSubLocations};
            }
            return p;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const processedLocations = locationPreferences.map(pref => {
            const newSubLocations = pref.subLocations.filter(s => s !== 'Other');
            const otherText = otherLocationTexts[pref.id];
            if (pref.subLocations.includes('Other') && otherText && otherText.trim()) {
                newSubLocations.push(otherText.trim());
            }
            return { ...pref, subLocations: newSubLocations };
        }).filter(pref => pref.mainLocation && pref.subLocations.length > 0);

        const newRequirement: ClientRequirement = {
            id: `req_${Date.now()}`,
            propertyType,
            intent,
            configurations,
            minBudget: parseFloat(minBudget) || 0,
            maxBudget: parseFloat(maxBudget) || 0,
            minSize: parseFloat(minSize) || 0,
            maxSize: parseFloat(maxSize) || 0,
            locations: processedLocations,
        };

        const newClient: Client = {
            id: `client_${Date.now()}`,
            agentId: agent.id,
            name, phone, email, source, status,
            cancelReason: status === ClientStatus.Cancelled ? cancelReason : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            requirement: newRequirement,
        };

        addClient(newClient);
        onClose();
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Client</h2>
            <p className="text-gray-500 mb-6">Step {step} of 2: {step === 1 ? 'Contact Details' : 'Property Requirements'}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <>
                        <FormField label="Name" required error={errors.name}>
                            <TextInput value={name} onChange={e => setName(e.target.value)} error={!!errors.name}/>
                        </FormField>
                        <FormField label="Phone" required error={errors.phone}>
                             <TextInput type="tel" value={phone} onChange={e => setPhone(e.target.value)} error={!!errors.phone}/>
                        </FormField>
                        <FormField label="Email">
                             <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FormField>
                        <FormField label="Source">
                            <TextInput value={source} onChange={e => setSource(e.target.value)} />
                        </FormField>
                        <FormField label="Status">
                            <SelectInput value={status} onChange={e => setStatus(e.target.value as ClientStatus)}>
                                {CLIENT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </SelectInput>
                        </FormField>
                        {status === ClientStatus.Cancelled && (
                            <FormField label="Cancel Reason">
                                <SelectInput value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                                    <option value="">Select a reason</option>
                                    {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </SelectInput>
                            </FormField>
                        )}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
                            <button type="button" onClick={handleNext} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold">Next</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Property Type">
                                <SelectInput value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)}>
                                    {PROPERTY_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                </SelectInput>
                            </FormField>
                             <FormField label="Intent">
                                <SelectInput value={intent} onChange={e => setIntent(e.target.value as Intent)}>
                                    {INTENT_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                                </SelectInput>
                            </FormField>
                        </div>
                        <FormField label="Configurations">
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {CONFIGURATION_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center space-x-2 p-2 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-primary">
                                        <input type="checkbox" checked={configurations.includes(opt)} onChange={() => handleConfigurationChange(opt)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        <span className="text-sm text-gray-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </FormField>
                         <FormField label="Budget Range (₹)">
                            <div className="flex items-center space-x-2 mt-1">
                                <TextInput type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="Min Budget" />
                                <span className="text-gray-500">-</span>
                                <TextInput type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="Max Budget" />
                            </div>
                        </FormField>
                        <FormField label="Size Range (sq.ft.)">
                            <div className="flex items-center space-x-2 mt-1">
                                <TextInput type="number" value={minSize} onChange={e => setMinSize(e.target.value)} placeholder="Min Size" />
                                <span className="text-gray-500">-</span>
                                <TextInput type="number" value={maxSize} onChange={e => setMaxSize(e.target.value)} placeholder="Max Size" />
                            </div>
                        </FormField>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Location Preferences</h3>
                            {locationPreferences.map((pref) => (
                                <div key={pref.id} className="p-3 border rounded-lg space-y-3 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                         <SelectInput value={pref.mainLocation} onChange={e => handleMainLocationChange(pref.id, e.target.value)}>
                                            <option value="">Select Main Location</option>
                                            {Object.keys(KOLKATA_LOCATIONS).sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                        </SelectInput>
                                        <button type="button" onClick={() => removeLocationPreference(pref.id)} className="ml-2 p-1 text-red-500 hover:text-red-700">
                                            <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-5 h-5"/>
                                        </button>
                                    </div>
                                    {pref.mainLocation && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {(KOLKATA_LOCATIONS[pref.mainLocation as keyof typeof KOLKATA_LOCATIONS] || []).map(subLoc => (
                                                 <label key={subLoc} className="flex items-center space-x-2 p-2 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-primary text-sm">
                                                    <input type="checkbox" checked={pref.subLocations.includes(subLoc)} onChange={() => handleSubLocationChange(pref.id, subLoc)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                                    <span>{subLoc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                     {pref.subLocations.includes('Other') && (
                                        <TextInput value={otherLocationTexts[pref.id] || ''} onChange={(e) => setOtherLocationTexts(prev => ({...prev, [pref.id]: e.target.value}))} placeholder="Specify other location"/>
                                     )}
                                </div>
                            ))}
                             <button type="button" onClick={addLocationPreference} className="w-full text-sm font-semibold text-primary p-2 border-2 border-dashed rounded-lg hover:bg-blue-50">
                                + Add Location Preference
                            </button>
                        </div>

                        <div className="pt-4 flex justify-between">
                             <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Back</button>
                            <div>
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-800 rounded-md hover:bg-gray-200 font-semibold mr-2">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold">Add Client</button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

// --- Add Property Form Component ---
interface PropertyFormProps {
    onClose: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose }) => {
    const { addProperty, agent } = useAppContext();

    const [category, setCategory] = useState<PropertyCategory>(PropertyCategory.Resale);
    const [projectName, setProjectName] = useState('');
    const [mainLocation, setMainLocation] = useState('');
    const [subLocation, setSubLocation] = useState('');
    const [address, setAddress] = useState('');
    const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.Residential);
    const [bhk, setBhk] = useState('');
    const [size, setSize] = useState('');
    const [floor, setFloor] = useState('');
    const [furnishing, setFurnishing] = useState<Furnishing>(Furnishing.Unfurnished);
    const [parking, setParking] = useState('1');
    const [price, setPrice] = useState('');
    const [brokerage, setBrokerage] = useState('1');
    const [mapsLink, setMapsLink] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    useEffect(() => {
        setSubLocation('');
    }, [mainLocation]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!category) newErrors.category = 'Category is required.';
        if (!projectName.trim()) newErrors.projectName = 'Project name is required.';
        if (!mainLocation) newErrors.mainLocation = 'Main location is required.';
        if (!subLocation) newErrors.subLocation = 'Sub location is required.';
        if (!propertyType) newErrors.propertyType = 'Property type is required.';
        if (!bhk.trim()) newErrors.bhk = 'BHK/Configuration is required.';
        if (!size.trim() || isNaN(Number(size))) newErrors.size = 'A valid size is required.';
        if (!price.trim() || isNaN(Number(price))) newErrors.price = 'A valid price is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const newProperty: Property = {
            id: `prop_${Date.now()}`,
            agentId: agent.id,
            category,
            projectName,
            city: 'Kolkata',
            mainLocation,
            subLocation,
            addressText: address,
            propertyType,
            bhk,
            sizeSqft: parseFloat(size),
            floor,
            furnishing,
            parkingCount: parseInt(parking) || 0,
            price: parseFloat(price),
            brokeragePercent: parseFloat(brokerage) || 0,
            googleMapLink: mapsLink,
            mediaUri: mediaFile ? URL.createObjectURL(mediaFile) : `https://picsum.photos/seed/prop${Date.now()}/800/600`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        addProperty(newProperty);
        onClose();
    };
    
    const configLabel = propertyType === PropertyType.Commercial ? 'Configuration' : 'BHK';
    
    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Media (Image/Video)">
                    <input type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"/>
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Category" required error={errors.category}>
                        <SelectInput value={category} onChange={e => setCategory(e.target.value as PropertyCategory)} error={!!errors.category}>
                             {PROPERTY_CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </SelectInput>
                    </FormField>
                    <FormField label="Property Type" required error={errors.propertyType}>
                        <SelectInput value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)} error={!!errors.propertyType}>
                             {PROPERTY_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </SelectInput>
                    </FormField>
                </div>

                <FormField label="Project Name" required error={errors.projectName}>
                    <TextInput value={projectName} onChange={e => setProjectName(e.target.value)} error={!!errors.projectName} />
                </FormField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField label="Main Location" required error={errors.mainLocation}>
                        <SelectInput value={mainLocation} onChange={e => setMainLocation(e.target.value)} error={!!errors.mainLocation}>
                             <option value="">Select Main Location</option>
                             {Object.keys(KOLKATA_LOCATIONS).sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </SelectInput>
                    </FormField>
                    <FormField label="Sub Location" required error={errors.subLocation}>
                        <SelectInput value={subLocation} onChange={e => setSubLocation(e.target.value)} disabled={!mainLocation} error={!!errors.subLocation}>
                             <option value="">Select Sub Location</option>
                              {mainLocation && KOLKATA_LOCATIONS[mainLocation as keyof typeof KOLKATA_LOCATIONS].sort().map(subLoc => <option key={subLoc} value={subLoc}>{subLoc}</option>)}
                        </SelectInput>
                    </FormField>
                </div>
                
                 <FormField label="Address">
                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                </FormField>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField label={configLabel} required error={errors.bhk}>
                         <TextInput value={bhk} onChange={e => setBhk(e.target.value)} error={!!errors.bhk} placeholder={propertyType === PropertyType.Residential ? "e.g., 3 BHK" : "e.g., Office, Shop"}/>
                    </FormField>
                    <FormField label="Size (sq.ft.)" required error={errors.size}>
                        <TextInput value={size} onChange={e => setSize(e.target.value)} type="number" error={!!errors.size} />
                    </FormField>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField label="Floor">
                         <TextInput value={floor} onChange={e => setFloor(e.target.value)} placeholder="e.g., 1st (out of G+4)"/>
                    </FormField>
                     <FormField label="Furnishing">
                         <SelectInput value={furnishing} onChange={e => setFurnishing(e.target.value as Furnishing)}>
                             {FURNISHING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                         </SelectInput>
                    </FormField>
                </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Price (₹)" required error={errors.price}>
                        <TextInput value={price} onChange={e => setPrice(e.target.value)} type="number" error={!!errors.price} />
                    </FormField>
                    <FormField label="Parking Count">
                        <TextInput value={parking} onChange={e => setParking(e.target.value)} type="number" />
                    </FormField>
                </div>

                <FormField label="Brokerage (%)">
                    <TextInput value={brokerage} onChange={e => setBrokerage(e.target.value)} type="number" />
                </FormField>
                
                 <FormField label="Google Maps Link">
                    <TextInput value={mapsLink} onChange={e => setMapsLink(e.target.value)} type="url" placeholder="https://maps.app.goo.gl/..." />
                </FormField>

                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-emerald-600 font-semibold">Add Property</button>
                </div>
            </form>
        </div>
    );
};

// --- Add Follow-up Form Component ---
interface FollowUpFormProps {
    client: Client;
    onClose: () => void;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ client, onClose }) => {
    const { addFollowUp } = useAppContext();
    const [note, setNote] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueTime, setDueTime] = useState('10:00');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) {
            setError('Note cannot be empty.');
            return;
        }

        const dueAt = new Date(`${dueDate}T${dueTime}`).toISOString();

        const newFollowUp: FollowUp = {
            id: `fu_${Date.now()}`,
            clientId: client.id,
            dueAt,
            note,
            isCompleted: false,
        };

        addFollowUp(newFollowUp);
        onClose();
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Add Follow-up</h2>
            <p className="text-gray-600 mb-6">For: <span className="font-semibold">{client.name}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Note" required error={error}>
                    <textarea
                        value={note}
                        onChange={e => {
                            setNote(e.target.value);
                            if(error) setError('');
                        }}
                        rows={4}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., Call to confirm site visit..."
                    />
                </FormField>
                <FormField label="Due Date & Time">
                    <div className="flex items-center space-x-2 mt-1">
                        <TextInput type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        <TextInput type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} />
                    </div>
                </FormField>

                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold">Add Follow-up</button>
                </div>
            </form>
        </div>
    );
};

// --- Edit Profile Form Component ---
interface EditProfileFormProps {
    onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose }) => {
    const { agent, updateAgent } = useAppContext();
    const [name, setName] = useState(agent.name);
    const [phone, setPhone] = useState(agent.phone);
    const [email, setEmail] = useState(agent.email);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!phone.trim()) newErrors.phone = 'Phone number is required.';
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'A valid email is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        updateAgent({
            ...agent,
            name,
            phone,
            email
        });
        onClose();
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Name" required error={errors.name}>
                    <TextInput value={name} onChange={e => setName(e.target.value)} error={!!errors.name} />
                </FormField>
                <FormField label="Phone" required error={errors.phone}>
                    <TextInput type="tel" value={phone} onChange={e => setPhone(e.target.value)} error={!!errors.phone} />
                </FormField>
                <FormField label="Email" required error={errors.email}>
                    <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} error={!!errors.email} />
                </FormField>

                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold">Save Changes</button>
                </div>
            </form>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
    const { currentScreen, modalView, setModalView, isAuthenticated } = useAppContext();
    const [isFabOpen, setIsFabOpen] = useState(false);

    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case 'dashboard':
                return <DashboardScreen />;
            case 'clients':
                return <ClientsScreen />;
            case 'properties':
                return <PropertiesScreen />;
            case 'schedule':
                return <ScheduleScreen />;
            case 'profile':
                return <ProfileScreen />;
            default:
                return <DashboardScreen />;
        }
    };

    const renderModalContent = () => {
        if (modalView.type === 'none') return null;

        if(modalView.type === 'add-client') return <ClientForm onClose={() => setModalView({ type: 'none' })} />;
        if(modalView.type === 'add-property') return <PropertyForm onClose={() => setModalView({ type: 'none' })} />;
        if(modalView.type === 'view-client') return <ClientDetailScreen client={modalView.client}/>;
        if(modalView.type === 'view-property') return <PropertyDetailScreen property={modalView.property}/>;
        if(modalView.type === 'add-follow-up') return <FollowUpForm client={modalView.client} onClose={() => setModalView({ type: 'none' })} />;
        if(modalView.type === 'edit-profile') return <EditProfileForm onClose={() => setModalView({ type: 'none' })} />;
        
        const unimplementedMessages: { [key: string]: string } = {
            'edit-client': "Edit Client form not implemented.",
            'edit-property': "Edit Property form not implemented.",
        };

        if (modalView.type in unimplementedMessages) {
             return <div className="p-8 text-center text-gray-500">{unimplementedMessages[modalView.type as keyof typeof unimplementedMessages]}</div>;
        }

        return <div>Modal type not implemented</div>;
    };
    
    const FabButton: React.FC<{onClick: () => void, icon: string, label:string, className: string}> = ({onClick, icon, label, className}) => (
        <div className="flex items-center justify-end space-x-2">
            <span className="bg-white text-sm font-semibold p-2 rounded-md shadow-md">{label}</span>
            <button
                onClick={onClick}
                className={`w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center ${className}`}
            >
                <Icon path={icon} className="w-7 h-7" />
            </button>
        </div>
    );


    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="pb-20">
              <main className="max-w-4xl mx-auto">
                  {renderScreen()}
              </main>
              
               {/* FAB */}
               <div className="fixed bottom-20 right-4 z-30">
                  <div className="relative flex flex-col items-end space-y-3">
                      {isFabOpen && (
                          <>
                             <FabButton 
                                  onClick={() => { setModalView({ type: 'add-property' }); setIsFabOpen(false); }}
                                  icon="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-1.5M6 11.25H4.5m15 0h-1.5m-15 0H12m-6 0v-1.5m6 1.5v-1.5"
                                  label="Add Property"
                                  className="bg-secondary"
                             />
                              <FabButton 
                                  onClick={() => { setModalView({ type: 'add-client' }); setIsFabOpen(false); }}
                                  icon="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                                  label="Add Client"
                                  className="bg-accent"
                             />
                          </>
                      )}
                       <button
                          onClick={() => setIsFabOpen(!isFabOpen)}
                          className={`w-16 h-16 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transform transition-transform duration-200 ${isFabOpen ? 'rotate-45' : ''}`}
                      >
                          <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-8 h-8" />
                      </button>
                  </div>
              </div>

               {/* Modal */}
              {modalView.type !== 'none' && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={() => setModalView({ type: 'none' })}>
                      <div className="fixed inset-0 bg-gray-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                           <div className="absolute top-0 right-0 p-2 z-20">
                                  <button onClick={() => setModalView({ type: 'none' })} className="p-2 rounded-full hover:bg-gray-200">
                                      <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6 text-gray-700" />
                                  </button>
                            </div>
                          <div className="max-w-4xl mx-auto pt-8">
                              {renderModalContent()}
                          </div>
                      </div>
                  </div>
              )}
            </div>
            <BottomNav />
        </div>
    );
};

export default App;