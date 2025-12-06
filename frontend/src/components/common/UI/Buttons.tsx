// src/components/ui/Button.tsx
import "../../../styles/UI/Button.css";
import Chevron from "../../../assets/icons/chevron.svg?react";

type ButtonVariant = "primary" | "secondary" | "dropdown";

type Props = {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    onClick?: () => void;
    className?: string;
};

const Button = ({ children, variant = "primary", onClick, className }: Props) => {
    return (
        <button
            className={`oc-btn oc-btn-${variant} ${className ?? ""}`}
            onClick={onClick}
        >
            {children}

            {variant === "dropdown" && (
                <Chevron className="oc-btn-icon" />
            )}
        </button>
    );
};

export default Button;