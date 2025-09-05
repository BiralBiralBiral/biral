export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}