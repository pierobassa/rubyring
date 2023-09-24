type Props = {
  className?: string;
};

export const BaseSeparator = ({ className = "h-1 bg-white w-full" }: Props) => {
  return <div className={className} />;
};
