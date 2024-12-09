export type ID = number | string;

export type TColumn = {
  id: ID;
  title: string;
};

export type TTask = {
  id: ID;
  columnId: ID;
  content: string;
};
