import React, { Component } from 'react';
import SpeechArea from '../SpeechArea';
import './index.css';

class SpeechPage extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
        speechTextareaValue: '',
        requirementsTextareaValue: '',
        isLoading: false,
        generatedSpeech: '',
        selectedLanguage: 'Hindi',
        translatedSpeech: '',
        speechError: '',
        requirementsError: ''
    };
    this.state = { ...this.initialState };
    this.handleSpeechTextareaChange = this.handleSpeechTextareaChange.bind(this);
    this.handleRequirementsTextareaChange = this.handleRequirementsTextareaChange.bind(this);
    this.handleSpeechFileInputChange = this.handleSpeechFileInputChange.bind(this);
    this.handleRequirementsFileInputChange = this.handleRequirementsFileInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTranslate = this.handleTranslate.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
  }

  handleSpeechTextareaChange(event) {
    this.setState({ speechTextareaValue: event.target.value });
  }

  handleRequirementsTextareaChange(event) {
    this.setState({ requirementsTextareaValue: event.target.value });
  }

  handleSpeechFileInputChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ speechTextareaValue: content });
    };
    reader.readAsText(file);
  }

  handleRequirementsFileInputChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ requirementsTextareaValue: content });
    };
    reader.readAsText(file);
  }

  handleSubmit() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your API endpoint
    const { speechTextareaValue, requirementsTextareaValue } = this.state;

    if (speechTextareaValue.trim() === '') {
        this.setState({ speechError: '* Speech field cannot be empty.' });
        if (requirementsTextareaValue.trim() === '') {
            this.setState({ requirementsError: '* Requirements field cannot be empty.' });
        } else {
            this.setState({ requirementsError: '' });
        }
        return;
    } else {
        this.setState({ speechError: '' });
    }

    if (requirementsTextareaValue.trim() === '') {
        this.setState({ requirementsError: '* Requirements field cannot be empty.' });
        return;
    } else {
        this.setState({ requirementsError: '' });
    }

    this.setState({ isLoading: true }); // Show spinner

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ speech: speechTextareaValue, requirements: requirementsTextareaValue, generated_speech: "hellooo" })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Received response:', data);
        this.setState({ isLoading: false, generatedSpeech: data.generated_speech });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ isLoading: false }); // Hide spinner on error
      });
  }

  handleLanguageChange(event) {
    this.setState({ selectedLanguage: event.target.value });
  }

  handleTranslate() {
    const { generatedSpeech, selectedLanguage } = this.state;
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your API endpoint

    this.setState({ isLoading: true });

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ generatedSpeech, language: selectedLanguage, translated_speech: "namaskar" })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Translation response:', data);
        this.setState({ isLoading: false, translatedSpeech: data.translated_speech });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ isLoading: false });
      });
  }

  handleClearAll() {
    this.setState({ ...this.initialState });
  }

  render() {
    const { isLoading, generatedSpeech, selectedLanguage, translatedSpeech, speechError, requirementsError } = this.state;

    return (
      <div className="container">
        {!isLoading && generatedSpeech === '' && (
          <div>
            <div>
              <h1>Speech:</h1>
              <SpeechArea content={this.state.speechTextareaValue} onTextareaChange={this.handleSpeechTextareaChange} />
              <input type="file" accept=".txt" onChange={this.handleSpeechFileInputChange} />
              {speechError!=='' && <p className="error-message">{speechError}</p>}
            </div>
            <div>
              <h1>Requirements:</h1>
              <SpeechArea content={this.state.requirementsTextareaValue} onTextareaChange={this.handleRequirementsTextareaChange} />
              <input type="file" accept=".txt" onChange={this.handleRequirementsFileInputChange} />
              {requirementsError && <p className="error-message">{requirementsError}</p>}
            </div>
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        )}

        {/* Show spinner if isLoading is true */}
        {isLoading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}

        {/* Show generated speech if available */}
        {generatedSpeech !== '' && (
          <div>
            <h1>Generated Speech:</h1>
            <SpeechArea content={generatedSpeech} />
            <div>
              <h1>Languages:</h1>
              <select value={selectedLanguage} onChange={this.handleLanguageChange} className="language-dropdown">
                <option value="Hindi">Hindi</option>
                <option value="Telugu">Telugu</option>
                <option value="Bengali">Bengali</option>
              </select>
            <div className="language-dropdown-arrow"></div>
            <button onClick={this.handleTranslate} className="translate-button">Translate</button>
            </div>
            <div>
                {/* Show translated speech if available */}
                {translatedSpeech!=='' && (
                <div>
                    <h1>Translated Speech:</h1>
                    <p className="language-label">Language: {selectedLanguage}</p>
                    <SpeechArea content={translatedSpeech} />
                </div>
                )}
            </div>
          </div>
        )}
        {/* Button for clearing all input fields */}
        <button onClick={this.handleClearAll} className="clear-all-button">Clear All</button>
        
      </div>
    );
  }
}

export default SpeechPage;
