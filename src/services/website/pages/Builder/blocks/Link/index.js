import React from 'react';

const Link = ({ text, link }) => {
    return (
        <a href={link} className="mr-5 hover:text-gray-900">
            {text}
        </a>
    );
};

export default Link;
