import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './List';

type ContactState = {
  contacts: any;
  error: any;
  isLoaded: boolean;
  selected: number | null;
}

type ContactProps = {

}

class App extends React.Component<ContactProps, ContactState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      contacts: null,
      selected: null,
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
      selected: id,
    });
    console.log(id);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <List contacts={this.state.contacts} selected={this.state.selected} switchActive={this.switchActive.bind(this)}/>
          <p>
            Edit <code>src/App.tsx</code> and save to reload. Wheeeeeee
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
