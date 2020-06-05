import React, { Component } from 'react';
import Router from 'next/router';
import EditCard from "../components/EditCard/EditCard";

class about extends Component {
    render() {
        return (
            <div>
                <button onClick={() => Router.push("/")}> Go Back</button>
               <EditCard 
                 cardColor='#4EC1EC'
                 title='Test Title'
                 navigationPath = '/'
                 />
            </div>
        );
    }
}

export default about;