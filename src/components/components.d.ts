export type Modal = {
  message: string | React.ReactElement | JSX.Element;
  confirmMessage?: string;
  type: string;
  prevRef?: React.RefObject<HTMLInputElement> | null;
  optionComponent?: React.ReactElement | JSX.Element | null;
  handler?: () => void;
};
