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

    compare(a: any,b: any) {
        let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase();
        let fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    }
    
    render() {
        if (this.props.contacts !== null) {
        
        const names = this.props.contacts.sort(function(a: any,b: any) {
            let fa = a.firstName.toLowerCase() + a.lastName.toLowerCase();
            let fb = b.firstName.toLowerCase() + b.lastName.toLowerCase();
    
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        })
        .map((contact: { firstName: string; lastName: string; id: number; }) => {
            return (
                <li key={contact.id} style={{color: this.props.selected === contact.id ? 'red' : 'black' }} onClick={() => this.props.switchActive(contact.id)}>
                    {`${contact.firstName} ${contact.lastName}`}
                </li>
            );
        });
        
        return (
            <ul className="Contact-list">
                {names}
            </ul>

        );
        }
        return ("test");
    }
}

