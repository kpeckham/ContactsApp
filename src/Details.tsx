import React from 'react';
import EmailInput from './EmailInput'

type DetailsProps = {
    contact: any;
    selected: number | null;
}

type DetailsState = {
    firstName: string;
    lastName: string;
    emails: any;
}

export default class Details extends React.Component<DetailsProps, DetailsState> {
    constructor(props: any) {
        super(props);

        this.state = {
            firstName: this.props.contact.firstName,
            lastName: this.props.contact.lastName,
            emails: this.props.contact.emails,
        };

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFirstName(event: any) {
        this.setState({
            firstName: event.target.value,
        });
    }

    handleLastName(event: any) {
        this.setState({
            lastName: event.target.value,
        });
    }


    handleSubmit(event: any) {
        alert('Something happened!: ' + this.state.firstName + ' ' + this.state.lastName);
        event.preventDefault();
        
    }

    addEmail(email: string) {

    }

    componentDidUpdate(prevProps: any) {
        if (this.props.contact !== prevProps.contact) {
            this.setState({
                firstName: this.props.contact.firstName,
                lastName: this.props.contact.lastName,
                emails: this.props.contact.emails,
            });
        }
    }

    render() {
        const emails = this.state.emails.map((email: any, index: number) => <li key={index}>{email}</li>);

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>First Name:
                        <input type="text" value={this.state.firstName} onChange={this.handleFirstName}/>
                    </label>
                    <label>Last Name:
                        <input type="text" value={this.state.lastName} onChange={this.handleLastName}/>
                    </label>
                    
                    <input type="submit" value="Save"/>
                </form>
                <ul>
                    {emails}
                </ul>
                <EmailInput addEmail={this.addEmail.bind(this)}/>
            </div>
        );
    }
}