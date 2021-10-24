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
    newEmailsCounter: number;
    newEmails: any;
}

export default class Details extends React.Component<DetailsProps, DetailsState> {
    constructor(props: any) {
        super(props);

        this.state = {
            firstName: this.props.contact.firstName,
            lastName: this.props.contact.lastName,
            emails: this.props.contact.emails,
            newEmailsCounter: 0,
            newEmails: [],
        };

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addEmailInput = this.addEmailInput.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
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
        event.preventDefault();

        if (this.state.firstName === '' || this.state.lastName === '') {
            alert("Please enter a first name and last name!");
            return false;
        }

        for (const email of this.state.newEmails) {
            if (!this.validateEmailInput(email)) {
                alert("Please ensure all emails are of format \"email@domain.com\"");
                return false;
            }
        }
        
        const filteredEmails = this.state.emails.filter((x: any) => x !== undefined);
        const contactData = {
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emails": filteredEmails.concat(this.state.newEmails),
        };

        fetch('https://avb-contacts-api.herokuapp.com/contacts/' + this.props.contact.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        return true;
        
    }

    addEmail(email: string, index: number) {
        this.setState(prevState => {
            let newEmails = prevState.newEmails;
            newEmails[index] = email;

            return({
                newEmails: newEmails,
            });
        });

    }

    addEmailInput() {
        this.setState((prevState) => ({
            newEmailsCounter: prevState.newEmailsCounter + 1,
        }));

    }

    validateEmailInput(input: string) {
        const validate: RegExp = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
        return validate.test(input);
    }

    deleteEmail(index: number) {
        console.log(index);
        this.setState(prevState => {
            console.log(prevState.emails);
            // const deleted = prevState.emails.splice(index,1);
            // console.log(deleted);
            delete prevState.emails[index];
            console.log(prevState.emails);
            return ({
                emails: prevState.emails,
            });
        });
        console.log(this.state.emails);
    }

    deleteContact() {
        fetch('https://avb-contacts-api.herokuapp.com/contacts/' + this.props.contact.id, {
            method: 'DELETE',
            body: null,
        })
        .then(response => console.log(response))
        .catch((error) => {
            console.error('Error:', error);
        });
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
        const emails = this.state.emails.map((email: any, index: number) => {
            return (
                <div key={index}>
                    {email}
                    <button type="button" onClick={() => this.deleteEmail(index)}>Delete</button>
                    {/* <Button handleClick={this.deleteEmail} index={index} value={"Delete"}/> */}
                </div>
            );
        });

        const emailInputs = [
            ...Array(this.state.newEmailsCounter),
        ].map((email: undefined, index: number) => (
            <EmailInput key={index} index={index} addEmail={this.addEmail}/>
        ));

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
                
                <div>
                    {emails}
                </div>

                {emailInputs}
                <button type="button" onClick={this.addEmailInput}>
                    New Email
                </button>
                </form>

                <button type="button" onClick={this.deleteContact}>
                    Delete Contact
                </button>
            </div>
        );
    }
}