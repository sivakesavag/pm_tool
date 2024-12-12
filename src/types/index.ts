export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  skills: Record<string, number>;
  availability_status: string;
  working_hours: Record<string, string>;
  performance_metrics: Record<string, number>;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: string;
  health_indicator: string;
  team_members: ProjectMember[];
  budget_allocation: number;
  priority_level: number;
  client_information: Record<string, any>;
  documentation_links: string[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  priority: number;
  status: string;
  progress: number;
  assignees: User[];
  dependencies: number[];
  estimated_hours: number;
  actual_hours: number;
  attachments: string[];
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  project: number;
  user: User;
  role: string;
  joined_at: string;
}

export interface Resource {
  id: number;
  name: string;
  resource_type: string;
  availability: Record<string, any>;
  cost_per_hour: number;
  allocation_details: Record<string, any>;
  skills: string[];
  utilization_metrics: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface Timeline {
  id: number;
  project: number;
  milestones: Array<{
    title: string;
    date: string;
    status: string;
  }>;
  dependencies: Array<{
    from: number;
    to: number;
    type: string;
  }>;
  critical_path: number[];
  delay_tracking: Record<string, any>;
  schedule_adjustments: Array<{
    date: string;
    reason: string;
    impact: string;
  }>;
}

export interface Analytics {
  id: number;
  project: number;
  performance_metrics: Record<string, number>;
  resource_utilization: Record<string, number>;
  budget_tracking: {
    allocated: number;
    spent: number;
    remaining: number;
    forecasted: number;
  };
  progress_indicators: Record<string, number>;
  risk_assessments: Array<{
    type: string;
    level: string;
    impact: string;
    mitigation: string;
  }>;
  predictive_insights: Record<string, any>;
}
