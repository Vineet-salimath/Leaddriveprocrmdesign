import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

const defaultUsers: User[] = [
  { id: "1", name: "Kavya Reddy", role: "Sales Manager", avatar: "KR", email: "kavya@hsrmotors.com" },
  { id: "2", name: "Arjun Singh", role: "Senior Sales Executive", avatar: "AS", email: "arjun@hsrmotors.com" },
  { id: "3", name: "Meena Patel", role: "Junior Sales Executive", avatar: "MP", email: "meena@hsrmotors.com" },
  { id: "4", name: "Rajesh Kumar", role: "Team Lead", avatar: "RK", email: "rajesh@hsrmotors.com" },
  { id: "5", name: "Anita Desai", role: "Regional Manager", avatar: "AD", email: "anita@hsrmotors.com" },
];

interface UserContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers[0]);

  const switchUser = (userId: string) => {
    const user = defaultUsers.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, allUsers: defaultUsers, switchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
