// components/ActionButton.jsx
export default function ActionButton({ label, onClick, variant = "default" }) {
    const baseClasses = "px-2 py-1 text-sm rounded transition";
    const variants = {
        default: "bg-gray-500 text-white hover:bg-gray-600",
        edit: "bg-blue-600 text-white hover:bg-blue-700",
        delete: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant] || variants.default}`}
        >
            {label}
        </button>
    );
}
