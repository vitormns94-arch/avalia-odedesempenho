
export enum Step {
  IDENTIFICATION = 0,
  DELIVERIES = 1,
  ATTITUDE = 2,
  RELATIONSHIP = 3,
  DEVELOPMENT = 4,
  COMMITMENT = 5,
  REPORT = 6
}

export interface EvaluationData {
  // Identification
  employeeName: string;
  role: string;
  date: string;
  period: string;

  // Block 1: Deliveries & Productivity
  block1Quantity: string;
  block1Score: number;

  // Block 2: Responsibility & Attitude
  block2Commitment: string;
  block2Score: number;

  // Block 3: Relationship & Teamwork
  block3Teamwork: string;
  block3Score: number;

  // Block 4: Learning & Development
  block4Evolution: string;
  block4Score: number;

  // Action Plan
  commitmentText: string;
}

export interface ActionPlanItem {
  action: string;
  how: string;
  responsible: string;
  deadline: string;
  successIndicator: string;
}

export interface AIReport {
  recognition: string;
  correction: string;
  direction: string;
  actionPlan: ActionPlanItem[];
  averageScore: number;
  classification: 'A' | 'B' | 'C' | 'D';
}
