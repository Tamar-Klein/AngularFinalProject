import { TaskPriority } from "./enums/taskPriority";
import { TaskStatus } from "./enums/taskStatus";

export interface Task {
        id?: number;
        project_id: number;
        title: string;
        description?: string;
        status: TaskStatus;
        priority: TaskPriority;
        assignee_id?: number | null;
        due_date?: string | null;
        order_index?: number;
        created_at?: string;
        updated_at?: string;
}

