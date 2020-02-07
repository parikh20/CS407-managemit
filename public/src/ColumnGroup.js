import React from 'react';

import GridList from '@material-ui/core/GridList';

import Column from './Column.js';

class ColumnGroup extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <div style={{height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden'}}>
                <GridList style={{flexWrap: 'nowrap'}}>
                    <Column columnName='Test Column' />
                    <Column columnName='another column' />
                    <Column columnName='third col' />
                    <Column columnName='fourth col' />
                    <Column columnName='fifth col' />
                    <Column columnName='sixth col' />
                    <Column columnName='seventh col' />
                    <Column columnName='eighth col' />
                    <Column columnName='ninth col' />
                    <Column columnName='tenth col' />
                </GridList>
            </div>
        );
    }
}

export default ColumnGroup;