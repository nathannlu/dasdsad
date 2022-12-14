import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from 'ds/components';
import {
    Tabs,
    Tab,
    CircularProgress,
    Divider,
    Chip,
    IconButton,
    TextField,
    Autocomplete,
    Stack,
    TableContainer,
    Paper,
    Switch,
    FormGroup,
    FormControlLabel,
    Menu,
    MenuItem,
} from '@mui/material';
import { useWebsite } from 'services/website/provider';
import { Widget } from '@uploadcare/react-widget';
import useSettings from './hooks/useSettings';
import useSEOForm from './hooks/useSEOForm';
import ConfirmationDialog from './ConfirmationDialog';
import AddDomainModal from './AddDomainModal';
import Navbar from './Navbar';
import WebIcon from '@mui/icons-material/Web';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DomainIcon from '@mui/icons-material/Domain';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ImportModal from './ImportModal'

const Settings = (props) => {
		const { website, setWebsite, websites, openImportModal } = useWebsite();
	const { title: websiteTitle } = props.match.params; // Used to query DB for page data


    const {
        tabValue,
        setTabValue,
        onDeleteDialog,
        onProceedDelete,
        confirmationState,
        confirmationData,
        setConfirmationState,
        onChangeFavicon,
        faviconImage,
        onDeleteFavicon,
        onSaveSEO,
        displayImage,
        onChangeDisplayImage,
        onDeleteDisplayImage,
        onSaveFavicon,
        styleSaveStatus,
        seoSaveStatus,
        setSeoSaveStatus,
        showDomainModal,
        setShowDomainModal,
        onAddDomain,
        domainName,
        onDomainNameChange,
        onDeleteDomain,
        handleAddDomain,
        onVerifyDomain,
        onMakeDefault,
        onPublishPage,
        onDomainState,
        contracts,
        contractAnchor,
        openContractAnchor,
        onCloseContractAnchor,
        setContractAnchor,
        onSwitchContract,
        customSaveStatus,
        customHead,
        customBody,
        onCustomHeadChange,
        onCustomBodyChange,
        onSaveCustom,
        onGenerateSSlCertificate,
        isAddingDomain
    } = useSettings();
    const {
        title,
        previewTitle,
        description,
        keywords,
        language,
        robots,
        url,
        onTitleChange,
        onPreviewTitleChange,
        onDescriptionChange,
        onKeywordsChange,
        onLanguageChange,
        onRobotsChange,
        onUrlChange,
    } = useSEOForm(setSeoSaveStatus);

    // Load website data on load
    useEffect(() => {
        const w = websites.find((website) => website.title == websiteTitle);

			if(w) {
				setWebsite(w)
			}

    }, [websites]);

    return (
        <Box
            sx={{
                width: '100vw',
                bgcolor: 'grey.200',
                position: 'absolute',
                minHeight: '100vh',
                height: '100%',
                top: 0,
                zIndex: 1200,
            }}>
            <Navbar />
            <ConfirmationDialog
                confirmationState={confirmationState}
                confirmationData={confirmationData}
                onProceed={onProceedDelete}
                setConfirmationState={setConfirmationState}
            />
            <AddDomainModal
                showDomainModal={showDomainModal}
                setShowDomainModal={setShowDomainModal}
                onChange={onAddDomain}
                domainName={domainName}
                onDomainNameChange={onDomainNameChange}
                isAddingDomain={isAddingDomain}
            />
					{website && website.seo && (
                <Box paddingTop="8em" paddingBottom="8em" bgcolor="grey.200">
                    <Box
                        maxWidth="1100px"
                        width="100%"
                        backgroundColor="white"
                        borderRadius="10px"
                        boxShadow="0 2px 8px 0 rgba(0,0,0,0.09);"
                        display="flex"
                        sx={{
                            ml: 'auto',
                            mr: 'auto',
                        }}
                        height="100%">
                        {website ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                padding="2em"
                                flex="1"
                                maxWidth="255px">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<WebIcon />}
                                    sx={{
                                        mb: '1em',
                                    }}>
                                    {website.title}
                                </Button>
                                {website.pages &&
                                    website.pages.map((page, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outlined"
                                            size="small"
                                            startIcon={
                                                page.name === 'home' ? (
                                                    <HomeIcon />
                                                ) : (
                                                    <ArticleIcon />
                                                )
                                            }
                                            sx={{
                                                color: 'gray',
                                                borderColor: 'gray',
                                                textTransform: 'none',
                                            }}>
                                            {page.name}
                                        </Button>
                                    ))}
                            </Box>
                        ) : (
                            <CircularProgress />
                        )}
                        <Divider orientation="vertical" />
                        <Box display="flex" flexDirection="column" flex="1">
                            {tabValue && (
                                <Box display="flex" justifyContent="center">
                                    <Tabs
                                        value={tabValue}
                                        onChange={(e, val) => setTabValue(val)}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile>
                                        <Tab
                                            label="General"
                                            value="general"
                                            sx={{
                                                textTransform: 'none',
                                                '&.Mui-selected': {
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                        <Tab
                                            label="Style"
                                            value="style"
                                            sx={{
                                                textTransform: 'none',
                                                '&.Mui-selected': {
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                        <Tab
                                            label="SEO"
                                            value="seo"
                                            sx={{
                                                textTransform: 'none',
                                                '&.Mui-selected': {
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                        <Tab
                                            label="Custom"
                                            value="custom"
                                            sx={{
                                                textTransform: 'none',
                                                '&.Mui-selected': {
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                        <Tab
                                            label="Domain &#38; Publish"
                                            value="domain"
                                            sx={{
                                                textTransform: 'none',
                                                '&.Mui-selected': {
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                    </Tabs>
                                </Box>
                            )}
                            <Divider />
                            {tabValue === 'general' && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    padding="2em">
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mb: '.5em' }}>
                                        General Information
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={{ mb: '.5em' }}
                                        alignItems="center"
                                        spacing={1}>
                                        <Typography
                                            fontSize="10pt"
                                            sx={{ mr: '.5em' }}>
                                            Website ID:
                                        </Typography>
                                        <Chip
                                            label={website._id}
                                            size="small"
                                            sx={{ bgcolor: 'gray.200' }}
                                        />
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        sx={{ mb: '.5em' }}
                                        alignItems="center"
                                        spacing={1}>
                                        <Typography
                                            fontSize="10pt"
                                            sx={{ mr: '.5em' }}>
                                            Owner ID:
                                        </Typography>
                                        <Chip
                                            label={website.author}
                                            size="small"
                                            sx={{ bgcolor: 'gray.200' }}
                                        />
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        sx={{ mb: '.5em' }}
                                        alignItems="center"
                                        spacing={1}>
                                        <Typography
                                            fontSize="10pt"
                                            sx={{ mr: '.5em' }}>
                                            Status:
                                        </Typography>
                                        {website.isSubscribed ? (
                                            <Chip
                                                label="Subscribed"
                                                size="small"
                                                color="success"
                                                sx={{ mr: '.5em' }}
                                            />
                                        ) : (
                                            <Chip
                                                label="Not Subscribed"
                                                size="small"
                                                sx={{ mr: '.5em' }}
                                            />
                                        )}
                                        {website.isPublished ? (
                                            <Chip
                                                label="Published"
                                                size="small"
                                                color="success"
                                            />
                                        ) : (
                                            <Chip
                                                label="Not Published"
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        sx={{ mb: '.5em' }}
                                        alignItems="center"
                                        spacing={1}>
                                        <Typography
                                            fontSize="10pt"
                                            sx={{ mr: '.5em' }}>
                                            Connected Contract:
                                        </Typography>
                                        <Chip
                                            label={
                                                website.settings &&
                                                website.settings
                                                    .connectedContractAddress
                                            }
                                            size="small"
                                            sx={{ ml: '.5em' }}
                                        />
                                        <IconButton
                                            onClick={(e) =>
                                                setContractAnchor(
                                                    e.currentTarget
                                                )
                                            }>
                                            <EditIcon fontSize="5pt" />
                                        </IconButton>
                                        <ImportModal />
                                        <Menu
                                            anchorEl={contractAnchor}
                                            open={openContractAnchor}
                                            onClose={onCloseContractAnchor}>
                                            {/* <MenuItem disableRipple={true}>
                                                Choose Contract Address
                                            </MenuItem> */}
                                            {contracts &&
                                                contracts.map(
                                                    (contract, idx) => (
                                                        <MenuItem
                                                            key={idx}
                                                            onClick={() =>
                                                                onSwitchContract(
                                                                    contract
                                                                )
                                                            }>
                                                            <Stack
                                                                direction="row"
                                                                spacing={1}>
                                                                <NewspaperIcon fontSize="12pt" />
                                                                <Typography fontSize="10pt">
                                                                    {
                                                                        contract.address
                                                                    }
                                                                </Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                    )
                                                )
                                            }
                                            <Divider />
                                            <MenuItem onClick={openImportModal}>
                                                <Stack direction="row" spacing={1}>
                                                    <Typography>
                                                        Import Contract
                                                    </Typography>
                                                    <ImportExportIcon />
                                                </Stack>
                                            </MenuItem>
                                        </Menu>
                                    </Stack>
                                </Box>
                            )}
                            {tabValue === 'style' && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    padding="2em"
                                    alignItems="flex-start">
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mb: '.5em' }}>
                                        Style
                                    </Typography>
                                    <Box
                                        display="flex"
                                        sx={{ mb: '.5em' }}
                                        alignItems="center">
                                        <Typography
                                            fontSize="10pt"
                                            sx={{ mr: '.5em' }}>
                                            Favicon:
                                        </Typography>
                                        {faviconImage !==
                                            'https://dummyimage.com/25x25' && (
                                                <img
                                                    src={faviconImage}
                                                    alt="Favicon Image"
                                                    width={25}
                                                    height={25}
                                                />
                                            )}
                                    </Box>
                                    {faviconImage ===
                                        'https://dummyimage.com/25x25' ? (
                                        <Widget
                                            publicKey="dfeba611508a6f7760ca"
                                            onChange={(info) =>
                                                onChangeFavicon(info)
                                            }
                                        />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={onDeleteFavicon}
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteOutlineIcon />}>
                                            Delete Image
                                        </Button>
                                    )}
                                </Box>
                            )}
                            {tabValue === 'seo' && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    padding="2em"
                                    alignItems="flex-start">
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mb: '1em' }}>
                                        SEO
                                    </Typography>
                                    <Typography
                                        fontSize="14pt"
                                        sx={{ mb: '1em' }}>
                                        General
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            size="small"
                                            label="Title"
                                            variant="outlined"
                                            helperText="The title of your website. This will be displayed in your browser's tab."
                                            value={title}
                                            onChange={onTitleChange}
                                        />
                                        <TextField
                                            size="small"
                                            label="Preview Title"
                                            variant="outlined"
                                            helperText="The title that will be displayed when you paste the link of your website."
                                            value={previewTitle}
                                            onChange={onPreviewTitleChange}
                                        />
                                    </Stack>
                                    <TextField
                                        size="small"
                                        multiline
                                        fullWidth
                                        rows={5}
                                        label="Description"
                                        variant="outlined"
                                        helperText="A short description of your website."
                                        value={description}
                                        onChange={onDescriptionChange}
                                        sx={{ mt: '1em', mb: '.5em' }}
                                    />
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Keywords"
                                        variant="outlined"
                                        helperText="Keywords that describes your website. Seperate with comma."
                                        value={keywords}
                                        onChange={onKeywordsChange}
                                        sx={{ mb: '.5em' }}
                                    />
                                    <Stack direction="row" spacing={2}>
                                        <Autocomplete
                                            disablePortal
                                            options={[
                                                {
                                                    label: 'English',
                                                    data: 'EN',
                                                },
                                                {
                                                    label: 'English - UK',
                                                    data: 'EN-GB',
                                                },
                                                {
                                                    label: 'English - US',
                                                    data: 'EN-US',
                                                },
                                                {
                                                    label: 'Chinese',
                                                    data: 'ZH',
                                                },
                                                { label: 'Dutch', data: 'NL' },
                                                {
                                                    label: 'Finnish',
                                                    data: 'FI',
                                                },
                                                { label: 'French', data: 'FR' },
                                                { label: 'German', data: 'DE' },
                                                { label: 'Hebrew', data: 'IW' },
                                                { label: 'Hindi', data: 'HI' },
                                                {
                                                    label: 'Italian',
                                                    data: 'IT',
                                                },
                                                {
                                                    label: 'Japanese',
                                                    data: 'JA',
                                                },
                                                { label: 'Korean', data: 'KO' },
                                                {
                                                    label: 'Norwegian',
                                                    data: 'NO',
                                                },
                                                { label: 'Polish', data: 'PL' },
                                                {
                                                    label: 'Portuguese',
                                                    data: 'PT',
                                                },
                                                {
                                                    label: 'Romanian',
                                                    data: 'RO',
                                                },
                                                {
                                                    label: 'Russian',
                                                    data: 'RU',
                                                },
                                                {
                                                    label: 'Spanish',
                                                    data: 'ES',
                                                },
                                            ]}
                                            isOptionEqualToValue={(
                                                option,
                                                value
                                            ) => option.data === value.data}
                                            value={language}
                                            onChange={(e, v) =>
                                                onLanguageChange(e, v)
                                            }
                                            sx={{ width: 300 }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    label="Language"
                                                    helperText="What language your website is written in."
                                                />
                                            )}
                                        />
                                        <Autocomplete
                                            disablePortal
                                            options={[
                                                'index, follow',
                                                'noindex, follow',
                                                'index, nofollow',
                                                'noindex, nofollow',
                                            ]}
                                            sx={{ width: 300 }}
                                            value={robots}
                                            onChange={(e, v) =>
                                                onRobotsChange(e, v)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    label="Robots"
                                                    helperText="Allow search engines to index your site or follow links."
                                                />
                                            )}
                                        />
                                    </Stack>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Canonical URL"
                                        variant="outlined"
                                        helperText="The URL that represents the master copy of a page."
                                        value={url}
                                        onChange={onUrlChange}
                                        sx={{ mt: '.5em', mb: '.5em' }}
                                    />
                                    <Typography
                                        fontSize="12pt"
                                        sx={{ mt: '1em', mb: '.5em' }}>
                                        Image Display:
                                    </Typography>
                                    {displayImage ===
                                        'https://dummyimage.com/215x215' ? (
                                        <Widget
                                            publicKey="dfeba611508a6f7760ca"
                                            onChange={(info) =>
                                                onChangeDisplayImage(info)
                                            }
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src={displayImage}
                                                alt="Display Image"
                                                width={215}
                                                height={215}
                                            />
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={onDeleteDisplayImage}
                                                startIcon={
                                                    <DeleteOutlineIcon />
                                                }
                                                sx={{ mt: '1em' }}>
                                                Delete Image
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            )}
                            {tabValue === 'custom' && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    padding="2em"
                                    alignItems="flex-start">
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mb: '.5em' }}>
                                        Custom Code
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        width="100%">
                                        <Stack spacing={3}>
                                            <Stack spacing={1}>
                                                <Typography fontSize="10pt">
                                                    {'<head>'} custom HTML code:
                                                </Typography>
                                                <TextField
                                                    placeholder='<script src="https://www.googletagmanager.com/gtag/js?id=UA-XXX-X"></script>'
                                                    size="small"
                                                    rows={4}
                                                    multiline
                                                    value={customHead}
                                                    onChange={
                                                        onCustomHeadChange
                                                    }
                                                />
                                            </Stack>
                                            <Stack spacing={1}>
                                                <Typography fontSize="10pt">
                                                    {'</body>'} custom HTML
                                                    code:
                                                </Typography>
                                                <TextField
                                                    placeholder='<script src="https://www.googletagmanager.com/gtag/js?id=UA-XXX-X"></script>'
                                                    size="small"
                                                    rows={4}
                                                    multiline
                                                    value={customBody}
                                                    onChange={
                                                        onCustomBodyChange
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>
                            )}
                            {tabValue === 'domain' && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    padding="2em"
                                    alignItems="flex-start">
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mb: '.5em' }}>
                                        Custom Domains
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        width="100%">
                                        <Box
                                            display="flex"
                                            justifyContent={
                                                website.domains.length > 0
                                                    ? 'space-between'
                                                    : 'flex-end'
                                            }
                                            width="100%">
                                            {website.domains.length > 0 && (
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={
                                                                    website.isCustomDomainActive
                                                                }
                                                                onChange={
                                                                    onDomainState
                                                                }
                                                            />
                                                        }
                                                        label="Enable Custom Domain"
                                                    />
                                                </FormGroup>
                                            )}
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={handleAddDomain}>
                                                Add Domain
                                            </Button>
                                        </Box>
                                        <TableContainer
                                            component={Paper}
                                            sx={{ mt: '1em' }}>
                                            <Table
                                                sx={{ minWidth: 700 }}
                                                aria-label="Transaction List">
                                                <TableBody>
                                                    {website.domains.map(
                                                        (domain, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    <DomainIcon
                                                                        style={{
                                                                            color: 'rgb(130, 130, 130)',
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        domain.domain
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {domain.isActive ? (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={
                                                                                1
                                                                            }
                                                                            alignItems="center">
                                                                            <CheckIcon
                                                                                fontSize="14pt"
                                                                                style={{
                                                                                    color: 'green',
                                                                                }}
                                                                            />
                                                                            <Typography fontSize="10pt">
                                                                                Verified
                                                                            </Typography>
                                                                        </Stack>
                                                                    ) : (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={
                                                                                1
                                                                            }
                                                                            alignItems="center">
                                                                            <WarningIcon
                                                                                fontSize="14pt"
                                                                                style={{
                                                                                    color: 'yellow',
                                                                                }}
                                                                            />
                                                                            <Typography fontSize="10pt">
                                                                                Issue
                                                                            </Typography>
                                                                        </Stack>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {website.customDomain ===
                                                                        domain.domain ? (
                                                                        <Button
                                                                            variant="contained"
                                                                            startIcon={
                                                                                <HomeIcon
                                                                                    style={{
                                                                                        color: 'white',
                                                                                    }}
                                                                                />
                                                                            }
                                                                            sx={{
                                                                                backgroundColor:
                                                                                    'rgb(67,75,84)',
                                                                                color: 'white',
                                                                                '&:hover':
                                                                                {
                                                                                    backgroundColor:
                                                                                        'rgb(67,75,84)',
                                                                                },
                                                                            }}
                                                                            size="small">
                                                                            Default
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="contained"
                                                                            startIcon={
                                                                                <HomeIcon />
                                                                            }
                                                                            sx={{
                                                                                backgroundColor:
                                                                                    'rgb(234,234,234)',
                                                                                color: 'rgb(163,163,163)',
                                                                                '&:hover':
                                                                                {
                                                                                    backgroundColor:
                                                                                        'rgb(234,234,234)',
                                                                                },
                                                                            }}
                                                                            size="small"
                                                                            onClick={() =>
                                                                                onMakeDefault(
                                                                                    domain.domain
                                                                                )
                                                                            }>
                                                                            Make
                                                                            Default
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                                {website.customDomain === domain.domain && domain.isActive && !domain.isCustomDomainSslGenerated && <TableCell>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        size="small"
                                                                        onClick={() => onGenerateSSlCertificate(domain.domain)}>
                                                                        GENERATE SSL
                                                                    </Button>
                                                                </TableCell>}

                                                                <TableCell>
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            onVerifyDomain(
                                                                                domain.domain
                                                                            )
                                                                        }>
                                                                        <ReplayIcon />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            onDeleteDomain(
                                                                                domain.domain
                                                                            )
                                                                        }>
                                                                        <DeleteOutlineIcon color="error" />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <Typography
                                        fontSize="18pt"
                                        fontWeight="700"
                                        sx={{ mt: '2em', mb: '.5em' }}>
                                        Publish Pages
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        width="100%">
                                        <FormGroup>
                                            {website.pages.map((page, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    control={
                                                        <Switch
                                                            checked={
                                                                website.published.findIndex(
                                                                    (p) =>
                                                                        p.name ===
                                                                        page.name
                                                                ) === -1
                                                                    ? false
                                                                    : true
                                                            }
                                                            onChange={() =>
                                                                onPublishPage(
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={page.name}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                </Box>
                            )}
                            <Box
                                display="flex"
                                padding="2em"
                                justifyContent="flex-end">
                                {tabValue === 'general' && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={onDeleteDialog}
                                        size="small"
                                        startIcon={<DeleteOutlineIcon />}>
                                        Delete Website
                                    </Button>
                                )}
                                {tabValue === 'style' && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            onSaveFavicon();
                                        }}
                                        size="small"
                                        startIcon={<SaveIcon />}
                                        disabled={!styleSaveStatus}>
                                        Save Changes
                                    </Button>
                                )}
                                {tabValue === 'seo' && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            onSaveSEO({
                                                title,
                                                previewTitle,
                                                description,
                                                keywords,
                                                language,
                                                robots,
                                                url,
                                                image: displayImage,
                                            });
                                        }}
                                        size="small"
                                        startIcon={<SaveIcon />}
                                        disabled={!seoSaveStatus}>
                                        Save Changes
                                    </Button>
                                )}
                                {tabValue === 'custom' && (
                                    <Button
                                        variant="contained"
                                        onClick={onSaveCustom}
                                        size="small"
                                        startIcon={<SaveIcon />}
                                        disabled={!customSaveStatus}>
                                        Save Changes
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )
            }
        </Box >
    );
};

export default Settings;
