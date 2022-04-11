import React from 'react';
import { Fade } from '@material-ui/core';
import Button from '../Button';
import Link from '../Link';

const Template = (props) => {
    return (
        <Fade in={true}>
            <header
                className="text-gray-600 body-font"
                style={{ background: props.background.value }}>
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <img
                            style={{ width: '50px' }}
                            src={props.image.value}
                        />
                    </a>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        {props.links?.value.map((item, idx) => (
                            <Link
                                key={idx}
                                text={item.link.value.text.value}
                                link={item.link.value.link.value}
                            />
                        ))}
                    </nav>
                    <Button
                        text={props.button.value.text.value}
                        link={props.button.value.link.value}
                        isMint={props.button.value.isMint.value}
                    />
                </div>
            </header>
        </Fade>
    );
};

export default Template;
