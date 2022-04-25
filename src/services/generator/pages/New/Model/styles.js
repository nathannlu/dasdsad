export const defaultCss = {
    height: '250px',
    width: '250px',
    overflow: 'hidden',

    borderRadius: '10px',
    border: 'solid 2px white',
    background: 'rgba(255,255,255,.2)',
    boxShadow: '0 4px 8px rgba(0,0,0,.1)',
    backdropFilter: 'blur(3px)',

    transition: 'all .5s',
};

export const baseCss = {
    transform: 'rotateX(45deg) rotateZ(45deg)',
};

export const selectedCss = (isSelectedLayer) => ({
    transform: `rotateX(45deg) rotateZ(45deg) ${
        isSelectedLayer ? 'scale(1.05)' : ''
    }`,
    opacity: isSelectedLayer ? 1 : 0.5,
    border: isSelectedLayer ? 'solid 3px #006aff' : 'solid 2px white',
});

export const compiledImgCss = {
    transform: '',
    background: '',
    border: 'none',
    backdropFilter: 'blur(0px)',
};
