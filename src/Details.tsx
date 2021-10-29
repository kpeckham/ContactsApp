import React, { ChangeEvent, useEffect, useState } from 'react';
import { EmailInput } from './EmailInput'
import { Contact } from './types'

type DetailsProps = {
    contact: Contact;
    selected: number | null;
    onUpdate: () => void;
    onDelete: () => void;
}

export const Details = (props: DetailsProps) => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [emails, setEmails] = useState<string[]>([]);
    const [newEmails, setNewEmails] = useState<string[]>([]);
    const [emailsHovered, setEmailsHovered] = useState<boolean[]>([]);

    useEffect(() => {
        setFirstName(props.contact.firstName);
        setLastName(props.contact.lastName);
        setEmails(props.contact.emails);
        setNewEmails([]);
        setEmailsHovered(new Array(props.contact.emails.length).fill(false));
    },
    [props.contact]);

    function emailHover(isHover: boolean, index: number) {

        const updatedHovers = [...emailsHovered];
        updatedHovers[index] = isHover;

        setEmailsHovered(updatedHovers);        
    }

    function handleFirstName(event: ChangeEvent<HTMLInputElement>) {
        setFirstName(event.target.value);
    }

    function handleLastName(event: ChangeEvent<HTMLInputElement>) {
        setLastName(event.target.value);
    }

    function validateEmailInput(input: string) {
        const validate = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        return validate.test(input);
    }

    function handleSubmit() {

        if (firstName === '' || lastName === '') {
            alert("Please enter a first name and last name!");
            return;
        }

        for (const email of newEmails) {
            if (!validateEmailInput(email)) {
                alert("Please ensure all emails are of format \"email@domain.com\"");
                return;
            }
        }
        
        const filteredEmails = emails.filter(x => x !== undefined);
        const contactData = {
            "firstName": firstName,
            "lastName": lastName,
            "emails": filteredEmails.concat(newEmails),
        };

        if (props.contact.id !== null) {
            fetch('https://avb-contacts-api.herokuapp.com/contacts/' + props.contact.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            })
            .then(() => props.onUpdate())
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
            .then(() => props.onUpdate())
            .catch((error) => {
                console.error('Error:', error);
            });
        } 
    }

    function updateNewEmail(email: string, index: number) {
        const updatedNewEmails = [...newEmails];
        updatedNewEmails[index] = email;

        setNewEmails(updatedNewEmails);
    }

    function addEmailInput() {
        setNewEmails([...newEmails, ""]);
    }

    function deleteEmail(index: number) {
        const updatedEmails = [...emails];
        delete updatedEmails[index];

        setEmails(updatedEmails);
    }

    function deleteContact() {
        if (props.selected !== null) {
            fetch('https://avb-contacts-api.herokuapp.com/contacts/' + props.contact.id, {
                method: 'DELETE',
                body: null,
            })
            .then(() => props.onDelete())
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    const emailsDiv = emails.map((email: any, index: number) => {
        return (
            <div className="Current-email" key={index} onMouseEnter={() => emailHover(true, index)} onMouseLeave={() => emailHover(false, index)}>
                {email}
                {emailsHovered[index] && 
                <div className="Button-container Delete-button-container">
                    <div>
                        <button className="Circle-button Email-delete-button" type="button" onClick={() => deleteEmail(index)}>
                            <div>—</div>
                        </button>                                     
                    </div>
                </div>
                }
            
            </div>
            
        );
    });

    const emailInputs = newEmails.map((email, index) => (
        <EmailInput key={index} index={index} addEmail={updateNewEmail}/>
    ));

    return (
        <div className="Details-pane">
            <form onSubmit={handleSubmit}>
                <div className="Name-inputs">
                    <div className="Name-input">
                        <label>First Name
                            <input type="text" value={firstName} onChange={handleFirstName}/>
                        </label>
                    </div>
                    <div className="Name-input">
                        <label>Last Name
                            <input type="text" value={lastName} onChange={handleLastName}/>
                        </label>
                    </div>
                </div>
                
            <div>
                <label>Email</label>
                {emailsDiv}
            </div>

            {emailInputs}
            
                <div className="Button-container New-email-container">
                    <div className="New-email">
                        <button className="Circle-button" type="button" onClick={addEmailInput}>+</button>
                        <div className="New-email-text">add email</div>
                        
                    </div>
                </div>
            </form>

            <button className="Delete-button Button-common" type="button" onClick={deleteContact}>
                Delete
            </button>
            <button className="Save-button Button-common" type="button" onClick={handleSubmit}>
                Save
            </button>
        </div>
    );
}