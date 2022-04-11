import React from 'react';
import { Fade } from '@material-ui/core';
import Button from '../Button';

const Template = (props) => {
    return (
        <Fade in={true}>
            <section
                className="text-gray-600 body-font"
                style={{
                    background: props.background.value,
                    color: props.color.value,
                    backgroundImage: `url(${props.backgroundImage.value})`,
                }}>
                <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                    <img
                        className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
                        alt="hero"
                        src={props.image.value}
                    />
                    <div className="text-center lg:w-2/3 w-full">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
                            {props.title.value}
                        </h1>
                        <p className="mb-8 leading-relaxed">
                            {props.content.value}
                        </p>
                        <div className="flex justify-center">
                            <Button
                                text={props.button.value.text.value}
                                link={props.button.value.link.value}
                                isMint={props.button.value.isMint.value}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </Fade>
    );
};

export default Template;
