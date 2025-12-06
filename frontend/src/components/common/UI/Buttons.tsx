// src/components/ui/Button.tsx
import "../../../styles/UI/Button.css";
import Chevron from "../../../assets/icons/chevron.svg?react";

type ButtonVariant = "primary" | "secondary" | "dropdown" | "danger";

type Props = {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

const Button = ({ children, variant = "primary", onClick, className, type = "button", disabled }: Props) => {
    return (
        <button
            className={`oc-btn oc-btn-${variant} ${className ?? ""}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}

            {variant === "dropdown" && (
                <Chevron className="oc-btn-icon" />
            )}
        </button>
    );
};

export default Button;