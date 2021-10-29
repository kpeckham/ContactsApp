import React from 'react';

type EmailInputProps = {
    addEmail: (email: string, index: number) => void;
    index: number;
}

type EmailInputState = {
    email: string;

}

export default class EmailInput extends React.Component<EmailInputProps, EmailInputState> {
    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
        };

        this.handleEmail = this.handleEmail.bind(this);

    }

    handleEmail(event: any) {
        this.setState({
            email: event.target.value,
        });

        this.props.addEmail(event.target.value, this.props.index);
    }

    render() {
        return (
            <div>
                <label>
                    New Email
                    <input type="text" value={this.state.email} onChange={this.handleEmail}/>
                </label>
            </div>
        );
    }
}