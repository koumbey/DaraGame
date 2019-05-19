import React from 'react'
import getStore from './PopupStore'
import {Button} from "@material-ui/core";
const styles = {
    body: {},
    header:{height: "50px", color: "white", backgroundColor: "green", "textAlign": "center"},
    button:{},
    box:{
        position: "fixed",
        top: "10%",
        left: "50%",
        marginLeft: "-175px",
        background: "#fff",
        boxShadow: "0px 5px 20px 0px rgba(126,137,140,0.20)",
        borderRadius: "5px",
        border: "1px solid #B8C8CC",
        overflow: "hidden",
        zIndex: "1000"
    }
};

export default class PopupContainer  extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            params: null,
            component: null,
            isOpen: false
        };
        this.store = getStore();

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);

        this.store.setCloseCallback(this.close);
        this.store.setShowCallback(this.show)
    }

    show(popupInfos){
        if (!("height" in popupInfos.params)) {
            popupInfos.params["height"] = 650
        }
        if (!("width" in popupInfos.params)) {
            popupInfos.params["width"] = 650
        }

        let newState = {...popupInfos, isOpen:true};
        this.setState(newState)
    }

    close(){
        this.setState({params: null, component:null, isOpen: false})
    }


    render() {
        if (this.state.params){
            let globalStyle = {...styles.box,
                height: this.state.params.height + "px",
                width: this.state.params.width + "px"
            };
            let bodyHeight = (this.state.params.height - 100) + "px";
            return (
                <div className="popup-container">
                    <div className="popup-box" style={globalStyle}>
                        <div className="popup-header" style={styles.header}>
                            <h2>{this.state.title}</h2>
                        </div>
                        <div className="popup-body" style={{height:bodyHeight}}>
                            {React.createElement(this.state.component, this.state.params, null)}
                        </div>
                        <div className="popup-bottom" style={{height:"50px"}}>
                            <Button color="secondary" onClick={this.close}>close</Button>
                        </div>
                    </div>
                </div>
            )
        }

        return (<div className="popup-container"/>)
    }
}