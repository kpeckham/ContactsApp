import React from 'react';
// import logo from './logo.svg';
import './App.css';
import List from './List';
import Details from './Details';

type ContactState = {
  contacts: any;
  error: any;
  isLoaded: boolean;
  selectedId: number | null;
  selectedContact: any;
  start: boolean;
  switchActive: boolean;
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
      start: true,
      switchActive: false,
    };
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
      switchActive: true,
    });


  }

  render() {
    console.log(this.state.contacts);
    console.log(this.state.selectedContact);
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          
          <List contacts={this.state.contacts} selected={this.state.selectedId} switchActive={this.switchActive.bind(this)}/>

          {this.state.switchActive && <Details selected={this.state.selectedId} contact={this.state.selectedContact}/>}

        </header>
      </div>
    );
  }
}

export default App;
