import React from 'react';

type ListProps = {
    contacts: any;
    selected: number | null;
    switchActive: (id: number) => void;
}

export default class List extends React.Component<ListProps> {
    // constructor(props: any) {
    //     super(props);
    // }

    render() {
        if (this.props.contacts !== null) {
        const names = this.props.contacts
        .map((contact: { firstName: string; lastName: string; id: number; }) => {
            return (
                <li key={contact.id} style={{color: this.props.selected === contact.id ? 'red' : 'black' }} onClick={() => this.props.switchActive(contact.id)}>
                    {`${contact.firstName} ${contact.lastName}`}
                </li>
            );
        });
        
        return (
            <ul>
                {names}
            </ul>

        );
        }
        return ("test");
    }
}

