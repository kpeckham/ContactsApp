import { Contact } from './types';

function compare(a: Contact, b: Contact) {
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

type ListProps = {
    contacts: Contact[];
    selected: number | null;
    switchActive: (id: number | null) => void;
};

export const List = (props: ListProps) => {
    const names = props.contacts.sort(compare).map((contact) => {
        const className =
            props.selected === contact.id
                ? 'Contact-list-item-selected'
                : 'Contact-list-item-unselected';

        return (
            <li
                className={className}
                key={contact.id}
                onClick={() => props.switchActive(contact.id)}>
                {`${contact.firstName} ${contact.lastName}`}
            </li>
        );
    });

    return <ul className="Contact-list">{names}</ul>;
};
