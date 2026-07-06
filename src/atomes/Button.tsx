interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Onclick?: () => void;
    btname: string;
    btcolor: string;
    btstyle: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
    Onclick, 
    btname, 
    btcolor, 
    btstyle, 
    disabled = false,
    type = 'submit',
    ...rest 
}: ButtonProps) => {
    return(
        <button
            type={type}
            disabled={disabled}
            className={`group relative flex w-full justify-center rounded-lg ${btcolor} px-4 py-2.5 text-sm font-medium focus:ring-offset-2 transition-colors shadow-sm ${btstyle} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={Onclick}
            {...rest}
        >
            {btname}
        </button>
    );
}