
type InputProps = {
    type: "text" | "email" | "password" | "number" | "date" | "checkbox" | "radio";
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Inputecommone: React.FC<InputProps> = ({ type, name, placeholder, value, onChange }: InputProps) => {

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    );
}