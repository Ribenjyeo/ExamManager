import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import './custom.css'

function App() {
    return (
        <>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route path='/account'>
                <Layout>
                    <Route path='/counter' component={Counter} />
                    <Route path='/fetch-data' component={FetchData} />
                </Layout>
            </Route>
        </>
    );
}

export default App;