import React, { Component } from 'react';
import './App.css';
import {HomePage} from "./components/HomePage";
import PopupContainer from "./dynamicPopup/PopupContainer";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {primary: blue},
    typography: {useNextVariants: true}
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <PopupContainer/>
                    <HomePage/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;

