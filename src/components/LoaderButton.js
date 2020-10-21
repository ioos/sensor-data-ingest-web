import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default ({ isLoading, text, loadingText, className = '', disabled = false, ...props }) => (
    <Button variant='info' className={`LoaderButton ${className}`} disabled={disabled || isLoading} {...props}>
        {isLoading && <FontAwesomeIcon icon='spinner' spin style={{'marginRight': '7px'}} />}
        {!isLoading ? text : loadingText}
    </Button>
);
