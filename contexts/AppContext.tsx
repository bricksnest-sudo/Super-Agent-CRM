import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, Client, Property, FollowUp, Screen, ModalView, ClientStatus, PropertyType, Intent, PropertyCategory, Furnishing } from '../types';
import { MOCK_CLIENTS, MOCK_PROPERTIES, MOCK_FOLLOW_UPS } from '../utils/mockData';

interface AppContextType {
  agent: Agent;
  clients: Client[];
  properties: Property[];
  followUps: FollowUp[];
  currentScreen: Screen;
  modalView: ModalView;
  isAuthenticated: boolean;
  setCurrentScreen: (screen: Screen) => void;
  setModalView: (modal: ModalView) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  addFollowUp: (followUp: FollowUp) => void;
  updateFollowUp: (followUp: FollowUp) => void;
  updateAgent: (agent: Agent) => void;
  login: (emailOrPhone: string, pass: string) => boolean;
  logout: () => void;
  signup: (details: { name: string; email: string; phone: string; pass: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAgent: Agent = {
  id: 'agent1',
  name: 'Raj Sharma',
  phone: '+919876543210',
  email: 'raj.sharma@superagent.com'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent>(initialAgent);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [followUps, setFollowUps] = useState<FollowUp[]>(MOCK_FOLLOW_UPS);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [modalView, setModalView] = useState<ModalView>({ type: 'none' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const updateProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };
  
  const addFollowUp = (followUp: FollowUp) => {
    setFollowUps(prev => [...prev, followUp]);
  };

  const updateFollowUp = (updatedFollowUp: FollowUp) => {
    setFollowUps(prev => prev.map(f => f.id === updatedFollowUp.id ? updatedFollowUp : f));
  };

  const updateAgent = (updatedAgent: Agent) => {
    setAgent(updatedAgent);
  };
  
  const login = (emailOrPhone: string, pass: string): boolean => {
      // For now, only the mock agent can log in. A real app would check a list of users.
      if ((emailOrPhone === initialAgent.email || emailOrPhone === initialAgent.phone) && pass === 'password123') {
          setAgent(initialAgent); // Ensure the logged in user is the mock agent
          setIsAuthenticated(true);
          return true;
      }
      return false;
  };

  const signup = (details: { name: string; email: string; phone: string; pass: string }) => {
    // In a real app, this would create a new user in the database.
    // Here, we'll just create a new agent object and log them in.
    const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        name: details.name,
        email: details.email,
        phone: details.phone,
    };
    setAgent(newAgent);
    setIsAuthenticated(true);
  };

  const logout = () => {
      setIsAuthenticated(false);
      setAgent(initialAgent); // Reset agent to default on logout
      setCurrentScreen('dashboard'); 
  };

  const value = {
    agent,
    clients,
    properties,
    followUps,
    currentScreen,
    modalView,
    isAuthenticated,
    setCurrentScreen,
    setModalView,
    addClient,
    updateClient,
    addProperty,
    updateProperty,
    addFollowUp,
    updateFollowUp,
    updateAgent,
    login,
    logout,
    signup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};