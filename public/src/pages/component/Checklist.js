import React from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { db } from '../../Firebase';

function Checklist(props) {
    const handleClick = event => {
        setChecked(event.target.checked);
    }
    const [checked, setChecked] = React.useState(false)
    return (
        <div>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handleClick}
                            value="check"
                            color="primary"
                        />
                    }
                    label="checklist"
            /></FormGroup>
            
        </div>
        
    );
}

export default Checklist;