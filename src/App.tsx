import React from 'react';
// import logo from './logo.svg';
import './App.css';
import List from './List';
import Details from './Details';

enum DetailsStatus {
  Empty,
  Edit,
  New,
}

type ContactState = {
  contacts: any;
  error: any;
  isLoaded: boolean;
  selectedId: number | null;
  selectedContact: any;
  detailsStatus: DetailsStatus;
}

type ContactProps = {

}

class App extends React.Component<ContactProps, ContactState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      contacts: [],
      selectedId: null,
      selectedContact: null,
      detailsStatus: DetailsStatus.Empty,
    };

    this.switchActive = this.switchActive.bind(this);
    this.newContact = this.newContact.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  componentDidMount() {
    fetch('https://avb-contacts-api.herokuapp.com/contacts/')
    .then(response => response.json())
    .then(
      (data) => {
      console.log(data);
      this.setState({
        isLoaded: true,
        contacts: data
      });

      },
      (error) => {
        this.setState({
          isLoaded:true,
          error
        });
      }
    )
  }

  switchActive(id: number) {
    this.setState({
      selectedId: id,
      selectedContact: this.state.contacts.find((contact: { id: number; }) => contact.id === id),
      detailsStatus: DetailsStatus.Edit,
    });

  }

  newContact() {
    this.setState({
      selectedId: null,
      selectedContact: null,
      detailsStatus: DetailsStatus.New,
    });
  }

  updateList() {
    console.log("updating list");
    fetch('https://avb-contacts-api.herokuapp.com/contacts/')
    .then(response => response.json())
    .then(
      (data) => {
      console.log(data);
      this.setState({
        contacts: data
      });

      },
      (error) => {
        this.setState({
          error
        });
      }
    )
  }

  render() {
    let emptyContact = {
      id: null,
      firstName: "",
      lastName: "",
      emails: [],
    }
    return (
      <div className="App">
        <header className="App-header">

        </header>
        <div>
          <h1>Contacts</h1>
          <button className="New-contact" type="button" onClick={this.newContact}>New Contact</button>
            <List contacts={this.state.contacts} selected={this.state.selectedId} switchActive={this.switchActive}/>

            {this.state.detailsStatus === DetailsStatus.Edit && <Details selected={this.state.selectedId} contact={this.state.selectedContact} updateCallback={this.updateList}/>}
            {this.state.detailsStatus === DetailsStatus.New && <Details selected={this.state.selectedId} contact={emptyContact} updateCallback={this.updateList}/>}

            
        </div>
      </div>
    );
  }
}

export default App;
