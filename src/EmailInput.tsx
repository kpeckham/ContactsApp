import { ChangeEvent, useState } from 'react';

type EmailInputProps = {
    addEmail: (email: string, index: number) => void;
    index: number;
}

export const EmailInput = (props: EmailInputProps) => {
    const [email, setEmail] = useState('');

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        props.addEmail(event.target.value, props.index);
    };

    return (
        <div>
            <label>
                New Email
                <input type="text" value={email} onChange={handleEmail}/>
            </label>
        </div>
    );
};