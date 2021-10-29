import React from 'react';
import EmailInput from './EmailInput'

type DetailsProps = {
    contact: any;
    selected: number | null;
    updateCallback: () => void;
}

type DetailsState = {
    firstName: string;
    lastName: string;
    emails: any;
    newEmailsCounter: number;
    newEmails: any;
    emailIsHover: any;
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
            emailIsHover: new Array(this.props.contact.emails.length).fill(false),
        };

        console.log(this.state.emailIsHover);

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addEmailInput = this.addEmailInput.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.emailHover = this.emailHover.bind(this);
    }

    emailHover(isHover: boolean, index: number) {

        this.setState(prevState => {

            prevState.emailIsHover[index] = isHover;
            return ({
                emailIsHover: prevState.emailIsHover,
            });
        });

        
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

    handleSubmit() {

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

        if (this.props.contact.id !== null) {
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
            .then(() => this.props.updateCallback())
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        else {
            fetch('https://avb-contacts-api.herokuapp.com/contacts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .then(() => this.props.updateCallback())
            .catch((error) => {
                console.error('Error:', error);
            });
        }
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
        .then(() => this.props.updateCallback())
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
                newEmailsCounter: 0,
                newEmails: [],
                emailIsHover: new Array(this.props.contact.emails.length).fill(false),
            });
        }
    }

    render() {
        const emails = this.state.emails.map((email: any, index: number) => {
            return (
                <div className="Current-email" key={index} onMouseEnter={() => this.emailHover(true, index)} onMouseLeave={() => this.emailHover(false, index)}>
                    {email}
                    {this.state.emailIsHover[index] && 
                    <div className="Button-container Delete-button-container">
                        <div>
                            <button className="Circle-button Email-delete-button" type="button" onClick={() => this.deleteEmail(index)}>
                                <div>—</div>
                            </button>                                     
                        </div>
                    </div>
                    }
                
                </div>
                
            );
        });

        const emailInputs = [
            ...Array(this.state.newEmailsCounter),
        ].map((email: undefined, index: number) => (
            <EmailInput key={index} index={index} addEmail={this.addEmail}/>
        ));

        return (
            <div className="Details-pane">
                <form onSubmit={this.handleSubmit}>
                    <div className="Name-inputs">
                        <div className="Name-input">
                            <label>First Name
                                <input type="text" value={this.state.firstName} onChange={this.handleFirstName}/>
                            </label>
                        </div>
                        <div className="Name-input">
                            <label>Last Name
                                <input type="text" value={this.state.lastName} onChange={this.handleLastName}/>
                            </label>
                        </div>
                    </div>
                    
                <div>
                    <label>Email</label>
                    {emails}
                </div>

                {emailInputs}
                
                    <div className="Button-container New-email-container">
                        <div className="New-email">
                            <button className="Circle-button" type="button" onClick={this.addEmailInput}>+</button>
                            <div className="New-email-text">add email</div>
                            
                        </div>
                    </div>
                </form>

                <button className="Delete-button Button-common" type="button" onClick={this.deleteContact}>
                    Delete
                </button>
                <button className="Save-button Button-common" type="button" onClick={this.handleSubmit}>
                    Save
                </button>
            </div>
        );
    }
}