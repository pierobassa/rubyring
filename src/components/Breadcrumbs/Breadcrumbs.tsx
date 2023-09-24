import { Breadcrumb } from "./components";

type Props = {
  steps: string[];
  currentStep: number;
};

export default function Breadcrumbs({ steps, currentStep }: Props) {
  return (
    <div className="flex justify-center">
      {steps.map((step, index) => {
        const isDone = currentStep > index;

        return (
          <>
            {index !== 0 && (
              <span
                className={`h-[0.07rem] w-14 self-center rounded-lg ${
                  isDone ? "bg-[#FF89A9]" : "bg-stone-400"
                }`}
              ></span>
            )}
            <Breadcrumb
              key={index}
              title={step}
              displayedNumber={index + 1}
              done={currentStep > index}
              current={currentStep === index}
            />
          </>
        );
      })}
    </div>
  );
}
