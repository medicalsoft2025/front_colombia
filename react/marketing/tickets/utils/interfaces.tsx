export interface FileComment {
  file_name: string;
  file_size: number;
  file_id: string | null;
  service_type: string | null;
  file_url: string;
  file_path: string;
}

export interface Comment {
  parent_commment_id: string;
  created_by_user: string;
  user_type: string;
  description: string;
  created_at: string;
  files: FileComment[] | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status_title: string;
  assigned_to_user: string;
  ticket_title: string;
  files: string | null;
  labels_list: string | null;
  comments: Comment[] | null;
}

export interface Ticket {
  id: number;
  title: string;
  assigned_to_user: string;
  status: string;
  created_at: string;
  tasks?: Task[];
}

export interface TicketFormData {
  subject: string;
  stepsToReproduce: string;
  expectedResults: string;
  tags: any[];
  frequency: any;
  message: string;
  files: FileList | null;
}

export interface CommentFormData {
  message: string;
  files: FileList | null;
}