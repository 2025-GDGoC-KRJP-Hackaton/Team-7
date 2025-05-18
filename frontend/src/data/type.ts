// type.ts
// type.ts
export type SidebarProps = {
  opened: boolean | null;
  setOpened: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export type RecommendationItem = {
  id: string;
  name: string;
  description: string;
  address: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  userId: string;
};
