import * as React from 'react';
import './App.css';

import logo from './logo.svg';

import axios from 'axios';
import * as Autosuggest from 'react-autosuggest';

interface IProduct {
  productName: string,
  productUrl: string
}
interface IOption {
  _source: IProduct
}

interface ISuggestionGroup {
  options: IOption[]
}

interface ISuggestPayload {
  productSuggest: ISuggestionGroup[]
}

interface IPayload {
  suggest: ISuggestPayload
}

interface IState {
  searchTerm: string,
  suggestions: IProduct[],
};

class App extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);

    this.state = {
      searchTerm: '',
      suggestions: []
    };
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Our Store</h1>
        </header>
        <div className="page-container">
          <div className="ac-container">

            <Autosuggest
              alwaysRenderSuggestions={true}
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={
                {
                  onChange: this.handleChange,
                  placeholder: 'Product Search',
                  value: this.state.searchTerm
                }
              }
            />
          </div>
        </div>
      </div >
    );
  }

  private handleChange(event: React.FormEvent<any>, params: Autosuggest.ChangeEvent) {
    this.setState({
      searchTerm: this.escapeRegexCharacters(params.newValue.trim())
    });
  }

  private getSuggestionValue(suggestion: IProduct) {
    return suggestion.productName;
  }

  private renderSuggestion(suggestion: IProduct, params: Autosuggest.RenderSuggestionParams) {
    return (
      <div>
        {suggestion.productName}
      </div>
    );
  }

  private async onSuggestionsFetchRequested(params: Autosuggest.SuggestionsFetchRequestedParams) {
    let payload: IPayload | null = null;

    if (params.reason !== 'input-changed' || !params.value) {
      return;
    }

    try {
      const searchResponse = await axios.post(`/autosuggest/_search`, {
        "suggest": {
          "productSuggest": {
            "completion": {
              "field": "productSuggest"
            },
            "prefix": params.value
          }
        }
      });

      payload = searchResponse.data;
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log('Hmmm, an error occured');
    }

    if (!payload) {
      return;
    }

    this.setState({
      suggestions: payload.suggest.productSuggest[0].options.map(o => o._source)
    });
  }

  private onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  private escapeRegexCharacters(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

export default App;
