export interface List {
  id?: string;
  name: string;
  places: Place[];
  createdAt?: Date;
  shareId?: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  description: string;
}