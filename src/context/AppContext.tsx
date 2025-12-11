import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Token {
  id: string;
  token: string;
  name: string;
  email: string;
  food: string;
  drink: string;
  createdAt: string;
  used: boolean;
}

export interface SharedProject {
  id: string;
  projectName: string;
  personName: string;
  linkedinUrl: string;
  githubUrl: string;
  description: string;
  shortLink: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  createdAt: string;
  answered: boolean;
}

interface AppContextType {
  tokens: Token[];
  addToken: (token: Token) => void;
  markTokenUsed: (id: string) => void;
  deleteToken: (id: string) => void;
  sharedProjects: SharedProject[];
  addSharedProject: (project: SharedProject) => void;
  questions: Question[];
  addQuestion: (question: Question) => void;
  toggleQuestionAnswered: (id: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  tokens: 'cafecursor_tokens',
  projects: 'cafecursor_projects',
  questions: 'cafecursor_questions',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.tokens);
    return saved ? JSON.parse(saved) : [];
  });

  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.projects);
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.questions);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tokens, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(sharedProjects));
  }, [sharedProjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(questions));
  }, [questions]);

  const addToken = (token: Token) => setTokens(prev => [token, ...prev]);
  const markTokenUsed = (id: string) => setTokens(prev => 
    prev.map(t => t.id === id ? { ...t, used: true } : t)
  );
  const deleteToken = (id: string) => setTokens(prev => prev.filter(t => t.id !== id));

  const addSharedProject = (project: SharedProject) => setSharedProjects(prev => [project, ...prev]);

  const addQuestion = (question: Question) => setQuestions(prev => [question, ...prev]);
  const toggleQuestionAnswered = (id: string) => setQuestions(prev =>
    prev.map(q => q.id === id ? { ...q, answered: !q.answered } : q)
  );

  return (
    <AppContext.Provider value={{
      tokens,
      addToken,
      markTokenUsed,
      deleteToken,
      sharedProjects,
      addSharedProject,
      questions,
      addQuestion,
      toggleQuestionAnswered,
      activeSection,
      setActiveSection,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
