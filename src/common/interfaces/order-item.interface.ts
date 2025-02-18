export interface Group {
  optionGroup: OptionGroup;
  options: Option[];
}
export interface OptionGroup {
  id: number;
  name: string;
  storeId: number;
  isMultiple: boolean;
  status: string;
  createdAt: Date;
  updateAt: Date;
}

export interface Option {
  id: number;
  name: string;
  price: number;
  status: string;
  optionGroupId: number;
  createdAt: Date;
  updateAt: Date;
}
