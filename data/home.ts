export type JournalEntry = {
  title: string;
  outputType: "Proposal" | "Poster" | "Draft" | "Published Paper";
  authors: string;
  field: string;
  date: string;
};

export type PaperLab = {
  title: string;
  paper: string;
  presenter: string;
  field: string;
};
