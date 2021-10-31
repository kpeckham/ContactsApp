import { useEffect, useState } from 'react';
import './App.css';
import { List } from './List';
import { Details } from './Details';
import { Contact } from './types';

enum DetailsStatus {
    Empty,
    Edit,
}

export const App = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [detailsStatus, setDetailsStatus] = useState(DetailsStatus.Empty);

    function updateList(id?: number) {
        fetch('https://avb-contacts-api.herokuapp.com/contacts/')
            .then((response) => response.json())
            .then((data) => {
                setContacts(data);
                if (id) {
                    setSelectedId(id);
                }
            });
    }

    useEffect(updateList, []);

    function switchActive(id: number | null) {
        setSelectedId(id);
        setDetailsStatus(DetailsStatus.Edit);
    }

    function newContact() {
        setSelectedId(null);
        setDetailsStatus(DetailsStatus.Edit);
    }

    function onDelete() {
        setSelectedId(null);
        setDetailsStatus(DetailsStatus.Empty);
        updateList();
    }

    function onCancel() {
        setSelectedId(null);
        setDetailsStatus(DetailsStatus.Empty);
    }

    const emptyContact = {
        id: null,
        firstName: '',
        lastName: '',
        emails: [],
    };

    const selectedContact = contacts.find(
        (contact) => contact.id === selectedId
    );

    return (
        <div className="App">
            <div className="List-pane">
                <div className="Contact-header">
                    <h1>Contacts</h1>
                    <div className="Button-container">
                        <div>
                            <button
                                className="Circle-button"
                                type="button"
                                onClick={newContact}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <List
                    contacts={contacts}
                    selected={selectedId}
                    switchActive={switchActive}
                />
            </div>

            {detailsStatus === DetailsStatus.Edit && (
                <Details
                    selected={selectedId}
                    contact={selectedContact ?? emptyContact}
                    onUpdate={updateList}
                    onDelete={onDelete}
                    onCancel={onCancel}
                />
            )}
        </div>
    );
};
