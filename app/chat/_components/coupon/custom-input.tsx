import { cn } from "@/app/lib/utils";
import React, { forwardRef, InputHTMLAttributes } from "react";

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, error, icon, helpText, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            className={cn(
              "w-full px-4 py-3 rounded-lg border border-line-natural focus:outline-none text-body-2 transition-colors",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-label-natural">
              {icon}
            </div>
          )}
        </div>
        {helpText && (
          <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-label-natural"}`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput; 