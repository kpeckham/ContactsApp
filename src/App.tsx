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
      detailsStatus: DetailsStatus.Edit,
    });

  }

  newContact() {
    this.setState({
      selectedId: null,
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
    const emptyContact = {
      id: null,
      firstName: "",
      lastName: "",
      emails: [],
    }

    const selectedContact = this.state.contacts.find((contact: { id: number; }) => contact.id === this.state.selectedId);

    return (
      <div className="App">
        <div className="List-pane">
          <div className="Contact-header">
            <h1>Contacts</h1>
            <div className="Button-container">
              <div>
                <button className="Circle-button" type="button" onClick={this.newContact}>+</button>
              </div>
            </div>
          </div>
          <List contacts={this.state.contacts} selected={this.state.selectedId} switchActive={this.switchActive}/>
        </div>

        {this.state.detailsStatus === DetailsStatus.Edit && <Details selected={this.state.selectedId} contact={selectedContact} updateCallback={this.updateList}/>}
        {this.state.detailsStatus === DetailsStatus.New && <Details selected={this.state.selectedId} contact={emptyContact} updateCallback={this.updateList}/>}

      </div>
    );
  }
}

export default App;
