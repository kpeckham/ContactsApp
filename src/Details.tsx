import React, { ChangeEvent, useEffect, useState } from 'react';
import { EmailInput } from './EmailInput';
import { DeleteButton } from './DeleteButton';
import { Contact } from './types';

type DetailsProps = {
    contact: Contact;
    selected: number | null;
    onUpdate: () => void;
    onDelete: () => void;
    onCancel: () => void;
};

export const Details = (props: DetailsProps) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [emails, setEmails] = useState<string[]>([]);
    const [newEmails, setNewEmails] = useState<string[]>([]);

    useEffect(() => {
        setFirstName(props.contact.firstName);
        setLastName(props.contact.lastName);
        setEmails(props.contact.emails);
        setNewEmails([]);
    }, [props.contact]);

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
            alert('Please enter a first name and last name!');
            return;
        }

        const filteredNewEmails = newEmails.filter(
            (email) => email !== undefined
        );

        for (const email of filteredNewEmails) {
            if (!validateEmailInput(email)) {
                alert(
                    'Please ensure all emails are of format "email@domain.com"'
                );
                return;
            }
        }

        const filteredEmails = emails.filter((email) => email !== undefined);

        const contactData = {
            firstName: firstName,
            lastName: lastName,
            emails: filteredEmails.concat(filteredNewEmails),
        };

        if (props.contact.id !== null) {
            fetch(
                'https://avb-contacts-api.herokuapp.com/contacts/' +
                    props.contact.id,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactData),
                }
            )
                .then(() => props.onUpdate())
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
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
        setNewEmails([...newEmails, '']);
    }

    function deleteEmail(index: number) {
        const updatedEmails = [...emails];
        delete updatedEmails[index];

        setEmails(updatedEmails);
    }

    function deleteNewEmail(index: number) {
        const updatedEmails = [...newEmails];
        delete updatedEmails[index];

        setNewEmails(updatedEmails);
    }

    function deleteContact() {
        if (props.selected !== null) {
            fetch(
                'https://avb-contacts-api.herokuapp.com/contacts/' +
                    props.contact.id,
                {
                    method: 'DELETE',
                    body: null,
                }
            )
                .then(() => props.onDelete())
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const emailsDiv = emails.map((email, index) => {
        if (!email) {
            return;
        }
        return (
            <div className="Current-email" key={index}>
                {email}
                <DeleteButton onClick={() => deleteEmail(index)} />
            </div>
        );
    });

    const emailInputs = newEmails.map((email, index) => {
        if (email === undefined) {
            return;
        }
        return (
            <div key={index} className="Current-new-email">
                <EmailInput index={index} addEmail={updateNewEmail} />
                <DeleteButton onClick={() => deleteNewEmail(index)} />
            </div>
        );
    });

    return (
        <div className="Details-pane">
            <form className="Details-form" onSubmit={handleSubmit}>
                <div className="Name-inputs">
                    <div className="Name-input">
                        <label>
                            First Name
                            <input
                                type="text"
                                value={firstName}
                                onChange={handleFirstName}
                            />
                        </label>
                    </div>
                    <div className="Name-input">
                        <label>
                            Last Name
                            <input
                                type="text"
                                value={lastName}
                                onChange={handleLastName}
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <label>Email</label>
                    {emailsDiv}
                </div>

                {newEmails.filter((email) => email !== undefined).length ? (
                    <label>New Email</label>
                ) : null}

                {emailInputs}

                <div className="Button-container New-email-container">
                    <div className="New-email">
                        <button
                            className="Circle-button"
                            type="button"
                            onClick={addEmailInput}>
                            +
                        </button>
                        <div className="New-email-text" onClick={addEmailInput}>
                            add email
                        </div>
                    </div>
                </div>
            </form>

            <div className="Button-row">
                <div className="Delete-button-container">
                    <button
                        className="Delete-button Button-common"
                        type="button"
                        onClick={deleteContact}>
                        Delete
                    </button>
                </div>
                <div className="Right-buttons">
                    <button
                        className="Cancel-button Button-common"
                        type="button"
                        onClick={props.onCancel}>
                        Cancel
                    </button>

                    <button
                        className="Save-button Button-common"
                        type="button"
                        onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
