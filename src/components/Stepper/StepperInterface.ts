export interface StyleConfig {
  activeBgColor?: string;
  completedBgColor?: string;
  inactiveColor?: string;
  size?: number;
  circleFontSize?: number;
  labelFontSize?: number;
  fontWeight?: number;
}

export interface StepperProps {
  steps: string[];
  activeStep: number;
  children: React.ReactNode;
  styleConfig?: StyleConfig;
}
