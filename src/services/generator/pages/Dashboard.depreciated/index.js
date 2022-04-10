import React from 'react';
import {
    Button,
    Link,
    Box,
    Container,
    TextField,
    Typography,
    Stack,
    Card,
    Grid,
    Modal,
    Fade,
} from 'ds/components';
import AddIcon from '@mui/icons-material/Add';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useGenerator } from 'services/generator/controllers/generator';

const Collections = () => {
    const {
        query: { layers },
    } = useLayerManager();
    const {
        settingsForm: { name },
    } = useMetadata();
    const { start, progress, save, done } = useGenerator();

    return (
        <Fade in>
            <Container sx={{ pt: 10 }}>
                {layers[0].images.length > 0 ? (
                    <Stack gap={2}>
                        <Box>
                            <Typography variant="h4">
                                Your NFT collections
                            </Typography>
                            <Typography gutterBottom variant="body">
                                Regenerate, or download your collections.
                            </Typography>
                        </Box>

                        <Grid item xs={3}>
                            <Link to="/collections/uid">
                                <Card variant="outlined">
                                    <Box sx={{ bgcolor: 'grey.100', p: 5 }}>
                                        <img
                                            style={{ width: '100%' }}
                                            src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6d6d8ca05462d87fd_nft-generator-traits-icon.png"
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            bgcolor: 'white',
                                            p: 2,
                                        }}>
                                        <Typography gutterBottom variant="h6">
                                            {name.value}
                                        </Typography>

                                        <Stack direction="row" gap={2}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disabled={!done}>
                                                Download collection
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Card>
                            </Link>
                        </Grid>
                    </Stack>
                ) : (
                    <Grid item xs={4} sx={{ margin: '0 auto' }}>
                        <Stack mt={10} gap={2}>
                            <Box>
                                <Stack
                                    gap={1}
                                    mb={1}
                                    direction="row"
                                    alignItems="center">
                                    <img
                                        style={{ height: '40px' }}
                                        src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6d6d8ca05462d87fd_nft-generator-traits-icon.png"
                                    />
                                </Stack>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    sx={{ fontWeight: 'bold' }}>
                                    Create your first NFT collection
                                </Typography>
                                <Typography
                                    variant="body"
                                    sx={{ opacity: 0.8 }}>
                                    Create your layers, drag and drop your
                                    traits, customize your rarity, to generate
                                    up to 10,000 NFTs.
                                </Typography>
                            </Box>
                            <Box>
                                <Link to="/collections/new">
                                    <Button
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        size="small">
                                        Create collection
                                    </Button>
                                </Link>
                            </Box>
                        </Stack>
                    </Grid>
                )}
            </Container>
        </Fade>
    );
};

export default Collections;
