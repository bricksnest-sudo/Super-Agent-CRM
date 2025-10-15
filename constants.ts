
import { ClientStatus, PropertyType, Intent, Furnishing, PropertyCategory } from './types';

export const KOLKATA_LOCATIONS = {
  'Rajarhat': ['Chinar Park', 'Salua', 'Dasdrone', 'Reckjuani', 'Rajarhat Chowmatha', 'Rajarhat Main Road', 'Bishnupur', 'Patharghata', 'Other'],
  'New Town': ['Action Area 1', 'Action Area 2', 'Action Area 3', 'Narkelbagan', 'Ghuni', 'Mahisbathan', 'Jatragachi', 'Other'],
  'Salt Lake': ['Salt Lake Sector-1', 'Salt Lake Sector-2', 'Salt Lake Sector-3', 'Salt Lake Sector-V', 'Karunamoyee', 'Other'],
  'EM Bypass': ['Ruby Crossing', 'VIP Nagar', 'Kalikapur', 'Science City Area', 'Avishikta', 'Ajoy Nagar', 'Mukundapur', 'Other'],
  'Alipore': ['New Alipore', 'Alipore Road', 'Belvedere Road', 'Judges Court Road', 'Chetla', 'Burdwan Road', 'Other'],
  'Ballygunge': ['Ballygunge Phari', 'Ballygunge Place', 'Gariahat', 'Dover Lane', 'Sunny Park', 'Ekdalia', 'Mandeville Gardens', 'Other'],
  'Tollygunge': ['Tollygunge Metro Area', 'Siriti More', 'Karunamoyee', 'Naktala', 'Bansdroni', 'Ranikuthi', 'Kudghat', 'Other'],
  'Garia': ['Garia Station', 'Boral', 'Mahamayatala', 'Kavi Nazrul Metro', 'Patuli Township', 'Narendrapur', 'Kamalgazi', 'Other'],
  'Jadavpur': ['Jadavpur 8B', 'Sulekha More', 'Santoshpur', 'Baghajatin', 'Jadavpur University Area', 'Poddar Nagar', 'Other'],
  'Behala': ['Behala Chowrasta', 'Sakher Bazar', 'Parnasree Pally', 'Taratala', 'Behala Tram Depot', 'Barisha', 'Silpara', 'Other'],
  'Dum Dum': ['Dum Dum Cantonment', 'Nagerbazar', 'Motijheel', 'Gorabazar', 'Dum Dum Park', 'Jessore Road', 'Other'],
  'Baguiati': ['Kestopur', 'Teghoria', 'Joramandir', 'Baguiati VIP Road Crossing', 'Aswini Nagar', 'Other'],
  'Joka': ['IIM Joka Area', 'Joka Metro', 'Thakurpukur', 'Diamond Park', 'Pailan', 'Other'],
  'Howrah': ['Shibpur', 'Kadamtala', 'Bally', 'Salkia', 'Howrah Maidan', 'Belur', 'Liluah', 'Other'],
  'Uttarpara': ['Hindmotor', 'Makhla', 'Bhadrakali', 'Uttarpara Station Road', 'Other'],
};

export const CLIENT_STATUS_OPTIONS = Object.values(ClientStatus);
export const PROPERTY_TYPE_OPTIONS = Object.values(PropertyType);
export const INTENT_OPTIONS = Object.values(Intent);
export const CONFIGURATION_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Office', 'Shop'];
export const FURNISHING_OPTIONS = Object.values(Furnishing);
export const PROPERTY_CATEGORY_OPTIONS = Object.values(PropertyCategory);

export const CANCEL_REASONS = [
    'Budget Mismatch',
    'Location Mismatch',
    'No Response',
    'Chose Other Property',
    'Not Interested Anymore',
    'Other'
];
