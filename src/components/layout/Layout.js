import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, Container, Navbar, Stack } from '../../ds/components';

const links = [
    { value: 'Blockchain', link: '/smart-contracts' },
    { value: 'Website', link: '/websites' },
];

const Layout = ({ children }) => {
    const [selectedPage, setSelectedPage] = useState('collections');
    const history = useHistory();
    const { pathname } = useLocation();

    const onChange = (link) => {
        setSelectedPage(link.link.replace('/', ''));
        history.push(link.link);
    };

    useEffect(() => {
        if (pathname) {
            setSelectedPage(pathname.split('/')[1]);
        }
    }, []);

    return (
        <main className="ambition-main" style={{ paddingTop: '120px' }}>
            <header className="ambition-header">
                <Navbar />

                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        position: 'fixed',
                        background: 'white',
                        zIndex: 10,
                        top: '65px',
                        paddingTop: '2px',
                        paddingBottom: '2px',
                        width: '100%',
                    }}>
                    <Container>

                        <Stack gap={1} p={1} direction="row">
                            {links.map((link, i) => (
                                <Button
                                    key={i}
                                    size="small"
                                    variant={
                                        selectedPage ==
                                            link.link.replace('/', '')
                                            ? 'contained'
                                            : 'text'
                                    }
                                    sx={{
                                        boxShadow: 'none',
                                        outline: 'none',
                                        padding: '4px 10px',
                                        borderRadius: 9999,
                                        '&:hover': {
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={() => onChange(link)}>
                                    {link.value}
                                </Button>
                            ))}
                        </Stack>

                        {/*
						<Tabs value={selectedPage} onChange={onChange}>
							<Tab label="Collections" value="collections" />
							<Tab label="Blockchain" value="smart-contracts" />
							<Tab label="Website" value="websites" />
						</Tabs>
							*/}

                    </Container>
                </Box>
            </header>
            {children}
        </main>
    );
};

export default Layout;
