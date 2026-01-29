
export interface TaskItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface TaskCategory {
  title: string;
  tasks: TaskItem[];
}

export interface AppState {
  week: string;
  day: string;
  timeSlot: string;
  preparedBy: string;
  categories: { [key: string]: TaskCategory };
  generalTasks: string;
  notes: string;
  image: string | null;
  reviewedBy: string;
}

export const INITIAL_PPM_LIST = [
  "Aspanila Bt Ala",
  "Babara Alexander Alaw",
  "Norhaya Bt Morsidi",
  "Rismawaty Bt Mohamad Madeka",
  "Rubiana Bt Buang",
  "Viviana Ak Bangkong",
  "Zalifah Bt Abdul Latip"
];

export const INITIAL_WEEKS = ["Pertama", "Kedua", "Ketiga", "Keempat"];
export const INITIAL_DAYS = ["Isnin", "Selasa", "Rabu", "Khamis", "Jumaat"];
export const INITIAL_TIMESLOTS = [
  "6.00 pagi - 3.00 petang",
  "6.30 pagi - 3.30 petang",
  "7.00 pagi - 4.00 petang",
  "8.00 pagi - 5.00 petang"
];
